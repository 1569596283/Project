import { CommonAssets, CommonTrigger, ECompetitionState, ERaceStage, ESceneType, EWeatherType, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import { PlayerModuleC } from "../module/PlayerModule";
import { RacingModuleC } from "../module/RacingModule";
import { WeatherModuleC } from "../module/WeatherModule";
import BasicView_Generate from "../ui-generate/ui/BasicView_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { emitter } from "../utils/Emitter";
import { RichText } from "../utils/RichText";
import SoundHelper from "../utils/SoundHelper";
import Transation from "./Transation";
import Shop from "../interactive/Shop";
import ShopUI from "./ShopUI";
import ShopInnerUI from "./ShopInnerUI";
const stringArr = ["Uncle_talk4", "Uncle_talk7", "Breed_talk3", "Shit_talk11", "Shit_none4"];

export default class BasicView extends BasicView_Generate {

	private _countDown: number = 0
	private _noticeTween: any
	private _panelMoneyScale: mw.Vector2
	private _panelDiamondScale: mw.Vector2

	private _notifyTextSize: mw.Vector2;

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = true;
		this.layer = mw.UILayerBottom;
		this.initButtons();
		console.log("绑定事件")
		this.button_join.onClicked.add(() => {
			let racing = ModuleService.getModule(RacingModuleC);
			let state = racing.getCompotitionState();
			mw.UIService.hide(ShopUI)
			ModuleService.getModule(PlayerModuleC).showBasicUI()
			switch (state) {
				case ECompetitionState.Sign:
					Player.localPlayer.character.worldTransform.rotation = (CommonTrigger.SIGN_TRIGGER_ROA);
					ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Sign, CommonTrigger.SIGN_TRIGGER_POS);
					break;
				case ECompetitionState.Bet:
					ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Bet, CommonTrigger.GUESS_TRIGGER_POS);
					Player.localPlayer.character.worldTransform.rotation = (CommonTrigger.GUESS_TRIGGER_ROA);
					break;
				case ECompetitionState.Running:
					mw.UIService.show(Transation, GameConfig.Language.Competition.Value, () => {
						racing.watchRace();
					})
					break;
				default:
					break;
			}

		})

		this.buttonGoBattle.onClicked.add(() => {
			let rot = ModuleService.getModule(PlayerModuleC).getCurSceneBirthRot(ESceneType.Bussiness)
			Player.localPlayer.character.worldTransform.rotation = (rot)
			ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Bussiness)
		})

		this.mTextMoney.text = ModuleService.getModule(PlayerModuleC).getMoney().toFixed(0)
		this.mTextDiamond.text = ModuleService.getModule(PlayerModuleC).getDiamond().toFixed(0)

		this.initNotice();
		emitter.on(GameEvents.EVENT_COMPETITION_STATE_CHANGE, (state: ECompetitionState) => {
			this.canvas_notice.visibility = mw.SlateVisibility.Hidden
			this.button_join.visibility = mw.SlateVisibility.Visible
			this.canUpdate = false

			switch (state) {
				case ECompetitionState.Sign:
					this._countDown = GlobalVar.Duration_Competition_SignUp
					this.text_notice.text = GameConfig.Language.BasicUI_SignTime.Value
					this.mTex_takeIn.text = GameConfig.Language.BasicUI_GoSign.Value;
					this.canvas_notice.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					this.text_time.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					this.canUpdate = true
					break;
				case ECompetitionState.Bet:
					this._countDown = GlobalVar.Duration_Competition_Bet
					this.text_notice.text = GameConfig.Language.BasicUI_BetTime.Value
					this.mTex_takeIn.text = GameConfig.Language.BasicUI_GoBet.Value;
					this.canvas_notice.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					this.text_time.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					this.canUpdate = true
					break;
				case ECompetitionState.Running:
					this.text_notice.text = GameConfig.Language.BasicUI_WatchTime.Value
					this.mTex_takeIn.text = GameConfig.Language.BasicUI_GoWatch.Value
					this.canvas_notice.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					this.text_time.visibility = mw.SlateVisibility.Hidden;
					break;
			}
			this.refreshText_Noitfy_Size();
			if (this._noticeTween) {
				this._noticeTween.stop()
				this._noticeTween = null
			}
			const start = new mw.Vector2(this.clippingNode.size.x + 20, 0)
			const end = new mw.Vector2(-RichText.caculateStringWidth(this.text_notice.text, this.text_notice.fontSize), 0)
			this._noticeTween = ActionMgr.instance().moveTo2D(this.text_notice, start, end, 4000, this, undefined, undefined, Infinity)
		}, this)

		this.buttonShop.onClicked.add(() => {
			Player.localPlayer.character.worldTransform.rotation = (CommonTrigger.SHOP_TRIGGER_ROA);
			ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Shop, CommonTrigger.SHOP_TRIGGER_POS);
		})
		this.buttonBag.onClicked.add(() => {
			let ch = Player.localPlayer.character
			let tmpRot = CommonTrigger.SELLFAT_TRIGGER_ROA
			ch.worldTransform.rotation = (tmpRot)
			ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Stable);
		})
		this.button_breed.onClicked.add(() => {
			Player.localPlayer.character.worldTransform.rotation = (CommonTrigger.BREED_TRIGGER_ROA);
			ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Breed, CommonTrigger.BREED_TRIGGER_POS);
		})
		// this.buttonHide.onClicked.add(() => {
		// 	ModuleService.getModule(PlayerModuleC).reqUnEquipHorse()
		// })

		emitter.on(GameEvents.EVNET_MONEY_CHANGE, (culture) => {
			// console.log("金币变化");
			this.panel_money.renderScale = this._panelMoneyScale.clone()
			let gold = ModuleService.getModule(PlayerModuleC).getMoney()
			ActionMgr.instance().SlowMotion_UINumberText(this.mTextMoney, gold, this)
			ActionMgr.instance().ShakeUI(this.panel_money, this)
		}, this)

		emitter.on(GameEvents.EVNET_DIAMOND_CHANGE, (total, val) => {
			//钻石变化
			this.panel_diamond.renderScale = this._panelDiamondScale.clone()
			let diamond = ModuleService.getModule(PlayerModuleC).getDiamond()
			ActionMgr.instance().SlowMotion_UINumberText(this.mTextDiamond, diamond, this)
			ActionMgr.instance().ShakeUI(this.panel_diamond, this)
		}, this)

		/**
		 * 更新天气和日期
		 */
		emitter.on(GameEvents.EVENT_WEATHER_INFO, () => {
			this.refreshWeather()
		}, this)

		emitter.on(GameEvents.EVENT_BUTTON_CLICK, () => {
			SoundHelper.instance().play(1005)
		}, this)

		this._panelMoneyScale = this.panel_money.renderScale
		this._panelDiamondScale = this.panel_diamond.renderScale
		// this.canvas_raceProgress.visibility = mw.SlateVisibility.Hidden;
	}

	private initNotice() {

		this.button_join.visibility = mw.SlateVisibility.Hidden;
		this.text_time.visibility = mw.SlateVisibility.Hidden;
		this._notifyTextSize = this.clippingNode.size.clone();
		this.refreshText_Noitfy_Size();

		const index = Math.floor(Math.random() * stringArr.length);
		let str = stringArr[index];
		this.text_notice.text = GameConfig.Language[str].Value;
		const start = new mw.Vector2(this.clippingNode.size.x + 20, 0)
		const end = new mw.Vector2(-RichText.caculateStringWidth(this.text_notice.text, this.text_notice.fontSize) - 20, 0)
		this._noticeTween = ActionMgr.instance().moveTo2D(this.text_notice, start, end, 4000, this, undefined, undefined, Infinity)
	}

	private refreshText_Noitfy_Size() {
		let size = this._notifyTextSize.clone();
		if (!this.text_time.visible) {
			size.add(new mw.Vector2(this.text_time.size.x, 0));
			if (!this.button_join.visible) {
				size.add(new mw.Vector2(this.button_join.size.x, 0));
			}
		}
		this.clippingNode.size = size;
	}

	public onShow() {

		this.mainCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.panelShot.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		let state = ModuleService.getModule(RacingModuleC).getCompotitionState();
		if (state == ECompetitionState.Sign || state == ECompetitionState.Bet || state == ECompetitionState.Running) {
			this.canvas_notice.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}

		if (GlobalVar.RACE_PROGRESS.length <= 0) {
			let all = this.progress_race.size.x;
			let guessStart = this.canvas_guess.position.x / all;
			GlobalVar.RACE_PROGRESS.push(guessStart);
			let raceStart = this.canvas_race.position.x / all;
			GlobalVar.RACE_PROGRESS.push(raceStart);
			let waitStart = this.canvas_wait.position.x / all;
			GlobalVar.RACE_PROGRESS.push(waitStart);
			GlobalVar.RACE_PROGRESS.push(1);
		}
		this.refreshWeather()

	}

	/**
	 * 显示比赛状态
	 */
	public showRaceProgress() {
		this.canvas_raceProgress.visibility = mw.SlateVisibility.SelfHitTestInvisible;
	}

	public isShowSignCountDown() {
		return this.canvas_notice.visibility == mw.SlateVisibility.SelfHitTestInvisible && this._countDown >= 0
	}

	protected onUpdate(dt: number) {
		// this._interval += dt
		// if (this._interval > 0.1) {
		// 	this._interval -= 0.1

		// 	let time = 
		// 		this.text_time.text = "" + Math.round(this._countDown).toString()
		// }
	}

	protected refreshWeather() {
		let info = ModuleService.getModule(WeatherModuleC).getWeatherInfo()
		switch (info.weatherType) {
			case EWeatherType.Sunny:
				this.textWeather.text = GameConfig.Language.Weather_1.Value
				break;
			case EWeatherType.Rain:
				this.textWeather.text = GameConfig.Language.Weather_2.Value
				break;
			case EWeatherType.Overcast:
				this.textWeather.text = GameConfig.Language.Weather_3.Value
				break;
			case EWeatherType.Snowy:
				this.textWeather.text = GameConfig.Language.Weather_4.Value
				break;

			default:
				break;
		}

		this.textDaily.text = mw.StringUtil.format(GameConfig.Language.Time_data.Value, info.year,
			info.month, info.day)
	}

	/**
	 * 刷新赛场进度
	 * @param progress 当前进度
	 */
	public refreshRaceProgress(stage: ERaceStage, progress: number, time?: number) {
		let max = GlobalVar.RACE_PROGRESS[stage];
		if (!max) {
			console.log(" 刷新赛场进度出错了 ");
			return;
		}
		if (time) {
			this.text_time.text = "" + Math.round(time).toString();
		} else {
			this.text_time.visible && (this.text_time.visibility = mw.SlateVisibility.Hidden)
		}
		let min = GlobalVar.RACE_PROGRESS[stage - 1] ? GlobalVar.RACE_PROGRESS[stage - 1] : 0;
		let cur = min + (max - min) * progress;
		this.progress_race.currentValue = cur;
	}

}
