import { ref } from "vue";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as ConsumableService from "lib/domains/consumables";
import MultiConsumableCheckboxes from "lib/components/MultiConsumableCheckboxes.vue";
import { KeyValueStore } from "lib/services/kv/kv";
import { ConsumableState } from "lib/domains/consumables";
import { msgbus } from "lib/services/event-bus";
import { shouldResetOnEvent, getResetAmount } from "lib/domains/events";
import { ParsedConsumableBlock } from "lib/types";
import { VueMarkdown } from "./VueMarkdown";

export class ConsumableView extends BaseView {
  public codeblock = "consumable";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const consumableMarkdown = new ConsumableMarkdown(el, source, this.kv, ctx.sourcePath);
    ctx.addChild(consumableMarkdown);
  }
}

class ConsumableMarkdown extends VueMarkdown {
  private source: string;
  private kv: KeyValueStore;
  private filePath: string;
  private propsRef = ref<Record<string, unknown>>({});
  private mounted = false;
  private consumables: ParsedConsumableBlock[] = [];
  private states: Record<string, ConsumableState> = {};

  constructor(el: HTMLElement, source: string, kv: KeyValueStore, filePath: string) {
    super(el);
    this.source = source;
    this.kv = kv;
    this.filePath = filePath;
  }

  async onload() {
    const consumablesBlock = ConsumableService.parseConsumablesBlock(this.source);
    this.consumables = consumablesBlock.items;

    // Calculate label width
    let maxLabelLength = 0;
    this.consumables.forEach((item) => {
      if (item.label && item.label.length > maxLabelLength) {
        maxLabelLength = item.label.length;
      }
    });
    const labelWidthEm = Math.max(3, maxLabelLength * 0.55);
    this.containerEl.style.setProperty("--consumable-label-width", `${labelWidthEm}em`);

    // Load states for all consumables
    await Promise.all(
      this.consumables.map(async (consumableBlock, index) => {
        const stateKey = consumableBlock.state_key;
        if (!stateKey) {
          throw new Error(`Consumable item at index ${index} must contain a 'state_key' property.`);
        }

        const defaultState = ConsumableService.getDefaultConsumableState(consumableBlock);

        try {
          const savedState = await this.kv.get<ConsumableState>(stateKey);
          this.states[stateKey] = savedState || defaultState;

          if (!savedState) {
            try {
              await this.kv.set(stateKey, defaultState);
            } catch (error) {
              console.error(`Error saving initial consumable state for ${stateKey}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error loading consumable state for ${stateKey}:`, error);
          this.states[stateKey] = defaultState;
        }

        // Setup reset subscription
        if (consumableBlock.reset_on) {
          this.addUnloadFn(
            msgbus.subscribe(this.filePath, "reset", (resetEvent) => {
              if (shouldResetOnEvent(consumableBlock.reset_on, resetEvent.eventType)) {
                console.debug(`Resetting consumable ${stateKey} due to ${resetEvent.eventType} event`);
                const resetAmount = getResetAmount(consumableBlock.reset_on, resetEvent.eventType) || resetEvent.amount;
                this.handleResetEvent(consumableBlock, resetAmount);
              }
            })
          );
        }
      })
    );

    this.renderAll();
  }

  private renderAll() {
    const newProps = {
      consumables: this.consumables,
      states: { ...this.states },
      "onUpdate:stateChange": (stateKey: string, newState: ConsumableState) => {
        this.states[stateKey] = newState;
        this.kv.set(stateKey, newState);
        this.renderAll();
      },
    };

    if (!this.mounted) {
      this.propsRef.value = newProps;
      this.mountReactive(MultiConsumableCheckboxes, this.propsRef);
      this.mounted = true;
    } else {
      this.propsRef.value = newProps;
    }
  }

  private async handleResetEvent(consumableBlock: ParsedConsumableBlock, amount?: number) {
    const stateKey = consumableBlock.state_key;
    if (!stateKey) return;

    try {
      const currentState = await this.kv.get<ConsumableState>(stateKey);
      const currentValue = currentState?.value || 0;

      const resetState: ConsumableState = {
        value: amount !== undefined ? Math.max(0, currentValue - amount) : 0,
      };

      await this.kv.set(stateKey, resetState);
      this.states[stateKey] = resetState;
      this.renderAll();
    } catch (error) {
      console.error(`Error resetting consumable state for ${stateKey}:`, error);
    }
  }
}
