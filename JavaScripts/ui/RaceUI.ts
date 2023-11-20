/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-22 09:30:14
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-03-14 09:38:21
 */

import { ECompetitionState, RichTextElementParams, IHorseInfo, GlobalVar, EWeatherType, ECameraMoveType } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import { PlayerModuleC } from "../module/PlayerModule";
import { RacingModuleC } from "../module/RacingModule";
import { WeatherModuleC } from "../module/WeatherModule";
import RaceUI_Generate from "../ui-generate/ui/RaceUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { emitter } from "../utils/Emitter";
import Utils from "../utils/Utils";
import InteractiveUI from "./InteractiveUI";
import PopWindowUI, { IPopWindowInfo } from "./PopWindowUI";
import RankItem from "./RankItem";
import ReportCell from "./ReportCell";
import BarrageItem_Generate from "../ui-generate/ui/BarrageItem_generate";
import HorseClient from "../logic/HorseClient";

const ITEM_SIZE: mw.Vector2 = new mw.Vector2(530, 40);
const ITEM_INTERVAL: number = 10;
export default class RaceUI extends RaceUI_Generate {
	private _minutes: number = 0;
	private _seconds: number = 0;
	private _refreshTextInterval: number = 0;

	private _reportCells: ReportCell[] = []
	private _collectCells: ReportCell[] = []
	private _bScrolling: boolean = false
	private _reportScrollSpeed: number = 0
	private _richTextParamsCaches: RichTextElementParams[][] = []

	private _rankItemArr: RankItem[] = [];

	private _btns: mw.Button[] = []

	private _lastLeaderData: number[] = [];

	private _barrageUse: BarrageItem_Generate[] = [];
	private _barrageCache: BarrageItem_Generate[] = [];

	private _screenLength: number = 0;

	private _randomY: number[] = [100, 200, 300];
	private _lastY: number = 0;


	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this._reportScrollSpeed = GameConfig.Global.getElement(1023).Parameter1

		emitter.on(GameEvents.EVENT_COMPETITION_BROCAST, (params: RichTextElementParams[]) => {
			this.addReport(params)
		}, this)
		emitter.on(GameEvents.EVENT_COMPETITION_STATE_CHANGE, (state: ECompetitionState) => {
			if (state == ECompetitionState.End) {
				this._richTextParamsCaches.length = 0
			}
		}, this)

		this.button_leave.onClicked.add(() => {
			let info: IPopWindowInfo = {
				comfirmCallback: () => {
					ModuleService.getModule(RacingModuleC).exitRace();
				},
				title: GameConfig.Language.RaceUI_LeaveRace.Value,
				titleImg: "131524",
				desc: GameConfig.Language.RaceUI_LeaveRaceConfirm.Value
			}
			mw.UIService.show(PopWindowUI, info);
		})

		this.panelBrocast.visibility = mw.SlateVisibility.Hidden;
		// console.log("屏幕长度", this._screenLength)
	}

	public startTime() {
		let time = ModuleService.getModule(RacingModuleC).getCompotitionElasped();
		this.text_time.text = Utils.Seconds2MinuteToString(time);
		this._seconds = time;
		// this.text_time.text = this._minutes + ":" + this._seconds;
		// this._minutes = Math.floor(time / 60);
		// this._seconds = Math.floor(time % 60);
		this.canUpdate = true;
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
	protected onUpdate(dt: number) {
		this._seconds += dt;
		// this._refreshTextInterval += dt;
		// if (this._refreshTextInterval >= 1) {
		// 	this._refreshTextInterval -= 1;
		// 	this._seconds += 1;
		// 	if (this._seconds >= 60) {
		// 		this._seconds -= 60;
		// 		this._minutes++;
		// 	}

		// 	// this.text_time.text = this._minutes + ":" + this._seconds;
		// }
		this.text_time.text = Utils.Seconds2MinuteToString(this._seconds);

		if (this._bScrolling && this._reportCells.length > 0) {
			const lastOne = this._reportCells[this._reportCells.length - 1]
			if (lastOne.getPositionY() + lastOne.getDimensions().y < this.scroll_report.size.y - 20) {
				this._bScrolling = false
				this.showNextCell()
			} else {
				let colletCount = 0
				for (let i = this._reportCells.length - 1; i >= 0; i--) {
					const cell = this._reportCells[i];
					let posY = cell.getPositionY()
					posY -= dt * this._reportScrollSpeed
					cell.setPositionY(posY)
					if (posY + cell.getDimensions().y < 0) {
						colletCount++
						cell.removeTween()
					}
				}
				for (let i = 0; i < colletCount; i++) {
					const cell = this._reportCells.shift()
					this.collected(cell)
				}
			}
		}
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		this.canUpdate = false;
		this._seconds = 0;
		this._lastLeaderData = [];
		this.text_time.text = Utils.Seconds2MinuteToString(this._seconds);
		this.initRankItem();
		this.initCameraButton();
		mw.UIService.hide(InteractiveUI);
		ModuleService.getModule(PlayerModuleC).hideBasicUI();

		if (ModuleService.getModule(RacingModuleC).getPlayerHorse()) {
			this.canvas_leave.visibility = mw.SlateVisibility.Hidden;
		} else {
			this.canvas_leave.visibility = mw.SlateVisibility.Visible;
		}
		this.panelBrocast.visibility = mw.SlateVisibility.Hidden
		this.panel_guide.visibility = mw.SlateVisibility.Hidden
	}

	protected addReport(params: RichTextElementParams[]) {
		this._richTextParamsCaches.push(params)
		this.showNextCell()
	}

	protected collected(cell: ReportCell) {
		cell.uiObject.visibility = mw.SlateVisibility.Hidden
		cell.setPositionY(this.scroll_report.size.y)
		this._collectCells.push(cell)
	}

	protected showNextCell() {
		if (this._bScrolling) { return }
		const data = this._richTextParamsCaches.shift()
		if (!data) { return }

		const state = ModuleService.getModule(RacingModuleC).getCompotitionState()
		if (state >= ECompetitionState.End) {
			return
		}

		this.panelBrocast.visibility = mw.SlateVisibility.SelfHitTestInvisible
		let cell = this.getReportCell()
		cell.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible
		cell.initWithData(this.scroll_report.size.x, data)
		cell.setPositionY(this.scroll_report.size.y)
		this._reportCells.push(cell)
		this._bScrolling = true
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		for (const cell of this._reportCells) {
			cell.removeTween()
		}
		this._reportCells.length = 0
		for (const cell of this._collectCells) {
			cell.removeTween()
		}
		this._collectCells.length = 0

		this.scroll_report.removeAllChildren()

		this._richTextParamsCaches.length = 0
		this._bScrolling = false
	}

	protected getReportCell() {
		let colletCell: ReportCell = this._collectCells.pop()
		if (!colletCell) {
			colletCell = mw.UIService.create(ReportCell)
			this.scroll_report.addChild(colletCell.uiObject)
		}
		return colletCell
	}

	/**
	 * 显示天气图标
	 */
	public showWeather() {
		let weather = ModuleService.getModule(WeatherModuleC).getWeatherType();
		let cfg = GameConfig.Weather.findElement("Type", weather);
		if (cfg) {
			this.image_weather.imageGuid = cfg.Icon;
		} else {
			console.log(" 天气信息出错了 ");
		}
	}

	private initRankItem() {
		let horses = ModuleService.getModule(RacingModuleC).getParticleHorses();
		for (let i = 0; i < horses.length; i++) {
			let item = this.getItem(i);
			let vec2 = new mw.Vector2();
			vec2.x = 0;
			vec2.y = i * (ITEM_SIZE.y + ITEM_INTERVAL);
			item.uiObject.position = vec2;
			item.init(horses[i]);
		}
	}

	private initCameraButton() {
		for (let i = 0; i < this._btns.length; i++) {

		}
	}

	private getItem(index: number) {
		if (this._rankItemArr[index]) {
			return this._rankItemArr[index];
		} else {
			let item = mw.UIService.create(RankItem);
			this.canvas_rank.addChild(item.uiObject);
			item.uiObject.size = item.button_camera.size;
			this._rankItemArr.push(item);
			return item;
		}
	}

	public refreshRank(leaderData: number[]) {
		if (this._rankItemArr.length <= 0 || leaderData.length <= 0 || !this.visible) {
			return;
		}
		if (leaderData.length != 8) {
			console.log(" 排名信息出错了！！！ ", leaderData);
		}
		let temVec2: mw.Vector2 = mw.Vector2.zero;
		temVec2.x = this._rankItemArr[0].uiObject.position.x;
		for (let i = 0; i < this._rankItemArr.length; i++) {
			let item = this._rankItemArr[i];
			let guid = item.getGuid();
			let rank = leaderData.indexOf(guid);
			item.refresh(i);
			let uiobj = this._rankItemArr[i].uiObject
			let startY = uiobj.position.y;
			let targetY = rank * (ITEM_SIZE.y + ITEM_INTERVAL);
			if (Math.abs(startY - targetY) > ITEM_INTERVAL) {
				ActionMgr.instance().runTween({ y: startY }, this)
					.to({ y: targetY }, 500)
					.onUpdate((T) => {
						temVec2.y = T.y
						uiobj.position = temVec2;
					})
					.start()
			}
		}
		this.createBarrage(leaderData);
	}

	public refreshRankButton(chooseIndex: number) {
		this._rankItemArr.forEach((item, index: number) => {
			if (chooseIndex == index) {
				item.button_camera.normalImageColor = LinearColor.colorHexToLinearColor("#4AB74F7F");
			} else {
				item.button_camera.normalImageColor = LinearColor.colorHexToLinearColor("#0000007F");
			}
		})
	}


	private randomColor() {
		let str: string = ""
		let chs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
		for (let i = 0; i < 8; i++) {
			let pos = Math.floor(Math.random() * (chs.length - 1))
			str += chs[pos]
		}
		return str
	}

	private createBarrage(leaderData: number[]) {
		if (!this._screenLength) {
			this._screenLength = mw.getViewportSize().x + 200;
		}
		if (this._lastLeaderData.length <= 0) {
			this._lastLeaderData = leaderData;
			return;
		}
		const playerID = Player.localPlayer.playerId;
		const lastRank = this._lastLeaderData.indexOf(playerID);
		const newRank = leaderData.indexOf(playerID);
		if (lastRank == newRank) {
			return;
		}

		let str = "";
		let horse: HorseClient;
		if (lastRank > newRank) {
			str = GameConfig.Language.Barrage_Beyond.Value;
			for (let i = 0; i < lastRank; i++) {
				let id = this._lastLeaderData[i]
				let newIndex = leaderData.indexOf(id);
				if (newIndex >= lastRank) {
					horse = ModuleService.getModule(RacingModuleC).getPlayerHorse(id);
					break;
				}
			}
		} else {
			str = GameConfig.Language.Barrage_Backward.Value;
			for (let i = lastRank; i < leaderData.length; i++) {
				let id = this._lastLeaderData[i]
				let newIndex = leaderData.indexOf(id);
				if (newIndex <= lastRank) {
					horse = ModuleService.getModule(RacingModuleC).getPlayerHorse(id);
					break;
				}
			}
		}
		str = mw.StringUtil.format(str, horse.getHorseInfo().property.nickName);
		let item = this.getBarrage();
		item.text_info.fontColor = new mw.LinearColor(mw.LinearColor.colorHexToLinearColor(this.randomColor()))
		item.text_info.text = str;

		const startPos = new mw.Vector2(this._screenLength, item.uiObject.position.y);
		const targetPos = new mw.Vector2(-400, item.uiObject.position.y);
		ActionMgr.instance().runTween({ progress: 0 }, this)
			.to({ progress: 1 }, 5000)
			.onUpdate((T) => {
				item.uiObject.position = mw.Vector2.lerp(startPos, targetPos, T.progress);
			})
			.start()
			.onComplete(() => {
				this._barrageUse.splice(0, 1);
				this._barrageCache.push(item);
			}).easing((amount: number) => {
				// if ((amount *= 2) < 1) {
				// 	return -0.5 * (--amount * (amount - 2) - 1)
				// }
				// return 0.5 * amount * amount
				return mw.TweenUtil.Easing.Linear.None(amount)
			})
		this._lastLeaderData = leaderData;
	}

	private getBarrage() {
		let item: BarrageItem_Generate;
		if (this._barrageCache.length > 0) {
			item = this._barrageCache.pop();
		} else {
			item = mw.UIService.create(BarrageItem_Generate);
			this.topCanvas.addChild(item.uiObject);
		}
		item.uiObject.position = new mw.Vector2(this._screenLength, this.getRandomY());
		this._barrageUse.push(item);
		return item;
	}

	public getRandomY() {
		let arr = [];
		this._randomY.forEach(y => {
			if (y != this._lastY) {
				arr.push(y);
			}
		});
		let y = arr[Math.floor(Math.random() * arr.length)];
		this._lastY = y;
		return y;
	}

}
