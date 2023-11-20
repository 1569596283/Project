import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonAssets, EHorseSomatoType, EStableHorseState, GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import GrowUI from "../ui/GrowUI";
import HorseBagUI from "../ui/HorseBagUI";
import RewardUI from "../ui/RewardUI";
import { emitter } from "../utils/Emitter";
import { Scheduler } from "../utils/Scheduler";
import SoundHelper from "../utils/SoundHelper";
import { StateMachine } from "../utils/StateMachine";
import Utils from "../utils/Utils";
import { BagMouduleC } from "./BagMoudule";
import { PlayerModuleC, PlayerModuleS } from "./PlayerModule";
import { IWordUI, WorldUIModuleC } from "./WorldUIModule";

//十个马场特效
const ParticlePos: string[] = [
    '459EB1B2',
    '5CB52DEA',
    'E05F63FA',
    '48D6E9BD',
    '68765E68',
    '01AAC5B8',
    '0055EE70',
    '5CB0AD62',
    '761DC21C',
    '5C65EEE8'
]

//便便状态
const enum EFatStatus {
    //idle
    Idle,
    //跳跃
    Jump,
    //飞行
    Fly,
    //观察
    Inspect
}

//砖石状态
const enum EDiamondStatus {
    //idle
    Idle,
    //跳跃
    Jump,
    //飞行
    Fly,
    //观察
    Inspect,
    //掉落
    Drop
}


namespace StableVar {
    export let FAT_ID = 1000
    export let DIAMOND_ID = 1000
}

class FatModel {
    private _fsm: StateMachine<EFatStatus>
    private _obj: mw.GameObject = null
    private _eff: mw.Effect = null

    private _target: mw.Vector | mw.Character = null
    public callBack: () => void = null
    constructor(private _name: string, private _id: number) {

    }

    public async create() {
        if (!mw.AssetUtil.assetLoaded(CommonAssets.HORSE_FIT)) {
            await mw.AssetUtil.asyncDownloadAsset(CommonAssets.HORSE_FIT)
        }
        this._obj = SpawnManager.spawn({ guid: CommonAssets.HORSE_FIT })
        await this._obj.asyncReady();

        this._eff = this._obj.getChildByName("场景__极光") as mw.Effect
        if (this._eff) {
            this._eff.loopCount = 1;
            this._eff.stop()
        }
        this._fsm = new StateMachine()
        this._fsm.register(EFatStatus.Idle, { enter: this.fat_idle.bind(this), update: this.fat_idleUpdate.bind(this) })
        this._fsm.register(EFatStatus.Jump, { enter: this.fat_jump.bind(this), update: this.fat_jumpUpdate.bind(this) })
        this._fsm.register(EFatStatus.Fly, { enter: this.fat_fly.bind(this), update: this.fat_flyUpdate.bind(this) })
        this._fsm.register(EFatStatus.Inspect, { enter: this.fat_inspect.bind(this), update: this.fat_inspectUpdate.bind(this) })
        return this._obj
    }

    public setFatEff(flag: boolean) {
        if (this._eff) {
            flag ? this._eff.play() : this._eff.stop()
        }
    }

    public getID() {
        return this._id
    }

    /**
       * 切换状态
       * @param state 
       * @param data 
       */
    public changeState(state: EFatStatus, ...data: any) {
        this._fsm.switch(state, ...data)
    }

    /**获取当前状态 */
    public getCurState(): EFatStatus {
        return this._fsm.getStateInfo().state
    }

    public getFatModel() {
        return this._obj
    }

    /**
     * @description: 设置粪便位置
     * @param {Type} vec
     * @return {*}
     */
    public setInstancePos(vec: mw.Vector) {
        this._obj.worldTransform.position = vec
    }

    /**
     * @description: 设置粪便大小
     * @param {Type} vec
     * @return {*}
     */
    public setInstanceScale(vec: mw.Vector) {
        this._obj.worldTransform.scale = vec
    }

    //设置目标的位置
    public setTarget(vec: mw.Vector | mw.Character) {
        this._target = vec
    }

    public update(dt: number) {
        this._fsm.update(dt)
    }

    //闲置
    private fat_idle() {

    }
    private fat_idleUpdate(dt: number, eslapsed: number) {

    }

    //监视
    private fat_inspect() {

    }
    private fat_inspectUpdate(dt: number, eslapsed: number) {
        let playerVec = Player.localPlayer.character.worldTransform.position
        if (mw.Vector.squaredDistance(playerVec, this._obj.worldTransform.position) <= 200 * 200) {
            this.setTarget(Player.localPlayer.character)
            this.changeState(EFatStatus.Jump)
        }
    }

    private _jumpHeight: number
    private _speed: number = 10
    //跳跃
    private fat_jump() {

        this._jumpHeight = this._obj.worldTransform.position.z + 60
    }
    private fat_jumpUpdate(dt: number, eslapsed: number) {

        if (this._obj.worldTransform.position.z < this._jumpHeight) {
            let tmpZ = this._obj.worldTransform.position.z + dt + this._speed
            this._obj.worldTransform.position = new mw.Vector(this._obj.worldTransform.position.x, this._obj.worldTransform.position.y,
                tmpZ)
        }
        else {
            SoundHelper.instance().play(1026)
            this.changeState(EFatStatus.Fly)
        }
    }

    //飞行
    private fat_fly() {

    }
    private fat_flyUpdate(dt: number, eslapsed: number) {
        let target: mw.Vector
        if (PlayerManagerExtesion.isCharacter(this._target)) {
            target = (this._target as mw.Character).worldTransform.position
        }
        else if (this._target instanceof mw.Vector) {
            target = this._target as mw.Vector
        }
        if (mw.Vector.squaredDistance(target, this._obj.worldTransform.position) > 50 * 50) {
            let delta = mw.Vector.lerp(this._obj.worldTransform.position, target, dt * 5)
            let targetRot = this._obj.worldTransform.rotation.clone().add(new mw.Rotation(0, 0, 30))
            this._obj.worldTransform.position = delta
            this._obj.worldTransform.rotation = mw.Rotation.lerp(this._obj.worldTransform.rotation, targetRot, dt * 10)
        }
        else {
            if (this.callBack) {
                this.callBack()
                this.callBack = null
            }
        }
    }
}

class DiamondModel {
    private _fsm: StateMachine<EDiamondStatus>
    private _obj: mw.GameObject = null
    private _eff: mw.Effect = null

    private _target: mw.Vector | mw.Character = null
    public callBack: () => void = null
    constructor(private _name: string, private _id: number) {

    }

    public async create() {
        if (!mw.AssetUtil.assetLoaded(CommonAssets.DIAMOND)) {
            await mw.AssetUtil.asyncDownloadAsset(CommonAssets.DIAMOND)
        }
        this._obj = SpawnManager.spawn({ guid: CommonAssets.DIAMOND })
        await this._obj.asyncReady();

        this._fsm = new StateMachine()
        this._fsm.register(EDiamondStatus.Idle, { enter: this.diamond_idle.bind(this), update: this.diamond_idleUpdate.bind(this) })
        this._fsm.register(EDiamondStatus.Jump, { enter: this.diamond_jump.bind(this), update: this.diamond_jumpUpdate.bind(this) })
        this._fsm.register(EDiamondStatus.Fly, { enter: this.diamond_fly.bind(this), update: this.diamond_flyUpdate.bind(this) })
        this._fsm.register(EDiamondStatus.Inspect, { enter: this.diamond_inspect.bind(this), update: this.diamond_inspectUpdate.bind(this) })
        this._fsm.register(EDiamondStatus.Drop, { enter: this.diamond_drop.bind(this), update: this.diamond_dropUpdate.bind(this) })
        return this._obj
    }

    public getID() {
        return this._id
    }

    //闲置
    private diamond_idle() {

    }
    private diamond_idleUpdate(dt: number, eslapsed: number) {

    }

    public changeState(state: EDiamondStatus, ...data: any) {
        this._fsm.switch(state, ...data)
    }

    /**获取当前状态 */
    public getCurState(): EDiamondStatus {
        return this._fsm.getStateInfo().state
    }

    public update(dt: number) {
        this._fsm.update(dt)
    }


    public getDiamondObj() {
        return this._obj
    }


    public setInstancePos(vec: mw.Vector) {
        this._obj.worldTransform.position = vec
    }

    //设置目标的位置
    public setTarget(vec: mw.Vector | mw.Character) {
        this._target = vec
    }


    //监视
    private diamond_inspect() {

    }
    private diamond_inspectUpdate(dt: number, eslapsed: number) {
        const player = Player.localPlayer
        if (player) {
            let playerVec = player.character.worldTransform.position
            if (mw.Vector.squaredDistance(playerVec, this._obj.worldTransform.position) <= 200 * 200) {
                this.setTarget(player.character)
                this.changeState(EDiamondStatus.Jump)
            }
        }
    }

    private _jumpHeight: number
    private _speed: number = 10
    //跳跃
    private diamond_jump() {

        this._jumpHeight = this._obj.worldTransform.position.z + 60
    }
    private diamond_jumpUpdate(dt: number, eslapsed: number) {

        if (this._obj.worldTransform.position.z < this._jumpHeight) {
            let tmpZ = this._obj.worldTransform.position.z + dt + this._speed
            this._obj.worldTransform.position = new mw.Vector(this._obj.worldTransform.position.x, this._obj.worldTransform.position.y,
                tmpZ)
        }
        else {
            SoundHelper.instance().play(1026)
            this.changeState(EDiamondStatus.Fly)
        }
    }

    //飞行
    private diamond_fly() {

    }
    private diamond_flyUpdate(dt: number, eslapsed: number) {
        let target: mw.Vector
        if (PlayerManagerExtesion.isCharacter(this._target)) {
            target = (this._target as mw.Character).worldTransform.position
        }
        else if (this._target instanceof mw.Vector) {
            target = this._target as mw.Vector

        }
        if (mw.Vector.squaredDistance(target, this._obj.worldTransform.position) > 50 * 50) {
            let delta = mw.Vector.lerp(this._obj.worldTransform.position, target, dt * 5)
            let targetRot = this._obj.worldTransform.rotation.clone().add(new mw.Rotation(0, 0, 30))
            this._obj.worldTransform.position = delta
            this._obj.worldTransform.rotation = mw.Rotation.lerp(this._obj.worldTransform.rotation, targetRot, dt * 20)
        }
        else {
            if (this.callBack) {
                this.callBack()
                this.callBack = null
            }
        }
    }


    private _bumpRot: mw.Rotation = null
    private _bumpPos: mw.Vector
    private _droppedPos: mw.Vector
    private _startDrop: boolean = true
    private _startBump: boolean = true
    //掉落
    private diamond_drop() {
        let pos = this._obj.worldTransform.position
        this._droppedPos = new mw.Vector(pos.x, pos.y, pos.z - 80)
    }

    private diamond_dropUpdate(dt: number, eslapsed: number) {
        let pos = this._obj.worldTransform.position
        if (this._startDrop) {
            if (Math.abs(pos.z - this._droppedPos.z) <= 20) {
                this._startDrop = false
                if (!this._startBump) {
                    this.changeState(EDiamondStatus.Inspect)
                }
            } else {
                this._obj.worldTransform.position = mw.Vector.lerp(pos, this._droppedPos, dt * 5)
            }
        }
        else {
            if (this._startBump) {
                this._bumpRot = this._obj.worldTransform.rotation.clone().add(new mw.Rotation(45, 0, 0))
                this._startBump = false
                let ch: number
                const random = Utils.RangeInt(1, 11)
                if (random >= 1 && random <= 5) {
                    ch = 1
                } else {
                    ch = -1
                }
                // let bumpDir = Utils.bullet_RotateVector(this._obj.getForwardVector(), mw.Vector.up, Utils.RangeFloat(1, 9) * 10 * ch)
                // let bumpDir0 = Utils.bullet_RotateVector(bumpDir, mw.Vector.left, Utils.RangeFloat(3, 9) * 10 * 1)
                // let bumpLen = Utils.RangeFloat(80, 100)
                // this._bumpPos = this._obj.worldTransform.position.clone().add(bumpDir0.multiply(bumpLen))
                this._bumpPos = this._obj.worldTransform.position.clone()
            } else {
                if (mw.Vector.squaredDistance(pos, this._bumpPos) >= 20 * 20) {
                    this._obj.worldTransform.position = mw.Vector.lerp(pos, this._bumpPos, dt * 5)
                } else {
                    this._droppedPos = new mw.Vector(pos.x, pos.y, this._droppedPos.z)
                    this._startDrop = true
                }
            }
        }
        if (!this._startBump) {
            let rot = this._obj.worldTransform.rotation
            // this._obj.worldTransform.rotation = this._bumpRot

            this._obj.worldTransform.rotation = mw.Rotation.lerp(this._obj.worldTransform.rotation, this._bumpRot, dt * 10)

        }
    }
}


//马粪
export class HorseFatCreater {
    //实例
    private _fats: FatModel[] = []
    //计时器
    private _inteval: number = null
    //是小马的还是大马的
    private _smotype: EHorseSomatoType
    /** */
    public canDestroy: boolean = false

    private _fatMax: number = 0

    //产生粪便时间
    private _createFatTime: number
    private _time: number

    private _name: string


    private _createCallBack: (smo: EHorseSomatoType, id: number) => void = null

    constructor(private _info: IHorseInfo) {
        if (this._info.property.somatoType == EHorseSomatoType.Filly) {
            this._createFatTime = GameConfig.Global.getElement(1003).Parameter1
        }
        else if (this._info.property.somatoType == EHorseSomatoType.Mature) {
            this._createFatTime = this._info.property.defecation
        }

        this._smotype = this._info.property.somatoType
        if (this._smotype == EHorseSomatoType.Mature) {
            this._fatMax = GlobalVar.MAX_CREATEFATNUM[0]
        }
        else if (this._smotype == EHorseSomatoType.Filly) {
            this._fatMax = GlobalVar.MAX_CREATEFATNUM[1]
        }
        this._name = "Fat"
        this._time = this._createFatTime
    }

    public setInteval() {
        this._inteval = Scheduler.TimeStart(() => {
            if (this._fats.length < this._fatMax) {
                if (this._time <= 0.0) {
                    this.create()
                    this._time = this._createFatTime
                } else {
                    this._time -= 1
                }
            }
        }, 1, -1)
    }

    public delFatCreateTime() {
        let delta = GameConfig.Global.getElement(1046).Parameter1
        if (this._time - delta >= 0) {
            this._time -= delta
        }
        else {
            this._time = 0
        }
    }

    closeInteval() {
        if (this._inteval) {
            Scheduler.Cancel(this._inteval)
            this._inteval = null
        }
    }

    //生成固定的大便
    public addFixedFat(leaveTime: number) {
        let num = Math.floor(leaveTime / this._createFatTime)
        if (num > this._fatMax) {
            num = this._fatMax
        }

        for (let i = 1; i <= num; i++) {
            this.create()
        }
    }

    //设置粪便特效开关
    public setFatEff(flag: boolean) {
        this._fats.forEach(fat => {
            fat.setFatEff(flag)
        })
    }

    public getSmotype() {
        return this._smotype
    }


    public setSmotype(smo: EHorseSomatoType) {
        this._smotype = smo
        this._createFatTime = this._info.property.defecation
        if (this._smotype == EHorseSomatoType.Mature) {
            this._fatMax = GlobalVar.MAX_CREATEFATNUM[0]
        }
        else if (this._smotype == EHorseSomatoType.Filly) {
            this._fatMax = GlobalVar.MAX_CREATEFATNUM[1]
        }
        this.closeInteval()
        // this.create()
        this.setInteval()
    }


    public setVisable(flag: boolean) {
        let state: mw.PropertyStatus

        if (flag) {
            state = mw.PropertyStatus.On
            this.closeInteval()
        } else {
            state = mw.PropertyStatus.Off
            this.setInteval()
        }
        this._fats.forEach(fat => {
            fat.getFatModel().setVisibility(state)
        })
    }

    private _deltaZ: number = 10

    //产生
    private async create() {



        let obj = new FatModel(this._name, StableVar.FAT_ID++)
        let initPos = GlobalVar.STABLE_BIRTHPOS[this._info.stableIndex]
        await obj.create()
        if (ModuleService.getModule(StableModuleC).isInStable()) {
            obj.setFatEff(true)
        }
        else {
            obj.setFatEff(false)
        }

        let pos = new mw.Vector(initPos.x + Utils.RangeFloat(GlobalVar.STABLE_RANDOMVEC[0], GlobalVar.STABLE_RANDOMVEC[1]),
            initPos.y + Utils.RangeFloat(GlobalVar.STABLE_RANDOMVEC[0], GlobalVar.STABLE_RANDOMVEC[1]), initPos.z + this._deltaZ)

        if (this._smotype == EHorseSomatoType.Mature) {
            obj.setInstanceScale(new mw.Vector(1.8, 1.8, 1.8))
        }
        else {
            obj.setInstanceScale(new mw.Vector(1.2, 1.2, 1.2))
        }
        obj.setInstancePos(pos)
        obj.callBack = () => {
            this._createCallBack && this._createCallBack(this._smotype, obj.getID())
            this.destoy(obj)
        }
        obj.changeState(EFatStatus.Inspect)
        if (this._info.property.somatoType == EHorseSomatoType.Filly) {
            this._createFatTime = GameConfig.Global.getElement(1003).Parameter1 * this._fats.length;
        }
        else if (this._info.property.somatoType == EHorseSomatoType.Mature) {
            this._createFatTime = this._info.property.defecation * this._fats.length;
        }
        this._fats.push(obj)
    }

    /**
     * @description: 添加创造的初始化回调
     * @param {function} cb
     * @return {*}
     */
    public addCreateCallBack(cb: (smo: EHorseSomatoType, id: number) => void) {
        this._createCallBack = cb
    }


    public update(dt) {
        this._fats.forEach(fat => {
            fat.update(dt)
        })
    }

    private destoy(obj: FatModel) {
        let index = this._fats.indexOf(obj)
        if (this._fats[index]) {
            const model = this._fats[index].getFatModel()
            model && model.destroy()
        }
        this._fats.splice(index, 1)
    }

    public getFatNum() {
        return this._fats.length
    }


    public allDestoy() {
        this._fats.forEach(fat => {
            fat.getFatModel() && fat.getFatModel().destroy()
        })
        this._createCallBack = null
        this._fats = null
    }

}

//收益
class Earning {
    public fatList: [number, EHorseSomatoType][] = []
    public diamondList: [number, number][] = []
}

export class StableModuleC extends ModuleC<StableModuleS, null> {

    //所有马圈光圈特效
    private _allParticle: mw.Effect[] = []

    //马匹生产的马粪
    private _fatMap: Map<string, HorseFatCreater> = new Map()

    //触摸的钻石
    private _diamondMap: Map<string, DiamondModel[]> = new Map()

    //玩家收集的马粪
    private _pickFat: FatModel[] = []
    private _pickDiamond: number = 0

    private _littleFatNum: number = 0
    private _bigFatNum: number = 0
    private _diamondNum: number = 0

    private _canFatFly: boolean = false

    //粪车坐标
    private _fatCarPos: mw.Vector
    //爆金币特效
    private _coinEffect: mw.Effect

    private _isInStable: boolean = false
    //初始化大粪
    private _isInit: boolean = true


    onStart(): void {
        this.initStable()
        emitter.on(GameEvents.EVENT_SELL_FAT, (num: number) => {
            //开始飞翔
            this._canFatFly = true
            let tmpPos: mw.Vector = Player.localPlayer.character.worldTransform.position
            for (let i = 0; i < this._pickFat.length; i++) {
                let randomVec = new mw.Vector(tmpPos.x + i * 10,
                    tmpPos.y + i * 10, tmpPos.z + i * 10)
                this._pickFat[i].setInstancePos(randomVec)
                this._pickFat[i].changeState(EFatStatus.Fly)
            }
            SoundHelper.instance().play(1028)
            this._coinEffect.play();
            this._coinEffect.loopCount = 1;
        }, this)
        emitter.on(GameEvents.EVENT_HORSE_GROWUP, (info: IHorseInfo) => {
            this.horseGrowUp(info.ID)
        }, this)
    }

    //玩家是否在马厩
    public isInStable() {
        return this._isInStable
    }

    public horseGrowUp(infoID: string) {
        let fatCreate = this._fatMap.get(infoID)
        fatCreate.setSmotype(EHorseSomatoType.Mature)
    }

    //初始化马场
    public initStable() {
        ParticlePos.forEach(async pos => {
            let obj = await GameObject.asyncFindGameObjectById(pos) as mw.Effect
            obj.loopCount = 1;
            obj.stop()
            this._allParticle.push(obj)
        })
        this._coinEffect = GameObject.findGameObjectById(CommonAssets.StableRefreshCoinsEff) as mw.Effect
        this._coinEffect.loopCount = 1;
        this._coinEffect.stop()
        this._fatCarPos = GameObject.findGameObjectById(CommonAssets.FatCar).worldTransform.position
        GlobalVar.MAX_CREATEFATNUM = GameConfig.Global.getElement(1027).Parameter2
    }

    //开始创造马粪
    public fatCreateStart(info: IHorseInfo) {
        let fatCreater: HorseFatCreater = null

        if (!this._fatMap.has(info.ID)) {
            fatCreater = new HorseFatCreater(info)
            this._fatMap.set(info.ID, fatCreater)
        }
        else {
            fatCreater = this._fatMap.get(info.ID)
        }

        fatCreater.addCreateCallBack(async (smo: EHorseSomatoType, id: number) => {
            SoundHelper.instance().play(1027)

            let shitEff = GameConfig.Global.getElement(1035).Parameter1
            let shitScale = GameConfig.Global.getElement(1035).Parameter2
            GeneralManager.rpcPlayEffectOnPlayer(shitEff.toString(),
                Player.localPlayer, mw.HumanoidSlotType.Buttocks, 1, null, null,
                new mw.Vector(shitScale[0], shitScale[1], shitScale[2]))


            if (smo == EHorseSomatoType.Mature) {
                this._bigFatNum += 1
            } else {
                this._littleFatNum += 1
            }
            this.server.net_addFatEarning([id, smo])


            let fatNum = mw.StringUtil.format(GameConfig.Language.FectchFit.Value, this._bigFatNum + this._littleFatNum)
            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                uiStr: CommonAssets.FatShow3D,
                talkStr: [fatNum],
                attachTarget: Player.localPlayer.character,
                isInteval: false,
                isResident: false,
                offset: new mw.Vector(0, 0, 100)
            }
            ModuleService.getModule(WorldUIModuleC).net_addWorldUI(iWordUI)


            if (this._pickFat.length > 10) {
                return
            }

            let name = "Fat"
            let fat: FatModel = new FatModel(name, id)

            await fat.create()
            fat.setTarget(this._fatCarPos)
            if (smo == EHorseSomatoType.Mature) {
                fat.setInstanceScale(new mw.Vector(1.8, 1.8, 1.8))
            } else {
                fat.setInstanceScale(new mw.Vector(1.2, 1.2, 1.2))
            }


            fat.callBack = () => {
                fat.getFatModel() && fat.getFatModel().destroy()
                this._pickFat.splice(this._pickFat.indexOf(fat), 1)
                if (this._canFatFly == true && this._pickFat.length == this._littleFatNum + this._bigFatNum) {

                    mw.UIService.hide(RewardUI)
                }

                if (this._pickFat.length == 0) {
                    this._canFatFly = false
                    this._littleFatNum = 0
                    this._bigFatNum = 0
                    this.server.net_getFatEaring()
                }
            }
            this._pickFat.push(fat)

            // console.log("捡到几坨粪便", this._pickFat.length)
        })

        fatCreater.setInteval()

    }

    //摧毁马粪创造器
    public fatCreateDestroy(infoID: string) {
        let fatCreate = this._fatMap.get(infoID)
        if (fatCreate) {
            fatCreate.canDestroy = true
            fatCreate.closeInteval()
        }
    }

    //暂停马粪创造器
    public fatCreatePause(infoID: string) {
        let fatCreate = this._fatMap.get(infoID)
        fatCreate && fatCreate.closeInteval()

    }

    //恢复马粪创造器
    public fatCreateResume(infoID: string) {
        let fatCreate = this._fatMap.get(infoID)

        fatCreate && fatCreate.setInteval()

    }

    /**
     * 设置马粪的显隐
     * @param flag 显示
     */
    public fatCreateVisiable(flag: boolean) {
        this._fatMap.forEach(create => {
            create.setVisable(flag)
        })
    }

    //减cd
    public fatCreateDelCd(infoID: string) {
        let fatCreate = this._fatMap.get(infoID)
        fatCreate && fatCreate.delFatCreateTime()
    }

    public getBigFatNum() {
        return this._bigFatNum
    }

    public getLittleFatNum() {
        return this._littleFatNum
    }

    public async creatDiamond(infoID: string, pos: mw.Vector) {
        if (!this._diamondMap.has(infoID)) {
            this._diamondMap.set(infoID, [])
        }
        let group = this._diamondMap.get(infoID)
        let name = "Diamond"

        let diamond: DiamondModel = new DiamondModel(name, StableVar.DIAMOND_ID++)
        await diamond.create()
        group.push(diamond)

        diamond.setTarget(this._fatCarPos)
        let deltaZ: number = 100
        let initPos = pos
        const randomVec = [-50, 50]

        let tmpPos = new mw.Vector(initPos.x + Utils.RangeFloat(randomVec[0], randomVec[1]),
            initPos.y + Utils.RangeFloat(randomVec[0], randomVec[1]), initPos.z + deltaZ)

        diamond.setInstancePos(tmpPos)
        diamond.changeState(EDiamondStatus.Drop)
        this.server.net_addDamondEarning(diamond.getID())
        diamond.callBack = () => {
            diamond.getDiamondObj() && diamond.getDiamondObj().destroy()
            let recycleIndex = group.indexOf(diamond)
            group.splice(recycleIndex, 1)

            //捡到的钻石
            // let pickDiamond: DiamondModel = new DiamondModel(name, diamond.getID())
            // this._pickDiamond.push(pickDiamond)

            let diamondNum = mw.StringUtil.format(GameConfig.Language.FectchDiamond.Value, this._pickDiamond)
            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                uiStr: CommonAssets.DiamondShow3D,
                talkStr: [diamondNum],
                attachTarget: Player.localPlayer.character,
                isInteval: false,
                isResident: false,
                offset: new mw.Vector(0, 0, 50)
            }

            ModuleService.getModule(WorldUIModuleC).net_addWorldUI(iWordUI)
            this.server.net_getDiamondEaring()
        }

    }

    public destroyDiamond(infoID: string) {
        if (this._diamondMap.has(infoID)) {
            this._diamondMap.delete(infoID)
        }
    }

    public getDiamondNum() {
        return this._diamondNum
    }


    //当玩家离开场地
    public leaveStable() {
        this._isInStable = false
        this._allParticle.forEach(particle => {
            particle.stop()
        })

        if (this._fatMap.size > 0) {
            this._fatMap.forEach(create => {
                create.setFatEff(false)
            })
        }

        mw.UIService.hide(GrowUI)
        mw.UIService.hide(HorseBagUI)
    }
    //离线结算
    public outLine(time: number) {

        if (this._isInit) {
            this._isInit = false
            let passedTime = time
            if (passedTime >= 0) {
                //离线大便结算
                this._fatMap.forEach(fatCreater => {
                    fatCreater.addFixedFat(passedTime)
                })

                //离线精力恢复结算
                let bagInfo = ModuleService.getModule(BagMouduleC).getHoresInfo()
                let energyDelta = Math.floor(passedTime / GlobalVar.RECOVERY_ENERGY_TIME)
                for (let i = 0; i < bagInfo.length; i++) {
                    let info = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(bagInfo[i].stableIndex)
                    if (info.property.energy + energyDelta <= info.property.maxEnergy) {
                        info.property.energy += energyDelta
                    }
                    else {
                        info.property.energy = info.property.maxEnergy
                    }
                    ModuleService.getModule(BagMouduleC).reqModifyHorseProperty(bagInfo[i].stableIndex, info.ID, info.property)

                }

            }

        }

    }


    //当玩家进入场地
    public entarStable() {
        this._isInStable = true
        let bagInfo = ModuleService.getModule(BagMouduleC).getHoresInfo()

        this._allParticle.forEach(particle => {
            particle.stop()
        })


        if (this._fatMap.size > 0) {
            this._fatMap.forEach(create => {
                create.setFatEff(true)
            })
        }
        for (let i = 0; i < bagInfo.length; i++) {
            this._allParticle[bagInfo[i].stableIndex].play()
        }

    }

    public net_setPickDiamond(num: number) {
        this._pickDiamond = num
    }

    onUpdate(dt: number): void {
        if (this._isInStable) {
            if (this._fatMap.size > 0) {
                this._fatMap.forEach((creater, key) => {
                    if (creater.getFatNum() <= 0 && creater.canDestroy) {
                        this._fatMap.delete(key)
                    }
                    else {
                        creater.update(dt)
                    }
                })
            }

            if (this._diamondMap.size > 0) {
                this._diamondMap.forEach((group, key) => {
                    group.forEach(e => {
                        e.update(dt)
                    })
                })
            }

            if (this._pickFat.length > 0 && this._canFatFly) {
                this._pickFat.forEach(fat => {
                    fat.update(dt)
                })
            }
        }

    }
}

export class StableModuleS extends ModuleS<StableModuleC, null> {
    private _earingMap: Map<number, Earning> = new Map()

    public net_addFatEarning(fatID: [number, EHorseSomatoType]) {
        let earn: Earning
        if (!this._earingMap.has(this.currentPlayerId)) {
            earn = new Earning()
            this._earingMap.set(this.currentPlayerId, earn)
        }
        earn = this._earingMap.get(this.currentPlayerId)
        earn.fatList.push(fatID)
    }

    public net_addDamondEarning(diamondID: number) {
        let earn: Earning
        if (!this._earingMap.has(this.currentPlayerId)) {
            earn = new Earning()
            this._earingMap.set(this.currentPlayerId, earn)
        }
        earn = this._earingMap.get(this.currentPlayerId)
        const randomVec = GameConfig.Global.getElement(1045).Parameter2
        let diamondEarn = Utils.RangeInt(randomVec[0], randomVec[1] + 1)
        earn.diamondList.push([diamondID, diamondEarn])
        this.getClient(this.currentPlayerId).net_setPickDiamond(diamondEarn)
    }

    /**
     * @description:结算钻石收益 
     * @return {*}
     */
    public net_getDiamondEaring() {
        let earn = this._earingMap.get(this.currentPlayerId)
        let cost = earn.diamondList[0]
        let totalReward = earn.diamondList.length * cost[1]
        ModuleService.getModule(PlayerModuleS).addDiamond(this.currentPlayerId, totalReward)
        earn.diamondList.splice(earn.diamondList.indexOf(cost), 1)
    }

    /**
    * @description:结算金币收益 
    * @return {*}
    */
    public net_getFatEaring() {
        let earn = this._earingMap.get(this.currentPlayerId)
        let littleLen = 0
        for (const e of earn.fatList) {
            if (e[1] == EHorseSomatoType.Filly) {
                littleLen += 1
            }
        }

        let littlePrice = GameConfig.Global.getElement(1005).Parameter1 * littleLen
        let bigPrice = GameConfig.Global.getElement(1004).Parameter1 * (earn.fatList.length - littleLen)
        let totalReward = littlePrice + bigPrice
        ModuleService.getModule(PlayerModuleS).addMoney(this.currentPlayerId, totalReward)
        earn.fatList = []
    }
}

