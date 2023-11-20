import { GameConfig } from "../config/GameConfig";
import GuidanceUI_Generate from "../ui-generate/ui/GuidanceUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import BasicView from "./BasicView";
import HorseBagUI from "./HorseBagUI";
import InteractiveUI from "./InteractiveUI";

export default class GuidanceUI extends GuidanceUI_Generate {
	private _routes: mw.Vector2[] = []
	private _dialogIndex: number = 0
	private _dialogContent: string[][] = []
	private _dialogCallback: () => void

	private _focusTouchCallback: () => void

	private _introduceTouchCallback: () => void

	private _basicUI: BasicView
	private _horseBagUI: HorseBagUI
	private _interactiveUI: InteractiveUI

	private _focusWidget: mw.Widget

	private _tweenFlash: mw.Tween<{
		value: number;
	}>
	private _tweenFinger: mw.Tween<mw.Vector2>

	private _focusTimer: number = 0

	private _talkSound: number = 0;

	/** 对话计时器 */
	private _dialogTimeStart: number = 0;
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerTop;
		this.initButtons();

		this.btnFinger.onClicked.add(() => {
			// this.focusWidget(BasicView, "buttonBag")
			// this.showLetter('')
			// this.showDialog("新建新建新建新建新建新建新建新建新建新建新建新建新建新建新建新建新建建新建新建新建建新建新建新建建新建新建新建建新建新建新建建新建新建新建新建新建新建新建", 0.1)
		})
		this.buttonDialog.onClicked.add(() => {
			this.showDialog_()
		})

		this.buttonIntroduce.onClicked.add(() => {
			this._introduceTouchCallback && this._introduceTouchCallback()
			this._introduceTouchCallback = null
		})

		this._routes.push(this.route1.position)
		this._routes.push(this.route2.position)
		this._routes.push(this.route3.position)
		this._routes.push(this.route4.position)

		this.canvas_yes.visibility = mw.SlateVisibility.Hidden
		this.panelDialog.visibility = mw.SlateVisibility.Hidden
		this.panelLetter.visibility = mw.SlateVisibility.Hidden
		this.panelIntroduce.visibility = mw.SlateVisibility.Hidden
		this.maskBackground.visibility = mw.SlateVisibility.Hidden
		this.imageTranslate.visibility = mw.SlateVisibility.Hidden
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

	}

	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}

	/**
	 * 聚焦UI组件
	 */
	public async focusWidget(targetWidget: mw.Widget, focus: number[], duration: number = 500, cb?: () => void, delayTime?: number) {
		this._focusTouchCallback = cb
		if (!focus) {
			focus = []
		}
		let delay = focus[0]
		if (!delay) {
			delay = 0
		}
		let posType = focus[1]
		if (!posType) {
			posType = 0
		}
		this.panelFocus.visibility = mw.SlateVisibility.SelfHitTestInvisible
		this.maskTouch.visibility = mw.SlateVisibility.Visible
		const targetSize = targetWidget.size.clone()

		await TimeUtil.delaySecond(0.01);
		let pixelPos = mw.Vector2.zero, viewPos = mw.Vector2.zero
		mw.localToViewport(targetWidget.cachedGeometry, mw.Vector2.zero, pixelPos, viewPos)
		const viewSize = mw.WindowUtil.getViewportSize()

		if (this._focusTimer) {
			Scheduler.Cancel(this._focusTimer)
			this._focusTimer = 0
		}
		this._focusTimer = Scheduler.TimeStart(() => {
			// //top
			this.maskTop.position = mw.Vector2.zero
			const topSize = this.maskTop.size.clone()
			ActionMgr.instance().runTween({ sizeX: viewSize.x, sizeY: 0 }, this)
				.to({ sizeX: viewSize.x, sizeY: viewPos.y }, duration)
				.onUpdate((obj) => {
					this.maskTop.size = new mw.Vector2(obj.sizeX, obj.sizeY)
				}).start()

			//bottom
			this.maskBottom.position = new mw.Vector2(0, this.uiObject.size.y)
			const bottomSize = this.maskBottom.size.clone()
			ActionMgr.instance().runTween({ sizeX: viewSize.x, sizeY: bottomSize.y, posX: this.maskBottom.position.x, posY: this.maskBottom.position.y }, this)
				.to({ sizeX: viewSize.x, sizeY: this.uiObject.size.y - viewPos.y - targetSize.y, posX: 0, posY: viewPos.y + targetSize.y }, duration)
				.onUpdate((obj) => {
					this.maskBottom.size = new mw.Vector2(obj.sizeX, obj.sizeY)
					this.maskBottom.position = new mw.Vector2(obj.posX, obj.posY)
				}).start()

			//Left
			this.maskLeft.size = new mw.Vector2(0, this.uiObject.size.y)
			this.maskLeft.position = new mw.Vector2(0, 0)
			ActionMgr.instance().runTween({ sizeX: 0, sizeY: this.maskLeft.size.y, posX: 0, posY: 0 }, this)
				.to({ sizeX: viewPos.x, sizeY: targetSize.y, posX: 0, posY: viewPos.y }, duration)
				.onUpdate((obj) => {
					this.maskLeft.size = new mw.Vector2(obj.sizeX, obj.sizeY)
					this.maskLeft.position = new mw.Vector2(obj.posX, obj.posY)
				}).start()

			//Right
			this.maskRight.size = new mw.Vector2(0, this.uiObject.size.y)
			this.maskRight.position = new mw.Vector2(this.uiObject.size.x, 0)
			ActionMgr.instance().runTween({ sizeX: this.maskRight.size.x, sizeY: this.maskRight.size.y, posX: this.maskRight.position.x, posY: this.maskRight.position.y }, this)
				.to({
					sizeX: this.uiObject.size.x - viewPos.x - targetSize.x,
					sizeY: targetSize.y,
					posX: viewPos.x + targetSize.x,
					posY: viewPos.y
				}, duration)
				.onUpdate((obj) => {
					this.maskRight.size = new mw.Vector2(obj.sizeX, obj.sizeY)
					this.maskRight.position = new mw.Vector2(obj.posX, obj.posY)
				})
				.onComplete(() => {
					this.maskTouch.visibility = mw.SlateVisibility.Hidden
					//widget flash

					this._tweenFlash = ActionMgr.instance().flash(targetWidget, 1000, this)
					if (targetWidget instanceof mw.Button) {
						this.focusBtn.onClicked.clear()
						this.focusBtn.onClicked.add(() => {
							this.focusBtn.onClicked.clear()
							targetWidget.onClicked.broadcast()
							targetWidget.renderOpacity = 1
							this._focusTouchCallback && this._focusTouchCallback()
							this._focusTouchCallback = null

							if (this._tweenFlash) {
								this._tweenFlash.stop()
								this._tweenFlash = null
							}
							if (this._tweenFinger) {
								this._tweenFinger.stop()
								this._tweenFinger = null
							}

							this.btnFinger.visibility = mw.SlateVisibility.Hidden
						})
					}
				})
				.start()

			this.focusBtn.size = targetSize.clone()
			this.focusBtn.position = viewPos.clone()

			//btn

			let offset = 0
			let angle = 0
			let start = new mw.Vector2(viewPos.x, viewPos.y)
			switch (posType) {
				case 0:
					start = new mw.Vector2(viewPos.x + targetSize.x / 2 - 20, viewPos.y + targetSize.y)
					angle = 0
					offset = 80
					break;
				case 1:
					start = new mw.Vector2(viewPos.x + targetSize.x / 2 - 160, viewPos.y - this.btnFinger.size.y)
					angle = 180
					offset = -80
					break;

				default:
					break;
			}
			let end = start.clone()
			end.y += offset
			this.btnFinger.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.btnFinger.position = start.clone()
			this.btnFinger.renderTransformAngle = angle
			this._tweenFinger = ActionMgr.instance().moveTo2D(this.btnFinger, start, end, 500, this).repeat(Infinity).yoyo(true)


			this._focusWidget = targetWidget
		}, delay)
	}

	public reset() {
		if (this._focusWidget) {
			this._focusWidget.renderOpacity = 1
			this._focusWidget = null
		}
		if (this._tweenFlash) {
			this._tweenFlash.stop()
			this._tweenFlash = null
		}
		if (this._tweenFinger) {
			this._tweenFinger.stop()
			this._tweenFinger = null
		}
		if (this._focusTimer) {
			Scheduler.Cancel(this._focusTimer)
			this._focusTimer = 0
		}

		this.btnFinger.visibility = mw.SlateVisibility.Hidden

		this.hideBlackMask()
		this.hideDialog()
		this.hideFocus()
		this.hideIntroduce()
		this.hideLetter()
	}

	public hideFocus() {
		this.panelFocus.visibility = mw.SlateVisibility.Hidden
		this.maskTop.position = new mw.Vector2(10000, 10000)
		this.maskBottom.position = new mw.Vector2(10000, 10000)
		this.maskLeft.position = new mw.Vector2(10000, 10000)
		this.maskRight.position = new mw.Vector2(10000, 10000)
	}


	/**
	 * 展示信件动画
	 */
	public showLetter(content: string, cb?: () => void) {
		if (!content || content.length <= 0) {
			this.textLetterContent.text = "content"
		}
		else {
			this.textLetterContent.text = GameConfig.Language[content].Value
		}
		this.panelLetterContent.position = new mw.Vector2(-100, 1700)
		this.panelLetter.visibility = mw.SlateVisibility.SelfHitTestInvisible
		this.canvas_yes.visibility = mw.SlateVisibility.Visible
		this.canvas_yes.renderOpacity = 0
		this.btnYes.onClicked.clear()
		this.btnYes.onClicked.add(() => {
			this.panelLetter.visibility = mw.SlateVisibility.Hidden
			cb && cb()
		})
		let startPoint = this._routes[0].clone()
		this.panelLetterContent.renderTransformAngle = 0
		ActionMgr.instance().runTween({ x: startPoint.x, y: startPoint.y, angle: this.panelLetterContent.renderTransformAngle }, this)
			.to({
				x: [this._routes[1].x, this._routes[1].x, this._routes[3].x],
				y: [this._routes[1].y, this._routes[1].y, this._routes[3].y],
				angle: 1080
			}, 500)
			.onStart(() => {
				SoundHelper.instance().play(1043)
			})
			.onUpdate((obj) => {
				this.panelLetterContent.position = new mw.Vector2(obj.x, obj.y)
				this.panelLetterContent.renderTransformAngle = obj.angle
			})
			.onComplete(async () => {
				ActionMgr.instance().fadeIn(this.canvas_yes, 5000, this).delay(1000)
				this._talkSound = await SoundHelper.instance().play(1024);
			})
			.start()
	}
	public hideLetter() {
		if (this._talkSound) {
			SoundHelper.instance().stopSound(this._talkSound);
			this._talkSound = 0;
		}
		this.panelLetter.visibility = mw.SlateVisibility.Hidden
	}

	/**
	 * 显示对话文字
	 * @param str 
	 */
	public showDialog(str: string[], delay: number = 0.2, cb?: () => void) {
		this._dialogCallback = cb
		this.textDialog.text = ''
		this.panelDialog.visibility = mw.SlateVisibility.SelfHitTestInvisible
		this._dialogContent.length = 0
		for (let i = 0; i < str.length; i++) {
			let chars: string[] = []
			console.log("str[i]", str[i])
			let tmpStr = GameConfig.Language[str[i]].Value
			for (let j = 0; j < tmpStr.length; j++) {
				chars.push(tmpStr[j])
			}
			this._dialogContent.push(chars)
		}
		this._dialogIndex = 0
		this.showDialog_()
	}

	private showDialog_(delay: number = 0.05) {
		if (this._dialogTimeStart && this._dialogIndex - 1 >= 0) {
			let dialog = "";
			let str = this._dialogContent[this._dialogIndex - 1];
			if (str && str.length > 0) {
				str.forEach(char => {
					dialog += char;
				});
				this.textDialog.text = dialog;
				Scheduler.Cancel(this._dialogTimeStart);
				this._dialogTimeStart = 0;
				return;
			}
		}
		let str = this._dialogContent[this._dialogIndex]
		console.log("显示对话", str)
		if (!str) {
			this._dialogCallback && this._dialogCallback()
			this._dialogCallback = null
		}
		let showStr = ''
		let indexChar = 0
		this._dialogTimeStart = Scheduler.TimeStart(() => {
			showStr += str[indexChar]
			this.textDialog.text = showStr
			indexChar++
			if (indexChar >= str.length) {
				Scheduler.Cancel(this._dialogTimeStart)
				this._dialogTimeStart = 0;
			}
		}, delay, -1)
		this._dialogIndex++
	}

	public hideDialog() {
		this.panelDialog.visibility = mw.SlateVisibility.Hidden
	}

	/**
	 * 介绍
	 */
	public showIntroduce(text: string, pos: mw.Vector2, cb?: () => void) {
		if (cb) {
			this._introduceTouchCallback = cb
			this.panelIntroduce.visibility = mw.SlateVisibility.Visible
			this.buttonIntroduce.visibility = mw.SlateVisibility.Visible
		} else {
			this.panelIntroduce.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.buttonIntroduce.visibility = mw.SlateVisibility.SelfHitTestInvisible
		}
		console.log("显示介绍", text)
		this.textIntroduce.text = GameConfig.Language[text].Value
		this.panelIntroduceContent.position = pos.clone()

	}
	public hideIntroduce() {
		this.panelIntroduce.visibility = mw.SlateVisibility.Hidden
	}

	/**
	 * 显示黑幕
	 */
	public showBlackMask() {
		this.maskBackground.visibility = mw.SlateVisibility.Visible
	}
	public hideBlackMask() {
		this.maskBackground.visibility = mw.SlateVisibility.Hidden
	}

	/**
	 * 显示过渡动画
	 */
	public showTranslate(cb: () => void) {
		this.imageTranslate.renderOpacity = 0
		this.imageTranslate.visibility = mw.SlateVisibility.Visible
		ActionMgr.instance().fadeInOut(this.imageTranslate, 3000, [1, 0], this, () => {
			cb && cb()
		}, () => {
			this.imageTranslate.renderOpacity = 1
			this.imageTranslate.visibility = mw.SlateVisibility.Hidden
		})
	}
}
