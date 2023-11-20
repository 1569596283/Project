/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2022-12-05 08:57:23
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2022-12-07 11:38:45
 * @FilePath: \horseracing\JavaScripts\ui\HorseDetail.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by 代纯 chun.dai@appshahe.com, All Rights Reserved. 
 */

/** 
 * AUTHOR: 远山迷雾
 * TIME: 2022.11.24-16.47.21
 */

import { GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import HorseDetail_Generate from "../ui-generate/ui/HorseDetail_generate";
import * as odin from 'odin'
import { RacingModuleC } from "../module/RacingModule";

export default class HorseDetail extends HorseDetail_Generate {

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
		this.btnClose.onClicked.add(() => {

			mw.UIService.hide(HorseDetail)
		})
	}

	/** 
	* 构造UI文件成功后，onStart之后 
	* 对于UI的根节点的添加操作，进行调用
	* 注意：该事件可能会多次调用
	*/
	protected onAdded() {
	}

	/** 
	 * 构造UI文件成功后，onAdded之后
	 * 对于UI的根节点的移除操作，进行调用
	 * 注意：该事件可能会多次调用
	 */
	protected onRemoved() {
	}

	/** 
	* 构造UI文件成功后，UI对象再被销毁时调用 
	* 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
	*/
	protected onDestroy() {
	}

	/**
	* 每一帧调用
	* 通过canUpdate可以开启关闭调用
	* dt 两帧调用的时间差，毫秒
	*/
	//protected onUpdate(dt :number) {
	//}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		let participantId = params[0] as number
		let horse = ModuleService.getModule(RacingModuleC).getPlayerHorse(participantId)

		let tmpSpeed = horse.getSpeedLimit() * (1 / 120000) * 3600
		this.textSpeed.text = tmpSpeed.toFixed(2).toString();

		let lineageCfg = GameConfig.Lineage.getElement(horse.getOwner().horseInfo.property.lineage)

		this.textLineage.text = GameConfig.Language[lineageCfg.lineage].Value

		this.textName.text = `[ ${horse.getOwner().horseInfo.property.nickName} ]`
		this.textName.fontColor = new mw.LinearColor(lineageCfg.textColor[0] / 255, lineageCfg.textColor[1] / 255, lineageCfg.textColor[2] / 255)
		let tmpAcc = horse.getOwner().horseInfo.property.acceleratedSpeed * (1 / 120000) * 1000
		this.textAcc.text = tmpAcc.toFixed(2).toString()

		this.textGrowValue.text = horse.getOwner().horseInfo.property.growth.toString()

		const hobbyCfg = GameConfig.Hobby.getElement(horse.getOwner().horseInfo.property.hobby)
		this.textHobby.text = GameConfig.Language[hobbyCfg.describe].Value
	}

	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}

}
