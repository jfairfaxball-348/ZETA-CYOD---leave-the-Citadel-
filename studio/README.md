# Leave the Citadel — Writing Studio (W004 POC)

A deliberately simple way to **write the novel inside its branching structure**. This is a private-authoring concept, not published fiction or a change to the project's approved canon.

## Start with three things

1. **Choose a scene** from the Act I / Act II / Act III overview.
2. **Choose a passage** on the small connected map. A spacious writing panel opens; edit the title and prose there.
3. **Read** to experience the existing branches as the reader would.

The canvas still supports moving, zooming and connecting passages. Add a scene from its Act column, add a passage while inside a scene, and find less-frequent tools behind the **•••** menu.

The prose editor deliberately keeps planning and technical features secondary. A passage can hold multiple prose paragraphs. Each passage has a stable internal ID that is separate from final printed paragraph and page numbers.

## Preview / deploy

The site is static HTML, CSS and vanilla JavaScript. No build process, framework or external services are necessary.

- Open `studio/index.html` in a browser, or run `python3 -m http.server 8000` from `studio/`.
- For the linked Vercel project **zeta-writing-studio**, set **Root Directory = `studio`** and **Framework Preset = Other**.
- The preview build does not publish an actual manuscript or invent new canon. The existing initial scene placeholders demonstrate previously agreed routing only.

Tests: `cd studio && npm install && npm test`. The test dependencies are for verification, not the deployed site.

## Limitations

- Your editing data is saved to **this browser only** using `localStorage`, not automatically synced to GitHub or a cloud database. Use **••• → Export manuscript** to back it up. Import replaces your current local copy after confirmation.
- The PoC is not authenticated itself; use Vercel Deployment Protection when making a lasting private deployment. Do not place unpublished prose on an unprotected shared device.
- Page/paragraph numbering, full protected numerical transitions, rich story state, collaborative editing, durable storage, and print export are **not implemented**.
- The starter graph is just an illustrative representation of W001–W003 architectural canon; accusations, regional discoveries, character details and endings remain open.

The studio lives independently in `studio/`; `authoritative/`, `lore/`, `story/` and `cyod/` have not been modified by this proof of concept.
