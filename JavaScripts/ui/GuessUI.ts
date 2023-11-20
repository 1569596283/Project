import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
/*
* @Author: jiezhong.zhang
* @Date: 2022-11-17 09:55:16
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-10-31 15:31:01
*/

import { CommonAssets, EffectScene, EHorseAnimation, GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { EffectMgr } from "../logic/EffectMgr";
import { HoresModelC } from "../logic/HorseModel";
import { GuessModuleC } from "../module/GuessModule";
import { PlayerModuleC } from "../module/PlayerModule";
import { RacingModuleC } from "../module/RacingModule";
import GuessUI_Generate from "../ui-generate/ui/GuessUI_generate";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import InteractiveUI from "./InteractiveUI";
import Tips from "./Tips";
import CameraUtils from '../utils/CameraUtils';

export default class GuessUI extends GuessUI_Generate {
	/** 当前显示的马的信息 */
	private _cureInfo: IHorseInfo;
	/** 当前显示的马的序号 */
	private _index: number;
	/** 马的模型 */
	private _horseModel: HoresModelC;
	/** 马位置的参考点 */
	private _displayObj: mw.GameObject = null
	/** 摄像机挂载点 */
	private _cameraFocusObj: mw.GameObject = null
	/** 是否可刷新 */
	private _canRefresh: boolean = true;
	/** 时间刷新计时器 */
	private _timeRefreshTimer: number = 0;

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this.button_left.onClicked.add(this.leftButtonClick);
		this.button_right.onClicked.add(this.rightButtonClick);
		this.button_add.onClicked.add(this.addButtonClick);
		this.button_sub.onClicked.add(this.subButtonClick);
		this.button_bet.onClicked.add(this.betButtonClick);
		this.button_close.onClicked.add(this.closeButtonClick);

		if (!this._displayObj) {
			this._displayObj = GameObject.findGameObjectById(CommonAssets.GUESS_DISPLAY)
		}
		if (!this._cameraFocusObj) {
			this._cameraFocusObj = GameObject.findGameObjectById(CommonAssets.GUESS_WATCH)
		}

		this.input_money.onTextCommitted.add((Text: string) => {
			let num = Number(Text);
			if (Number.isNaN(num)) {
				console.log(" 下注输入框里的东西不是number ");
			} else {
				if (num < 0) {
					num = Math.abs(num);
					this.input_money.text = num + "";
				}
			}
		})
	}

	private leftButtonClick = () => {

		this._index--;
		if (this._index < 0) {
			this._index = 7;
		}
		this.refreshInfo();
	}

	private rightButtonClick = () => {

		this._index++;
		if (this._index > 7) {
			this._index = 0;
		}
		this.refreshInfo();
	}

	private addButtonClick = () => {

		let num = Number(this.input_money.text);
		if (Number.isNaN(num)) {
			console.log(" 下注输入框里的东西不是number ");
		} else {
			num += 500;
		}
		this.input_money.text = num + "";
	}

	private subButtonClick = () => {

		let num = Number(this.input_money.text);
		if (Number.isNaN(num)) {
			console.log(" 下注输入框里的东西不是number ");
		} else {
			if (num > 500) {
				num -= 500;
			}
		}
		this.input_money.text = num + "";
	}

	private betButtonClick = () => {

		let num = Number(this.input_money.text);
		let des = mw.StringUtil.format(GameConfig.Language.Guessui_describe.Value, this._cureInfo.property.nickName, num);

		if (num < 0) {
			Tips.showTips(GameConfig.Language.Tips_betgreaterzero.Value);
			return;
		}
		if (num > ModuleService.getModule(PlayerModuleC).getMoney()) {
			Tips.showTips(GameConfig.Language.Tips_notenoughgold.Value);
			return;
		}
		ModuleService.getModule(GuessModuleC).bet(this._index, num);
		Tips.showTips(GameConfig.Language.GuessUI_BetSuccess.Value);
	}

	private closeButtonClick = () => {
		mw.UIService.hide(GuessUI);
		mw.UIService.getUI(InteractiveUI).turnAgain();
	}

	/**
	 * 刷新显示信息
	 */
	public async refreshInfo() {
		if (!this._canRefresh) {
			return;
		}
		let horseInfo = ModuleService.getModule(RacingModuleC).getParticleHorses()[this._index].getHorseInfo();
		// 是否需要重新生成模型
		if (!this._cureInfo || !this._horseModel || this._cureInfo != horseInfo) {
			this._canRefresh = false;
			this._cureInfo = horseInfo;
			if (this._horseModel) {
				this._horseModel.forzen();
				this._horseModel = null;
			}

			this._horseModel = ModuleService.getModule(RacingModuleC).getParticleHorses()[this._index].getHorseObject();
			if (this._displayObj) {
				this._horseModel.instance.worldTransform.position = this._displayObj.worldTransform.position;
				this._horseModel.instance.worldTransform.rotation = new mw.Rotation(0, 0, -140)
			}
			this._horseModel.playAnimation(EHorseAnimation.Standby, 1, true)
		}

		let guessModuleC = ModuleService.getModule(GuessModuleC);

		let winRate = (guessModuleC.getWinRate(this._index) * 100).toFixed(2) + "%";
		this.text_winRate.text = winRate;

		this.text_name.text = this._cureInfo.property.nickName;
		let lineageCfg = GameConfig.Lineage.getElement(this._cureInfo.property.lineage);
		this.text_lineage.text = GameConfig.Language[lineageCfg.lineage].Value;
		this.image_lineage.imageGuid = lineageCfg.icon;

		let hobby = GameConfig.Hobby.getElement(this._cureInfo.property.hobby)
		this.text_hobby.text = GameConfig.Language[hobby.describe].Value;
		let nature = GameConfig.Personalioty.getElement(this._cureInfo.property.nature);
		this.text_nature.text = GameConfig.Language[nature.name].Value;
		this.text_odd.text = "1 : " + guessModuleC.getHorseOdd(this._index).toFixed(2);
		this.text_all.text = guessModuleC.getHorseAll(this._index).toFixed(2) + "";
		this.text_player.text = guessModuleC.getHorsePlayer(this._index).toFixed(2) + "";
		this.setRate(this._cureInfo.rate);

		this._canRefresh = true;
	}

	private setRate(rate: number) {
		this.canvas_rate.visibility = mw.SlateVisibility.SelfHitTestInvisible
		let index = 0;
		let textRate: string = "";
		let colorStr: string = "";
		for (let i = 0; i < GlobalVar.RATE_DESCRIBE.length; i++) {
			let arr = GlobalVar.RATE_DESCRIBE[i];
			for (let j = 0; j < arr.length; j++) {
				if (index === rate) {
					textRate = GlobalVar.RATE_DESCRIBE[i][j].toString();
					colorStr = "#" + GlobalVar.RATE_FONT_COLOR[i];
					break;
				}
				index++;
			}
			if (textRate) {
				break;
			}
		}
		this.text_rate.text = textRate;
		this.text_rate.setFontColorByHex(colorStr);
	}

	private refreshTime() {
		const cur = ModuleService.getModule(RacingModuleC).getCompotitionElasped();
		let time = GlobalVar.Duration_Competition_Bet - cur;
		time = time > 0 ? time : 0;
		this.text_time.text = time.toFixed(1);
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
		SoundHelper.instance().play(1042);
		this._index = ModuleService.getModule(RacingModuleC).getPlayerHorseIndex();
		if (!this._index) {
			this._index = ModuleService.getModule(GuessModuleC).getHorseIndex();
		}
		this._canRefresh = true;

		ModuleService.getModule(PlayerModuleC).hideBasicUIExceptMoney();
		CameraUtils.changeCamera(this._cameraFocusObj);
		this.canvas_rate.visibility = mw.SlateVisibility.Hidden
		this.refreshInfo();
		EffectMgr.instance().playEffect(EffectScene.EffectGuess);
		this._timeRefreshTimer = Scheduler.TimeStart(() => {
			this.refreshTime();
		}, 0.1, -1);
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		CameraUtils.resetCamera();
		if (this._horseModel) {
			this._horseModel.forzen();
			this._horseModel = null;
		}
		if (this._timeRefreshTimer) {
			Scheduler.Cancel(this._timeRefreshTimer);
			this._timeRefreshTimer = 0;
		}
		EffectMgr.instance().stopEfeect(EffectScene.EffectGuess);
		ModuleService.getModule(PlayerModuleC).showBasicUI();
		SoundHelper.instance().restoreBGM();
	}

}
