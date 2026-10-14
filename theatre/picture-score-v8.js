(() => {
'use strict';
// Coordinates are composition envelopes on the 1672 × 941 stage.
// The renderer fits the complete image inside each envelope before animating it.
const k=(t,x,action='look',face=-1,y=900)=>({t,x,y,action,face});
const hero=[65,245,1160,585], detail=[90,255,1110,550];
const photo=(n,slot,start,rise,hold,fall,box,extra={})=>({n,slot,start,rise,hold,fall,box,...extra});
const set=(i,props,route,note)=>Object.assign(PERFORMANCE_SCORE[i],{props,route,pictureDirection:note,focus:[]});

set(1,[
 photo(2,0,2.6,1.15,27.7,1.35,hero,{layouts:[{t:11.8,until:13.2,box:[65,365,490,300]},{t:23.6,until:24.8,box:[65,410,340,230]}]}),
 photo(5,1,14.3,1.05,6.7,1.15,[590,250,650,500],{diagram:true}),
 photo(3,null,24,1.1,6.1,1.1,[450,255,800,530],{diagram:true,from:[1120,790,110,60],dockSlot:1})
 ],[k(0,1450,'reach'),k(1.6,1450,'climb',-1,900),k(2.6,1450,'balance',-1,810),k(4.2,1450,'present',-1,810),k(10.8,1450,'climb',-1,810),k(11.8,1450,'look'),k(13.3,1450,'pull'),k(15.5,1450,'present'),k(21.7,1450,'push'),k(23.5,1450,'pull'),k(25.5,1450,'inspect'),k(31.2,1450,'push'),k(33.3,1450,'look'),k(40,1380,'walk'),k(43.3,1380,'dust')],
 '整体先读清；整体退到左侧，右侧先单元后多视图；全部归位后再讲参与范围。');

set(2,[
 photo(18,0,1.8,.95,7,.9,[130,235,1110,310],{diagram:true}),
 photo(20,null,12.1,1.05,6.8,1.05,hero,{from:[80,770,165,90],dockSlot:1}),
 photo(21,1,21.9,1,8.1,1.1,[70,270,620,490],{diagram:true}),
 photo(23,2,26.2,.9,3,.9,[725,340,530,325]),
 photo(24,null,33.1,1.05,5.2,1.1,[70,265,1170,510],{diagram:true,from:[1080,775,160,85],dockSlot:2})
 ],[k(0,1400,'present'),k(1.1,1400,'touch'),k(3,1400,'look'),k(10.2,1400,'push'),k(11.7,1400,'pull'),k(13.5,1400,'present'),k(20.4,1400,'look'),k(21.2,1400,'touch'),k(23,1400,'inspect'),k(26.2,1400,'present'),k(31.5,1400,'look'),k(32.4,1400,'pull'),k(34.5,1400,'present'),k(39.4,1400,'push'),k(42,1380,'brace')],
 '故事横条 → 四月投标效果 → 十二月结构与效果并读 → 剖面核对 → 全页回看。');

set(3,[
 photo(31,0,3,.95,8.6,1.1,[65,285,1150,520]),
 photo(35,1,15.2,.9,4.3,.85,[230,350,620,430],{diagram:true}),
 photo(36,null,20.3,.85,4.5,.85,[95,275,1120,530],{from:[1040,770,180,100],dockSlot:1}),
 photo(39,null,27.7,.9,4.1,.85,[230,350,500,430],{diagram:true,from:[1080,780,170,70],dockSlot:2}),
 photo(42,null,30.1,.95,6.6,1.1,[755,365,500,320],{from:[1080,780,170,90],dockSlot:2}),
 photo(38,2,40,1.1,5.1,1.2,[65,255,1160,565])
 ],[k(0,1450,'present'),k(2.3,1450,'touch'),k(4.2,1450,'look'),k(13.5,1450,'brace'),k(14.6,1450,'climb'),k(16.3,1450,'balance',-1,805),k(19.8,1450,'present',-1,805),k(25.7,1450,'climb',-1,805),k(27,1450,'pull'),k(29.1,1450,'inspect'),k(30.1,1450,'present'),k(37.8,1450,'push'),k(39.5,1450,'touch'),k(41.3,1450,'look'),k(47.5,1380,'walk'),k(49,1380,'reach')],
 '七层单图；八层平面与九层空间分开读；十层平面和舞台并读；最后回到公共界面。');

set(4,[
 photo(49,0,2.3,1,7.2,1.1,[60,320,735,400]),
 photo(48,1,5,.9,4.6,1.1,[825,265,420,360],{diagram:true}),
 photo(53,2,12.3,1.1,6.5,1.05,hero),
 photo(50,null,22.2,1.1,8.5,1.1,[80,260,675,535],{diagram:true,from:[1110,775,145,95],dockSlot:1}),
 photo(51,null,25.3,.9,5.7,1.1,[795,390,450,330],{from:[1110,775,145,95],dockSlot:2})
 ],[k(0,1450,'look'),k(1.6,1450,'touch'),k(3.5,1450,'present'),k(5,1450,'inspect'),k(10.8,1450,'look'),k(11.7,1450,'pull'),k(13.6,1450,'sit',-1,805),k(19.6,1450,'sit',-1,805),k(20.6,1450,'look'),k(21.5,1450,'pull'),k(23.6,1450,'inspect'),k(25.4,1450,'present'),k(32.1,1450,'push'),k(34.4,1450,'look'),k(42,1380,'walk'),k(44,1380,'brace')],
 '大堂与L形动线并读；共享空间独立展示；构件分解与实体模型并置；收回概念总览。');

// The plan comparison depends on stable scale and simultaneous visibility.
PERFORMANCE_SCORE[5].props=[];
PERFORMANCE_SCORE[5].focus=[[4.8,9,0],[10,16.8,1],[18.2,23.7,1]];
PERFORMANCE_SCORE[5].route=[k(0,1470,'look'),k(4.6,1470,'present'),k(9.6,1470,'touch'),k(11,1470,'inspect'),k(17.5,1470,'present'),k(25.5,1420,'reach')];
PERFORMANCE_SCORE[5].pictureDirection='两张平面始终同屏，保持比例基准与33/48标签；只改变注意力，不反复拉大。';

set(6,[
 photo(63,0,2.5,1.1,5.2,1.05,hero),
 photo(66,null,11.55,1,5.2,1.05,hero,{from:[1130,780,140,80],dockSlot:0}),
 photo(63,0,19.55,1.1,8.3,1.1,hero),
 photo(110,1,31.8,.95,3.55,1.1,[65,315,560,345]),
 photo(62,2,31.8,.95,3.55,1.1,[670,315,560,345])
 ],[k(0,1450,'present'),k(1.8,1450,'touch'),k(3.8,1450,'look'),k(10.2,1450,'pull'),k(12.8,1450,'present'),k(18.5,1450,'look'),k(19.1,1450,'touch'),k(20.9,1450,'inspect'),k(29.1,1450,'push'),k(31.1,1450,'present'),k(36.9,1400,'walk'),k(38,1400,'brace')],
 '固定同一主图位置，随讲述换空间；结尾把停留区和市集并排，四张方案B图均得到展示。');

set(7,[
 photo(70,0,2,.95,6.8,1.05,[80,270,1130,535]),
 photo(67,null,12.1,.8,2.9,.8,[80,275,1130,535],{from:[1090,785,160,85],dockSlot:0}),
 photo(71,2,17,.85,3.8,.85,[65,300,1160,500]),
 photo(74,1,23.1,1,7.1,1.1,hero)
 ],[k(0,1450,'inspect'),k(1.4,1450,'touch'),k(3.2,1450,'look'),k(10.4,1450,'push'),k(11.5,1450,'pull'),k(13.1,1450,'present'),k(16.5,1450,'touch'),k(18,1450,'look'),k(22.6,1450,'pull'),k(24.4,1450,'present'),k(31.5,1450,'push'),k(34,1450,'look'),k(43,1380,'walk'),k(46,1380,'pull')],
 '按照儿童阅读、教室、音乐厅、会客厅依次看图；第三段结束归位，最后安静回看全页。');

const stage=[80,245,1150,535];
set(8,[
 photo(113,0,1.8,.8,2.1,.65,[130,270,1040,510],{diagram:true}),
 photo(119,0,5.7,.8,3.15,.75,[100,265,1100,515],{diagram:true}),
 photo(93,1,11.55,.9,3.05,.4,stage,{out:'swap'}),
 photo(111,1,15.5,.4,3.45,.4,stage,{in:'swap',out:'swap'}),
 photo(112,1,19.35,.4,2.65,1.05,stage,{in:'swap'}),
 photo(98,2,24.05,.85,3.6,.4,stage,{out:'swap'}),
 photo(120,2,28.5,.4,4.1,1.1,stage,{in:'swap'})
 ],[k(0,1450,'present'),k(1.1,1450,'pull'),k(2.9,1450,'inspect'),k(5.3,1450,'present'),k(10.4,1450,'look'),k(11,1450,'touch'),k(12.8,1450,'present'),k(15.5,1450,'look'),k(19.5,1450,'inspect'),k(23.3,1450,'look'),k(23.8,1450,'touch'),k(25.3,1450,'present'),k(28.6,1450,'look'),k(33.1,1450,'push'),k(35,1450,'present'),k(40.3,1450,'touch'),k(43.5,1380,'walk'),k(46,1380,'brace')],
 '模型抽取两张；Enscape共用固定画幅连续换图；AI同样稳定展示；34秒前收净图片，再引导原片链接。');

// Actor stays outside the reading envelope; brief climbs and seated rests preserve the stage play.
for(let i=1;i<=8;i++){
 const s=PERFORMANCE_SCORE[i];s.entry=[s.route[0].x,s.route[0].y];s.exit=[s.route.at(-1).x,s.route.at(-1).y];
}
})();
