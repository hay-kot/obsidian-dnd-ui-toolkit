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

class RawAbilityComponent extends TemplateAwareComponent {
  protected processAndRender() {
    const parsed = this.parseSource();
    const items = Array.isArray(parsed?.items) ? parsed.items : [];

    const sources = items.map((item: any) => ({
      label: String(item.label ?? ""),
      labelShort: String(item.label_short ?? ""),
      headerValue: String(item.header_value ?? ""),
      value: String(item.value ?? ""),
      sublabel: String(item.sublabel ?? ""),
    }));

    const templateContext = this.setupTemplates(sources.flatMap((s: { [k: string]: string }) => Object.values(s)));

    const abilities = sources.map((s: { [k: string]: string }) => {
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
