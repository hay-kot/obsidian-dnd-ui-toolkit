import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { StatsView } from 'lib/views/StatsView';
import { AbilityScoreView } from 'lib/views/AbilityScoreView';
import { BaseView } from 'lib/views/BaseView';
import { SkillsView } from 'lib/views/SkillsView';
import { HealthView } from 'lib/views/HealthView';
import { ConsumableView } from 'lib/views/ConsumableView';
import { BadgesView } from 'lib/views/BadgesView';
import { InitiativeView } from 'lib/views/InitiativeView';
import { KeyValueStore } from "lib/services/kv/kv";
import { JsonDataStore } from './lib/services/kv/local-file-store';

interface DndUIToolkitSettings {
	statePath: string;
}

const DEFAULT_SETTINGS: DndUIToolkitSettings = {
	statePath: '.dnd-ui-toolkit-state.json'
}

export default class DndUIToolkitPlugin extends Plugin {
	settings: DndUIToolkitSettings;
	dataStore: JsonDataStore;

	async onload() {
		await this.loadSettings();

		// Initialize the JsonDataStore with the configured path
		this.initDataStore();

		const kv = new KeyValueStore(this.dataStore);
		const { app } = this;

		// In your plugin's onload method
		const views: BaseView[] = [
			// Static
			new StatsView(app),
			new AbilityScoreView(app),
			new SkillsView(app),
			new BadgesView(app),

			// Dynamic/Stateful
			new HealthView(app, kv),
			new ConsumableView(app, kv),
			new InitiativeView(app, kv),
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

	/**
	 * Initialize or reinitialize the data store with the current path setting
	 */
	initDataStore() {
		// Initialize with the vault adapter and the configured path
		this.dataStore = new JsonDataStore(this.app.vault, this.settings.statePath);
	}

	onunload() { }

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

		containerEl.createEl('h2', { text: 'DnD UI Toolkit Settings' });

		new Setting(containerEl)
			.setName('State File Path')
			.setDesc('Relative path (from vault root) where the state file will be stored. The statefile contains all the stateful data for components that are interative and need to be saved. This is a JSON file.')
			.addText(text => text
				.setPlaceholder('.dnd-ui-toolkit-state.json')
				.setValue(this.plugin.settings.statePath)
				.onChange(async (value) => {
					this.plugin.settings.statePath = value;
					await this.plugin.saveSettings();
				}));
	}
}
