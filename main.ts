import { App, Plugin, PluginSettingTab } from 'obsidian';
import { StatsView } from 'lib/views/StatsView';
import { AbilityScoreView } from 'lib/views/AbilityScoreView';
import { BaseView } from 'lib/views/BaseView';
import { SkillsView } from 'lib/views/SkillsView';
import { HealthView } from 'lib/views/HealthView';
import { ConsumableView } from 'lib/views/ConsumableView';
import { BadgesView } from 'lib/views/BadgesView';
import { InitiativeView } from 'lib/views/InitiativeView';
import { KeyValueStore } from 'lib/kv';

interface DndUIToolkitSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DndUIToolkitSettings = {
	mySetting: 'default'
}

export default class DndUIToolkitPlugin extends Plugin {
	settings: DndUIToolkitSettings;

	async onload() {
		await this.loadSettings();

		const kv = new KeyValueStore(this);

		// In your plugin's onload method
		const views: BaseView[] = [
			new StatsView(),
			new AbilityScoreView(),
			new SkillsView(),
			new HealthView(kv),
			new ConsumableView(kv),
			new BadgesView(),
			new InitiativeView(kv),
		];

		for (const view of views) {
			// Use an arrow function to preserve the 'this' context
			this.registerMarkdownCodeBlockProcessor(
				view.codeblock,
				(source, el, ctx) => {
					view.register(source, el, ctx);
				}
			);
		}


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DndSettingsTab(this.app, this));
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
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
	}
}
