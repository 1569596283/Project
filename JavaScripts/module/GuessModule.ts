/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-16 18:25:17
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-10-15 10:16:27
 */
import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin"
import { ECompetitionState, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import GuessResultUI, { IGuessResultInfo } from "../ui/GuessResultUI";
import GuessUI from "../ui/GuessUI";
import Tips from "../ui/Tips";
import Utils from "../utils/Utils";
import { PlayerModuleS } from "./PlayerModule";
import { RacingModuleC, RacingModuleS } from "./RacingModule";

//#region GuessModuleC
/**
 * 玩家模块逻辑
 */
export class GuessModuleC extends ModuleC<GuessModuleS, null> {
    /** 奖池，每匹马及对应的下注数量 */
    private _jackpot: number[] = [];
    /** 玩家下注数量 */
    private _playerJackpot: number[] = [];
    /** 是否在刷新的时候显示UI */
    private _showUI: boolean = false;
    /** 强度数组 */
    private _strengthArr: number[] = [];
    /** 强度和 */
    private _strengthSum: number = 0;
    /** 强度最小值 */
    private _strengthMin: number = 0;
    private _resultInfo: IGuessResultInfo;

    /**
     * 显示GuessUI
     */
    public showGuessUI() {
        let state = ModuleService.getModule(RacingModuleC).getCompotitionState();
        if (state != ECompetitionState.Bet) {
            Tips.showTips(GameConfig.Language.Tips_waitopen.Value);
            return;
        }
        if (!this._showUI) {
            this._showUI = true;
            this.calculateStrength();
            this.server.net_join();
        }
    }

    public onStart(): void {
        super.onStart()
    }

    /**
     * 下注
     * @param index 下注的马的序号
     * @param money 下注的金额
     */
    public bet(index: number, money: number) {
        this.server.net_bet(index, money);
    }

    /**
     * 获得玩家下注的马的序号
     * @returns 玩家下注的马的序号的数组
     */
    public getPlayaerBet() {
        let arr = [];
        for (let i = 0; i < this._playerJackpot.length; i++) {
            if (this._playerJackpot[i] > 0) {
                arr.push(i);
            }
        }
        return arr;
    }

    /**
     * 服务端同步数据，同时判断是否需要显示GuessUI
     */
    public net_freash(jackpot: number[], playerJackpot: number[]) {
        this._jackpot = jackpot;
        this._playerJackpot = playerJackpot;
        let guessUI = mw.UIService.getUI(GuessUI);
        if (guessUI.visible == true) {
            guessUI.refreshInfo();
        }
        if (this._showUI) {
            mw.UIService.show(GuessUI);
            this._showUI = false;
        }
    }

    /**
     * 玩家下注最多的马的序号
     */
    public getHorseIndex(): number {
        let max = 0;
        let index = 0;
        for (let i = 0; i < this._playerJackpot.length; i++) {
            let jackpot = this._playerJackpot[i];
            if (max < jackpot) {
                max = jackpot;
                index = i;
            }
        }
        return index;
    }

    /**
     * 获得这个序号的马的赔率
     * @param index 序号
     * @returns 赔率
     */
    public getHorseOdd(index: number): number {
        let all: number = 0;
        this._jackpot.forEach(jackpot => {
            all += (jackpot + GlobalVar.BET_DEFAULT);
        });
        return all * 0.7 / (this._jackpot[index] + GlobalVar.BET_DEFAULT);
    }

    /**
     * 获得这个序号的马所有玩家下注数
     * @param index 序号
     * @returns 下注数
     */
    public getHorseAll(index: number): number {
        if (this._jackpot.length <= 0) {
            return 0;
        }
        return this._jackpot[index];
    }

    /**
     * 获得这个序号的马该玩家下注数
     * @param index 序号
     * @returns 下注数
     */
    public getHorsePlayer(index: number) {
        if (this._playerJackpot.length <= 0) {
            return 0;
        }
        return this._playerJackpot[index];
    }

    /**
     * 显示下注结算界面
     * @param index 夺冠马的序号
     */
    public showGuessResult() {
        if (this._resultInfo) {
            mw.UIService.show(GuessResultUI, this._resultInfo);
        }
        this._resultInfo = null;
    }

    /** 
     * 结算
     */
    public result(index: number) {

        let arr = this.getPlayaerBet();
        if (arr.length <= 0) {
            return;
        }

        let cost = 0;
        this._playerJackpot.forEach((value: number) => {
            cost += value;
        })
        let income = this.getHorseOdd(index) * this._playerJackpot[index];

        let winWay = ModuleService.getModule(RacingModuleC).getRacingWayByIndex(index) + 1;
        let betArray = [];
        arr.forEach((index) => {
            let way = ModuleService.getModule(RacingModuleC).getRacingWayByIndex(index) + 1;
            betArray.push(way);
        })

        let guessResultInfo: IGuessResultInfo = {
            income: Math.floor(income),
            cost: Math.floor(cost),
            winer: winWay,
            betArr: betArray
        }
        this._resultInfo = guessResultInfo;
        this._jackpot = [];
        this._playerJackpot = [];
    }

    /**
     * 获得指定马匹的胜率
     * @param index 马的序号（报名列表里的序号）
     * @returns 胜率
     */
    public getWinRate(index: number): number {
        let curStrength = this._strengthArr[index];
        let rate = (curStrength - 0.9 * this._strengthMin) / (this._strengthSum - 7.2 * this._strengthMin);
        return rate;
    }

    /**
     * 计算每匹马的强度
     */
    private calculateStrength() {
        this._strengthArr = [];
        this._strengthSum = 0;
        this._strengthMin = Infinity;
        let horses = ModuleService.getModule(RacingModuleC).getParticleHorses();
        horses.forEach((horse) => {
            let info = horse.getHorseInfo();
            let property = info.property;
            let strength = 0;
            strength = (12000 * property.acceleratedSpeed * property.speed) /
                (240000 * property.acceleratedSpeed + Math.sqrt(property.speed) + Math.sqrt(property.startRunSpeed) - 2 * property.speed * property.startRunSpeed);
            this._strengthArr.push(strength);
            this._strengthSum += strength;
            this._strengthMin = Math.min(this._strengthMin, strength);
        })
    }
}
//#endregion


//#region GuessModuleS
export class GuessModuleS extends ModuleS<GuessModuleC, null> {
    /** 奖池，每匹马及对应的下注数量 */
    private _jackpot: number[] = [];

    /** 玩家及玩家下注的金额 */
    private _playerJackpot: Map<number, number[]> = new Map();

    /** 下注计时器 */
    private _betInterval: number = 0;

    /** AI 下注是的识别字符 */
    private _AIid: number = -1;

    /** 胜率数组 */
    private _winRateArr: number[] = [];

    public net_join() {
        let arr = [0, 0, 0, 0, 0, 0, 0, 0];
        if (!this._playerJackpot.has(this.currentPlayerId)) {
            this._playerJackpot.set(this.currentPlayerId, arr);
        } else {
            arr = this._playerJackpot.get(this.currentPlayerId);
        }
        this.getClient(this.currentPlayerId).net_freash(this._jackpot, arr);
    }

    public onStart(): void {

    }

    /**
     * 可以开始下注
     */
    public opening() {
        this._jackpot = [];
        this._playerJackpot.clear();
        for (let i = 0; i < 8; i++) {
            this._jackpot.push(0);
        }
        this.calculateWinRate();
        this._betInterval = setInterval(() => {
            if (ModuleService.getModule(RacingModuleS).getCompetition().getStateInfo().state != ECompetitionState.Bet) {
                clearInterval(this._betInterval);
                return;
            }
            this.AIbet();
        }, GameConfig.Global.getElement(1036).Parameter1 * 1000);
    }

    /**
     * 下注
     * @param index 马的序号
     * @param money 下注数
     */
    public net_bet(index: number, money: number) {
        if (!this._playerJackpot.has(this.currentPlayerId)) {
            let arr = [0, 0, 0, 0, 0, 0, 0, 0];
            this._playerJackpot.set(this.currentPlayerId, arr);
        }
        ModuleService.getModule(PlayerModuleS).costMoney(this.currentPlayerId, money);
        let arr = this._playerJackpot.get(this.currentPlayerId);
        arr[index] += money;
        this._jackpot[index] += money;
        this._playerJackpot.forEach((value: number[], key: number) => {
            if (key > 0) {
                this.getClient(key).net_freash(this._jackpot, value);
            }
        })
    }

    /**
     * AI 下注
     */
    private AIbet() {
        let arr = [0, 0, 0, 0, 0, 0, 0, 0];
        let rateArr: { obj: any; rate: number; }[] = [];
        let moneyArr = GameConfig.Global.getElement(1036).Parameter2;
        for (let i = 0; i < arr.length; i++) {
            let rate = { obj: i, rate: this._winRateArr[i] * 100 }
            rateArr.push(rate);
        }
        for (let i = 0; i < 3; i++) {
            let index: number = Utils.RandomObjByRate(rateArr);
            let money = moneyArr[Math.floor(moneyArr.length * Math.random())];
            this._jackpot[index] += money;
            arr[index] += money;
        }
        this._playerJackpot.set(this._AIid, arr);
        this._AIid--;
        this._playerJackpot.forEach((value: number[], key: number) => {
            if (key > 0) {
                this.getClient(key).net_freash(this._jackpot, value);
            }
        })
    }

    /**
     * 计算每匹马的强度
     */
    private calculateWinRate() {
        this._winRateArr = [];
        let strengthArr = [];
        let strengthSum = 0;
        let strengthMin = Infinity;
        let horses = ModuleService.getModule(RacingModuleS).getParticleHorses();
        horses.forEach((horse) => {
            let info = horse.getHorseInfo();
            let property = info.property;
            let strength = 0;
            strength = (12000 * property.acceleratedSpeed * property.speed) /
                (240000 * property.acceleratedSpeed + Math.sqrt(property.speed) + Math.sqrt(property.startRunSpeed) - 2 * property.speed * property.startRunSpeed);
            strengthArr.push(strength);
            strengthSum += strength;
            strengthMin = Math.min(strengthMin, strength);
        })

        for (let i = 0; i < horses.length; i++) {
            let curStrength = strengthArr[i];
            let rate = (curStrength - 0.9 * strengthMin) / (strengthSum - 7.2 * strengthMin);
            this._winRateArr.push(rate);
        }
    }


    /**
     * 结算
     * @param index 获得冠军的马的序号
     */
    public settlement(index: number) {
        let all: number = 0;
        this._jackpot.forEach(jackpot => {
            all += (jackpot + GlobalVar.BET_DEFAULT);
        });
        let odd = all * 0.7 / (this._jackpot[index] + GlobalVar.BET_DEFAULT);
        const PLAYERS = ModuleService.getModule(PlayerModuleS)
        this._playerJackpot.forEach((value: number[], key: number) => {
            if (key > 0) {
                let income = odd * value[index];
                income = Math.floor(income);
                PLAYERS.addMoney(key, income, true);
            }
        })
    }

    /**
     * 获取单个马身上的下注金额
     */
    public getHorseBetAmount(index: number) {
        return this._jackpot[index]
    }

    /**
    * 获取单个马身上的下注玩家数
    */
    public getHorseBetPlayerCounts(index: number) {
        let counts = 0
        this._playerJackpot.forEach((arr) => {
            if (arr[index] > 0) {
                counts++
            }
        })
        return counts
    }
}

//#endregion
