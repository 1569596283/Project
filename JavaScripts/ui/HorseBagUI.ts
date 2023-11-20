
import { CommonAssets, EHorseSomatoType, ErrorCode, GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import { BagMouduleC } from "../module/BagMoudule";
import HorseBagUI_Generate from "../ui-generate/ui/HorseBagUI_generate";

import { emitter } from "../utils/Emitter";
import BreedUI from "./BreedUI";
import ItemUI from "./ItemUI";
import PopWindowUI, { IPopWindowInfo } from "./PopWindowUI";
import Tips from "./Tips";
import { BreedModuleC } from "../module/BreedModule";
import CameraUtils from "../utils/CameraUtils";


/** 繁育时观测马厩的摄像机锚点 */
const BreedCameraPoint: string[] = [
	"FEC846FB",
	"C5F8ABB4",
	"E4E3F828",
	"150F8388",
	"FF99ADCD",
	"8B41266E",
	"4447FAE1",
	"39BB20D5",
	"00AE9780",
	"B5321F64"
]


class PropertInfo {
	name: string
	max: number
	current: number
	maxLength: number
	texVal: string
	texMaxVal: string
	pos: mw.Vector2
	dir: mw.Vector2
	panelMax: mw.Canvas
	panelCurrent: mw.Canvas
}

export default class HorseBagUI extends HorseBagUI_Generate {

	private _curHorseInfo: IHorseInfo
	private _curIndex: number = 0
	private _script: ItemUI
	/** 繁育两匹马选择序号 */
	private _breedChooseVec2: mw.Vector2 = mw.Vector2.zero;
	/** 摄像机锚点 */
	private _breedCameras: mw.GameObject[] = [];


	private _propertyLines: mw.Canvas[] = []

	private _energyTex: string = "0"

	/**中文数量 */
	private _chNum: number = 0
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = true;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this.mInputName.visibility = mw.SlateVisibility.Hidden
		this.mModify.onClicked.add(() => {
			if (this.mInputName.visibility == mw.SlateVisibility.Hidden) {
				this.mModifyTex.text = GameConfig.Language.Modify_complicate.Value
				this.mInputName.text = this._curHorseInfo.property.nickName
				this.mInputName.visibility = mw.SlateVisibility.Visible
			} else if (this.mInputName.visibility == mw.SlateVisibility.Visible) {
				if (this.mInputName.text.length > 0 && this._curHorseInfo.property.nickName != this.mInputName.text) {
					Tips.showTips(GameConfig.Language[ErrorCode[1019]].Value)
					this.mModifyTex.text = GameConfig.Language.Modify_edit.Value
					this.mName.text = this.mInputName.text
					this._curHorseInfo.property.nickName = this.mInputName.text
					this._script.init(this._curHorseInfo)
					ModuleService.getModule(BagMouduleC).reqModifyHorseProperty(this._curIndex, this._curHorseInfo.ID, this._curHorseInfo.property)
				}
				this.mInputName.visibility = mw.SlateVisibility.Hidden
			}

		})

		/**出战按钮 */
		this.mBtnSelect.onClicked.add(() => {
			let followInfo = ModuleService.getModule(BagMouduleC).getCurFollowingHorse()
			if (followInfo && followInfo.getHorseInfo().ID !=
				this._curHorseInfo.ID) {
				ModuleService.getModule(BagMouduleC).reqHideAFollowingHorse()
			}
			if (this._isCompete) {
				this.mSelText.text = GameConfig.Language.HorseTakeIn.Value
				ModuleService.getModule(BagMouduleC).reqHideAFollowingHorse()
			}
			else {
				ModuleService.getModule(BagMouduleC).reqAddAFollowingHorse(this._curHorseInfo)
				this.mSelText.text = GameConfig.Language.HorseBagBack.Value
			}
			this._isCompete = !this._isCompete
			mw.UIService.hide(HorseBagUI)
		})

		this.mBtnFree.onClicked.add(() => {

			if (ModuleService.getModule(BagMouduleC).getHoresInfo().length <= 1) {
				Tips.showTips(GameConfig.Language.HasNoHorse.Value);
				return;
			}
			let info: IPopWindowInfo = {
				comfirmCallback: () => {
					mw.UIService.hide(HorseBagUI)
					ModuleService.getModule(BagMouduleC).reqDelHorseInfo(this._curHorseInfo)
				},
				cancelCallback: () => {
				},
				title: "",
				titleImg: "131524",
				desc: GameConfig.Language.GrowUI_Talk2.Value
			}
			mw.UIService.show(PopWindowUI, info)
		})

		this.button_left.onClicked.add(() => {
			this.switchButtonClick(-1);
		})

		this.button_right.onClicked.add(() => {
			this.switchButtonClick(1);
		})

		this.button_choose.onClicked.add(() => {
			// BreedMgr.instance().setHorseInfo(this._curIndex);
			ModuleService.getModule(BreedModuleC).setHorseInfo(this._curIndex);
			mw.UIService.hide(HorseBagUI);
			mw.UIService.show(BreedUI);
		})

		this.mBtnLeave.onClicked.add(() => {
			if (!this._breedChooseVec2.equals(mw.Vector2.zero)) {
				mw.UIService.show(BreedUI);
			}
			mw.UIService.hide(HorseBagUI)
		})

		emitter.on(GameEvents.EVENT_SHOW_RECOVERY_ENERGY_TIME, (num: number) => {
			if (num > 0) {
				this._energyTex = num.toString()
				this.mEnergyTimer.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.mTexTimer.visibility = mw.SlateVisibility.Visible
				this.mTexTimer.text = num.toString()
			}
			else {
				if (num == 0) {
					this._curHorseInfo = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(this._curIndex);
					this._script.init(this._curHorseInfo)
				}
				this.mEnergyTimer.visibility = mw.SlateVisibility.Hidden
			}
		}, this)

		BreedCameraPoint.forEach(guid => {
			let go = GameObject.findGameObjectById(guid);
			this._breedCameras.push(go);
		});

		this._script = mw.findUIScript(this.item1) as ItemUI


		this.mInputName.onTextChanged.add((text: string) => {
			let reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;//中文数字英文特殊字符空格
			if (text == undefined || text == null || !text.match(reg)) {
				this.mInputName.text = this._curHorseInfo.property.nickName
				return
			}
			this._chNum = 0
			let reg0 = /^[\u4e00-\u9fa5]{0,}$/ //中文

			for (let i = 0; i < text.length; i++) {

				if (text[i].match(reg0)) {
					this._chNum += 1
				}
			}

			if (this._chNum > 0) {
				this.mInputName.textLengthLimit = 5
			}
			else {
				this.mInputName.textLengthLimit = 10
			}
			// console.log("hjfffk3", this._chNum)
		})
	}


	private switchButtonClick(change: number) {
		let horses = ModuleService.getModule(BagMouduleC).getAllMatureHorse();
		let cur = 0;
		if (horses.length <= 1) {
			return;
		}
		for (let i = 0; i < horses.length; i++) {
			if (horses[i].stableIndex == this._curIndex) {
				cur = i;
				break;
			}
		}
		let index = 0;
		for (let i = 0; i < horses.length; i++) {
			cur += change;
			if (cur >= horses.length) {
				cur = 0;
			}
			else if (cur < 0) {
				cur = horses.length - 1
			}
			index = horses[cur].stableIndex;
			if (index != this._breedChooseVec2.x && index != this._breedChooseVec2.y) {
				break;
			}
		}
		this._propertyLines.forEach((lineRoot) => {
			lineRoot.destroyObject();
		})
		this._propertyLines.length = 0;
		this.onShow(index, this._breedChooseVec2);
	}

	private _isCompete: boolean = false

	/**
	 * 设置显示时触发
	 * @param params 0:在马厩里的序号 1:是否是在繁育是打开
	 */
	protected onShow(...params: any[]) {

		if (params[1]) {
			this._breedChooseVec2 = params[1] as mw.Vector2;
		} else {
			this._breedChooseVec2 = mw.Vector2.zero;
		}

		this._curIndex = params[0] as number;
		let bagMouduleC = ModuleService.getModule(BagMouduleC)
		this._curHorseInfo = bagMouduleC.getHoresInfoByIndex(this._curIndex);
		bagMouduleC.setCurLookHorseStableIndex(this._curIndex)

		this._script.init(this._curHorseInfo)

		let curFollowHorse = bagMouduleC.getCurFollowingHorse()
		if (!curFollowHorse) {
			if (this._curHorseInfo.property.energy == this._curHorseInfo.property.maxEnergy) {
				this.mEnergyTimer.visibility = mw.SlateVisibility.Hidden
			}
			else {
				this.mEnergyTimer.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.mTexTimer.text = this._energyTex
			}
		}
		else {
			if (curFollowHorse.getHorseInfo().ID ==
				this._curHorseInfo.ID || this._curHorseInfo.property.energy
				== this._curHorseInfo.property.maxEnergy) {
				this.mEnergyTimer.visibility = mw.SlateVisibility.Hidden
			}
			else {
				this.mEnergyTimer.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.mTexTimer.text = this._energyTex
			}
		}

		let data = this._curHorseInfo.property
		//判断体型数据
		if (data.somatoType == EHorseSomatoType.Filly) {
			this.mBtnSelect.visibility = mw.SlateVisibility.Hidden
		}
		else if (data.somatoType == EHorseSomatoType.Mature) {
			this.mBtnSelect.visibility = mw.SlateVisibility.Visible
		}

		this.setBreed();

		let followHorse = ModuleService.getModule(BagMouduleC).getCurFollowingHorse()
		if (!followHorse || followHorse.getHorseInfo().ID != this._curHorseInfo.ID) {
			this.mSelText.text = GameConfig.Language.HorseTakeIn.Value
			this._isCompete = false
		}
		else {
			this.mSelText.text = GameConfig.Language.HorseBagBack.Value
			this._isCompete = true
		}
	}


	/**	
	 * 设置繁育相关信息
	 */
	private setBreed() {
		if (this._breedChooseVec2.equals(mw.Vector2.zero)) {
			this.canvas_breed.visibility = mw.SlateVisibility.Hidden;
			this.mBtnSelect.visibility = mw.SlateVisibility.Visible;
			this.mBtnFree.visibility = mw.SlateVisibility.Visible;
		} else {
			// 繁育界面打开
			this.canvas_breed.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.mBtnSelect.visibility = mw.SlateVisibility.Hidden;
			this.mBtnFree.visibility = mw.SlateVisibility.Hidden;
			CameraUtils.changeCamera(this._breedCameras[this._curIndex]);
			if (this._curIndex == this._breedChooseVec2.x || this._curIndex == this._breedChooseVec2.y || this._curHorseInfo.property.birthNum <= 0) {
				this.button_choose.enable = false;
				this.mTexChoose.text = GameConfig.Language.CanNotBreed.Value
			} else {
				this.button_choose.enable = true;
				this.mTexChoose.text = GameConfig.Language.P_choose.Value
			}
		}
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		this.mInputName.visibility = mw.SlateVisibility.Hidden
		ModuleService.getModule(BagMouduleC).setCurLookHorseStableIndex(-1)
	}

}
