import "lib/styles/index.css";
import { App, Platform, Plugin, PluginSettingTab, Setting } from "obsidian";
import { AbilityScoreView } from "lib/views/AbilityScoreView";
import { BaseView } from "lib/views/BaseView";
import { SkillsView } from "lib/views/SkillsView";
import { HealthView } from "lib/views/HealthView";
import { ConsumableView } from "lib/views/ConsumableView";
import { BadgesView, StatsView } from "lib/views/BadgesView";
import { InitiativeView } from "lib/views/InitiativeView";
import { SpellComponentsView } from "lib/views/SpellComponentsView";
import { EventButtonsView } from "lib/views/EventButtonsView";
import { RawAbilityView } from "lib/views/RawAbilityView";
import { RawSkillsView } from "lib/views/RawSkillsView";
import { KeyValueStore } from "lib/services/kv/kv";
import { JsonDataStore } from "./lib/services/kv/local-file-store";
import { DEFAULT_SETTINGS, DndUIToolkitSettings } from "settings";
import { THEMES } from "lib/themes";
import { msgbus } from "lib/services/event-bus";
import * as Fm from "lib/domains/frontmatter";

export default class DndUIToolkitPlugin extends Plugin {
  settings: DndUIToolkitSettings;
  dataStore: JsonDataStore;

  private colorCssVars(): [string, string][] {
    return Object.entries(this.settings)
      .filter(([key]) => key.startsWith("color"))
      .map(([key, value]) => [`--dnd-ui-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value as string]);
  }

  private applyColorVars(root: HTMLElement): void {
    for (const [name, value] of this.colorCssVars()) {
      root.style.setProperty(name, value);
    }
  }

  private removeColorVars(root: HTMLElement): void {
    for (const [name] of this.colorCssVars()) {
      root.style.removeProperty(name);
    }
  }

  private eachStyleRoot(fn: (root: HTMLElement) => void): void {
    fn(document.documentElement);

    // Include popout windows (desktop only - multi-window not available on mobile)
    if (Platform.isDesktop) {
      this.app.workspace.iterateAllLeaves((leaf) => {
        const windowDoc = leaf.view.containerEl.ownerDocument;
        if (windowDoc) {
          fn(windowDoc.documentElement);
        }
      });
    }
  }

  applyColorSettings(): void {
    this.eachStyleRoot((root) => this.applyColorVars(root));
  }

  removeColorSettings(): void {
    this.eachStyleRoot((root) => this.removeColorVars(root));
  }

  async onload() {
    await this.loadSettings();

    // Apply color settings on load
    this.applyColorSettings();

    // Listen for new windows and apply settings to them (desktop only)
    if (Platform.isDesktop) {
      this.registerEvent(
        this.app.workspace.on("window-open", (win) => {
          this.applyColorVars(win.doc.documentElement);
        })
      );
    }

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

    const views: BaseView[] = [
      // Static
      new StatsView(app),
      new AbilityScoreView(app),
      new SkillsView(app),
      new BadgesView(app),
      new SpellComponentsView(app),
      new EventButtonsView(app),
      new RawAbilityView(app),
      new RawSkillsView(app),

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

  onunload() {
    this.removeColorSettings();
  }

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

    new Setting(containerEl)
      .setName("State file path")
      .setDesc(
        "Relative path (from vault root) where the state file is stored. Interactive components save their state to this JSON file."
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

    new Setting(containerEl).setName("Styles").setHeading();

    // Theme selector
    new Setting(containerEl)
      .setName("Theme preset")
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
    this.addColorSetting(containerEl, "Background primary", "colorBgPrimary");
    this.addColorSetting(containerEl, "Background secondary", "colorBgSecondary");
    this.addColorSetting(containerEl, "Background tertiary", "colorBgTertiary");
    this.addColorSetting(containerEl, "Background hover", "colorBgHover");
    this.addColorSetting(containerEl, "Background darker", "colorBgDarker");
    this.addColorSetting(containerEl, "Background group", "colorBgGroup");
    this.addColorSetting(containerEl, "Background proficient", "colorBgProficient");

    this.addColorSetting(containerEl, "Text primary", "colorTextPrimary");
    this.addColorSetting(containerEl, "Text secondary", "colorTextSecondary");
    this.addColorSetting(containerEl, "Text sublabel", "colorTextSublabel");
    this.addColorSetting(containerEl, "Text bright", "colorTextBright");
    this.addColorSetting(containerEl, "Text muted", "colorTextMuted");
    this.addColorSetting(containerEl, "Text group", "colorTextGroup");

    this.addColorSetting(containerEl, "Border primary", "colorBorderPrimary");
    this.addColorSetting(containerEl, "Border active", "colorBorderActive");
    this.addColorSetting(containerEl, "Border focus", "colorBorderFocus");

    this.addColorSetting(containerEl, "Accent teal", "colorAccentTeal");
    this.addColorSetting(containerEl, "Accent red", "colorAccentRed");
    this.addColorSetting(containerEl, "Accent purple", "colorAccentPurple");

    new Setting(containerEl).setName("Reset styles").addButton((b) => {
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
