(() => {
const slot=(n,x,y,w,h,opts={})=>({n,x,y,w,h,...opts});
window.STATIC_LAYOUTS=[
 {title:'ABOUT ME',green:true,slots:[]},
 {title:'从柱身，长成树冠。',en:'FROM COLUMN TO CANOPY',slots:[slot(2,.025,.251,.688,.635,{}),slot(5,.697,.306,.278,.439,{diagram:true,rotate:5})],labels:[['东基中海环宇城',.052,.252,.22,.058],['格栅 × 灯光',.835,.855,.12,.04,'light']]},
 {title:'让故事，进入空间。',en:'SIJING · A STORY BECOMES SPACE',slots:[slot(18,.167,.214,.661,.27,{diagram:true}),slot(21,.022,.55,.394,.34,{diagram:true}),slot(23,.445,.55,.528,.342)],labels:[['STORY → SPACE',.728,.102,.205,.07],['01',.26,.502,.07,.042],['02',.482,.502,.07,.042],['03',.693,.502,.07,.042],['西中庭 · 结构研究',.035,.90,.38,.033],['东中庭 · 方案效果',.46,.90,.45,.033]]},
 {title:'四层，四种体验。',en:'NONGHAICHAO · FOUR WORLDS',green:true,slots:[slot(31,.033,.375,.505,.445,{}),slot(35,.545,.102,.252,.273,{diagram:true,rotate:3}),slot(38,.597,.583,.35,.293,{})],labels:[['7F',.043,.347,.08,.105,'floor'],['进化蓄能场',.05,.448,.08,.11],['8F',.482,.15,.07,.055,'floor'],['平行宇宙',.484,.214,.062,.08],['9F',.628,.445,.068,.066,'floor'],['共享座席',.702,.452,.117,.05],['10F',.568,.666,.065,.073,'floor smallFloor'],['派对礼盒',.567,.755,.07,.07],['7F → 8F → 9F → 10F',.20,.24,.20,.043],['用不同主题，组织垂直体验',.82,.207,.14,.09]]},
 {title:'到达之后，留一会儿。',en:'ARRIVE · PAUSE · CONNECT',slots:[slot(49,.025,.255,.622,.632,{}),slot(48,.665,.12,.305,.46,{diagram:true}),slot(53,.689,.64,.28,.255)],labels:[['概念方案',.045,.864,.136,.035],['原动线研究',.695,.139,.16,.04],['低区 · 社交共享',.706,.901,.18,.024]]},
 {title:'33 → 48，重新组织。',en:'FUZHOU / B2 · RETAIL PLAN STUDY',slots:[slot(59,.061,.328,.37,.389,{diagram:true}),slot(60,.515,.307,.408,.394,{diagram:true})],labels:[['原始布局',.09,.288,.12,.04],['调整方案',.53,.288,.12,.04],['33',.15,.729,.19,.082,'number'],['ORIGINAL',.16,.82,.17,.035],['48',.645,.719,.17,.09,'number'],['PROPOSED',.645,.824,.17,.035]]},
 {title:'让空间，值得停留。',en:'FUZHOU / B2 · SCHEME B',slots:[slot(63,.029,.268,.592,.61,{}),slot(110,.651,.61,.148,.231),slot(62,.814,.616,.158,.22)],labels:[['方案 B · 前区空间',.033,.283,.158,.061],['方案 B · 本人设计',.674,.341,.21,.083,'scope'],['空间设计与表达',.69,.443,.24,.058],['前区停留空间',.67,.876,.091,.035],['市集活动空间',.83,.876,.09,.035]]},
 {title:'用人的尺度，组织空间。',en:'PINGHE · HUMAN SCALE',slots:[slot(70,.036,.262,.566,.56,{}),slot(74,.638,.155,.302,.335,{}),slot(71,.637,.549,.294,.29,{})],labels:[['幼儿园 · 阅读空间',.096,.259,.163,.043,'light'],['阅读与交流',.907,.183,.055,.081],['音乐厅',.913,.552,.057,.055]],book:true},
 {title:'想清楚，再表达出来。',en:'MODELING · VISUALISATION · EDITING',slots:[slot(83,.036,.329,.283,.357,{diagram:true,rotate:3}),slot(93,.344,.278,.325,.48,{rotate:-2}),slot(98,.685,.386,.289,.303,{rotate:6})],labels:[['SketchUp',.079,.282,.14,.042],['Enscape',.399,.258,.095,.042,'light'],['AI',.747,.326,.12,.042]]},
 {title:'感谢观看。',en:'THANK YOU.',green:true,slots:[slot(2,.39,.505,.196,.257),slot(38,.592,.517,.176,.27),slot(70,.781,.54,.183,.246)],labels:[],ending:true}
];
// Match each label's baseline to its physical paper/clay backing.
const labelAngles={1:[-4.5,-2],2:[1.5,0,0,0,0,0],3:[-10,-10,-9,-9,2,2,-8,-8,-2,-7],4:[-3,2.5,2],5:[0,0,0,0,0,0],6:[-8,-2,-4,-5,3],7:[-4,-7,-8],8:[-6,-12,-5]};
for(const [i,angles] of Object.entries(labelAngles))angles.forEach((a,k)=>STATIC_LAYOUTS[i].labels[k][6]=a);
// Full photographic rectangles sit behind traced foreground contours.
Object.assign(STATIC_LAYOUTS[1].slots[0],{x:.024,y:.235,w:.7,h:.67});
Object.assign(STATIC_LAYOUTS[3].slots[0],{x:.028,y:.35,w:.525,h:.50});
Object.assign(STATIC_LAYOUTS[4].slots[0],{x:.024,y:.225,w:.624,h:.667});
Object.assign(STATIC_LAYOUTS[4].slots[2],{x:.675,y:.625,w:.30,h:.29});
Object.assign(STATIC_LAYOUTS[7].slots[0],{x:.034,y:.25,w:.57,h:.58});
})();
