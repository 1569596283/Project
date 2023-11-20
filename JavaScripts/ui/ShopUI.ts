
import { CommonAssets, EHorseAnimation, ErrorCode, ETalkIndex, GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { PlayerModuleC, PlayerModuleData } from "../module/PlayerModule";
import { ShopModuleC } from "../module/ShopModule";
import ShopUI_Generate from "../ui-generate/ui/ShopUI_generate";
import Utils from "../utils/Utils";
import InteractiveUI, { EInteractiveShowType, EInteractiveType, IInteractiveInfo } from "./InteractiveUI";
import ShopInnerUI from "./ShopInnerUI";
import Tips from "./Tips";

class ShopItemInfo {
	canvas: mw.Canvas
	canvasOldPos: mw.Vector2
	button: mw.Button
	select: mw.Image
	coin: mw.Image
	price: mw.TextBlock
	mask: mw.Canvas
	icon: mw.Image
	name: mw.TextBlock
	desc: mw.TextBlock
	lineageCfgId: number
	unlockState: boolean

}


export default class ShopUI extends ShopUI_Generate {
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	private _selectItem: ShopItemInfo
	//所有血统按键
	private _lineageBtns: ShopItemInfo[] = []

	private _canvasNew: ShopItemInfo = null

	protected onAwake() {
		super.onAwake()
		//设置能否每帧触发onUpdate
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this.mBtnOK.onClicked.add(() => {
			if (!this._selectItem) {
				Tips.showTips(GameConfig.Language[ErrorCode[1023]].Value)
				return
			}
			let money = ModuleService.getModule(PlayerModuleC).getDiamond()
			if (!this._selectItem.unlockState) {
				let cost = this._selectItem.price.text
				if (money < Number(cost)) {
					let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.UnlockNone)
					ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.UnlockNone)
					this.mDescribe.text = str
					Tips.showTips(GameConfig.Language.Tips_notenoughdiamond.Value)
				} else {
					ModuleService.getModule(ShopModuleC).reqUnlock(this._selectItem.lineageCfgId)
				}
			}
			else {
				let cost: number = GameConfig.Lineage.getElement(this._selectItem.lineageCfgId).lineagePrice
				if (money >= cost || ModuleService.getModule(ShopModuleC).getIsFree(this._selectItem.lineageCfgId)) {
					ModuleService.getModule(ShopModuleC).reqFind(this._selectItem.lineageCfgId)
				}
				else {
					Tips.showTips(GameConfig.Language.Tips_notenoughdiamond.Value)

				}
			}
		})

		this.mBtnCancel.onClicked.add(() => {
			this.resetItemsPos()
			// this._selectItem.select.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.mConfirm.visibility = mw.SlateVisibility.Hidden
			if (this._selectItem.unlockState) {
				this.mShopUI_Look.text = GameConfig.Language.ShopUI_Look.Value
				this.mShopUI_TakeIt.text = GameConfig.Language.ShopUI_TakeIt.Value
			}
			else {
				this._lineageBtns.forEach(item => {
					if (!item.unlockState) {
						item.price.visibility = mw.SlateVisibility.SelfHitTestInvisible
						item.coin.visibility = mw.SlateVisibility.SelfHitTestInvisible
					}
				})
				this.mSelectCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
			}
			this.mBtnSllNo.visibility = mw.SlateVisibility.Visible
			this.showRandomDes()
		})

		this.mBtnClose.onClicked.add(() => {
			mw.UIService.hide(ShopUI)
			ModuleService.getModule(PlayerModuleC).showBasicUI();
			mw.UIService.getUI(InteractiveUI).turnAgain();
		})

		this.mBtnSllNo.onClicked.add(() => {
			mw.UIService.hide(ShopUI)
			ModuleService.getModule(PlayerModuleC).showBasicUI();
			mw.UIService.getUI(InteractiveUI).turnAgain();
		})
		this.initAllHorse()
	}

	public initAllHorse() {
		const unlockInfos = ModuleService.getModule(ShopModuleC).getAllUnlockInfo()
		const linageCfgs = GameConfig.Lineage.getAllElement()
		for (let i = 0; i < 7; i++) {
			const panel = this['mShopItem' + i] as mw.Canvas
			const itemInfo = new ShopItemInfo()
			itemInfo.canvas = panel
			itemInfo.button = panel.findChildByPath('Button') as mw.Button
			itemInfo.price = panel.findChildByPath('Price') as mw.TextBlock
			itemInfo.select = panel.findChildByPath('Select') as mw.Image
			if (!itemInfo.price) {
				let canvas = panel.findChildByPath('MaskConvas') as mw.Canvas
				itemInfo.price = canvas.findChildByPath('Price') as mw.TextBlock
			}
			itemInfo.mask = panel.findChildByPath('MaskConvas') as mw.Canvas
			itemInfo.coin = itemInfo.mask.findChildByPath('CoinIcon') as mw.Image
			itemInfo.icon = panel.findChildByPath('Icon') as mw.Image
			itemInfo.name = panel.findChildByPath('Name') as mw.TextBlock
			itemInfo.desc = panel.findChildByPath('Desc') as mw.TextBlock
			const linageCfg = linageCfgs[i]
			if (linageCfg) {
				itemInfo.lineageCfgId = linageCfg.ID

				itemInfo.select.visibility = mw.SlateVisibility.Hidden
				// info.coin.imageGuid = "
				let cost = GameConfig.Global.getElement(1051).Parameter2
				itemInfo.price.text = cost[ModuleService.getModule(ShopModuleC).getUnlockNum()] + ""

				itemInfo.icon.imageGuid = linageCfg.icon
				itemInfo.icon.size = new mw.Vector2(220, 220)
				itemInfo.name.text = GameConfig.Language.getElement(linageCfg.lineage).Value
				itemInfo.desc.text = GameConfig.Language.getElement(linageCfg.describe).Value
				itemInfo.button.onClicked.add(() => {
					this.selectLineage(itemInfo)
				})

				if (unlockInfos.includes(linageCfg.ID)) {
					itemInfo.unlockState = true
					itemInfo.mask.visibility = mw.SlateVisibility.Hidden
					// itemInfo.coin.visibility = mw.SlateVisibility.Hidden
					// itemInfo.price.visibility = mw.SlateVisibility.Hidden
				} else {
					itemInfo.unlockState = false
					itemInfo.mask.visibility = mw.SlateVisibility.SelfHitTestInvisible
					// itemInfo.coin.visibility = mw.SlateVisibility.SelfHitTestInvisible
					// itemInfo.price.visibility = mw.SlateVisibility.SelfHitTestInvisible
				}
			}
			this._lineageBtns.push(itemInfo)


		}
		this._canvasNew = this._lineageBtns[6]
		this._lineageBtns[6].icon.size = new mw.Vector2(220, 220)
		this._lineageBtns[6].canvas.visibility = mw.SlateVisibility.Hidden
	}

	public selectLineage(item: ShopItemInfo) {
		this._lineageBtns.forEach(e => {
			e.canvas.visibility = mw.SlateVisibility.Hidden
		})
		this.setMidItem(item)

		if (this._selectItem) {
			this._selectItem.select.visibility = mw.SlateVisibility.Hidden
		}
		this.setText(item)
		this.mBtnSllNo.visibility = mw.SlateVisibility.Hidden
		this._selectItem = item
	}

	public setText(item: ShopItemInfo) {
		const linageCfg = GameConfig.Lineage.getElement(item.lineageCfgId)
		if (item.unlockState) {
			item.price.visibility = mw.SlateVisibility.SelfHitTestInvisible
			item.coin.visibility = mw.SlateVisibility.SelfHitTestInvisible
			if (ModuleService.getModule(ShopModuleC).getIsFree(item.lineageCfgId)) {
				this.mLineagePrice.text = GameConfig.Language.No_Pay.Value
				let val = linageCfg.lineage
				let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.Unlock)
				ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.Unlock)
				this.mDescribe.text = mw.StringUtil.format(str,
					GameConfig.Language[val].Value)
			}
			else {
				this.mLineagePrice.text = "" + linageCfg.lineagePrice
				this.mDescribe.text = mw.StringUtil.format(GameConfig.Language.ShopUI_Des.Value, GameConfig.Language.getElement(linageCfg.describe).Value, linageCfg.lineagePrice)
			}
			this.mConfirm.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.panelDialog.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.mShopUI_Look.text = GameConfig.Language.ShopUI_Look.Value
			this.mShopUI_TakeIt.text = GameConfig.Language.ShopUI_TakeIt.Value
		} else {
			item.price.visibility = mw.SlateVisibility.Hidden
			item.coin.visibility = mw.SlateVisibility.Hidden
			let cost = Number(item.price.text)
			this.mLineagePrice.text = "" + cost
			this.mDescribe.text = mw.StringUtil.format(GameConfig.Language.Find_gemsask1.Value, GameConfig.Language.getElement(linageCfg.describe).Value, cost)
			this.mConfirm.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.panelDialog.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.mShopUI_Look.text = GameConfig.Language.ShopUI_Look.Value
			this.mShopUI_TakeIt.text = GameConfig.Language.ShopUI_Unlock.Value
		}

	}

	setMidItem(item: ShopItemInfo) {
		if (!this._canvasNew) {
			return
		}
		if (item.unlockState) {
			this._canvasNew.mask.visibility = mw.SlateVisibility.Hidden
		}
		else {
			this._canvasNew.mask.visibility = mw.SlateVisibility.SelfHitTestInvisible
		}
		this._canvasNew.canvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
		this._canvasNew.icon.imageGuid = item.icon.imageGuid
		this._canvasNew.desc.text = item.desc.text
		this._canvasNew.price.text = item.price.text
		this._canvasNew.name.text = item.name.text
	}

	public resetItemsPos() {
		this._canvasNew.canvas.visibility = mw.SlateVisibility.Hidden
		for (let i = 0; i < 6; i++) {
			let e = this._lineageBtns[i]
			e.canvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
		}

	}

	//通过血统显示部分马匹
	public onFind(horseInfos: IHorseInfo[]) {
		if (!horseInfos || horseInfos.length == 0) {
			Tips.showTips(GameConfig.Language[ErrorCode[1024]].Value)
			return
		}
		mw.UIService.hide(ShopUI)
		mw.UIService.show(ShopInnerUI, horseInfos)
	}

	//解锁商店血统
	public unlock(cfgId: number) {
		this._selectItem.mask.visibility = mw.SlateVisibility.Hidden
		this._canvasNew.mask.visibility = mw.SlateVisibility.Hidden
		this._selectItem.unlockState = true
		let val = GameConfig.Lineage.getElement(cfgId).lineage
		this.mLineagePrice.text = GameConfig.Language.No_Pay.Value
		let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.UnlockSuccess)
		ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.UnlockSuccess)

		this.mDescribe.text = mw.StringUtil.format(str,
			GameConfig.Language[val].Value)
		this.mShopUI_TakeIt.text = GameConfig.Language.ShopUI_TakeIt.Value
		this.refreshUnlockPrices()
	}

	private refreshUnlockPrices() {
		let cost = GameConfig.Global.getElement(1051).Parameter2
		let cost0 = cost[ModuleService.getModule(ShopModuleC).getUnlockNum()]
		this._lineageBtns.forEach(e => {
			if (!e.unlockState) {
				e.price.text = "" + cost0
			}
		})
	}

	protected onShow(...params: any[]) {
		this.mBtnSllNo.visibility = mw.SlateVisibility.Visible
		this.panelDialog.visibility = mw.SlateVisibility.Visible
		this.mConfirm.visibility = mw.SlateVisibility.Hidden
		this.mSelectCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
		this.mBtnCancel.visibility = mw.SlateVisibility.Visible
		this.showRandomDes()
		this.mPriceCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
		ModuleService.getModule(PlayerModuleC).hideBasicUIExceptMoney();
	}


	public showRandomDes() {
		const random = Utils.RangeFloat(0, 1)
		if (random <= 0.5) {
			this.mDescribe.text = GameConfig.Language.Find_ask1.Value
		} else {
			this.mDescribe.text = GameConfig.Language.Find_ask2.Value
		}
	}
	protected onHide() {
		this.resetItemsPos()
		if (this._selectItem) {
			this._selectItem.select.visibility = mw.SlateVisibility.Hidden
			this._selectItem = null
		}
	}
}
