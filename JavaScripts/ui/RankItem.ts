/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-28 17:34:07
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-01-10 11:42:36
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import { ECameraMoveType, EHorseState } from "../Common";
import { GameConfig } from "../config/GameConfig";
import HorseClient from "../logic/HorseClient";
import { RacingModuleC } from "../module/RacingModule";
import RankItem_Generate from "../ui-generate/ui/RankItem_generate";
import RaceUI from "./RaceUI";

export default class RankItem extends RankItem_Generate {
	/** 马的guid */
	private _guid: number = 0;
	/** 马的实例 */
	private _horseC: HorseClient;
	/** 名次（从0开始） */
	private _index: number;
	/** 刷新计时器 */
	private _interval: number;
	/** 赛道 */
	private _way: number;
	/** 是否完赛 */
	private _complete: boolean = false;

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this.button_camera.onClicked.add(() => {
			ModuleService.getModule(RacingModuleC).changeFocusHorse(this._way, ECameraMoveType.None);
		})
	}

	public init(horse: HorseClient) {
		this._horseC = horse;
		this.text_name.text = horse.getHorseInfo().property.nickName;
		this.text_speed.text = horse.getCurrentSpeed() + "km/h";
		this._guid = horse.getOwner().uid;
		this._complete = false;
		this._way = horse.getRacingWay();
		this.text_way.text = this._way + 1 + GameConfig.Language.Number.Value;
		let player = Player.localPlayer;
		if (player && this._guid === player.playerId) {
			this.text_name.fontColor = mw.LinearColor.red;
			this.text_speed.fontColor = mw.LinearColor.red;
			this.text_way.fontColor = mw.LinearColor.red;
		} else {
			this.text_name.fontColor = mw.LinearColor.white;
			this.text_speed.fontColor = mw.LinearColor.white;
			this.text_way.fontColor = mw.LinearColor.white;
		}
		this._interval = setInterval(() => {
			this.refresh();
		}, 100);
	}

	public refresh(index: number = -1) {
		if (index >= 0) {
			this._index = index;
		}
		if (this._complete || !this.visible) {
			if (this._interval) {
				clearInterval(this._interval);
			}
			return;
		}

		if (this._horseC.getState() == EHorseState.Vectory || this._horseC.isVectory()) {
			this.text_speed.text = GameConfig.Language.RankItem_1.Value;
			if (this._horseC.getEndTime() > 0) {
				this._complete = true;
			}
		} else if (this._horseC.getGiveup()) {
			this.text_speed.text = GameConfig.Language.RankItem_2.Value;
			this._complete = true;
		} else {
			let tmpSpeed = this._horseC.getCurrentSpeed() * (1 / 120000) * 3600;
			this.text_speed.text = tmpSpeed.toFixed(2) + "km/h";
		}
	}

	public getGuid() {
		return this._guid;
	}

	public getIndex() {
		return this._index;
	}

}
