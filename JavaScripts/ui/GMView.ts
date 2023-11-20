import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';

/** 
 * AUTHOR: 远山迷雾
 * TIME: 2022.11.25-10.20.26
 */
import * as odin from 'odin'
import { ECompetitionState, EPartType, GlobalVar, IHorseInfo, IPartInfo } from '../Common';
import { GameConfig } from '../config/GameConfig';
import { IHorseElement } from '../config/Horse';
import { ILineageElement } from '../config/Lineage';
import { GameEvents } from '../GameEvents';
import { HoresModelC } from '../logic/HorseModel';
import Property from '../logic/Property';
import { GMModuleC } from '../module/GMModule';
import { RacingModuleC } from '../module/RacingModule';
import { SyntheticModuleC, SyntheticModuleS } from '../module/SyntheticModule';
import GMView_Generate from "../ui-generate/ui/GMView_generate";
import { emitter } from '../utils/Emitter';
import Utils from '../utils/Utils';
import Tips from './Tips';

class ButtonInfo {
	btn: mw.Button
	index: number
}

const BIRTH_GUID = "007091B6";
export default class GMView extends GMView_Generate {

	private _buffItems: mw.Canvas[] = []
	private _btns: ButtonInfo[] = []

	private _curBtn: ButtonInfo

	private _testModel: HoresModelC = null;

	private _birthLocation: mw.Vector = mw.Vector.zero;
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerTop;
		this.initButtons();
		this._buffItems.push(this.buff_0)
		this._buffItems.push(this.buff_1)
		this._buffItems.push(this.buff_2)
		this._buffItems.push(this.buff_3)
		this._buffItems.push(this.buff_4)
		this._buffItems.push(this.buff_5)
		this._buffItems.push(this.buff_6)
		this._buffItems.push(this.buff_7)
		for (let i = 0; i < this._buffItems.length; i++) {
			const item = this._buffItems[i];
			item.visibility = mw.SlateVisibility.Hidden

			let index = i
			let btnInfo = new ButtonInfo()
			btnInfo.index = index
			btnInfo.btn = this['btn_' + i] as mw.Button
			btnInfo.btn.onClicked.add(() => {
				this.selectBtn(btnInfo)
			})
			this._btns.push(btnInfo)
		}

		this.inputSelfWay.onTextCommitted.add((text) => {
			let raceWay = Number(text)
			if (!raceWay || raceWay < 1 || raceWay > 8) {
				return
			}
			let state = ModuleService.getModule(RacingModuleC).getCompotitionState()
			if (state > ECompetitionState.Bet) {
				Tips.showTips("当前时间不能预设赛道")
				return
			}

			ModuleService.getModule(GMModuleC).presetRacingWay(raceWay - 1)
		})
		this.btnAddBuff.onClicked.add(() => {
			ModuleService.getModule(GMModuleC).addBuff(Number(this.inputAddBuff.text))
		})
		this.btnAddBuffImpact.onClicked.add(() => {
			ModuleService.getModule(GMModuleC).addBuffImpact(Number(this.inputAddBuff.text))
		})

		emitter.on(GameEvents.EVENT_PRESET_RACE_WAY, () => {
			this.refreshSelfWay()
		}, this)
		emitter.on(GameEvents.EVENT_COMPETITION_STATE_CHANGE, (state: ECompetitionState) => {
			if (state == ECompetitionState.CountDown) {
				this.refreshBuffs(this._curBtn.index)
			}
		}, this)
		emitter.on(GameEvents.EVENT_HORSE_ADD_BUFF, () => {
			this.refreshBuffs(this._curBtn.index)
		}, this)

		this.button_create.onClicked.add(this.createHorse);

		this.button_play.onClicked.add(this.playAnimation);

		let birth = GameObject.findGameObjectById(BIRTH_GUID);
		this._birthLocation = birth.worldTransform.position;
	}

	protected selectBtn(btnInfo: ButtonInfo) {
		if (this._curBtn) {
			this._curBtn.btn.enable = true
		}
		btnInfo.btn.enable = false
		this.refreshBuffs(btnInfo.index)
		this._curBtn = btnInfo
	}

	private createHorse = async () => {
		if (this._testModel) {
			this._testModel.destory();
			this._testModel = null;
		}
		let synthetic = ModuleService.getModule(SyntheticModuleC);
		let id = this.input_horseID.text;
		let horseCfg = GameConfig.Horse.getElement(id);
		if (horseCfg) {
			let info = ModuleService.getModule(SyntheticModuleS).getRandomHorseInfoByHorseID(horseCfg.ID);
			this._testModel = await synthetic.createHorse(info);
			this._testModel.instance.worldTransform.position = this._birthLocation;
		}
	}

	private playAnimation = async () => {
		if (this._testModel) {
			let animation = this.input_animation.text;
			this._testModel.playAnimation(animation, 1, true);
		}
	}

	/**
	 * 获得指定马匹的指定部位
	 */
	private getPart(partType: EPartType, horse: IHorseElement, index?: number): IPartInfo {
		let part = new IPartInfo();
		part.name = partType;
		switch (partType) {
			case EPartType.Head:
				part.partId = horse.head;
				break;
			case EPartType.Neck:
				part.partId = horse.neck;
				break;
			case EPartType.Body:
				part.partId = horse.body;
				break;
			case EPartType.Tail:
				part.partId = horse.tail;
				break;
			case EPartType.Thigh:
				part.partId = horse.leg1[index];
				break;
			case EPartType.Calf:
				part.partId = horse.leg2[index];
				break;

		}
		return part;
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
		this.refreshSelfWay()
		this.selectBtn(this._btns[0])
	}

	protected refreshSelfWay() {
		let selfWay = ModuleService.getModule(GMModuleC).getPresetRacingWay()
		if (selfWay) {
			this.inputSelfWay.text = (selfWay + 1).toString()
		} else {
			this.inputSelfWay.text = ''
		}
	}

	protected refreshBuffs(index: number) {
		let horse = ModuleService.getModule(RacingModuleC).getHorseByRaceWay(index)
		if (!horse) { return }
		let buffs = horse.getBuffImpacts()
		for (let i = 0; i < this._buffItems.length; i++) {
			const item = this._buffItems[i];
			if (buffs[i]) {
				item.visibility = mw.SlateVisibility.SelfHitTestInvisible
				let configId = buffs[i].getConfigId()
				let config = GameConfig.Skill.getElement(configId)
				let textId = item.findChildByPath('TextBuffId') as mw.TextBlock
				textId.text = configId.toString()
				let textBuffDesc = item.findChildByPath('TextBuffDesc') as mw.TextBlock
				textBuffDesc.text = config.Describe
			} else {
				item.visibility = mw.SlateVisibility.Hidden
			}
		}
	}

	/**
	 * 设置不显示时触发
	 */
	protected onHide() {
		if (this._testModel) {
			this._testModel.destory();
			this._testModel = null;
		}
	}

}
