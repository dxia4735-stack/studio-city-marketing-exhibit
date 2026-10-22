(function(){'use strict';
window.SC_DATA={
  parts:{
    phase1:{name:'一期酒店',short:'一期酒店',kicker:'ARCHITECTURE / PHASE 1',kind:'building',copy:'宽阔的弧形、折线翼楼，中央高处保留竖向 8 字开孔；窗带、立面竖线与层叠冠部按官方照片简化。',evidence:'建筑形态有官方照片支持；平面参考 OSM 酒店轮廓。未区分尚未独立核定的两翼塔名。',question:'营销问题：房型、同行人数与次日体验的信息，能否共同支持家庭的住宿决策？',source:'https://www.leighorange.com/project/studio-city/',sourceLabel:'建筑师 · 一期'},
    reel:{name:'影汇之星',short:'影汇之星',kicker:'LANDMARK / GOLDEN REEL',kind:'attraction',copy:'固定桁架位于一期酒店之间；17 个竖直观景厢沿同一条不交叉的 8 字外缘连续运行。轨道外挑与曲线尺寸为示意参数，演示速度非实测。',evidence:'官方列有17个观景厢；130米是所处高度信息，本模型未将其当作轮径。',question:'营销问题：观景体验如何与到访时段、餐饮和住宿安排衔接？',source:'https://www.studiocity-macau.com/sc/attractions/golden-reel',sourceLabel:'官方 · 影汇之星'},
    northTower:{name:'二期北塔',short:'二期北塔',kicker:'ARCHITECTURE / PHASE 2 NORTH',kind:'building',copy:'独立的现代玻璃塔，以细竖向线条、折线幕墙和退台冠部表现二期的建筑语言。与一期之间保留地理间距。',evidence:'北侧位置经北朝上卫星图核对；W酒店POI支持但不足以独立确认完整塔界，本页暂用方位名称。',question:'营销问题：不同酒店产品怎样让家庭看清服务、位置和体验组合的差异？',source:'https://www.leighorange.com/project/studio-city-phase-2/',sourceLabel:'建筑师 · 二期'},
    southTower:{name:'二期南塔',short:'二期南塔',kicker:'ARCHITECTURE / PHASE 2 SOUTH',kind:'building',copy:'位于二期北塔的西南侧，采用独立的玻璃体量、波折竖线与层叠顶部；没有附加8字结构。',evidence:'两塔南北错列来自地图与照片交叉核对；基部位置和高度为近似，未把酒店POI当塔中心。',question:'营销问题：酒店与园区之间的动线和购买信息，是否符合家庭对停留节奏的预期？',source:'https://www.leighorange.com/project/studio-city-phase-2/',sourceLabel:'建筑师 · 二期'},
    indoor:{name:'室内水乐园馆体',short:'室内水乐园',kicker:'WATER PARK / INDOOR',kind:'attraction',copy:'西侧金色棱面馆体与局部外露的红紫滑道，依据官方园区图与二期照片匹配。红紫 Teleport Tower 属于室内分区。',evidence:'室内、户外分类以官方图为准。中央未分类的灰色矩形屋顶没有被标成水乐园。',question:'营销问题：家庭怎样找到室内项目的适龄、身高、开放及票务规则？',source:'https://www.studiocity-macau.com/en/attractions/studio-city-water-park',sourceLabel:'官方 · 水乐园分区图'},
    outdoor:{name:'露天水乐园',short:'露天水乐园',kicker:'WATER PARK / OUTDOOR',kind:'attraction',copy:'园林台地上的蓝、青、黄色滑道、池面与河道，用作露天园区的识别特征。与室内馆体及酒店泳池分别建模。',evidence:'蓝青黄 Highpoint Twister 与园林水域可在官方图和卫星图中匹配；边界、开放日历未经测绘。',question:'营销问题：天气、参与规则和停留长度，如何影响室内外体验的选择与替代安排？',source:'https://www.studiocity-macau.com/en/attractions/studio-city-water-park',sourceLabel:'官方 · 水乐园'},
    pool:{name:'酒店泳池与园林',short:'酒店泳池',kicker:'HOTEL LANDSCAPE / DISTINCT FROM WATER PARK',kind:'landscape',copy:'一期与二期之间的开放池面和园林，以独立的低矮水域表现。它没有被并入滑道水乐园的建筑组。',evidence:'池面相对位置可由卫星图观察；泳池的当前酒店使用权限、设施名称和开放条件须再查官方信息。',question:'营销问题：家庭是否能分清酒店设施与需另行核对的水乐园产品及使用规则？',source:'https://www.studiocity-macau.com/en/hotels',sourceLabel:'官方 · 酒店信息入口'},
    dining:{name:'餐饮与商业区标记',short:'餐饮 · 区域标记',kicker:'PROGRAMME MARKER / NOT A SEPARATE BUILDING',kind:'marker',copy:'用一个区域标记提示综合体内部的餐饮与商业触点。标记不代表独立真实建筑、具体餐厅入口或完整楼层范围。',evidence:'官方项目介绍确认零售与餐饮功能；点位仅供营销分析，不能用来现场导航。',question:'营销问题：菜单、儿童选项、用餐时段与预订条件，怎样连接体验前后的休息需求？',source:'https://www.leighorange.com/project/studio-city-phase-2/',sourceLabel:'建筑师 · 零售与餐饮'},
    entertainment:{name:'室内娱乐区标记',short:'娱乐 · 区域标记',kicker:'PROGRAMME MARKER / CINEMA & ENTERTAINMENT',kind:'marker',copy:'西侧裙房的功能标记提示影院等室内娱乐；它不是新编造的一座娱乐场馆，亦不把整个馆体都归为同一项目。',evidence:'二期官方建筑介绍列有多厅影院；OSM影院POI仅作区域提示，参与规则与档期仍须核实。',question:'营销问题：如何按家庭兴趣说明室内体验、适龄条件及与其他项目的时间衔接？',source:'https://www.leighorange.com/project/studio-city-phase-2/',sourceLabel:'建筑师 · 二期影院'}
  },
  segments:{
    young:{name:'幼儿家庭',index:'01 / SEGMENT',description:'需要照护与休息节奏有弹性；具体体验是否适用，须逐项核对。',need:'休息方便 · 节奏从容 · 室内备选',position:'为有幼儿同行的家庭整理清楚、可灵活调整的一日或短住选择。',target:'先检验照护条件与参与规则，再了解家长的行程偏好。',dayProduct:'适用的室内体验＋餐饮休息点，说明替代安排',nightProduct:'酒店休息锚点＋适用的室内体验＋弹性餐饮',dayRoute:['indoor','dining'],nightRoute:['phase1','indoor','dining']},
    school:{name:'学龄家庭',index:'02 / SEGMENT',description:'可以检验共同参与、多种体验和停留节奏之间的组合需求。',need:'共同参与 · 多元体验 · 节奏安排',position:'为学龄家庭规划一段从共同体验到灵活选择的亲子短假。',target:'先检验产品适配，再看可触达性与实际出游意愿。',dayProduct:'水上体验＋影汇之星＋餐饮，组成可选一日路线',nightProduct:'酒店＋水上体验＋影汇之星＋餐饮，拆分两日节奏',dayRoute:['outdoor','reel','dining'],nightRoute:['phase1','outdoor','reel','dining']},
    multi:{name:'跨代同行',index:'03 / SEGMENT',description:'同行者的兴趣和体力可能不同，路线应呈现共享体验与弹性休息。',need:'休息弹性 · 共享时刻 · 不同节奏',position:'为多代同行家庭呈现可共同参与、也允许分段休息的行程选择。',target:'访谈人数、休息和房型需要，再判断是否独立设计组合。',dayProduct:'观景体验＋餐饮停留，允许选择参与强度',nightProduct:'酒店休息空间＋观景体验＋弹性餐饮，预留自由时间',dayRoute:['reel','dining'],nightRoute:['phase1','reel','dining']}
  },
  stays:{day:{name:'一日体验'},overnight:{name:'留宿一晚'}},
  strategies:{
    journey:{name:'旅程模块化',channel:'专题行程页 → 官方产品信息与预订入口',suffix:'的可选路线卡',promotion:'用一日与留宿路线说明项目衔接；开放、活动与库存另行核验。'},
    content:{name:'情境内容触达',channel:'家庭情境短内容 → 官方专题页 → 产品预订入口',suffix:'的家庭情境内容',promotion:'按家庭情境介绍真实可参与的体验，把规则与预订链接到官方页。'},
    service:{name:'预订信息服务',channel:'官方信息页与客服常见问题（需确认承接）',suffix:'的行前信息清单',promotion:'整理适用规则、项目衔接和家庭常见问题，核对服务承接方式。'}
  },
  environments:{
    macro:{kicker:'MACRO / PESTLE',heading:'把外部力量变成研究任务。',summary:'以下是资料维度，不是已经验证的市场趋势结论。',items:[['P','政策与公共服务','核对入境、家庭服务与旅游政策对行程规划的影响。'],['E','家庭预算','收集总支出预期，以及住宿、娱乐和餐饮之间的取舍。'],['S','家庭结构与习惯','比较孩子年龄、同行者和周末/假日的出游方式。'],['T','信息与预订技术','走查官方信息、预订入口及移动端跳转。'],['E','天气与季节','核查室内外安排，以及天气变化时的替代信息。'],['L','规则与安全','复核票务、儿童年龄/身高、场馆和住宿条款。']]},
    micro:{kicker:'MICRO / PARTICIPANTS',heading:'一次购买由谁共同影响？',summary:'目前未完成同口径竞品测量；先把参与者与验证问题列清楚。',items:[['企','企业与产品协同','酒店、娱乐、餐饮如何组成清楚的一段旅程？'],['家','购买家庭','年龄、照护结构与停留长度对应哪些实际需要？'],['竞','竞争与替代','综合度假村、家庭景点和单项产品各解决什么需要？'],['渠','信息与销售渠道','从内容到咨询、官方信息与预订怎样衔接？'],['供','服务伙伴','交通、演出、餐饮及现场服务有哪些规则与边界？']]}
  }
};
}());
