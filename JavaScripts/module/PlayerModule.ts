import { ModifiedCameraSystem } from '../Modified027Editor/ModifiedCamera';
import { CommonTrigger, EffectScene, ErrorCode, ESceneType, ETalkIndex, IHorseInfo } from '../Common';
import BasicView from '../ui/BasicView';
import { GameEvents } from '../GameEvents';
import Tips from '../ui/Tips';
import { emitter } from '../utils/Emitter';
import { RacingModuleC, RacingModuleS } from './RacingModule';
import GuessUI from '../ui/GuessUI';
import PopWindowUI from '../ui/PopWindowUI';
import { BagMouduleC, BagMouduleS } from './BagMoudule';
import { WeatherModuleS } from './WeatherModule';
import { GameConfig } from '../config/GameConfig';
import { StableModuleC } from './StableModule';
import { EffectMgr } from '../logic/EffectMgr';
import DefaultUI from '../ui/DefaultUI';
import { Scheduler } from '../utils/Scheduler';
import SoundHelper from '../utils/SoundHelper';
import { ILanguageElement } from '../config/Language';
import InteractiveUI, { EInteractiveType } from '../ui/InteractiveUI';
import Transation from '../ui/Transation';
import { ShopModuleC } from './ShopModule';
import HorseBagUI from '../ui/HorseBagUI';
import { BreedModuleC } from './BreedModule';
import TouchUI from '../ui/TouchUI';
import GrowUI from '../ui/GrowUI';
import { IPartsElement } from '../config/Parts';
import Utils from '../utils/Utils';
import CameraUtils from '../utils/CameraUtils';
import { NewGuideModuleC } from './GuideModule';

interface ISceneInfo {
    //场景类型
    type: ESceneType
    birthPos: mw.Vector
    birthRot: mw.Rotation
    birthGuid: string
    cameraFocusGuid: string
    cameraFocusPos: mw.Vector
    cameraFocusRot: mw.Rotation
}

const SceneInfos: ISceneInfo[] = [
    {
        type: ESceneType.Hall,
        birthGuid: '007091B6',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: 'E57609E4',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    },
    {
        type: ESceneType.Breed,
        birthGuid: '26269A52',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: '26269A52',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    },
    {
        type: ESceneType.Stable,
        birthGuid: '035F67A7',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: '52B817F2',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    },
    {
        type: ESceneType.Bussiness,
        birthGuid: '05BA0A71',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: 'FBEEDC6E',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    },
    {
        type: ESceneType.Shop,
        birthGuid: 'FB298C10',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: 'FB298C10',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    }
    ,
    {
        type: ESceneType.Sign,
        birthGuid: '814B5522',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: '814B5522',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    },
    {
        type: ESceneType.Bet,
        birthGuid: 'C6CDD9E8',
        birthPos: undefined,
        birthRot: undefined,
        cameraFocusGuid: 'C6CDD9E8',
        cameraFocusPos: undefined,
        cameraFocusRot: undefined
    }
]

enum ETalkWay {
    //循环最后一个
    RepetLast,
    //列表循环
    ListRecycle
}


//记录对话的数据：两种轮播
export class TalkData {
    public type: ETalkWay
    public index: number
}

/**
 * 玩家数据
 */
export class PlayerModuleData extends Subdata {

    /**金钱 */
    @Decorator.persistence()
    public money: number

    /**钻石 */
    @Decorator.persistence()
    public diamond: number

    /**
     * 玩家名字
     */
    @Decorator.persistence()
    public playerName: string
    //离开马场的时间点
    @Decorator.persistence()
    public leaveFarmTime: number
    @Decorator.persistence()
    public talkNum: TalkData[]

    constructor() {
        super();
    }

    protected initDefaultData(): void {
        super.initDefaultData();
        this.money = 1500
        this.diamond = 400
        this.leaveFarmTime = 0
        this._initTalk()
        this.save(true);
    }

    protected _initTalk() {
        this.talkNum = []
        for (let i = 0; i < 17; i++) {
            let talk = new TalkData()
            talk.index = 1
            if (i < 5) {
                talk.type = ETalkWay.RepetLast
            } else {
                talk.type = ETalkWay.ListRecycle
            }
            this.talkNum.push(talk)
        }
    }

    public changeTalkNum(index: number, num: number) {
        // if (!this.talkNum) {
        //     this.talkNum = [1, 1, 1, 1, 1];
        // }
        if (this.talkNum[index]) {
            this.talkNum[index].index = num;
            this.save(true);
        }
    }

    public addMoney(value: number) {
        this.money += value
        this.save(false)
    }

    public costMoney(value: number) {
        this.money -= value
        if (this.money < 0) {
            this.money = 0
        }
        this.save(false)
    }

    public setMoney(total: number) {
        this.money = total
    }

    /**
     * 增加钻石
     * @param value 
     */
    public addDiamond(value: number) {
        this.diamond += value
        this.save(false)
    }
    /**
     * 消费钻石
     * @param value 
     */
    public costDiamond(value: number) {
        this.diamond -= value
        if (this.diamond < 0) {
            this.diamond = 0
        }
        this.save(false)
    }
    public setDiamond(value: number) {
        this.diamond = value
    }
    public getDiamond() { return this.diamond }

    public setLeaveFarmTime(time: number) {
        this.leaveFarmTime = time
        this.save(true)
    }
    public getLeabeFarmTime() {
        return this.leaveFarmTime
    }

    public getMoney() { return this.money }
    protected onDataInit(): void {
        if (!this.diamond) {
            this.diamond = 0
        }
    }

    public getPlayerName() {
        return this.playerName
    }

    public setPlayerName(name: string) {
        this.playerName = name
        this.save(false)
    }

    public getTalkNum(index: number) {
        // if (!this.talkNum) {
        //     this.talkNum = [1, 1, 1, 1, 1];
        // }
        // if (this.talkNum.length > index) {
        return this.talkNum[index];
        // } else {
        //     for (let i = this.talkNum.length; i < index + 1; i++) {
        //         this.talkNum.push(1);
        //     }
        //     this.save(true);
        //     return this.talkNum[index];
        // }
    }

    public getTalks() {
        return this.talkNum
    }
}

/**
 * 玩家模块逻辑
 */
export class PlayerModuleC extends ModuleC<PlayerModuleS, PlayerModuleData> {
    //出战马匹
    private _equipedHorse: Map<number, IHorseInfo> = new Map()

    //是否能将非basicui隐藏
    private _curMainUI: mw.UIScript = null
    private _hideConfirmCallBack: () => void = null

    private _curScene: ESceneType = ESceneType.None

    /** 按钮点击跳转时添加类型 */
    private _interactiveType: EInteractiveType;

    async onStart(): Promise<void> {
        super.onStart()

        for (const info of SceneInfos) {
            GameObject.asyncFindGameObjectById(info.birthGuid).then((anchor) => {
                info.birthPos = anchor.worldTransform.position
                info.birthRot = anchor.worldTransform.rotation
                if (info.birthGuid == info.cameraFocusGuid) {
                    info.cameraFocusPos = info.birthPos.clone()
                    info.cameraFocusRot = info.birthRot.clone()
                }
                else {

                }
            })

        }
        let vec: ISceneInfo[] = SceneInfos.filter(e => {
            if (e.birthGuid != e.cameraFocusGuid) {
                return e
            }
        })


        vec.forEach(async info => {
            this.findCameraAnchor(info, true)
        })

    }


    private findCameraAnchor(info: ISceneInfo, flag: boolean) {
        GameObject.asyncFindGameObjectById(info.cameraFocusGuid).then((anchor) => {
            info.cameraFocusPos = anchor.worldTransform.position
            info.cameraFocusRot = anchor.worldTransform.rotation
        })
    }
    /**
     * 进入游戏
     */
    public reqEnterGame() {
        mw.UIService.show(Transation, this.getSceneName(ESceneType.Hall), () => {
            this.showBasicUI();
            SoundHelper.instance().restoreBGM();
            let playerName = mw.AccountService.getNickName();
            if (!playerName || playerName.length == 0) {
                playerName = Player.localPlayer.character.displayName
            }
            Player.localPlayer.character.setPostProcessOutline(true, mw.LinearColor.black, 2);
            // humanoidV2.setOutline(true);
            this.server.net_enterGame(playerName)
            this.data.setPlayerName(playerName)
            EffectMgr.instance().init();
        })
        // this.translateToScene(ESceneType.Hall);
    }

    public async loadPart(index: number) {
        let part: IPartsElement = GameConfig.Parts.getAllElement()[index];
        if (part && part.Guid) {
            let guid = part.Guid;
            if (!mw.AssetUtil.assetLoaded(guid)) {
                TimeUtil.delayExecute(() => {
                    this.loadPart(index + 1);
                }, 2)
            } else {
                this.loadPart(index + 1);
            }
        } else {
            console.log("肢体下载完毕");
        }
    }

    /**
     * 有玩家进入游戏
     */
    public net_onPlayerJoin(id: number, playerName: string) {
        ModuleService.getModule(RacingModuleC).init(id)
        let player = Player.getPlayer(id);
        player.character.displayName = playerName;
    }

    /**
     * 登录完成
     */
    public net_LoginInComplete() {
        ModuleService.getModule(NewGuideModuleC).checkGuide()
    }

    public comeToSign() {
        CameraUtils.resetCamera();
        if (this._hideConfirmCallBack) {
            this._hideConfirmCallBack()
            this._hideConfirmCallBack = null
        }
        else {
            Player.localPlayer.character.worldTransform.rotation = (CommonTrigger.SIGN_TRIGGER_ROA);
            ModuleService.getModule(PlayerModuleC).translateToScene(ESceneType.Sign, CommonTrigger.SIGN_TRIGGER_POS);
        }
    }

    /** 
     * 显示basicView 和 defaultUI
     */
    public showBasicUI() {
        mw.UIService.showUI(mw.UIService.getUI(DefaultUI), mw.UILayerScene);
        mw.UIService.show(BasicView);
    }

    /** 
     * 显示basicView 和 defaultUI
     */
    public hideBasicUI() {
        mw.UIService.hide(DefaultUI);
        mw.UIService.hide(BasicView);
        // SoundHelper.instance().pauseMusic()
        // mw.UIService.getUI(BasicView).mainCanvas.visibility = mw.SlateVisibility.Hidden
    }

    /** 
     * 隐藏basicView 和 defaultUI
     */
    public hideBasicUIExceptMoney() {
        mw.UIService.hide(DefaultUI);
        let basic = mw.UIService.getUI(BasicView);
        basic.mainCanvas.visibility = mw.SlateVisibility.Hidden;
        basic.canvas_notice.visibility = mw.SlateVisibility.Hidden;
    }


    /**
     * 进入场景
     * @param type 
     */
    public quickEnterScene(type: ESceneType, loc: mw.Vector = mw.Vector.zero) {
        if ((this._curScene == ESceneType.Bussiness || this._curScene == ESceneType.Bet || this._curScene == ESceneType.Shop || this._curScene == ESceneType.Sign)
            && (type == ESceneType.Bussiness || type == ESceneType.Bet || type == ESceneType.Shop || type == ESceneType.Sign)) {
            this.enterSceneDirectly(type, loc)
        } else {
            this.translateToScene(type, loc)
        }
    }
    public translateToScene(type: ESceneType, loc: mw.Vector = mw.Vector.zero) {
        this.hideBasicUI();
        mw.UIService.show(Transation, this.getSceneName(type), () => {
            this.showBasicUI();
            // if (ModuleService.getModule(NewGuideModuleC).getCurrentGuidingID() === 1041) {
            //     mw.UIService.hide(BasicView);
            // }
            mw.UIService.hide(Transation)
            this.enterSceneDirectly(type, loc)
        })
    }
    public enterSceneDirectly(type: ESceneType, loc: mw.Vector = mw.Vector.zero) {
        this._interactiveType = EInteractiveType.None;
        switch (type) {
            case ESceneType.Hall:
                EffectMgr.instance().ChangeScene(EffectScene.EffectHall);
                break;
            case ESceneType.Bussiness:
                EffectMgr.instance().ChangeScene(EffectScene.EffectBusiness);
                break;
            case ESceneType.Stable:
                // EffectMgr.instance().ChangeScene(EffectScene.EffectHall);
                break;
            case ESceneType.Breed:
                EffectMgr.instance().ChangeScene(EffectScene.EffectBreed);
                this._interactiveType = EInteractiveType.Breed;
                break;
            case ESceneType.Shop:
                EffectMgr.instance().ChangeScene(EffectScene.EffectBusiness);
                this._interactiveType = EInteractiveType.Shop;
                break;
            case ESceneType.Bet:
                EffectMgr.instance().ChangeScene(EffectScene.EffectBusiness);
                this._interactiveType = EInteractiveType.Guess;
                break;
            case ESceneType.Sign:
                EffectMgr.instance().ChangeScene(EffectScene.EffectBusiness);
                this._interactiveType = EInteractiveType.SignUp;
                break;
            default:
                console.log("进入场景出错了！");
                break;
        }

        this.server.net_enterScene(type, loc)
    }

    public getSceneName(type: ESceneType) {
        let name = ''
        switch (type) {
            case ESceneType.Hall:
                name = GameConfig.Language.TransformUI_Hall.Value
                break;
            case ESceneType.Bussiness:
                name = GameConfig.Language.TransformUI_Bussiness.Value
                break;
            case ESceneType.Stable:
                name = GameConfig.Language.TransformUI_Stable.Value
                break;
            case ESceneType.Breed:
                name = GameConfig.Language.TransformUI_Breed.Value
                break;
            case ESceneType.Shop:
                name = GameConfig.Language.TransformUI_Shop.Value
                break;
            case ESceneType.Bet:
                name = GameConfig.Language.TransformUI_Bet.Value
                break;
            case ESceneType.Sign:
                name = GameConfig.Language.TransformUI_Sign.Value
                break;
            default:
                break;
        }
        return name
    }

    /**
     * 获取当前交互触发类型
     * @returns 当前交互触发类型
     */
    public getInteractiveType(): EInteractiveType {
        let ret: EInteractiveType;
        ret = this._interactiveType;
        this._interactiveType = EInteractiveType.None;
        return ret;
    }

    //设置镜头
    public setCamera(type: ESceneType) {
        let char = Player.localPlayer.character
        let targetRot = this.getSceneInfo(type).cameraFocusRot
        ModifiedCameraSystem.setOverrideCameraRotation(targetRot.clone());
        Scheduler.TimeStart(() => {
            ModifiedCameraSystem.resetOverrideCameraRotation()
        }, 0.1)
    }

    /**
     * 切换场景
     * @param type 
     */
    public net_enterScene(type: ESceneType) {

        let bagModule = ModuleService.getModule(BagMouduleC)
        this.setCamera(type)
        bagModule.leaveStable()
        SoundHelper.instance().play(1022)
        switch (type) {
            case ESceneType.Hall:
                SoundHelper.instance().play(1006)
                break;
            case ESceneType.Breed:
                SoundHelper.instance().play(1006)
                break;
            case ESceneType.Stable:
                SoundHelper.instance().play(1006)
                bagModule.entarStable()
                break;
            case ESceneType.Bussiness:
                SoundHelper.instance().play(1015)
                break;
            case ESceneType.Shop:
                SoundHelper.instance().play(1015)
                break
            case ESceneType.Bet:
                SoundHelper.instance().play(1015)
                break
            case ESceneType.Sign:
                SoundHelper.instance().play(1015)
                break
            default:
                break;
        }
        this._curScene = type

    }

    public getSceneType() {
        return this._curScene
    }

    /**
     * 隐藏所有UI
     */
    public hideAllUI() {
        mw.UIService.hide(GuessUI);
        // BreedMgr.instance().stopBreed();
        ModuleService.getModule(BreedModuleC).stopBreed();
        mw.UIService.getUI(InteractiveUI).leave();
        mw.UIService.hide(HorseBagUI);
        mw.UIService.hide(GrowUI);
        mw.UIService.hide(TouchUI);
        mw.UIService.hide(PopWindowUI);
        ModuleService.getModule(ShopModuleC).stopTrading();
        ModuleService.getModule(PlayerModuleC).hideBasicUI();
        ModuleService.getModule(BagMouduleC).leaveStable()
    }

    private getSceneInfo(type: ESceneType) {
        let retInfo: ISceneInfo
        for (const info of SceneInfos) {
            if (info.type == type) {
                retInfo = info
                break
            }
        }
        return retInfo
    }

    public getCurSceneBirthRot(type: ESceneType) {
        return this.getSceneInfo(type).birthRot
    }

    public getCurSceneBirthLoc(type: ESceneType) {
        return this.getSceneInfo(type).birthPos
    }

    // /**
    //  * 请求出战马匹
    //  * @param index 
    //  */
    // public reqEquipHorse() {
    //     let allHorse = ModuleService.getModule(BagMouduleC).getAllMatureHorse()
    //     if (!allHorse || allHorse.length <= 0) {
    //         Tips.showTips(GameConfig.Language[ErrorCode[1010]].Value)
    //         return
    //     }

    //     let horse = ModuleService.getModule(BagMouduleC).getCurFollowingHorse()
    //     let follow: IHorseInfo
    //     if (horse) {
    //         follow = horse.getHorseInfo()
    //     }

    //     if (!horse || follow.property.somatoType == EHorseSomatoType.Filly) {
    //         Tips.showTips(GameConfig.Language[ErrorCode[1025]].Value)
    //     } else {
    //         this.server.net_equipHorse(follow)
    //     }
    // }


    // /**
    // * 请求卸掉马匹
    // * 
    // */
    // public reqUnEquipHorse() {
    //     this.server.net_unEquipHorse()
    // }

    /**
     * 选择出战马匹返回
     * @param playerId 
     * @param index 
     * @param info 
     */
    public net_onEquipHorse(playerId, info: IHorseInfo, isUpdate: boolean) {
        if (playerId == Player.localPlayer.playerId) {
            if (!isUpdate) {
                Tips.showTips(GameConfig.Language[ErrorCode[1011]].Value)
            }
            this._equipedHorse.set(playerId, info)
        }
    }

    public net_onUnEquipHorse(playerId: number) {
        this._equipedHorse.delete(playerId)
    }

    public hasEquipedHorse() {
        return this._equipedHorse.has(Player.localPlayer.playerId)
    }

    /**
     * 金币改变
     * @param total 
     * @param val 
     * @param delayShow 是否立即刷新UI
     */
    public net_onMoneyChagne(total: number, val: number, delayShow: boolean = false) {
        this.data.setMoney(total)
        if (!delayShow) {
            SoundHelper.instance().play(1037)
            emitter.emit(GameEvents.EVNET_MONEY_CHANGE, total, val)
        }
    }

    public costMoney(value: number) {
        let allow = this.server.net_costMoney(value);
        return allow;
    }


    public getMoney() { return this.data.getMoney() }

    public net_onDiamondChagne(total: number, val: number, delayShow: boolean = false) {
        this.data.setDiamond(total)
        if (!delayShow) {
            SoundHelper.instance().play(1037)
            emitter.emit(GameEvents.EVNET_DIAMOND_CHANGE, total, val)
        }
    }

    public getDiamond() { return this.data.getDiamond() }

    public getPlayerName() {
        return this.data.getPlayerName()
    }


    //获取出马场时间
    public getLeaveFarmTime() {
        return this.data.getLeabeFarmTime()
    }

    /**
     * 获得对话内容
     * @param index 对话类型
     * @returns 对话内容
     */
    public getTalkInfo(index: ETalkIndex): string {
        if (Number(index) == -1 || Number(index) > this.data.getTalks().length - 1) {
            return "找不到数据"
        }
        let talkData = this.data.getTalkNum(index)
        let num = talkData.index;
        let str = this.getTalkStr(index);
        let ret: ILanguageElement = GameConfig.Language.findElement("Name", str + num);
        while (!ret) {
            num--;
            if (num < 0) {
                return "ERROR";
            }
            ret = GameConfig.Language.findElement("Name", str + num);
        }
        return ret.Value;
    }

    /**
     * 获得对话是第几句
     * @param index 对话类型
     * @returns 序号
     */
    public getTalkIndex(index: ETalkIndex): number {
        let num = this.data.getTalkNum(index).index;
        return num;
    }

    /**
     * 改变对话序号
     * @param index 对话类型
     */
    public reqChangeTalkNum(index: ETalkIndex) {
        if (Number(index) == -1 || Number(index) > this.data.getTalks().length - 1) {
            return
        }
        let talkData = this.data.getTalkNum(index)
        let num = talkData.index + 1;
        let str = this.getTalkStr(index);
        let ret: ILanguageElement = GameConfig.Language.findElement("Name", str + num);

        if (!ret) {
            if (talkData.type == ETalkWay.RepetLast) {
                num -= 1
            }
            else {
                num = 1
            }
        }

        // while (!ret) {
        //     num--;
        //     if (num < 0) {
        //         num = 1;
        //         console.log("reqChangeTalkNum ERROR");
        //         break;
        //     }
        //     ret = GameConfig.Language.findElement("Name", str + num);
        // }
        this.server.net_changeTalkNum(index, num);
    }

    /**
     * 获取对话在多语言表里对应的字段
     * @param index 类型
     * @returns 多语言表里的KEY
     */
    private getTalkStr(index: ETalkIndex): string {
        let str = "";
        switch (index) {
            case ETalkIndex.SignUp:
                str = "Uncle_talk";
                break;
            case ETalkIndex.Shop:
                str = "Find_talk";
                break;
            case ETalkIndex.Guess:
                str = "Rich_talk";
                break;
            case ETalkIndex.Breed:
                str = "Breed_talk";
                break;
            case ETalkIndex.Shit:
                str = "Shit_talk";
                break;
            case ETalkIndex.Unlock:
                str = "Find_gemsask";
                break;
            case ETalkIndex.SignUPNone:
                str = "Uncle_none";
                break;
            case ETalkIndex.ShopNone:
                str = "Find_none";
                break;
            case ETalkIndex.GuessNone:
                str = "Rich_none";
                break;
            case ETalkIndex.BreedNone:
                str = "Breed_none";
                break;
            case ETalkIndex.ShitNone:
                str = "Shit_none";
                break;
            case ETalkIndex.UnlockNone:
                str = "Find_gemnone";
                break;
            case ETalkIndex.UnlockSuccess:
                str = "Find_gemnew";
                break;
            case ETalkIndex.UncleSmall:
                str = "Uncle_small";
                break;
            case ETalkIndex.AdoptPony:
                str = "Breed_horse";
                break;
            case ETalkIndex.UncleRace:
                str = "Uncle_race";
                break;
            case ETalkIndex.UncleTips:
                str = "Uncle_tip";
                break;
            default:
                str = "ERROR"
                console.log("获取对话内容出错了");
                break;
        }
        return str;
    }

    //请求计算离线收益
    public reqCalOutLineReward() {
        this.server.net_calOutLineReward()
    }


    public net_onCalOutLineReward(time: number) {
        ModuleService.getModule(StableModuleC).outLine(time)
    }


    public getEquipHorseInfo() {
        return this._equipedHorse.get(Player.localPlayer.playerId)
    }

    protected onEnterScene(sceneType: number): void {
        this.uiLanguage();
    }

    private uiLanguage() {
        let allUI = GameConfig.Global.getElement(1053).Parameter4[0]; //所有3dui
        if (!allUI) {
            return;
        }
        allUI.forEach(async item => {
            let top = (await GameObject.asyncFindGameObjectById(item)) as mw.UIWidget;
            if (!top) {
                console.log("guan log uiLanguage top:" + top + ",item:" + item);
                return;
            }
            let uiRoot = top.getTargetUIWidget().rootContent;
            for (let i = 0; i < uiRoot.getChildrenCount(); i++) {
                let item = uiRoot.getChildAt(i);
                if (!(item instanceof mw.TextBlock)) {
                    continue;
                }
                let ui = item as mw.TextBlock;
                let key: string = ui.text;
                if (key) {
                    let data = Utils.getLanguage(key);
                    if (data) {
                        ui.text = data.info;
                        if (data.size > 0) {
                            ui.fontSize = data.size;
                        }
                    }
                }
            }
        });
    }
}


/******************************************************************************************************************* */



export class PlayerModuleS extends ModuleS<PlayerModuleC, PlayerModuleData> {
    //出战马匹
    private _equipedHorse: Map<number, IHorseInfo> = new Map()

    private _loginPlayers: number[] = []
    // private _birthInfos: PlayerBirthInfo[] = []

    private _scene: ISceneInfo[] = []

    onStart(): void {
        DataCenterS.onPlayerLeave.add((player) => {
            let data = this.getPlayerData(player.playerId)
            data.setLeaveFarmTime(Date.now())
            this.deletePlayer(player.playerId)
        })

        DataCenterS.onPlayerJoin.add(player => {
            let data = this.getPlayerData(player.playerId)
            if (data.getLeabeFarmTime() <= 0) {
                data.setLeaveFarmTime(Date.now())
            }
        })

        for (const info of SceneInfos) {
            GameObject.asyncFindGameObjectById(info.birthGuid).then((trigger) => {
                info.birthPos = trigger.worldTransform.position
                info.birthRot = trigger.worldTransform.rotation
            })
        }
    }

    private addPlayer(id: number) {
        if (!this._loginPlayers.includes(id)) {
            this._loginPlayers.push(id)
        }
    }

    private deletePlayer(id: number) {
        for (let i = this._loginPlayers.length - 1; i >= 0; i--) {
            if (this._loginPlayers[i] == id) {
                this._loginPlayers.splice(i, 1)
                break
            }
        }
    }

    public getAllPlayers() {
        return this._loginPlayers
    }

    /**
     * 进入游戏
     * @param sceneType 
     */
    public net_enterGame(playerName: string) {
        this.getPlayerData(this.currentPlayerId).setPlayerName(playerName)

        this.addPlayer(this.currentPlayerId)

        this.getAllClient().net_onPlayerJoin(this.currentPlayerId, playerName);
        this.enterScene(this.currentPlayerId, ESceneType.Hall)
        ModuleService.getModule(WeatherModuleS).syncWeatherInfo(this.currentPlayerId)
        ModuleService.getModule(RacingModuleS).syncRacingInfo(this.currentPlayerId)
        this.getClient(this.currentPlayerId).net_LoginInComplete()
    }


    /**
     * 进入场景
     * @param sceneType 
     */
    public net_enterScene(sceneType: ESceneType, loc: mw.Vector) {
        this.enterScene(this.currentPlayerId, sceneType, loc)
    }

    /**
     * 选择出战马匹
     * @param index 
     */
    public net_equipHorse(info: IHorseInfo) {
        let id = this.currentPlayerId
        this.equipHorse(id, info)
    }

    public equipHorse(id: number, info: IHorseInfo, isUpdate: boolean = false) {
        console.log("装备马匹", id)
        this._equipedHorse.set(id, info)
        this.getAllClient().net_onEquipHorse(id, info, isUpdate)
    }

    public unEquipHorse(id: number) {
        if (!this._equipedHorse.has(id)) {
            return;
        }
        this._equipedHorse.delete(id)
        this.getAllClient().net_onUnEquipHorse(id)
    }

    /**
     * 改变对话序号
     * @param index 对话类型
     * @param num 序号
     */
    public net_changeTalkNum(index: ETalkIndex, num: number) {
        this.currentData.changeTalkNum(index, num);
    }

    /**
     * 获取对话序号
     * @param playerID 玩家id  
     * @param index 对话类型
     * @returns 对话序号
     */
    public getTalkNum(playerID: number, index: ETalkIndex): number {
        return this.getPlayerData(playerID).getTalkNum(index).index;
    }

    /**
     * 进入场景
     * @param playerId 玩家id
     * @param sceneType 进入场景类型
     * @param loc 新的坐标
     */
    public enterScene(playerId: number, sceneType: ESceneType, loc?: mw.Vector): void {
        const player = Player.getPlayer(playerId)
        if (!player) { return }
        let info = this.getSceneInfo(sceneType)

        if (info) {
            let pos: mw.Vector
            if (loc && !loc.strictEquals(mw.Vector.zero)) {
                pos = loc;
            } else {
                pos = info.birthPos.clone()
            }
            player.character.worldTransform.position = pos
            this.getClient(playerId).net_enterScene(sceneType)
        }
    }

    /**
     * 获取场景信息
     * @param type 场景类型
     * @returns 场景信息
     */
    private getSceneInfo(type: ESceneType): ISceneInfo {
        let retInfo: ISceneInfo
        for (const info of SceneInfos) {
            if (info.type == type) {
                retInfo = info
                break
            }
        }
        return retInfo
    }

    /**
     * 增加金币
     * @param id 玩家id
     * @param val 增加金币数量
     * @param delayShow 是否延迟刷新
     */
    public addMoney(id: number, val: number, delayShow: boolean = false) {
        const playerData = this.getPlayerData(id)
        if (!playerData) {
            return;
        }
        playerData.addMoney(val)
        this.getClient(id).net_onMoneyChagne(playerData.getMoney(), val, delayShow)
    }

    /**
     * 花费货币
     * @param id 玩家id
     * @param value 花费金币数量
     * @returns 金币是否足够
     */
    public costMoney(id: number, value: number): boolean {
        const playerData = this.getPlayerData(id)
        if (playerData.getMoney() < value) { return false }
        playerData.costMoney(value)
        this.getClient(id).net_onMoneyChagne(playerData.getMoney(), value)
        return true
    }
    /**
     * 客户端请求花费金币
     * @param value 花费数量
     * @returns 是否金币足够
     */
    public net_costMoney(value: number) {
        return this.costMoney(this.currentPlayerId, value);
    }

    /**
     * 添加钻石，只能在服务器上调用，不能用客户端来调
     * @param id 玩家id
     * @param value 增加钻石数量
     * @param delayShow 是否延迟刷新
     */
    public addDiamond(id: number, value: number, delayShow: boolean = false) {
        const playerData = this.getPlayerData(id)
        playerData.addDiamond(value)
        this.getClient(id).net_onDiamondChagne(playerData.getDiamond(), value, delayShow)
    }

    /**
     * 消费钻石
     * @param id 玩家id
     * @param value 消耗数量
     * @returns 钻石是否足够
     */
    public costDiamond(id: number, value: number) {
        const playerData = this.getPlayerData(id)
        if (playerData.getDiamond() < value) { return false }
        playerData.costDiamond(value)
        this.getClient(id).net_onDiamondChagne(playerData.getDiamond(), value)
        return true
    }

    /**
     * 客户端请求花费钻石
     * @param value 花费数量
     * @returns 钻石是否足够
     */
    public net_costDiamond(value: number) {
        return this.costDiamond(this.currentPlayerId, value);
    }

    /**
     * 设置玩家离开时间
     * @param time 离开时间
     */
    public setLeaveFarmTime(time: number) {
        this.currentData.setLeaveFarmTime(time)
    }

    /**
     * 计算离线收益
     */
    public net_calOutLineReward() {
        let lastTime = this.currentData.getLeabeFarmTime()
        if (lastTime <= 0) {
            return
        }
        let now = Date.now()
        let passedTime = ((now - lastTime) / 1000) - GameConfig.Global.getElement(1001).Parameter1

        this.getClient(this.currentPlayerId).net_onCalOutLineReward(passedTime)
    }

    /**
     * 获得玩家金币数量
     * @param id 玩家id
     * @returns 玩家金币数量
     */
    public getMoney(id: number) {
        const playerData = this.getPlayerData(id)
        return playerData.getMoney()
    }

    /**
     * 获得玩家名称
     * @param id 
     * @returns 
     */
    public getPlayerName(id) {
        return this.getPlayerData(id).getPlayerName()
    }

    public getEquipHorseInfo(id: number) {
        return this._equipedHorse.get(id)
    }

    public hasEquipedHorse(playerID: number) {
        return this._equipedHorse.has(playerID)
    }

    public setDiamon(playerID: number, num: number) {
        let data = this.getPlayerData(playerID);
        if (data.getDiamond() < num) {
            let add = num - data.getDiamond();
            this.addDiamond(playerID, add);
        }
    }

}
