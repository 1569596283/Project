import { EBuffTargetType, EBuffType, GlobalVar, IHorseInfo, RichTextElementParams } from "../Common";
import ReportCell_Generate from "../ui-generate/ui/ReportCell_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { RichText } from "../utils/RichText";
export default class ReportCell extends ReportCell_Generate {
	private _pos: mw.Vector2 = new mw.Vector2(0, 0)
	private _richText: RichText
	private _tweenActions: any[] = []
	private _noticeTween: mw.Tween<mw.Vector2>
	private _delayTimer: number = 0
	private _renderScale: mw.Vector2
	protected onAwake(): void {
		super.onAwake()
		this._renderScale = this.imageNotice.renderScale
	}
	public initWithData(width: number, params: RichTextElementParams[]) {
		this.contentRoot.removeAllChildren()
		this._richText = new RichText(this.contentRoot, this.contentRoot.size.x, 20)
		let color: { x: number, y: number, z: number, a?: number } = { x: 0, y: 0, z: 0, a: 0 }
		this._richText.setBackgroundColor(color)
		if (params && params.length > 0) {
			for (let i = 0; i < params.length; i++) {
				const element = params[i];
				this._richText.pushbackElement(params[i])
			}
			this._richText.render()
			this.contentBg.size = this.getDimensions().clone()
		}
		this.startAction()
	}

	public setPositionY(posY: number) {
		this._pos.y = posY
		this.uiObject.position = this._pos
	}
	public getPositionY() {
		return this._pos.y
	}

	public getDimensions() { return this._richText.getSize() }

	public startAction() {
		this.imageNotice.renderScale = this._renderScale.clone()
		this._noticeTween = ActionMgr.instance().ShakeUI(this.imageNotice, this, 120, 0.85, Infinity, () => {

		})

		const elements = this._richText.getAllElements()
		for (const element of elements) {
			const textBlock = element.getText()
			if (textBlock && element.getParams().inParam) {
				const tween = ActionMgr.instance().brightnessFont(textBlock, this, 400)
				this._tweenActions.push(tween)
			}
		}
	}
	private stopNoticeAction() {
		if (this._noticeTween) {
			this._noticeTween.stop()
			this._noticeTween = null
		}
	}
	private stopFontAction() {
		for (const tween of this._tweenActions) {
			tween.stop()
		}
	}
	public removeTween() {
		this.stopNoticeAction()
		this.stopFontAction()
		this._tweenActions.length = 0
		ActionMgr.instance().remove(this)

	}
}
