# Digi-Calendara

A Shopify Online Store 2.0 theme ("Calendara") for a store that sells smart calendar displays for the home.

## What's in it

| Folder | Contents |
| --- | --- |
| `layout/` | Main page shell and the password-page shell |
| `templates/` | Home, product, collection, cart, search, blog, page, contact, 404, password, gift card |
| `sections/` | Hero, trust bar, features, featured collection, how it works, size comparison, customer quotes, FAQ, email signup, image with text, rich text, plus the main section for each page type |
| `snippets/` | Product card, price, icons, section heading, and the illustrated calendar display |
| `assets/` | `base.css` and `theme.js` (no build step, no dependencies) |
| `config/` | Theme settings: colours, fonts, page width, corner radius, social links |
| `locales/` | English storefront text |

The illustrated calendar display stands in wherever a product photo is missing, so the store looks finished before any photography exists.

## Install

1. Zip the theme folders: `zip -r calendara.zip assets config layout locales sections snippets templates`
2. In Shopify admin go to **Online Store > Themes > Add theme > Upload zip file**.
3. Click **Customize** to edit copy, colours and fonts.

Or connect this repository under **Online Store > Themes > Add theme > Connect from GitHub**.

## Before you launch

- Replace the placeholder copy. The shipping, trial, warranty, "no subscription" and spec claims in the home page and product template are examples, not facts about your product.
- Replace the three placeholder customer quotes with real reviews, or remove that section.
- Create a `main-menu` and a `footer` menu under **Content > Menus**.
- Pick a collection in the "Choose your display" section and a product in each size-comparison card.
- Assign the `page.contact` template to your contact page.

## Checking changes

The theme passes Shopify's theme check with no offenses. To re-run it with the Shopify CLI: `shopify theme check`.
