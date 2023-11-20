/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-15 14:49:04
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-01-11 15:46:08
 */

import { GlobalVar, ImageNumber } from "../Common";
import { GameConfig } from "../config/GameConfig";
import LuckyUI_Generate from "../ui-generate/ui/LuckyUI_generate";
import SoundHelper from "../utils/SoundHelper";
import ImageItem from "./ImageItem";
import MatchReadyUI from "./MatchReadyUI";

/** 
 * AUTHOR: 今日份的晚安
 * TIME: 2022.11.15-14.49.04
 */

/** 默认加速度 */
const ACC: number = 2000;
/** 图片间隔 */
const ITEM_INTERVAL: number = 0;
/** 距离目标剩余几个停止 */
const SLOW_DOWN_INDEX: number = 3;
/** 减速截止时间 */
const SLOW_DOWN_TIME: number = 1.3;
/** 加速截止时间 */
const ACC_TIME: number = 0.9;

export class ILuckyUIInfo {
	text_left: string;
	text_right: string;
	index: number;
	isWay: boolean;
	itemSize: mw.Vector2
}

export default class LuckyUI extends LuckyUI_Generate {
	/** 需要显示的图标的序号 */
	private index: number = 0;
	/** canvas移动的速度 */
	private _speed: number = 0;
	/** canvas移动的加速度 */
	private _acc: number;
	/** canvas的坐标 */
	private _canvasPos: mw.Vector2 = mw.Vector2.zero;
	/** 当前显示的所有的item */
	private _items: ImageItem[] = [];
	/** 加速的时间 */
	private _accTime: number = 0;
	/** 准备停止 */
	private _readyStop: boolean = false;
	/**	图片资源数组 */
	private _imageGuidArr: string[] = [];
	/**	是否是赛道 */
	private _isWay: boolean = false;
	/**  */
	private _itemSize: mw.Vector2;

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
	protected onUpdate(dt: number) {
		this._accTime += dt;
		if (this._accTime <= ACC_TIME) {
			this._speed += (this._acc * dt);
		} else if (this._accTime <= SLOW_DOWN_TIME) {
			this._speed -= (this._acc * dt);
		} else if (this._readyStop) {
			this._speed -= this._acc * dt;
		}

		if (this._speed <= 0) {
			let pos = this.canvas_reference.position;
			this.canvas.position = new mw.Vector2(this.canvas.position.x, pos.y);
			this.canUpdate = false;
			SoundHelper.instance().play(1038)
			if (!this._isWay) {
				let readyUI = mw.UIService.getUI(MatchReadyUI);
				readyUI.showDescribe();
			}
		} else {
			this.moveCanvas(dt);
		}
	}

	/**
	 * 设置显示时触发
	 */
	// protected onShow(...params: any[]) {

	// }

	public show(info: ILuckyUIInfo) {
		this.index = info.index;
		this._itemSize = info.itemSize;
		this.initOne(info);
		SoundHelper.instance().play(1018)
		this.init();
	}

	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}

	private init() {
		this._speed = 0;
		this._acc = ACC;
		this._accTime = 0;
		this.canUpdate = true;
		this._items = [];
		this.canvas.removeAllChildren();
		this._readyStop = false;

		let pos = this.canvas_reference.position;
		this.canvas.position = new mw.Vector2(this.canvas.position.x, pos.y);
		this._canvasPos = this.canvas.position;
		this.canvas_root.size = this._itemSize;
		this.canvas.size = this._itemSize;
		this.canvas_reference.size = this._itemSize;

		for (let i = 0; i < this._imageGuidArr.length; i++) {
			let guid = this._imageGuidArr[i];
			let item = mw.UIService.create(ImageItem);
			this.canvas.addChild(item.uiObject);
			this._items.push(item);
			item.init(guid, this._itemSize);
			item.uiObject.size = this._itemSize;
			let y = (i - 1) * (this._itemSize.y + ITEM_INTERVAL);
			item.uiObject.position = new mw.Vector2(0, y);
		};
	}

	/** 只初始化一次 */
	private initOne(info: ILuckyUIInfo) {
		if (this._imageGuidArr.length <= 0) {
			this._isWay = info.isWay;
			if (info.isWay) {
				this._imageGuidArr = ImageNumber;
			} else {
				let weatherArr = GameConfig.Weather.getAllElement();
				weatherArr.forEach(weatherCfg => {
					this._imageGuidArr.push(weatherCfg.Icon)
				});
			}
		}
	}

	private moveCanvas(dt: number) {
		this._canvasPos.y += this._speed * dt;

		let sub = this._canvasPos.y - (ITEM_INTERVAL + this._itemSize.y);

		if (sub >= 0) {
			this._canvasPos.y -= (ITEM_INTERVAL + this._itemSize.y);
			this.refreshItem();
		}
		this.canvas.position = this._canvasPos;
	}

	private refreshItem() {
		let pos = new mw.Vector2;
		let max = (this._items.length - 1) * (ITEM_INTERVAL + this._itemSize.y);
		for (let i = 0; i < this._items.length; i++) {
			let item = this._items[i];
			pos = item.uiObject.position;
			pos.y += (ITEM_INTERVAL + this._itemSize.y);
			if (pos.y >= max) {
				pos.y = -1 * (this._itemSize.y + ITEM_INTERVAL);
				if (this._accTime > SLOW_DOWN_TIME && this.index == (i + 1 + this._imageGuidArr.length - SLOW_DOWN_INDEX) % this._imageGuidArr.length) {
					let time = (this._itemSize.y + ITEM_INTERVAL) * SLOW_DOWN_INDEX * 2 / this._speed;
					this._acc = this._speed / time * 0.90;
					this._readyStop = true;

				}
			}
			item.uiObject.position = pos;
		}
	}

}
