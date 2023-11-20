/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-27 16:12:00
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-01-09 17:02:12
 */

/** 
 * AUTHOR: 今日份的晚安
 * TIME: 2022.11.27-16.12.00
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import { PlayerModuleC } from "../module/PlayerModule";
import InteractiveUI_Generate from "../ui-generate/ui/InteractiveUI_generate";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import Utils from "../utils/Utils";

export class IInteractiveInfo {
	desc: string;
	type: EInteractiveType;
	triggerGuid: string = '';
	text_yes?: string = '';
	text_no?: string = '';
	comfirmCallback?: (data?: any) => void;
	cancelCallback?: () => void;
	showType?: EInteractiveShowType = EInteractiveShowType.Interactive;
	isShowNo?: boolean = true;
	cost?: number = 0;
	extendData?: any;
}

/** 交互界面显示类型 */
export enum EInteractiveShowType {
	/**  先显示对话，再显示选择 */
	Interactive,
	/**  只显示对话 */
	Talk,
	/**  只显示选择 */
	Choose
}

/** 交互界面触发类型 */
export enum EInteractiveType {
	None,
	/** 报名 */
	SignUp,
	/** 买马 */
	Shop,
	/** 下注 */
	Guess,
	/** 繁育 */
	Breed,
	/** 卖粪 */
	Shit,
	/** 带走小马 */
	AdoptPony
}

export default class InteractiveUI extends InteractiveUI_Generate {

	private _comfirmCallback: (data?: any) => void
	private _cancelCallback: () => void
	private _cost: number;
	private _extendData: any = null
	private _trigger: mw.Trigger;

	private _type: EInteractiveType;

	private _turnAgain: number = 0;

	private _playID: number = null

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initButtons();

		this.button_talk.onClicked.add(() => {
			this.canvas_button.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.canvas_describe.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.button_talk.visibility = mw.SlateVisibility.Hidden;
			this.playRandomTalkSound()
		})

		this.button_no.onClicked.add(() => {
			this._cancelCallback && this._cancelCallback()
			this.showtalk();
		})
		this.button_yes.onClicked.add(() => {
			this.rootCanvas.visibility = mw.SlateVisibility.Hidden;
			this._comfirmCallback && this._comfirmCallback(this._extendData)
		})
		this.button_cost.onClicked.add(() => {
			this.rootCanvas.visibility = mw.SlateVisibility.Hidden;
			this._comfirmCallback && this._comfirmCallback(this._cost)
		})
		this.button_close.onClicked.add(() => {
			if (!this.canvas_button.visible) {
				this.rootCanvas.visibility = mw.SlateVisibility.Hidden;
			}
		})
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		this.rootCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;

		this.clearParams()
		let info = params[0] as IInteractiveInfo
		if (!info) {
			return;
		}
		this.text_descirbe.text = info.desc;
		this.text_descirbe.invalidateLayoutAndVolatility();
		if (info.triggerGuid && info.triggerGuid.length > 0) {
			this._trigger = GameObject.findGameObjectById(info.triggerGuid) as mw.Trigger;
		}

		this._type = info.type;
		switch (info.showType) {
			case EInteractiveShowType.Interactive:
			default:
				this.button_talk.visibility = mw.SlateVisibility.Visible;
				this.canvas_button.visibility = mw.SlateVisibility.Hidden;
				this.canvas_describe.visibility = mw.SlateVisibility.Hidden;
				break;
			case EInteractiveShowType.Talk:
				this.playRandomTalkSound()
				this.button_talk.visibility = mw.SlateVisibility.Hidden;
				this.canvas_button.visibility = mw.SlateVisibility.Hidden;
				this.canvas_describe.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				break;
			case EInteractiveShowType.Choose:
				this.playRandomTalkSound()
				this.button_talk.visibility = mw.SlateVisibility.Hidden;
				this.canvas_button.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				this.canvas_describe.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				break;
		}

		// 是否需要花费金币
		if (info.cost || info.cost > 0) {
			this.canvas_cost.visibility = mw.SlateVisibility.Visible;
			this.button_yes.visibility = mw.SlateVisibility.Hidden;
			this._cost = info.cost;
			this.text_money.text = this._cost.toFixed(0);
		} else {
			this.canvas_cost.visibility = mw.SlateVisibility.Hidden;
			this.button_yes.visibility = mw.SlateVisibility.Visible;
		}

		// 是否显示取消按钮
		if (info.isShowNo == undefined || info.isShowNo) {
			this.button_no.visibility = mw.SlateVisibility.Visible
		} else {
			this.button_no.visibility = mw.SlateVisibility.Hidden
		}

		this._extendData = info.extendData;
		this._comfirmCallback = info.comfirmCallback;
		this._cancelCallback = info.cancelCallback;

	}


	//播放随机区间的对话音效
	private async playRandomTalkSound() {
		if (this._type == EInteractiveType.AdoptPony) {
			return
		}
		let vec = [1031, 1032, 1033, 1034, 1035]
		if (this._playID) {
			SoundHelper.instance().stopSound(this._playID)
		}
		this._playID = await SoundHelper.instance().play(vec[Utils.RangeInt(0, vec.length)])
	}

	protected clearParams() {
		this._comfirmCallback = null
		this._cancelCallback = null
		this._cost = 0;
	}

	/**
	 * 再次触发
	 * @param type 交互类型
	 */
	public turnAgain(changeState: boolean = false) {
		if (!this._trigger) {
			return;
		}
		if (changeState && this._type !== EInteractiveType.Guess && this._type !== EInteractiveType.SignUp) {
			return;
		}
		if (this._turnAgain) {
			Scheduler.Cancel(this._turnAgain);
			this._turnAgain = 0;
		}
		this._turnAgain = Scheduler.TimeStart(() => {
			this._trigger.onEnter.broadcast(Player.localPlayer.character);
			this._turnAgain = 0;
		}, 0.5, 1);
	}

	private showtalk() {
		this.button_talk.visibility = mw.SlateVisibility.Visible;
		this.canvas_button.visibility = mw.SlateVisibility.Hidden;
		this.canvas_describe.visibility = mw.SlateVisibility.Hidden;
	}

	public leave() {
		this._trigger = null;
		mw.UIService.hide(InteractiveUI);
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		// ModuleService.getModule(PlayerModuleC).showBasicUI();
	}

}
