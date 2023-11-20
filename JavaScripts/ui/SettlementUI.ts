
import { GlobalVar, ImageNumber, ISettlementData } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GuessModuleC } from "../module/GuessModule";
import { PlayerModuleC } from "../module/PlayerModule";
import SettlementUI_Generate from "../ui-generate/ui/SettlementUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import GetMoneyUI, { EGetType, GetMoneyInfo } from "./GetMoneyUI";
import { BagMouduleC } from "../module/BagMoudule";

class SettleItem {
	ui: mw.Canvas
	imageMyRank: mw.Image
	imageOther: mw.Image
	imageRank: mw.Image
	textName: mw.TextBlock
	textRewards: mw.TextBlock
	textTime: mw.TextBlock
	textBet: mw.TextBlock
	textBetCounts: mw.TextBlock
}

export default class SettlementUI extends SettlementUI_Generate {

	private items: SettleItem[] = [];

	private _getMoney: number = 0;
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		for (let i = 0; i < 8; i++) {
			let cell = this['cell' + i]
			let item = new SettleItem()
			item.ui = cell
			item.imageMyRank = cell.findChildByPath('ImageMyRank') as mw.Image
			item.imageOther = cell.findChildByPath('ImageNormal') as mw.Image
			item.imageRank = cell.findChildByPath('ImageRank') as mw.Image
			item.textName = cell.findChildByPath('TextHorseName') as mw.TextBlock
			item.textRewards = cell.findChildByPath('TextRewards') as mw.TextBlock
			item.textTime = cell.findChildByPath('TextTime') as mw.TextBlock
			item.textBet = cell.findChildByPath('TextBet') as mw.TextBlock
			item.textBetCounts = cell.findChildByPath('TextBetCounts') as mw.TextBlock
			this.items.push(item)
		}

		this.buttonNext.onClicked.add(() => {
			if (this._getMoney > 0) {
				let info: GetMoneyInfo = {
					money: this._getMoney,
					type: EGetType.Diamond,
					hide: () => {
						ModuleService.getModule(GuessModuleC).showGuessResult();
					}
				}
				mw.UIService.show(GetMoneyUI, info);
			} else {
				ModuleService.getModule(GuessModuleC).showGuessResult();
			}
			mw.UIService.hide(SettlementUI)
		})
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
		this._getMoney = 0;
		this.itemScroll.scrollToStart()
		this.buttonNext.visibility = mw.SlateVisibility.Hidden
		let dataArr = params[0] as ISettlementData[]
		const allNames = GameConfig.Name.getAllElement();

		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			const data = dataArr[i]
			if (data) {
				item.ui.visibility = mw.SlateVisibility.HitTestInvisible
				if (!data.horseName) {
					data.horseName = allNames[data.firstName].firstName + " " + allNames[data.lastName].lastName;
				}
				item.textName.text = data.horseName
				item.textRewards.text = data.rewards.toString()
				item.textTime.text = data.time.toFixed(2).toString()
				item.textBet.text = data.bet.toString()
				item.textBetCounts.text = data.timeAward.toString()

				if (data.giveup) {
					item.textTime.text = GameConfig.Language.GiveUp.Value
				}
				if (data.ownerId == Player.localPlayer.playerId) {
					this._getMoney = data.rewards + data.timeAward;
					item.imageMyRank.visibility = mw.SlateVisibility.SelfHitTestInvisible
				} else {
					item.imageMyRank.visibility = mw.SlateVisibility.Hidden
				}
			}
			item.ui.visibility = mw.SlateVisibility.Hidden
		}

		let index = 0

		this.showItem(index)
		let timer = Scheduler.TimeStart(() => {
			index++
			if (index < 8) {
				this.showItem(index)
			} else {
				Scheduler.Cancel(timer)
			}
		}, 0.6, 7, -1, () => {
			this.buttonNext.visibility = mw.SlateVisibility.Visible
		})
	}

	private showItem(index: number) {
		SoundHelper.instance().play(1019)
		const item = this.items[index]
		item.ui.visibility = mw.SlateVisibility.SelfHitTestInvisible
		item.ui.renderOpacity = 0
		ActionMgr.instance().fadeIn(item.ui, 500, this)
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		ModuleService.getModule(BagMouduleC).entarStable()
		// SoundHelper.instance().pauseMusic()
		ActionMgr.instance().remove(this)
		ModuleService.getModule(PlayerModuleC).showBasicUI();
	}

}
