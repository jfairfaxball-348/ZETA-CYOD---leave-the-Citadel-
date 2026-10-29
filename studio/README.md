# ZETA Writing Studio — W004 proof of concept

A browser-based interactive manuscript canvas for **Leave the Citadel**, designed as a companion to the authoritative ZETA repository. This is a **tool demonstration**, not an approval of any new fictional canon or final manuscript paragraph.

## Run / deploy

Static HTML/CSS/JavaScript, intentionally with **no package manager, build step, framework, or database**. To run locally, open `index.html` in a browser (or run `python3 -m http.server 8000` from this folder). For Vercel, create a project connected to the ZETA GitHub repository with **Root Directory = `studio`**, **Framework Preset = Other**, and no build command. Deployments then follow commits to the repository.

## What works

- Infinite draggable/zoomable canvas, Act background frames, scene cards containing passage nodes
- Expand/collapse scene groups; move scenes and individual passages
- Select/edit passage title, full manuscript text, editorial status and internal notes
- Add scenes, passages, and choices; edit destinations; remove links
- Launch a simple playable reading view from the opening or current passage
- Remember the initial right-wrist selection and route via the Act I → Act II mark gate; the opening mark **does not** change the shared Act I text
- Check for missing destinations, unreachable passages, draft placeholders and loops
- Automatic browser-local saving, import and export of the full JSON project
- Explicitly stable internal passage identifiers distinct from final reader passage labels or printed pages

## Important limitations / safety

1. **Not shared/cloud storage.** Manuscript data is stored in the browser's `localStorage`, and a private/incognito session or browser reset may delete it. Export JSON backups frequently. Import replaces current browser data after confirmation.
2. **Not an authenticated editor.** Deployment protection/access control must be set in Vercel before private authoring. The POC ships with **no server-side storage** or secrets, and the starter text is only approved structure plus conspicuous placeholders. Do not store confidential draft prose on an unprotected shared workstation.
3. No real printed page/paragraph numbering, prose typesetting or numerical-jump engine yet; the working draft references 102/203/304/2 are **not final addresses**.
4. The current test router handles the opening mark only; more advanced story flags, proof/evidence gates, bounded jump validation and publication export are future engineering.
5. The sample passage graph demonstrates W001–W003 **structural requirements only**. Every explanatory passage, region investigation, and confrontation remains unwritten. The number-theory region's final fantasy name remains undecided.
6. The app is intentionally standalone: it does not edit authoritative markdown, push automatic commits, or claim editorial approval.

## Recommended next engineering milestone

Private authentication + durable server persistence and commit-backed snapshots; richer scene templates; gate/flag formalisation with automated tests; manuscript export; a verified print numbering/placement pipeline. Keep the authoring tool separate from canon approval decisions.

## Data schema

One JSON document with `version`, `acts`, `scenes`, `passages`, `start` and `sequence`. A scene contains positional and grouping data; a passage has stable `id`, `scene`, `title`, `body`, `status`, `notes`, `x`, `y`, and `edges`. Each edge has `id`, `to`, `label` and optional `setMark` or `requiresMark`. Gate passage transitions are evaluated automatically from the remembered mark. No field equates a passage ID with a physical page number.

This folder is an isolated app; `authoritative/`, `lore/`, `story/` and `cyod/` remain unchanged by this proof of concept.
