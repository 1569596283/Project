
/** 
 * AUTHOR: 远山迷雾
 * TIME: 2022.11.21-12.05.24
 */

import { EWeatherState, EWeatherType } from "../Common";
import WeatherUI_Generate from "../ui-generate/ui/WeatherUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import Tips from "./Tips";
import * as odin from 'odin'
import { WeatherModuleC } from "../module/WeatherModule";
import { Scheduler } from "../utils/Scheduler";
import { GameConfig } from "../config/GameConfig";

export default class WeatherUI extends WeatherUI_Generate {

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
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
		let type = params[0]
		Player.localPlayer.character.movementEnabled = false
		this.blackMask.visibility = mw.SlateVisibility.Visible
		this.textTips.visibility = mw.SlateVisibility.Hidden

		let info = ModuleService.getModule(WeatherModuleC).getWeatherInfo()
		let tipsStr = ''
		if (type == EWeatherState.Morning) {
			let date = mw.StringUtil.format(GameConfig.Language.Time_data.Value,
				info.year, info.month, info.day) + GameConfig.Language.Weatherui_moring.Value
			this.blackMask.renderOpacity = 1
			tipsStr = date
			ActionMgr.instance().fadeOut(this.blackMask, 3000, this, () => {
				this.blackMask.visibility = mw.SlateVisibility.Hidden
				Player.localPlayer.character.movementEnabled = true
				mw.UIService.hide(WeatherUI)
				// Tips.showTips('公元' + info.year + '年' + info.month + '月' + info.day + '日')
			})
		} else if (type == EWeatherState.Night) {
			this.blackMask.renderOpacity = 0
			tipsStr = GameConfig.Language.Weatherui_tips.Value
			ActionMgr.instance().fadeIn(this.blackMask, 3000, this, () => {
				Player.localPlayer.character.movementEnabled = true
			})
		}
		if (tipsStr) {
			Scheduler.TimeStart(() => {
				this.textTips.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.textTips.text = tipsStr
			}, 1)
		}
	}

	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}

}
