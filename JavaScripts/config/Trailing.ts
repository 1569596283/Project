import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","GUID"],["",""],[101,"197977"],[102,"197461"],[103,"197475"],[104,"88441"],[105,"88796"],[106,"88822"]];
export interface ITrailingElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**拖尾特效资源*/
	GUID:string
 } 
export class TrailingConfig extends ConfigBase<ITrailingElement>{
	constructor(){
		super(EXCELDATA);
	}

}