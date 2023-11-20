import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","describe","skill","weather"],["","","",""],[1001,"Hobby_des_1",1031,[1]],[1002,"Hobby_des_2",1032,[2]],[1003,"Hobby_des_3",1033,[3]],[1004,"Hobby_des_4",1034,[4]],[1005,"Hobby_des_5",1035,null],[1006,"Hobby_des_6",1036,null],[1007,"Hobby_des_7",1037,null],[1008,"Hobby_des_8",1038,null],[1009,"Hobby_des_9",1039,null],[1010,"Hobby_des_10",1040,null],[1011,"Hobby_des_11",1041,null],[1012,"Hobby_des_12",1042,null]];
export interface IHobbyElement extends IElementBase{
 	/**id*/
	ID:number
	/**喜好描述*/
	describe:string
	/**技能*/
	skill:number
	/**喜好*/
	weather:Array<number>
 } 
export class HobbyConfig extends ConfigBase<IHobbyElement>{
	constructor(){
		super(EXCELDATA);
	}

}