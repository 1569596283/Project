import Tips_Generate from "../ui-generate/ui/Tips_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import BasicView from "./BasicView";

class CellInfo {
	cell: mw.Canvas
	tweenMove: mw.Tween<mw.Vector2>
	tweenFade: mw.Tween<{ value: number }>
	delayTimer: number = 0
}

export default class Tips extends Tips_Generate {
	private _cells: mw.Canvas[] = []

	private _activeCells: CellInfo[] = []

	private _tweenMovingCounts: number = 0

	public static showTips(...params: any[]) {
		let flag = params[1] as number
		let basicView = mw.UIService.getUI(BasicView);
		if (flag == 1 || basicView.visible) {
			mw.UIService.show(Tips, ...params)
		}
	}

	protected onStart(): void {
		this._cells.push(this.mCell1)
		this._cells.push(this.mCell2)
		this._cells.push(this.mCell3)
		this._cells.push(this.mCell4)
		this._cells.push(this.mCell5)
		this._cells.push(this.mCell6)
	}

	protected onUpdate(dt: number) { }

	protected onShow(tipContent: string) {

		SoundHelper.instance().play(1022)

		this.reset()
		this.canUpdate = true
		Scheduler.TickStart(() => {
			let cell = this._cells.pop()
			if (!cell) {
				let cellInfo = this._activeCells.shift()
				cellInfo.tweenFade && cellInfo.tweenFade.stop()
				cellInfo.tweenMove && cellInfo.tweenMove.stop()
				cell = cellInfo.cell
			}

			const start = new mw.Vector2(this.mStartPoint.position.x, this.mStartPoint.position.y)
			const end = new mw.Vector2(this.mEndPoint.position.x, this.mEndPoint.position.y)

			let text = cell.findChildByPath('Content_txt') as mw.TextBlock
			text.text = tipContent

			cell.position = start
			cell.visibility = mw.SlateVisibility.HitTestInvisible
			cell.renderOpacity = 1

			let cellInfo = new CellInfo()
			cellInfo.cell = cell
			cellInfo.delayTimer = Scheduler.TimeStart(() => {
				SoundHelper.instance().play(1029)

				cellInfo.tweenFade = ActionMgr.instance().fadeOut(cell, 800, this, () => { }, mw.TweenUtil.Easing.Cubic.Out)
			}, 0.9)
			cellInfo.tweenMove = ActionMgr.instance().moveTo2D(cell, start, end, 1200, this, () => {
				this._tweenMovingCounts--
				cell.visibility = mw.SlateVisibility.Hidden

				for (let i = this._activeCells.length - 1; i >= 0; --i) {
					if (cellInfo == this._activeCells[i]) {
						cellInfo.tweenFade && cellInfo.tweenFade.stop()
						this._activeCells.splice(i, 1)
						break
					}
				}

				this._cells.push(cellInfo.cell)
				if (this._tweenMovingCounts <= 0) {
					mw.UIService.hide(Tips)
				}
			}, mw.TweenUtil.Easing.Quadratic.In)
			this._activeCells.push(cellInfo)

			this._tweenMovingCounts++

		})
	}

	protected onHide() {
		this.canUpdate = false
		ActionMgr.instance().remove(this)
		for (const cell of this._activeCells) {
			if (cell.delayTimer) {
				Scheduler.Cancel(cell.delayTimer)
				cell.delayTimer = 0
			}
		}
	}

	protected reset() {
		for (const cell of this._cells) {
			cell.position = new mw.Vector2(560, 1500)
		}
	}

	protected getEndPoint() {

	}
}
