# 步态与转场动作 · v14

使用内置 imagegen 新生成两组透明动作素材：walk-cycle.webp（8 张步态）、page-gestures.webp（8 张推页、松手、转向与停步姿势）。不覆盖旧图集。以下记录实际使用的提示词。

## 接入与修复

- 走路替换为接地、下沉、经过支撑脚、抬腿等八帧循环；按行走距离推进，左右方向均使用同一循环。
- 原推页姿势的鞋子越过了旧固定格子边界。新素材按完整连通轮廓标注区域，通过 walk-regions.json 与 page-regions.json 读取整个人物，避免硬切格子导致断脚。
- 行走以髋部为水平锚点，脚底为垂直锚点，保持人物体积；转场增加完整轮廓的舞台边缘保护。
- 推页使用预备、伸手、接触、发力、释放、收手、停稳序列，替换旧推页、支撑和拉回姿势；降低整个人物的夸张倾斜。
- 高位小屏用抬高手势，跨越胸部高度的屏幕用较自然的肩胸部触屏手势。

## 检查

复现东基到泗泾的横向转场并截图，完整双鞋可见；全部内容页触屏反馈在对应屏幕范围内，操作中人物根位置保持；0.05 秒步长检查未发现突然位置跳变。十幕加速连播完整结束，手机、减少动态效果和回拖正常，无脚本错误。

## 步态生成提示词

Production ANIMATION WALK CYCLE sprite sheet, same clay-cartoon adult young woman from reference (identity/style only). Exactly 8 full-body animation frames, regular 4 columns by 2 rows, square atlas. Transparent background with no floor, no shadows outside silhouette, no text/grid. Each cell portrait 1:2, completely separated with generous transparent padding; no fingertip, shoe or hair may reach any cell edge. Keep EXACT same character identity, face, clothing charcoal t-shirt small lime atom emblem, loose dark jeans, cream-black sneakers, warm high-quality 3D clay cartoon rendering. SAME camera and character proportions and scale all 8 cells. She faces SCREEN RIGHT in a near side view, slightly showing her face, walking calmly. THIS MUST BE A REAL COMPLETE CYCLIC WALK, not eight copies of a spread-leg pose. The legs MUST visibly ALTERNATE, with clearly different silhouettes including narrow passing poses. First four frames RIGHT FOOT leads; second four LEFT FOOT leads. Label-free sequence read left-to-right then next row: 1 CONTACT: right leg extended forward heel touches imaginary ground, left leg back toe touches. 2 DOWN: weight on bent right forward leg, left heel lifting, hips slightly lower. 3 PASSING: right leg straight under pelvis supports, LEFT KNEE BENT and moving past right leg, lifted left shoe beside supporting calf, legs close together; no spread legs. 4 UP: right support toe pushes, left knee forwards raised, hips slightly higher. 5 OPPOSITE CONTACT: LEFT leg forward heel touches, RIGHT leg extended back toe touches, opposite arm swing from frame1. 6 OPPOSITE DOWN: left forward knee bears weight, right heel lifting. 7 OPPOSITE PASSING: left leg under pelvis supports, RIGHT KNEE BENT passes left calf, lifted right shoe beside supporting calf, legs close together. 8 OPPOSITE UP: left support toe pushes, right knee forwards raised. Arms swing subtly opposite to advancing leg. Head and torso remain consistent, no waving or expressions changing wildly. Do not mirror the same pose across all cells; the passing frames3 and7 MUST be narrow bent-knee poses. Keep shoes baseline same imaginary ground except swing foot lifted. Clean alpha, no props.

## 推页生成提示词

Production character acting sprite atlas for SAME clay cartoon adult young woman in reference. Identity and outfit locked: short layered brown hair, charcoal oversized t-shirt tiny lime atom logo, loose dark jeans, black cream sneakers, warm handmade 3D clay style. Exactly EIGHT isolated full-body sprites arranged 4 columns x2 rows on transparent background, square sheet. Every entire shoe, hand, finger and hair must have wide transparent margin inside its cell; NO overlap, no text, no grid, no scenery, no floor. Same height, camera, face and body proportions, consistently looking SCREEN RIGHT in three-quarter side view. Comfortable realistic stance, compact feet less than shoulder width, never stretching feet to cell edges. This is a sequential gentle page-moving gesture for a website stage; no physical prop shown. Pose1 palms preparing at chest, elbows bent, planted feet. Pose2 both hands reaching halfway forward at shoulder/chest height, body straight. Pose3 both palms contact imaginary vertical page to right, arms extended with elbows slightly soft, body leans forward only slightly, both shoes fully visible. Pose4 gentle push with slight weight transfer, rear heel raised just a little, knees soft, hands same height, COMPACT STANCE AND COMPLETE SHOES. Pose5 release contact, palms soften, elbows bend a little, feet planted. Pose6 retract both hands to near chest. Pose7 relaxed three-quarter turn toward viewer, arms lowering, feet planted. Pose8 natural stopping pose after walking: knees softly settled, arms down, one foot a little forward, eyes attentive. Expressions understated and pleasant. Keep all body/feet sizes stable and large safety margins. No cropped or disconnected limbs. Genuine alpha transparency. Avoid giant stride, stretched limbs, extreme lean.
