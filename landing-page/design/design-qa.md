# Product Design QA

- source visual truth: `C:\Users\向往\.codex\generated_images\019fee98-0749-73d3-94ef-663517d7971b\exec-f104b9b1-cf35-4c5d-9387-e323bb9feffa.png`
- implementation screenshot: `D:\xiangwang-netlify\landing-page\implementation-desktop-viewport.png`
- focused quote screenshot: `D:\xiangwang-netlify\landing-page\implementation-quote-viewport.png`
- focused modal screenshot: `D:\xiangwang-netlify\landing-page\implementation-modal-viewport.png`
- comparison artifact: `D:\xiangwang-netlify\landing-page\design-qa-comparison.png`
- viewport: desktop 1440 × 1024 CSS px; mobile 390 × 844 CSS px
- source pixels: 864 × 1839; normalized top crop to 1440 × 1024 for comparison
- implementation pixels: 1440 × 1024 at device scale factor 1
- state: landing page default, quote selected state, consultation modal step 1

## Full-view comparison evidence

The implementation preserves the selected editorial-tech direction: warm paper surface, oversized black hero typography, cobalt primary color, acid-lime label, numbered sections, thin horizontal rules, Swiss-style vertical labels, authentic project screenshots, and a strong blue conversion band. The studio name and contact identity were intentionally changed to 向往软件工作室 / 向先生.

The source mock contained unverified performance statistics. These were intentionally replaced with verifiable service promises—独立开发、透明交付、源码交付、售后支持—while retaining the same horizontal information rhythm.

## Focused region evidence

- Quote calculator: package selection updates the total, payment rule, and upfront payment. Checked with 静态官网 / 个人落地页, yielding ¥1,000 and the full-payment rule.
- Consultation flow: CTA opens the three-step modal; service choices, quote summary, contact field, loading, error, and success states remain implemented.
- Portfolio: the three provided screenshots are rendered without replacement or distortion and keep automatic folder discovery.
- Mobile: 390 px capture has no horizontal overflow (`scrollWidth` equals `clientWidth`) and collapses packages, quote fields, portfolio, trust, and CTA to one column.
- Browser console: no application warnings or errors in the final desktop pass.

## Comparison history

- P2: the brand link originally scrolled to the hero anchor and omitted the header from the returned top state. Fixed by linking to the document top; post-fix evidence shows the complete header and hero.
- P2: the legacy floating CTA used an emoji inconsistent with the selected icon language. Replaced with the Phosphor `ChatCircleDots` icon; post-fix evidence shows a consistent cobalt pill action.
- P2: generic consultation wording did not identify the contact person. Added 向先生 to the trust copy, CTA, modal, success/error messages, and PushDeer notification payload.

## Required fidelity surfaces

- Fonts and typography: passed. Noto Sans SC plus Space Grotesk reproduce the dense display hierarchy and technical microtype.
- Spacing and layout rhythm: passed. Hero split, section numbering, rules, package columns, quote summary, and portfolio tracks align with the reference structure.
- Colors and visual tokens: passed. Warm paper, near-black, cobalt blue, acid lime, and restrained gray dividers are consistent.
- Image quality and asset fidelity: passed. The hero uses a purpose-built editorial raster asset; all three project images are the original supplied files.
- Copy and content: passed. Existing services, prices, payment behavior, portfolio titles, consultation flow, studio name, contact name, and PushDeer behavior are preserved.

## Remaining P3 polish

- The generated hero artwork is a cleaner X-shaped interpretation of the mock's torn-paper mark.
- Long Chinese service names wrap differently at intermediate tablet widths but remain readable.

## Primary interactions tested

- Navigation anchor to quote section
- Quote package selection and live calculation
- Consultation modal open and close
- Consultation modal service list visibility
- Desktop and mobile responsive layout

final result: passed
