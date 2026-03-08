import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import path from "path";

// https://vitepress.dev/reference/site-config
export default withMermaid(
	defineConfig({
		title: "Obsidian DnD UI Toolkit",
		description: "Modern UI elements for tabletop RPGs in Obsidian",
		base: "/obsidian-dnd-ui-toolkit/",
		head: [["link", { rel: "icon", type: "image/svg+xml", href: "/obsidian-dnd-ui-toolkit/favicon.svg" }]],
		themeConfig: {
			// https://vitepress.dev/reference/default-theme-config
			search: {
				provider: "local",
			},
			nav: [
				{ text: "Home", link: "/" },
				{ text: "Docs", link: "/getting-started/quick-start" },
			],

			sidebar: [
				{
					text: "Getting Started",
					items: [
						{ text: "Quick Start", link: "/getting-started/quick-start" },
						{ text: "Installation", link: "/getting-started/installation" },
					],
				},
				{
					text: "General Components",
					items: [
						{ text: "Ability Cards", link: "/components/ability-cards" },
						{ text: "Badges", link: "/components/badges" },
						{ text: "Consumables", link: "/components/consumables" },
						{ text: "Skill Cards", link: "/components/skill-cards" },
						{ text: "Stat Cards", link: "/components/stat-cards" },
					],
				},
				{
					text: "D&D 5e",
					items: [
						{ text: "Frontmatter", link: "/character-sheet/frontmatter" },
						{ text: "Ability Scores", link: "/character-sheet/ability-scores" },
						{ text: "Skills", link: "/character-sheet/skills" },
						{ text: "Health Points", link: "/character-sheet/healthpoints" },
						{ text: "Spell Components", link: "/character-sheet/spell-components" },
						{ text: "Event Buttons", link: "/character-sheet/event-buttons" },
					],
				},
				{
					text: "Game Master",
					items: [{ text: "Initiative Tracker", link: "/dungeon-master/initiative-tracker" }],
				},
				{
					text: "Concepts",
					items: [
						{ text: "Themes", link: "/concepts/themes" },
						{ text: "State Storage", link: "/concepts/state-storage" },
						{ text: "Event Systems", link: "/concepts/event-systems" },
						{ text: "Dynamic Content", link: "/concepts/dynamic-content" },
					],
				},
				{
					text: "Generators",
					items: [{ text: "D&D Character", link: "/examples/generator" }],
				},
			],

			footer: {
				message: 'Icons by <a href="https://game-icons.net">game-icons.net</a> under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. By Delapouite, Lorc, and Willdabeast.',
			},

			socialLinks: [{ icon: "github", link: "https://github.com/hay-kot/obsidian-dnd-ui-toolkit" }],
		},
		vite: {
			optimizeDeps: {
				include: ["@braintree/sanitize-url"],
			},
			resolve: {
				alias: {
					dayjs: "dayjs/",
					lib: path.resolve(__dirname, "../../lib"),
				},
			},
		},
		mermaid: {
			// Optional: Configure Mermaid theme options
			theme: "default",
		},
	})
);
