import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { IHorseInfo, GlobalVar, EHorseAnimation, IBreedInfo, EPartType, ErrorCode } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { BagMouduleC, BagMouduleS } from "../module/BagMoudule";
import { NewGuideModuleC, NewGuideModuleS } from "../module/GuideModule";
import { PlayerModuleC } from "../module/PlayerModule";
import { SyntheticModuleC, SyntheticModuleS } from "../module/SyntheticModule";

import BreedUI from "../ui/BreedUI";
import InteractiveUI, { EInteractiveShowType, EInteractiveType, IInteractiveInfo } from "../ui/InteractiveUI";
import Tips from "../ui/Tips";
import { ActionMgr } from "../utils/ActionMgr";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import { HoresModelC } from "../logic/HorseModel";
import CameraUtils from '../utils/CameraUtils';

/** 大马生成点2 */
const HORSE_BIRTH2: string = "F382A3C5";
/** 大马生成点1 */
const HORSE_BIRTH1: string = "883E9826";
/** 大马汇集点 */
const HORSE_GATHER: string = "7BE2525D";
/** 繁育摄像机锚点 */
const BREED_CAMERA_POINT: string = "2881FF62";
/** 小马展示锚点 */
const PONY_SHOW_POINT: string = "D4291609";
/** 小马展示摄像机锚点 */
const PONY_CAMERA_POINT: string = "D78D2106";
/** 小马位置锚点 */
const PONY_LOCATION_GUID: string[] = ["F18E6E02", "A8DAD969", "69149A75"];

export class BreedModuleData extends Subdata {
    @Decorator.persistence()
    public horseInfo1: IHorseInfo;
    @Decorator.persistence()
    public horseInfo2: IHorseInfo;
    @Decorator.persistence()
    public ponyInfos: IBreedInfo[];

    protected initDefaultData(): void {
        this.horseInfo1 = null;
        this.horseInfo2 = null;
        this.ponyInfos = [null, null, null];
        super.initDefaultData();
        this.save(true);
    }

    public setData(horseInfo1: IHorseInfo, horseInfo2: IHorseInfo, ponyInfos: IBreedInfo[]) {
        this.horseInfo1 = horseInfo1;
        this.horseInfo2 = horseInfo2;
        this.ponyInfos = ponyInfos;
        this.save(false);
    }

    public getAllHorseInfo() {
        return [this.horseInfo1, this.horseInfo2];
    }

    public getAllPony() {
        return this.ponyInfos;
    }

    public getPony(index: number) {
        let info: IHorseInfo = null;
        info = this.ponyInfos[index].horseInfo;
        return info;
    }

    public delePony(index: number) {
        this.ponyInfos[index] = null;
        this.save(true);
    }
}

export class BreedModuleC extends ModuleC<BreedModuleS, BreedModuleData> {
    private _selectIndex: number = -1;

    /** 马匹模型1 */
    private _horseModel1: HoresModelC;
    /** 马匹模型2 */
    private _horseModel2: HoresModelC;
    /** 大马生成点1 */
    private _birth1: mw.Vector;
    /** 大马生成点2 */
    private _birth2: mw.Vector;
    /** 聚集点坐标 */
    private _gather: mw.Vector;
    /** 摄像机锚点 */
    private _cameraBreedPoint: mw.GameObject;
    /** 小马展示位置 */
    private _ponyShowPos: mw.Vector;
    /** 小马旋转 */
    private _ponyShowRoa: mw.Rotation;
    /** 小马展示摄像机锚点 */
    private _ponyShowCamera: mw.GameObject;
    /** 小马模型数组 */
    private _ponyModels: HoresModelC[] = [];
    /** 小马信息数组 */
    private _ponyInfos: IBreedInfo[] = [];
    /** 当前展示小马序号 */
    private _ponyIndex: number;
    /** 小马展示位置 */
    private _ponyLocationS: mw.Vector[] = [];
    /** 显示小马计时器 */
    private _showPonyInterval: number = 0;
    /** 变异特效 */
    private _particle: mw.Effect;

    /** 两匹马在马厩中对应的序号 */
    private _chooseVec2: mw.Vector2 = new mw.Vector2(-1, -1);

    private _temVec1: mw.Vector = mw.Vector.zero;
    private _temVec2: mw.Vector = mw.Vector.zero;

    /** 是否显示 */
    private _show: boolean = true;
    private _finished: boolean;

    onStart() {
        this._ponyInfos = this.data.getAllPony();
        this.initOnce();
    }

    private async initOnce() {
        let birth1 = await GameObject.asyncFindGameObjectById(HORSE_BIRTH1);
        this._birth1 = birth1.worldTransform.position;
        let birth2 = await GameObject.asyncFindGameObjectById(HORSE_BIRTH2);
        this._birth2 = birth2.worldTransform.position;
        let gather = await GameObject.asyncFindGameObjectById(HORSE_GATHER);
        this._gather = gather.worldTransform.position;
        this._cameraBreedPoint = await GameObject.asyncFindGameObjectById(BREED_CAMERA_POINT);
        let ponyShow = await GameObject.asyncFindGameObjectById(PONY_SHOW_POINT);
        this._ponyShowPos = ponyShow.worldTransform.position;
        this._ponyShowRoa = ponyShow.worldTransform.rotation;
        this._ponyShowCamera = await GameObject.asyncFindGameObjectById(PONY_CAMERA_POINT);
        PONY_LOCATION_GUID.forEach(async guid => {
            let ponyPoint = await GameObject.asyncFindGameObjectById(guid);
            this._ponyLocationS.push(ponyPoint.worldTransform.position);
        });
        this.createModel();
    }

    private async createModel() {
        if (this.getPonyNum() > 0) {
            let horses = this.data.getAllHorseInfo()
            let horseInfo1 = horses[0];
            let horseInfo2 = horses[1];
            this._horseModel1 = await this.createHorseModel(this._birth1, horseInfo1);
            this._horseModel2 = await this.createHorseModel(this._birth2, horseInfo2);
            this._horseModel1.instance.localTransform.rotation = new mw.Rotation(0, 0, 90);
            this._horseModel2.instance.localTransform.rotation = new mw.Rotation(0, 0, 90);
            this.setHorsePos(0.85);

            for (let index = 0; index < this._ponyInfos.length; index++) {
                const pony = this._ponyInfos[index];
                if (pony) {
                    let model = await ModuleService.getModule(SyntheticModuleC).createHorse(pony.horseInfo);
                    this._ponyModels[index] = model;
                    model.instance.worldTransform.position = this._ponyLocationS[index];
                    model.instance.localTransform.rotation = new mw.Rotation(0, 0, 90);
                    model.instance.worldTransform.scale = new mw.Vector(0.5, 0.5, 0.5);
                }
            }
        }
    }

    public getChooseVec2(): mw.Vector2 {
        return this._chooseVec2;
    }

    /**
     * 设置当前选择的马是左边1还是右边2
     * @param index 1左 2右
     */
    public setCurIndex(index: number) {
        this._selectIndex = index;
    }

    /**
     * 获取马匹信息
     * @param index 1左 2右
     * @returns 马匹信息
     */
    public getHorseInfo(index: number): IHorseInfo {
        let stableIndex = (index == 1) ? this._chooseVec2.x : this._chooseVec2.y;
        let horseInfo = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(stableIndex);
        return horseInfo;
    }

    /**
     * 获取小马信息
     * @param index 序号
     * @returns 小马信息
     */
    public getPonyInfo(index: number): IHorseInfo {
        if (this._ponyInfos[index]) {
            return this._ponyInfos[index].horseInfo;
        }
        return null;
    }

    /**
     * 获取尚未领取的小马的数量
     * @returns 小马数量
     */
    public getPonyNum(): number {
        let num = 0;
        this._ponyInfos.forEach(info => {
            if (info) {
                num++;
            }
        });
        return num;
    }

    /**
     * 带走小马
     * @param index 序号
     */
    public takePony(index: number) {
        this._ponyInfos[index] = null;
        if (this._ponyModels[index]) {
            this._ponyModels[index].destory();
        }
        this.server.net_takePony(index);
        let remain = 0;
        this._ponyInfos.forEach((pony) => {
            if (pony) {
                remain++;
            }
        })
        if (remain <= 0) {
            this.destoryModel();
        }
    }

    /**
     *  繁育按钮点击
     * @returns 是否允许开始
     */
    public startBreed(): boolean {
        if (this._chooseVec2.x == -1 || this._chooseVec2.y == -1) {
            Tips.showTips(GameConfig.Language[ErrorCode[1009]].Value);
            return false;
        }
        SoundHelper.instance().play(1013, true);

        let player = Player.localPlayer;
        player.character.movementEnabled = false;
        player.character.jumpEnabled = false;

        CameraUtils.changeCamera(this._cameraBreedPoint);
        this._horseModel1.playAnimation(EHorseAnimation.FollowingWalk, 1, true);
        this._horseModel2.playAnimation(EHorseAnimation.FollowingWalk, 1, true);
        this._show = true;

        ActionMgr.instance().runTween({ progress: 0 }, this)
            .to({ progress: 0.90 }, 3000)
            .onUpdate((T) => {
                this.setHorsePos(T.progress);
            })
            .start()
            .onComplete(() => {
                this._horseModel1.playAnimation(EHorseAnimation.GetSecondOrThird, 1, true);
                this._horseModel2.playAnimation(EHorseAnimation.GetSecondOrThird, 1, true);
                ActionMgr.instance().runTween({ progress: 0.90 }, this)
                    .to({ progress: 0.95 }, 2000)
                    .onUpdate((T) => {
                        this.setHorsePos(T.progress);
                    })
                    .start()
                    .onComplete(() => {
                        this._horseModel1.playAnimation(EHorseAnimation.Loading, 1, true);
                        this._horseModel2.playAnimation(EHorseAnimation.Loading, 1, true);
                        ActionMgr.instance().runTween({ progress: 0 }, this)
                            .to({ progress: 0.90 }, 3000)
                            .onUpdate((T) => {
                            })
                            .start()
                            .onComplete(() => {
                                this.reqBreed();
                            })
                    })
            })
        return true;
    }

    /**
     * 设置大马的坐标
     * @param lerp 从大马到出生点的比例
     */
    private setHorsePos(lerp: number) {
        this._temVec1.x = mw.MathUtil.lerp(this._birth1.x, this._gather.x, lerp);
        this._temVec1.y = mw.MathUtil.lerp(this._birth1.y, this._gather.y - 2, lerp);
        this._temVec1.z = mw.MathUtil.lerp(this._birth1.z, this._gather.z, lerp);
        this._horseModel1.instance.worldTransform.position = this._temVec1;
        this._temVec2.x = mw.MathUtil.lerp(this._birth2.x, this._gather.x, lerp);
        this._temVec2.y = mw.MathUtil.lerp(this._birth2.y, this._gather.y + 2, lerp);
        this._temVec2.z = mw.MathUtil.lerp(this._birth2.z, this._gather.z, lerp);
        this._horseModel2.instance.worldTransform.position = this._temVec2;
    }

    /** 繁育，计算生出小马的信息 */
    private reqBreed() {
        this._finished = false
        this._horseModel1.instance.worldTransform.rotation = new mw.Rotation(0, 0, 90);
        this._horseModel2.instance.worldTransform.rotation = new mw.Rotation(0, 0, 90);
        this.setHorsePos(0.85);
        CameraUtils.changeCamera(this._ponyShowCamera);

        this.server.net_breed(this._chooseVec2.x, this._chooseVec2.y);
    }

    /** 展示小马 */
    private async showPony(info: IBreedInfo) {
        this._show && SoundHelper.instance().play(1014)

        this.stopVariationParticle();
        let model = await ModuleService.getModule(SyntheticModuleC).createHorse(info.horseInfo);
        model.playAnimation(EHorseAnimation.Appearance, 1, false);
        this._show && Tips.showTips(mw.StringUtil.format(GameConfig.Language.BreedMgr_talk_1.Value, this._ponyIndex + 1), 1);

        this._ponyModels.push(model);
        this.ponyReset(this._ponyIndex - 1);
        this._ponyModels[this._ponyIndex].instance.worldTransform.position = this._ponyShowPos;
        this._ponyModels[this._ponyIndex].instance.worldTransform.rotation = this._ponyShowRoa;
        if (info.variationPart != EPartType.None) {
            Scheduler.TimeStart(() => {
                this._show && Tips.showTips(GameConfig.Language[ErrorCode[1008]].Value, 1)
                Scheduler.TimeStart(() => {
                    let part = this.getPartName(info.variationPart);
                    this._show && Tips.showTips(mw.StringUtil.format(GameConfig.Language.BreedMgr_talk_2.Value, part), 1);
                    let partGO = this._ponyModels[this._ponyIndex].getPartNode(info.variationPart, info.variationIndex);
                    this.playVariationParticle(partGO);
                }, 0.5)
            }, 0.5)
        }
    }

    /**
     * 在指定位置播放特效
     * @param pos 位置
     */
    private playVariationParticle(go: mw.GameObject) {
        this._particle.parent = go;
        const p3 = GameConfig.Global.getElement(1043).Parameter3;
        const offset = new mw.Vector(p3[0][0], p3[0][1], p3[0][2]);
        this._particle.localTransform.position = offset;
        const rotation = new mw.Rotation(p3[1][0], p3[1][1], p3[1][2]);
        this._particle.localTransform.rotation = rotation;
        this._particle.setVisibility(mw.PropertyStatus.On);
        let cfg = GameConfig.Global.getElement(1043);
        const sclae = new mw.Vector(cfg.Parameter3[2][0], cfg.Parameter3[2][1], cfg.Parameter3[2][2]);
        this._particle.worldTransform.scale = sclae;
        this._particle.play();
    }

    /**
     * 创建特效并停止特效播放
     * @returns null
     */
    private async stopVariationParticle() {
        if (!this._particle) {
            let cfg = GameConfig.Global.getElement(1043);
            const PARTICLE_GUID = cfg.Parameter1.toString();
            if (!mw.AssetUtil.assetLoaded(PARTICLE_GUID)) {
                await mw.AssetUtil.asyncDownloadAsset(PARTICLE_GUID)
            }
            this._particle = await SpawnManager.asyncSpawn({ guid: PARTICLE_GUID }) as mw.Effect;
            const sclae = new mw.Vector(cfg.Parameter3[2][0], cfg.Parameter3[2][1], cfg.Parameter3[2][2]);
            this._particle.worldTransform.scale = sclae;
        } else if (!this._particle.getVisibility()) {
            return;
        }
        this._particle.parent = null;
        this._particle.setVisibility(mw.PropertyStatus.Off);
        this._particle.stop();
    }

    /**
     * 获得部位名称
     * @param type 部位类型
     * @returns 部位名称
     */
    private getPartName(type: EPartType): string {
        let part = "";
        switch (type) {
            case EPartType.Head: part = GameConfig.Language.Head.Value;
                break;
            case EPartType.Neck: part = GameConfig.Language.Neck.Value;
                break;
            case EPartType.Body: part = GameConfig.Language.Body.Value;
                break;
            case EPartType.Tail: part = GameConfig.Language.Tail.Value;
                break;
            case EPartType.Thigh: part = GameConfig.Language.Leg.Value;
                break;
            case EPartType.Calf: part = GameConfig.Language.Shank.Value;
                break;
        }
        return part;
    }

    /**
     *  显示繁育结果 
     * @param infoArr 繁育信息数组 
     */
    private showResult() {
        this.ponyReset(this._ponyIndex - 1);
        this.stopVariationParticle();
        if (!this._show) {
            this._finished = true;
            return;
        }
        CameraUtils.changeCamera(this._cameraBreedPoint);
        SoundHelper.instance().restoreBGM();

        Scheduler.TimeStart(() => {
            if (!this._show) {
                this._finished = true;
                return;
            }
            mw.UIService.hide(BreedUI);
            ModuleService.getModule(PlayerModuleC).showBasicUI();
            let player = Player.localPlayer;
            player.character.movementEnabled = true;
            player.character.jumpEnabled = true;
            CameraUtils.resetCamera();
            if (ModuleService.getModule(NewGuideModuleC).isCompleteForce()) {
                let info: IInteractiveInfo = {
                    desc: GameConfig.Language.Breed_get1.Value,
                    triggerGuid: "",
                    type: EInteractiveType.Breed,
                    showType: EInteractiveShowType.Talk
                }
                mw.UIService.show(InteractiveUI, info)
            }
            else {
            }
            mw.UIService.getUI(InteractiveUI).turnAgain();
            this._finished = true
        }, 3)
    }

    public isBreedFinished() {
        return this._finished
    }

    /**
     * 小马复位
     * @param index 小马序号
     */
    private ponyReset(index: number) {
        let model = this._ponyModels[index]
        if (model) {
            model.instance.worldTransform.position = this._ponyLocationS[index];
            model.instance.localTransform.rotation = new mw.Rotation(0, 0, 90);
            model.instance.worldTransform.scale = new mw.Vector(0.5, 0.5, 0.5);
        }
    }

    /**
     * 设置显示时触发
     */
    public init() {

        this._chooseVec2 = new mw.Vector2(-1, -1);
        this._selectIndex = -1;
        this._ponyInfos = [null, null, null];
        ModuleService.getModule(BagMouduleC).reqHideAFollowingHorse();
        this.destoryModel();
    }

    /**
     * 设置马匹信息
     * @param index 马在马厩中的位置
     */
    public async setHorseInfo(index: number) {
        // 1或2 分别对应左边和右边
        if (this._selectIndex == 1) {
            this._chooseVec2.x = index;
            let horseInfo1 = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(index);
            if (this._horseModel1) {
                this._horseModel1.destory();
                this._horseModel1 = null;
            }
            this._horseModel1 = await this.createHorseModel(this._birth1, horseInfo1);
        } else if (this._selectIndex == 2) {
            this._chooseVec2.y = index;
            let horseInfo2 = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(index);

            if (this._horseModel2) {
                this._horseModel2.destory();
                this._horseModel2 = null;
            }
            this._horseModel2 = await this.createHorseModel(this._birth2, horseInfo2);
        }
        this._selectIndex = -1;
    }

    public async createHorseModel(birthPos: mw.Vector, info: IHorseInfo) {
        let horseModel = await ModuleService.getModule(SyntheticModuleC).createHorse(info);
        let sub = this._gather.clone().subtract(birthPos).toRotation();
        horseModel.instance.worldTransform.rotation = sub;
        horseModel.instance.worldTransform.position = birthPos;
        return horseModel;
    }

    /**
     * 销毁马匹模型
     */
    private destoryModel() {
        if (this._horseModel1) {
            this._horseModel1.destory();
            this._horseModel1 = null;
        }
        if (this._horseModel2) {
            this._horseModel2.destory();
            this._horseModel2 = null;
        }
        for (let i = this._ponyModels.length - 1; i >= 0; i--) {
            if (this._ponyModels[i]) {
                this._ponyModels[i].destory();
            }
            this._ponyModels.splice(i, 1);
        }
        ActionMgr.instance().remove(this);
    }

    public stopBreed() {
        this._show = false;
        let player = Player.localPlayer;
        player.character.movementEnabled = true;
        player.character.jumpEnabled = true;
        SoundHelper.instance().restoreBGM();
        mw.UIService.hide(BreedUI);
    }

    public net_setBreedInfo(infoArr: IBreedInfo[]) {
        this._ponyInfos = infoArr;
        this._ponyIndex = 0;
        this._ponyInfos[this._ponyIndex] = infoArr[this._ponyIndex];
        this.showPony(infoArr[this._ponyIndex]);
        this._showPonyInterval = Scheduler.TimeStart(() => {
            this._ponyIndex++;
            if (this._ponyIndex >= infoArr.length) {
                this.showResult();
                Scheduler.Cancel(this._showPonyInterval);
            } else {
                this._ponyInfos[this._ponyIndex] = infoArr[this._ponyIndex];
                this.showPony(infoArr[this._ponyIndex]);
            }
        }, 4, 3);
    }

}


export class BreedModuleS extends ModuleS<BreedModuleC, BreedModuleData> {
    /**
     * 繁育小马
     * @param index1 大马在马厩中的序号
     * @param index2 大马在马厩中的序号
     */
    public net_breed(index1: number, index2: number) {
        let horseInfo1 = ModuleService.getModule(BagMouduleS).getHoresInfoByIndex(this.currentPlayerId, index1);
        horseInfo1.property.birthNum--;
        ModuleService.getModule(BagMouduleS).modifyHorse(this.currentPlayerId, index1, horseInfo1.ID, horseInfo1.property);

        let horseInfo2 = ModuleService.getModule(BagMouduleS).getHoresInfoByIndex(this.currentPlayerId, index2);
        horseInfo2.property.birthNum--;
        ModuleService.getModule(BagMouduleS).modifyHorse(this.currentPlayerId, index2, horseInfo2.ID, horseInfo2.property);

        // const guide = ModuleService.getModule(NewGuideModuleS).getPlayerGuide(this.currentPlayerId);
        let random = Math.floor(Math.random() * 3 + 1);
        // if (guide) {
        //     random = 1;
        // }
        let infoArr: IBreedInfo[] = [];
        const syntheticModuleS = ModuleService.getModule(SyntheticModuleS)
        for (let i = 0; i < random; i++) {
            const breedInfo = syntheticModuleS.breed(horseInfo1, horseInfo2);
            infoArr.push(breedInfo);
        }
        this.currentData.setData(horseInfo1, horseInfo2, infoArr);
        this.notifyBreedInfo(this.currentPlayerId, infoArr);
    }

    public notifyBreedInfo(playerID: number, breedInfos: IBreedInfo[]) {
        this.getClient(playerID).net_setBreedInfo(breedInfos);
    }

    public net_takePony(index: number) {
        let horseInfo = this.currentData.getPony(index);
        this.currentData.delePony(index);
        ModuleService.getModule(BagMouduleS).addHorse(this.currentPlayerId, horseInfo);
    }
}