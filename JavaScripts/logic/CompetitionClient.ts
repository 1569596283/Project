import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
import { ECameraMoveType, ECompetitionState, EffectScene, EHorseState, EndPointGuid, ERaceStage, ErrorCode, EWeatherType, GlobalVar, IRoute, ISettlementData, RaceWayC } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { BagMouduleC } from "../module/BagMoudule";
import { GuessModuleC } from "../module/GuessModule";
import { PlayerModuleC } from "../module/PlayerModule";
import { SyntheticModuleC } from "../module/SyntheticModule";
import { WeatherModuleC } from "../module/WeatherModule";
import BasicView from "../ui/BasicView";
import GuessUI from "../ui/GuessUI";
import InteractiveUI, { EInteractiveType } from "../ui/InteractiveUI";
import MatchCDUI from "../ui/MatchCDUI";
import MatchEndUI from "../ui/MatchEndUI";
import MatchReadyUI from "../ui/MatchReadyUI";
import PopWindowUI from "../ui/PopWindowUI";
import QteUI from "../ui/QteUI";
import RaceUI from "../ui/RaceUI";
import SettlementUI from "../ui/SettlementUI";
import Tips from "../ui/Tips";
import TouchUI from "../ui/TouchUI";
import TranslateArena from "../ui/TranslateArena";
import SoundHelper from "../utils/SoundHelper";
import { StateMachine } from "../utils/StateMachine";
import { EffectMgr } from "./EffectMgr";
import HorseClient from "./HorseClient";
import Participant from "./Participant";
import { Scheduler } from "../utils/Scheduler";
import CameraUtils from '../utils/CameraUtils';

/** 四号赛道起点（用于计算默认摄像机偏移量） */
const START_POINT_4: string = "563F56B7";
/** 摄像机依附 */
const CAMERA_POINT: string = "3433D6CC";

const RewardStageTop: string[] = [
    '56A93DBF',
    'D9C872C6',
    '3AE4F375'
]
const AwardCameraPoint = '4D58A73F';

/**
 * 比赛逻辑，单次，结束时销毁
 */
export default class CompetitionClient {
    //状态机
    private _fsm: StateMachine<ECompetitionState>
    //参赛者
    private _particleHorses: HorseClient[] = []

    //起止点
    private _routes: IRoute[] = []

    //总的赛跑路程
    private _totalDistance: number

    //排名数据
    private _loaderData: number[] = []

    /** 4号道起点 */
    private _startPoint4: mw.GameObject;
    /** 摄像机观测点 */
    private _cameraPoint: mw.GameObject;
    /** 摄像机与观测的马的理想坐标差 */
    private _subLocation: mw.Vector = mw.Vector.zero;
    /** 摄像机与观测的马的实际坐标差 */
    private _subLocationActual: mw.Vector = mw.Vector.zero;
    /** 摄像机的理想角度 */
    private _rotation: mw.Rotation = mw.Rotation.zero;
    /** 摄像机的新角度 */
    private _newRotation: mw.Rotation = mw.Rotation.zero;
    /** 摄像机的当前角度 */
    private _nowRotation: mw.Rotation = mw.Rotation.zero;
    /** 切换观测马时，需要逐渐缩小的坐标差 */
    private _changeSubLocation: mw.Vector;
    /** 切换观测马时，镜头移过去已经花费的时间 */
    private _changeTime: number = 1;
    /** 切换观测马是，镜头移动需要花费的时间 */
    private _cameraMoveTime: number = 1;
    /** 切换观测马时，镜头移动的临时变量 */
    private _changeTemVec: mw.Vector = mw.Vector.zero;

    private _lookIndex: number = 0;

    //颁奖台
    private _podiums: mw.GameObject[] = []

    //结算数据
    private _settlementData: ISettlementData[] = []

    private _awardCameraPoint: mw.GameObject;

    /** 比赛天气 */
    private _weatherEffect: number = 0;

    /** 0.3秒计时 */
    private _timer03: number = 0;

    /** 参与比赛 */
    private _participate: boolean = false;

    private _raingSound: number = 0
    private _HorseshoeSound: number = 0

    /** 完赛数量 */
    private _completeNum: number = 0;

    private _touchResults: mw.HitResult[]

    /** QTE计时 */
    private _qteTime: number = 0;
    /** QTE次数 */
    private _qteCount: number = 0;
    /** 当前特殊技能id */
    private _skillID: number = 0;

    private _moveComplete: () => boolean;

    constructor() {
        this._fsm = new StateMachine()
        this._fsm.register(ECompetitionState.None, { enter: null, update: null })
        this._fsm.register(ECompetitionState.Free, { enter: this.state_free.bind(this), update: this.state_freeUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Wait, { enter: this.state_wait.bind(this), update: this.state_waitUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Sign, { enter: this.state_sign.bind(this), update: this.state_signUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Bet, { enter: this.state_bet.bind(this), update: this.state_betUpdate.bind(this), exit: this.state_betExit.bind(this) })
        this._fsm.register(ECompetitionState.Translate, { enter: this.state_translate.bind(this), update: this.state_translateUpdate.bind(this), exit: this.state_translateExit.bind(this) })
        this._fsm.register(ECompetitionState.Ready, { enter: this.state_ready.bind(this), update: this.state_readyUpdate.bind(this), exit: this.state_readyExit.bind(this) })
        this._fsm.register(ECompetitionState.CountDown, { enter: this.state_countDown.bind(this), update: this.state_countDownUpdate.bind(this), exit: this.state_countDownExit.bind(this) })
        this._fsm.register(ECompetitionState.Running, { enter: this.state_run.bind(this), update: this.state_runUpdate.bind(this), exit: this.state_runExit.bind(this) })
        this._fsm.register(ECompetitionState.End, { enter: this.state_end.bind(this), update: this.state_endUpdate.bind(this), exit: this.state_endExit.bind(this) })
        this._fsm.register(ECompetitionState.Award, { enter: this.state_award.bind(this), update: this.state_awardUpdate.bind(this), exit: this.state_awardExite.bind(this) })
        this._fsm.register(ECompetitionState.Settlement, { enter: this.state_settlement.bind(this), update: this.state_settlementUpdate.bind(this), exit: this.state_settlementExit.bind(this) })


        for (let i = 0; i < RewardStageTop.length; i++) {
            GameObject.asyncFindGameObjectById(RewardStageTop[i]).then((top) => {
                this._podiums.push(top)
            })
        }
        GameObject.asyncFindGameObjectById(AwardCameraPoint).then((anchor) => {
            this._awardCameraPoint = anchor
        })


        InputUtil.onTouchBegin((fingerIndex: number, pos: mw.Vector2) => {
            if (this.getState() == ECompetitionState.Running) {
                this.onTouchBegan(pos)
            }
        })
        InputUtil.onTouchEnd((fingerIndex: number) => {
            this.onTouchEnd()
        })

        this.initRoutes()
    }

    //初始化赛道起点和终点
    private async initRoutes() {
        this._routes.length = 0
        console.log("初始化赛道起点和终点==>Begin")
        let endPoint = await GameObject.asyncFindGameObjectById(EndPointGuid)
        for (let i = 0; i < RaceWayC.length; ++i) {
            const point = await GameObject.asyncFindGameObjectById(RaceWayC[i].startPoint)
            const way = await GameObject.asyncFindGameObjectById(RaceWayC[i].way)
            this._routes.push({ index: i, wayObj: way, startPos: point.worldTransform.position, endPos: mw.Vector.zero })
        }

        let offset = endPoint.worldTransform.position.subtract(this._routes[0].startPos)
        for (const route of this._routes) {
            route.endPos = new mw.Vector(route.startPos.x + offset.x, route.startPos.y + offset.y, route.startPos.z)
        }
        console.log("初始化赛道起点和终点==>End", this._routes.length)
        this._totalDistance = offset.length
    }

    private onTouchBegan(pos: mw.Vector2) {
        let QTE = mw.UIService.getUI(QteUI);
        if (QTE.visible) {
            return;
        }
        let results = ScreenUtil.getGameObjectByScreenPosition(pos.x, pos.y, 10000, true, false)
        if (results.length == 0) { return }
        for (const route of this._routes) {
            for (const result of results) {
                if (result.gameObject.gameObjectId == route.wayObj.gameObjectId) {
                    this.changeFocusCamera(route.index, ECameraMoveType.None);
                    return
                }
            }
        }

        this._touchResults = results
    }
    private onTouchEnd() {

    }

    public changeState(state: ECompetitionState, ...data: any) {
        console.log("客户端状态变化", state, ...data)
        this._fsm.switch(state, ...data)
        let interactiveUI = mw.UIService.getUI(InteractiveUI);
        if (interactiveUI.visible) {
            interactiveUI.turnAgain(true);
        }
    }

    public update(dt: number) {
        this._fsm.update(dt)
    }

    public getState() {
        return this._fsm.getStateInfo().state;
    }

    public getElasped() {
        return this._fsm.getStateInfo().elasped;
    }

    public addParticipant(participant: Participant) {
        if (!participant.horseInfo.property.nickName) {
            let allNames = GameConfig.Name.getAllElement()
            const firstName = participant.horseInfo.property.firsName;
            const lastName = participant.horseInfo.property.lastName;
            participant.horseInfo.property.nickName = allNames[firstName].firstName + " " + allNames[lastName].lastName
        }
        let horse = new HorseClient(participant)
        this._particleHorses.push(horse)
        if (this._particleHorses.length > 8) {
            console.log(" 出错了！！！！！！报名的马多于8匹 ");
        }
    }

    public removeParticipant(id: number) {
        let index = 0
        for (const horse of this._particleHorses) {
            if (horse.getOwner().uid == id) {
                this._particleHorses.splice(index, 1)
                break
            }
            index++
        }
    }

    public clearParticipants() {
        this._particleHorses.forEach((horseClient) => {
            horseClient.destory()
        })
        this._particleHorses.length = 0
    }

    public getParticleHorses() {
        return this._particleHorses
    }

    public getHorseByUID(uid: number) {
        let ret: HorseClient = null
        for (const horse of this._particleHorses) {
            if (horse.getOwner().uid == uid) {
                ret = horse
                break
            }
        }
        return ret
    }
    public getHorseByRaceWay(raceWay: number) {
        let ret: HorseClient = null
        for (const horse of this._particleHorses) {
            if (horse.getRacingWay() == raceWay) {
                ret = horse
                break
            }
        }
        return ret
    }

    /**
     * 获取是否参赛
     * @returns 是否参赛
     */
    public getParticipate(): boolean {
        return this._participate;
    }

    /**
     * 获取排名数据
     * @returns 
     */
    public getLeaderData() { return this._loaderData }
    public setLeaderData() {

    }

    /**
     * 切换马的状态
     * @param state 
     * @param ownerId 
     * @param params 
     */
    public switchHorseState(state: EHorseState, ownerId: number, ...params: any) {
        const horse = this.getHorseByUID(ownerId)
        if (state == EHorseState.Vectory) {
            this.addCompleteNum();
        }
        horse.changeState(state, params)
    }

    /**
     * 切换摄像机聚焦的马
     * @param index 马的序号
     */
    public changeFocusCamera(index: number, type: ECameraMoveType = ECameraMoveType.None, complete?: () => boolean) {
        this._moveComplete = null;
        for (const [i, particle] of this._particleHorses.entries()) {
            if (particle.getRacingWay() === index) {
                this._lookIndex = i;
                this._changeTime = 0;
                let ui = mw.UIService.getUI(RaceUI);
                ui.refreshRankButton(this._lookIndex);
                let newPos = mw.Vector.zero;
                complete && (this._moveComplete = complete);
                this._nowRotation = this._cameraPoint.worldTransform.rotation;
                switch (type) {
                    case ECameraMoveType.None:
                        this._cameraMoveTime = GlobalVar.CAMREA_MOVE_TIME;
                        this._subLocationActual.set(this._subLocation);
                        this._newRotation.set(this._rotation);
                        break;
                    case ECameraMoveType.Near:
                        this._cameraMoveTime = GlobalVar.CAMREA_NEAR_TIME;
                        mw.Vector.multiply(this._subLocation, 0.5, this._subLocationActual);
                        this._newRotation.set(this._rotation);
                        break;
                    case ECameraMoveType.Far:
                        this._cameraMoveTime = GlobalVar.CAMREA_FAT_TIME;
                        this._subLocationActual.set(this._subLocation);
                        this._newRotation.set(this._rotation);
                        break;
                    case ECameraMoveType.Skill:
                        let skillCfg = GameConfig.Skill.getElement(this._skillID);
                        this._cameraMoveTime = skillCfg.CameraTime;
                        this._subLocationActual.set(skillCfg.Location);
                        this._newRotation.set((skillCfg.Rotation).toRotation());
                        break;
                    default:
                        console.log(" 摄像机切换马出现问题了 ");
                        break;
                }
                newPos = particle.getPosition().clone().add(this._subLocationActual);
                this._changeSubLocation = newPos.subtract(this._cameraPoint.worldTransform.position);
            }
        }
    }

    /**
     * 设置指定马匹的结束时间
     * @param guid 马的guid
     * @param time 结束时间
     */
    public setHorseTime(guid: number, time: number) {
        let horse = this.getHorseByUID(guid);
        horse.setEndTime(time);
    }

    /**
     * 观战
     */
    public async watchRace() {
        this._participate = true;
        this.changeCamera(this._cameraPoint);
        ModuleService.getModule(PlayerModuleC).hideAllUI()
        mw.UIService.show(RaceUI);
        let raceUI = mw.UIService.getUI(RaceUI);
        raceUI.startTime();
        raceUI.refreshRankButton(this._lookIndex);
        SoundHelper.instance().play(1007);
        let weatherType = ModuleService.getModule(WeatherModuleC).getWeatherType();
        if (weatherType == EWeatherType.Rain) {
            this._raingSound = await SoundHelper.instance().play(1012)
        }
        this._HorseshoeSound = await SoundHelper.instance().play(1016)
    }

    /**
     * 退出观战
     */
    public exitRace() {
        if (this._fsm.getStateInfo().state != ECompetitionState.Running) {
            return;
        }
        this._participate = false;
        SoundHelper.instance().stopSound(this._raingSound);
        SoundHelper.instance().stopSound(this._HorseshoeSound);
        CameraUtils.resetCamera();
        mw.UIService.hide(RaceUI);
        SoundHelper.instance().restoreBGM();
        ModuleService.getModule(PlayerModuleC).showBasicUI();
        ModuleService.getModule(BagMouduleC).entarStable()
    }

    /***************************************************私有方法*************************************************** */

    /**
     * 休赛期
     */
    private state_free() {
    }
    private state_freeUpdate(dt: number, elapsedTime: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let progress = elapsedTime / (GlobalVar.Duration_Weather_Night + GlobalVar.Duration_Weather_Morning) * 0.2 + 0.6;

            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.Wait, progress);
        }
    }

    /**
    * 等待
    */
    private state_wait() {
    }
    private state_waitUpdate(dt: number, elapsedTime: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let progress = elapsedTime / GlobalVar.Duration_Competition_Interval * 0.2 + 0.8;

            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.Wait, progress);
        }
    }

    /**
     * 报名
     */
    private state_sign() {
        let basicUI = mw.UIService.getUI(BasicView);
        basicUI.showRaceProgress();
        Tips.showTips(GameConfig.Language[ErrorCode[1012]].Value);
        this.clearParticipants();
    }

    private state_signUpdate(dt: number, elapsedTime: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let time = GlobalVar.Duration_Competition_SignUp - elapsedTime;
            let progress = elapsedTime / GlobalVar.Duration_Competition_SignUp;
            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.SignUp, progress, time);
        }
    }

    /**
     * 下注
     */
    private state_bet() {
        Tips.showTips(GameConfig.Language[ErrorCode[1013]].Value)

        let i = 0;
        this.createHorse(i);
        // let interval = setInterval(() => {
        //     if (i >= this._particleHorses.length) {
        //         clearInterval(interval);
        //         return;
        //     }
        //     i++;
        // }, 125)
    }
    /**
     * 创建马匹
     * @param index 马的序号
     */
    private async createHorse(index: number) {
        const horse = this._particleHorses[index];
        const horseObj = await ModuleService.getModule(SyntheticModuleC).createHorse(horse.getOwner().horseInfo, true);
        horse.setHorseObject(horseObj);
        Scheduler.TickStart(() => {
            index < this._particleHorses.length - 1 && this.createHorse(index + 1);
        })
    }
    private state_betUpdate(dt: number, elapsedTime: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let time = GlobalVar.Duration_Competition_Bet - elapsedTime;
            let progress = elapsedTime / GlobalVar.Duration_Competition_Bet;
            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.Guess, progress, time);
        }
    }
    private state_betExit() {
        this._participate = false;
        let guess = ModuleService.getModule(GuessModuleC).getPlayaerBet();
        let horses = this._particleHorses;
        if (guess.length > 0) {
            this._participate = true;
        } else {
            let playerID = Player.localPlayer.playerId
            for (const horse of horses) {
                if (horse.getOwner().uid == playerID) {
                    this._participate = true;
                    break;
                }
            }
        }
        mw.UIService.hide(GuessUI);
    }

    /**
      * 传送阶段
      */
    private state_translate() {
        if (this._participate) {
            SoundHelper.instance().play(1045);
            ModuleService.getModule(PlayerModuleC).hideAllUI();
            this._participate && mw.UIService.show(TranslateArena);
        }
    }
    private state_translateUpdate(dt: number, elapsedTime: number) { }
    private state_translateExit() { mw.UIService.hide(TranslateArena) }

    /**
     * 准备阶段
     */
    private async state_ready(ways: number[]) {
        if (!this._cameraPoint) {
            this._cameraPoint = GameObject.findGameObjectById(CAMERA_POINT);
            this._startPoint4 = GameObject.findGameObjectById(START_POINT_4);
            this._subLocation = this._cameraPoint.worldTransform.position.clone().subtract(this._startPoint4.worldTransform.position);
            this._rotation.set(this._cameraPoint.worldTransform.rotation);
        }
        this._completeNum = 0;
        this._lookIndex = 0;
        const globalCfg = GameConfig.Global.getElement(1030);
        if (this._weatherEffect) {
            EffectService.stop(this._weatherEffect);
            this._weatherEffect = 0;
        }
        console.log("比赛信息", this._particleHorses.length, this._routes.length, ways)

        for (let i = 0; i < this._particleHorses.length; ++i) {
            let wayIndex = ways[i]
            const route = this._routes[wayIndex]
            const dir = route.endPos.clone().subtract(route.startPos)
            const horse = this._particleHorses[i]
            horse.setHorseScale(globalCfg.Parameter1);
            horse.setPosition(route.startPos)
            horse.setRotation(dir.toRotation())
            horse.setRacingWay(wayIndex)
            horse.setTargetPoint(route.endPos)
            if (Player.localPlayer && horse.getOwner().uid === Player.localPlayer.playerId) {
                mw.UIService.show(MatchReadyUI);
                this._lookIndex = i;
                this._cameraPoint.worldTransform.position = horse.getPosition().clone().add(this._subLocation);
            }
        }
        this._cameraPoint.worldTransform.rotation = this._rotation;
        if (!this._lookIndex) {
            this._cameraPoint.worldTransform.position = this._particleHorses[0].getPosition().clone().add(this._subLocation);
        }
        this.changeCamera(this._cameraPoint);
    }
    private state_readyUpdate(dt: number, elapsedTime: number) { }
    private state_readyExit() { mw.UIService.hide(MatchReadyUI) }

    /**
     * 倒计时阶段
     */
    private async state_countDown(guids: string[]) {
        if (this._participate) {
            SoundHelper.instance().play(1017)
            mw.UIService.show(RaceUI);
            mw.UIService.show(MatchCDUI)
        }

        let weather = ModuleService.getModule(WeatherModuleC).getWeatherType();
        let weatherCfg = GameConfig.Weather.findElement("Type", weather);
        let raceUI = mw.UIService.getUI(RaceUI);
        raceUI.showWeather();
        raceUI.refreshRankButton(this._lookIndex);
        if (weatherCfg && weatherCfg.Effect) {
            let offset = weatherCfg.Offset;
            let rotation = weatherCfg.Rotation.toRotation();
            let scale = weatherCfg.Scale;
            this._weatherEffect = GeneralManager.rpcPlayEffectOnGameObject(weatherCfg.Effect, this._cameraPoint, 0, offset, rotation, scale);
        }

        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.setMaxDistance(this._totalDistance)
        }
        let weatherType = ModuleService.getModule(WeatherModuleC).getWeatherType()
        if (weatherType == EWeatherType.Rain) {
            this._raingSound = await this.playRaceSound(1012);
        }
    }
    private state_countDownUpdate(dt: number, eslapsed: number) {
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.onUpdate(dt)
            // let buff = horse.getBuffByType(EBuffType.EarlyMove)
            // if (buff) {
            //     let skillCfg = buff.getConfig()
            //     if (!horse.isRunning() && eslapsed > GlobalVar.Duration_Competition_CountDown + 1 - skillCfg.Impact) {
            //         horse.startRun()
            //     }
            // }
        }
    }
    private state_countDownExit() {
        mw.UIService.hide(MatchCDUI)


    }

    //比赛阶段
    private async state_run() {
        console.log("比赛阶段")

        this._qteTime = 0;
        this._qteCount = 0;

        mw.UIService.getUI(RaceUI).startTime();
        this._changeTime = 999;
        this._subLocationActual.set(this._subLocation);

        if (this._participate) {
            this._HorseshoeSound = await this.playRaceSound(1016);
        }

        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.startRun()
        }
    }

    private state_runUpdate(dt: number, elapsedTime: number) {
        this.horseMove(dt)
        this.QTE(dt);
        /** 比赛进度 */
        this._timer03 += dt;
        this.refreshRaceProgress();
    }

    // 马和镜头的移动
    private horseMove(dt: number) {
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.onUpdate(dt)
            if (this._lookIndex == i) {
                this._changeTime += dt;
                if (this._changeTime < this._cameraMoveTime) {
                    let progress = this._changeTime / this._cameraMoveTime;
                    this._changeTemVec = mw.Vector.lerp(this._changeSubLocation, mw.Vector.zero, progress);
                    this._cameraPoint.worldTransform.position = horse.getPosition().clone().add(this._subLocationActual).subtract(this._changeTemVec);
                    if (this._nowRotation != this._newRotation) {
                        this._cameraPoint.worldTransform.rotation = mw.Rotation.lerp(this._nowRotation, this._newRotation, progress);
                    }
                } else {
                    if (this._moveComplete) {
                        this._moveComplete() && (this._moveComplete = null);
                    }
                    this._cameraPoint.worldTransform.position = horse.getPosition().clone().add(this._subLocationActual);
                }
            }
        }
    }

    private QTE(dt: number) {
        if (this._qteCount < GlobalVar.QTE_CONDITIONS.length) {
            this._qteTime += dt;
            if (this._qteTime >= GlobalVar.QTE_CONDITIONS[this._qteCount]) {
                this._qteCount++;
                for (let i = 0; i < this._particleHorses.length; ++i) {
                    const horse = this._particleHorses[i]
                    if (horse.getOwner().uid == Player.localPlayer.playerId) {
                        this.startCloseUP(i);
                    }
                }
            }
        }
    }

    private refreshRaceProgress() {
        if (this._timer03 >= 0.3) {
            let basicView = mw.UIService.getUI(BasicView);
            if (!basicView.visible) {
                return;
            }
            this._timer03 -= 0.3;
            let progress = 0;
            let length = this._particleHorses.length;
            for (let i = 0; i < length; ++i) {
                const horse = this._particleHorses[i];
                if (horse.getState() == EHorseState.Vectory || horse.getGiveup()) {
                    progress += 1;
                } else {
                    progress += horse.getCurProgress();
                }
            }
            progress /= length;
            basicView.refreshRaceProgress(ERaceStage.Race, progress);
        }
    }

    private state_runExit() {
        let qte = mw.UIService.getUI(QteUI);
        if (qte.visible) {
            mw.UIService.hide(QteUI);
        }
    }

    /**
     * 比赛结束
     */
    private async state_end() {
        SoundHelper.instance().stopSound(this._HorseshoeSound)
        let weather = ModuleService.getModule(WeatherModuleC).getWeatherType();
        if (weather == EWeatherType.Rain) {
            SoundHelper.instance().stopSound(this._raingSound)
        }
        mw.UIService.hide(RaceUI);
        this._participate && mw.UIService.show(MatchEndUI);
        EffectMgr.instance().stopEfeect(EffectScene.EffectFinish);

    }
    private state_endUpdate(dt: number, eslapsed: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let progress = eslapsed / GlobalVar.Duration_Competition_End * 0.2;

            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.Wait, progress);
        }
    }
    private state_endExit() {
        mw.UIService.hide(MatchEndUI)
    }

    /**
    * 颁奖
    */
    private state_award(data: ISettlementData[]) {
        this._settlementData = data
        for (let i = 0; i < 3; i++) {
            const element = data[i];
            if (!element.giveup) {
                const horse = this.getHorseByUID(element.ownerId)
                const model = horse.getHorseObject()
                model.attachTo(this._podiums[i])
                horse.changeState(EHorseState.Award, i)
            }
        }
        this.changeCamera(this._awardCameraPoint);
        if (this._participate) {
            SoundHelper.instance().play(1011, true);
        }

        let allBuffNum = 0;
        this._particleHorses.forEach((horse: HorseClient) => {
            allBuffNum += horse.getBufffImpactNum();
        })
        EffectMgr.instance().playEffect(EffectScene.EffectAward);
    }
    private state_awardUpdate(dt: number, eslapsed: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let progress = eslapsed / GlobalVar.Duration_Competition_Award * 0.2 + 0.2;

            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.Wait, progress);
        }
    }
    private state_awardExite() {
        if (this._participate) {
            CameraUtils.resetCamera();
        }
        ModuleService.getModule(GuessModuleC).result(this._settlementData[0].index);
        SoundHelper.instance().restoreBGM();
    }


    /**
     * 结算阶段
     */
    private state_settlement() {
        console.log("结算阶段")
        let playerID = Player.localPlayer.playerId
        this._participate && mw.UIService.show(SettlementUI, this._settlementData)
        EffectMgr.instance().stopEfeect(EffectScene.EffectAward);
    }
    private state_settlementUpdate(dt: number, elapsedTime: number) {
        this._timer03 += dt;
        if (this._timer03 >= 0.3) {
            this._timer03 -= 0.3;
            let progress = elapsedTime / GlobalVar.Duration_Competition_Settle * 0.2 + 0.4;

            let basicView = mw.UIService.getUI(BasicView);
            basicView.refreshRaceProgress(ERaceStage.Wait, progress);
        }
    }
    private state_settlementExit() {
        this.clearParticipants();
        this._settlementData.length = 0
    }

    private async playRaceSound(id: number) {
        let num = 0;
        if (this._participate) {
            num = await SoundHelper.instance().play(id)
        }
        return num;
    }

    private changeCamera(go: mw.GameObject) {
        if (this._participate) {
            CameraUtils.changeCamera(go);
        }
    }

    private addCompleteNum() {
        this._completeNum++;
        this.playRaceSound(1041);
        this.playRaceSound(1044);
        if (this._completeNum >= 8) {
            this.playRaceSound(1039);
        }
    }

    /**
     * 开始特写
     */
    public startCloseUP(index: number, skillCfgID?: number) {
        if (!this._participate) {
            return;
        }
        let horse = this._particleHorses[index];
        if (horse.getGiveup() || horse.isVectory()) {
            console.log("这个马的比赛已经结束了");
            return;
        }
        let raceUI = mw.UIService.getUI(RaceUI);
        raceUI.baseCanvas.visibility = mw.SlateVisibility.Hidden;
        let cheer: string;
        if (skillCfgID) {
            this._skillID = skillCfgID;
            cheer = GameConfig.Skill.getElement(skillCfgID).Cheer;
        } else {
            cheer = GameConfig.Language.Uiqte_cheer_tittle.Value;
        }
        mw.UIService.show(QteUI, index, cheer);
        this.changeFocusCamera(horse.getRacingWay(), ECameraMoveType.None, () => {
            let skillID = skillCfgID ? skillCfgID : 0;
            let qte = mw.UIService.getUI(QteUI);
            if (qte.visible) {
                if (skillID) {
                    let cfg = GameConfig.Skill.getElement(skillID);
                    let time = cfg.TargetDuration;
                    qte.start(time);
                    this.changeFocusCamera(horse.getRacingWay(), ECameraMoveType.Skill)
                } else {
                    if (qte.visible) {
                        this.changeFocusCamera(horse.getRacingWay(), ECameraMoveType.Near, () => {
                            qte.start()
                            return true;
                        });
                    }
                }
                return false;
            } else {
                return true;
            }

        });
    }
}