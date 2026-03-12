import { BaseView } from "./BaseView";
import AbilityCards from "../components/AbilityCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import { hasTemplateVariables, processTemplate } from "../utils/template";
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

    const templateContext = this.detectTemplates(
      items.flatMap((item: any) => [
        String(item.label || ""),
        String(item.label_short || ""),
        String(item.header_value || ""),
        String(item.value || ""),
        String(item.sublabel || ""),
      ])
    );

    const abilities = items.map((item: any) => {
      let label = String(item.label || "");
      let labelShort = String(item.label_short || "");
      let headerValue = String(item.header_value || "0");
      let value = String(item.value || "");
      let sublabel = String(item.sublabel || "");

      if (templateContext) {
        if (hasTemplateVariables(label)) label = processTemplate(label, templateContext);
        if (hasTemplateVariables(labelShort)) labelShort = processTemplate(labelShort, templateContext);
        if (hasTemplateVariables(headerValue)) headerValue = processTemplate(headerValue, templateContext);
        if (hasTemplateVariables(value)) value = processTemplate(value, templateContext);
        if (hasTemplateVariables(sublabel)) sublabel = processTemplate(sublabel, templateContext);
      }

      return {
        label,
        labelShort,
        total: Number(headerValue) || 0,
        modifier: value,
        isProficient: false,
        savingThrow: sublabel,
      };
    });

    this.mount(AbilityCards, { abilities, showSavingPrefix: false });
  }
}
