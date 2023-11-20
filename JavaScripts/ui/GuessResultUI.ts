/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-22 18:42:46
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-15 18:43:30
 */

/** 
 * AUTHOR: 今日份的晚安
 * TIME: 2022.11.22-18.42.46
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import { GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GuessModuleC } from "../module/GuessModule";
import { RacingModuleC } from "../module/RacingModule";
import GuessResultUI_Generate from "../ui-generate/ui/GuessResultUI_generate";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import GetMoneyUI, { EGetType, GetMoneyInfo } from "./GetMoneyUI";


export class IGuessResultInfo {
	/** 胜者赛道 */
	winer: number;
	/** 胜者赛道 */
	betArr: number[] = [];
	/** 下注花费 */
	cost: number;
	/** 奖金 */
	income: number;
}

export default class GuessResultUI extends GuessResultUI_Generate {

	private _getMoney: number = 0;

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this.button_confirm.onClicked.add(() => {
			if (this._getMoney > 0) {
				let info: GetMoneyInfo = {
					money: this._getMoney,
					type: EGetType.Money
				}
				mw.UIService.show(GetMoneyUI, info);
			}
			mw.UIService.hide(GuessResultUI);
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
		let info = params[0] as IGuessResultInfo;
		let betStr = "";
		let betArr: number[] = info.betArr;
		if (betArr.indexOf(info.winer) >= 0) {
			this.text_winer.text = mw.StringUtil.format(GameConfig.Language.Guessresult_1.Value, info.winer);
			SoundHelper.instance().play(1021)
		} else {
			SoundHelper.instance().play(1020)
			this.text_winer.text = mw.StringUtil.format(GameConfig.Language.Guessresult_2.Value);
		}
		betArr.forEach((value: number) => {
			betStr = betStr + value + "、";
		})
		betStr = betStr.substring(0, betStr.length - 1);
		this.text_bet.text = mw.StringUtil.format(GameConfig.Language.Guessresult_3.Value, betStr);

		let money = info.income - info.cost;
		let get = money > 0 ? GameConfig.Language.Guessresult_4.Value : GameConfig.Language.Guessresult_5.Value;
		this._getMoney = money;
		this.text_result.text = mw.StringUtil.format(GameConfig.Language.Guessresult_6.Value, get, Math.floor(Math.abs(money)));
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {

	}

}
