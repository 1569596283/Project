/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2022-11-16 13:46:31
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2022-12-15 14:10:09
 * @FilePath: \horseracing\JavaScripts\ui\RewardUI.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by 代纯 chun.dai@appshahe.com, All Rights Reserved. 
 */

/** 
 * AUTHOR: 写意风流
 * TIME: 2022.11.16-09.35.28
 * 收益模块
 */

import { oTraceError, oTrace, oTraceWarning, LogManager, AnalyticsUtil, IFightRole, AIMachine, AIState } from "odin";
import { GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import { PlayerModuleC } from "../module/PlayerModule";
import { StableModuleC } from "../module/StableModule";
import RewardUI_Generate from "../ui-generate/ui/RewardUI_generate";
import { emitter } from "../utils/Emitter";
import InteractiveUI from "./InteractiveUI";




export default class RewardUI extends RewardUI_Generate {

	private _totalReward: number = 0
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
		this.mSell.onClicked.add(() => {
			//获得收益
			if (this._totalReward >= 0) {
				emitter.emit(GameEvents.EVENT_SELL_FAT)
			}
			mw.UIService.hide(RewardUI)
		})
		this.mBtnClose.onClicked.add(() => {
			mw.UIService.hide(RewardUI)
		})

		this.mSellno.onClicked.add(() => {
			mw.UIService.hide(RewardUI)
		})

		this.mSellCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		ModuleService.getModule(PlayerModuleC).hideBasicUI()
		let fatNum: number = params[0] as number
		// console.log("hjkh显示买粉", fatNum)
		this.mSell.visibility = mw.SlateVisibility.Visible
		if (fatNum == 0) {
			this.mRewardlittle.text = GameConfig.Language.Reward_2.Value
			this.mSell.visibility = mw.SlateVisibility.Hidden
		}
		else {
			let stableModule = ModuleService.getModule(StableModuleC)
			// this.mLeaveTime.text = mw.StringUtil.format("离开时间：{0}", data.leaveTime)

			// let littlePrice = GameConfig.Global.getElement(1005).Parameter1 * littleFatNum
			// let bigPrice = GameConfig.Global.getElement(1004).Parameter1 * bigFatNum
			// this._totalReward = littlePrice + bigPrice
		}
		this.mRewardAll.text = mw.StringUtil.format(GameConfig.Language.Reward_6.Value, this._totalReward)
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		ModuleService.getModule(PlayerModuleC).showBasicUI();
		mw.UIService.getUI(InteractiveUI).turnAgain();
	}

}
