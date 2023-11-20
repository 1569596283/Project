import { GameEvents } from "../GameEvents";
import { PlayerModuleC } from "../module/PlayerModule";
import GetMoneyUI_Generate from "../ui-generate/ui/GetMoneyUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { emitter } from "../utils/Emitter";
import { Scheduler } from "../utils/Scheduler";
import BasicView from "./BasicView";

/** 显示时间 */
const SHOW_TIME: number = 2.5;
/** 图片间隔 */
const IMAGE_INTERVAL: number = 0.2;
/** 飞行时间 */
const FLY_TIME: number = 0.6;
/** 最小缩放 */
const MIN_SCALE: number = 0.55;
/** 结算类型 */
export enum EGetType {
	Money,
	Diamond,
}

export class GetMoneyInfo {
	money: number;
	type: EGetType;
	hide?: () => void;
}
export default class GetMoneyUI extends GetMoneyUI_Generate {
	private _coinImageArr: mw.Image[] = [];

	private _diamondImageArr: mw.Image[] = [];

	/**	开始位置 */
	private _startPosition: mw.Vector2;
	/** 金币目标位置 */
	private _coinTargetPosition: mw.Vector2;
	/** 钻石目标位置 */
	private _diamondTargetPosition: mw.Vector2;
	/** 关闭界面计时器 */
	private _showSchedule: number = 0;
	/** 关闭回调 */
	private _hide: () => void;
	/** canvas_coin 和 canvas_jem的Y坐标 */
	private _parentY: number = 0;

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;

		let c = 0;
		let coinImage: mw.Image = this["image_coin" + c];
		while (coinImage) {
			this._coinImageArr.push(coinImage);
			c++;
			coinImage = this["image_coin" + c];
		}

		let d = 0;
		let diamondImage: mw.Image = this["image_jem" + d];
		while (diamondImage) {
			this._diamondImageArr.push(diamondImage);
			d++;
			diamondImage = this["image_jem" + d];
		}

		if (!this._coinTargetPosition) {
			this._startPosition = this.image_coin0.position;
			let basicView = mw.UIService.getUI(BasicView);
			let textMoney = basicView.mTextMoney;
			let diamondText = basicView.mTextDiamond;
			this._coinTargetPosition = mw.Vector2.zero;
			this._diamondTargetPosition = mw.Vector2.zero;
			mw.localToViewport(textMoney.cachedGeometry, mw.Vector2.zero, mw.Vector2.zero, this._coinTargetPosition)

			mw.localToViewport(diamondText.cachedGeometry, mw.Vector2.zero, mw.Vector2.zero, this._diamondTargetPosition)
		}
		this._parentY = this.canvas_coin.position.y;
	}

	public onShow(...params: any[]) {
		let info: GetMoneyInfo = params[0];
		if (!info) {
			return;
		}
		this.text_money.text = info.money + '';
		if (info.hide) {
			this._hide = info.hide;
		} else {
			this._hide = null;
		}
		this._showSchedule = Scheduler.TimeStart(() => {
			this._hide && this._hide();
			mw.UIService.hide(GetMoneyUI);
			this._showSchedule = 0;
		}, SHOW_TIME);
		let arr: mw.Image[];
		let target: mw.Vector2;
		let total: number;
		let event;

		switch (info.type) {
			case EGetType.Money:
				arr = this._coinImageArr;
				target = this._coinTargetPosition.clone();
				this.canvas_coin.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				this.canvas_jem.visibility = mw.SlateVisibility.Hidden;
				total = ModuleService.getModule(PlayerModuleC).getMoney();
				event = GameEvents.EVNET_MONEY_CHANGE;
				this.text_money.setFontColorByHex("#FE9750FF");
				break;
			case EGetType.Diamond:
				arr = this._diamondImageArr;
				target = this._diamondTargetPosition.clone();
				this.canvas_coin.visibility = mw.SlateVisibility.Hidden;
				this.canvas_jem.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				total = ModuleService.getModule(PlayerModuleC).getDiamond();
				event = GameEvents.EVNET_DIAMOND_CHANGE;
				this.text_money.setFontColorByHex("#01A9F7FF");
				break;
			default:
				console.log("出错了！！！！");
				break;
		}
		let i = 0;
		target.y -= this._parentY;
		Scheduler.TimeStart(() => {
			let image: mw.Image = arr[i];
			this.createTween(image, target);
			i++;
		}, IMAGE_INTERVAL, arr.length);
		Scheduler.TimeStart(() => {
			emitter.emit(event);
		}, FLY_TIME);
	}

	private createTween(image: mw.Image, targetPosition: mw.Vector2) {
		if (!image) {
			return;
		}
		image.visibility = mw.SlateVisibility.SelfHitTestInvisible;

		ActionMgr.instance().runTween({ pos: this._startPosition.clone(), size: new mw.Vector2(1) }, this)
			.to({ pos: targetPosition.clone(), size: new mw.Vector2(MIN_SCALE) }, FLY_TIME * 1000)
			.onUpdate((T) => {
				image.position = T.pos;
				image.renderScale = T.size;
			})
			.start()
			.onComplete(() => {
				image.visibility = mw.SlateVisibility.Hidden;
			})
	}

	public onHide() {
		if (this._showSchedule) {
			Scheduler.Cancel(this._showSchedule);
			this._showSchedule = 0;
		}
		ActionMgr.instance().remove(this);

	}

}
