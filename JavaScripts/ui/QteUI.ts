import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
import { EBuffType, ECameraMoveType, EHorseState, EPartType, EWeatherType, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import HorseClient from "../logic/HorseClient";
import { RacingModuleC } from "../module/RacingModule";
import QteUI_Generate from "../ui-generate/ui/QteUI_generate";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import RaceUI from "./RaceUI";

export default class QteUI extends QteUI_Generate {
	/** 数字变大计时器 */
	private _intervalBig: number = 0;
	/** 数字变小计时器 */
	private _intervalSmall: number = 0;

	/** 缩放倍数 */
	private _scale: number = 1;
	/** 缩放倍数 */
	private _scaleVec2: mw.Vector2 = new mw.Vector2;
	/** 点击次数 */
	private _count: number = 0;
	/** 剩余时间 */
	private _remainTime: number = 0;
	/** 是否可点击 */
	private _canClick: boolean = false;

	/** 箭头高度 */
	private _height: number = 0;
	/** 箭头移动速度 */
	private _speed: number = 100;
	/** 箭头最大高度 */
	private _maxHeight: number = 0;
	/** 箭头最小高度 */
	private _minHeight: number = 0;
	/** 箭头运动临时变量 */
	private _leftVec2: mw.Vector2 = new mw.Vector2;
	/** 箭头运动临时变量 */
	private _rightVec2: mw.Vector2 = new mw.Vector2;

	/** QTE显示计时 */
	private _scheduleTime: number = 0;
	/** 添加buff的数组 */
	private _buffIds: number[] = [];
	/** buff计时器数组 */
	private _buffTimeoutArr: number[] = [];
	/** 进度条计时器数组 */
	private _scaleTimeoutArr: number[] = [];
	/** 当前buff数量 */
	private _buffNum: number = 0;
	/** 增加buff的定时器 */
	private _addBuffInterval: number = 0;
	/**	添加buff的持续时间 */
	private _druationTime: number = 0;
	/**	特效 */
	private _effect: number = 0;
	/** 能量条比例 */
	private _progerss: number = 0;
	/** 当前增量 */
	private _curDetal: number = 0;
	/** QTE进度条计时器 */
	private _progressInterval: number = 0;
	/** 当前马匹赛道号 */
	private _curHorseIndex: number = 0;

	private _qteSound: number = 0
	private _burialPoint: boolean = false;

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
		let cfg = GameConfig.Skill.findElement("Type", EBuffType.QTE);
		this._druationTime = cfg.TargetDuration;

		this.progress_buff.sliderMaxValue = GlobalVar.QTE_MAX_CLICK;
	}

	protected initButtons(): void {
		super.initButtons();

		this.button_left.onClicked.clear();
		this.button_left.onClicked.add(
			this._buttonClick
		);
		this.button_right.onClicked.clear();
		this.button_right.onClicked.add(
			this._buttonClick
		);
		this.button_right.onPressed.add(() => {
			this.playClickSound()
		})
		this.button_left.onPressed.add(() => {
			this.playClickSound()
		})

		this._height = this.image_left.position.y;
		this._leftVec2 = this.image_left.position;
		this._rightVec2 = this.image_right.position;
		this._maxHeight = this._height + 30;
		this._minHeight = this._height - 20;

		this.button_exit.onClicked.add(() => {
			ModuleService.getModule(RacingModuleC).changeFocusHorse(this._curHorseIndex, ECameraMoveType.Far);
			mw.UIService.hide(QteUI);
		})

	}

	private playClickSound() {
		if (!this._canClick) {
			return;
		}
		SoundHelper.instance().play(1036)
	}

	private _buttonClick = () => {
		if (!this._canClick) {
			return;
		}

		this.image_left.visibility = mw.SlateVisibility.Hidden;
		this.image_right.visibility = mw.SlateVisibility.Hidden;
		this.canvas_guide.visibility = mw.SlateVisibility.Hidden;
		this.clearBigInterval();
		this._count++;
		this.text_count.text = "" + this._count;
		this._intervalBig = setInterval(() => {
			this._scale += 0.05;
			this._scaleVec2.x = this._scale;
			this._scaleVec2.y = this._scale;
			this.canvas_count.renderScale = this._scaleVec2;

			if (this._scale >= 1.3) {
				this.clearBigInterval();
				this._intervalSmall = setInterval(() => {
					this._scale -= 0.15;
					this._scaleVec2.x = this._scale;
					this._scaleVec2.y = this._scale;
					this.canvas_count.renderScale = this._scaleVec2;
					if (this._scale <= 1) {
						this.clearBigInterval();
						this._scale = 1;
						this._scaleVec2.x = this._scale;
						this._scaleVec2.y = this._scale;
						this.canvas_count.renderScale = this._scaleVec2;
					}
				}, 10)
			}
		}, 10);

		if (!this._effect) {
			let model = ModuleService.getModule(RacingModuleC).getPlayerHorse().getHorseObject();
			let globalCfg = GameConfig.Global.getElement(1039);
			let offset = new mw.Vector(globalCfg.Parameter3[0][0], globalCfg.Parameter3[0][1], globalCfg.Parameter3[0][2]);
			let rotation = new mw.Rotation(globalCfg.Parameter3[1][0], globalCfg.Parameter3[1][1], globalCfg.Parameter3[1][2]);
			let scale = new mw.Vector(globalCfg.Parameter3[2][0], globalCfg.Parameter3[2][1], globalCfg.Parameter3[2][2]);
			this._effect = GeneralManager.rpcPlayEffectOnGameObject(globalCfg.Parameter1.toString(), model.instance, 0, offset, rotation, scale);
		}

		this._buffNum++;
		this._curDetal += 1 / this._druationTime;
		if (this._buffNum > GlobalVar.QTE_MAX_CLICK) {
			return;
		}
		let bufftime = Scheduler.TimeStart(() => {
			this._buffNum--;
			this._curDetal -= 2 / this._druationTime;
			this._buffTimeoutArr.splice(0, 1);
		}, this._druationTime, 1);
		let scaletime = Scheduler.TimeStart(() => {
			this._curDetal += 1 / this._druationTime;
			this._scaleTimeoutArr.splice(0, 1);
		}, this._druationTime * 2, 1);
		this._buffTimeoutArr.push(bufftime);
		this._scaleTimeoutArr.push(scaletime);
		this._buffIds.push(1043);
	}

	private clearBigInterval() {
		if (this._intervalBig) {
			clearInterval(this._intervalBig);
			this._intervalBig = 0;
		}
		if (this._intervalSmall) {
			clearInterval(this._intervalSmall);
			this._intervalSmall = 0;
		}
	}

	private initInterval() {
		this.clearAllInterval();

		this._addBuffInterval = setInterval(() => {
			if (this._buffIds.length > 0) {
				let id = Player.localPlayer.playerId;
				ModuleService.getModule(RacingModuleC).requestAddBuffImpact(id, this._buffIds);
				this._buffIds = [];
			}
		}, 100)
	}

	/**
	 * 初始化
	 */
	private init() {
		this.initInterval();
		this._count = 0;
		this.text_count.text = "0";
		this.text_countdown_num.text = "" + Math.floor(this._remainTime);
		this._buffIds = [];
		this._buffNum = 0;
		this.progress_buff.currentValue = 0;
		const GAME_TIME = GameConfig.Global.getElement(1021).Parameter2[0];
		this._remainTime = GAME_TIME;
		this._effect = 0;
		this._curDetal = 0;
		this._progerss = 0;
		this._burialPoint = false;
	}

	public start(time: number = 0) {
		if (time) {
			this._scheduleTime = Scheduler.TimeStart(() => {
				ModuleService.getModule(RacingModuleC).changeFocusHorse(this._curHorseIndex, ECameraMoveType.Far);
				this.readyHide();
			}, time)
			return;
		}
		this.canUpdate = true;
		this._canClick = true;
		this._burialPoint = true;
		this.showGame();
		const GAME_TIME = GameConfig.Global.getElement(1021).Parameter2[0];
		this._scheduleTime = Scheduler.TickStart(
			(dt: number) => {
				this.text_countdown_num.text = "" + Math.floor(this._remainTime);
				this._remainTime -= dt;
			}, 5, -1, GAME_TIME
			, () => {
				Scheduler.Cancel(this._scheduleTime);
				this._scheduleTime = 0;
				this.settle();
			}
		);
	}

	private showGame() {
		this.playQteSound();
		this.canvas_countdown.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.canvas_guide.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.canvas_right.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.canvas_left.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.canvas_count.visibility = mw.SlateVisibility.SelfHitTestInvisible;

		this.canvas_cheer.visibility = mw.SlateVisibility.Hidden;
		this.image_left.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.image_right.visibility = mw.SlateVisibility.SelfHitTestInvisible;
	}

	private hideGame() {
		this.canvas_countdown.visibility = mw.SlateVisibility.Hidden;
		this.canvas_guide.visibility = mw.SlateVisibility.Hidden;
		this.canvas_right.visibility = mw.SlateVisibility.Hidden;
		this.canvas_left.visibility = mw.SlateVisibility.Hidden;
		this.canvas_count.visibility = mw.SlateVisibility.Hidden;
		this.text_settle_describe.visibility = mw.SlateVisibility.Hidden;

		this.canvas_cheer.visibility = mw.SlateVisibility.SelfHitTestInvisible;
	}

	/**
	* 每一帧调用
	* 通过canUpdate可以开启关闭调用
	* dt 两帧调用的时间差，毫秒
	*/
	protected onUpdate(dt: number) {

		if (this.canvas_guide.visible) {
			this._height += dt * this._speed;
			if ((this._height > this._maxHeight && this._speed > 0) || (this._height < this._minHeight && this._speed < 0)) {
				this._speed = -1 * this._speed;
			}
			if (this.image_left.visible) {
				this._leftVec2.y = this._height;
				this.image_left.position = this._leftVec2;
			}

			if (this.image_right.visible) {
				this._rightVec2.y = this._height;
				this.image_right.position = this._rightVec2;
			}
		}

		if (this._curDetal !== 0) {
			this._progerss += dt * this._curDetal;
			this.progress_buff.currentValue = this._progerss;
		}
	}

	/**
	 * 设置显示时触发
	 * 参数1：当前看向的马的赛道号，参数2：显示文字内容
	 */
	protected onShow(...params: any[]) {
		let index: number = params[0];
		let str: string = params[1];
		const horses = ModuleService.getModule(RacingModuleC).getParticleHorses();
		let horse: HorseClient = horses[index];
		this._curHorseIndex = horse.getRacingWay();
		this.text_cheer.text = str;
		if (horse.getState() === EHorseState.Vectory) {
			ModuleService.getModule(RacingModuleC).changeFocusHorse(horse.getRacingWay(), ECameraMoveType.Far);
			mw.UIService.hide(QteUI);
			return;
		}
		this.init();
		this.hideGame();
	}

	private async playQteSound() {
		let curVolume = SoundHelper.instance().getMusicVolume()
		SoundHelper.instance().setMusicVolume(curVolume * 0.5 * 100)

		this._qteSound = await SoundHelper.instance().play(1010)
	}

	private settle() {
		this._canClick = false;
		this.canvas_guide.visibility = mw.SlateVisibility.Hidden;
		this.text_settle_describe.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.image_left.visibility = mw.SlateVisibility.Hidden;
		this.image_right.visibility = mw.SlateVisibility.Hidden;

		if (this._count < GlobalVar.QTE_CLICK_TIMES[0]) {
			this.text_settle_describe.text = GameConfig.Language.Uiqte_cheer_describe_1.Value;
		} else if (this._count < GlobalVar.QTE_CLICK_TIMES[1]) {
			this.text_settle_describe.text = GameConfig.Language.Uiqte_cheer_describe_2.Value;
		} else if (this._count < GlobalVar.QTE_CLICK_TIMES[2]) {
			this.text_settle_describe.text = GameConfig.Language.Uiqte_cheer_describe_3.Value;
		} else {
			this.text_settle_describe.text = GameConfig.Language.Uiqte_cheer_describe_4.Value;
		}

		let index = ModuleService.getModule(RacingModuleC).getRacingWayIndex(Player.localPlayer.playerId);
		ModuleService.getModule(RacingModuleC).changeFocusHorse(index, ECameraMoveType.Far);
		this.readyHide();
	}

	private readyHide() {
		mw.UIService.hide(QteUI);
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		this.canUpdate = false;
		SoundHelper.instance().stopSound(this._qteSound)
		SoundHelper.instance().setMusicVolume(GlobalVar.GLOBAL_MUSIC * 100)
		this.clearAllInterval();

		if (this._effect) {
			EffectService.stop(this._effect);
			this._effect = 0;
		}

		let raceUI = mw.UIService.getUI(RaceUI);
		raceUI.baseCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
	}

	/**
	 * 清理计时器
	 */
	private clearAllInterval() {
		if (this._intervalBig) {
			clearInterval(this._intervalBig);
			this._intervalBig = 0;
		}
		if (this._intervalSmall) {
			clearInterval(this._intervalSmall);
			this._intervalSmall = 0;
		}
		if (this._scheduleTime) {
			Scheduler.Cancel(this._scheduleTime);
			this._scheduleTime = 0;
		}
		if (this._addBuffInterval) {
			clearInterval(this._addBuffInterval);
			this._addBuffInterval = 0;
		}
		if (this._progressInterval) {
			clearInterval(this._progressInterval);
			this._progressInterval = 0;
		}
		this._buffTimeoutArr.forEach((setTimeout) => {
			Scheduler.Cancel(setTimeout)
		})
		this._buffTimeoutArr = [];
		this._scaleTimeoutArr.forEach((setTimeout) => {
			Scheduler.Cancel(setTimeout)
		})
		this._scaleTimeoutArr = [];
	}
}