# v18：交替步态与人物触发转场

沿用用户三张人物定稿，以内置 imagegen 生成与定点修改；没有使用 API/CLI 图像生成。保留原脸、层次外翘棕发、炭灰宽松衣裤、绿色原子标志与平底黑白帆布鞋。

## 采用素材

- `walk.webp` / `walk-regions.json`：8 帧左右交替步态。后半周换另一条支撑腿；第 4、8 帧另行降低抬膝和鞋离地高度。生成 PNG：`exec-05e5d8a7-bbcb-4e7d-9193-1da4f9b8a772.png`。
- `turn-push.webp` / `turn-push-regions.json`：8 帧转身、背身双手接触、推压、随势、回身。生成 PNG：`exec-6c164980-b7a4-44f9-8fe2-c75f1797a157.png`。
- 均保留生成的透明通道，只转换 WebP 编码。区域按完整连通轮廓登记，不按均分网格切鞋和手。

## 动作逻辑

`gait-v18.js` 以 240 舞台像素为完整两步循环，初始使用经过位；来源图的支撑鞋位置经过登记，裤腿下段作小幅连续位置校正，使支撑脚抵消身体前移。固定头部与上身比例，不使用拆分裤腿的拼接方案。移除与脚步不同拍的额外身体弹跳。画面边缘和人物点击区包含校正后的脚部。

`handoff-v18.js`：泗泾→弄海潮、漕河泾→福州平面对照，先转身至背面，再双掌接触；到 34% 才允许版面倾倒，推压后收手转回。接触及发力期间人物地面位置固定。其余上移、翻页、收拢转场，先准备/接触，再由动作触发版面；收拢/展开围绕手边位置。转场取消时清理变换原点、残页及透明度。

## 最终提示词组

### 走路姿势主生成

Production 8-frame walk atlas. Image1 is strict adult woman character/outfit identity. Image2 is strict relaxed normal face. Image3 is the EXACT 8-pose motion guide to transfer to her body, not a style reference. Match image3's leg poses and foreground/background limb order in all eight cells: red guide limb is CAMERA-NEAR leg and always occludes blue guide leg; red/blue colors must NOT appear in final. Both legs wear the SAME charcoal jeans from image1. Crucial frame3 near leg straight planted under body, far foot crosses forward beside it; frame7 opposite far leg planted, near foot swings past and occludes far shin. Top and bottom row must not repeat same leg. Follow numbered guide sequence1..8 with matching arm directions. Slightly straighten knees compared with guide on support leg, relaxed short steps. Exact character face and slim adult proportions, same layered hair, same washed charcoal T shirt lime atom logo, loose jeans, flat black/white canvas shoes. Fixed side three-quarter camera facing screen RIGHT. Eight full bodies, 4columns x2rows, same scale and framing and ample margins. TRANSPARENT ALPHA BACKGROUND, NO brown backdrop, NO scene, NO floor shadow. Render ONLY character cutouts. No labels, guide colors, lines, lettering. Gentle natural face. Complete hair, hands, and shoes.

### 透明背景

Precise background extraction. This supplied image is the EDIT TARGET. Remove ONLY its brown studio backdrop, floor and floor shadows to genuine transparent ALPHA. Preserve exactly the eight complete women, their identical positions, scale, faces, hair, clothing, finger shapes and shoes. Keep the same4 columns x2rows. Do not change ANY pose or body pixels. No new backdrop, no floor, no shadows, no text. True transparent PNG cutouts.

### 走路定点修正

Targeted motion correction on this exact transparent 8-sprite atlas. Preserve layout, body size, all heads, facial identity, hair, outfits and alpha. Preserve sprites1,2,3,5,6,7 EXACTLY. Edit ONLY sprite4 (top RIGHT) and sprite8 (bottom RIGHT): their raised front knee and shoe are TOO HIGH, creating marching. Lower the forward swinging thigh/knee and shoe to a relaxed normal walking pre-contact position. Extend the swinging leg more downward so the front heel is ONLY about 8 to12 pixels ABOVE its planted shoe's floor level (character is approx480pixels tall). Knee slightly bent, foot about40pixels ahead of hip, toe slightly up. Not a high stepping or kicking pose. Keep planted leg, arms, torso and heads of sprites4/8 EXACTLY unchanged. Do not change which leg is in front. No brown background, genuinely transparent alpha, no floor shadows or objects.

### 背身推压

Create 8 complete full-body animation cutouts of this EXACT adult stylized woman for her clay portfolio website. Strict match hair, face, slim mature 4.5heads proportions, loose washed charcoal t-shirt with tiny lime atom emblem ON FRONT ONLY, loose charcoal jeans and flat black/white canvas sneakers. Use normal gentle expression image2. Sprite sheet4columns x2rows, ample margins, identical body scale, entire hands/shoes/hair. TRANSPARENT alpha, no backdrop/floor/shadows/text/objects. This is an ACTING TURNAROUND AND PUSH AWAY sequence. We see her turn AWAY from viewer and PUSH an imaginary large upright panel AWAY into the depth of scene. Do not show or render panel. 1 front three-quarter neutral facing slightly SCREEN LEFT, arms down. 2 rotates to left side profile, head and shoulders turn away first, feet pivot under body. 3 rear three-quarter view, back mostly toward viewer, glancing toward imaginary panel, hands start raising at shoulder height. 4 FULL BACK view, both palms held FORWARD AWAY from camera at shoulder height, elbows bent, feet apart stable, shirt back plain. 5 FULL BACK view leans forward and extends BOTH arms AWAY from camera, pushing imaginary wall hard, rear heel slightly lifted, knees flex slightly, head between shoulders. 6 full BACK view follow-through pushing, arms extended away and slightly LOWER, wall has tipped away, chest leans away, feet stay planted. 7 rear three-quarter view retracts hands and turns head toward viewer over left shoulder, recovering upright. 8 front three-quarter relaxed composed stand turned slightly SCREEN LEFT, hands lowered after finishing push. IMPORTANT poses4,5,6 MUST show BACK OF HEAD, BACK OF SHIRT AND BODY, no face, no atom logo on back. Do NOT mirror front-facing gestures. Preserve same character throughout.

## 验证

逐帧检查交替、两帧抬膝修正、背身推压实景截图；10 幕加速连播至结尾，无脚本错误；触屏接触时站位与手的位置校验通过；鼠标点击人物暂停/继续、普通图与引导示例图放大通过；4 种手机横屏与桌面图面位置一致，竖屏暂停/恢复通过；减弱动态效果与进度回拖通过。
