/*
 * @Author: jiezhong.zhang
 * @Date: 2023-03-10 09:52:42
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-03-10 16:30:25
 */

/** 
 * AUTHOR: 远山迷雾
 * TIME: 2022.11.15-18.16.24
 */

import Loading_Generate from "../ui-generate/ui/Loading_generate";

export default class Loading extends Loading_Generate {

	private static _instance: Loading;
	private static get instance(): Loading {
		if (Loading._instance == null) {
			Loading._instance = mw.createUI('Loading', this);
		}
		return Loading._instance;
	}

	private targetPercent: number = 0;//目标进度
	private static _speed: number = 1;//速度
	private completeAutoClose: boolean = false;//完成是否自动移除loading

	getLayer(): number {
		return mw.UILayerTop;
	}

	onStart(): void {
		this.canUpdate = true
		this.mProgressBar.currentValue = (0);
	}

	onUpdate(dt: number) {
		let angle = this.mDiamondsFlash_img.renderTransformAngle;
		this.mDiamondsFlash_img.renderTransformAngle = (angle + dt * 45);
		this.mDiamondsFlash_img.renderScale = (mw.Vector2.one.multiply(1 + Math.sin(angle * 0.05) * 0.5));

		let value = this.mProgressBar.currentValue;
		if (value >= this.targetPercent) {
			if (this.completeAutoClose) {
				this.setVisible(false);
			}
			return;
		}
		value += dt * Loading._speed;
		// console.log(" Loading.speed  :", Loading._speed);
		this.mProgressBar.currentValue = value
	}

	onShow(msg: string, targetPercent: number, completeAutoClose: boolean) {
		if (targetPercent < this.targetPercent) {
			this.mProgressBar.currentValue = (0);
		}
		this.targetPercent = targetPercent;
		this.completeAutoClose = completeAutoClose;
		this.mMsg_txt.text = (msg);
	}
	/**
	 * 显示loading(不同阶段会重复调用)
	 * @param msg 显示的提示信息
	 * @param targetPercent 目标进度(0-1)
	 * @param completeAutoClose 完成后是否自动关闭
	 */
	public static showLoading(msg: string, targetPercent: number, completeAutoClose?: boolean) {
		mw.UIService.show(Loading, msg, targetPercent, completeAutoClose)
	}

	public static set speed(speed: number) {
		this._speed = speed;
	}

}
