import { SpawnManager,SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { CommonAssets, EHorseSomatoType, ErrorCode, EStableHorseState, ETalkEnvironment, GlobalVar, IHorseInfo } from '../Common';
import { GameConfig } from '../config/GameConfig';
import { GameEvents } from '../GameEvents';
import StableHorse from '../logic/StableHorse';
import { BagMouduleC } from '../module/BagMoudule';
import { PlayerModuleC } from '../module/PlayerModule';
import GrowUI_Generate from "../ui-generate/ui/GrowUI_generate";
import { emitter } from '../utils/Emitter';
import { Scheduler } from '../utils/Scheduler';
import SoundHelper from '../utils/SoundHelper';
import Utils from '../utils/Utils';
import HorseBagUI from './HorseBagUI';
import ItemUI from './ItemUI';
import PopWindowUI, { IPopWindowInfo } from './PopWindowUI';
import Tips from './Tips';
import { AnalyticsUtil } from 'odin';

const TriggerGuid = [
	'0BBCF2BF',
	'3D843B68',
	'B5E9D8C6',
	'C55D5866',
	'27996F78',
	'FBE429F7',
	'D842A959',
	'A9AFA71E',
	'A0D62719',
	'73EF7976'
]


export default class GrowUI extends GrowUI_Generate {

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	/**一次的成长值*/
	private _grouthDelta: number
	private _grouthMax: number
	private _curInfo: IHorseInfo = null
	private _curIndex: number = -1

	//投喂花费
	private _feedMoney: number = 10


	private _carrotList: Map<string, mw.GameObject[]> = new Map()
	private _horse: StableHorse = null
	private _isCompete: boolean = false
	private _canModify: boolean = true
	private _triggers: mw.Trigger[] = []
	private _chNum: number = 0;

	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();

		this._grouthMax = GameConfig.Global.getElement(1010).Parameter1
		this._feedMoney = GameConfig.Global.getElement(1029).Parameter1
		TriggerGuid.forEach(e => {
			let trigger = GameObject.findGameObjectById(e) as mw.Trigger
			this._triggers.push(trigger)
		})

		this.mBtnLeave.onClicked.add(() => {

			mw.UIService.hide(GrowUI)
		})

		this.mBtnFeed.onClicked.add(() => {
			if (this._horse.canFeed) {
				if (this._horse.getCurState() == EStableHorseState.Follow) {
					Tips.showTips(GameConfig.Language.FollowFeed.Value);
					return
				}

				let playeMoney: number = ModuleService.getModule(PlayerModuleC).getMoney()
				if (playeMoney >= this._feedMoney) {
					let info: IPopWindowInfo = {
						comfirmCallback: async () => {
							ModuleService.getModule(PlayerModuleC).costMoney(this._feedMoney)
							this._horse.canFeed = false
							this._horse.setFeedTimer()
							let vec = await this.createCarrot()
							ModuleService.getModule(BagMouduleC).setCarrotPos(this._curInfo, vec)
							this.addGrouth()

						},
						cancelCallback: () => {

						},
						title: "",
						titleImg: "131524",
						desc: mw.StringUtil.format(GameConfig.Language.GrowUI_Talk1.Value, this._feedMoney),
					}
					mw.UIService.show(PopWindowUI, info)

				}
				else {
					Tips.showTips(GameConfig.Language[ErrorCode[1017]].Value)
				}

			}
			else {
				Tips.showTips(GameConfig.Language[ErrorCode[1018]].Value)
			}
		})

		this.mModify.onClicked.add(() => {
			if (this.mInput.visibility == mw.SlateVisibility.Hidden) {
				this.mModifyTex.text = GameConfig.Language.Modify_complicate.Value
				this.mInput.text = this._curInfo.property.nickName
				this.mInput.visibility = mw.SlateVisibility.Visible
			}
			else if (this.mInput.visibility == mw.SlateVisibility.Visible) {
				if (this.mInput.text.length > 0 && this._curInfo.property.nickName != this.mInput.text) {
					Tips.showTips(GameConfig.Language[ErrorCode[1019]].Value)
					this.mModifyTex.text = GameConfig.Language.Modify_edit.Value
					this.mName.text = this.mInput.text
					this._curInfo.property.nickName = this.mInput.text
					ModuleService.getModule(BagMouduleC).reqModifyHorseProperty(this._curIndex, this._curInfo.ID, this._curInfo.property)
				}
				this.mInput.visibility = mw.SlateVisibility.Hidden
			}
		})

		this.mBtnFree.onClicked.add(() => {
			let info: IPopWindowInfo = {
				comfirmCallback: () => {
					mw.UIService.hide(GrowUI)
					ModuleService.getModule(BagMouduleC).reqDelHorseInfo(this._curInfo)
					this.clearCarrot(this._curInfo.ID)
				},
				cancelCallback: () => {
				},
				title: "",
				titleImg: "131524",
				desc: GameConfig.Language.GrowUI_Talk2.Value
			}
			mw.UIService.show(PopWindowUI, info)
		})



		this.mBtnFollow.onClicked.add(() => {

			let followInfo = ModuleService.getModule(BagMouduleC).getCurFollowingHorse()
			if (followInfo && followInfo.getHorseInfo().ID !=
				this._curInfo.ID) {
				ModuleService.getModule(BagMouduleC).reqHideAFollowingHorse()
			}
			if (this._isCompete) {
				this.mTexFollow.text = GameConfig.Language.Follow.Value
				ModuleService.getModule(BagMouduleC).reqHideAFollowingHorse()
			}
			else {
				ModuleService.getModule(BagMouduleC).reqAddAFollowingHorse(this._curInfo)
				this.mTexFollow.text = GameConfig.Language.UnFollow.Value
			}
			this._isCompete = !this._isCompete

			mw.UIService.hide(GrowUI)
		})

		emitter.on(GameEvents.EVENT_HORSE_ENDEAT, (infoID: string) => {
			let vec = this._carrotList.get(infoID)
			vec.forEach(carrot => {
				carrot.destroy()
			})
			vec.length = 0

		}, this)

		emitter.on(GameEvents.EVENT_SHOW_RECOVERY_FEED_TIME, (num: number) => {
			if (num > 0) {
				this.minfo.visibility = mw.SlateVisibility.Visible
				this.minfo.text = mw.StringUtil.format(GameConfig.Language.GrowUI_Feed_Info.Value,
					Math.floor(num / 60), Math.floor(num % 60))
			}
			else {

				this.minfo.visibility = mw.SlateVisibility.Hidden
			}

		}, this)


		this.mInput.onTextChanged.add((text: string) => {
			let reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;//中文数字英文特殊字符空格
			if (text == undefined || text == null || !text.match(reg)) {
				this.mInput.text = this._curInfo.property.nickName
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
				this.mInput.textLengthLimit = 5
			}
			else {
				this.mInput.textLengthLimit = 10
			}
			// console.log("hjfffk3", this._chNum)
		})
	}





	//生成胡萝卜
	public async createCarrot() {

		if (!this._carrotList.has(this._curInfo.ID)) {
			this._carrotList.set(this._curInfo.ID, [])
		}

		let randomGrouth = GameConfig.Global.getElement(1011).Parameter2
		if (randomGrouth.length == 2) {
			this._grouthDelta = Utils.RangeInt(randomGrouth[0], randomGrouth[1] + 1)
		}
		//通过成长值来调整显示的胡萝卜数
		let showNum = Math.floor(this._grouthDelta / (randomGrouth[1] / 5))
		let vec: mw.GameObject[] = []
		for (let i = 0; i < showNum; i++) {
			if (!mw.AssetUtil.assetLoaded(CommonAssets.CARROT)) {
				await mw.AssetUtil.asyncDownloadAsset(CommonAssets.CARROT)
			}

			const carrot = SpawnManager.spawn({ guid: CommonAssets.CARROT })
			await carrot.asyncReady();

			this._carrotList.get(this._curInfo.ID).push(carrot)
			let pos = GlobalVar.STABLE_BIRTHPOS[this._curIndex]
			let random = Utils.RangeFloat(GlobalVar.STABLE_RANDOMVEC[0], GlobalVar.STABLE_RANDOMVEC[1])
			let randomLoc = new mw.Vector(pos.x + random, pos.y + random, pos.z)
			carrot.worldTransform.position = randomLoc
			carrot.setVisibility(mw.PropertyStatus.On)
			vec.push(carrot)
		}
		return vec

	}



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

		this.mInput.visibility = mw.SlateVisibility.Hidden
		this.mProgressDelta.visibility = mw.SlateVisibility.Hidden
		this.mCanvasTalk.visibility = mw.SlateVisibility.Hidden

		this._canModify = true
		this.setWink(false)
		let index = params[0] as number
		this._curIndex = index
		this._curIndex = params[0] as number

		if (index == -1) {
			return
		}
		ModuleService.getModule(BagMouduleC).setCurLookHorseStableIndex(index)
		this._curInfo = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(index)
		this.mProgressCur.currentValue = this._curInfo.property.growth / this._grouthMax
		let property = this._curInfo.property
		this.mInc.imageGuid = GameConfig.Lineage.getElement(property.lineage).icon
		this.mName.text = property.nickName
		let lineageID = GameConfig.Lineage.getElement(property.lineage).lineage
		this.mLineage.text = GameConfig.Language[lineageID].Value
		let chID = GameConfig.Personalioty.getElement(property.nature).name
		this.mPerson.text = GameConfig.Language[chID].Value
		let hobbyID = GameConfig.Hobby.getElement(property.hobby).describe
		this.mHobby.text = GameConfig.Language[hobbyID].Value

		this._horse = ModuleService.getModule(BagMouduleC).getHorseModelByID(this._curInfo.ID)
		if (this._horse.canFeed) {
			this.minfo.visibility = mw.SlateVisibility.Hidden
		}
		else {
			this.minfo.visibility = mw.SlateVisibility.Visible
		}
		this.setText()
	}


	private setText() {
		let followHorse = ModuleService.getModule(BagMouduleC).getCurFollowingHorse()
		if (!followHorse || followHorse.getHorseInfo().ID != this._curInfo.ID) {
			this.mTexFollow.text = GameConfig.Language.Follow.Value
			this._isCompete = false

		}
		else if (followHorse.getHorseInfo().ID == this._curInfo.ID) {
			this.mTexFollow.text = GameConfig.Language.UnFollow.Value
			this._isCompete = true
		}

	}


	private showTalk(str: string) {
		this.mTalk.text = str
		this.mCanvasTalk.visibility = mw.SlateVisibility.SelfHitTestInvisible
		Scheduler.TimeStart(() => {
			this.mCanvasTalk.visibility = mw.SlateVisibility.Hidden
		}, 3)
	}

	private _inteval: number = null
	//每有0.1 向左加的插值
	private _delta: number = 36
	private addGrouth() {
		if (this._inteval) {
			Scheduler.Cancel(this._inteval);
			this._inteval = null;
		}
		this.mProgressDelta.visibility = mw.SlateVisibility.HitTestInvisible
		this.mProgressCur.currentValue = this._curInfo.property.growth / this._grouthMax
		this.mProgressDelta.position = new mw.Vector2(this.mProgressCur.position.x + this.mProgressCur.currentValue / 0.1 * this._delta,
			this.mProgressCur.position.y)

		let targetVal = this._grouthDelta / this._grouthMax

		let deltaVal = targetVal / 10
		this.mProgressDelta.currentValue = 0
		this.mDelta.text = "+" + this._grouthDelta
		let flag = false
		this._curInfo.property.growth += this._grouthDelta;

		this._inteval = Scheduler.TimeStart(() => {
			if (this.mProgressDelta.currentValue < targetVal) {
				this.mProgressDelta.currentValue += deltaVal
				this.setWink(flag)
				flag = !flag
			}
			else {
				this.setWink(false)
				this.mProgressDelta.currentValue = targetVal
				this.mProgressCur.currentValue += this.mProgressDelta.currentValue
				this.mProgressDelta.visibility = mw.SlateVisibility.Hidden
				this.modifyInfo()

			}

		}, 0.2, -1)


	}

	private modifyInfo() {
		if (this._inteval) {
			Scheduler.Cancel(this._inteval)
			this._inteval = null
		}

		if (!this._canModify) {
			return
		}

		console.log("变成大马")

		if (this._curInfo.property.growth >= this._grouthMax) {
			//变成大马

			this._curInfo.property.somatoType = EHorseSomatoType.Mature
			this.minfo.visibility = mw.SlateVisibility.Hidden
			this.showTalk(GameConfig.Language.GrowUI_Talk3.Value)
			emitter.emit(GameEvents.EVENT_HORSE_GROWUP, this._curInfo)

			let growUI = mw.UIService.getUI(GrowUI);
			if (growUI.visible) {
				mw.UIService.hide(GrowUI)
				mw.UIService.show(HorseBagUI, this._curInfo.stableIndex)
				this._triggers[this._curIndex].onEnter.broadcast(Player.localPlayer.character)
			}
		}
		else {
			let allElme = GameConfig.TalkInfo.getAllElement()
			let say: string[] = []
			allElme.forEach(elem => {
				if (elem.Environment == ETalkEnvironment.Feed) {
					say.push(GameConfig.Language[elem.Talk].Value)
				}
			})
			this.showTalk(say[Utils.RangeInt(0, say.length)])

		}
		ModuleService.getModule(BagMouduleC).reqModifyHorseProperty(this._curIndex, this._curInfo.ID, this._curInfo.property)
		this._canModify = false
	}

	public clearCarrot(str: string) {
		let vec = this._carrotList.get(str)
		if (vec && vec.length > 0) {
			vec.forEach(carrot => {
				carrot.destroy()
			})
		}
		vec = []
	}

	private setWink(flag: boolean) {
		flag ? this.mDelta.visibility = mw.SlateVisibility.Visible : this.mDelta.visibility = mw.SlateVisibility.Hidden
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		this.modifyInfo()
		this.mInput.visibility = mw.SlateVisibility.Hidden
		ModuleService.getModule(BagMouduleC).setCurLookHorseStableIndex(-1)
	}

}
