import { BaseView } from "./BaseView";
import AbilityCards from "../components/AbilityCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import { coerceNumericTemplate, processTemplate } from "../utils/template";
import { TemplateAwareComponent } from "./TemplateAwareComponent";

export class RawAbilityView extends BaseView {
  public codeblock = "ability-cards";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const cmp = new RawAbilityComponent(el, source, this.app, ctx);
    ctx.addChild(cmp);
  }
}

// YAML scalars, not yet coerced — a user may write any of these as a number.
type RawAbilityCardItem = {
  label?: string | number;
  label_short?: string | number;
  header_value?: string | number;
  value?: string | number;
  sublabel?: string | number;
};

class RawAbilityComponent extends TemplateAwareComponent {
  protected processAndRender() {
    const parsed = this.parseSource<{ items: RawAbilityCardItem[] }>();
    const items = Array.isArray(parsed.items) ? parsed.items : [];

    const sources = items.map((item) => ({
      label: String(item.label ?? ""),
      labelShort: String(item.label_short ?? ""),
      headerValue: String(item.header_value ?? ""),
      value: String(item.value ?? ""),
      sublabel: String(item.sublabel ?? ""),
    }));

    const templateContext = this.setupTemplates(sources.flatMap((s) => Object.values(s)));

    const abilities = sources.map((s) => {
      const label = templateContext ? processTemplate(s.label, templateContext) : s.label;
      const labelShort = templateContext ? processTemplate(s.labelShort, templateContext) : s.labelShort;
      const headerValue = templateContext ? processTemplate(s.headerValue, templateContext) : s.headerValue;
      const value = templateContext ? processTemplate(s.value, templateContext) : s.value;
      const sublabel = templateContext ? processTemplate(s.sublabel, templateContext) : s.sublabel;

      return {
        label,
        labelShort,
        total: coerceNumericTemplate(headerValue, s.headerValue),
        modifier: value,
        isProficient: false,
        savingThrow: sublabel,
      };
    });

    this.mount(AbilityCards, { abilities, showSavingPrefix: false });
  }
}
