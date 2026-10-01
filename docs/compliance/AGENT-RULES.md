# Mandatory engineering rules for agents

These are project implementation policies grounded in the linked sources, not quotations from statutes. Apply the relevant rule to each change and record evidence. When applicability is uncertain, document the issue and obtain the responsible client's decision before enabling the affected production behavior. Continue unrelated development.

## Legal identity and transparency — DDG 5; GDPR 12–14

- Public production pages must provide easily accessible Impressum and privacy links, including mobile views and forms. Use Kablitz's verified legal entity, representative, address, direct contact, register and applicable tax information. ADSPIRE's offer details are not the website operator's Impressum.
- Do not invent register numbers, certifications, legal texts, retention periods or DPO contacts. Missing information remains an explicit launch blocker.
- Privacy information must describe actual forms, logs, auth, uploads, hosting, analytics, external services, recipients, bases, retention, transfers and rights. Keep translations consistent and understandable; secure client approval.

## Device access and third-party requests — TDDDG 25; GDPR 6/7; DSK

- Inventory cookies, local/session storage, tracking pixels, SDKs, fingerprinting and external embeds. Cookie-free does not automatically mean consent-free or GDPR-free.
- Default-disable non-essential tracking/device access until applicable valid consent. Strictly necessary exemptions require a documented purpose; never classify analytics as necessary merely because the business wants it.
- Where consent is needed, provide meaningful acceptance/rejection and granular choices, no prechecked options, and accessible withdrawal. Reject/withdraw must prevent subsequent optional loading; verify network traffic, not just banner appearance.
- Do not auto-load optional maps/videos/marketing widgets before the required decision. Use a local placeholder and separately controlled activation where appropriate. External request IP disclosure must be assessed even if no cookie appears.
- Prefer local fonts, images and globe textures; confirm licenses. Google employee OAuth is a purposeful auth flow, not permission to load Google tracking on public pages.

## Forms, uploads and data rights — GDPR 5/6/13/17/25/32

- Collect only necessary fields. Determine the appropriate basis with the controller: answering an inquiry does not automatically require a mandatory consent checkbox. A privacy acknowledgement does not itself establish a lawful basis. Marketing consent must be separate and optional where used.
- No real inquiry/contact/attachment data in browser localStorage, public static JSON, Git, public demos, build output, URL parameters or analytics payloads. Temporary form state must be minimized; persistent drafts need separate assessment.
- Validate server-side; use rate limits and abuse defenses with assessed providers. Secure uploads by size/type/signature checks as applicable, safe filenames, private storage, authorization on download and expiring access. Treat PDF/DWG/image files as untrusted; scan/isolate where risk warrants. Do not render uploaded HTML/SVG as trusted content.
- Implement agreed retention/deletion and access/export/correction processes. Distinguish inquiry data from later contractual records. Do not retain everything indefinitely or invent a statutory universal deletion deadline.
- Document backup retention, deletion propagation and restore behavior; test restores. Hosting free tiers are not a backup strategy.

## Google sign-in and roles — GDPR 25/32; engineering controls

- Use minimal OAuth scopes and verified identity. Only previously authorized employees may access admin. Never trust an email from an unverified client payload or allow any Google account.
- Enforce active account, role and object permissions on every server read/write, attachment and analytics endpoint. UI hiding is not security. Revocation must remove access and invalidate sessions as required.
- Secure session cookies (Secure/HttpOnly/SameSite), CSRF defenses for relevant mutations, sanitization of CMS HTML, parameterized queries, server-only secrets, least-privilege service credentials and dependency updates are required.
- Audit sensitive role changes, publishing and access events without logging tokens or unnecessary personal data. Protect the last owner's access; document recovery. Recommend MFA for privileged Google accounts.
- Preview/internal routes require real access protection if confidential. noindex and robots.txt are not authorization.

## Vendors and cross-border access — GDPR 28/32/44–49

- Record Vercel, Neon, Google OAuth, file storage, email, analytics and error monitoring: purpose, data, region, subprocessors, deletion, contract and transfer mechanism. Check actual account settings and terms rather than assuming vendor branding proves compliance.
- Prefer appropriate EU processing regions where available. EU hosting alone does not settle foreign support/subprocessor access.
- ADSPIRE maintenance from Serbia may create a third-country transfer/access issue. Obtain a documented legal assessment and suitable processor/transfer arrangements before production personal-data access; do not assume Serbia is covered by an EU adequacy decision. Use least privilege and synthetic/redacted development data.
- Do not send personal data or private project materials to AI services for debugging/translation without a separately assessed, approved processing arrangement.

## Logs, analytics and incidents — GDPR 5/32–34

- Redact authorization headers, cookies, OAuth codes, form bodies, email, files and personal URL/query values. Avoid session replay on admin/forms; scrub error-monitoring payloads. Restrict access and define retention.
- Daily 08:00 Europe/Berlin review is the agreed maintenance routine; define working days/holidays with client. Critical alerting must not wait for the next morning. Keep logs usable for review without excessive personal information.
- On a known critical incident, immediately triage/contain, notify Kablitz's designated contact, preserve necessary evidence securely and restore safely, including weekends/holidays under the agreed service. Do not destroy evidence, hide an incident or promise instant complete recovery.
- A processor informs the controller without undue delay. The controller assesses authority notification under GDPR 33 (where required, within 72 hours of awareness) and affected-person notification under Art. 34. Not every outage is a reportable breach; do not publish or notify authorities on the client's behalf without authority. Record discovery time, scope, actions and decision owner.

## Accessibility, publication and claims — BFSG/BFSGV conditional; UWG; UrhG

- Record whether the actual service targets consumer contract conclusion and whether BFSG applies. Do not claim it applies to every B2B site or declare an exemption without analysis.
- Regardless of statutory scope, use keyboard navigation, visible focus, semantic headings, labels/errors, meaningful alt text, contrast, reduced-motion support and usable mobile forms. Provide a text/list alternative to the 3D globe and a readable process alternative. WCAG 2.2 AA is an engineering target, not an automatic legal certificate.
- Publish only client-approved media, technical facts and projects; distinguish completed/current/future. Obtain rights/permissions for customer names, photos, locations and employees. Demo numbers must not become production facts.
- Substantiate comparative claims; do not fabricate 'best', performance, environmental savings, endorsements or AI/search ranking guarantees. No hidden crawler-only deception, fake reviews or prompt-injection content.
- Newsletter, shopping, recruitment files or public-user publishing require a fresh applicability/data assessment before enabling.
