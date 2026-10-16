---
name: "superzyk.com"
description: "A compact personal blog: one introduction, one article list, and readable articles."
colors:
  site-bg: "#171c1d"
  site-ink: "#ecefed"
  site-muted: "#b1bfba"
  site-faint: "#99aaa4"
  site-border: "#34403b"
  site-card: "#202825"
  site-card-strong: "#2a3430"
  site-link: "#8ad6c4"
  light-site-bg: "#faf9f5"
  light-site-ink: "#263b34"
  light-site-muted: "#586a62"
  light-site-faint: "#61736a"
  light-site-border: "#dce2db"
  light-site-card: "#f1f3ed"
  light-site-card-strong: "#e7eee6"
  light-site-link: "#277866"
  article-code-bg: "#141b19"
  article-code-border: "#3a4d43"
typography:
  display:
    fontFamily: "\"Reading Serif\", \"Songti SC\", serif"
    fontSize: "clamp(2rem, 3.3vw, 2.65rem)"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "-.025em"
  display-mobile:
    fontFamily: "\"Reading Serif\", \"Songti SC\", serif"
    fontSize: "1.9rem"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "-.025em"
  post-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.6
  article-headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "clamp(1.875rem, 3.6vw, 2.625rem)"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    lineHeight: 1.6
  article-body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.95
  article-body-mobile:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "1rem"
    lineHeight: 1.9
  code:
    fontFamily: "\"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace"
    fontSize: "0.875rem"
    lineHeight: 1.62
rounded:
  field: "0.25rem"
  toc: "0.4rem"
  image: "0.5rem"
  circle: "50%"
spacing:
  detail-gap: "0.5rem"
  inline-gap: "1rem"
  post-row-block: "1.65rem"
  article-column-gap: "4rem"
components:
  theme-toggle:
    textColor: "{colors.site-muted}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  archive-search:
    backgroundColor: "{colors.site-card}"
    textColor: "{colors.site-ink}"
    rounded: "{rounded.field}"
  archive-search-light:
    backgroundColor: "{colors.light-site-card}"
    textColor: "{colors.light-site-ink}"
    rounded: "{rounded.field}"
  archive-filter-selected:
    textColor: "{colors.site-link}"
    padding: "0.5rem"
  archive-filter-selected-light:
    textColor: "{colors.light-site-link}"
    padding: "0.5rem"
---

# Design System: superzyk.com

## Overview

**Creative North Star: "A quiet personal reading space"**

A quiet personal reading space with warm-white or graphite surfaces and a cyan/teal accent. A short introduction leads directly to one article list, accompanied by one atmospheric pixel-art campfire scene. Typography, spacing, and fine rules retain the hierarchy; the scene extends the homepage without changing the site's fonts or shared tokens.

**Key Characteristics:**

- One article list; each article appears once on the homepage.
- Compact navigation and contact footer.
- Flat surfaces and a restrained accent.

Source: `PRODUCT.md`, the global/home/archive/article stylesheets, and the current shared header, footer, post-row, archive, table-of-contents, and campfire components. Article-specific CSS overrides legacy global article styles. The owner's references are mmguo.dev and 1991421.cn.

## Colors

Unprefixed tokens describe the default dark theme; `light-` tokens describe warm-white overrides. Runtime CSS uses the same semantic variable names for both. Accent marks links, selection, and focus; muted text and one-pixel rules organize content. Code blocks retain dark surfaces in both themes. Saved `superzyk-theme` preferences remain intact; absent or unavailable storage defaults to dark.

## Typography

The single homepage declaration uses local Noto Serif SC 500, aliased as “Reading Serif.” All interface and article text uses system sans; code uses system monospace. Post titles are 1.125rem, reducing to 1.05rem below 768px. Article body is 1.0625rem/1.95, reducing to 1rem/1.9 below 600px.

The title font is a local text subset with `font-display: swap`. Provenance is in `public/fonts/README.txt`; SIL Open Font License 1.1 is in `public/fonts/OFL.txt`. Check glyph coverage when changing title copy.

## Layout

Homepage, archive, header, and footer cap at 960px with 1.5rem side gutters. Homepage/header/footer gutters reduce to 1.25rem below 768px; the archive changes at 600px. The sticky header remains 64px high. The homepage introduction pairs one declaration and author sentence with the square campfire scene in a 1.1fr/1fr grid (2rem gap). Below 768px it becomes one column, with the scene centered beneath the copy and capped at 28rem. The single article list follows; the footer is one wrapping row.

Archive search caps at 30rem. Flat categories and a single result count share a wrapping row. Article content targets 740px within a 1044px shell; at 1100px, a 240px directory sits alongside it across a 4rem gap. On smaller screens the directory is expandable in the reading flow. Code and wide tables scroll within their own containers.

## Elevation & Depth

Reading surfaces remain flat. Fine dividers and tonal search/code surfaces provide separation. The campfire scene uses a transparent radial CSS feather to blend into either theme, without a card or frame. Article overrides remove image, quote, code, table, directory, and back-to-top shadows; images do not lift on hover.

## Shapes

Article rows and category controls are open and flat. Search corners are 0.25rem; the compact directory uses 0.4rem, article images 0.5rem, and the theme toggle a circle. Navigation, theme, search, and category controls retain 44px minimum targets.

## Components

- **Header/footer:** the text brand returns home; “文章” and the theme toggle complete the header. The footer contains copyright, email, GitHub, and RSS.
- **Campfire scene:** one large pixel-art tree against a gradient starry sky, with the boy at lower left, fire at lower center, and cat and dog at lower right. A muted looping video animates the fire; Canvas adds 36 stars and at most 32 sparks, with drawing capped at 30 fps and device pixel ratio capped at 1.5. Mouse movement gently shifts the stars; clicking or keyboard activation releases sparks while playing. A separate 44px play/pause button and visible keyboard focus keep motion controllable. The video loads only when visible and motion is allowed; reduced-motion and Save-Data preferences default to the static poster, with explicit playback available. Leaving the viewport or hiding the tab stops video and particle animation; playback failure restores the poster.

  The current media pair is a 576 × 576, six-second, 12 fps H.264 loop (139,264 bytes) and a WebP poster (66,450 bytes). Original artwork was generated with OpenAI `image_gen`; the source prompt is `artifacts/pixel-campfire/prompt.txt`, and `artifacts/pixel-campfire/README.md` documents the local `build-loop.mjs` animation script and verification. These provenance and build artifacts remain local.
- **Article row:** category/date, linked title, and summary. The title changes to accent on hover; no extra metadata badges or circular arrows.
- **Archive:** a compact search field with an accessible hidden label and conditional clear action; flat text categories underline the selection. One live result count and a resettable empty state provide feedback.
- **Article:** title, summary, byline, available environment/version/verification facts, directory, and body. Related reading is a short title-only list. The directory keeps its active chapter visible within its own scroll area and preserves user control during pointer or keyboard interaction. Escape closes the compact menu and restores toggle focus.

Focus uses a 2px accent outline (5px offset globally, 4px for archive/article controls, 3px around search). State changes are brief; reduced-motion preferences disable transitions and smooth scrolling.

## Do's and Don'ts

- Do retain visible keyboard focus, saved theme preferences, and reduced-motion behavior.
- Do keep publication, revision, and verification facts distinct.
- Don't duplicate articles across homepage sections or repeat the author introduction.
- Don't reintroduce removed promotional blocks, reading-route buttons, tag clouds, reading guides, or progress displays.
- Don't extend the title-font subset to new copy without checking glyph coverage.
