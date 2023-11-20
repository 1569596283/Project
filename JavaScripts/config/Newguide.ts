import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Root","next","Description","Translate","Mask","CanMove","Focus","Letter","Dialog","Introduce","IntroducePos","Pos","Distination","CameraStart","CameraEnd","BoatStart","BoatEnd","Hide","Show"],["","","","","","","","","","","","","","","","","","","",""],[1001,1001,1002,"玩家角色看信",null,null,null,null,null,null,null,null,"85F4932A",null,"8B8450B8","EEA7566A",null,null,null,null],[1002,1001,1003,"显示信封",true,true,null,null,"letter1",null,null,null,null,null,null,null,null,null,null,null],[1003,1001,1004,"开船",true,null,null,null,null,["Player_newguid1"],null,null,null,null,"B3B5D770",null,"E27D6BEB","751C0D41",["8DC6AAF9"],null],[1004,1001,1005,"对话",null,null,null,null,null,["Player_newguid2"],null,null,"F8A3606C",null,null,null,null,null,null,null],[1005,1001,1006,"引导去马厩",null,null,true,null,null,null,null,null,null,"CBC3500E",null,null,null,null,null,null],[1006,1007,1007,"在马厩里，只有一匹马，准备去买马",null,null,null,null,null,["Player_newguid7","Player_newguid8"],null,null,null,null,null,null,null,null,["BCDD08C6","9E677B3F"],["8DC6AAF9"]],[1007,1007,1008,"点击商店",null,null,null,[1,0],null,null,null,null,null,null,null,null,null,null,null,null],[1008,1007,1009,"和寻马人对话，点击对话",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,["9E677B3F"]],[1009,1007,1010,"选择血统",null,null,null,[1,0],null,["Find_ask2"],null,null,null,null,null,null,null,null,null,null],[1010,1007,1011,"选择确定",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1011,1014,1012,"选择购买成功确定按钮",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1012,1014,1013,"牵走",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1013,1014,1014,"独白",null,null,null,null,null,["Player_newguid5"],null,null,null,null,null,null,null,null,null,null],[1014,1014,1015,"点击繁育按钮",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1015,1014,1016,"对话",null,null,null,[1,1],null,["Breed_talk1"],null,null,null,null,null,null,null,null,null,null],[1016,1014,1017,"选择插槽1",null,null,null,[1,1],null,null,"Breed_introduce1",new mw.Vector2(500,600),null,null,null,null,null,null,null,null],[1017,1014,1018,"选择马匹",null,null,null,[1,1],null,null,"Breed_introduce2",new mw.Vector2(500,300),null,null,null,null,null,null,null,null],[1018,1014,1019,"选择插槽2",null,null,null,[1,1],null,null,"Breed_introduce3",new mw.Vector2(1200,600),null,null,null,null,null,null,null,null],[1019,1014,1020,"选择马匹",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1020,1040,1021,"点击繁育按钮",null,null,null,[1,1],null,null,"Breed_introduce4",new mw.Vector2(760,590),null,null,null,null,null,null,null,null],[1040,1040,1022,"去繁育场领走小马吧，点击繁育按钮",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[1021,1040,1022,"独白",null,null,null,null,null,["Breed_get1"],null,null,null,null,null,null,null,null,null,null],[1022,1040,1023,"走近小马",null,null,true,null,null,null,null,null,null,"A6AC699A",null,null,null,null,["A64D460D","9503694C"],null],[1023,1040,1024,"对话",null,null,null,null,null,["Breed_horse1"],null,null,null,null,null,null,null,null,null,null],[1024,1025,1025,"是",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1025,1025,1041,"点击马厩按钮",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,["A64D460D","9503694C"]],[1041,1025,1042,"出引导走向小马，看信息栏，点击“喂养”按钮",null,null,true,[1,1],null,null,null,null,null,"B5E9D8C6",null,null,null,null,["0BBCF2BF","3D843B68"],null],[1042,1025,1026,"引导玩家点击确定",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,["0BBCF2BF"]],[1043,1043,1026,"点击马厩按钮",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[1026,1043,1027,"马厩里显示信封",null,true,null,null,"letter2",null,null,null,null,null,null,null,null,null,null,null],[1027,1028,1028,"出引导走向马，看信息栏，点击“让他比赛”按钮",null,null,true,[1,1],null,null,null,null,null,"0BBCF2BF",null,null,null,null,["9E677B3F"],null],[1028,1028,1029,"点击“参与”报名按钮",null,null,true,[1,0],null,null,null,null,null,null,null,null,null,null,null,["BCDD08C6","9E677B3F","3D843B68"]],[1029,1034,1030,"和舅舅对话，确认可以免费参赛一次",null,null,null,[1,1],null,["Uncle_talk1"],null,null,null,null,null,null,null,null,null,null],[1030,1034,1033,"赛场中，舅舅新手1：赛道数字",null,null,true,null,null,null,"Race_talk1",new mw.Vector2(500,300),null,null,null,null,null,null,null,null],[1031,1034,1032,"赛场中，舅舅新手2：天气",null,null,null,null,null,null,"Race_talk2",new mw.Vector2(500,300),null,null,null,null,null,null,null,null],[1032,1034,1033,"赛场中，舅舅新手3：赛事解说",null,null,null,null,null,null,"Race_talk3",new mw.Vector2(800,300),null,null,null,null,null,null,null,null],[1033,1034,1034,"弹出外婆的卖屎信件",true,null,null,null,"letter3",null,null,null,null,null,null,null,null,null,null,null],[1034,1034,1035,"点击马厩按钮",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1035,1034,1036,"引导靠近一坨屎，并拾取",null,null,true,null,null,null,null,null,null,"12DE180B",null,null,null,null,null,null],[1036,1034,1037,"引导走向买屎人",null,null,true,null,null,null,null,null,null,"039238C9",null,null,null,null,null,null],[1037,0,1038,"对话",null,null,null,null,null,["Shit_talk1"],null,null,null,null,null,null,null,null,null,null],[1038,0,1039,"是",null,null,null,[1,1],null,null,null,null,null,null,null,null,null,null,null,null],[1039,0,0,"卖屎界面，点击卖出",null,null,true,null,null,null,null,null,null,null,null,null,null,null,null,null]];
export interface INewguideElement extends IElementBase{
 	/**id*/
	ID:number
	/**引导阶段*/
	Root:number
	/**下一步引导（不填默认id+1）*/
	next:number
	/**描述*/
	Description:string
	/**过渡动画*/
	Translate:boolean
	/**黑幕*/
	Mask:boolean
	/**是否能移动*/
	CanMove:boolean
	/**聚焦箭头位置*/
	Focus:Array<number>
	/**信封内容*/
	Letter:string
	/**对话内容*/
	Dialog:Array<string>
	/**介绍*/
	Introduce:string
	/**介绍文字的文位置*/
	IntroducePos:mw.Vector2
	/**玩家位置*/
	Pos:string
	/**玩家移动目标位置*/
	Distination:string
	/**镜头开始位置*/
	CameraStart:string
	/**镜头结束位置*/
	CameraEnd:string
	/**船的起点*/
	BoatStart:string
	/**船的终点*/
	BoatEnd:string
	/**需要隐藏的物体*/
	Hide:Array<string>
	/**需要显示的物体*/
	Show:Array<string>
 } 
export class NewguideConfig extends ConfigBase<INewguideElement>{
	constructor(){
		super(EXCELDATA);
	}

}