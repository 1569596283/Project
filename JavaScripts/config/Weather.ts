import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Type","Icon","Describe","Effect","Offset","Rotation","Scale"],["","","","","","","","",""],[1001,"Weather_1",0,"131908","Weather_des_1",null,new mw.Vector(100,100,-100),new mw.Vector(0,0,0),new mw.Vector(2,2,2)],[1002,"Weather_2",1,"131909","Weather_des_2","197480",new mw.Vector(100,100,-100),new mw.Vector(0,0,0),new mw.Vector(2,2,2)],[1003,"Weather_3",2,"131918","Weather_des_3","89591",new mw.Vector(100,100,-100),new mw.Vector(0,0,0),new mw.Vector(2,2,2)],[1004,"Weather_4",3,"131911","Weather_des_4","127014",new mw.Vector(100,100,-100),new mw.Vector(0,0,0),new mw.Vector(2,2,2)]];
export interface IWeatherElement extends IElementBase{
 	/**变量ID*/
	ID:number
	/**名称(对应多语言id)*/
	Name:string
	/**类型*/
	Type:number
	/**图标Guid*/
	Icon:string
	/**天气效果描述*/
	Describe:string
	/**天气特效*/
	Effect:string
	/**坐标偏移*/
	Offset:mw.Vector
	/**旋转*/
	Rotation:mw.Vector
	/**缩放*/
	Scale:mw.Vector
 } 
export class WeatherConfig extends ConfigBase<IWeatherElement>{
	constructor(){
		super(EXCELDATA);
	}

}