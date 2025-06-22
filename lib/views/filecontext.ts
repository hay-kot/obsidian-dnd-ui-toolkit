import { Frontmatter } from "lib/types";
import * as Fm from "lib/domains/frontmatter";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { msgbus } from "lib/services/event-bus";

/**
 * useFileContext provides a way to access the frontmatter within a file. It also provides
 * a way to subscribe to changes in the frontmatter.
 * */
export function useFileContext(app: App, ctx: MarkdownPostProcessorContext) {
  function frontmatter(): Frontmatter {
    const fm = app.metadataCache.getCache(ctx.sourcePath)?.frontmatter;
    return Fm.anyIntoFrontMatter(fm || {});
  }

  function onFrontmatterChange(cb: (v: Frontmatter) => void): () => void {
    return msgbus.subscribe(ctx.sourcePath, "fm:changed", cb);
  }

  function onAbilitiesChange(cb: () => void) {
    return msgbus.subscribe(ctx.sourcePath, "abilities:changed", cb);
  }

  function md() {
    return ctx;
  }

  return {
    filepath: ctx.sourcePath,
    frontmatter,
    onFrontmatterChange,
    onAbilitiesChange,
    md: md,
  };
}

export type FileContext = ReturnType<typeof useFileContext>;
