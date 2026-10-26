// Classroom research hypotheses, adapted from the existing group assignment.
// Routes describe a possible product combination, not measured walking directions.
export const FAMILIES = {
  young: {
    name: '幼儿家庭',
    tag: '0–5 岁 · 分析分组',
    short: '把休息与照护放进旅程。',
    need: '休息方便 · 节奏从容 · 亲子游乐候选',
    reason: '把满纷乐园作为需要进一步核对的亲子游乐候选，与餐饮休息串联；目前只有现场宣传照片，不能据此认定适合所有幼儿。',
    color: '#e6ba86',
    dayRoute: ['familyPlay', 'dining'],
    nightRoute: ['hotel', 'familyPlay', 'dining'],
    position: '为有幼儿同行的家庭，整理清楚、可灵活调整的一日或短住选择。',
  },
  school: {
    name: '学龄家庭',
    tag: '6–12 岁 · 分析分组',
    short: '一起体验，也保留选择。',
    need: '共同参与 · 多元体验 · 节奏安排',
    reason: '用水上体验、观景与餐饮串起不同节奏，检验家庭是否看重共同参与和多样选择；实际参与仍需核对规则。',
    color: '#83cbd0',
    dayRoute: ['water', 'reel', 'dining'],
    nightRoute: ['hotel', 'water', 'reel', 'dining'],
    position: '为学龄家庭，规划一段从共同体验到灵活选择的亲子短假。',
  },
  multi: {
    name: '跨代同行',
    tag: '祖辈与孩子 · 分析分组',
    short: '共享时刻，允许不同节奏。',
    need: '休息弹性 · 共享时刻 · 不同节奏',
    reason: '围绕观景和餐饮安排共同停留，保留分段参与与休息的弹性；是否合适仍需了解同行者的体力与偏好。',
    color: '#bba8dc',
    dayRoute: ['reel', 'dining'],
    nightRoute: ['hotel', 'reel', 'dining'],
    position: '为多代同行家庭，呈现可共同参与、也允许分段休息的行程选择。',
  },
};

export const TOUCHPOINTS = {
  hotel: {
    name: '酒店',
    en: 'STAY',
    subtitle: '把住宿作为休息锚点',
    observation: '本组实拍呈现一期入口、酒店立面与二期塔楼；展示模型补充建筑形态的观察，但不是测绘资料。',
    meaning: '留宿方案可把酒店作为两日旅程的休息锚点，再检验房型与同行人数是否匹配。',
    missing: '家庭房型、入住人数、婴幼儿设施、实际动线与同日期价格。',
    mediaIds: ['phase1', 'phase2', 'exterior-video', 'display-model', 'display-model-video'],
  },
  water: {
    name: '水上体验',
    en: 'PLAY',
    subtitle: '共同参与，也考虑替代安排',
    observation: '从影汇之星俯拍的照片可见户外水乐园的滑道、河道、池面与休息区，呈现水上体验和建筑之间的空间关系。',
    meaning: '按家庭兴趣与参与条件组织体验，并在天气或项目不适用时准备替代安排。',
    missing: '当前开放安排、各项目年龄与身高要求、陪同规则及家庭购买条件。',
    mediaIds: ['water-overview', 'water-frame'],
  },
  reel: {
    name: '影汇之星',
    en: 'SEE',
    subtitle: '让观景成为共享时刻',
    observation: '本组实拍包括观景厢外部、厢内窗景、入口围栏与建筑外观，能够把地标形态连接到具体体验触点。',
    meaning: '把观景作为共同体验的候选触点，研究它如何与用餐、休息和到访时段衔接。',
    missing: '当前参与规则、等待时间、实际体验反馈与家庭到访意愿。',
    mediaIds: ['reel-cabins', 'reel-interior', 'reel-entry', 'exterior-video', 'phase1'],
  },
  dining: {
    name: '餐饮休息',
    en: 'PAUSE',
    subtitle: '给旅程留出停顿',
    observation: '华人冰室现场照片可见店名、桌椅及桌面菜单，商业街照片补充店铺与步行空间的环境。',
    meaning: '把用餐和休息放进体验之间，检验它能否帮助不同家庭安排自己的节奏。',
    missing: '儿童选项、座位与休息条件、营业时段、预订要求及家庭支出。',
    mediaIds: ['dining', 'retail'],
  },
  indoor: {
    name: '室内水乐园',
    en: 'DISCOVER',
    subtitle: '为行程保留可调整的选择',
    observation: '本组二期外观照片可见塔楼与低矮折面馆体；本次没有室内水乐园内部实拍，不能用建筑外观代替项目体验证据。',
    meaning: '将室内水上体验作为可选模块，先检查参与条件，再讨论天气变化时的替代安排。',
    missing: '具体项目适龄条件、身高限制、照护安排及可休息的位置。',
    mediaIds: ['phase2'],
  },
  pool: {
    name: '户外泳池分区',
    en: 'RELAX',
    subtitle: '辨认水域，也分清使用条件',
    observation: '俯拍照片前景的泳池可作为户外泳池分区的视觉参考，背景同时包含水乐园河道和游乐水域；照片没有证明其为酒店专享设施。',
    meaning: '把不同水域及其使用条件说清楚，帮助家庭核对房价、门票与设施的包含关系。',
    missing: '分区标识、当前入场权限、酒店住客权益、开放安排与票务包含条件。',
    mediaIds: ['water-frame', 'water-overview'],
  },
  entertainment: {
    name: '现场娱乐',
    en: 'ENJOY',
    subtitle: '让公共空间出现停留的理由',
    observation: '商场现场照片记录了身着演出服装的人员和周边商业环境，只能说明拍摄当时的现场活动情境。',
    meaning: '观察娱乐内容如何与逛街、餐饮等触点相邻，再研究家庭是否愿意为这些活动安排停留。',
    missing: '活动名称、主办方、固定档期、参与方式及家庭反馈。',
    mediaIds: ['performance', 'retail'],
  },
  familyPlay: {
    name: '满纷乐园',
    en: 'FAMILY PLAY',
    subtitle: '亲子游乐候选 · 先核对参与条件',
    observation: '商业街实拍可见满纷乐园宣传吊旗，证明现场有相关推广信息；照片并未进入场馆，不能证明内部设施或幼儿适用性。',
    meaning: '把宣传触点与亲子游乐需求联系起来，进一步核对项目、年龄、身高和陪同条件后再形成家庭建议。',
    missing: '场馆内部记录、具体项目、适龄与身高要求、陪同规则及当前票务条件。',
    mediaIds: ['retail'],
  },
};

const FIELD_CREDIT = '本组现场记录 · 2026年10月';
const photo = (id, file, title, alt, caption) => ({
  id, type: 'image', src: `/media/field/${file}`, poster: `/media/field/${file}`,
  title, alt, caption, credit: FIELD_CREDIT, kind: '现场照片',
});
const video = (id, file, title, alt, caption, durationSeconds) => ({
  id, type: 'video', src: `/media/field/${file}.mp4`, poster: `/media/field/${file}-poster.jpg`,
  title, alt, caption, durationSeconds, credit: FIELD_CREDIT, kind: '现场视频',
});

export const MEDIA_ITEMS = [
  photo('phase1', 'entrance.jpg', '一期入口与影汇之星',
    '新濠影汇入口招牌、棕榈树与一期酒店立面，高处可见金色 8 字观景装置',
    '从入口观察建筑与地标的联系；外观记录不代表房型、入住服务或客房景观。'),
  photo('phase2', 'phase2.jpg', '二期塔楼与折面馆体',
    '两座深色玻璃塔楼分立于折面馆体两侧，远处可见城市建筑与水岸',
    '二期建筑外观实拍。本次没有室内水乐园内部照片，外观不能代替项目体验记录。'),
  photo('display-model', 'display-model.jpg', '现场陈列的建筑模型',
    '店内陈列的一期建筑模型，弧形翼楼围绕中央 8 字开孔，前方配有园林和道路模型',
    '这是现场拍摄的展示模型，用于形态对照；不是建筑航拍、测绘或现状运营地图。'),
  photo('water-overview', 'water-overview.jpg', '从影汇之星看户外水乐园',
    '金色观景装置构架下方可见户外水乐园的滑道、蓝色水域、环绕河道和遮阳设施',
    '俯拍呈现户外游乐水域、河道和休息区域；不能据此判断开放时间、入场权益或适龄条件。'),
  photo('water-frame', 'water-frame.jpg', '构架内的户外水域全景',
    '透过金色圆弧构架俯视户外水域，前景深蓝泳池后方连着游乐水域、河道和二期建筑',
    '前景作为户外泳池分区的视觉参考；照片不证明该泳池为酒店专享，也不说明房价或门票包含关系。'),
  photo('dining', 'dining.jpg', '华人冰室的餐饮触点',
    '华人冰室店名和澳门主题灯牌下方摆放木质桌椅，桌上可见菜单和调味品',
    '可观察餐饮品牌呈现及部分桌椅环境；具体儿童餐、菜单价格、空位和服务条件仍需核对。'),
  photo('retail', 'retail.jpg', '商业街与满纷乐园宣传',
    '室内商业街两侧分布店铺，行人上方悬挂满纷乐园宣传吊旗',
    '这里只记录商业街上的满纷乐园广告，并非乐园内部实景；吊旗中的价格属于拍摄时宣传信息。'),
  photo('performance', 'performance.jpg', '商场中的现场活动情境',
    '商场通道中聚集身着黑白及粉色演出服装的人员，周边可见商店与宣传屏',
    '记录拍摄当时的活动情境；活动名称、演出档期和参与方式尚未确认，不能视为固定每日节目。'),
  photo('reel-cabins', 'reel-cabins.jpg', '影汇之星的观景厢与构架',
    '近距离仰拍多个影汇之星观景厢，旁边可见金色构架、防护网与建筑立面',
    '可观察观景厢外形及与构架的相邻关系；局部照片不用于确认总厢数或完整运行周期。'),
  photo('reel-interior', 'reel-interior.jpg', '从观景厢内部向外看',
    '观景厢内部的长椅、金属窗框和玻璃窗，窗外可见金色构架、二期塔楼及园区',
    '记录厢内可见空间与窗景；不能由单张照片推断所有厢体配置、舒适度或容量。'),
  photo('reel-entry', 'reel-entry.jpg', '影汇之星入口等候区域',
    '室内等候区域设有排队围栏、入口指示牌和现场提示牌',
    '可观察入口提示与排队设施；拍摄瞬间的空闲状态不代表通常等待时间。'),
  video('exterior-video', 'exterior', '一期立面与 8 字地标实拍',
    '竖屏镜头沿一期酒店立面移动，经过高处的金色 8 字观景装置',
    '建筑外观连续记录，完整查看保留竖幅；不据此测量高度、座舱速度或运营周期。', 13.966667),
  video('display-model-video', 'display-model', '绕行观察现场展示模型',
    '横屏镜头围绕室内陈列建筑模型移动，依次呈现一期立面、侧面和园林水域模型',
    '拍摄对象是现场展示模型，适合与数字沙盘对照；不能当作现状航拍或完整二期布局证据。', 37.5),
];

const PRODUCT_COMBINATIONS = {
  young: {
    day: '满纷乐园等亲子游乐候选 ＋ 餐饮休息点',
    overnight: '酒店休息锚点 ＋ 亲子游乐候选 ＋ 弹性餐饮',
  },
  school: {
    day: '水上体验 ＋ 影汇之星 ＋ 餐饮',
    overnight: '酒店 ＋ 水上体验 ＋ 影汇之星 ＋ 餐饮',
  },
  multi: {
    day: '观景体验 ＋ 餐饮停留',
    overnight: '酒店休息空间 ＋ 观景体验 ＋ 弹性餐饮',
  },
};

export function getRoute(family = 'school', stay = 'day') {
  const selected = FAMILIES[family] || FAMILIES.school;
  return [...(stay === 'overnight' ? selected.nightRoute : selected.dayRoute)];
}

export function getNarrative(family = 'school', stay = 'day') {
  const familyId = Object.hasOwn(FAMILIES, family) ? family : 'school';
  const stayId = stay === 'overnight' ? 'overnight' : 'day';
  const selected = FAMILIES[familyId];
  const stayReason = stayId === 'overnight'
    ? '加入酒店，是为了讨论两日节奏与休息空间，组合是否值得仍需验证。'
    : '先聚焦一日内的可选体验，实际先后顺序与耗时待核对。';
  return {
    need: selected.need,
    product: PRODUCT_COMBINATIONS[familyId][stayId],
    position: selected.position,
    why: `${selected.reason}${stayReason}`,
    validation: '团队组合草案：先核对参与规则与产品条件，再通过家庭访谈和选择测试检验需求；尚无转化率或销售效果结论。',
  };
}

export const CONTENT_NOTE = '旅程关系示意 · 团队需求假设 · 本组2026年10月现场照片与视频；展示模型、宣传画面与建筑实景分别说明';
