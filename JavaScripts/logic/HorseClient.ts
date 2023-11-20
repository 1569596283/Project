import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
/*
 * @Author: pengcheng.zhang 
 * @Date: 2022-11-16 10:06:01 
 * @Last Modified by: pengcheng.zhang
 * @Last Modified time: 2023-01-06 10:24:37
 */

import { oTraceError, oTrace, oTraceWarning, LogManager, AnalyticsUtil, IFightRole, AIMachine, AIState } from "odin";
import { CommonAssets, EBuffType, ECameraMoveType, EffectScene, EHorseAnimation, EHorseState, GlobalVar, IHorseInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { RacingModuleC } from "../module/RacingModule";
import { IWordUI, WorldUIModuleC } from "../module/WorldUIModule";
import QteUI from "../ui/QteUI";
import RaceUI from "../ui/RaceUI";
import { Scheduler } from "../utils/Scheduler";
import { StateMachine } from "../utils/StateMachine";
import AccImpactC from "./buff/AccImpC";
import ConceitImpactC from "./buff/ConceitImpC";
import EarlyImpactC from "./buff/EarlyImpC";
import GiveupImpactC from "./buff/GiveupImpC";
import QTEImpC from "./buff/QTEImpC";
import ReverseImpactC from "./buff/ReverseImpC";
import SpeedImpactC from "./buff/SpeedImpC";
import SprintImpC from "./buff/SprintImpC";
import BuffImpactC from "./BuffClient";
import { EffectMgr } from "./EffectMgr";
import { HoresModelC } from "./HorseModel";
import Participant from "./Participant";

/**
 * 马皮实例
 */
export default class HorseClient {
    //马匹对象
    private _horseObject: HoresModelC

    //buff
    private _buffImpacts: BuffImpactC[] = []
    //即将要删除的buff
    private _pendingRemovebuffs: number[] = []

    //状态机
    private _fsm: StateMachine<EHorseState>

    //赛道
    private _racingWay: number

    //拥有此马的玩家
    private _owner: Participant

    //马的初始位置
    private _horsePositoin0: mw.Vector
    //马的位置
    private _horsePositoin: mw.Vector
    //马的朝向
    private _horseRotation: mw.Rotation

    //目标点
    private _targetPoint: mw.Vector
    //距离终点距离
    private _maxDistance: number = 0

    //奔跑方向
    private _runDir: mw.Vector
    //方向参数
    private _dirParam: number = 1

    //奔跑距离
    private _distance: number = 0

    //是否到达终点
    private _bReachEnd: boolean = false

    private _bVectory: boolean = false

    //赛马基础速度
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
    /** 结束比赛时间 */
    private _endTime: number = 0

    private _speedLow: number
    private _speedMedium: number
    private _speedHigh: number
    /** buff触发次数 */
    private _buffImapctNum: number = 0;

    constructor(participant: Participant) {
        this._owner = participant
        this._buffImapctNum = 0;
        this._currentSpeed = 0
        this._speedLimit = this._owner.horseInfo.property.speed
        this._accelerate = this._owner.horseInfo.property.acceleratedSpeed

        this._speedLow = this._owner.horseInfo.property.speed * GameConfig.Global.getElement(1025).Parameter2[0]
        this._speedMedium = this._owner.horseInfo.property.speed * GameConfig.Global.getElement(1025).Parameter2[1]
        this._speedHigh = this._owner.horseInfo.property.speed * GameConfig.Global.getElement(1025).Parameter2[2]

        this._fsm = new StateMachine()
        this._fsm.register(EHorseState.Idle, { enter: this.state_idle.bind(this), update: this.state_idleUpdate.bind(this) })
        this._fsm.register(EHorseState.Ready, { enter: this.state_ready.bind(this), update: this.state_readyUpdate.bind(this) })
        // this._fsm.register(EHorseState.Run, { enter: this.state_run.bind(this), update: this.state_runUpdate.bind(this) })
        this._fsm.register(EHorseState.RunLevel1, { enter: this.state_RunLevel1.bind(this), update: this.state_UpdateRunLevel1.bind(this) })
        this._fsm.register(EHorseState.RunLevel2, { enter: this.state_RunLevel2.bind(this), update: this.state_UpdateRunLevel2.bind(this) })
        this._fsm.register(EHorseState.RunLevel3, { enter: this.state_RunLevel3.bind(this), update: this.state_UpdateRunLevel3.bind(this) })
        this._fsm.register(EHorseState.Vectory, { enter: this.state_vectory.bind(this), update: this.state_vectoryUpdate.bind(this) })
        this._fsm.register(EHorseState.Award, { enter: this.state_award.bind(this), update: this.state_awardUpdate.bind(this) })
    }

    /**
     * 起跑
     * @returns 
     */
    public startRun() {
        if (this._bStartRun) { return }
        if (this._owner.uid == Player.localPlayer.playerId) {
            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                uiStr: CommonAssets.Competition_Horse3D,
                talkStr: [""],
                attachTarget: this._horseObject.instance.gameObjectId,
                isInteval: false,
                isResident: true,
                offset: new mw.Vector(0, 0, 300)
            }
            console.log();
            ModuleService.getModule(WorldUIModuleC).net_addWorldUI(iWordUI)
        }
        this._bStartRun = true
        this._currentSpeed = this._owner.horseInfo.property.startRunSpeed;
        this._speedLimit = this._owner.horseInfo.property.speed;
        this.changeState(EHorseState.RunLevel1)
    }

    /**停止跑 */
    public stopRun() {
        if (!this._bStartRun) { return }
        this._bStartRun = false
        this._currentSpeed = 0
        this._speedLimit = 0
        this.changeState(EHorseState.RunLevel1)
    }
    public isRunning() { return this._bStartRun }

    public getState() {
        return this._fsm.getStateInfo().state;
    }

    /**
     * 获取马匹信息
     * @returns 马匹信息
     */
    public getHorseInfo(): IHorseInfo {
        return this._owner.horseInfo;
    }

    //设置马匹对象
    public setHorseObject(obj: HoresModelC) {
        this._horseObject = obj
    }

    /**
     * 设置马的尺寸
     * @param scale 放大比例
     */
    public setHorseScale(scale: number = 1) {
        if (this._horseObject) {
            this._horseObject.setScale(scale)
        }
    }

    public getHorseObject() {
        return this._horseObject;
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
     * @returns 负数:被超过，0:没有变化，正数:超过别人
     */
    public beyondState() {
        return this._rankIndex < this._rankLastIndex
    }

    /**
     * 设置最大的奔跑距离
     * @param distance 
     */
    public setMaxDistance(distance: number) {
        this._maxDistance = distance
    }

    /**
     * 获取当前进度
     * @returns 当前进度
     */
    public getCurProgress(): number {
        return this._distance / this._maxDistance;
    }
    /**
      * 设置当前速度
      */
    public setCurrentSpeed(speed: number) {
        this._currentSpeed = speed
    }

    /**
     * 当前速度
     * @returns 
     */
    public getCurrentSpeed() { return this._currentSpeed }
    /**
     * 设置马的速度
     * @param limit 
     */
    public setSpeedLimit(limit: number) {
        this._speedLimit = limit
    }

    /**
     * @returns 获取赛马的速度上限
     */
    public getSpeedLimit(): number { return this._speedLimit }

    /**
     * 设置赛道
     * @param index 
     */
    public setRacingWay(index: number) {
        this._racingWay = index
    }
    public getRacingWay() {
        return this._racingWay
    }

    /**
     * 设置终点
     * @param vec 终点坐标 
     */
    public setTargetPoint(vec: mw.Vector) {
        this._targetPoint = vec
        this._runDir = this._targetPoint.clone().subtract(this._horsePositoin0).normalize()
    }

    /**
     * 准备
     */
    public ready() {
        this.changeState(EHorseState.Ready)
        this._bReachEnd = false
        this._bVectory = false
        this._distance = 0
    }

    public onUpdate(dt: number) {
        if (this._giveup) { return }

        // if (this._fsm.getStateInfo().state == EHorseState.Vectory) { return }
        this._fsm.update(dt)

        if (this._bVectory) {
            return
        }

        if (this._bStartRun) {
            this.move(dt)
        }

        for (const buff of this._buffImpacts) {
            buff.update(dt)
        }

        for (const buffId of this._pendingRemovebuffs) {
            for (let i = this._buffImpacts.length - 1; i >= 0; i--) {
                const buff = this._buffImpacts[i];
                if (buff.getConfigId() == buffId) {
                    buff.destroy()
                    this._buffImpacts.splice(i, 1)
                }
            }
        }
        this._pendingRemovebuffs.length = 0
    }

    //移动
    public move(dt: number, changeState: boolean = true) {
        let totalSpeed = this.getCurrentSpeed()
        if (this._currentSpeed < this._speedLimit) {
            this._currentSpeed += dt * this._accelerate
        } else {
            this._currentSpeed = this._speedLimit
        }

        let reached = false
        this._distance += totalSpeed * dt * this._dirParam
        if (this._distance > this._maxDistance) {
            this._distance = this._maxDistance
            reached = true
        }
        this._horsePositoin.x = this._runDir.x * this._distance + this._horsePositoin0.x
        this._horsePositoin.y = this._runDir.y * this._distance + this._horsePositoin0.y
        this._horseObject.instance.worldTransform.position = this._horsePositoin

        if (changeState && !reached) {
            if (totalSpeed <= this._speedLow) {
                this.changeState(EHorseState.RunLevel1)
            } else if (totalSpeed <= this._speedMedium) {
                this.changeState(EHorseState.RunLevel2)
            } else if (totalSpeed <= this._speedHigh) {
                this.changeState(EHorseState.RunLevel3)
            }
        }
        if (!this._bReachEnd && reached) {
            this._bReachEnd = true
            this.clearBuffs()
            EffectMgr.instance().playEffect(EffectScene.EffectFinish);
            if (this._horseObject) {
                this._horseObject.playAnimation(EHorseAnimation.Loading, 1, true)
            }
        }
    }

    /**
     * 放弃比赛
     */
    public giveup() {
        this._giveup = true

        this.clearBuffs()

        if (this._owner.uid == Player.localPlayer.playerId) {
            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                attachTarget: this._horseObject.instance.gameObjectId,
                isInteval: false,
                isResident: true,
            }
            ModuleService.getModule(WorldUIModuleC).delWorldUI(iWordUI)
        }
        if (this._horseObject) {
            let x = 1
            if (Math.random() > 0.5) {
                x = -1
            }
            this.setRotation(new mw.Rotation(this._runDir, new mw.Vector(x, 0, 0)))
            this._horseObject.playAnimation(EHorseAnimation.FollowingWalk, 1, true)
        }
    }

    public destory() {
        if (this._owner.uid == Player.localPlayer.playerId) {
            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                attachTarget: this._horseObject.instance.gameObjectId,
                isInteval: false,
                isResident: true,
            }
            ModuleService.getModule(WorldUIModuleC).delWorldUI(iWordUI)
        }
        if (this._horseObject) {
            this._horseObject.destory()
            this._horseObject = null
        }
        this.clearBuffs()
    }

    public addBuffImpact(buffIds: number[]) {
        for (let i = 0; i < buffIds.length; i++) {
            const buffId = buffIds[i];
            let buff: BuffImpactC
            let skillCfg = GameConfig.Skill.getElement(buffId)
            switch (skillCfg.Type) {
                case EBuffType.Speed:
                    buff = new SpeedImpactC(buffId, this)
                    break;
                case EBuffType.Accelerate:
                    buff = new AccImpactC(buffId, this)
                    break;
                case EBuffType.Reverse:
                    buff = new ReverseImpactC(buffId, this)
                    break;
                case EBuffType.EarlyMove:
                    buff = new EarlyImpactC(buffId, this)
                    break;
                case EBuffType.Giveup:
                    buff = new GiveupImpactC(buffId, this)
                    break;
                case EBuffType.Conceit:
                    buff = new ConceitImpactC(buffId, this)
                    break;
                case EBuffType.QTE:
                    buff = new QTEImpC(buffId, this)
                    break;
                case EBuffType.Sprint:
                    buff = new SprintImpC(buffId, this)
                    break;
                default:
                    buff = new BuffImpactC(buffId, this)
                    break;
            }
            buff.start()
            this._buffImpacts.push(buff)
            if (skillCfg.Type != EBuffType.QTE) {
                this._buffImapctNum++;
            }
        }
    }

    /**
     * 移除buff
     * @param buff 
     */
    public deleteBuffImpact(buffIds: number[]) {
        if (this._pendingRemovebuffs && buffIds) {
            this._pendingRemovebuffs.push(...buffIds)
        }
        // console.log("客户端删除buff", buffIds)
    }

    //清理buff
    public clearBuffs() {
        // this._buffImpacts.length = 0
        for (let i = this._buffImpacts.length - 1; i >= 0; i--) {
            const buff = this._buffImpacts[i];
            buff.destroy()
            this._buffImpacts.splice(i, 1)
        }
    }

    /**
    * 判断是否拥有buff
    * @param type 
    * @returns 
    */
    public getBuffByType(type: EBuffType) {
        let retbuff: BuffImpactC
        for (const buff of this._buffImpacts) {
            if (buff.getType() == type) {
                retbuff = buff
                break
            }
        }
        return retbuff
    }
    public getBuffByCfgId(id) {
        let retbuff: BuffImpactC
        for (const buff of this._buffImpacts) {
            if (buff.getConfigId() == id) {
                retbuff = buff
                break
            }
        }
        return retbuff
    }
    public getBuffImpacts() { return this._buffImpacts }

    public getBufffImpactNum() {
        return this._buffImapctNum;
    }

    public getOwner() { return this._owner }

    public isVectory() {
        return this._bVectory;
    }

    public getGiveup() {
        return this._giveup;
    }

    public setEndTime(time: number) {
        this._endTime = time;
    }

    public getEndTime() {
        return this._endTime;
    }


    /**
     * 设置马的加速速度
     * @param newSpeed 
     */
    public setAccalerate(newSpeed: number) {
        this._accelerate = newSpeed
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

    public setRunDirParam(dir: number) {
        this._dirParam = dir
        let newDir = this._runDir.clone().multiply(dir)
        this.setRotation(newDir.toRotation())
    }
    public getRunDirParam() { return this._dirParam }

    public setPosition(vec: mw.Vector) {
        this._horsePositoin0 = vec.clone()
        this._horsePositoin = vec.clone()
        this._horseObject.instance.worldTransform.position = vec.clone()
    }
    public getPosition() { return this._horsePositoin }

    public setRotation(rotation: mw.Rotation) {
        this._horseRotation = rotation.clone()
        this._horseObject.instance.worldTransform.rotation = rotation.clone()
    }
    public getRotation() { return this._horseRotation }

    /**
   * 切换状态
   * @param state 
   * @param data 
   */
    public changeState(state: EHorseState, ...data: any) {
        this._fsm.switch(state, ...data)
    }

    /****************************************************************************************************** */

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

    // /**
    //  * 奔跑
    //  */
    // private state_run() {
    //     console.log('马匹:奔跑')
    //     PlayerManagerExtesion.rpcPlayAnimation(this._horseObject, 'move1')
    // }
    // private state_runUpdate(dt: number, eslapsed: number) {

    // }

    /**
     * 动作1
     */
    private state_RunLevel1() {
        if (this._giveup) { return }
        this.playRunAnimation(1);
    }
    private state_UpdateRunLevel1(dt: number, eslapsed: number) {

    }

    /**
     * 动作2
     */
    private state_RunLevel2() {
        if (this._giveup) { return }
        this.playRunAnimation(2);
    }
    private state_UpdateRunLevel2(dt: number, eslapsed: number) {

    }

    /**
     * 动作3
     */
    private state_RunLevel3() {
        if (this._giveup) { return }
        this.playRunAnimation(3);
    }
    private state_UpdateRunLevel3(dt: number, eslapsed: number) {

    }

    private playRunAnimation(index: number) {
        if (this._horseObject) {
            this._horseObject.playAnimation(EHorseAnimation["Run" + index], 0.7, true)
        }
    }

    /**
     * 胜利
     */
    private state_vectory(rankIndex: number) {
        // if (this._bReachEnd) {
        //     EffectMgr.instance().playEffect(EffectScene.EffectFinish);
        //     if (this._horseObject) {
        //         this._horseObject.playAnimation(EHorseAnimation.Loading, 1, true)
        //     }
        // }

        if (this._owner.uid == Player.localPlayer.playerId) {
            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                attachTarget: this._horseObject.instance.gameObjectId,
                isInteval: false,
                isResident: true,
            }
            ModuleService.getModule(WorldUIModuleC).delWorldUI(iWordUI)
        }
        this.clearBuffs()
        this._bVectory = true
    }
    private state_vectoryUpdate(dt: number, eslapsed: number) {
        if (!this._bReachEnd) {
            this.move(dt, false)
        }
    }

    /**
     * 获奖
     */
    private state_award(rankIndex: number) {
        if (this._horseObject) {
            if (rankIndex == 0) {
                this._horseObject.playAnimation(EHorseAnimation.GetTop, 1, true)
            } else {
                this._horseObject.playAnimation(EHorseAnimation.GetSecondOrThird, 1, true)
            }
        }
    }
    private state_awardUpdate(dt: number, eslapsed: number) {

    }

}