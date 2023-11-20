/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-22 13:07:24
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-14 09:47:19
 */

/** 
 * AUTHOR: 远山迷雾
 * TIME: 2022.11.22-10.13.23
 */

import { GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import MatchCDUI_Generate from "../ui-generate/ui/MatchCDUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";

export default class MatchCDUI extends MatchCDUI_Generate {

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
		this.textCountDown.visibility = mw.SlateVisibility.SelfHitTestInvisible
		let counttime = GlobalVar.Duration_Competition_CountDown
		this.textCountDown.text = counttime.toString()
		ActionMgr.instance().renderScaleTo(this.textCountDown, new mw.Vector2(4, 4), 500, this, () => {
			this.textCountDown.visibility = mw.SlateVisibility.Hidden
		}, mw.TweenUtil.Easing.Cubic.In)

		Scheduler.TimeStart(() => {
			counttime -= 1
			this.textCountDown.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.textCountDown.renderScale = new mw.Vector2(1, 1)
			if (counttime <= 0) {
				this.textCountDown.text = GameConfig.Language.MatchCdui_Start.Value
			} else {
				this.textCountDown.text = counttime.toString()
			}

			ActionMgr.instance().renderScaleTo(this.textCountDown, new mw.Vector2(4, 4), 400, this, () => {
				this.textCountDown.visibility = mw.SlateVisibility.Hidden
			}, mw.TweenUtil.Easing.Cubic.In)
			if (counttime == 2) {
				SoundHelper.instance().play(1007)
			}
		}, 1, counttime)
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {

	}

}
