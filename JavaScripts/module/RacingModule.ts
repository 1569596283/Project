import { EBuffTargetType, ECompetitionState, EHorseState, RichTextElementParams, ErrorCode, IHorseInfo, ISettlementData, ECameraMoveType, GlobalVar, ETalkIndex, EHorseSomatoType, ERaceStage } from '../Common'
import { GameConfig } from '../config/GameConfig'
import { GameEvents } from '../GameEvents'
import CompetitionClient from '../logic/CompetitionClient'
import CompetitionServer from '../logic/CompetitionServer'
import HorseClient from '../logic/HorseClient'
import Participant from '../logic/Participant'
import RaceUI from '../ui/RaceUI'
import HorseDetail from '../ui/HorseDetail'
import Tips from '../ui/Tips'
import { emitter } from '../utils/Emitter'
import { PlayerModuleC, PlayerModuleS } from './PlayerModule'
import { BagMouduleC, BagMouduleS } from './BagMoudule'
import HorseServer from '../logic/HorseServer'
import SoundHelper from '../utils/SoundHelper'
import BasicView from '../ui/BasicView'
import { AnalyticsUtil } from 'odin'

export class RacingData extends Subdata {

}

export class RacingModuleC extends ModuleC<RacingModuleS, RacingData> {
    private _startPoints: mw.Vector[]

    //赛事
    private _competition: CompetitionClient

    public onStart(): void {
        this._competition = new CompetitionClient()
        this._competition.changeState(ECompetitionState.None)
    }

    public init(id: number) {
        if (id == Player.localPlayer.playerId) {

        }
    }

    public onUpdate(dt: number): void {
        if (this._competition) {
            this._competition.update(dt)
        }
    }

    public onDestroy(): void {

    }

    /**
     * 获取比赛起点
     */
    public getCompetitionStartPoint() {
        return this._startPoints
    }

    /**
     * 获取报名马匹
     * @returns 
     */
    public getParticleHorses() { return this._competition.getParticleHorses() }

    /**
     * 获取当前玩家的马匹的序号
     * @returns 
     */
    public getPlayerHorseIndex(id: number = Player.localPlayer.playerId) {
        let index = 0;
        let arr = this._competition.getParticleHorses();
        for (let i = 0; i < arr.length; i++) {
            if (id == arr[i].getOwner().uid) {
                index = i;
            }
        }
        return index;
    }

    public getPlayerHorse(id: number = Player.localPlayer.playerId) {
        return this._competition.getHorseByUID(id)
    }

    /**
     * @returns 当前赛事状态
     */
    public getCompotitionState() {
        return this._competition.getState();
    }

    /**
     * @returns 当前赛事状态持续时间
     */
    public getCompotitionElasped() {
        return this._competition.getElasped();
    }

    public getRacingWayIndex(uid: number) {
        let participant = this._competition.getHorseByUID(uid)
        if (participant) {
            return participant.getRacingWay()
        }

        return null
    }

    public getRacingWayByIndex(index: number) {
        let participant: HorseClient = this._competition.getParticleHorses()[index];
        if (participant) {
            return participant.getRacingWay()
        }

        return null
    }

    /**
     * 根据赛道获取马
     */
    public getHorseByRaceWay(raceWay: number) {
        return this._competition.getHorseByRaceWay(raceWay)
    }

    /**
     * 获取排名数据
     * @returns 
     */
    public getCompetitionLoaderData() {
        return this._competition.getLeaderData()
    }

    /**
     * 请求报名
     */
    public reqSignUp() {
        this.server.net_signUp()
    }

    public watchRace() {
        this._competition.watchRace();
    }

    public exitRace() {
        this._competition.exitRace();
    }

    /**
     * 改变摄像机跟随的马
     * @param index 马的赛道号
     */
    public changeFocusHorse(index: number, type: ECameraMoveType = ECameraMoveType.None, complete?: () => boolean) {
        complete ? this._competition.changeFocusCamera(index, type) : this._competition.changeFocusCamera(index, type, complete);
    }

    public requestAddBuffImpact(horseUID: number, buffIds: number[]) {
        this.server.net_AddBuffImpact(horseUID, buffIds);
    }

    /**
     * 请求报名返回
     * @param result 
     */
    public net_onSignUp(result: boolean, participant: Participant, errorCode: number): void {
        if (result) {
            this._competition.addParticipant(participant)
            if (participant.uid == Player.localPlayer.playerId) {
                Tips.showTips(GameConfig.Language[ErrorCode[1014]].Value)
            }
            console.log("当前报名人数", this.getParticleHorses().length)
        } else {
            Tips.showTips(errorCode)
        }
    }

    public net_onDiscard(result: boolean, id: number, errorCode: number): void {
        if (result) {
            this._competition.removeParticipant(id)

            if (id == Player.localPlayer.playerId) {
                Tips.showTips(GameConfig.Language[ErrorCode[1015]].Value)
            }
        } else {
            Tips.showTips(errorCode)
        }
    }

    /**
     * 比赛状态改变
     * @param state 
     */
    public net_competitionStateChange(state: ECompetitionState, ...params: any): void {
        this._competition.changeState(state, ...params)
        emitter.emit(GameEvents.EVENT_COMPETITION_STATE_CHANGE, state)
    }

    /**
     * 特殊技能发动
     */
    public net_specialSkill(index: number, skillCfgID: number): void {
        this._competition.startCloseUP(index, skillCfgID);
    }

    /**
     * 生成AI
     * @param infos 
     * @returns 
     */
    public net_onSpawnAI(info: Participant): void {
        if (!info) { return }

        let participant = new Participant(info.uid, info.userName, info.horseInfo)
        this._competition.addParticipant(participant)
    }

    /**
     * 切换马匹状态
     * @param state 
     * @param params 
     */
    public net_onHorseStateChange(state: EHorseState, ownerId: number, ...params: any) {
        this._competition.switchHorseState(state, ownerId, ...params)
    }

    /**
     * 起跑
     * @param uid 
     */
    public net_onHorseStartRun(uid: number) {
        let horse = this._competition.getHorseByUID(uid)
        horse.startRun()
    }
    /**
     * 停跑
     * @param uid 
     */
    public net_onHorseStopRun(uid: number) {
        let horse = this._competition.getHorseByUID(uid)
        horse.stopRun()
    }

    /**
     * 放弃比赛
     * @param uid 
     */
    public net_onGiveup(uid: number) {
        let horse = this._competition.getHorseByUID(uid)
        horse.giveup()
    }

    /**
     * 收到排行榜变化
     * @param leaderData 
     */
    public net_onLeaderBoard(settleData: ISettlementData[], leaderData: number[], giveupData: ISettlementData[]) {
        let rankList: number[] = []
        if (settleData && settleData.length > 0) {
            for (let i = 0; i < settleData.length; i++) {
                const settle = settleData[i];
                rankList.push(settle.ownerId)
            }
        }
        if (leaderData && leaderData.length > 0) {
            for (let i = 0; i < leaderData.length; i++) {
                rankList.push(leaderData[i])
            }
        }
        if (giveupData && giveupData.length > 0) {
            for (let i = giveupData.length - 1; i >= 0; i--) {
                const giveup = giveupData[i];
                rankList.push(giveup.ownerId)
            }
        }

        let raceUI = mw.UIService.getUI(RaceUI);
        raceUI.refreshRank(rankList);
        //todo
    }

    /**
     * 添加buff
     * @param uid 
     * @param buffId 
     */
    public net_onAddBuff(uid: number, buffIds: number[]) {
        let horse = this._competition.getHorseByUID(uid)
        horse.addBuffImpact(buffIds)
        emitter.emit(GameEvents.EVENT_HORSE_ADD_BUFF, uid, buffIds)
    }
    /**
     * 删除buff
     * @param uid 
     * @param buffId 
     */
    public net_onRemoveBuff(uid: number, buffIds: number[]) {
        let horse = this._competition.getHorseByUID(uid)
        horse.deleteBuffImpact(buffIds)
    }
    /*
     * 改变马的速度
     * @param playerID 马的拥有者
     * @param speed 速度
     */
    public net_HorseSpeedChange(playerID: number, currentSpeed: number, limit: number) {
        let horse = this._competition.getHorseByUID(playerID);
        horse.setCurrentSpeed(currentSpeed);
        horse.setSpeedLimit(limit);
    }
    /**
     * 加速改变
     * @param uid 
     * @param buffId 
     */
    public net_onChangeAccelerate(uid: number, acc: number) {
        let horse = this._competition.getHorseByUID(uid)
        horse.setAccalerate(acc)
    }
    /**
     * 方向改变
     * @param uid 
     * @param buffId 
     */
    public net_onChangeRunDir(uid: number, dir: number) {
        let horse = this._competition.getHorseByUID(uid)
        horse.setRunDirParam(dir)
    }

    /**
     * 事件播报
     * @param uid 
     * @param buffId 
     */
    public net_onBrocastEvent(participantId: number, skillId: number, targetIds?: number[]) {
        if (this._competition.getParticipate()) {
            SoundHelper.instance().play(1030)
        }
        const skillCfg = GameConfig.Skill.getElement(skillId)
        const behaviorCfg = GameConfig.Behavior.getElement(skillCfg.Behavior)

        const mainHorse = ModuleService.getModule(RacingModuleC).getPlayerHorse(participantId)
        const mainHorseInfo = mainHorse.getOwner().horseInfo
        const mainLineageCfg = GameConfig.Lineage.getElement(mainHorseInfo.property.lineage)
        mainHorse.getHorseObject().playBehavior(behaviorCfg.Behavior, skillCfg.TargetDuration);

        const targetHorse = ModuleService.getModule(RacingModuleC).getPlayerHorse(targetIds[0])

        let paramList: RichTextElementParams[] = []
        paramList.push({ text: mainHorse.getOwner().userName, color: new mw.LinearColor(128 / 255, 128 / 255, 128 / 255) })
        paramList.push({ text: GameConfig.Language.Brocast_1.Value })
        paramList.push({
            text: `[${mainHorseInfo.property.nickName}]`,
            color: new mw.LinearColor(mainLineageCfg.textColor[0] / 255, mainLineageCfg.textColor[1] / 255, mainLineageCfg.textColor[2] / 255),
            clickCb: () => {
                mw.UIService.show(HorseDetail, participantId)
            }
        })

        if (skillCfg.Broadcast1) {
            paramList.push({ text: GameConfig.Language[skillCfg.Broadcast1].Value })
        }
        if (behaviorCfg.Broadcast2) {
            paramList.push({ text: " " + GameConfig.Language[behaviorCfg.Broadcast2].Value, color: new mw.LinearColor(128 / 255, 0, 128 / 255), inParam: true })
        }
        if (behaviorCfg.Broadcast3) {
            paramList.push({ text: GameConfig.Language[behaviorCfg.Broadcast3].Value })
        }

        let targetStr = ''
        switch (skillCfg.Target) {
            case EBuffTargetType.None:
                break;
            case EBuffTargetType.OtherRandom:
                targetStr = targetHorse.getOwner().horseInfo.property.nickName
                break;
            case EBuffTargetType.OtherAll:
                targetStr = GameConfig.Language.Brocast_2.Value
                break;
            case EBuffTargetType.All:
                targetStr = GameConfig.Language.Brocast_3.Value
                break;
            case EBuffTargetType.Random:
                targetStr = targetHorse.getOwner().horseInfo.property.nickName
                break;
            case EBuffTargetType.Self:
                targetStr = GameConfig.Language.Brocast_4.Value
                break;
            default:
                break;
        }
        const targetLineageCfg = GameConfig.Lineage.getElement(targetHorse.getOwner().horseInfo.property.lineage)
        paramList.push({
            text: targetStr,
            color: new mw.LinearColor(targetLineageCfg.textColor[0] / 255, targetLineageCfg.textColor[1] / 255, targetLineageCfg.textColor[2] / 255),
            clickCb: () => { mw.UIService.show(HorseDetail, targetHorse.getOwner().uid) }
        })
        paramList.push({ text: GameConfig.Language[behaviorCfg.Broadcast4].Value })

        this.addBrocastInfo(paramList)
    }

    public addBrocastInfo(params: RichTextElementParams[]) {
        emitter.emit(GameEvents.EVENT_COMPETITION_BROCAST, params)
    }

    public net_setEndTime(owner: Participant, time: number) {
        this._competition.setHorseTime(owner.uid, time);
    }

    public net_refreshProgress(stage: ERaceStage, progress: number) {
        let basicView = mw.UIService.getUI(BasicView);
        basicView.refreshRaceProgress(stage, progress);
    }
}

export class RacingModuleS extends ModuleS<RacingModuleC, RacingData> {
    //赛场起点
    private _startPoints: mw.Vector[] = []

    //赛事
    private _competition: CompetitionServer

    public onStart(): void {
        this._competition = new CompetitionServer()
        Player.onPlayerLeave.add((player) => {
            //为什么要把参赛玩家删了？？？？
            //this._competition.removeParticipant(player.playerId)
        })
    }

    public syncRacingInfo(id: number) {
        // this.callClientFun(id, this.getAllClient().net_onRecieveRacingInfo, this._competition.getState())
    }

    /**
     * 比赛开始
     */
    public startMatch() {
        console.log("比赛开始")
        this._competition.startMatch()
    }

    /**
      * 入夜
      */
    public enterNight() {
        this._competition.changeState(ECompetitionState.Free)
    }

    public onUpdate(dt: number): void {
        this._competition.update(dt)
    }


    public onDestroy(): void {

    }

    /**
     * 报名
     * @returns 
     */
    public net_signUp(): void {
        let playerId = this.currentPlayer.playerId;

        let talkNum = ModuleService.getModule(PlayerModuleS).getTalkNum(this.currentPlayerId, ETalkIndex.SignUp);
        if (talkNum > 2) {
            if (ModuleService.getModule(PlayerModuleS).getMoney(playerId) < GlobalVar.SIGN_UP_COST) {
                return;
            }
            ModuleService.getModule(PlayerModuleS).costMoney(playerId, GlobalVar.SIGN_UP_COST);
        }
        this.signUp(playerId)
    }
    public signUp(playerId: number) {
        let signSuccess: boolean
        let errorCode: string
        let participant: Participant
        if (this._competition.getStateInfo().state == ECompetitionState.Sign) {
            if (this._competition.isSigned(playerId)) {
                errorCode = GameConfig.Language[ErrorCode[1002]].Value
                signSuccess = false
            } else {

                participant = this.createPlayerParticipant(playerId)
                this._competition.addParticipant(participant)
                participant.horseInfo.property.energy -= 1
                ModuleService.getModule(BagMouduleS).modifyHorse(participant.uid, participant.horseInfo.stableIndex,
                    participant.horseInfo.ID, participant.horseInfo.property)
                signSuccess = true
                console.log("当前报名人数", this.getParticleHorses().length)
            }
        } else {
            signSuccess = false
            errorCode = GameConfig.Language[ErrorCode[1001]].Value
        }
        this.callAllClient("net_onSignUp", signSuccess, participant, errorCode)
    }

    public net_AddBuffImpact(horseUID: number, buffIds: number[]) {
        let horse = this.getPlayerHorse(horseUID);
        horse.addBuffImpact(buffIds);
    }

    /**
     * 放弃报名
     */
    public discardSignup() {
        let playerId = this.currentPlayer.playerId
        let errorCode: string
        let discardSuccess: boolean
        if (this._competition.getStateInfo().state == ECompetitionState.Sign) {
            if (this._competition.isSigned(playerId)) {
                discardSuccess = true
            } else {
                discardSuccess = false
                errorCode = GameConfig.Language[ErrorCode[1003]].Value
            }

        } else {
            discardSuccess = false
            errorCode = GameConfig.Language[ErrorCode[1004]].Value
        }
        this.callAllClient("net_onDiscard", discardSuccess, playerId, errorCode)
    }

    /**
     * 清理报名的玩家
     */
    public clearSettlementData() {

    }

    public recordSettlementData(index: number, horse: HorseServer, time: number, giveup: boolean = false) {
        this.callAllClient("net_setEndTime", horse.getOwner(), time);
        return this._competition.recordSettlementData(index, horse, time, giveup)
    }

    /**
     * 获取比赛起点
     */
    public getCompetitionStartPoint() {
        return this._startPoints
    }

    /**
     * 获取参赛马匹对象
     * @returns 
     */
    public getParticleHorses() { return this._competition.getParticleHorses() }

    public getPlayerHorse(id: number) {
        return this._competition.getHorseByUID(id)
    }

    /**
     * 获取比赛项目
     */
    public getCompetition() {
        return this._competition
    }

    /**
     * 是否正在匹配或比赛
     */
    public isMatchRunning() {
        let state = this._competition.getStateInfo().state
        return state > ECompetitionState.Wait
    }

    /**
     * 检查比赛时候结束
     */
    public checkCompetitonEnd() {
        this._competition.checkCompetitonEnd()
    }

    /**
     * 赛马速度改变
     * @param playerID 
     * @param speed 
     */
    public notifyHorseSpeedChange(playerID: number, baseSpeed: number, extSpeed: number) {
        this.callAllClient("net_HorseSpeedChange", playerID, baseSpeed, extSpeed);
    }

    /**
     * 通知比赛状态
     * @param state 
     * @param notifyAll 通知所有玩家
     * @param params 
     */
    public notifyStateChange(state: ECompetitionState, notifyAll: boolean = false, ...params: any) {
        if (notifyAll) {
            const playerIds = ModuleService.getModule(PlayerModuleS).getAllPlayers()
            playerIds.forEach((id) => {
                this.getClient(id).net_competitionStateChange(state, ...params)
            })
        } else {
            this.callAllClient("net_competitionStateChange", state, ...params)
        }
    }

    /**
     * 通知特殊技能发动
     * @param state 
     * @param params 
     */
    public notifySpecialSkill(index: number, skillCfgID: number) {
        this.callAllClient("net_specialSkill", index, skillCfgID);
    }

    /**
     * 通知生成AI
     * @param participant 
     */
    public notifySpawnAIParticipant(participant: Participant) {
        this.callAllClient("net_onSpawnAI", participant)
    }

    /**
     * 通知马匹状态改变
     * @param state 
     * @param params 
     */
    public notifyHorseStateChange(state: EHorseState, ownerId: number, ...params: any) {
        this.callAllClient("net_onHorseStateChange", state, ownerId, ...params)
    }

    /**
     * 通知起跑
     * @param uid 
     */
    public notifyStartRun(uid: number) {
        this.callAllClient("net_onHorseStartRun", uid)
    }

    /**
   * 通知停下来
   * @param uid 
   */
    public notifyStopRun(uid: number) {
        this.callAllClient("net_onHorseStopRun", uid)
    }
    /**
     * 通知放弃比赛
     */
    public notifyGiveup(uid: number) {
        this.callAllClient("net_onGiveup", uid)
    }

    public notifyLeaderBoardInfo(settleData: ISettlementData[], leaderData: number[], giveupData: ISettlementData[]) {
        this.callAllClient("net_onLeaderBoard", settleData, leaderData, giveupData)
    }

    /**
    * 通知添加buffImpact
    * @param horseUID 
    * @param buffId 
    */
    public notifyAddBuffImpact(horseUID: number, buffId: number[]) {
        this.callAllClient("net_onAddBuff", horseUID, buffId)
    }
    /**
     * 通知添加buffImpact
     * @param horseUID 
     * @param buffId 
     */
    public notifyRemoveBuffImpact(horseUID: number, buffIds: number[]) {
        this.callAllClient("net_onRemoveBuff", horseUID, buffIds)
    }

    /**
     * 奔跑方向改变
     * @param horseUID 
     * @param dir 
     */
    public notifyChangeRunDir(horseUID: number, dir: number) {
        this.callAllClient("net_onChangeRunDir", horseUID, dir)
    }

    /**
     * 加速度改变
     * @param horseUID 
     * @param acc 
     */
    public notifyChangeAccelerate(horseUID: number, acc: number) {
        this.callAllClient("net_onChangeAccelerate", horseUID, acc)
    }

    /**
     * 通知广播事件
     * @param participantId 参赛者的ID
     * @param skillId 技能ID
     */
    public notifyBrocastEvent(participantId: number, skillId: number, targetIds?: number[]) {
        const skillCfg = GameConfig.Skill.getElement(skillId)
        if (!skillCfg.Broadcastornot) { return }
        this.callAllClient("net_onBrocastEvent", participantId, skillId, targetIds)
    }

    /**
     * 通知客户端刷新进度
     * @param playerID 玩家ID
     * @param stage 比赛状态
     * @param progress 进度
     */
    public notifyProgress(playerID: number, stage: ERaceStage, progress: number) {
        this.getClient(playerID).net_refreshProgress(stage, progress);
    }

    /*****************************************************私有方法************************************************************ */
    /**创建玩家参赛者 */
    private createPlayerParticipant(playerId: number) {
        const playerS = ModuleService.getModule(PlayerModuleS);
        let playerName = playerS.getPlayerName(playerId);
        let horseInfo: IHorseInfo = playerS.getEquipHorseInfo(playerId);
        if (!horseInfo || horseInfo.property.somatoType != EHorseSomatoType.Mature) {
            let index = 0;
            horseInfo = ModuleService.getModule(BagMouduleS).getHoresInfoByIndex(playerId, index);
            while (index < 10 && (horseInfo.property.somatoType == EHorseSomatoType.Filly || !horseInfo)) {
                index++;
                let newHorseInfo = ModuleService.getModule(BagMouduleS).getHoresInfoByIndex(playerId, index);
                newHorseInfo && (horseInfo = newHorseInfo);
            }
        }
        let participant = new Participant(playerId, playerName, horseInfo);
        return participant;
    }

    /**
     * 通知非新手玩家
     */
    private callAllClient(fun: string, ...params: any[]) {
        const playerIds = this._competition.getAllPlayerIds()
        for (const id of playerIds) {
            let player = Player.getPlayer(id)
            if (player) {
                this.getClient(player)[fun](...params)
                // this.callClientFun(player, fun, ...params)
            }
        }
    }
}
