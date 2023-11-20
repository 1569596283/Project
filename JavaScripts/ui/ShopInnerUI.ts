import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { CommonAssets, CommonTrigger, EHorseAnimation, EPartType, ErrorCode, ESceneType, GlobalVar, IHorseInfo, IPartInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { HoresModelC } from "../logic/HorseModel";
import { BagMouduleC } from "../module/BagMoudule";
import { PlayerModuleC } from "../module/PlayerModule";
import { ShopModuleC } from "../module/ShopModule";
import { SyntheticModuleC } from "../module/SyntheticModule";
import ShopInnerUI_Generate from "../ui-generate/ui/ShopInnerUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import Utils from "../utils/Utils";
import InteractiveUI from "./InteractiveUI";
import ItemUI from "./ItemUI";
import PopWindowUI, { IPopWindowInfo } from "./PopWindowUI";
import Tips from "./Tips";
import CameraUtils from '../utils/CameraUtils';

//三个台子
const ShowStageGUID: string[] = [
	'442BF0F4',
	'8EDA7B73',
	'25162E99'
]

const FollowingLightGUID: string[] = [
	'DE8EE46B',
	'D8A7BF05',
	'9D361006',
	'899874E4'
]

const HorseLookGUID: string[] = [
	'B6240D29',
	'BFAE1DD0',
	'55E7B43D'
]

const SpotLightGUID: string[] = [
	'69CA278B',
	'EE9C95DF',
	'03754109'
]

const ArrowEffectGUID: string[] = [
	'BFFD048B',
	'0E721A4A',
	'038515BE'
]


//正对你的马
const HorseFocusGUID: string[] = [
	'F4597774',
	'A04F9354',
	'B664076B'
]


const HorseBirthGUID: string[] = [
	'04DABB82',
	'8C618B81',
	'B1E1E58B'
]

const HorseBirthEffectGUID: string[] = [
	'41860005',
	'4749519D',
	'BA89E90E'
]


const enum EButtonPos {
	Left,
	Mid,
	Right
}

//追光灯
class FollowingLight {
	public followLight: mw.Effect

	public path: mw.Vector[] = []

	public index: number = 1


	public init() {
		// this.followLight.worldTransform.position = this.path[0]
		this.followLight.play()
	}

	public move(dt: number) {
		if (mw.Vector.squaredDistance(this.followLight.worldTransform.position, this.path[this.index]) >= 30 * 30) {
			this.followLight.worldTransform.position = mw.Vector.lerp(this.followLight.worldTransform.position, this.path[this.index], dt * 2)
		}
		else {
			if (this.index < this.path.length - 1) {
				this.index += 1
			}
			else {
				this.index = 0
			}
		}
	}

	public stop() {
		this.followLight.stop()
	}

}

export default class ShopInnerUI extends ShopInnerUI_Generate {

	private _horseInfos: IHorseInfo[] = []
	//显示的马匹实例
	private _allHorseModels: HoresModelC[] = []
	private _prices: number[] = []

	private _cameraFocusObj: mw.GameObject = null
	//站台初始的位置
	private _stages: mw.GameObject[] = []
	private _initStagePoses: mw.Vector[] = []
	private _initStageRotes: mw.Rotation[] = []
	private _followinglights: FollowingLight[] = []
	private _spotlights: mw.Effect[] = []
	private _horseLook: mw.GameObject[] = []
	private _horseFocuse: mw.GameObject[] = []
	private _horseBirthPos: mw.GameObject[] = []
	private _horseBirthEffect: mw.Effect[] = []
	private _arrowEffect: mw.Effect[] = []

	private _index: number = 0
	private _lookBtns: mw.Button[] = []

	private _script: ItemUI

	//追光灯的特效timer
	private _followingTime: number = 3
	private _canFollowingShow: boolean = false

	//马匹位置修复
	private _lookedHorsePos: mw.Vector[] = []
	private _lookingHorsePos: mw.Vector[] = []

	private _cameraAnchor: GameObject[] = [];

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		super.onAwake()
		this.canUpdate = true;
		this.layer = mw.UILayerBottom;
		this.initButtons();



		for (let i = 1; i <= 3; i++) {
			//查看
			this._lookBtns.push(this["mLook" + i] as mw.Button)
			this._lookBtns[i - 1].onClicked.add(() => {
				this._index = i - 1
				if (this._index == 0) {
					this.mBtnLast.visibility = mw.SlateVisibility.Hidden
				} else if (this._index == 2) {
					this.mBtnNext.visibility = mw.SlateVisibility.Hidden
				}
				this._arrowEffect.forEach(e => {
					e.setVisibility(mw.PropertyStatus.Off)
					e.stop()
				})
				for (let i = 0; i < this._allHorseModels.length; i++) {
					let horse = this._allHorseModels[i].instance
					horse.worldTransform.rotation = new mw.Rotation(0, 0, 90)
					horse.worldTransform.position = this._lookingHorsePos[i]
					// console.log("hjkhjkhjkh", i, "--", horse.worldTransform.position)
					GameConfig.Language.P_max_speed
				}
				this.mSearchCanvas.visibility = mw.SlateVisibility.Hidden
				this.mItem.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.onExchange()
			})
		}

		this.mSelect.onClicked.add(() => {
			//买马
			let playeMoney: number = ModuleService.getModule(PlayerModuleC).getDiamond()
			let bagNum = ModuleService.getModule(BagMouduleC).getHoresInfo()
			if (bagNum.length >= GlobalVar.STABLE_MAX_POSSESS) {
				Tips.showTips(GameConfig.Language[ErrorCode[1020]].Value)
			}
			else if (playeMoney >= this._prices[this._index]) {
				ModuleService.getModule(ShopModuleC).reqBuy(this._index);
				Tips.showTips(GameConfig.Language[ErrorCode[1021]].Value)
				SoundHelper.instance().play(1004)
				this._allHorseModels[this._index].playAnimation(EHorseAnimation.Loading, 1, true)
				this.mSelect.enable = false
				this.mBtnTake.visibility = mw.SlateVisibility.Visible
				this.mClose.visibility = mw.SlateVisibility.Hidden
				this.mDetailCanvas.visibility = mw.SlateVisibility.Hidden
			}
			else {
				Tips.showTips(GameConfig.Language.Tips_notenoughdiamond.Value)
			}
		})

		this.mBtnReturn.onClicked.add(() => {
			for (let i = 0; i < this._allHorseModels.length; i++) {
				this._allHorseModels[i].instance.worldTransform.rotation = new mw.Rotation(0, 0, 90 + i * 10)
				this._allHorseModels[i].instance.worldTransform.position = this._lookedHorsePos[i]
			}
			this._arrowEffect.forEach(e => {
				e.setVisibility(mw.PropertyStatus.On)
				e.play()
			})
			this._index = -1
			this.mSearchCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
			this.mDetailCanvas.visibility = mw.SlateVisibility.Hidden
		})

		this.mBtnLast.onClicked.add(() => {

			if (this._index > 0) {
				this._index -= 1
			}
			this.onExchange()
		})

		this.mBtnNext.onClicked.add(() => {
			if (this._index < this._horseInfos.length - 1) {
				this._index += 1
			}
			this.onExchange()
		})
		this.mBlockNext.onClicked.clear()
		this.mBlockLast.onClicked.add(() => {
			this.mBtnLast.onClicked.broadcast()
		})

		this.mBlockNext.onClicked.clear()
		this.mBlockNext.onClicked.add(() => {
			this.mBtnNext.onClicked.broadcast()
		})

		this.mBtnTake.onClicked.add(() => {
			//牵走小马
			SoundHelper.instance().play(1030)
			mw.UIService.hide(ShopInnerUI)
		})

		this.mBtnClose.onClicked.add(() => {
			let info: IPopWindowInfo = {
				comfirmCallback: () => {
					mw.UIService.hide(ShopInnerUI)
				},
				cancelCallback: () => {

				},
				title: "",
				titleImg: "131524",
				desc: GameConfig.Language.Interactive_Talk4.Value
			}
			mw.UIService.show(PopWindowUI, info);

		})


		this.findObj()

	}


	private showButtons() {
		switch (this._index) {
			case EButtonPos.Left:
				this.mBtnLast.visibility = mw.SlateVisibility.Hidden
				this.mBtnNext.visibility = mw.SlateVisibility.Visible
				break
			case EButtonPos.Mid:
				this.mBtnLast.visibility = mw.SlateVisibility.Visible
				this.mBtnNext.visibility = mw.SlateVisibility.Visible
				break
			case EButtonPos.Right:
				this.mBtnLast.visibility = mw.SlateVisibility.Visible
				this.mBtnNext.visibility = mw.SlateVisibility.Hidden
				break
			default:
				break
		}
	}

	private initFollowingPath(pos: mw.Vector) {

		let len = 4//初始化的点数量
		let path: mw.Vector[] = []
		path.push(pos)

		for (let i = 0; i < len; i++) {
			let ch: number = Utils.RangeInt(1, 11)
			if (ch >= 1 && ch <= 5) {
				ch = 1
			}
			else {
				ch = -1
			}

			let point = new mw.Vector(pos.x,
				pos.y + ch * Utils.RangeInt(1, 10) * Utils.RangeInt(20, 50), pos.z + ch * Utils.RangeInt(1, 10) * Utils.RangeInt(100, 300))
			path.push(point)
		}
		return path
	}

	private findObj() {
		if (!this._cameraFocusObj) {
			this._cameraFocusObj = GameObject.findGameObjectById(CommonAssets.DISPLAY_CAMERA_FOCUS_OBJ);
		}
		if (this._stages.length == 0) {
			ShowStageGUID.forEach(e => {
				let obj = GameObject.findGameObjectById(e) as mw.GameObject
				this._initStagePoses.push(obj.worldTransform.position.clone())
				this._initStageRotes.push(obj.worldTransform.rotation.clone())
				this._stages.push(obj)
			})
		}
		if (this._followinglights.length == 0) {
			FollowingLightGUID.forEach(e => {
				let light = new FollowingLight()
				let obj = GameObject.findGameObjectById(e) as mw.Effect
				obj.loop = true
				obj.stop()
				light.followLight = obj
				light.path = this.initFollowingPath(obj.worldTransform.position)
				this._followinglights.push(light)
			})
		}

		if (this._spotlights.length == 0) {
			SpotLightGUID.forEach(light => {
				let obj = GameObject.findGameObjectById(light) as mw.Effect
				obj.loop = true
				obj.stop()
				this._spotlights.push(obj)
			})
		}

		if (this._horseLook.length == 0) {
			HorseLookGUID.forEach(guid => {
				let obj = GameObject.findGameObjectById(guid) as mw.GameObject
				this._horseLook.push(obj)
			})
		}
		if (this._horseFocuse.length == 0) {
			HorseFocusGUID.forEach(guid => {
				let obj = GameObject.findGameObjectById(guid) as mw.GameObject
				this._horseFocuse.push(obj)
			})
		}

		if (this._horseBirthPos.length == 0) {
			HorseBirthGUID.forEach(guid => {
				let obj = GameObject.findGameObjectById(guid) as mw.GameObject
				this._horseBirthPos.push(obj)
			})
		}

		if (this._horseBirthEffect.length == 0) {
			HorseBirthEffectGUID.forEach(guid => {
				let obj = GameObject.findGameObjectById(guid) as mw.Effect
				obj.loop = true
				obj.stop()
				this._horseBirthEffect.push(obj)
			})
		}

		if (this._arrowEffect.length == 0) {
			// ArrowEffectGUID.forEach(guid => {
			for (let i = 0; i < 3; i++) {
				let guid = ArrowEffectGUID[i]
				let obj = GameObject.findGameObjectById(guid) as mw.Effect
				obj.setVisibility(mw.PropertyStatus.Off)
				let arrow = SpawnManager.spawn({ guid: CommonAssets.ArrowEffect }) as mw.Effect
				arrow.parent = this._stages[i]
				arrow.loop = true
				arrow.localTransform.position = (obj.localTransform.position)
				arrow.localTransform.rotation = (obj.localTransform.rotation)
				arrow.localTransform.scale = (obj.localTransform.scale)
				this._arrowEffect.push(arrow)
			}
			// })
		}

		this._script = mw.findUIScript(this.mItem) as ItemUI
	}


	private async onRefresh() {
		this._index = -1

		//刷新数据
		this._prices = []

		let all = 0;
		this._horseInfos.forEach((value) => {
			const price = ModuleService.getModule(SyntheticModuleC).getPrice(value.property)
			this._prices.push(price)
			all += price
		})

		await this.createHorseModels()
	}

	//切换马
	public onExchange() {
		this.showButtons()
		// ModuleService.getModule(CameraModuleC).moveToFreePoint(this._index + 1);
		CameraUtils.changeCamera(this._cameraAnchor[this._index + 1]);
		this.mDetailCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
		this.mPrice.text = this._prices[this._index] + ""
		this._script.init(this._horseInfos[this._index])
	}

	private startShow() {
		this.blackMask.visibility = mw.SlateVisibility.Visible
		this.blackMask.renderOpacity = 1

		this._cameraAnchor = []
		this._cameraAnchor.push(this._cameraFocusObj)
		this._horseLook.forEach(horse => {
			this._cameraAnchor.push(horse)
		})
		this._horseFocuse.forEach(horse => {
			this._cameraAnchor.push(horse)
		})

		this._arrowEffect.forEach(e => {
			e.setVisibility(mw.PropertyStatus.Off)
			e.stop()
		})

		CameraUtils.changeCamera(this._cameraAnchor[0]);

		for (let i = 0; i < this._stages.length; i++) {
			this._stages[i].worldTransform.position = this._initStagePoses[i]
			this._stages[i].worldTransform.rotation = this._initStageRotes[i]
		}

		this._spotlights.forEach(light => {
			light.stop()
		})

		ActionMgr.instance().fadeOut(this.blackMask, 500, this, async () => {
			this.blackMask.visibility = mw.SlateVisibility.Hidden
			this._stages.forEach(stage => {
				let endZ: number = stage.worldTransform.position.z + 1100
				ActionMgr.instance().runTween({ z: stage.worldTransform.position.z }, this)
					.to({ z: endZ }, 1500)
					.onUpdate((T) => {
						stage.worldTransform.position = new mw.Vector(stage.worldTransform.position.x, stage.worldTransform.position.y, T.z)
					})
					.start()
					.onComplete(() => {
						this._canFollowingShow = true
						SoundHelper.instance().play(1001)

						this._followinglights.forEach(light => {
							light.init()
						})

						Scheduler.TimeStart(() => {
							this._canFollowingShow = false

							this._followinglights.forEach(light => {
								light.stop()
							})
							SoundHelper.instance().play(1002)
							Scheduler.TimeStart(() => {
								this.rotateStage()
							}, 1)

						}, this._followingTime)
					})
			})

		})
	}


	public rotateStage() {
		let index = 0

		let tmpRot: mw.Rotation = this._stages[index].worldTransform.rotation
		ActionMgr.instance().runTween({ rot: tmpRot }, this)
			.to({ rot: tmpRot.clone().add(new mw.Rotation(0, 0, 180)) }, 250)
			.onUpdate((T) => {
				this._stages[index].worldTransform.rotation = T.rot
			})
			.start()
			.onComplete(() => {
				SoundHelper.instance().play(1003)
				this._spotlights[index].play()
				this._horseBirthEffect[index].loop = false;
				this._horseBirthEffect[index].play();//播放彩带

				index += 1
			})

		let inteval = Scheduler.TimeStart(() => {
			if (index == 3) {
				this.mSearchCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.mClose.visibility = mw.SlateVisibility.Visible

				this._arrowEffect.forEach(e => {
					e.setVisibility(mw.PropertyStatus.On)
					e.play()
				})

				this._allHorseModels.forEach(horse => {
					horse.instance.parent = null
				})

				for (let i = 0; i < this._allHorseModels.length; i++) {
					if (this._lookedHorsePos.length < 3) {
						this._lookedHorsePos.push(this._allHorseModels[i].instance.worldTransform.position.clone())

						if (i >= 1) {
							let tmpLoc = this._lookedHorsePos[i].clone().add(
								new mw.Vector(0, 50 * i, 0)
							)
							this._lookingHorsePos.push(tmpLoc)
						}
						else {
							this._lookingHorsePos.push(this._allHorseModels[i].instance.worldTransform.position.clone())
						}
					}
				}
				Scheduler.Cancel(inteval)
			} else {
				let tmpRot: mw.Rotation = this._stages[index].worldTransform.rotation
				ActionMgr.instance().runTween({ rot: tmpRot }, this)
					.to({ rot: tmpRot.clone().add(new mw.Rotation(0, 0, 180)) }, 250)
					.onUpdate((T) => {
						this._stages[index].worldTransform.rotation = T.rot
					})
					.start()
					.onComplete(() => {
						SoundHelper.instance().play(1003)

						this._spotlights[index].play()
						this._horseBirthEffect[index].play();
						index += 1
					})
			}
		}, 1, -1)

	}

	protected onUpdate(dt: number) {
		if (this._canFollowingShow) {
			this._followinglights.forEach(light => {
				light.move(dt)
			})
		}
	}


	protected onShow(...params: any[]) {

		this.mItem.visibility = mw.SlateVisibility.Hidden
		this._horseInfos.length = 0
		const horseInfos = params[0] as IHorseInfo[]
		for (let i = 0; i < horseInfos.length; i++) {
			this._horseInfos.push(horseInfos[i])
		}
		this.mSearchCanvas.visibility = mw.SlateVisibility.Hidden
		this.mDetailCanvas.visibility = mw.SlateVisibility.Hidden
		this.mClose.visibility = mw.SlateVisibility.Hidden
		this.mBtnTake.visibility = mw.SlateVisibility.Hidden
		this.mSelect.enable = true
		this.onRefresh()
		this.startShow()
		SoundHelper.instance().play(1008)
	}

	private async createHorseModels() {
		this._allHorseModels.length = 0
		for (let i = 0; i < this._horseInfos.length; i++) {
			let tmpHorse: HoresModelC = await ModuleService.getModule(SyntheticModuleC).createHorse(this._horseInfos[i])
			tmpHorse.instance.worldTransform.rotation = new mw.Rotation(0, 0, -90 + i * 10)
			tmpHorse.instance.worldTransform.position = this._horseBirthPos[i].worldTransform.position
			tmpHorse.instance.parent = this._stages[i]
			tmpHorse.playAnimation(EHorseAnimation.Standby, 1, true)
			this._allHorseModels.push(tmpHorse)
		}
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		for (const horseModel of this._allHorseModels) {
			horseModel.destory()
		}
		mw.UIService.getUI(InteractiveUI).turnAgain()
		CameraUtils.resetCamera();
		ModuleService.getModule(PlayerModuleC).setCamera(ESceneType.Shop)
		SoundHelper.instance().restoreBGM();
		ModuleService.getModule(PlayerModuleC).showBasicUI();
	}
}
