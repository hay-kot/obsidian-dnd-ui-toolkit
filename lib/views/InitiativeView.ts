import { ref } from "vue";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import Initiative from "lib/components/Initiative.vue";
import * as InitiativeService from "lib/domains/initiative";
import type { InitiativeState } from "lib/domains/initiative";
import { KeyValueStore } from "lib/services/kv/kv";
import { InitiativeBlock } from "lib/types";
import { VueMarkdown } from "./VueMarkdown";

export class InitiativeView extends BaseView {
  public codeblock = "initiative";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const initiativeMarkdown = new InitiativeMarkdown(el, source, this.kv);
    ctx.addChild(initiativeMarkdown);
  }
}

class InitiativeMarkdown extends VueMarkdown {
  private source: string;
  private kv: KeyValueStore;
  private propsRef = ref<Record<string, unknown>>({});
  private mounted = false;

  constructor(el: HTMLElement, source: string, kv: KeyValueStore) {
    super(el);
    this.source = source;
    this.kv = kv;
  }

  async onload() {
    const initiativeBlock = InitiativeService.parseInitiativeBlock(this.source);

    const stateKey = initiativeBlock.state_key;
    if (!stateKey) {
      throw new Error("Initiative block must contain a 'state_key' property.");
    }

    const defaultState = InitiativeService.getDefaultInitiativeState(initiativeBlock);

    try {
      const savedState = await this.kv.get<InitiativeState>(stateKey);
      const initiativeState = savedState
        ? InitiativeService.mergeInitiativeState(initiativeBlock, savedState)
        : defaultState;

      if (!savedState) {
        try {
          await this.kv.set(stateKey, defaultState);
        } catch (error) {
          console.error("Error saving initial initiative state:", error);
        }
      }

      this.renderComponent(initiativeBlock, initiativeState);
    } catch (error) {
      console.error("Error loading initiative state:", error);
      this.renderComponent(initiativeBlock, defaultState);
    }
  }

  private renderComponent(block: InitiativeBlock, state: InitiativeState) {
    const stateKey = block.state_key;
    if (!stateKey) return;

    const newProps = {
      static: block,
      state: state,
      "onUpdate:state": (newState: InitiativeState) => {
        this.handleStateChange(block, newState);
        this.renderComponent(block, newState);
      },
    };

    if (!this.mounted) {
      this.propsRef.value = newProps;
      this.mountReactive(Initiative, this.propsRef);
      this.mounted = true;
    } else {
      this.propsRef.value = newProps;
    }
  }

  private async handleStateChange(initiativeBlock: InitiativeBlock, newState: InitiativeState) {
    const stateKey = initiativeBlock.state_key;
    if (!stateKey) return;

    try {
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving initiative state for ${stateKey}:`, error);
    }
  }
}
