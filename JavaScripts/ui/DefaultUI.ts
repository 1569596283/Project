/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2022-11-17 17:01:25
 * @LastEditors: yushi.kong yushi.kong@appshahe.com
 * @LastEditTime: 2022-12-27 15:37:09
 * @FilePath: \horseracing\JavaScripts\ui\DefaultUI.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by 代纯 chun.dai@appshahe.com, All Rights Reserved. 
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import { GameEvents } from "../GameEvents";
import DefaultUI_Generate from "../ui-generate/ui/DefaultUI_generate";
import { emitter } from "../utils/Emitter";
import SoundHelper from "../utils/SoundHelper";

export default class DefaultUI extends DefaultUI_Generate {

	private _reset: boolean = false;
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerScene;
		this.initButtons();

		this.button_jump.onClicked.clear()
		this.button_jump.onPressed.add(() => {
			SoundHelper.instance().play(1005)
			let player = Player.localPlayer;
			if (player) {
				player.character.jump();
			}
		})

		mw.InputUtil.onKeyDown(mw.Keys.SpaceBar, () => {
			let player = Player.localPlayer;
			if (player) {
				player.character.jump();
			}
		})

		this.mJoystick.onInputDir.add((vec: mw.Vector2) => {
			this.hideImage();
			if (vec.x > 0 && vec.y > 0) {
				this.rightTop.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			} else if (vec.x > 0 && vec.y < 0) {
				this.rightBottom.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			} else if (vec.x < 0 && vec.y < 0) {
				this.leftBottom.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			} else if (vec.x < 0 && vec.y > 0) {
				this.leftTop.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			}
		})

		this.hideGuide();
	}

	private hideImage() {
		this.rightTop.visible && (this.rightTop.visibility = mw.SlateVisibility.Hidden);
		this.leftTop.visible && (this.leftTop.visibility = mw.SlateVisibility.Hidden);
		this.leftBottom.visible && (this.leftBottom.visibility = mw.SlateVisibility.Hidden);
		this.rightBottom.visible && (this.rightBottom.visibility = mw.SlateVisibility.Hidden);
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		if (this._reset) {
			this.mJoystick.resetJoyStick();
			this._reset = false;
		}
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		this._reset = true;
	}

	public hideGuide() {
		this.canvas_introduce.visibility = mw.SlateVisibility.Hidden;
	}

	public showGuide() {
		let call = mw.UIScript.getBehavior("lan");
        if (call) {
            call(this.movetext);
            call(this.eyetext);
        }
		this.canvas_introduce.visibility = mw.SlateVisibility.SelfHitTestInvisible;
	}

}
