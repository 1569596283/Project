import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonAssets, EHorseAnimation, EHorseSomatoType, EStableHorseState, GlobalVar, IHorseInfo } from "../Common";
import { StateMachine } from "../utils/StateMachine";
import { HoresModelC } from "./HorseModel";
import Utils from "../utils/Utils";
import { Scheduler } from "../utils/Scheduler";
import { emitter } from "../utils/Emitter";
import { GameEvents } from "../GameEvents";
import { BagMouduleC } from "../module/BagMoudule";
import { IWordUI, WorldShowUI as WorldShowUI, WorldUIModuleC } from "../module/WorldUIModule";
import GrowUI from "../ui/GrowUI";
import TouchUI from "../ui/TouchUI";


//巡逻点位
class PortalPoint {
    //是否走过
    public isWalked: boolean = false
    //位置
    public pos: mw.Vector = mw.Vector.zero
}

//跟随的马匹属性
export class IFollowingHorse {
    // public enable: boolean = false
    //记录跟随的玩家ID
    public folloPlayerID: number
    //记录跟随的玩家位置
    public followPos: mw.Vector = null
    //记录跟随的玩家旋转
    public followRot: mw.Rotation = null
    //记录马匹目标移动位置
    public targetPos: mw.Vector = null
    //纠正z坐标
    public targetPosZ: number = 80
    //跟随距离
    public offsetDistance: number = 100;
    //是否能移动
    public canMove: boolean = true
    //是否能移动
    public canRot: boolean = false
    // //拖尾
    // public trail: number = -1
}


export default class StableHorse {

    //状态机
    private _fsm: StateMachine<EStableHorseState>
    private _follow: IFollowingHorse

    //是否能够被喂养
    public canFeed: boolean = true

    private _energyTimer: number = null
    private _feedTimer: number = null

    /** 记录精力恢复时间*/
    private _recoveryEnergyTime: number = 0
    /** 记录小马进食恢复时间*/
    private _recoveryFeedTime: number = 0

    //当前巡逻位置
    private _curPortalIndex: number = 0
    private _points: PortalPoint[] = []


    //食物位置
    private _food: mw.GameObject[] = []
    //当前吃的食物索引
    private _curFood: number = 0

    private _lineCount: number = 4
    private _ownerID: number = 0

    //是否已经成长
    private _isGrowUp: boolean = false

    private _littleHorseFeedUI: WorldShowUI = null;
    private _littleHorseTalkUI: WorldShowUI = null

    /** 出生位置 */
    private _birthPos: mw.Vector;
    /**小马触发器 */
    private _intevalTrigger: mw.Trigger

    private _lastState: EStableHorseState = EStableHorseState.Idle

    public setOwnerID(pid: number) {
        this._ownerID = pid
    }

    public setFeedTimer() {
        let bagMouduleC = ModuleService.getModule(BagMouduleC)
        let curHorseInfo = this.getHorseInfo()
        let tmpStr = mw.StringUtil.format("{0}min{1}s",
            Math.floor(GlobalVar.RECOVERY_FEED_CD / 60), GlobalVar.RECOVERY_FEED_CD % 60)
        //添加喂养cd的=3dui
        let iWordUI: IWordUI = {
            playerID: Player.localPlayer.playerId,
            uiStr: CommonAssets.Feed_CD3d,
            attachTarget: this.getHorseObject().instance.gameObjectId,
            talkStr: [tmpStr],
            isInteval: true,
            isResident: false,
            offset: new mw.Vector(0, 0, 500)
        }
        if (!this._littleHorseTalkUI) {
            this._littleHorseTalkUI = ModuleService.getModule(WorldUIModuleC).getWorldUI(iWordUI)
        }

        iWordUI.isInteval = false
        iWordUI.isResident = true
        iWordUI.attachTarget = this.getHorseObject().instance
        this._littleHorseFeedUI = ModuleService.getModule(WorldUIModuleC).net_addWorldUI(iWordUI)
        if (this._littleHorseTalkUI && this._littleHorseTalkUI.getVisable()) {
            let res = this._littleHorseFeedUI.setVisable(false, () => { this._littleHorseTalkUI.setControl(false) })
        } else {
            this._littleHorseFeedUI.setVisable(true, () => { this._littleHorseTalkUI.setControl(false) })
        }

        if (this._feedTimer) {
            Scheduler.Cancel(this._feedTimer)
            this._feedTimer = null
        }

        this._feedTimer = Scheduler.TimeStart(() => {
            if (this._recoveryFeedTime <= 0) {
                this._recoveryFeedTime = GlobalVar.RECOVERY_FEED_CD
                this.canFeed = true
                this.destroyFeedCdWorldUI()

                if (this._feedTimer) {
                    Scheduler.Cancel(this._feedTimer)
                    this._feedTimer = null
                }
            } else {
                this._recoveryFeedTime -= 1
                let second: number = Math.floor(this._recoveryFeedTime % 60)
                let tmpStr = mw.StringUtil.format("{0}min{1}s", Math.floor(this._recoveryFeedTime / 60), second)
                this._littleHorseFeedUI.setTalkTex(tmpStr)

                if (bagMouduleC.getCurLookHorseStableIndex() == curHorseInfo.stableIndex && this._feedTimer) {
                    emitter.emit(GameEvents.EVENT_SHOW_RECOVERY_FEED_TIME, this._recoveryFeedTime)
                }
            }

        }, 1, -1)
    }

    public destroyFeedCdWorldUI() {
        this._littleHorseFeedUI && this._littleHorseFeedUI.destroy()
        this._littleHorseFeedUI = null
    }

    //开启精力恢复
    public setRecoverEnergyTimer() {
        let bagMouduleC = ModuleService.getModule(BagMouduleC)
        let curHorseInfo = this.getHorseInfo()

        if (this._energyTimer) {
            Scheduler.Cancel(this._energyTimer)
            this._energyTimer = null
        }

        this._energyTimer = Scheduler.TimeStart(() => {
            let info = bagMouduleC.getHoresInfoByIndex(curHorseInfo.stableIndex)
            if (info.property.energy + 1 <= info.property.maxEnergy) {
                if (this._recoveryEnergyTime <= 0) {
                    this._recoveryEnergyTime = GlobalVar.RECOVERY_ENERGY_TIME
                    info.property.energy += 1
                    curHorseInfo.property.energy = info.property.energy
                    bagMouduleC.reqModifyHorseProperty(curHorseInfo.stableIndex, info.ID, info.property)
                    this._energyTimer = null
                }
                else {
                    this._recoveryEnergyTime -= 1
                }

                if (bagMouduleC.getCurLookHorseStableIndex() == curHorseInfo.stableIndex && this._energyTimer) {
                    emitter.emit(GameEvents.EVENT_SHOW_RECOVERY_ENERGY_TIME, this._recoveryEnergyTime)
                }

            } else {
                if (this._energyTimer) {
                    Scheduler.Cancel(this._energyTimer)
                    this._energyTimer = null
                }
            }
        }, 1, -1)
    }

    public cancelRecoverEnergyTimer() {
        if (this._energyTimer) {
            Scheduler.Cancel(this._energyTimer)
            this._energyTimer = null
        }
    }

    public setFollowProperty(follow: IFollowingHorse) {
        this._follow = follow
    }

    public getFollowProperty() {
        return this._follow
    }

    /**
     * 设置出生位置
     * @param pos 出生位置
     */
    public setBirthPosition(pos: mw.Vector) {
        this._birthPos = pos;
    }

    public getBirthPosition() {
        return this._birthPos;
    }

    //设置马匹对象
    public setHorseObject(obj: HoresModelC) {
        this._horseObject = obj
    }

    /**获取当前状态 */
    public getCurState(): EStableHorseState {
        return this._fsm.getStateInfo().state
    }

    public getLastState() {
        return this._lastState
    }

    public getHorseObject() {
        return this._horseObject
    }
    //获取马匹信息
    public getHorseInfo() {
        return this._horseObject.getHorseInfo()
    }

    /**
     * 设置马匹信息
     * @param replaceInfo 
     */
    public setHorseInfo(replaceInfo: IHorseInfo) {
        this._horseObject.setHorseInfo(replaceInfo)
    }


    constructor(private _horseObject: HoresModelC) {
        this._fsm = new StateMachine()
        this._fsm.register(EStableHorseState.Idle, { enter: this.state_idle.bind(this), update: this.state_idleUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Portal, { enter: this.state_portal.bind(this), update: this.state_portalUpdate.bind(this) })
        this._fsm.register(EStableHorseState.PortalWaiting, { enter: this.state_portalWaiting.bind(this), update: this.state_portalWaitingUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Eating, { enter: this.state_eat.bind(this), update: this.state_eatUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Eated, { enter: this.state_eated.bind(this), update: this.state_eatedUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Follow, { enter: this.state_follow.bind(this), update: this.state_followUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Hide, { enter: this.state_hide.bind(this), update: this.state_hideUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Put, { enter: this.state_put.bind(this), update: this.state_putUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Free, { enter: this.state_free.bind(this), update: this.state_freeUpdate.bind(this) })
        this._fsm.register(EStableHorseState.Touch, { enter: this.state_touch.bind(this), update: this.state_touchUpdate.bind(this) })
        this._recoveryEnergyTime = GlobalVar.RECOVERY_ENERGY_TIME
        this._recoveryFeedTime = GlobalVar.RECOVERY_FEED_CD
    }
    /**
     * @description: 设置小马交互触发器
     * @return {*}
     */
    public async setTrigger() {
        this._intevalTrigger = SpawnManager.spawn({ guid: CommonAssets.Trigger }) as mw.Trigger
        this._intevalTrigger.worldTransform.scale = new mw.Vector(2, 2, 2)
        this._intevalTrigger.enabled = (false)
        this._intevalTrigger.parent = this._horseObject.instance
        this._intevalTrigger.localTransform.position = (new mw.Vector(0, 0, 100))
        this._intevalTrigger.onEnter.add((go: mw.GameObject) => {
            if (this._fsm.getStateInfo().state === EStableHorseState.Follow || !(PlayerManagerExtesion.isCharacter(go))) {
                return;
            }
            let player = Player.localPlayer;
            let playerID = player.playerId;

            if (playerID != this._ownerID || go.player.playerId != playerID) {
                return;
            }
            this.changeState(EStableHorseState.Touch)
            mw.UIService.show(TouchUI, this)
        })

        this._intevalTrigger.onLeave.add((go: mw.GameObject) => {
            if (this._fsm.getStateInfo().state === EStableHorseState.Follow || !(PlayerManagerExtesion.isCharacter(go))) {
                return;
            }
            let player = Player.localPlayer;
            let playerID = player.playerId;

            if (playerID != this._ownerID || go.player.playerId != playerID) {
                return;
            }
            this.changeState(this._lastState)
            mw.UIService.hide(GrowUI)
            mw.UIService.hide(TouchUI)
        })

    }

    public setCollsion(flag: boolean) {
        if (!flag) {
            this._intevalTrigger && (this._intevalTrigger.enabled = false)
        }
        else {
            if (this.getCurState() != EStableHorseState.Follow) {
                this._intevalTrigger && (this._intevalTrigger.enabled = true)
            }
        }
    }

    /**
     * @description: 初始化巡逻路线
     * @param {Type} centalPos
     * @return {*}
     */
    public initPortalLine(centalPos: mw.Vector) {
        this._curPortalIndex = 0
        let initPos = centalPos
        this._points = []
        for (let i = 0; i < this._lineCount; i++) {
            let point = new PortalPoint()
            point.isWalked = false
            point.pos = new mw.Vector(initPos.x + Utils.RangeFloat(GlobalVar.STABLE_RANDOMVEC[0], GlobalVar.STABLE_RANDOMVEC[1]),
                initPos.y + Utils.RangeFloat(GlobalVar.STABLE_RANDOMVEC[0], GlobalVar.STABLE_RANDOMVEC[1]), initPos.z)
            this._points.push(point)
        }
    }

    public setFood(objs: mw.GameObject[]) {
        this._food = objs
    }

    public getFood() {
        return this._food
    }

    /**
    * 切换状态
    * @param state 
    * @param data 
    */
    public changeState(state: EStableHorseState, ...data: any) {
        if (state != EStableHorseState.Touch) {
            this._lastState = state
        }
        this._fsm.switch(state, ...data)
    }


    public update(dt: number) {
        this._fsm.update(dt)
    }


    /**
     * 待机 人离开马场 
     */
    private state_idle() {
        // console.log('马匹:待机')
        this._horseObject.stopAnimation()
    }
    private state_idleUpdate(dt: number, eslapsed: number) {

    }
    //休息时长
    private _restInteval: number = 8
    //巡逻恢复时长
    private _portalResumeInteval: number = 8

    /**
    * 巡逻休息
    */
    private state_portalWaiting() {
        this._horseObject.playAnimation(EHorseAnimation.Standby, 1, true)
    }
    private state_portalWaitingUpdate(dt: number, eslapsed: number) {
        if (eslapsed >= this._portalResumeInteval) {
            this.changeState(EStableHorseState.Portal)
        }
    }

    /**
     * 巡逻
     */
    private state_portal(...data: any) {
        let tmpData: number = data as number
        if (tmpData == 1) {
            this._food.length = 0
            this._curFood = 0
            this._isGrowUp = true
            this._recoveryFeedTime = GlobalVar.RECOVERY_FEED_CD
            if (this._feedTimer) {
                Scheduler.Cancel(this._feedTimer)
                this._feedTimer = null
            }
            this.getHorseObject().instance.worldTransform.scale = mw.Vector.one
            this.destroyFeedCdWorldUI()
        }
        // console.log('马匹:巡逻')
        if (this._intevalTrigger) {
            this._intevalTrigger.enabled = (true)
        }

        if (this.getHorseInfo().property.somatoType == EHorseSomatoType.Filly) {
            this._littleHorseTalkUI && this._littleHorseTalkUI.setControl(true)
        }

        this._horseObject.playAnimation(EHorseAnimation.FollowingWalk, 1, true)
    }

    private state_portalUpdate(dt: number, eslapsed: number) {

        if (eslapsed >= this._restInteval) {
            this.changeState(EStableHorseState.PortalWaiting)
        }

        let horsePos = this._horseObject.instance.worldTransform.position
        if (mw.Vector.squaredDistance(horsePos, this._points[this._curPortalIndex].pos) >= 100) {
            let delta = mw.Vector.lerp(horsePos, this._points[this._curPortalIndex].pos, dt)
            this._horseObject.instance.worldTransform.position = delta
            this._horseObject.instance.worldTransform.rotation = (this._points[this._curPortalIndex].pos.clone().subtract(this._horseObject.instance.worldTransform.position)).toRotation()
        }
        else {
            this._points[this._curPortalIndex].isWalked = true
            if (this._curPortalIndex == this._points.length - 1) {
                this._curPortalIndex = 0
            }
            else {
                this._curPortalIndex += 1
            }
        }

    }

    /**
     * 去吃饭的移动过程
     */
    private state_eat() {
        // console.log('马匹:吃饭')
        if (this._isGrowUp) {
            this.changeState(EStableHorseState.Portal)
            this._isGrowUp = false
        }
        this._horseObject.playAnimation(EHorseAnimation.FollowingWalk, 1, true)
    }

    private state_eatUpdate(dt: number, eslapsed: number) {
        let curFood = this._food[this._curFood]
        // console.log("ffsafasfas", this._curFood, this._food.length - 1, curFood)
        if (this._curFood <= this._food.length - 1 && !curFood.worldTransform.position) {
            return
        }
        // console.log("ffF", this._horseObject.instance, this._food[this._curFood])
        if (mw.Vector.squaredDistance(this._horseObject.instance.worldTransform.position, curFood.worldTransform.position) >= 100) {
            let delta = mw.Vector.lerp(this._horseObject.instance.worldTransform.position, curFood.worldTransform.position, dt)
            this._horseObject.instance.worldTransform.position = delta
            this._horseObject.instance.worldTransform.rotation = (curFood.worldTransform.position.clone().subtract(this._horseObject.instance.worldTransform.position)).toRotation()
        }
        else {
            this.changeState(EStableHorseState.Eated)
        }
    }

    private _eatTimer: number = null
    /**吃完饭 */
    private state_eated() {
        // console.log('马匹:吃完')
        this._horseObject.playAnimation(EHorseAnimation.Eatgrass1, 1, false)
        Scheduler.TimeStart(() => {
            this._horseObject.playAnimation(EHorseAnimation.Eatgrass2, 1, true)
        }, 0.2)
    }
    private state_eatedUpdate(dt: number, eslapsed: number) {
        if (eslapsed > 2) {
            if (!this._food || this._curFood == this._food.length - 1) {
                this._food.length = 0
                this._curFood = 0
                emitter.emit(GameEvents.EVENT_HORSE_ENDEAT, this.getHorseInfo().ID)
                this.changeState(EStableHorseState.Portal)
            }
            else {
                this._food[this._curFood].setVisibility(mw.PropertyStatus.Off)
                this._curFood += 1
                this.changeState(EStableHorseState.Eating)
            }
        }
    }

    /**跟随 */
    private state_follow() {
        if (this._intevalTrigger) {
            this._intevalTrigger.enabled = (false)
        }

        if (this.getHorseInfo().property.somatoType == EHorseSomatoType.Filly) {
            this._littleHorseTalkUI && this._littleHorseTalkUI.setControl(false)
            mw.UIService.getUI(GrowUI).clearCarrot(this.getHorseInfo().ID)
        }

        this._littleHorseFeedUI && this._littleHorseFeedUI.setVisable(false, () => { this._littleHorseTalkUI.setControl(false) })

        this._horseObject.instance.setVisibility(mw.PropertyStatus.On)


        this._horseObject.playAnimation(EHorseAnimation.Loading, 1, false)


        this._horseObject.instance.worldTransform.position = new mw.Vector(this._follow.targetPos.x, this._follow.targetPos.y, this._follow.targetPos.z - this._follow.targetPosZ)
        this._horseObject.instance.worldTransform.rotation = this._follow.followRot
    }

    //跟随旋转
    private _offsetRotate: mw.Rotation = new mw.Rotation(0, 0, -90);
    //玩家移动距离超过这个值 再移动马匹
    private _recogDistance: number = 400

    private _distance: number = 0
    private state_followUpdate(dt: number, eslapsed: number) {
        if (eslapsed > 2 && this._follow) {
            let player = Player.getPlayer(this._follow.folloPlayerID)
            if (!player) {
                return
            }

            const char = player.character

            let obj = this._horseObject.instance
            if (!this._follow.canMove) {
                //距离玩家够远后再跟随
                if (this._follow.followPos && mw.Vector.squaredDistance(this._follow.followPos, char.worldTransform.position) <= this._recogDistance * this._recogDistance) {
                    return
                }
                else {
                    this._follow.followPos = char.worldTransform.position.clone()
                    this._follow.targetPos = this._follow.followPos.clone().subtract(char.worldTransform.getRightVector().multiply(this._follow.offsetDistance));
                    this._follow.targetPos = new mw.Vector(this._follow.targetPos.x, this._follow.targetPos.y, this._follow.targetPos.z - this._follow.targetPosZ)
                    this._follow.canMove = true
                }

            }
            else {

                //先旋转再跟随

                let tmpVec1 = obj.worldTransform.rotation.clone()
                let tmpVec2 = new mw.Vector(char.worldTransform.position.x, char.worldTransform.position.y, obj.worldTransform.position.z).subtract(obj.worldTransform.position).toRotation()
                if (Math.abs(tmpVec1.z - tmpVec2.z) >= 30) {
                    let detla = mw.Rotation.lerp(obj.worldTransform.rotation, tmpVec2, dt * 5)
                    obj.worldTransform.rotation = new mw.Rotation(detla.x, obj.worldTransform.rotation.y, detla.z)
                    return
                }

                this._distance = mw.Vector2.distance(
                    new mw.Vector2(this._follow.followPos.x, this._follow.followPos.y),
                    new mw.Vector2(obj.worldTransform.position.x, obj.worldTransform.position.y))
                let dalta = Math.abs(this._distance - this._follow.offsetDistance)

                if (dalta >= 50) {
                    this._horseObject.playAnimation(EHorseAnimation.FollowingWalk, 1, true)
                    if (dalta >= 1000) {
                        this._follow.followPos = char.worldTransform.position.clone()
                        this._follow.targetPos = this._follow.followPos.clone().subtract(char.worldTransform.getRightVector().multiply(this._follow.offsetDistance));
                        obj.worldTransform.position = this._horseObject.instance.worldTransform.position = new mw.Vector(this._follow.targetPos.x, this._follow.targetPos.y, this._follow.targetPos.z - this._follow.targetPosZ)
                    }
                    else {
                        obj.worldTransform.position = mw.Vector.lerp(obj.worldTransform.position, this._follow.targetPos, dt * 2);
                    }
                }
                else {
                    this._horseObject.playAnimation(EHorseAnimation.Standby, 1, true)
                    //完成了当次移动
                    this._follow.canMove = false

                    // obj.worldTransform.rotation = char.worldTransform.rotation

                }


            }
        }
    }

    /**隐藏 */
    private state_hide() {
        this._horseObject.forzen()
        this._horseObject.stopAnimation()
    }
    private state_hideUpdate(dt: number, eslapsed: number) {
    }

    /**放回马场 */
    private state_put() {
        if (this._intevalTrigger) {
            this._intevalTrigger.enabled = (true)
        }
        if (this.getHorseInfo().property.somatoType == EHorseSomatoType.Filly) {
            this._littleHorseTalkUI && this._littleHorseTalkUI.setControl(true)
        }
        this._littleHorseFeedUI && this._littleHorseFeedUI.setVisable(true, () => { this._littleHorseTalkUI.setControl(false) })

        this._horseObject.stopAnimation()
        let index = this.getHorseInfo().stableIndex
        this._horseObject.instance.worldTransform.position = GlobalVar.STABLE_BIRTHPOS[index]
    }
    private state_putUpdate(dt: number, eslapsed: number) {
    }

    /**放生 */
    private state_free() {
        mw.UIService.getUI(GrowUI).clearCarrot(this.getHorseInfo().ID)
        this.destroyFeedCdWorldUI()
    }
    private state_freeUpdate(dt: number, eslapsed: number) {
    }

    /**小马交互状态 */
    private state_touch() {

    }
    private state_touchUpdate(dt: number, eslapsed: number) {
    }
}