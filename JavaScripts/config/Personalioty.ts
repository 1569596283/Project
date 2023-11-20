import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","name","describe","skill","SpecialSkills"],["","","","",""],[1001,"Nature_1","这是一种性格，自己测测吧！",[1001,1002,1003],[1044]],[1002,"Nature_2","这是一种性格，自己测测吧！",[1004,1005,1006],[1045]],[1003,"Nature_3","这是一种性格，自己测测吧！",[1007,1008,1009],[1046]],[1004,"Nature_4","这是一种性格，自己测测吧！",[1010,1011,1012],[1047]],[1005,"Nature_5","这是一种性格，自己测测吧！",[1013,1014,1015],[1048]],[1006,"Nature_6","这是一种性格，自己测测吧！",[1016,1017,1018],[1049]],[1007,"Nature_7","这是一种性格，自己测测吧！",[1019,1020,1021],[1050]],[1008,"Nature_8","这是一种性格，自己测测吧！",[1022,1023,1024],[1051]],[1009,"Nature_9","这是一种性格，自己测测吧！",[1025,1026,1027],[1052]],[1010,"Nature_10","这是一种性格，自己测测吧！",[1028,1029,1030],[1053]]];
export interface IPersonaliotyElement extends IElementBase{
 	/**id*/
	ID:number
	/**性格名称*/
	name:string
	/**性格描述*/
	describe:string
	/**技能*/
	skill:Array<number>
	/**特殊技能*/
	SpecialSkills:Array<number>
 } 
export class PersonaliotyConfig extends ConfigBase<IPersonaliotyElement>{
	constructor(){
		super(EXCELDATA);
	}

}