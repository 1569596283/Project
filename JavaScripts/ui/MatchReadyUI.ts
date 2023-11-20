
/** 
 * AUTHOR: 远山迷雾
 * TIME: 2022.11.22-10.20.05
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import { EWeatherType, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { RacingModuleC } from "../module/RacingModule";
import { WeatherModuleC } from "../module/WeatherModule";
import MatchReadyUI_Generate from "../ui-generate/ui/MatchReadyUI_generate";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import BasicView from "./BasicView";
import LuckyUI, { ILuckyUIInfo } from "./LuckyUI";
import RaceUI from "./RaceUI";

export default class MatchReadyUI extends MatchReadyUI_Generate {
	/** 赛道抽取UI */
	private _wayLuckyUI: LuckyUI;
	/** 天气抽取UI */
	private _weatherLuckyUI: LuckyUI;
	/** 赛道抽奖信息 */
	private _wayLuckyInfo: ILuckyUIInfo;
	/** 天气抽奖信息 */
	private _weatherLuckyInfo: ILuckyUIInfo;

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
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		this.init();
		mw.UIService.hide(BasicView);
	}

	/**
	 * 初始化
	 */
	private init() {
		let player = Player.localPlayer
		if (!player) {
			return;
		}
		if (!this._wayLuckyUI) {
			this.createLuckyUI();
		}

		this._wayLuckyInfo.index = ModuleService.getModule(RacingModuleC).getRacingWayIndex(player.playerId);
		this._weatherLuckyInfo.index = ModuleService.getModule(WeatherModuleC).getWeatherType();

		this.initLuckyUI();
	}

	/**
	 * 创建luckyUI
	 */
	private createLuckyUI() {
		this._wayLuckyInfo = {
			text_left: GameConfig.Language.Matchreadyui_3.Value,
			text_right: GameConfig.Language.Matchreadyui_4.Value,
			index: 0,
			isWay: true,
			itemSize: this.canvas_way.size
		};
		this._wayLuckyUI = mw.UIService.create(LuckyUI);
		this.canvas_way.addChild(this._wayLuckyUI.uiObject);
		this._wayLuckyUI.uiObject.position = new mw.Vector2(0, 0);

		this._weatherLuckyInfo = {
			text_left: GameConfig.Language.Matchreadyui_2.Value,
			text_right: "",
			index: 0,
			isWay: false,
			itemSize: this.canvas_weather.size
		};
		this._weatherLuckyUI = mw.UIService.create(LuckyUI);
		this.canvas_weather.addChild(this._weatherLuckyUI.uiObject);
		this._weatherLuckyUI.uiObject.position = new mw.Vector2(0, 0);
	}

	/**
	 * 初始化LuckyUI
	 */
	private initLuckyUI() {
		this._wayLuckyUI.show(this._wayLuckyInfo);
		this.canvas_weather.visibility = mw.SlateVisibility.Hidden;
		this.canvas_desc.visibility = mw.SlateVisibility.Hidden;

		Scheduler.TimeStart(() => {
			this._weatherLuckyUI.show(this._weatherLuckyInfo);
			this.canvas_weather.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}, 2);

	}

	/**
	 * 显示天气描述
	 */
	public showDescribe() {
		this.canvas_desc.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		let weatherCfg = GameConfig.Weather.findElement("Type", this._weatherLuckyInfo.index);
		this.text_desc.text = GameConfig.Language.getElement(weatherCfg.Describe).Value;
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
	}

}
