# v19：固定角色的连续步态与闭口修正

## 素材与人物一致性

使用内置 imagegen，以用户原始人物定稿为参考，生成可绑定的衣袖、手臂、裤腿和骨盆素材；另生成固定侧向头脸与躯干。行走全程使用同一张头脸/躯干、同一条近腿纹理和同一条远腿纹理，不切换整个人物姿势，不作人物变形插帧或整条裤腿横向拉扯。

- walk-parts.webp / walk-parts.json：四肢与骨盆组件，保留透明通道。来源 exec-a495dd65-dd20-4f8d-a788-dc021d9db1c2.png。
- walk-torso.webp / walk-torso-region.json：固定的侧向头脸与躯干，自然闭口。来源 exec-8e22ff3d-651f-44b7-a192-cad7acbff548.png。
- basic-closed.webp / basic-closed-regions.json：仅启用原露齿手势对应的闭口版本，其他七个姿势继续引用原图，避免连带改变。来源 exec-f8f0e820-db0f-402b-82d7-9bc1bd48ac01.png。
- 原有 screen、point、turn-push 已逐套检查，保持现有闭口。封面及结尾大人物不改。

## 动作

walk-motion-v19.js 计算连续足迹与两段腿部关节，保持大腿与小腿长度不变。双腿相差半周期；支撑脚与身体前移抵消；摆动脚低抬、脚跟落地、脚尖离地。骨盆高度由可达腿长决定，避免用伸缩腿解决够不到地面的情况。原子标志、脸与发型始终来自固定图像。

衣裤在关节附近做局部平滑蒙皮，头脸和躯干不变形。WebGL 与 Canvas 后备使用相同的关节与蒙皮，不退回旧的整人换帧。普通行走放缓，并加入起步/收步的动作强度变化；不修改页面静态版式和已完成的转场方案。

## 采用的完整提示词

### 组件生成

Use case: identity-preserve. Animation-ready separated character parts atlas for the EXACT approved adult stylized woman in reference1, face as calm CLOSED-LIP smile in TOP LEFT of reference2. Preserve identical face proportions, almond eyes, layered outward-flipping dark brown hair, washed charcoal oversize shirt with lime atom emblem, loose charcoal denim pants and flat black/white canvas sneakers. Native camera SIDE THREE-QUARTER facing screen RIGHT. Make SIX SEPARATED clean 3D clay cutout parts in a spacious3-column x2-row atlas, TRUE TRANSPARENT ALPHA, NO background, floor, shadows, text or labels. Each cell exactly one isolated part: top-left HEAD+NECK+TORSO with shirt and short sleeves down to shirt waist hem, NO arms/hands below sleeves and no legs; top-middle NEAR entire bare arm from rounded upper-arm shoulder cap to relaxed CLOSED hand, hanging vertically straight, slight elbow bend; top-right FAR entire bare arm matching near arm, hanging vertically straight, slight elbow bend. Bottom-left ONE entire NEAR trouser leg, from rounded upper hip cap through knee down to complete attached canvas sneaker pointing RIGHT; leg almost perfectly vertical, relaxed standing, no other body parts. Bottom-middle ONE entire FAR trouser leg from rounded upper hip cap through knee to complete attached canvas sneaker pointing RIGHT; same lengths and widths, vertically straight, no other body parts. Bottom-right short PELVIS/HIP denim section waist down to crotch, with rounded overlapping upper-thigh stubs but NO long legs, no torso. These are clean tasteful animation-production cutout assets for one fully clothed character, NOT different characters or multiple full bodies. Body parts should have smooth full rounded overlapping joint ends and generous transparent margins; no jagged cuts, no painted joint outlines. Same soft warm lighting and material on all six pieces. The head and torso must be a single intact unit so it can stay identical during walking. Closed mouth, subtle gentle smile. IMPORTANT all skin/clothes remain exactly recognizable as the reference; no chibi shortening, no chunky running shoes.

### 固定侧向头脸和躯干

Targeted correction of ONLY the TOP LEFT head-and-torso part in image1. Image1 is the edit target six-part transparent animation sheet; image2 is the strict character identity reference. Preserve all other five parts exactly (arms, legs, pelvis), the sheet layout and transparent background. Change the camera angle of the top-left head+torso to a clear SIDE THREE-QUARTER view facing SCREEN RIGHT, about60degrees turned from front toward right. Nose, chin and chest point to the RIGHT, she looks in her direction of walking. Keep the exact approved woman's facial identity, hair silhouette, charcoal shirt texture, lime atom emblem, slim adult proportions and body scale. Relaxed CLOSED LIP small smile, no teeth. Same entire head, neck and shirt body down to hem, NO bare arms or hands below sleeves, NO legs. The shirt must have natural short sleeve openings, not gigantic long sleeves. Do not enlarge the head or shorten torso. No new body parts, labels, floor or background. Preserve genuine transparent alpha.

### 闭口定点修改

Precise facial-expression edit of this exact8-sprite transparent atlas. Change ONLY the mouth of the woman in BOTTOM LEFT cell (row2 column1, victory hand gesture): close her open toothy grin to a natural relaxed CLOSED-LIP soft smile matching her other poses. NO visible teeth, tongue or mouth interior. Preserve the rest of her face exactly, eyes, eyebrows, head, hair, ears, proportions, body, clothing, hands, fingers, shoes and pose. Preserve the other seven sprites EXACTLY pixel-for-pixel and original4columns x2rows layout, scale and spacing. Preserve genuine alpha transparency, remove no character details. Do not invent a background or floor.

## 检查

连续采样两段腿长误差小于 1e-10 舞台像素；整个周期没有足部位置突跳。逐幕站位连续性、触屏时手与屏幕对应、人物点击暂停与继续、图片放大经过检查。


10 幕加速连播至结尾无脚本错误；手机横屏、减弱动态效果、回拖正常。另以正常速度检查行走，并关闭 WebGL 验证 Canvas 后备显示正常。
