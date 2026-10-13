# ABOUT ME · approved static clay design

The cover is the image Ding Jie selected on 13 October 2026. Nine fixed page compositions follow the approved ImageGen designs, using generated clay frames, pins, paper and props with original portfolio images. Only opening and closing show the presenter. New animation is deferred until static layouts are approved.

## Entry point

`index.html` loads `theatre-v5.css`, `layouts-v5.js`, `director-v5.js`, `app-v5.js`, and the existing narrated `story-v2.js`. All four implementation files share the same resource version to avoid mixing old and new code in browser caches.

## Source fidelity

- Real project photos and drawings are still the original `assets/work-*.webp` images. Generated mockup drawings are never substituted for them.
- White plan/model backgrounds visually disappear with CSS multiply blending over paper. Source pixels, dimension annotations, and linework remain intact; the original-image viewer uses the untouched sources on white.
- Green base: `#6b6e4e`, sampled from the selected cover. Generated green background plates follow that reference and preserve their textured variation.
- 33 original / 48 proposed are the verified Fuzhou retail counts.
- Jasmine personal scope is the central installation itself. The adjacent market studies are labeled scheme A/B rather than built work.
- The Pinghe page uses reading, meeting and music spaces; the school entrance is excluded.

## Interaction

Continuous narration, bilingual captions, whole-show seeking on the original thin line, catalog, original-image lightbox, project notebook, sound and full screen are retained. Desktop picture placements stay fixed during narration. On mobile, fixed-image selection tabs let the viewer choose drawings without disturbing audio progress.

Desktop arrows / mouse wheel and mobile vertical swipes change chapter. Space or the presenter pauses/resumes narration. The subtitle area contains no extra player toolbar. Cover WORKS and PLAY INTRO are accessible real button hotspots aligned to the selected art.

## Validation

All ten scenes were visually checked at 1440×900 and 390×844, with an additional wide desktop check. Browser checks covered a real cover Play Intro click, all nine automatic chapter transitions by seeking to chapter ends, catalog selection, original-image and notebook dialogs, global seek, mute, subtitle language, and mobile image selection. No page errors or mobile horizontal overflow were observed.
