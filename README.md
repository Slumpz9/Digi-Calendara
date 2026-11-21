# Digi-Calendara

A Shopify Online Store 2.0 theme ("Keepsake") for a store that sells a glass video keepsake orb: a gift with a small screen inside that plays the buyer's own video.

## What's in it

| Folder | Contents |
| --- | --- |
| `layout/` | Main page shell and the password-page shell |
| `templates/` | Home, product, collection, cart, search, blog, page, contact, 404, password, gift card |
| `sections/` | Hero, trust bar, features, featured collection, how it works, customer quotes, FAQ, email signup, image with text, rich text, plus the main section for each page type |
| `snippets/` | Product card, price, icons, section heading, and the illustrated orb |
| `assets/` | `base.css` and `theme.js` (no build step, no dependencies) |
| `config/` | Theme settings: colours, fonts, page width, corner radius, social links |
| `locales/` | English storefront text |

The illustrated orb stands in wherever a product photo is missing, so the store looks finished before any photography exists.

## Install

1. Zip the theme folders: `zip -r keepsake.zip assets config layout locales sections snippets templates`
2. In Shopify admin go to **Online Store > Themes > Add theme > Upload zip file**.
3. Click **Customize** to edit copy, colours and fonts.

Or connect this repository under **Online Store > Themes > Add theme > Connect from GitHub**.

## Before you launch

- Replace the placeholder copy. The "Add your memory" step, the FAQ answers and the product page rows contain instructions to the store owner where details are not yet confirmed (how video is loaded, size, power, delivery, returns).
- The screen size (2.8 inch), memory (4GB) and glass material come from the supplier listing. Check them against a sample before launch.
- Replace the three placeholder customer quotes with real reviews, or remove that section.
- Create a `main-menu` and a `footer` menu under **Content > Menus**.
- Pick a collection in the "Choose your orb" section.
- Assign the `page.contact` template to your contact page.

## Checking changes

The theme passes Shopify's theme check with no offenses. To re-run it with the Shopify CLI: `shopify theme check`.
