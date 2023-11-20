import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","lineage","describe","personality","speed0Range","speedRange","accelerateRange","energyRange","bearRange","shitRange","RunawaySpeed","maxSpeed","accelerate","energy","bear","defecation","lineagePrice","horsePrice","icon","textColor"],["","","","","","","","","","","","","","","","","","","",""],[1001,"Lineage_1","Lineage_des_1",[1001,1002,1003,1004,1005,1006,1007,1008,1009,1010],0.25,0.25,0.2,0.1,0.1,0.1,[420,440],[2000,2100],[50,53],[3,5],[1,3],[60,80],50,[150,350],"132751",[127,127,127]],[1002,"Lineage_2","Lineage_des_2",[1001,1002,1003,1004,1005,1006,1007,1008,1009,1010],0.25,0.25,0.2,0.1,0.1,0.1,[430,450],[2100,2200],[58,63],[1,3],[2,4],[70,90],80,[150,350],"132774",[193,210,240]],[1003,"Lineage_3","Lineage_des_3",[1001,1002,1003,1004,1005,1006,1007,1008,1009,1010],0.25,0.25,0.2,0.1,0.1,0.1,[450,480],[2200,2300],[55,60],[3,5],[0,2],[100,120],150,[150,350],"132749",[128,0,128]],[1004,"Lineage_4","Lineage_des_4",[1001,1002,1003,1004,1005,1006,1007,1008,1009,1010],0.25,0.25,0.2,0.1,0.1,0.1,[450,500],[2250,2350],[48,52],[1,3],[0,5],[70,90],80,[150,350],"132777",[128,0,128]],[1005,"Lineage_5","Lineage_des_5",[1001,1002,1003,1004,1005,1006,1007,1008,1009,1010],0.25,0.25,0.2,0.1,0.1,0.1,[420,440],[2050,2150],[52,55],[2,4],[1,3],[10,30],120,[150,350],"132764",[128,0,128]],[1006,"Lineage_6","Lineage_des_6",[1001,1002,1003,1004,1005,1006,1007,1008,1009,1010],0.25,0.25,0.2,0.1,0.1,0.1,[420,440],[2050,2150],[52,55],[2,4],[4,5],[70,90],120,[150,350],"132771",[128,0,128]]];
export interface ILineageElement extends IElementBase{
 	/**id*/
	ID:number
	/**血统*/
	lineage:string
	/**血统描述*/
	describe:string
	/**性格*/
	personality:Array<number>
	/**初速度权重*/
	speed0Range:number
	/**最大速度权重*/
	speedRange:number
	/**加速度权重*/
	accelerateRange:number
	/**精力权重*/
	energyRange:number
	/**生育权重*/
	bearRange:number
	/**排便速度权重*/
	shitRange:number
	/**起跑速度*/
	RunawaySpeed:Array<number>
	/**最大速度*/
	maxSpeed:Array<number>
	/**加速度*/
	accelerate:Array<number>
	/**精力*/
	energy:Array<number>
	/**生育能力*/
	bear:Array<number>
	/**排便量*/
	defecation:Array<number>
	/**血统价格*/
	lineagePrice:number
	/**马的价格*/
	horsePrice:Array<number>
	/**马的图标*/
	icon:string
	/**文本显示颜色*/
	textColor:Array<number>
 } 
export class LineageConfig extends ConfigBase<ILineageElement>{
	constructor(){
		super(EXCELDATA);
	}

}