# Themes

The D&D UI Toolkit includes a built-in theme system that lets you change the color scheme of all plugin components. You can select a preset theme or customize individual colors.

## Selecting a Theme

Open **Settings > D&D UI Toolkit > Styles** and choose a theme from the **Theme Preset** dropdown. All component colors update immediately.

After selecting a theme, you can further customize any individual color using the color pickers below the dropdown. Use the **Reset** button to restore the default theme.

## Available Themes

### Built-in Themes

| Theme | Mode | Description |
|-------|------|-------------|
| Default Dark | Dark | Blue-purple tones with teal and red accents |
| WOTC/Beyond (Light) | Light | Warm parchment inspired by D&D Beyond |
| WOTC/Beyond (Dark) | Dark | Neutral charcoal with warm text and red accents |
| Moonstone (Dark) | Dark | Cool silver-blue, ethereal feel |
| Forest (Dark) | Dark | Deep greens, earthy woodland tones |
| Ocean (Dark) | Dark | Deep navy blues |
| Crimson (Dark) | Dark | Dark burgundy and red tones |
| Amber (Dark) | Dark | Warm gold and amber tones |
| Parchment (Light) | Light | Warm beige, old paper feel |
| Stone (Light) | Light | Neutral cool gray |
| Ocean (Light) | Light | Soft blue tones |
| Forest (Light) | Light | Soft green tones |
| Rose (Light) | Light | Warm pink and mauve tones |

### ITS-Theme Companions

These themes are designed to complement the [ITS-Theme](https://github.com/SlRvb/Obsidian--ITS-Theme) for Obsidian. If you use one of the ITS-Theme's TTRPG color schemes, select the matching companion theme so the plugin's UI blends in with the rest of your vault.

| Theme | Mode | ITS Color Scheme |
|-------|------|------------------|
| ITS D&D (Dark) | Dark | D&D — green forest aesthetic with medieval tones |
| ITS D&D (Light) | Light | D&D — light blue-white with green accents |
| ITS WOTC (Dark) | Dark | D&D WOTC-Beyond — dark with red headers and burgundy borders |
| ITS WOTC (Light) | Light | D&D WOTC-Beyond — warm cream with red accents |
| ITS Pathfinder (Dark) | Dark | Pathfinder — gold text, burgundy red, blue accent |
| ITS Pathfinder (Light) | Light | Pathfinder — warm stone with gold headers and deep red |
| ITS Pathfinder Remaster (Dark) | Dark | Pathfinder Remaster — green variant with gold accent |
| ITS Pathfinder Remaster (Light) | Light | Pathfinder Remaster — stone base with deep green headers |

## Color Variables

Each theme defines the following color variables. These are applied as CSS custom properties on the document root.

### Backgrounds

| Variable | CSS Property | Usage |
|----------|-------------|-------|
| Background Primary | `--dnd-ui-color-bg-primary` | Main card backgrounds |
| Background Secondary | `--dnd-ui-color-bg-secondary` | Secondary/nested elements |
| Background Tertiary | `--dnd-ui-color-bg-tertiary` | Tertiary elements |
| Background Hover | `--dnd-ui-color-bg-hover` | Hover states |
| Background Darker | `--dnd-ui-color-bg-darker` | Darker accented backgrounds |
| Background Group | `--dnd-ui-color-bg-group` | Grouped/categorized elements |
| Background Proficient | `--dnd-ui-color-bg-proficient` | Proficiency indicators |

### Text

| Variable | CSS Property | Usage |
|----------|-------------|-------|
| Text Primary | `--dnd-ui-color-text-primary` | Main body text |
| Text Secondary | `--dnd-ui-color-text-secondary` | Secondary/label text |
| Text Sublabel | `--dnd-ui-color-text-sublabel` | Sublabels and captions |
| Text Bright | `--dnd-ui-color-text-bright` | Emphasized/highlighted text |
| Text Muted | `--dnd-ui-color-text-muted` | De-emphasized text |
| Text Group | `--dnd-ui-color-text-group` | Group label text |

### Borders

| Variable | CSS Property | Usage |
|----------|-------------|-------|
| Border Primary | `--dnd-ui-color-border-primary` | Standard borders |
| Border Active | `--dnd-ui-color-border-active` | Active/selected state borders |
| Border Focus | `--dnd-ui-color-border-focus` | Focus ring color |

### Accents

| Variable | CSS Property | Usage |
|----------|-------------|-------|
| Accent Teal | `--dnd-ui-color-accent-teal` | Heal buttons, positive actions |
| Accent Red | `--dnd-ui-color-accent-red` | Damage buttons, negative actions |
| Accent Purple | `--dnd-ui-color-accent-purple` | Magic/special actions |
