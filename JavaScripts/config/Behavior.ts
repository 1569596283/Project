import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Behavior","Broadcast2","Broadcast2Color","Broadcast3","Broadcast3Color","Broadcast4","Broadcast4Color"],["","","","","","","",""],[1001,"Action7","Behavior_brocasttwo_7",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1002,"Action7","Behavior_brocasttwo_7",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1003,"Action7","Behavior_brocasttwo_7",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1004,"Action8","Behavior_brocasttwo_8",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_6",null],[1005,"Action8","Behavior_brocasttwo_8",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_6",null],[1006,"Action8","Behavior_brocasttwo_8",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_6",null],[1007,"Action4","Behavior_brocasttwo_4",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_6",null],[1008,"Action4","Behavior_brocasttwo_4",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_6",null],[1009,"Action4","Behavior_brocasttwo_4",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_6",null],[1010,"Action10","Behavior_brocasttwo_10",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_8",null],[1011,"Action10","Behavior_brocasttwo_10",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_8",null],[1012,"Action10","Behavior_brocasttwo_10",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_8",null],[1013,"Action13","Behavior_brocasttwo_13",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_7",null],[1014,"Action13","Behavior_brocasttwo_13",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_7",null],[1015,"Action13","Behavior_brocasttwo_13",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_7",null],[1016,"Action12","Behavior_brocasttwo_12",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_3",null],[1017,"Action12","Behavior_brocasttwo_12",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_3",null],[1018,"Action12","Behavior_brocasttwo_12",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_3",null],[1019,"Action9","Behavior_brocasttwo_9",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_4",null],[1020,"Action9","Behavior_brocasttwo_9",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_4",null],[1021,"Action9","Behavior_brocasttwo_9",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_4",null],[1022,"Action2","Behavior_brocasttwo_2",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_7",null],[1023,"Action2","Behavior_brocasttwo_2",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_7",null],[1024,"Action2","Behavior_brocasttwo_2",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_7",null],[1025,"Action11","Behavior_brocasttwo_11",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_5",null],[1026,"Action11","Behavior_brocasttwo_11",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_5",null],[1027,"Action11","Behavior_brocasttwo_11",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_5",null],[1028,"Action6","Behavior_brocasttwo_6",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1029,"Action6","Behavior_brocasttwo_6",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1030,"Action6","Behavior_brocasttwo_6",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1031,"Action5","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1032,"Action3","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1033,"Action14","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1034,"Action15","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1035,"Action16","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1036,"Action17","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1037,"Action19","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1038,"Action20","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1039,"Action18","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null],[1040,"Action1","Behavior_brocasttwo_3",null,"Behavior_brocastthird",null,"Behavior_brocastfourth_1",null]];
export interface IBehaviorElement extends IElementBase{
 	/**id*/
	ID:number
	/**动作*/
	Behavior:string
	/**动作播报*/
	Broadcast2:string
	/**动作播报字体颜色*/
	Broadcast2Color:string
	/**影响播报*/
	Broadcast3:string
	/**影响播报字体颜色*/
	Broadcast3Color:string
	/**影响播报*/
	Broadcast4:string
	/**影响播报字体颜色*/
	Broadcast4Color:string
 } 
export class BehaviorConfig extends ConfigBase<IBehaviorElement>{
	constructor(){
		super(EXCELDATA);
	}

}