import TranslateArena_Generate from "../ui-generate/ui/TranslateArena_generate";
import { ActionMgr } from "../utils/ActionMgr";

/**
 * 场景过渡动画
 */
export default class TranslateArena extends TranslateArena_Generate {
	private _images: mw.Canvas[] = []

	private _originPos: mw.Vector2[] = []
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this._images.push(this.panel1)
		this._images.push(this.panel2)
		this._images.push(this.panel3)

		this._originPos.push(this.panel1.position.clone())
		this._originPos.push(this.panel2.position.clone())
		this._originPos.push(this.panel3.position.clone())
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
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		let offset = [-1, 1]
		for (let i = 0; i < this._images.length; i++) {
			const image = this._images[i];
			const pos = image.position
			let startPos = new mw.Vector2(2200 * offset[(i % 2)] * -1, pos.y)
			this._images[i].position = startPos;
			// ActionMgr.instance().moveTo2D(this._images[i], startPos, this._originPos[i].clone(), 550, this, () => {
			// 	ActionMgr.instance().moveTo2D(this._images[i], this._originPos[i].clone(), startPos, 550, this, null, mw.TweenUtil.Easing.Cubic.Out)
			// }, mw.TweenUtil.Easing.Cubic.Out)
			ActionMgr.instance().moveTo2D(this._images[i], startPos, this._originPos[i].clone(), 700, this, () => {
				ActionMgr.instance().moveTo2D(this._images[i], this._originPos[i].clone(), startPos, 700, this, null)
			})
		}
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		ActionMgr.instance().remove(this)
	}

}
