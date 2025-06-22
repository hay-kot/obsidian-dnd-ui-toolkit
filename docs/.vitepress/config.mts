import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
	defineConfig({
		title: "Obsidian DnD UI Toolkit",
		description: "Modern UI elements for playing Dungeons and Dragons in Obsidian",
		base: "/obsidian-dnd-ui-toolkit/",
		themeConfig: {
			// https://vitepress.dev/reference/default-theme-config
			search: {
				provider: "local",
			},
			nav: [
				{ text: "Home", link: "/" },
				{ text: "Docs", link: "/quick-start" },
			],

			sidebar: [
				{
					text: "Getting Started",
					items: [
						{ text: "Quick Start", link: "/quick-start" },
						{ text: "Installation", link: "/installation" },
					],
				},
				{
					text: "General Components",
					items: [
						{ text: "Badges", link: "/components/badges" },
						{ text: "Consumables", link: "/components/consumables" },
						{ text: "Spell Components", link: "/components/spell-components" },
						{ text: "Stats", link: "/components/stats" },
					],
				},
				{
					text: "Character Sheet",
					items: [
						{ text: "Frontmatter", link: "/character-sheet/frontmatter" },
						{ text: "Ability Scores", link: "/components/ability-scores" },
						{ text: "Skills", link: "/components/skills" },
						{ text: "Health Points", link: "/components/healthpoints" },
						{ text: "Event Buttons", link: "/components/event-buttons" },
					],
				},
				{
					text: "Dungeon Master",
					items: [{ text: "Initiative Tracker", link: "/components/initiative-tracker" }],
				},
				{
					text: "Concepts",
					items: [
						{ text: "State Storage", link: "/concepts/state-storage" },
						{ text: "Event Systems", link: "/concepts/event-systems" },
						{ text: "Dynamic Content", link: "/concepts/dynamic-content" },
					],
				},
				{
					text: "Examples",
					items: [{ text: "Wizard Character", link: "/examples/wizard" }],
				},
			],

			socialLinks: [{ icon: "github", link: "https://github.com/hay-kot/obsidian-dnd-ui-toolkit" }],
		},
		vite: {
			optimizeDeps: {
				include: ["@braintree/sanitize-url"],
			},
			resolve: {
				alias: {
					dayjs: "dayjs/",
				},
			},
		},
		mermaid: {
			// Optional: Configure Mermaid theme options
			theme: "default",
		},
	})
);
