import { ref } from "vue";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import type { PurposeGoalsBlock } from "lib/types";
import { KeyValueStore } from "lib/services/kv/kv";
import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import PurposeGoalsCard from "lib/components/PurposeGoalsCard.vue";

type PurposeGoalsState = {
  goals: number[];
};

function parseBlock(source: string): PurposeGoalsBlock {
  const parsed = (parse(source) as Record<string, unknown> | null) || {};
  const goalsRaw = Array.isArray(parsed.goals) ? parsed.goals : [];
  const goals = goalsRaw.map((x) => String(x ?? "").trim()).filter(Boolean);
  return {
    state_key: String(parsed.state_key || "").trim(),
    purpose: parsed.purpose != null ? String(parsed.purpose) : "",
    obstacle: parsed.obstacle != null ? String(parsed.obstacle) : "",
    goals,
  };
}

function normalizeState(state: PurposeGoalsState | undefined, goalsCount: number): PurposeGoalsState {
  const values = Array.isArray(state?.goals) ? state!.goals : [];
  const goals = Array.from({ length: goalsCount }, (_, i) => {
    const n = Number(values[i] ?? 0);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(3, Math.floor(n)));
  });
  return { goals };
}

class PurposeGoalsMarkdown extends VueMarkdown {
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
    const block = parseBlock(this.source);
    if (!block.state_key) {
      throw new Error("purpose-goals block must contain a 'state_key' property.");
    }
    const saved = await this.kv.get<PurposeGoalsState>(block.state_key);
    const initial = normalizeState(saved, block.goals?.length || 0);
    if (!saved) {
      await this.kv.set(block.state_key, initial);
    }
    this.renderComponent(block, initial);
  }

  private renderComponent(block: PurposeGoalsBlock, state: PurposeGoalsState) {
    const props = {
      static: block,
      state,
      "onUpdate:state": async (next: PurposeGoalsState) => {
        const normalized = normalizeState(next, block.goals?.length || 0);
        await this.kv.set(block.state_key, normalized);
        this.renderComponent(block, normalized);
      },
    };
    if (!this.mounted) {
      this.propsRef.value = props;
      this.mountReactive(PurposeGoalsCard, this.propsRef);
      this.mounted = true;
    } else {
      this.propsRef.value = props;
    }
  }
}

export class PurposeGoalsView extends BaseView {
  public codeblock = "purpose-goals";
  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const child = new PurposeGoalsMarkdown(el, source, this.kv);
    ctx.addChild(child);
  }
}
