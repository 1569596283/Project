import Property from "./logic/Property"

/**
 * 肢体类型
 */
export enum EPartType {
	/** NONE */
	None = -1,
	/** 头 */
	Head = 0,
	/** 脖子 */
	Neck = 1,
	/** 身体 */
	Body = 2,
	/** 尾巴 */
	Tail = 3,
	/** 大腿 */
	Thigh = 4,
	/** 小腿 */
	Calf = 5,
}

/**
 * 赛马状态
 */
export enum EHorseState {
	//待机
	Idle,
	//准备
	Ready,
	//动作1
	RunLevel1,
	//动作2
	RunLevel2,
	//动作3
	RunLevel3,
	//胜利
	Vectory,
	//巡逻
	Portal,
	//获奖
	Award
}

//马厩马匹状态
export enum EStableHorseState {
	//待机
	Idle,
	//巡逻
	Portal,
	//巡逻休息
	PortalWaiting,
	//正在吃胡萝卜
	Eating,
	//吃完
	Eated,
	//跟随
	Follow,
	//隐藏
	Hide,
	//放回马场
	Put,
	//放生
	Free,
	//交互
	Touch
}

/**
 * 比赛状态
 */
export enum ECompetitionState {
	/** 无状态，用于标记新玩家 */
	None,
	//休赛期
	Free,
	//等待
	Wait,
	//报名
	Sign,
	//下注
	Bet,
	//转场
	Translate,
	//准备
	Ready,
	//赛前倒计时
	CountDown,
	//比赛
	Running,
	//颁奖
	Award,
	//结束
	End,
	// 结算
	Settlement
}

//马的动画
export enum EHorseAnimation {
	//跟随动画
	FollowingWalk = "Walk",
	//赛跑一阶段跑步动画
	Run1 = "Run1",
	//赛跑二阶段跑步动画
	Run2 = "Run2",
	//赛跑三阶段跑步动画
	Run3 = "Run3",
	//比赛出场
	Appearance = "Appearance",
	//第一名颁奖
	GetTop = "Top",
	//第二、三名颁奖
	GetSecondOrThird = "Littlestep",
	//买马/下注后的待机动画
	Standby = "Standby",
	//商店加载动画
	Loading = "Loading",
	//吃草动画1 跪下
	Eatgrass1 = "Eatgrass1",
	//吃草动画2 啃草
	Eatgrass2 = "Eatgrass2"
}


export class IPartInfo {
	name: EPartType
	partId: number
	variation: boolean = false;
}

/**马匹体型数据 */
export enum EHorseSomatoType {
	//成年
	Mature,
	//幼年
	Filly
}

/**
 * 马匹信息
 */
export interface IHorseInfo {
	//唯一标识ID
	ID: string
	/** 肢体列表 */
	parts: IPartInfo[]
	/** 属性 */
	property: Property
	/** 拖尾 */
	trailingID: number
	/** 评级 */
	rate?: number
	/**马场索引 */
	stableIndex?: number
}

export interface ISaveHorse {
    //唯一标识ID
    ID: string
    /** 肢体列表 */
    partIDs: number[]
    /** 属性 */
    property: Property
    /** 拖尾 */
    trailingID: number
    /**马场索引 */
    stableIndex: number
}

export class IBreedInfo {
	/** 马匹信息 */
	horseInfo: IHorseInfo;
	/** 变异部位 */
	variationPart: EPartType;
	/** 变异序号（用于腿） */
	variationIndex: number = 0;
}

//会话弹出的场景
export enum ETalkEnvironment {
	None,
	//比赛
	Competition,
	//马厩
	Stable,
	//跟随
	Follow,
	//喂养
	Feed
}

export namespace GlobalVar {
	//人形对象trigger tag
	export const TriggerTag = 'Trigger'

	//全局音效大小
	export let GLOBAL_SOUND = 1
	//全局bgm大小
	export let GLOBAL_MUSIC = 1
	//颜色
	export const GreenColor: number[] = [0, 1, 0.4]
	export const GreyColor: number[] = [0.49, 0.49, 0.49]
	//比赛间隔休息时间
	export let Duration_Competition_Interval = 10
	//报名时间
	export let Duration_Competition_SignUp = 10
	//下注时间
	export let Duration_Competition_Bet = 10
	//赛前准备时间
	export let Duration_Competition_Ready = 10
	//赛前倒计时
	export let Duration_Competition_CountDown = 3
	//比赛结束时间
	export let Duration_Competition_End = 10
	//比赛颁奖时间
	export let Duration_Competition_Award = 5
	//结算时间
	export let Duration_Competition_Settle = 10
	//清晨时间
	export let Duration_Weather_Morning = 10
	//比赛时间
	export let Duration_Weather_Match = 30
	//黄昏时间
	export let Duration_Weather_Dust = 10
	//夜晚时间
	export let Duration_Weather_Night = 10

	/** 马的肢体个数 */
	export const PARTS_NUMBER = 12;

	/** 马匹最大速度 */
	export let MAX_SPEED = 5;

	/** 马匹最大加速度 */
	export let MAX_ACCELERATED_SPEED = 3;

	/**马的最大生育次数 */
	export let MAX_BEAR = 5;

	/**马的最大精力值 */
	export let MAX_ENERGY = 5;

	/**马匹恢复精力时间 */
	export let RECOVERY_ENERGY_TIME = 30

	/**喂养cd */
	export let RECOVERY_FEED_CD = 0

	/** 马匹最大产生粪便数量  0 大马 1 小马*/
	export let MAX_CREATEFATNUM: number[] = [];

	/** AI合成时使用马的数量 */
	export let AI_SYNTHETIC_NUM = 3;

	/** 繁育时对速度和加速度的加成 */
	export let BREED_ADDITION_MAX = 1.1;
	/** 繁育时对速度和加速度的加成 */
	export let BREED_ADDITION_MIN = 0.95;

	/** 开盘时庄家下注 */
	export let BET_DEFAULT = 500;

	/**马厩出生位置 */
	export let STABLE_BIRTHPOS: mw.Vector[] = []

	/**马厩最大养殖数量 */
	export let STABLE_MAX_POSSESS: number = 10

	/**马厩随机生成的范围 用于胡萝卜，马粪，马匹路线生成*/
	export let STABLE_RANDOMVEC: number[] = [-300, 300]


	/** QTE触发条件 */
	export let QTE_CONDITIONS: number[] = []

	/** QTE按键次数 */
	export let QTE_CLICK_TIMES: number[] = []

	/** QTE增加速度 */
	export let QTE_ADD_SPEED: number[] = []

	/** 变异概率（头|脖子|身体|尾巴|大腿|小腿|不变异） */
	export let VARIATION: number[] = []

	/** 评分分级 */
	export let GRADE_GRADE: number[] = []

	/** QTE最大点击次数 */
	export let QTE_MAX_CLICK: number = 30;

	//玩家默认的马匹
	export const Default_Horse = 1003

	/** 拖尾特效阶段 */
	export let TRAIL_STAGE: number[] = [];

	/** 比赛进度（个阶段的临界值） */
	export let RACE_PROGRESS: number[] = [];

	/** 奖牌图片guid */
	export let RATE_FONT_COLOR: string[] = [];
	/** 奖牌文本描述 */
	export let RATE_DESCRIBE: string[][] = [];
	/** 报名消耗 */
	export let SIGN_UP_COST: number = 100;
	/** 时间奖励系数 */
	export let TIME_AWARD_COEFFICIENT: number = 2;

	/** 镜头移动时间 */
	export let CAMREA_MOVE_TIME: number = 1;
	/** 镜头拉近时间 */
	export let CAMREA_NEAR_TIME: number = 0.5;
	/** 镜头拉远时间 */
	export let CAMREA_FAT_TIME: number = 0.5;
	/** 技能镜头时间 */
	export let CAMREA_SKILL_TIME: number = 0.5;
	/** 特殊技能检测间隔 */
	export let SPECIAL_SKILL_CD: number = 18;
	/** 特殊技能公共冷却 */
	export let SPECIAL_SKILL_INTERVAL: number = 0.5;

}


/**
 * 公共资源
 */
export namespace CommonAssets {

	export const BlockIcon = "37741"
	export const Asset_AI_Himanoid = '31969'
	//箭头特效
	export const ArrowEffect = '129380'
	//爱心特效
	export const LoveEffect = "4366"
	//触发器
	export const Trigger = "113"
	//3dui
	export const WorldUserWidget = '16037'
	//马粪图标UI
	export const FatShow3D = "57A61D24446BDA5721177BA37223A897"
	//钻石图标UI
	export const DiamondShow3D = "B03E8BF540961193479FB9B43BBAAB90"
	//会话框 
	export const Talk3D = "7AFD38114F21E500BE64328AA536F935"
	//比赛会话框
	export const Competition_Talk3D = "FE0CDCF746F8B4B7D57E9B9C198724AB"
	//比赛马匹标识
	export const Competition_Horse3D = "B0FAE6814B33DC38DC3DE39F9CFFEF05"
	//比赛马匹标识
	export const Feed_CD3d = "E0477CF741F917BB9941738188C01E9A"

	/**拖尾特效 */
	export const TrailEff = "88020"
	/**卖粪中的暴金币特效 */
	export const StableRefreshCoinsEff = "3B7B0EB9"
	/**粪车位置*/
	export const FatCar = "17A0CEB6"

	/** 马匹空锚点预制体guid */
	export const HORSE_GUID = "A8F22C294E9E7E403EC396953DBBF6A0"
	/**马粪预制件guid */
	export const HORSE_FIT = "A5AAF5F24A4241C1845A7E92A4420311"

	/**商场摄像机注视的点 */
	export const DISPLAY_CAMERA_FOCUS_OBJ = "A23BCCAB"

	/**胡萝卜模型 */
	export const CARROT = "3F92397246983D385052A5AFB2E56EB9"

	/**砖石模型 */
	export const DIAMOND = "4D84C71347279CF2EFAC13B969F4A3E3"
	/** 下注时，摄像机的位置 */
	export const GUESS_WATCH = "6C249AB6"
	/** 下注时，模型位置 */
	export const GUESS_DISPLAY = "F2CEAAB0"

	/**
	 * 引导线Guid
	 */
	export const GuideArrowGuid: string = "197386";

	/**
	 * 引导线材质Guid
	 */
	export const GuideArrowMartialGuid: string = "154709";

	/**
	 * 目的地特效Guid
	 */
	export const GuideWorldTargetEffectGuid: string = "21638";


	export const Lightning: string = "197173";

	/**
	 * 锚点
	 */
	export const AnchorPoint: string = '25782'

	export const Image_Number1: string = '128750'
	export const Image_Number2: string = '128697'
	export const Image_Number3: string = '128751'
	export const Image_Number4: string = '128779'
	export const Image_Number5: string = '128713'
	export const Image_Number6: string = '128757'
	export const Image_Number7: string = '128709'
	export const Image_Number8: string = '128705'

	export const Image_Default_White: string = "95864"

}

/**
 * 图片数字
 */
export const ImageNumber = [
	CommonAssets.Image_Number1,
	CommonAssets.Image_Number2,
	CommonAssets.Image_Number3,
	CommonAssets.Image_Number4,
	CommonAssets.Image_Number5,
	CommonAssets.Image_Number6,
	CommonAssets.Image_Number7,
	CommonAssets.Image_Number8,
]

/**
 * 场景类型
 */
export enum ESceneType {
	None,
	/** 大厅 */
	Hall,
	/**商业区 点击出战按钮*/
	Bussiness,
	/**马厩*/
	Stable,
	/**养成区*/
	Breed,
	/**商店 */
	Shop,
	/**报名 */
	Sign,
	/**下注 */
	Bet
}

/**
 * 错误码 对应多语言key
 */
export const ErrorCode = {
	1001: 'ErrorCode_1',
	1002: 'ErrorCode_2',
	1003: 'ErrorCode_3',
	1004: 'ErrorCode_4',
	1005: 'ErrorCode_5',
	1006: 'ErrorCode_6',
	1007: 'ErrorCode_7',
	1008: 'ErrorCode_8',
	1009: 'ErrorCode_9',
	1010: 'ErrorCode_10',
	1011: 'ErrorCode_11',
	1012: 'ErrorCode_12',
	1013: 'ErrorCode_13',
	1014: 'ErrorCode_14',
	1015: 'ErrorCode_15',
	1016: 'ErrorCode_16',
	1017: 'ErrorCode_17',
	1018: 'ErrorCode_18',
	1019: 'ErrorCode_19',
	1020: 'ErrorCode_20',
	1021: 'ErrorCode_21',
	1022: 'ErrorCode_22',
	1023: 'ErrorCode_23',
	1024: 'ErrorCode_24',
	1025: 'ErrorCode_25',
}

/**
 * 赛道
 */
export const StartPointS = [
	{ startPoint: 'F4AF8575' },
	{ startPoint: '66F2873F' },
	{ startPoint: '198622B5' },
	{ startPoint: 'FE897DC5' },
	{ startPoint: '5DA969D3' },
	{ startPoint: 'B544F539' },
	{ startPoint: '7F8F7435' },
	{ startPoint: 'D8E92CFE' },
]

export const RaceWayC = [
	{ startPoint: 'AD3C5B26', way: 'E948CE8F' },
	{ startPoint: '595499C5', way: 'A1BB85B4' },
	{ startPoint: '8E166CAA', way: 'C71A2035' },
	{ startPoint: '9D43415D', way: '14B2E976' },
	{ startPoint: '563F56B7', way: 'B03FC2E4' },
	{ startPoint: '5B121776', way: '565C8845' },
	{ startPoint: 'EB6A2222', way: '7104237B' },
	{ startPoint: '339A9AE7', way: '355DF4BD' },
]

/**
 * 终点
 */
export const EndPointGuid = '75564B69'

/**
 * 比赛路径点
 */
export interface IRoute {
	index: number
	wayObj: mw.GameObject
	startPos: mw.Vector
	endPos: mw.Vector
}

/**
 * 天气类型
 */
export enum EWeatherType {
	None = -1,
	//晴天
	Sunny,
	//雨天
	Rain,
	//阴天
	Overcast,
	//雪天
	Snowy
}

export enum EWeatherState {
	//清晨
	Morning,
	Match,
	Dusk,
	Night
}

/**
 * 天气信息
 */
export interface IWeatherInfo {
	weatherType: EWeatherType
	year: number
	month: number
	day: number
}

export interface ISettlementData {
	rank: number
	ownerId: number
	horseName: string
	firstName: number
	lastName: number
	time: number
	rewards: number
	bet: number
	/** 时长奖励 */
	timeAward: number
	/** 序号 */
	index: number
	giveup: boolean
}

export enum EBuffType {
	None,
	//减速
	Speed,
	//加速度
	Accelerate,
	//倒着跑
	Reverse,
	//提前出发
	EarlyMove,
	//放弃
	Giveup,
	//骄傲自负
	Conceit,
	/** QTE加速 */
	QTE,
	/** 加速度和加加速度 */
	Sprint,
}

export enum EBuffTargetType {
	None,
	//自己
	Self,
	//其他随机
	OtherRandom,
	//其他所有
	OtherAll,
	//所有
	All,
	//随机
	Random
}

export enum ECameraMoveType {
	/** UI点击移动 */
	None,
	/** 镜头拉近 */
	Near,
	/** 镜头拉远 */
	Far,
	/** 技能角度 */
	Skill
}

export namespace EffectScene {
	/** 默认 */
	export const EffectNone: string = "EffectNone";
	/** 下注 */
	export const EffectGuess: string = "EffectGuess";
	/** 大厅 */
	export const EffectHall: string = "EffectHall";
	/** 商业区 */
	export const EffectBusiness: string = "EffectBusiness";
	/** 繁育 */
	export const EffectBreed: string = "EffectBreed";
	/** 完赛 */
	export const EffectFinish: string = "EffectFinish";
	/** 颁奖 */
	export const EffectAward: string = "EffectAward";
	/** 商店 */
	export const EffectShop: string = "EffectShop";
}

export namespace CommonTrigger {
	export let GUESS_TRIGGER_POS: mw.Vector = mw.Vector.zero;
	export let GUESS_TRIGGER_ROA: mw.Rotation = mw.Rotation.zero;
	export let SHOP_TRIGGER_POS: mw.Vector = mw.Vector.zero;
	export let SHOP_TRIGGER_ROA: mw.Rotation = mw.Rotation.zero;
	export let SIGN_TRIGGER_POS: mw.Vector = mw.Vector.zero;
	export let SIGN_TRIGGER_ROA: mw.Rotation = mw.Rotation.zero;
	export let BREED_TRIGGER_POS: mw.Vector = mw.Vector.zero;
	export let BREED_TRIGGER_ROA: mw.Rotation = mw.Rotation.zero;
	export let SELLFAT_TRIGGER_POS: mw.Vector = mw.Vector.zero;
	export let SELLFAT_TRIGGER_ROA: mw.Rotation = mw.Rotation.zero;
}

export interface RichTextElementParams {
	text: string
	color?: mw.LinearColor
	inParam?: any
	clickCb?: (param: any) => void
}

export enum ERaceStage {
	/** 报名 */
	SignUp,
	/** 下注 */
	Guess,
	/** 比赛 */
	Race,
	/** 等待 */
	Wait
}

export enum ETalkIndex {
	/** 报名 */
	SignUp,
	/** 买马 */
	Shop,
	/** 下注 */
	Guess,
	/** 繁育 */
	Breed,
	/** 卖粪 */
	Shit,
	/**解锁 */
	Unlock,
	/**报名未遂 */
	SignUPNone,
	/**买马未遂 */
	ShopNone,
	/**下注未遂 */
	GuessNone,
	/**繁育未遂 */
	BreedNone,
	/**卖粪未遂 */
	ShitNone,
	/**解锁未遂 */
	UnlockNone,
	/**解锁成功 */
	UnlockSuccess,
	/** 带小马参赛 */
	UncleSmall,
	/**领取小马 */
	AdoptPony,
	/** 已经报名 */
	UncleRace,
	/** 没有出战的马 */
	UncleTips
}