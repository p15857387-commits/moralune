# Self-hosted type

These files replace the previous Google Fonts stylesheet. They are the woff2 subsets for the weights the storefront already used. They are not a custom character subset: every unicode-range file shipped by the Fontsource package for those weights is included, including the full Simplified Chinese split of Noto Sans SC and Noto Serif SC.

Source packages, all SIL Open Font License 1.1:

| Family | Weights | Package |
| --- | --- | --- |
| DM Sans | 300, 400, 500, 700 | `@fontsource/dm-sans` 5.3.0 |
| Newsreader | 300, 400 | `@fontsource/newsreader` 5.3.0 |
| Noto Sans SC | 300, 400, 500, 700 | `@fontsource/noto-sans-sc` 5.3.1 |
| Noto Serif SC | 400, 500 | `@fontsource/noto-serif-sc` 5.3.1 |

Fontsource redistributes the font files published for these families. Copyright lines in the license files:

- DM Sans: Copyright 2014 The DM Sans Project Authors (https://github.com/googlefonts/dm-fonts)
- Newsreader: Copyright 2020 The Newsreader Project Authors (https://github.com/productiontype/Newsreader)
- Noto Sans SC and Noto Serif SC: the package license text names Google Inc.

The full license for each family is in `licenses/`. These font licenses do not grant any rights in the product photographs.
