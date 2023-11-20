import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","type","lastName","firstName"],["","","Language","Language"],[1001,0,"Lastname_1","Firstname_1"],[1002,0,"Lastname_2","Firstname_2"],[1003,0,"Lastname_3","Firstname_3"],[1004,0,"Lastname_4","Firstname_4"],[1005,0,"Lastname_5","Firstname_5"],[1006,0,"Lastname_6","Firstname_6"],[1007,0,"Lastname_7","Firstname_7"],[1008,0,"Lastname_8","Firstname_8"],[1009,0,"Lastname_9","Firstname_9"],[1010,0,"Lastname_10","Firstname_10"],[1011,0,"Lastname_11","Firstname_11"],[1012,0,"Lastname_12","Firstname_12"],[1013,0,"Lastname_13","Firstname_13"],[1014,0,"Lastname_14","Firstname_14"],[1015,0,"Lastname_15","Firstname_15"],[1016,0,"Lastname_16","Firstname_16"],[1017,0,"Lastname_17","Firstname_17"],[1018,0,"Lastname_18","Firstname_18"],[1019,0,"Lastname_19","Firstname_19"],[1020,0,"Lastname_20","Firstname_20"],[1021,0,"Lastname_21","Firstname_21"],[1022,0,"Lastname_22","Firstname_22"],[1023,0,"Lastname_23","Firstname_23"],[1024,0,"Lastname_24","Firstname_24"],[1025,0,"Lastname_25","Firstname_25"],[1026,0,"Lastname_26","Firstname_26"],[1027,0,"Lastname_27","Firstname_27"],[1028,0,"Lastname_28","Firstname_27"]];
export interface INameElement extends IElementBase{
 	/**id*/
	ID:number
	/**undefined*/
	type:number
	/**姓*/
	lastName:string
	/**名*/
	firstName:string
 } 
export class NameConfig extends ConfigBase<INameElement>{
	constructor(){
		super(EXCELDATA);
	}

}