# v20：回到用户指定的完整人物帧

用户明确指定的基准是本轮上传的 codex-clipboard-5afab245-8828-4391-b1e2-364a22f2510a.png。

- original.webp 为该图的无损 WebP 编码；按非零 alpha 像素逐项比较，RGBA 完全一致。运行时第 1–4 帧直接来自它，上排不采用重新生成的版本。
- opposite.webp 为内置 imagegen 定点编辑结果，运行时仅使用下排第 5–8 帧：另一侧领步，配套调整摆臂与遮挡。来源 exec-f103adff-a593-45c9-ad46-c473278f3f74.png。
- 两份 regions.json 登记完整连通人物区域；不会按硬网格切掉鞋尖、手指。
- 行走改回完整人物的八帧循环。停用 v19 拆分驱动模块；行走帧不作分条倾斜、裤腿横向拉伸、蒙皮或光流形变。
- 原图头部位置用于整帧水平登记；保持原有讲述、人物点击暂停、图片放大、闭口修正和人物触发转场。

## 提示词

精确编辑这张8帧走路图集。用户指定回到这张原始人物，不重新设计人物。只修改下排四帧（第5、6、7、8帧）的左右腿前后关系及对应摆臂。上排四帧原样保留。下排所有头、脸、发型、嘴、脖子、躯干比例、衣服质感、图案、相机、人物尺寸和位置保持原样。镜头始终朝画面右方，不要镜像整个人物。
CRITICAL: TOP ROW is first half of walk, BOTTOM ROW must be OPPOSITE half. Camera-near leg = leg whose outside pants seam is visible, which occludes other leg. In frame5 BOTTOM LEFT the CAMERA-NEAR leg must be BEHIND on the LEFT of the body and the FAR leg must be leading FORWARD on RIGHT. Near arm swings FORWARD, opposite original top-left pose. Frame6 near leg trailing left starts lifting, FAR leg supports forward on right. Frame7 near knee passes FORWARD to the RIGHT of the planted far leg, near shoe visible IN FRONT OF far shin, not folded backwards behind same calf. Far leg supports under pelvis. Frame8 near leg swings FORWARD right preparing heel contact, far leg behind pushes off, near arm swings BACK. Frame8 then flows into ORIGINAL frame1. This is anatomy/occlusion and opposite-arm correction, NOT a new character or outfit or altered head. No high marching knees beyond original style, no widened strides. Preserve the beautiful whole-body original 3D/clay shading and silhouette, do not make a puppet or cutout collage. Keep exactly4columns x2rows, complete shoes/hair/hands with original margins. Remove brown backdrop to genuine transparent alpha, no floor or floor shadow, no text.

## 检查

逐帧查看网页实际绘制的八帧；验证上排原图有效像素无损；逐幕站位连续性、触屏站位与手的对应、人物点击暂停/继续、普通图与引导示例图放大通过。检查完整连播、手机横屏、回拖和减弱动态效果。
