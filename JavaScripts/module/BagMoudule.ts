import * as odin from 'odin'
import { CommonAssets, EHorseSomatoType, EPartType, ErrorCode, EStableHorseState, ETalkEnvironment, GlobalVar, IHorseInfo, IPartInfo, ISaveHorse } from '../Common';
import { GameConfig } from '../config/GameConfig';
import { IHorseElement } from '../config/Horse';
import { ILineageElement } from '../config/Lineage';
import { GameEvents } from '../GameEvents';
import Property from '../logic/Property';
import StableHorse, { IFollowingHorse } from '../logic/StableHorse';
import GrowUI from '../ui/GrowUI';
import { emitter } from '../utils/Emitter';
import SoundHelper from '../utils/SoundHelper';
import Utils from '../utils/Utils';
import { PlayerModuleC, PlayerModuleS } from './PlayerModule';
import { StableModuleC } from './StableModule';
import { SyntheticModuleC, SyntheticModuleS } from './SyntheticModule';
import { IWordUI, WorldUIModuleC } from './WorldUIModule';


//十个马场出生点
const BirthPos: string[] = [
    'B13D4F5E',
    'F6DA9D29',
    '1A608401',
    'F95125F8',
    'DB04C4B5',
    'FA61B59D',
    'F0603C10',
    'B2A666C6',
    '0B17EBA9',
    'C9982056'
]


class PlayerFollowInfo {
    //已经同步的玩家列表
    public playerVec: number[] = []
    //跟随的马匹信息
    public followInfo: IHorseInfo
    public host: number
    public initList: boolean[] = []
}

export class BagModuleData extends Subdata {
    @Decorator.persistence()
    public saveHorseArr: ISaveHorse[]
    /**跟随数据 */
    @Decorator.persistence()
    public followHorse: string

    /**马匹数据 */
    public horseInfoArr: IHorseInfo[] = []

    protected initDefaultData(): void {
        this.saveHorseArr = []
        this.followHorse = ""
        this.save(true);
    }

    protected onDataInit(): void {
        this.saveHorseArr.forEach((saveData) => {
            const info: IHorseInfo = {
                ID: saveData.ID,
                parts: this.getPartsArr(saveData.partIDs),
                property: saveData.property,
                stableIndex: saveData.stableIndex,
                trailingID: saveData.trailingID
            }
            this.horseInfoArr.push(info);
        })
    }

    private getPartsArr(partIDs: number[]): IPartInfo[] {
        let arr: IPartInfo[] = [];
        partIDs.forEach((id: number) => {
            let cfg = GameConfig.Parts.getElement(id);
            if (!cfg) {
                console.error("出错了，没有这个部位", id);
            }
            let part: IPartInfo = {
                name: cfg.Type,
                partId: cfg.ID,
                variation: cfg.Variation > 0
            }
            arr.push(part)
        })
        return arr;
    }

    /**
     * @description: 背包中添加马匹信息
     * @param {IHorseInfo} info
     * @return {*}
     */
    public addHorse(info: IHorseInfo): IHorseInfo {
        let index = this.getIndex();
        info.stableIndex = index
        this.horseInfoArr.splice(info.stableIndex, 0, info)
        let saveHorse: ISaveHorse = {
            ID: info.ID,
            partIDs: info.parts.map(a => a.partId),
            property: info.property,
            trailingID: info.trailingID,
            stableIndex: info.stableIndex,
        }
        this.saveHorseArr.splice(info.stableIndex, 0, saveHorse)
        this.save(false);
        return info
    }

    private getIndex(): number {
        let index = this.horseInfoArr.length;
        let curIndexArr: number[] = [];
        this.horseInfoArr.forEach((info) => {
            curIndexArr.push(info.stableIndex);
        })
        for (let i = 0; i < curIndexArr.length; i++) {
            if (!curIndexArr.includes(i)) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * @description: 背包中删除马匹信息
     * @param {string} infoID
     */
    public delHorse(infoID: string) {
        for (let i = 0; i < this.horseInfoArr.length; i++) {
            let data = this.horseInfoArr[i]
            if (data.ID == infoID) {
                this.horseInfoArr.splice(i, 1)
                this.saveHorseArr.splice(i, 1)
                this.saveDataSync();
                break;
            }
        }
    }

    /**
    * 背包中修改马匹信息
    * @param stableIndex  位置
    * @param info  信息
    */
    public modifyHorse(stableIndex: number, info: Property) {
        for (let i = 0; i < this.horseInfoArr.length; i++) {
            let tmpInfo = this.horseInfoArr[i]
            if (tmpInfo.stableIndex == stableIndex) {
                this.horseInfoArr[i].property = info
                this.saveDataSync();
                break;
            }
        }

    }

    public setFollowHorse(infoID: string) {
        this.followHorse = infoID
        this.saveDataSync();
    }

    public delFollowHorse() {
        this.followHorse = null
        this.saveDataSync();
    }

    public getFollowHorse() {
        return this.followHorse
    }


    /**
     * @description: 通过马场索引找到马匹信息
     * @param {number} stableIndex
     * @return {*}
     */
    public getHorseInfoByStableIndex(stableIndex: number) {
        for (const info of this.horseInfoArr) {
            if (info.stableIndex == stableIndex) {
                return info
            }
        }
        return null;
    }

    /**
     * @description: 通过id找到马匹信息
     * @param {string} infoID
     * @return {*}
     */
    public getHorseInfoByInfoid(infoID: string) {
        for (const info of this.horseInfoArr) {
            if (info.ID == infoID) {
                return info
            }
        }
    }

    public getAllHorseInfo() {
        return this.horseInfoArr
    }

    /**
     * @description: 获得所有大马
     * @return {*}
     */
    public getAllMatureHorse() {
        let horseList = this.horseInfoArr.filter(a => {
            if (a.property.somatoType == EHorseSomatoType.Mature) {
                return a
            }
        })
        return horseList
    }

    /**
     * @description: /获得所有小马
     * @return {*}
     */
    public getAllFillyHorse() {
        let horseList = this.horseInfoArr.filter(a => {
            if (a.property.somatoType == EHorseSomatoType.Filly) {
                return a
            }
        })
        return horseList
    }

    public refreshRate(rateArr: number[]) {
        this.horseInfoArr.forEach((horse: IHorseInfo, index: number) => {
            horse.rate = rateArr[index];
        })
        this.saveDataSync();
    }

    private inSync: boolean = false;
    private syncTimeout: number = 0;
    private saveDataSync() {
        if (!this.inSync) {
            this.save(true);
            this.inSync = true;
        } else {
            if (!this.syncTimeout) {
                this.syncTimeout = setTimeout(() => {
                    this.save(true);
                    TimeUtil.delayExecute(() => {
                        this.inSync = false;
                    }, 1);
                    this.syncTimeout = 0;
                }, 300);
            }
        }
    }
}

export class BagMouduleS extends ModuleS<BagMouduleC, BagModuleData> {

    //记录当前跟随状态，每个玩家的马匹同步
    private _allPlayerFollow: Map<number, PlayerFollowInfo> = new Map()
    private _allPlayer: number[] = []
    onStart(): void {
        DataCenterS.onPlayerJoin.add(player => {
            let pid = player.playerId
            this._allPlayer.push(pid)

            if (this.getPlayerData(pid).saveHorseArr.length <= 0) {
                this.addDefaultHorse(pid)
            }

            this.refreshRate(player.playerId);
        })

        DataCenterS.onPlayerLeave.add((player) => {
            let pid = player.playerId
            this.hide_FolloHorse(pid)

            this._allPlayer.splice(this._allPlayer.indexOf(pid), 1)
            this._allPlayerFollow.delete(pid)

            this._allPlayerFollow.forEach((data, host) => {
                data.playerVec.splice(data.playerVec.indexOf(pid), 1)
            })
        })

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

    //初始化玩家数据
    public addDefaultHorse(pid: number) {
        let horseInfo = ModuleService.getModule(SyntheticModuleS).getRandomHorseInfoByLineID(GlobalVar.Default_Horse)
        this.addHorse(pid, horseInfo)
    }

    /**
     * 刷新评分
     */
    public refreshRate(playerID: number) {
        let data = this.getPlayerData(playerID);
        const horses = data.getAllHorseInfo();
        let rateArr: number[] = [];
        let syntheticModuleS = ModuleService.getModule(SyntheticModuleS);
        horses.forEach((horse: IHorseInfo) => {
            const rate = syntheticModuleS.getRate(horse);
            rateArr.push(rate);
        })
        data.refreshRate(rateArr);
    }

    public addHorse(playerID: number, info: IHorseInfo) {
        info.ID = playerID + "_" + mw.TimeUtil.time() + "_" + this.getPlayerData(playerID).getAllHorseInfo().length;
        let res = this.getPlayerData(playerID).addHorse(info);
        this.getClient(playerID).net_onAddHorseToStable(res, res.stableIndex);
    }

    public setFollowHorse(pid: number, infoID: string) {
        this.getPlayerData(pid).setFollowHorse(infoID)
    }

    public delFollowHorse() {
        this.currentData.delFollowHorse()
    }

    public net_initHorseList(pid: number) {

        this._allPlayerFollow.forEach((data, host) => {
            if (data.playerVec) {
                this.addAFollowingHorse(host, data.followInfo, false, pid)
            }
        })

        let ownFollow = this.getDefaultFollowHorse(pid)
        if (ownFollow) {
            this.addAFollowingHorse(pid, ownFollow, true)
        }

    }


    private getDefaultFollowHorse(pid: number) {
        let data = this.getPlayerData(pid)
        let horseID = data.getFollowHorse()
        return data.getHorseInfoByInfoid(horseID)
    }

    public net_delHorse(infoID: string) {
        this.currentData.delHorse(infoID)
        // this.getClient(this.currentPlayerId).net_delHorseFromStable(infoID)
        this.hide_FolloHorse(this.currentPlayerId)
    }

    public net_modifyHorse(index: number, infoID: string, info: Property) {
        this.modifyHorse(this.currentPlayerId, index, infoID, info)
    }


    public modifyHorse(pid: number, index: number, infoID: string, property: Property) {
        const playerData = this.getPlayerData(pid)
        playerData.modifyHorse(index, property)
        const info = playerData.getHorseInfoByInfoid(infoID)
        let equipInfo = ModuleService.getModule(PlayerModuleS).getEquipHorseInfo(pid)
        if (equipInfo && equipInfo.ID == infoID) {
            ModuleService.getModule(PlayerModuleS).equipHorse(pid, info, true)
        }
        this.getClient(pid).net_noModifyHorseInfo(index, property)
    }


    public net_addAFollowingHorse(hostID: number, info: IHorseInfo, isAll: boolean, syncPid?: number) {
        this.addAFollowingHorse(hostID, info, isAll, syncPid)
    }

    public getPlayerFollowInfoByPID(pid: number) {
        let res: PlayerFollowInfo = null
        for (const [num, info] of this._allPlayerFollow) {
            if (info.host == pid) {
                return info
            }
        }
        return res
    }

    public addAFollowingHorse(hostID: number, info: IHorseInfo, isAll: boolean, syncPid?: number) {
        let tmpFollowInfo: PlayerFollowInfo
        if (!this._allPlayerFollow.has(hostID)) {
            tmpFollowInfo = new PlayerFollowInfo()
            tmpFollowInfo.host = hostID
            tmpFollowInfo.playerVec = []
            this._allPlayerFollow.set(hostID, tmpFollowInfo)
        }
        tmpFollowInfo = this._allPlayerFollow.get(hostID)
        tmpFollowInfo.followInfo = info

        if (isAll) {
            this._allPlayer.forEach(tmpID => {
                if (tmpFollowInfo.playerVec.indexOf(tmpID) == -1) {
                    tmpFollowInfo.playerVec.push(tmpID)
                    tmpFollowInfo.initList.push(false)
                }
            })
            tmpFollowInfo.playerVec.forEach(pid => {
                let tmpInfo = this.getPlayerFollowInfoByPID(pid)
                if (tmpInfo) {
                    this.getClient(pid).net_onAddAFollowHorse(hostID, info)
                    tmpInfo.initList[tmpInfo.playerVec.indexOf(pid)] = true
                }
            })

        } else {
            if (tmpFollowInfo.playerVec.indexOf(syncPid) == -1) {
                tmpFollowInfo.playerVec.push(syncPid)
                tmpFollowInfo.initList.push(false)
            }

            tmpFollowInfo.initList[tmpFollowInfo.playerVec.indexOf(syncPid)] = true
            tmpFollowInfo.playerVec.push(syncPid)
            this.getClient(syncPid).net_onAddAFollowHorse(hostID, info)

        }

        let equipInfo = ModuleService.getModule(PlayerModuleS).getEquipHorseInfo(hostID)
        if (!equipInfo || info.ID != equipInfo.ID) {
            ModuleService.getModule(PlayerModuleS).equipHorse(hostID, info)
        }
        this.setFollowHorse(hostID, info.ID)
    }


    public hide_FolloHorse(host: number) {
        this.net_hideFollowHorse(host, false)
    }

    public net_hideFollowHorse(host: number, unFollow: boolean = true) {
        if (!this._allPlayerFollow.has(host)) {
            return;
        }
        let tmpFollowInfo = this._allPlayerFollow.get(host)

        tmpFollowInfo.playerVec.forEach(pid => {
            let tmpInfo = this.getPlayerFollowInfoByPID(pid)
            if (tmpInfo) {
                tmpInfo.initList[tmpInfo.playerVec.indexOf(pid)] = false
            }
        })

        this._allPlayer.forEach(tmpID => {
            tmpFollowInfo.playerVec.splice(tmpFollowInfo.playerVec.indexOf(tmpID), 1)
        })

        if (tmpFollowInfo.followInfo.property.somatoType == EHorseSomatoType.Mature) {
            ModuleService.getModule(PlayerModuleS).unEquipHorse(host)
        }
        if (unFollow) {
            this.delFollowHorse()
        }
        this.getAllClient().net_delAFollowHorse(host)
    }


    public getHoresInfoByIndex(playerID: number, index: number) {
        let playerData = this.getPlayerData(playerID);
        return playerData.getHorseInfoByStableIndex(index)

    }
}

export class BagMouduleC extends ModuleC<BagMouduleS, BagModuleData> {

    //该玩家的马匹
    private _storeHorses: StableHorse[] = []
    //其他玩家跟随马匹
    private _followHorseMap: Map<number, StableHorse> = new Map()
    //是否在马厩中
    private _isInStable: boolean = false
    //当前玩家跟随的马匹id
    private _curHorseInfoID: string = ""

    private _curLookHorseIndex: number = 0
    override onStart(): void {
        super.onStart()
        if (GlobalVar.STABLE_BIRTHPOS.length <= 0) {
            BirthPos.forEach(async pos => {
                let obj = await GameObject.asyncFindGameObjectById(pos)
                GlobalVar.STABLE_BIRTHPOS.push(obj.worldTransform.position.clone())
            })
        }

        emitter.on(GameEvents.EVENT_HORSE_GROWUP, (info: IHorseInfo) => {
            let horse = this.getHorseModelByID(info.ID)
            horse.changeState(EStableHorseState.Portal, 1)
            horse.setHorseInfo(info)
            mw.UIService.getUI(GrowUI).clearCarrot(info.ID)
        }, this)
        this.initHorseInfo()
    }

    public onUpdate(dt: number): void {
        this._storeHorses.forEach((horse, playerID) => {
            horse && horse.update(dt)
        })
        this._followHorseMap.forEach(horse => {
            horse && horse.update(dt)
        })
    }


    /**
     * @description: 获取背包中所有马匹信息
     * @return {*}
     */
    public getHoresInfo() {
        return this.data.getAllHorseInfo()
    }

    /**
     * @description: 通过马匹id获取马匹模型
     * @param {string} infoID 
     * @return {*}
     */
    public getHorseModelByID(infoID: string): StableHorse {
        let horseList = this._storeHorses
        for (const horse of horseList) {
            if (horse.getHorseInfo().ID == infoID) {
                return horse
            }
        }
        return null
    }

    //获取背包中所有大马信息
    public getAllMatureHorse() {
        return this.data.getAllMatureHorse()
    }

    //获取背包中所有小马信息
    public getAllFillyHorse() {
        return this.data.getAllFillyHorse()
    }

    //通过马场索引获取马匹信息
    public getHoresInfoByIndex(index: number) {
        return this.data.getHorseInfoByStableIndex(index)
    }

    public reqHideAFollowingHorse() {
        this.server.net_hideFollowHorse(Player.localPlayer.playerId)
    }


    public reqAddAFollowingHorse(info: IHorseInfo) {
        this.server.net_addAFollowingHorse(Player.localPlayer.playerId,
            info, true)
    }

    /**
     * @description: 请求删除玩家马匹信息
     * @param {IHorseInfo} info
     * @return {*}
     */
    public reqDelHorseInfo(info: IHorseInfo) {
        this.data.delHorse(info.ID)
        this.net_delHorseFromStable(info.ID)
        this.server.net_delHorse(info.ID)
    }

    /**
     * @description: 请求修改玩家马匹信息
     * @param {number} index 马厩位置
     * @param {IHorseInfo} info
     * @return {*}
     */
    public reqModifyHorseProperty(index: number, infoID: string, info: Property) {
        this.server.net_modifyHorse(index, infoID, info)
    }

    public net_noModifyHorseInfo(index: number, info: Property) {
        this.data.modifyHorse(index, info)
    }



    private _init: boolean = true
    //添加马匹到马厩
    /**
     * @description: 
     * @param {number} pid 玩家id
     * @param {IHorseInfo} info 马的信息
     * @return {*}
     */
    public async net_onAddHorseToStable(info: IHorseInfo, index: number) {
        if (!this.data.getHorseInfoByInfoid(info.ID)) {
            this.data.addHorse(info);
        }
        let char = Player.localPlayer.character

        if (this._init) {
            this._init = false
        }

        let horseModel = await ModuleService.getModule(SyntheticModuleC).createHorse(info);
        horseModel.instance.worldTransform.rotation = char.worldTransform.rotation.clone().add(new mw.Rotation(0, 0, 90))

        let horse = new StableHorse(horseModel)
        horse.setTrigger()

        horse.setOwnerID(Player.localPlayer.playerId)
        horse.canFeed = true
        horse.initPortalLine(GlobalVar.STABLE_BIRTHPOS[index])
        horseModel.instance.worldTransform.position = GlobalVar.STABLE_BIRTHPOS[index]
        horse.setBirthPosition(GlobalVar.STABLE_BIRTHPOS[index]);
        this._storeHorses.push(horse)

        ModuleService.getModule(StableModuleC).entarStable()
        ModuleService.getModule(StableModuleC).fatCreateStart(info)

        if (this._isInStable) {
            horse.changeState(EStableHorseState.Portal)
        }
        else {
            horse.changeState(EStableHorseState.Idle)
        }

        //添加会话框
        let allElme = GameConfig.TalkInfo.getAllElement()
        let say: string[] = []
        let pos: number[]
        allElme.forEach(elem => {
            if (elem.Environment == ETalkEnvironment.Stable) {
                say.push(GameConfig.Language.getElement(elem.Talk).Value)
                pos = elem.offsetPos
            }
        })
        let iWordUI: IWordUI = {
            playerID: Player.localPlayer.playerId,
            uiStr: CommonAssets.Talk3D,
            talkStr: say,
            attachTarget: horse.getHorseObject().instance,
            isInteval: true,
            isResident: false,
            offset: new mw.Vector(pos[0], pos[1], pos[2])
        }
        if (info.property.somatoType == EHorseSomatoType.Filly) {
            horseModel.instance.worldTransform.scale = new mw.Vector(0.5, 0.5, 0.5)
            iWordUI.controlOtherUI = true
        }
        ModuleService.getModule(WorldUIModuleC).net_addWorldUI(iWordUI)

        if (!info.property.nickName) {
            let allNames = GameConfig.Name.getAllElement();
            const firstName = info.property.firsName;
            const lastName = info.property.lastName;
            info.property.nickName = allNames[firstName].firstName + " " + allNames[lastName].lastName;
            this.reqModifyHorseProperty(info.stableIndex, info.ID, info.property);
        }
    }

    /**
     * @description: 销毁马匹
     * @param {string} infoID
     * @return {*}
     */
    public net_delHorseFromStable(infoID: string) {

        let index = -1
        for (const horse of this._storeHorses) {
            index += 1
            if (horse.getHorseInfo().ID == infoID) {
                break
            }
        }

        // console.log("jkljkljkljklj", index)
        if (index != -1) {

            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                attachTarget: this._storeHorses[index].getHorseObject().instance.gameObjectId,
                isInteval: true,
                isResident: false,
            }
            ModuleService.getModule(WorldUIModuleC).delWorldUI(iWordUI)
            ModuleService.getModule(StableModuleC).entarStable()
            ModuleService.getModule(StableModuleC).fatCreateDestroy(infoID)
            ModuleService.getModule(StableModuleC).destroyDiamond(infoID)
            this._storeHorses[index].getHorseObject().destory()
            this._storeHorses[index].changeState(EStableHorseState.Free)
            this._storeHorses.splice(index, 1)
            if (this.getCurFollowingHorse() && this.getCurFollowingHorse().getHorseInfo().ID == infoID) {
                this._followHorseMap.delete(Player.localPlayer.playerId)
            }
        }
    }

    /**
     * @description: 通过id获取当前玩家存储的其他玩家跟随马匹信息
     * @param {number} pid
     * @return {*}
     */
    public getFollowingHorse(pid: number) {
        return this._followHorseMap.get(pid)
    }

    /**当前顽疾跟随的马匹 */
    public getCurFollowingHorse() {
        return this._followHorseMap.get(Player.localPlayer.playerId)
    }

    /**
     * @description: 获取当前访问的马厩索引
     * @return {*}
     */
    public getCurLookHorseStableIndex() {
        return this._curLookHorseIndex
    }

    /**
     * @description: 记录当前玩家查看的马厩索引
     * @param {number} index
     * @return {*}
     */
    public setCurLookHorseStableIndex(index: number) {
        this._curLookHorseIndex = index
    }

    /**
     * @description: 添加玩家跟随马匹
     * @param {number} pid 玩家id
     * @param {IHorseInfo} info 马匹信息
     * @return {*}
     */
    public async net_onAddAFollowHorse(pid: number, info: IHorseInfo) {
        // console.log("添加跟随小马", pid)
        let horse: StableHorse = null
        if (pid != Player.localPlayer.playerId) {
            let horseModel = await ModuleService.getModule(SyntheticModuleC).createHorse(info, true);
            horse = new StableHorse(horseModel)
            if (info.property.somatoType == EHorseSomatoType.Filly) {
                horseModel.instance.worldTransform.scale = new mw.Vector(0.5, 0.5, 0.5)
            }

            let player = Player.getPlayer(pid);
            let follow = this.initFollowProperty(pid)
            horse.setFollowProperty(follow)
            horse.changeState(EStableHorseState.Follow)
            this._followHorseMap.set(pid, horse)
            horse.setOwnerID(pid)

        }
        else {
            let horseList = this._storeHorses
            let index = -1
            for (const horse of this._storeHorses) {
                index += 1
                if (horse.getHorseInfo().ID == info.ID) {
                    horse.changeState(EStableHorseState.Idle)
                    break
                }
            }
            if (index != -1) {
                SoundHelper.instance().play(1030)

                this._curHorseInfoID = info.ID
                horse = horseList[index]

                horse.cancelRecoverEnergyTimer()
                ModuleService.getModule(StableModuleC).fatCreatePause(info.ID)

                //添加会话框
                let allElme = GameConfig.TalkInfo.getAllElement()
                let say: string[] = []
                let pos: number[]
                allElme.forEach(elem => {
                    if (elem.Environment == ETalkEnvironment.Follow) {
                        say.push(GameConfig.Language.getElement(elem.Talk).Value)
                        pos = elem.offsetPos
                    }
                })

                let iWordUI: IWordUI = {
                    playerID: Player.localPlayer.playerId,
                    talkStr: say,
                    attachTarget: horse.getHorseObject().instance.gameObjectId,
                    isInteval: true,
                    isResident: false,
                }
                ModuleService.getModule(WorldUIModuleC).changeWorldUIText(iWordUI)

                iWordUI = {
                    playerID: Player.localPlayer.playerId,
                    uiStr: CommonAssets.Talk3D,
                    talkStr: say,
                    attachTarget: horse.getHorseInfo().ID,
                    isInteval: true,
                    isResident: false,
                    isAll: true,
                    offset: new mw.Vector(pos[0], pos[1], pos[2])
                }
                ModuleService.getModule(WorldUIModuleC).reqAddToAllPlayer(iWordUI)

                Player.getPlayer(pid)
                let follow = this.initFollowProperty(pid)
                horse.setFollowProperty(follow)
                horse.changeState(EStableHorseState.Follow)
                this._followHorseMap.set(pid, horse)
                horse.setOwnerID(pid)

            }

        }

    }

    /**
     * @description: 初始化伴随数据
     * @param {number} pid
     * @return {*}
     */
    private initFollowProperty(pid: number) {
        let follow = new IFollowingHorse()
        follow.folloPlayerID = pid
        let char = Player.getPlayer(follow.folloPlayerID).character
        follow.followRot = char.worldTransform.rotation.clone().add(new mw.Rotation(0, 0, 90))
        follow.followPos = new mw.Vector(char.worldTransform.position.x, char.worldTransform.position.y, char.worldTransform.position.z)
        follow.targetPos = follow.followPos.clone().subtract(char.worldTransform.getForwardVector().multiply(follow.offsetDistance))
        return follow
    }

    /**
     * @description:解除玩家跟随马匹
     * @param {number} pid 玩家id
     * @return {*}
     */
    public net_delAFollowHorse(pid: number) {
        let horse: StableHorse
        if (pid != Player.localPlayer.playerId) {
            if (!this._followHorseMap.has(pid)) {
                return
            }
            horse = this._followHorseMap.get(pid)
            let iWordUI: IWordUI = {
                playerID: pid,
                attachTarget: horse.getHorseObject().instance.gameObjectId,
                isInteval: true,
                isResident: false,
            }
            ModuleService.getModule(WorldUIModuleC).delWorldUI(iWordUI)

            horse.getHorseObject().destory()
            // EffectService.stop(horse.getFollowProperty().trail)

        }
        else {

            let index = -1
            for (const horse of this._storeHorses) {
                index += 1
                if (horse.getHorseInfo().ID == this._curHorseInfoID) {
                    break
                }
            }
            if (index != -1) {
                horse = this._storeHorses[index]
                // EffectService.stop(horse.getFollowProperty().trail)
                horse.setRecoverEnergyTimer()

                let allElme = GameConfig.TalkInfo.getAllElement()
                let say: string[] = []
                let pos: number[]
                allElme.forEach(elem => {
                    if (elem.Environment == ETalkEnvironment.Stable) {
                        say.push(GameConfig.Language.getElement(elem.Talk).Value)
                        pos = elem.offsetPos
                    }
                })

                let iWordUI: IWordUI = {
                    playerID: Player.localPlayer.playerId,
                    talkStr: say,
                    attachTarget: horse.getHorseObject().instance.gameObjectId,
                    isInteval: true,
                    isResident: false,
                }
                ModuleService.getModule(WorldUIModuleC).changeWorldUIText(iWordUI)

                //如果是自己的马匹，且在马厩外面
                if (!this._isInStable) {

                    horse.changeState(EStableHorseState.Put)
                }
                else {//在马厩里

                    horse.getHorseObject().instance.worldTransform.position = GlobalVar.STABLE_BIRTHPOS[horse.getHorseInfo().stableIndex]
                    horse.changeState(EStableHorseState.Portal)
                }
                ModuleService.getModule(StableModuleC).fatCreateResume(horse.getHorseInfo().ID)
            }
        }
        this._followHorseMap.delete(pid)

    }



    /**
     * @description: 同步其他玩家跟随数据，初始化自己的背包数据
     * @return {*}
     */
    public initHorseInfo() {
        let dataList = this.data.getAllHorseInfo()
        if (dataList.length > 0) {
            this.addHorseToStable(0);
        }
    }

    private async addHorseToStable(index: number) {
        let dataList = this.data.getAllHorseInfo()
        let data = dataList[index];
        await this.net_onAddHorseToStable(data, data.stableIndex)
        index++
        if (index >= dataList.length) {
            let pid = Player.localPlayer.playerId
            this.server.net_initHorseList(pid)
        } else {
            this.addHorseToStable(index);
        }
    }

    /**
     * @description: 玩家进入马厩
     * @return {*}
     */
    public entarStable() {
        ModuleService.getModule(StableModuleC).entarStable()
        ModuleService.getModule(PlayerModuleC).reqCalOutLineReward()
        this._isInStable = true
        this._storeHorses.forEach(e => {
            if (e.getCurState() != EStableHorseState.Follow) {
                // console.log("fkljkljklj", e.getLastState())
                if (e.getHorseInfo().property.somatoType == EHorseSomatoType.Filly && e.getFood().length > 0) {
                    e.changeState(EStableHorseState.Eating)
                }
                else {
                    e.changeState(EStableHorseState.Portal)
                }
            }
        })
        this.setAllHorseCollision(true)
    }

    /**
     * @description: 玩家离开马厩
     * @return {*}
     */
    public leaveStable() {
        ModuleService.getModule(StableModuleC).leaveStable()
        this._isInStable = false

        this._storeHorses.forEach(e => {
            if (e.getCurState() != EStableHorseState.Follow) {
                e.getBirthPosition() && (e.getHorseObject().instance.worldTransform.position = e.getBirthPosition());
                e.changeState(EStableHorseState.Idle)
            }
        })
        this.setAllHorseCollision(false)
    }

    public setAllHorseCollision(flag: boolean) {
        this._storeHorses.forEach(e => {
            e.setCollsion(flag)
        })
    }


    /**
     * @description: 设置食物的位置以及其他信息
     * @param {IHorseInfo} info
     * @param {Core} carrotPos
     * @return {*}
     */
    public setCarrotPos(info: IHorseInfo, carrotPos: mw.GameObject[]) {
        for (const horse of this._storeHorses) {
            if (horse.getHorseInfo().ID == info.ID) {
                horse.setFood(carrotPos)
                horse.changeState(EStableHorseState.Eating)
                break
            }
        }
    }
}