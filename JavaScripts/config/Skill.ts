import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Broadcastornot","Type","Target","TargetDuration","Overlrp","Interval","TriggerCounts","Impact","Rank","Beyond","RacingWay","Distance","Weather","Broadcast1","Behavior","Chance","Talk","Cheer","CameraTime","Location","Rotation"],["","","","","","","","","","","","","","","","","","","","Language","","",""],[1001,null,1,8,1,1,0,3,0,500,null,0,null,[0.5,1],null,"Skill_broadcast_1",1001,0.3,1001,"999",0,null,null],[1002,null,1,8,1,2,0,4,0,500,null,0,null,[0.5,1],null,"Skill_broadcast_1",1002,0.3,1001,"999",0,null,null],[1003,null,1,8,1,3,0,5,0,500,null,0,null,[0.5,1],null,"Skill_broadcast_1",1003,0.3,1001,"999",0,null,null],[1004,null,1,8,1,1,0,3,0,500,null,-1,null,[0.1,0.5],null,"Skill_broadcast_3",1004,0.3,1001,"999",0,null,null],[1005,null,1,8,1,2,0,4,0,500,null,-1,null,[0.1,0.5],null,"Skill_broadcast_3",1005,0.3,1001,"999",0,null,null],[1006,null,1,8,1,3,0,5,0,500,null,-1,null,[0.1,0.5],null,"Skill_broadcast_3",1006,0.3,1001,"999",0,null,null],[1007,null,1,8,1,1,0,3,0,500,[1,3],0,null,[0.1,0.5],null,"Skill_broadcast_4",1007,0.3,1001,"999",0,null,null],[1008,null,1,8,1,2,0,4,0,500,[1,3],0,null,[0.1,0.5],null,"Skill_broadcast_4",1008,0.3,1001,"999",0,null,null],[1009,null,1,8,1,3,0,5,0,500,[1,3],0,null,[0.1,0.5],null,"Skill_broadcast_4",1009,0.3,1001,"999",0,null,null],[1010,null,1,6,2,2,0,5,0,0,null,1,null,[0.5,1],null,"Skill_broadcast_5",1010,0.1,1006,"999",0,null,null],[1011,null,1,6,2,4,0,10,0,0,null,1,null,[0.5,1],null,"Skill_broadcast_5",1011,0.1,1006,"999",0,null,null],[1012,null,1,6,2,6,0,15,0,0,null,1,null,[0.5,1],null,"Skill_broadcast_5",1012,0.1,1006,"999",0,null,null],[1013,null,1,8,5,1,0,4,0,-200,[1,4],0,null,[0.1,0.5],null,"Skill_broadcast_4",1013,0.3,1002,"999",0,null,null],[1014,null,1,8,5,2,0,6,0,-200,[1,4],0,null,[0.1,0.5],null,"Skill_broadcast_4",1014,0.3,1002,"999",0,null,null],[1015,null,1,8,5,3,0,8,0,-200,[1,4],0,null,[0.1,0.5],null,"Skill_broadcast_4",1015,0.3,1002,"999",0,null,null],[1016,null,1,5,5,0,0,15,0,0,[1,4],0,null,null,null,"Skill_broadcast_4",1016,0.1,1004,"999",0,null,null],[1017,null,1,5,5,0,0,15,0,0,[5,8],0,null,null,null,"Skill_broadcast_2",1017,0.1,1004,"999",0,null,null],[1018,null,1,5,5,0,0,15,0,0,null,0,null,[0.1,0.9],null,"Skill_broadcast_6",1018,0.1,1004,"999",0,null,null],[1019,null,1,3,5,1,0,3,0,0,null,0,null,[0.3,0.9],null,"Skill_broadcast_6",1019,0.5,1003,"999",0,null,null],[1020,null,1,3,5,2,0,6,0,0,null,0,null,[0.3,0.9],null,"Skill_broadcast_6",1020,0.5,1003,"999",0,null,null],[1021,null,1,3,5,3,0,9,0,0,null,0,null,[0.3,0.9],null,"Skill_broadcast_6",1021,0.5,1003,"999",0,null,null],[1022,null,1,8,5,1,0,4,0,-200,null,1,null,null,null,"Skill_broadcast_5",1022,0.3,1002,"999",0,null,null],[1023,null,1,8,5,2,0,6,0,-200,null,1,null,null,null,"Skill_broadcast_5",1023,0.3,1002,"999",0,null,null],[1024,null,1,8,5,3,0,8,0,-200,null,1,null,null,null,"Skill_broadcast_5",1024,0.3,1002,"999",0,null,null],[1025,null,1,4,5,1,0,0,0,1000,null,0,[0,7],null,null,"Skill_broadcast_6",1025,0.5,1005,"999",0,null,null],[1026,null,1,4,5,2,0,0,0,2000,null,0,[0,7],null,null,"Skill_broadcast_6",1026,0.5,1005,"999",0,null,null],[1027,null,1,4,5,3,0,0,0,3000,null,0,[0,7],null,null,"Skill_broadcast_6",1027,0.5,1005,"999",0,null,null],[1028,null,1,8,4,1,0,3,0,500,[1,3],0,null,null,null,"Skill_broadcast_4",1028,0.3,1001,"999",0,null,null],[1029,null,1,8,4,2,0,4,0,500,[1,3],0,null,null,null,"Skill_broadcast_4",1029,0.3,1001,"999",0,null,null],[1030,null,1,8,4,3,0,5,0,500,[1,3],0,null,null,null,"Skill_broadcast_4",1030,0.3,1001,"999",0,null,null],[1031,null,0,2,1,0,0,0,1,150,null,0,null,null,[1],null,0,1,1001,"999",0,null,null],[1032,null,0,2,1,0,0,0,1,150,null,0,null,null,[2],null,0,1,1001,"999",0,null,null],[1033,null,0,2,1,0,0,0,1,150,null,0,null,null,[3],null,0,1,1001,"999",0,null,null],[1034,null,0,2,1,0,0,0,1,150,null,0,null,null,[4],null,0,1,1001,"999",0,null,null],[1035,null,0,2,1,0,0,0,1,150,null,0,[0],null,null,null,0,1,0,"999",0,null,null],[1036,null,0,2,1,0,0,0,1,150,null,0,[1],null,null,null,0,1,0,"999",0,null,null],[1037,null,0,2,1,0,0,0,1,150,null,0,[2],null,null,null,0,1,0,"999",0,null,null],[1038,null,0,2,1,0,0,0,1,150,null,0,[3],null,null,null,0,1,0,"999",0,null,null],[1039,null,0,2,1,0,0,0,1,150,null,0,[4],null,null,null,0,1,0,"999",0,null,null],[1040,null,0,2,1,0,0,0,1,150,null,0,[5],null,null,null,0,1,0,"999",0,null,null],[1041,null,0,2,1,0,0,0,1,150,null,0,[6],null,null,null,0,1,0,"999",0,null,null],[1042,null,0,2,1,0,0,0,1,150,null,0,[7],null,null,null,0,0,0,"999",0,null,null],[1043,"QTE buff 基于加速度增加移动速度（影响的值是百分比）",0,7,1,2,1,0,1,300,null,0,null,null,null,null,0,1,0,"999",0,null,null],[1044,null,1,8,1,3,0,10,0,5000,[7,8],0,null,null,null,"Skill_broadcast_6",1031,1,1007,"Skill_1",1,new mw.Vector(0,-1500,1200),new mw.Vector(0,90,-90)],[1045,null,1,3,3,3,0,10,0,0,[5,8],0,null,null,null,"Skill_broadcast_2",1032,1,1008,"Skill_2",1,new mw.Vector(0,-3000,5000),new mw.Vector(0,90,-90)],[1046,null,1,8,1,10,0,10,0,1500,null,0,null,[0.1,0.9],null,"Skill_broadcast_6",1033,1,1009,"Skill_3",1,new mw.Vector(0,-1500,3000),new mw.Vector(0,90,-90)],[1047,null,1,3,2,5,0,10,0,0,[5,8],0,null,[0,0.5],null,"Skill_broadcast_2",1034,1,1010,"Skill_4",1,new mw.Vector(-1000,0,1000),new mw.Vector(90,90,-90)],[1048,null,1,6,4,3,0,10,0,0,[1,4],0,null,[0.5,1],null,"Skill_broadcast_4",1035,1,1011,"Skill_5",1,new mw.Vector(0,-2000,4000),new mw.Vector(0,90,-90)],[1049,null,1,3,3,3,0,10,0,0,[8],0,null,null,null,"Skill_broadcast_2",1036,1,1012,"Skill_6",1,new mw.Vector(0,-3000,5000),new mw.Vector(0,90,-90)],[1050,null,1,3,2,5,0,10,0,0,[1,8],0,null,null,null,"Skill_broadcast_6",1037,1,1013,"Skill_7",1,new mw.Vector(-8000,0,5000),new mw.Vector(90,90,-90)],[1051,null,1,8,3,3,0,10,0,-500,[1,8],0,null,null,null,"Skill_broadcast_6",1038,1,1014,"Skill_8",1,new mw.Vector(-8000,0,5000),new mw.Vector(90,90,-90)],[1052,null,1,5,5,5,0,10,0,0,[1,8],0,null,null,null,"Skill_broadcast_6",1039,1,1015,"Skill_9",1,new mw.Vector(0,-3000,5000),new mw.Vector(0,90,-90)],[1053,null,1,8,4,4,0,10,0,1000,[1,4],0,null,[0.5,1],null,"Skill_broadcast_4",1040,1,1016,"Skill_10",1,new mw.Vector(-8000,0,5000),new mw.Vector(90,90,-90)]];
export interface ISkillElement extends IElementBase{
 	/**id*/
	ID:number
	/**效果描述*/
	Describe:string
	/**是否播报*/
	Broadcastornot:number
	/**类型*/
	Type:number
	/**作用目标*/
	Target:number
	/**作用时间*/
	TargetDuration:number
	/**是否可叠加*/
	Overlrp:number
	/**触发频率*/
	Interval:number
	/**触发次数*/
	TriggerCounts:number
	/**影响的值*/
	Impact:number
	/**条件-名次*/
	Rank:Array<number>
	/**条件-超过/被超过*/
	Beyond:number
	/**条件-跑道*/
	RacingWay:Array<number>
	/**条件-距离*/
	Distance:Array<number>
	/**条件-天气*/
	Weather:Array<number>
	/**触发播报*/
	Broadcast1:string
	/**触发行为*/
	Behavior:number
	/**触发概率*/
	Chance:number
	/**触发的会话*/
	Talk:number
	/**大招显示文字*/
	Cheer:string
	/**镜头移动时间*/
	CameraTime:number
	/**相对小马的坐标差*/
	Location:mw.Vector
	/**摄像机旋转*/
	Rotation:mw.Vector
 } 
export class SkillConfig extends ConfigBase<ISkillElement>{
	constructor(){
		super(EXCELDATA);
	}

}