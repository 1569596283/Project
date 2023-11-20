/*
 * @Author: jiezhong.zhang
 * @Date: 2023-05-15 17:18:29
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-06-05 09:55:56
 */
export enum TurnViewAlign {
    Top,
    Down
}

/**
 * 自动滚动列表
 */
export default class TurnView {
    private _scroll: mw.ScrollBox
    private _scrollSize: mw.Vector2
    private _prefab: mw.Canvas

    private _cells: mw.UIScript[] = []

    private _align: TurnViewAlign = TurnViewAlign.Down

    //自动滚动的距离
    private _autoScrollDistanceMax: number = 0
    private _autoScrollDistance: number = 0

    constructor(scroll: mw.ScrollBox) {
        this._scroll = scroll
        this._scroll.onUserScrolled.add((offset: number) => {
            this.onScrollEvent(offset)
        })
        this._scroll.onScrollEnd.add(() => {
            this.onScrollComplete()
        })
        this._scrollSize = scroll.size
    }

    update(dt: number) {

    }

    public pushbackCell(cell: mw.UIScript) {
        this._scroll.addChild(cell.uiObject)
        let childCounts = this._cells.length
        switch (this._align) {
            case TurnViewAlign.Top:
                cell.uiObject.position = new mw.Vector2(0, this._scroll.size.y * childCounts)
                break;
            case TurnViewAlign.Down:
                cell.uiObject.position = new mw.Vector2(0, this._scroll.size.y)
                break;
            default:
                break;
        }

        this._cells.push(cell)

        this.doLayout()
    }

    private doLayout() {

        this.scrollToItem(this._cells.length - 1)
    }

    private scrollToItem(index: number) {
        if (index >= this._cells.length) { return }

        const targetCell = this._cells[index]
        const pos = targetCell.uiObject.position
        const size = targetCell.uiObject.size
        const targetPos = new mw.Vector2(0, pos.y - size.y)
        this._autoScrollDistanceMax = size.y
    }

    private onScrollEvent(offset: number) {

    }
    private onScrollComplete() {

    }
}