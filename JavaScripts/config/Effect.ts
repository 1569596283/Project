import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","ResGUID","LifeTime","IsLoop","Offset","Rotate","Scale","PS"],["","","","","","","","",""],[1,"第一名小马的皇冠特效","31266",0,false,new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"领奖台小马头顶的冠军标志"]];
export interface IEffectElement extends IElementBase{
 	/**q_id*/
	ID:number
	/**名字*/
	Name:string
	/**特效资源*/
	ResGUID:string
	/**多少秒后消失*/
	LifeTime:number
	/**是否循环播放*/
	IsLoop:boolean
	/**穿戴偏移*/
	Offset:mw.Vector
	/**穿戴旋转*/
	Rotate:mw.Vector
	/**穿戴缩放*/
	Scale:mw.Vector
	/**备注*/
	PS:string
 } 
export class EffectConfig extends ConfigBase<IEffectElement>{
	constructor(){
		super(EXCELDATA);
	}

}