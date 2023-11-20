import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Parameter1","Parameter2","Parameter3","Parameter4"],["","tag","tag","tag","tag",""],[1001,"挂机开始收益时间",120,null,null,null],[1002,"大马产生粪便时间",60,null,null,null],[1003,"小马产生粪便时间",30,null,null,null],[1004,"大马粪便收益",100,null,null,null],[1005,"小马粪便收益",50,null,null,null],[1006,"赛马比赛倒计时",3,null,null,null],[1007,"赛马比赛赛前准备时间",5,null,null,null],[1008,"下注时间",20,null,null,null],[1009,"比赛间隔时间",10,null,null,null],[1010,"小马成长值上限",100,null,null,null],[1011,"小马每次投喂的成长值",0,[10,50],null,null],[1012,"报名时间",40,null,null,null],[1013,"结束比赛时间",3,null,null,null],[1014,"结算时间",10,null,null,null],[1015,"清晨持续时间",10,null,null,null],[1016,"比赛时间",120,null,null,null],[1017,"黄昏时间",20,null,null,null],[1018,"夜晚持续时间",10,null,null,null],[1019,"奖金",0,[50,100,200,300,400,600,700,800],null,null],[1020,"QTE按键次数",0,[10,20,30,40],null,null],[1021,"QTE最大点击次数 /QTE时间",20,[5,2],null,null],[1022,"QTE触发时机",0,[5],null,null],[1023,"播报窗口滚动速度",50,null,null,null],[1024,"变异概率（头|脖子|身体|尾巴|大腿|小腿|不变异）",0,[5,10,10,10,10,10,120],null,null],[1025,"赛马切换动画速度区间倍率",0,[0.6,1,2],null,null],[1026,"评分分级",0,[240,280,310,350,400,500,700],null,null],[1027,"马厩产生粪便数量",0,[5,7],null,null],[1028,"喂养cd",100,null,null,null],[1029,"饲料价格",288,null,null,null],[1030,"赛场马匹缩放",2.5,null,null,null],[1031,"AI数量",0,null,null,null],[1032,"通用拖尾参数",0,[88796,88797,88798],[[4,4,4],[4,4,4],[4,4,4]],null],[1033,"恢复精力时间",100,null,null,null],[1034,"拖尾特效阶段",0,[500,900,1400],null,null],[1035,"玩家收集马粪，马粪飞到玩家身上播放特效",29393,[2,2,2],null,null],[1036,"AI随机下注（间隔、【金额】）",3,[300,400,500,600,700],null,null],[1037,"摄像机移动时间",1,null,null,null],[1038,"比赛时间限制",120,null,null,null],[1039,"QTE特效（guid、缩放）",92844,null,[[100,0,100],[0,0,180],[3,3,3]],null],[1040,"评级描述",0,null,null,[["E","D","C"],["B","A","GⅢ"],["GⅡ","GⅠ"]]],[1041,"评级字体颜色",0,null,null,[["8D8A8DFF","398946FF","2D59E0FF","C04FDAFF","DA3535FF"]]],[1042,"报名消耗金币",1000,null,null,null],[1043,"变异特效(相对位置、相对旋转、缩放)",24982,null,[[0,0,0],[0,0,0],[6,6,6]],null],[1044,"点击马匹互动产生钻石的概率",0.05,null,null,null],[1045,"点击马匹互动产生钻石奖励",0,[5,30],null,null],[1046,"点击马匹互动减少造粪cd",0.3,null,null,null],[1047,"属性最大值乘数",1.5,null,null,null],[1048,"时间奖励系数",2,null,null,null],[1049,"镜头移动时间",0,[1,0.5,0.5],null,null],[1050,"特殊技能检测间隔、公共冷却",0,[0.5,18],null,null],[1051,"马匹解锁钻石数量",0,[500,1000,1500,2000,3000],null,null],[1052,"冲刺技能加速度倍率",20,null,null,null],[1053,"3DUI",0,null,null,[["418D90F8","80FC6D3F","482F4D44","1590597C","0C7DF6A3","088D2FBB","A40DBC2E","EEE753D1"]]]];
export interface IGlobalElement extends IElementBase{
 	/**变量ID*/
	ID:number
	/**变量名*/
	Name:string
	/**参数1*/
	Parameter1:number
	/**参数2*/
	Parameter2:Array<number>
	/**参数3*/
	Parameter3:Array<Array<number>>
	/**undefined*/
	Parameter4:Array<Array<string>>
 } 
export class GlobalConfig extends ConfigBase<IGlobalElement>{
	constructor(){
		super(EXCELDATA);
	}

}