import { CommonAssets, EBuffType, EHorseState, IHorseInfo } from "../Common"
import { GameConfig } from "../config/GameConfig"
import { RacingModuleS } from "../module/RacingModule"
import { WeatherModuleS } from "../module/WeatherModule"
import { StateMachine } from "../utils/StateMachine"
import Utils from "../utils/Utils"
import AccImpactS from "./buff/AccImpS"
import BuffImpactS from "./buff/BuffImpactS"
import ConceitImpactS from "./buff/ConceitImpS"
import EarlyImpactS from "./buff/EarlyImpS"
import GiveupImpactS from "./buff/GiveupImpS"
import QTEImpS from "./buff/QTEImpS"
import ReverseImpactS from "./buff/ReverseImpS"
import SpeedImpactS from "./buff/SpeedImpS"
import SprintImpS from "./buff/SprintImpS"

import BuffServer from "./BuffServer"
import Participant from "./Participant"

/**
 * 马皮实例
 */
export default class HorseServer {
    //参赛序号
    private _matchIndex: number
    //马匹对象
    // private _horseObject: mw.GameObject

    //buff
    private _buffs: BuffServer[] = []
    //即将要删除的buff
    private _pendingRemovebuffs: number[] = []

    private _buffImpacts: BuffImpactS[] = []
    //即将要删除的buffImpact
    private _pendingRemovebuffImpacts: number[] = []

    //马的初始位置
    private _horsePositoin0: mw.Vector
    //马的位置
    private _horsePosition: mw.Vector
    //马的朝向
    private _horseRotation: mw.Rotation

    //目标点
    private _targetPoint: mw.Vector

    //奔跑方向
    private _runDir: mw.Vector
    //方向参数
    private _dirParam: number = 1

    //奔跑距离
    private _distance: number = 0

    //距离终点距离
    private _maxDistance: number = 0

    //所用时间
    private _costTime: number = 0

    //状态机
    private _fsm: StateMachine<EHorseState>

    //赛道
    private _racingWay: number

    private _bReachEnd: boolean = false

    //拥有此马的参赛者(人/AI)
    private _owner: Participant

    //赛马速度
    private _currentSpeed: number = 0
    //速度上限
    private _speedLimit: number = 0
    //赛马加速度
    private _accelerate: number = 0
    //是否放弃比赛
    private _giveup: boolean = false

    //起跑
    private _bStartRun: boolean = false

    //排名
    private _rankIndex: number = 0
    //上一次排名
    private _rankLastIndex: number = 0

    constructor(participant: Participant, index: number) {
        this._matchIndex = index
        this._owner = participant
        this._currentSpeed = 0
        this._accelerate = this._owner.horseInfo.property.acceleratedSpeed
        this._speedLimit = this._owner.horseInfo.property.speed

        this.setHorseObject()

        this._fsm = new StateMachine()
        this._fsm.register(EHorseState.Idle, { enter: this.state_idle.bind(this), update: this.state_idleUpdate.bind(this) })
        this._fsm.register(EHorseState.Ready, { enter: this.state_ready.bind(this), update: this.state_readyUpdate.bind(this) })
        // this._fsm.register(EHorseState.Run, { enter: this.state_run.bind(this), update: this.state_runUpdate.bind(this) })
        this._fsm.register(EHorseState.RunLevel1, { enter: this.state_Action1.bind(this), update: this.state_Action1Update.bind(this) })
        this._fsm.register(EHorseState.RunLevel2, { enter: this.state_Action2.bind(this), update: this.state_Action2Update.bind(this) })
        this._fsm.register(EHorseState.RunLevel3, { enter: this.state_Action3.bind(this), update: this.state_Action3Update.bind(this) })
        this._fsm.register(EHorseState.Vectory, { enter: this.state_vectory.bind(this), update: this.state_vectoryUpdate.bind(this) })
    }

    public startRun() {
        if (this._bStartRun) { return }
        if (this._bReachEnd) { return }
        if (this._giveup) { return }

        this._bStartRun = true
        this._currentSpeed = this._owner.horseInfo.property.startRunSpeed;
        ModuleService.getModule(RacingModuleS).notifyStartRun(this.getOwner().uid)
        this.changeState(EHorseState.RunLevel1)
    }

    /**停止跑 */
    public stopRun() {
        if (!this._bStartRun) { return }
        if (this._giveup) { return }
        this._bStartRun = false
        this._currentSpeed = 0
        ModuleService.getModule(RacingModuleS).notifyStopRun(this.getOwner().uid)
    }

    /**
     * 获取马匹信息
     * @returns 马匹信息
     */
    public getHorseInfo(): IHorseInfo {
        return this._owner.horseInfo;
    }

    public isRunning() { return this._bStartRun }

    public onUpdate(dt: number) {
        if (this._giveup) { return }

        if (this._bStartRun) {
            this.move(dt)
        }

        for (const buffId of this._pendingRemovebuffs) {
            for (let i = this._buffs.length - 1; i >= 0; i--) {
                if (this._buffs[i].getConfigId() == buffId) {
                    this._buffs.splice(i, 1)
                    break
                }
            }
        }
        this._pendingRemovebuffs.length = 0
        for (let i = this._buffs.length - 1; i >= 0; --i) {
            this._buffs[i].update(dt)
        }

        for (const buffId of this._pendingRemovebuffImpacts) {
            for (let i = this._buffImpacts.length - 1; i >= 0; i--) {
                let buff = this._buffImpacts[i]
                if (buff.getConfigId() == buffId && !buff.getActive()) {
                    this._buffImpacts.splice(i, 1)
                    break
                }
            }
        }
        this._pendingRemovebuffImpacts.length = 0
        for (const impact of this._buffImpacts) {
            impact.update(dt)
        }
    }

    /**
     * 初始化buff
     */
    public initbuff() {
        //天气buff
        let weatherType = ModuleService.getModule(WeatherModuleS).getWeatherType()

        //喜好附加技能
        let hobbyCfg = GameConfig.Hobby.getElement(this._owner.horseInfo.property.hobby)
        if (hobbyCfg && hobbyCfg.weather && hobbyCfg.weather.includes(weatherType)) {
            this.addBuff(hobbyCfg.skill)
        }

        //性格附加技能
        let natureCfg = GameConfig.Personalioty.getElement(this._owner.horseInfo.property.nature)
        const randNature = Utils.GetRandomNumFloor(0, natureCfg.skill.length)
        if (natureCfg.skill && natureCfg.skill[randNature]) {
            this.addBuff(natureCfg.skill[randNature])
        }
    }

    /**
     * 添加buff
     * @param buffId 
     */
    public addBuff(buffId: number) {
        let has = false
        for (const buff of this._buffs) {
            if (buff.getConfigId() == buffId) {
                has = true
                break
            }
        }
        if (has) { return }

        let buff: BuffServer = new BuffServer(buffId, this)
        this._buffs.push(buff)
        if (this._owner.uid > 0) {
            console.log("添加buff", buffId)
        }
    }
    /**
   * 删除buff
   * @param buff 
   */
    public deleteBuff(buffIds: number[]) {
        if (this._owner.uid > 0) {
            console.log("删除buff", ...buffIds)
        }
        this._pendingRemovebuffs.push(...buffIds)
    }

    public addBuffImpact(buffIds: number[]) {
        let ret = true;
        let arr: number[] = [];
        buffIds.forEach(buffId => {
            let skillCfg = GameConfig.Skill.getElement(buffId)
            const curBuff = this.getBuffImpactByType(skillCfg.Type)
            if (!skillCfg.Overlrp && curBuff) {
                //如果当前有同种类型的buff,且不可叠加就忽略
                ret = false
            } else {
                let impact: BuffImpactS
                switch (skillCfg.Type) {
                    case EBuffType.Speed:
                        impact = new SpeedImpactS(buffId, this)
                        break;
                    case EBuffType.Accelerate:
                        impact = new AccImpactS(buffId, this)
                        break;
                    case EBuffType.Reverse:
                        impact = new ReverseImpactS(buffId, this)
                        break;
                    case EBuffType.EarlyMove:
                        impact = new EarlyImpactS(buffId, this)
                        break;
                    case EBuffType.Giveup:
                        impact = new GiveupImpactS(buffId, this)
                        break;
                    case EBuffType.Conceit:
                        impact = new ConceitImpactS(buffId, this)
                        break;
                    case EBuffType.QTE:
                        impact = new QTEImpS(buffId, this)
                        break;
                    case EBuffType.Sprint:
                        impact = new SprintImpS(buffId, this)
                        break;
                    default:
                        impact = new BuffImpactS(buffId, this)
                        break;
                }
                impact.start()
                this._buffImpacts.push(impact)
                arr.push(buffId);
            }
        });
        ret && ModuleService.getModule(RacingModuleS).notifyAddBuffImpact(this._owner.uid, arr)

        return ret;
    }

    /**
     * 判断是否拥有buff
     * @param type 
     * @returns 
     */
    public getBuffImpactByType(type: EBuffType) {
        let retbuff: BuffServer
        for (const buff of this._buffImpacts) {
            if (buff.getType() == type) {
                retbuff = buff
                break
            }
        }
        return retbuff
    }

    public getBuffByCfgId(id) {
        let retbuff: BuffServer
        for (const buff of this._buffImpacts) {
            if (buff.getConfigId() == id) {
                retbuff = buff
                break
            }
        }
        return retbuff
    }

    /**
     * 删除buffImpact
     * @param buff 
     */
    public deleteBuffImpact(buffIds: number[]) {
        this._pendingRemovebuffImpacts.push(...buffIds)
        if (buffIds) {
            ModuleService.getModule(RacingModuleS).notifyRemoveBuffImpact(this._owner.uid, buffIds)
        }
    }

    public clearBuffs() {
        const buffIDs: number[] = []
        for (let i = 0; i < this._buffs.length; i++) {
            const configId = this._buffs[i].getConfigId()
            this._pendingRemovebuffs.push(configId)
            buffIDs.push(configId)
        }
        this.deleteBuff(buffIDs)

        let impactIds: number[] = []
        for (let i = 0; i < this._buffImpacts.length; i++) {
            const configId = this._buffImpacts[i].getConfigId()
            this._pendingRemovebuffs.push(configId)
            impactIds.push(configId)
        }
        this.deleteBuffImpact(impactIds)
    }

    public getBuffIds() {
        let arr: number[] = []
        this._buffs.forEach((buff) => {
            arr.push(buff.getConfigId())
        })
        return arr
    }

    //设置马匹对象
    public setHorseObject() {
    }

    /**
     * 设置排名
     * @param index 
     */
    public setRankIndex(index: number) {
        this._rankLastIndex = this._rankIndex
        this._rankIndex = index
    }
    public getRankIndex() { return this._rankIndex }
    /**
     * 是否被超过或者超过别人s
     * @returns -1:被超过，0:没有变化，1:超过别人
     */
    public beyondState() {
        if (this._rankIndex < this._rankLastIndex) {
            return - 1
        } else if (this._rankIndex > this._rankLastIndex) {
            return 1
        }
        return 0
    }

    /**
     * 设置终点
     * @param vec 终点坐标 
     */
    public setTargetPoint(vec: mw.Vector) {
        this._targetPoint = vec.clone()
        this._runDir = vec.clone().subtract(this._horsePosition).normalize()
    }

    /**
     * 设置最大的奔跑距离
     * @param distance 
     */
    public setMaxDistance(distance: number) {
        this._maxDistance = distance
    }

    /**
     * 设置跑道
     * @param wayIndex 
     */
    public setRacingWay(wayIndex: number) {
        this._racingWay = wayIndex
    }
    public getRacingWay() {
        return this._racingWay
    }

    /**
     * 准备
     */
    public ready() {
        this.changeState(EHorseState.Ready)
        this._bReachEnd = false
        this._distance = 0
    }

    /**
     * 移动
     * @param dt 
     */
    public move(dt) {
        if (this._bReachEnd) {
            return
        }
        this._costTime += dt

        if (this._currentSpeed < this._speedLimit) {
            this._currentSpeed += dt * this._accelerate
        } else {
            this._currentSpeed = this._speedLimit
        }

        this._distance += this.getTotalSpeed() * dt * this._dirParam
        this._horsePosition.x = this._runDir.x * this._distance + this._horsePositoin0.x
        this._horsePosition.y = this._runDir.y * this._distance + this._horsePositoin0.y
        // this._horseObject.worldTransform.position = this._horsePosition
        if (this._distance > this._maxDistance) {
            this.changeState(EHorseState.Vectory)
            ModuleService.getModule(RacingModuleS).recordSettlementData(this._matchIndex, this, this._costTime)
        }
    }

    /**
     * 放弃比赛
     */
    public giveup() {
        if (this._giveup) { return }

        this._giveup = true
        this.clearBuffs()
        console.log("放弃了比赛", this.getOwner().uid)
        ModuleService.getModule(RacingModuleS).notifyGiveup(this.getOwner().uid)
        ModuleService.getModule(RacingModuleS).recordSettlementData(this._matchIndex, this, this._costTime, this._giveup)
    }
    public isGiveup() { return this._giveup }

    public destory() {
        // if (this._horseObject) {
        //     this._horseObject.destroy()
        //     this._horseObject = null
        // }
        this.clearBuffs()
    }

    public getMatchIndex() { return this._matchIndex }

    /**
     * 获取花费时间
     * @returns 
     */
    public getCostTime() { return this._costTime }

    public setPosition(pos: mw.Vector) {
        this._horsePositoin0 = pos.clone()
        this._horsePosition = pos.clone()
        // this._horseObject.worldTransform.position == pos.clone()
    }
    public getPosition() { return this._horsePosition }

    public getOwner() { return this._owner }

    public setRunDirParam(dirParam: number) {
        if (this._giveup) { return }

        this._dirParam = dirParam
        ModuleService.getModule(RacingModuleS).notifyChangeRunDir(this._owner.uid, dirParam)
    }
    public getRunDir() { return this._dirParam }

    /**
     * 设置马的速度上限
     * @param limit 
     */
    public setSpeedLimit(limit: number) {
        if (this._giveup) { return }

        this._speedLimit = limit
        ModuleService.getModule(RacingModuleS).notifyHorseSpeedChange(this._owner.uid, this._currentSpeed, this._speedLimit);
    }
    /**
     * @returns 获取赛马的速度上限
     */
    public getSpeedLimit(): number { return this._speedLimit }

    /**
     * @returns 设置赛马的基础速度和速度上限
     */
    public setCurrentSpeedAndSpeedLimit(speed: number, limit: number) {
        this._currentSpeed = speed;
        this._speedLimit = limit;
        ModuleService.getModule(RacingModuleS).notifyHorseSpeedChange(this._owner.uid, this._currentSpeed, this._speedLimit);
    }
    /**
     * @returns 获取赛马的基础速度
     */
    public getCurrentSpeed(): number { return this._currentSpeed }

    /**
    * @returns 获取赛马的最大基础速度
    */
    public getMaxBaseSpeed(): number { return this._owner.horseInfo.property.speed }
    /**
     * 总速度
     * @returns 
     */
    public getTotalSpeed() { return this._currentSpeed }

    /**
     * 设置马的加速速度
     * @param newSpeed 
     */
    public setAccalerate(newSpeed: number) {
        if (this._giveup) { return }
        this._accelerate = newSpeed
        ModuleService.getModule(RacingModuleS).notifyChangeAccelerate(this._owner.uid, newSpeed)
    }
    /**
     * @returns 获取赛马的加速度
     */
    public getAccalerate(): number { return this._accelerate }

    /**
     * 获取奔跑距离
     * @returns 
     */
    public getDistance() { return this._distance }

    /**
     * 获取最大距离
     * @returns 
     */
    public getMaxDistance() { return this._maxDistance }
    /**
     * 是否抵达终点
     * @returns 
     */
    public isReached() { return this._bReachEnd }

    public getState() {
        return this._fsm.getStateInfo().state;
    }
    /**
     * 获取当前进度
     * @returns 当前进度
     */
    public getCurProgress(): number {
        return this._distance / this._maxDistance;
    }
    /**
     * 切换状态
     * @param state 
     * @param data 
     */
    public changeState(state: EHorseState, ...data: any) {
        this._fsm.switch(state, ...data)
        ModuleService.getModule(RacingModuleS).notifyHorseStateChange(state, this.getOwner().uid, ...data)
    }

    /*********************************************************************************************** */
    /**
     * 待机
     */
    private state_idle() {

    }
    private state_idleUpdate(dt: number, eslapsed: number) {

    }

    /**
     * 准备
     */
    private state_ready() {

    }
    private state_readyUpdate(dt: number, eslapsed: number) {

    }

    /**
     * 奔跑
     */
    private state_run() {

    }
    private state_runUpdate(dt: number, eslapsed: number) {

    }

    /**
     * 动作1
     */
    private state_Action1() {

    }
    private state_Action1Update(dt: number, eslapsed: number) {

    }

    /**
     * 动作2
     */
    private state_Action2() {

    }
    private state_Action2Update(dt: number, eslapsed: number) {

    }

    /**
     * 动作3
     */
    private state_Action3() {

    }
    private state_Action3Update(dt: number, eslapsed: number) {

    }

    /**
     * 胜利
     */
    private state_vectory() {
        this._bReachEnd = true
        this.clearBuffs()
    }
    private state_vectoryUpdate(dt: number, eslapsed: number) {

    }

}