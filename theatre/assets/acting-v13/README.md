# 屏幕表演动作 · v13

使用内置 imagegen，根据现有 acting-atlas.webp 的角色造型生成 4 × 3、共 12 张透明姿势帧；保存为 screen-actions.webp。保留原动作图集，新增第三组供屏幕表演调用。

## 接入

- 预备、看向目标、抬手、接触、滑动、收手分阶段执行，采用按时间取样的确定性编排；回拖可恢复对应姿势。
- 新图集以脚部中心作为锚点，统一角色比例。滑动期间人物根位置不再左右滑移。
- 触屏反馈按当前姿势的指尖定位；左右滑屏根据人物朝向选择接触与展开手掌的先后。
- 行走循环按累计路程计算；连续操作优先分配行走时间，再安排预备与收手。
- 等待加入轻微点头、看图与重心变化；转向增加短暂侧身压缩缓冲。
- 封面和结尾大人物不改；原静态排版与图面时间表保留。

## 验证

八个内容页 211 个阶段样本无越界或无效姿势，另截图检查各页点击与滑动关键帧。逐个操作检查脚底根位置保持、手部反馈位于对应屏幕；全场 0.05 秒步长检查无突然位置跳变。十幕加速连播完整结束，手机无横向溢出，减少动态效果与进度回拖正常，无脚本错误。

## 最终生成提示词

Create a production sprite atlas for the SAME clay-cartoon young woman in the reference. Reference is character identity/style ONLY, not its pose layout. Exactly 12 isolated FULL BODY sprites in a regular 4 columns by 3 rows grid, transparent background, no floor, no props, no text, no grid marks. Each cell equal sized; ample transparent margins, every shoe and finger fully inside its cell, no overlap. Same character scale in every cell, shoes baseline at same relative height. Preserve identical face, dark short layered hair, charcoal oversized t-shirt with tiny lime atom logo, loose dark jeans and black cream sneakers, warm realistic handmade 3D clay/cartoon texture. Character faces SCREEN LEFT in a soft three-quarter view in ALL cells. Camera straight on, no perspective variations. These are SMALL transitional acting poses, body proportions and planted feet nearly identical. Read left-to-right top-to-bottom: 1 neutral planted stance arms relaxed; 2 eyes looking toward upper left screen with slight attentive head turn; 3 preparing high touch, elbow bent, hand lifted to chest; 4 reaching upper left, index pointing halfway toward upper-left target, elbow still bent; 5 high screen contact, index extended toward upper-left at roughly top-of-head height, gentle lean; 6 high-screen horizontal swipe, same raised arm reaching a little farther left, open relaxed fingers, body planted; 7 lower screen contact, leftward pointing index at shoulder/chest height, feet planted; 8 lower screen swipe, same arm a little farther left, palm toward imaginary screen, feet planted; 9 high reach retract, elbow folded, hand near shoulder, shoulders relaxed; 10 low reach retract, hand returning near chest then downward; 11 soft listening nod, arms naturally relaxed; 12 relaxed weight-shift, one hand resting lightly near trouser side, looking toward audience but head still turned slightly left. Keep all twelve similar slim adult chibi proportions to reference, large head but not baby, pleasant understated expressions, no exaggerated grins. High-quality clean alpha silhouette, no opaque backdrop. Atlas portrait 2:3 overall ratio with 4x3 cells each portrait 1:2.
