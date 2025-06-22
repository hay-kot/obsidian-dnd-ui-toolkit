import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { AbilityScoreView } from "lib/views/AbilityScoreView";
import { BaseView } from "lib/views/BaseView";
import { SkillsView } from "lib/views/SkillsView";
import { HealthView } from "lib/views/HealthView";
import { ConsumableView } from "lib/views/ConsumableView";
import { BadgesView, StatsView } from "lib/views/BadgesView";
import { InitiativeView } from "lib/views/InitiativeView";
import { SpellComponentsView } from "lib/views/SpellComponentsView";
import { EventButtonsView } from "lib/views/EventButtonsView";
import { KeyValueStore } from "lib/services/kv/kv";
import { JsonDataStore } from "./lib/services/kv/local-file-store";
import { DEFAULT_SETTINGS, DndUIToolkitSettings } from "settings";
import { THEMES } from "lib/themes";
import { msgbus } from "lib/services/event-bus";
import * as Fm from "lib/domains/frontmatter";

export default class DndUIToolkitPlugin extends Plugin {
  settings: DndUIToolkitSettings;
  dataStore: JsonDataStore;

  applyColorSettings(): void {
    const apply = (root: HTMLElement) => {
      Object.entries(this.settings).forEach(([key, value]) => {
        if (key.startsWith("color")) {
          const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
          root.style.setProperty(cssVarName, value as string);
        }
      });
    };

    // Apply to main document
    const root = document.documentElement;
    if (root) {
      apply(root);
    }

    // Apply to all open windows
    this.app.workspace.iterateAllLeaves((leaf) => {
      const windowDoc = leaf.view.containerEl.ownerDocument;
      if (windowDoc) {
        apply(windowDoc.documentElement);
      }
    });
  }

  async onload() {
    await this.loadSettings();

    // Apply color settings on load
    this.applyColorSettings();

    // Listen for new windows and apply settings to them
    this.registerEvent(
      this.app.workspace.on("window-open", () => {
        // Use setTimeout to ensure the window is fully initialized
        setTimeout(() => this.applyColorSettings(), 100);
      })
    );

    // Initialize the JsonDataStore with the configured path
    this.initDataStore();

    // Setup Listener for frontmatter changes
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        const filefm = this.app.metadataCache.getCache(file.path)?.frontmatter;
        const fm = Fm.anyIntoFrontMatter(filefm || {});

        msgbus.publish(file.path, "fm:changed", fm);
      })
    );

    const kv = new KeyValueStore(this.dataStore);
    const { app } = this;

    // In your plugin's onload method
    const views: BaseView[] = [
      // Static
      new StatsView(app),
      new AbilityScoreView(app),
      new SkillsView(app),
      new BadgesView(app),
      new SpellComponentsView(app),
      new EventButtonsView(app),

      // Dynamic/Stateful
      new HealthView(app, kv),
      new ConsumableView(app, kv),
      new InitiativeView(app, kv),
    ];

    for (const view of views) {
      // Use an arrow function to preserve the 'this' context
      this.registerMarkdownCodeBlockProcessor(view.codeblock, (source, el, ctx) => {
        view.register(source, el, ctx);
      });
    }

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new DndSettingsTab(this.app, this));
  }

  /**
   * Initialize or reinitialize the data store with the current path setting
   */
  initDataStore() {
    // Initialize with the vault adapter and the configured path
    this.dataStore = new JsonDataStore(this.app.vault, this.settings.statePath);
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Reinitialize data store with the new path
    this.initDataStore();
  }
}

class DndSettingsTab extends PluginSettingTab {
  plugin: DndUIToolkitPlugin;

  constructor(app: App, plugin: DndUIToolkitPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "DnD UI Toolkit Settings" });

    // State File Path Setting
    new Setting(containerEl)
      .setName("State File Path")
      .setDesc(
        "Relative path (from vault root) where the state file will be stored. The statefile contains all the stateful data for components that are interactive and need to be saved. This is a JSON file."
      )
      .addText((text) =>
        text
          .setPlaceholder(".dnd-ui-toolkit-state.json")
          .setValue(this.plugin.settings.statePath)
          .onChange(async (value) => {
            this.plugin.settings.statePath = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "Styles" });

    // Theme selector
    new Setting(containerEl)
      .setName("Theme Preset")
      .setDesc("Choose a predefined color theme. Selecting a theme will update all color values.")
      .addDropdown((dropdown) => {
        Object.entries(THEMES).forEach(([key, theme]) => {
          dropdown.addOption(key, theme.name);
        });
        dropdown.setValue(this.plugin.settings.selectedTheme).onChange(async (value) => {
          this.plugin.settings.selectedTheme = value;
          const theme = THEMES[value];
          if (theme) {
            Object.assign(this.plugin.settings, theme.colors);
            await this.plugin.saveSettings();
            this.plugin.applyColorSettings();
            this.display(); // Refresh the settings display
          }
        });
      });

    // Add color inputs for each color variable
    this.addColorSetting(containerEl, "Background Primary", "colorBgPrimary");
    this.addColorSetting(containerEl, "Background Secondary", "colorBgSecondary");
    this.addColorSetting(containerEl, "Background Tertiary", "colorBgTertiary");
    this.addColorSetting(containerEl, "Background Hover", "colorBgHover");
    this.addColorSetting(containerEl, "Background Darker", "colorBgDarker");
    this.addColorSetting(containerEl, "Background Group", "colorBgGroup");
    this.addColorSetting(containerEl, "Background Proficient", "colorBgProficient");

    this.addColorSetting(containerEl, "Text Primary", "colorTextPrimary");
    this.addColorSetting(containerEl, "Text Secondary", "colorTextSecondary");
    this.addColorSetting(containerEl, "Text Sublabel", "colorTextSublabel");
    this.addColorSetting(containerEl, "Text Bright", "colorTextBright");
    this.addColorSetting(containerEl, "Text Muted", "colorTextMuted");
    this.addColorSetting(containerEl, "Text Group", "colorTextGroup");

    this.addColorSetting(containerEl, "Border Primary", "colorBorderPrimary");
    this.addColorSetting(containerEl, "Border Active", "colorBorderActive");
    this.addColorSetting(containerEl, "Border Focus", "colorBorderFocus");

    this.addColorSetting(containerEl, "Accent Teal", "colorAccentTeal");
    this.addColorSetting(containerEl, "Accent Red", "colorAccentRed");
    this.addColorSetting(containerEl, "Accent Purple", "colorAccentPurple");

    new Setting(containerEl).setName("Reset Styles").addButton((b) => {
      b.setButtonText("Reset").onClick(async () => {
        this.plugin.settings.selectedTheme = "default";
        const defaultTheme = THEMES.default;
        Object.assign(this.plugin.settings, defaultTheme.colors);
        await this.plugin.saveSettings();
        this.plugin.applyColorSettings();
        this.display();
      });
    });
  }

  // Helper method to add color picker setting
  private addColorSetting(containerEl: HTMLElement, name: string, settingKey: keyof DndUIToolkitSettings): void {
    new Setting(containerEl).setName(name).addColorPicker((colorPicker) =>
      colorPicker.setValue(this.plugin.settings[settingKey] as string).onChange(async (value) => {
        this.plugin.settings[settingKey] = value;
        await this.plugin.saveSettings();
        this.plugin.applyColorSettings();
      })
    );
  }
}
