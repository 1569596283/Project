import { EBuffType, ECompetitionState, EHorseState, EndPointGuid, ERaceStage, ESceneType, EWeatherState, GlobalVar, IRoute, ISettlementData, StartPointS } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GMModuleS } from "../module/GMModule";
import { GuessModuleS } from "../module/GuessModule";
import { NewGuideModuleS } from "../module/GuideModule";
import { PlayerModuleC, PlayerModuleS } from "../module/PlayerModule";
import { RacingModuleS } from "../module/RacingModule";
import { SyntheticModuleS } from "../module/SyntheticModule";
import { WeatherModuleS } from "../module/WeatherModule";
import { Scheduler } from "../utils/Scheduler";
import { StateMachine } from "../utils/StateMachine";
import Utils from "../utils/Utils";
import BuffServer from "./BuffServer";
import HorseServer from "./HorseServer";
import Participant from "./Participant";


/**
 * 比赛逻辑，单次，结束时销毁
 */
export default class CompetitionServer {
    private static _aiUID: number = 0
    //状态机
    private _fsm: StateMachine<ECompetitionState>

    private _routes: IRoute[] = []

    //参赛马匹
    private _particleHorses: HorseServer[] = []

    //总的赛跑路程
    private _totalDistance: number

    //结算数据
    private _settlementData: ISettlementData[] = []

    //放弃的序号
    private _giveupData: ISettlementData[] = []

    //排名数据
    private _runningHorseRank: number[] = []
    private _leaderBoardTiming: number = 0

    //要广播赛事网络消息的玩家
    private _allPlayerIds: number[] = []

    /** 比赛时间 */
    private _competitionTime: number = 0

    /** 特殊技能CD */
    private _specialSkillCD: number = 0;
    /** 特殊技能CD */
    private _specialSkillInterval: number = 0;
    /** 进度同步计时 */
    private _progressTimer: number = 0;

    constructor() {
        this._competitionTime = GameConfig.Global.getElement(1038).Parameter1
        this._fsm = new StateMachine()
        this._fsm.register(ECompetitionState.Free, { enter: this.state_free.bind(this), update: this.state_freeUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Wait, { enter: this.state_wait.bind(this), update: this.state_waitUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Sign, { enter: this.state_sign.bind(this), update: this.state_signUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Bet, { enter: this.state_bet.bind(this), update: this.state_betUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Translate, { enter: this.state_translate.bind(this), update: this.state_translateUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Ready, { enter: this.state_ready.bind(this), update: this.state_readyUpdate.bind(this) })
        this._fsm.register(ECompetitionState.CountDown, { enter: this.state_countDown.bind(this), update: this.state_countDownUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Running, { enter: this.state_run.bind(this), update: this.state_runUpdate.bind(this) })
        this._fsm.register(ECompetitionState.End, { enter: this.state_end.bind(this), update: this.state_endUpdate.bind(this) })
        this._fsm.register(ECompetitionState.Award, { enter: this.state_award.bind(this), update: this.state_awardUpdate.bind(this), exit: this.state_awardExite.bind(this) })
        this._fsm.register(ECompetitionState.Settlement, { enter: this.state_settlement.bind(this), update: this.state_settlementUpdate.bind(this), exit: this.state_settleExit.bind(this) })

        this.initRoutes()
    }


    public update(dt: number) {
        this._fsm.update(dt)

        if (this._fsm.getStateInfo().state == ECompetitionState.Running) {
            this._leaderBoardTiming += dt
            if (this._leaderBoardTiming > 1) {
                this._leaderBoardTiming -= 1
                this.leaderRank()
            }
        }
    }

    //启动
    public launch(players: number[]) {

    }

    /**
     * 排名
     */
    public leaderRank() {
        this._runningHorseRank.sort((a, b) => {
            let aHorse = this.getHorseByUID(a)
            let bHorse = this.getHorseByUID(b)
            return bHorse.getDistance() - aHorse.getDistance()
        })

        for (let i = 0; i < this._runningHorseRank.length; ++i) {
            const horse = this.getHorseByUID(this._runningHorseRank[i])
            horse.setRankIndex(i + this._settlementData.length)
        }
        ModuleService.getModule(RacingModuleS).notifyLeaderBoardInfo(this._settlementData, this._runningHorseRank, this._giveupData)
    }

    /**
     * 切换状态
     * @param state 
     * @param notifyAll 是否通知所有玩家
     * @param data 
     */
    public changeState(state: ECompetitionState, notifyAll: boolean = false, ...data: any) {
        this._fsm.switch(state, ...data)

        ModuleService.getModule(RacingModuleS).notifyStateChange(state, notifyAll, ...data)
    }

    public getStateInfo() {
        return this._fsm.getStateInfo()
    }

    public addParticipant(participant: Participant) {
        let horse = new HorseServer(participant, this._particleHorses.length)
        this._particleHorses.push(horse)
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

        for (let i = this._allPlayerIds.length - 1; i >= 0; --i) {
            if (this._allPlayerIds[i] == id) {
                this._allPlayerIds.splice(i, 1)
                break
            }
        }
    }

    /**
     * 通过玩家ID获得玩家的马
     * @param playerID 玩家ID
     * @returns 玩家的马
     */
    public getHorseByUID(playerID: number) {
        for (let i = 0; i < this._particleHorses.length; i++) {
            let horse = this._particleHorses[i];
            if (horse.getOwner().uid == playerID) {
                return horse;
            }
        }
        return null
    }

    public clearParticipants() {
        this._particleHorses.forEach((horseServer) => {
            horseServer.destory()
        })
        this._particleHorses.length = 0
    }

    public getParticleHorses() {
        return this._particleHorses
    }

    public isSigned(playerId: number) {
        for (const horse of this._particleHorses) {
            if (horse.getOwner().uid == playerId) {
                return true
            }
        }
        return false
    }

    public startMatch() {
        this.changeState(ECompetitionState.Wait)
    }

    /**
     * 获取当前锁定的玩家
     * @returns 
     */
    public getAllPlayerIds() { return this._allPlayerIds }

    /**
     * 检查比赛是否结束
     */
    public checkCompetitonEnd() {
        let completeCounts = 0
        for (let i = 0; i < this._particleHorses.length; i++) {
            const horse = this._particleHorses[i];
            if (horse.isGiveup() || horse.isReached()) {
                completeCounts++
            }
        }
        // console.log("检查是否结束游戏", completeCounts)
        if (completeCounts >= this._particleHorses.length) {
            Scheduler.TimeStart(() => {
                this.changeState(ECompetitionState.End)
            }, 1)
        }
    }

    /***************************************************私有方法*************************************************** */
    /**
     * 休赛期
     */
    private state_free() {

    }
    private state_freeUpdate(dt: number, elapsedTime: number) {
        if (this.checkTime(dt)) {
            const progress = elapsedTime / (GlobalVar.Duration_Weather_Night + GlobalVar.Duration_Weather_Morning) * 0.2 + 0.6;
            this.noticeProgress(ERaceStage.Wait, progress);
        }

    }

    /**
    * 等待
    */
    private state_wait() {
        console.log("等待")
    }
    private state_waitUpdate(dt: number, elapsedTime: number) {
        if (this.checkTime(dt)) {
            const progress = elapsedTime / GlobalVar.Duration_Competition_Interval * 0.2 + 0.8;
            this.noticeProgress(ERaceStage.Wait, progress);
        }

        if (elapsedTime > GlobalVar.Duration_Competition_Interval) {
            this.changeState(ECompetitionState.Sign, true)
        }
    }

    /**
     * 报名
     */
    private state_sign() {
        console.log("报名")

        //开始锁定当前在游戏中的玩家，将比赛中进入游戏的玩家排除在赛事之外
        this._allPlayerIds.length = 0
        let playerIds = ModuleService.getModule(PlayerModuleS).getAllPlayers()
        playerIds.forEach((id) => {
            this._allPlayerIds.push(id)
        })
    }
    private state_signUpdate(dt: number, elapsedTime: number) {
        if (this.checkTime(dt)) {
            const progress = elapsedTime / GlobalVar.Duration_Competition_SignUp;
            this.noticeProgress(ERaceStage.SignUp, progress);
        }

        if (elapsedTime > GlobalVar.Duration_Competition_SignUp) {
            // let playerIds = ModuleService.getModule(NewGuideModuleS).getStartersOfWaittingForCompetition()
            // for (let i = 0; i < playerIds.length; i++) {
            //     if (Player.getPlayer(playerIds[i]) && !this.getHorseByUID(playerIds[i])) {
            //         ModuleService.getModule(RacingModuleS).signUp(playerIds[i])
            //         ModuleService.getModule(NewGuideModuleS).endGuide(playerIds[i], 1029)
            //     }
            // }
            this.changeState(ECompetitionState.Bet)
            // if (this._particleHorses.length > 0) {
            // } else {
            //     this.changeState(ECompetitionState.Wait)
            // }
        }
    }

    /**
     * 下注
     */
    private state_bet() {
        console.log("下注")
        this.spawnAIParticipants()
        ModuleService.getModule(GuessModuleS).opening();
    }
    private state_betUpdate(dt: number, elapsedTime: number) {

        if (this.checkTime(dt)) {
            let progress = elapsedTime / GlobalVar.Duration_Competition_Bet;
            this.noticeProgress(ERaceStage.Guess, progress);
        }

        if (elapsedTime > GlobalVar.Duration_Competition_Bet) {
            if (this._particleHorses.length > 0) {
                this.changeState(ECompetitionState.Translate)
            }
        }
    }

    /**
     * 传送阶段
     */
    private state_translate() {
        console.log("传送阶段", this._particleHorses.length)
    }
    private state_translateUpdate(dt: number, elapsedTime: number) {
        if (elapsedTime > 1.2) {
            let ways = [0, 1, 2, 3, 4, 5, 6, 7]
            //预设的跑道
            let presets: Map<number, number> = new Map()
            for (let i = 0; i < this._particleHorses.length; ++i) {
                let horse = this._particleHorses[i]
                const wayIndex = ModuleService.getModule(GMModuleS).getPresetRacingWay(horse.getOwner().uid)
                if (wayIndex != undefined && wayIndex != null) {
                    presets.set(horse.getOwner().uid, wayIndex)
                    let index = ways.indexOf(wayIndex)
                    ways.splice(index, 1)
                }
            }
            let randIndex = 0
            let randomWays = Utils.GetRandomUnRepeat(0, ways.length, ways.length)
            let routes: number[] = []
            for (let i = 0; i < this._particleHorses.length; ++i) {
                let horse = this._particleHorses[i]
                let player = Player.getPlayer(horse.getOwner().uid)
                if (player) {
                    player.character.movementEnabled = false
                }
                let index
                if (presets.has(horse.getOwner().uid)) {
                    index = presets.get(horse.getOwner().uid)
                    horse.setPosition(this._routes[index].startPos)
                    horse.setTargetPoint(this._routes[index].endPos)
                    horse.setRacingWay(index)
                } else {
                    index = randomWays[randIndex]
                    horse.setPosition(this._routes[index].startPos)
                    horse.setTargetPoint(this._routes[index].endPos)
                    horse.setRacingWay(index)
                    randIndex++
                }
                routes.push(index)
            }
            this.changeState(ECompetitionState.Ready, false, routes)
        }
    }
    /**
     * 准备阶段
     */
    private state_ready() {
        console.log("准备阶段")
        this._runningHorseRank.length = 0
        for (let i = 0; i < this._particleHorses.length; ++i) {
            let horse = this._particleHorses[i]
            horse.initbuff()
            this._runningHorseRank.push(horse.getOwner().uid)
        }
    }
    private state_readyUpdate(dt: number, elapsedTime: number) {
        if (elapsedTime > GlobalVar.Duration_Competition_Ready) {
            this.changeState(ECompetitionState.CountDown)
        }
    }

    /**
     * 倒计时阶段
     */
    private async state_countDown() {
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.ready()
            horse.setMaxDistance(this._totalDistance)
        }
    }
    private state_countDownUpdate(dt: number, eslapsed: number) {
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.onUpdate(dt)
            // let buff = horse.getBuffImpactByType(EBuffType.EarlyMove)
            // if (buff) {
            //     let skillCfg = buff.getConfig()
            //     if (!horse.isRunning() && eslapsed > GlobalVar.Duration_Competition_CountDown + 1 - skillCfg.Impact) {
            //         horse.startRun()
            //         ModuleService.getModule(RacingModuleS).notifyBrocastEvent(horse.getOwner().uid, buff.getConfigId())
            //     }
            // }
        }

        if (eslapsed > GlobalVar.Duration_Competition_CountDown) {
            this.changeState(ECompetitionState.Running)
        }
    }

    //比赛阶段
    private state_run() {
        console.log("比赛阶段")
        this._leaderBoardTiming = 0
        this._specialSkillCD = 0;
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.startRun()
        }
    }
    private state_runUpdate(dt: number, eslapsed: number) {
        this._specialSkillInterval += dt;
        if (this._specialSkillInterval > GlobalVar.SPECIAL_SKILL_INTERVAL) {
            this._specialSkillInterval -= GlobalVar.SPECIAL_SKILL_INTERVAL;
            this._specialSkillCD += GlobalVar.SPECIAL_SKILL_INTERVAL;
            if (this._specialSkillCD >= GlobalVar.SPECIAL_SKILL_CD) {
                this.specialSkill();
            }

        }
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i]
            horse.onUpdate(dt)
        }
        this.refreshRaceProgress(dt);
        if (eslapsed > this._competitionTime) {
            this.leaderRank()
            let tempArr = [].concat(this._runningHorseRank)
            for (let i = 0; i < tempArr.length; i++) {
                const horse = this.getHorseByUID(tempArr[i])
                horse.clearBuffs();
                this.recordSettlementData(horse.getMatchIndex(), horse, horse.getCostTime(), false)
            }
            this.changeState(ECompetitionState.End)
        }
    }

    private refreshRaceProgress(dt: number) {

        if (this.checkTime(dt)) {
            let progress = 0;
            let length = this._particleHorses.length;
            for (let i = 0; i < length; ++i) {
                const horse = this._particleHorses[i];
                if (horse.getState() == EHorseState.Vectory || horse.isGiveup()) {
                    progress += 1;
                } else {
                    progress += horse.getCurProgress();
                }
            }
            progress /= length;
            this.noticeProgress(ERaceStage.Race, progress);
        }

    }

    /**
     * 使用特殊技能
     */
    private specialSkill() {
        let arr: HorseServer[] = [];
        let indexArr: number[] = [];
        for (let i = 0; i < this._particleHorses.length; ++i) {
            const horse = this._particleHorses[i];
            if (!horse.isGiveup() && !horse.isReached()) {
                arr.push(horse);
                indexArr.push(i);
            }
        }
        if (arr.length == 0) { return }

        const index = Math.floor(Math.random() * arr.length);
        const horse = arr[index];
        if (!horse) { return }

        const personaliotyCfg = GameConfig.Personalioty.getElement(horse.getHorseInfo().property.nature);
        const skillIndex = Math.floor(Math.random() * personaliotyCfg.SpecialSkills.length);
        const skillID = personaliotyCfg.SpecialSkills[skillIndex]
        if (skillID) {
            let buff: BuffServer = new BuffServer(skillID, horse);
            if (buff.condition()) {
                this._specialSkillCD = 0;
                ModuleService.getModule(RacingModuleS).notifySpecialSkill(indexArr[index], skillID);
                Scheduler.TimeStart(() => {
                    buff.addImpactBuff();
                }, GlobalVar.CAMREA_MOVE_TIME + GlobalVar.CAMREA_NEAR_TIME);
            }
        }
    }

    /**
     * 比赛结束
     */
    private state_end() {
        this._runningHorseRank.length = 0
        for (let i = 0; i < this._particleHorses.length; ++i) {
            let horse = this._particleHorses[i]
            horse.clearBuffs()
        }
    }
    private state_endUpdate(dt: number, eslapsed: number) {
        if (this.checkTime(dt)) {
            let progress = eslapsed / GlobalVar.Duration_Competition_End * 0.2;
            this.noticeProgress(ERaceStage.Wait, progress);
        }

        if (eslapsed > GlobalVar.Duration_Competition_End) {
            const arr = [].concat(this._giveupData).reverse()
            let settleData = [].concat(this._settlementData, arr)
            this.changeState(ECompetitionState.Award, false, settleData)
        }
    }

    /**
     * 颁奖
     */
    private state_award() {

    }
    private state_awardUpdate(dt: number, eslapsed: number) {

        if (this.checkTime(dt)) {
            let progress = eslapsed / GlobalVar.Duration_Competition_Award * 0.2 + 0.2;
            this.noticeProgress(ERaceStage.Wait, progress);
        }

        if (eslapsed > GlobalVar.Duration_Competition_Award) {
            this.changeState(ECompetitionState.Settlement)
        }
    }
    private state_awardExite() {
        for (let i = 0; i < this._particleHorses.length; ++i) {
            let horse = this._particleHorses[i]
            let player = Player.getPlayer(horse.getOwner().uid)
            if (player) {
                player.character.movementEnabled = true
            }
        }
    }

    /**
     * 结算阶段
     */
    private state_settlement() {
        let winer = this._settlementData[0].index;
        ModuleService.getModule(GuessModuleS).settlement(winer);
        console.log("结算阶段")
    }

    private state_settlementUpdate(dt: number, elapsedTime: number) {
        if (this.checkTime(dt)) {
            let progress = elapsedTime / GlobalVar.Duration_Competition_Settle * 0.2 + 0.4;
            this.noticeProgress(ERaceStage.Wait, progress);
        }

        if (elapsedTime > GlobalVar.Duration_Competition_Settle) {
            if (ModuleService.getModule(WeatherModuleS).getDayTimeState() >= EWeatherState.Dusk) {
                this.changeState(ECompetitionState.Free, true)
            } else {
                this.changeState(ECompetitionState.Wait, true)
            }
        }
    }

    private state_settleExit() {
        this._settlementData.length = 0
        this._giveupData.length = 0
        // this._allPlayerIds.length = 0
        this.clearParticipants()
    }

    /***************************************************************************************************** */

    /**
     * 记录结算数据
     * @param name 马的名字
     * @param time 所用时间
     */
    public recordSettlementData(index: number, horse: HorseServer, time: number, giveup: boolean = false) {
        let bet = ModuleService.getModule(GuessModuleS).getHorseBetAmount(index)
        if (!bet) { bet = 0 }
        let awardTime = Math.max((70 - time), 0);
        let time_award: number;
        if (giveup) {
            //放弃的没有奖励
            let data: ISettlementData = {
                rank: 7 - this._giveupData.length,
                ownerId: horse.getOwner().uid,
                horseName: horse.getOwner().horseInfo.property.nickName,
                firstName: horse.getOwner().horseInfo.property.firsName,
                lastName: horse.getOwner().horseInfo.property.lastName,
                rewards: 0,
                time: time,
                bet: bet,
                timeAward: 0,
                index: index,
                giveup: true
            }
            horse.setRankIndex(data.rank)
            this._giveupData.push(data)
        } else {
            let globalCfg = GameConfig.Global.getElement(1019)
            let randIndex = this._settlementData.length;
            time_award = Math.floor(Math.pow(awardTime, GlobalVar.TIME_AWARD_COEFFICIENT));
            let data: ISettlementData = {
                rank: randIndex,
                ownerId: horse.getOwner().uid,
                horseName: horse.getOwner().horseInfo.property.nickName,
                firstName: horse.getOwner().horseInfo.property.firsName,
                lastName: horse.getOwner().horseInfo.property.lastName,
                rewards: globalCfg.Parameter2[globalCfg.Parameter2.length - randIndex - 1],
                time: time,
                bet: bet,
                timeAward: time_award,
                index: index,
                giveup: false
            }
            horse.setRankIndex(data.rank)
            this._settlementData.push(data)

            const player = Player.getPlayer(horse.getOwner().uid)
            if (player) {
                ModuleService.getModule(PlayerModuleS).addDiamond(horse.getOwner().uid, data.rewards + data.timeAward, true)
            }
        }

        const idx = this._runningHorseRank.indexOf(horse.getOwner().uid)
        this._runningHorseRank.splice(idx, 1)

        this.checkCompetitonEnd()
    }

    //初始化赛道起点和终点
    private async initRoutes() {
        if (this._routes.length > 0) { return }

        for (let i = 0; i < StartPointS.length; ++i) {
            let point = await GameObject.asyncFindGameObjectById(StartPointS[i].startPoint)
            // let way = await GameObject.asyncFindGameObjectById(RaceWay[i].way)
            this._routes.push({ index: i, wayObj: null, startPos: point.worldTransform.position, endPos: mw.Vector.zero })
        }

        let endPoint = await GameObject.asyncFindGameObjectById(EndPointGuid)
        let offset = endPoint.worldTransform.position.clone().subtract(this._routes[0].startPos)
        for (const route of this._routes) {
            route.endPos = route.startPos.clone().add(offset)
        }

        this._totalDistance = offset.length
    }

    /**
     * 添加AI参赛者
     */
    private spawnAIParticipants() {
        let globalCfg = GameConfig.Global.getElement(1031)
        let infos: Participant[] = []
        let differ = 8 - this._particleHorses.length
        if (globalCfg.Parameter1) {
            differ = globalCfg.Parameter1
        }
        if (differ > 0) {
            const randIndexs = Utils.GetRandomUnRepeat(1, 20, differ)
            for (let i = 0; i < differ; i++) {
                let uid = --CompetitionServer._aiUID
                // let playerName = 'AI' + Math.abs(uid)
                let playerName = GameConfig.Language['Ai_name' + randIndexs[i]].Value
                let horseInfo = ModuleService.getModule(SyntheticModuleS).getRandomHorseInfoByLineID()
                let participant = new Participant(uid, playerName, horseInfo)
                this.addParticipant(participant)
                infos.push(participant)
            }
        }
        if (infos.length > 0) {
            infos.forEach(info => {
                ModuleService.getModule(RacingModuleS).notifySpawnAIParticipant(info)
            });
        }
    }

    private noticeProgress(stage: ERaceStage, progress: number) {

        const players = Player.getAllPlayers();
        const enterPlayers = ModuleService.getModule(PlayerModuleS).getAllPlayers();
        const racingS = ModuleService.getModule(RacingModuleS);
        players.forEach(player => {
            const playerID = player.playerId
            const indexS = this._allPlayerIds.indexOf(playerID);
            const indexEnter = enterPlayers.indexOf(playerID);
            if (indexS < 0 && indexEnter >= 0) {
                racingS.notifyProgress(playerID, stage, progress);

            }
        });
    }

    private checkTime(dt: number) {
        this._progressTimer += dt;
        const enterPlayers = ModuleService.getModule(PlayerModuleS).getAllPlayers();
        const players = Player.getAllPlayers();
        if (this._progressTimer < 1 || (enterPlayers.length === players.length && players.length === this._allPlayerIds.length)) {
            return false;
        }
        this._progressTimer--;
        return true
    }
}