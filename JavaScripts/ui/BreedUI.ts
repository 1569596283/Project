
import { ErrorCode, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { BagMouduleC } from "../module/BagMoudule";
import { PlayerModuleC } from "../module/PlayerModule";
import BreedUI_Generate from "../ui-generate/ui/BreedUI_generate";
import { ActionMgr } from "../utils/ActionMgr";
import SoundHelper from "../utils/SoundHelper";
import HorseBagUI from "./HorseBagUI";
import InteractiveUI from "./InteractiveUI";
import ItemUI from "./ItemUI";
import Tips from "./Tips";
import { BreedModuleC } from "../module/BreedModule";
import CameraUtils from "../utils/CameraUtils";

/** 繁育摄像机锚点 */
const BREED_CAMERA_POINT: string = "2881FF62";

export default class BreedUI extends BreedUI_Generate {

	/** 摄像机锚点 */
	private _cameraBreedPoint: mw.GameObject;
	private _items: ItemUI[] = []

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
		this.image_shady.visibility = mw.SlateVisibility.Hidden;

		this.button_icon1.onClicked.add(() => {
			this.chooseHorse(1);
		})

		this.button_icon2.onClicked.add(() => {
			this.chooseHorse(2);
		})

		this.button_leave.onClicked.add(() => {
			mw.UIService.hide(BreedUI);
			mw.UIService.getUI(InteractiveUI).turnAgain();
			ModuleService.getModule(PlayerModuleC).showBasicUI();
			SoundHelper.instance().restoreBGM();
			CameraUtils.resetCamera();
		})

		this.button_breed.onClicked.add(this.breedClick);
		this._cameraBreedPoint = GameObject.findGameObjectById(BREED_CAMERA_POINT);
		for (let i = 1; i <= 2; i++) {
			let script = mw.findUIScript(this["mItem" + i]) as ItemUI
			script.hide()
			this._items.push(script)
		}
	}

	private chooseHorse = (index: number) => {
		// BreedMgr.instance().setCurIndex(index);
		ModuleService.getModule(BreedModuleC).setCurIndex(index);
		let horses = ModuleService.getModule(BagMouduleC).getAllMatureHorse();
		if (horses.length <= 0) {
			Tips.showTips(GameConfig.Language[ErrorCode[1016]].Value);
			return;
		}
		// let vec2 = BreedMgr.instance().getChooseVec2();
		let vec2 = ModuleService.getModule(BreedModuleC).getChooseVec2();
		let horseindex = 0;
		for (let i = 0; i < horses.length; i++) {
			if (horses[i].stableIndex !== vec2.x && horses[i].stableIndex !== vec2.y) {
				horseindex = i;
			}
		}
		mw.UIService.hide(BreedUI);
		mw.UIService.show(HorseBagUI, horses[horseindex].stableIndex, vec2);

	}

	/**
	 * 繁育按钮点击
	 */
	private breedClick = () => {
		// if (!BreedMgr.instance().startBreed()) {
		if (!ModuleService.getModule(BreedModuleC).startBreed()) {
			console.log(" 不允许繁育 ");
			return;
		}

		this.canvas_info.visibility = mw.SlateVisibility.Hidden;
		ActionMgr.instance().runTween({ progress: 0 }, this)
			.to({ progress: 0.90 }, 3000)
			.onUpdate((T) => {
			})
			.start()
			.onComplete(() => {
				ActionMgr.instance().runTween({ progress: 0.90 }, this)
					.to({ progress: 0.95 }, 2000)
					.onUpdate((T) => {
					})
					.start()
					.onComplete(() => {
						this.image_shady.visibility = mw.SlateVisibility.Visible;
						ActionMgr.instance().runTween({ progress: 0 }, this)
							.to({ progress: 0.90 }, 3000)
							.onUpdate((T) => {
								this.image_shady.renderOpacity = T.progress;
							})
							.start()
							.onComplete(() => {
								this.image_shady.visibility = mw.SlateVisibility.Hidden;
							})
					})
			})
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow() {

		this.rootCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.refreshHorse(1);
		this.refreshHorse(2);
		this.image_shady.visibility = mw.SlateVisibility.Hidden;
		this.canvas_info.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		CameraUtils.changeCamera(this._cameraBreedPoint);
		ModuleService.getModule(PlayerModuleC).hideBasicUI();
	}

	/**
	 * 刷新马匹显示的信息
	 * @param index 1或2 分别对应左边和右边
	 */
	public refreshHorse(index: number) {
		// let info = BreedMgr.instance().getHorseInfo(index);
		let info = ModuleService.getModule(BreedModuleC).getHorseInfo(index);

		this._items[index - 1].init(info)
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		ActionMgr.instance().remove(this);
		this._items.forEach(item => {
			item.hide()
		})
	}

}
