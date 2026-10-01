# Initial implementation review — 2026-10-01

This is a focused source inspection, not a complete runtime, security or legal audit. Current state: demo; production compliance NOT VERIFIED.

| Observation | Evidence | Production action |
| --- | --- | --- |
| Embedded Google map receives an iframe src directly | src/components/demos/kablitz-map.tsx | Assess processing/legal basis and consent; use an appropriately gated/local alternative before public production launch |
| Inquiry/contact data retained in browser localStorage | src/components/demos/kablitz-inquiry.tsx and kablitz-spare-parts.tsx | Replace with private server persistence and approved retention; do not collect real contacts in public demo |
| News/reference stores are browser-local demo behavior | src/lib/news-store.ts and references-store.ts | Production CMS, authorization and publishing separation required |
| Admin is a public concept preview | src/components/demos/kablitz-admin-page.tsx | Verified Google identity, employee allowlist and server roles required before real data |
| Upload demo stores file metadata rather than server attachments | src/components/demos/kablitz-spare-parts.tsx | Private upload storage, validation, scan/isolation assessment and access checks required |
| Public footer currently has demo/project/admin links | src/components/demos/kablitz-page.tsx | Verified Impressum/privacy and appropriate consent settings links required for production |
| Proposed Vercel/Neon and maintenance from Serbia | Agreed project scope | Document actual processing, contracts, transfer assessment and backup/restore plan |

No production settings, consent UI or security controls have been implemented by adding this documentation. Do not claim the demo is legally approved. The internal offer page is not a substitute for public legal information.
