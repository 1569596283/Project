/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2022-12-14 12:56:47
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-11-06 11:34:05
 * @FilePath: \horseracing\JavaScripts\module\ShopModule.ts
 * @Description: 
 * 商店模块
 * Copyright (c) 2022 by 代纯 chun.dai@appshahe.com, All Rights Reserved. 
 */

import * as odin from 'odin'
import { EPartType, GlobalVar, IHorseInfo, IPartInfo } from '../Common';
import { GameConfig } from '../config/GameConfig';
import { IHorseElement } from '../config/Horse';
import Property from '../logic/Property';
import ShopInnerUI from '../ui/ShopInnerUI';
import ShopUI from '../ui/ShopUI';
import Tips from '../ui/Tips';
import Utils from '../utils/Utils';
import { BagMouduleS } from './BagMoudule';
import { PlayerModuleS } from './PlayerModule';
import { SyntheticModuleC, SyntheticModuleS } from './SyntheticModule';


class ShopItem {
    itemID: number
    isFree: boolean//第一次免费
}

export class ShopModuleData extends Subdata {
    //解锁的索引
    @Decorator.persistence()
    public items: ShopItem[]

    protected initDefaultData(): void {
        super.initDefaultData();
        this._addDefault()
        this.save(true);
    }

    protected _addDefault() {
        let item1: ShopItem = {
            itemID: 1001,
            isFree: false
        }
        let item2: ShopItem = {
            itemID: 1002,
            isFree: false
        }
        this.items = []
        this.items.push(item1)
        this.items.push(item2)
    }


    //解锁
    public unlock(itemID: number) {
        let filter = this.items.filter(e => {
            if (e.itemID == itemID) {
                return
            }
        })

        if (filter.length == 1) {
            return false
        }

        let isFind: boolean = false
        let item: ShopItem = {
            itemID: itemID,
            isFree: true
        }

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemID > itemID) {
                this.items.splice(i, 0, item)
                isFind = true
                break
            }
        }

        if (!isFind) {
            this.items.push(item)
        }
        return true
    }

    public getUnlockLinageIndex() {
        let vec: number[] = []
        this.items.forEach(item => {
            vec.push(item.itemID)
        })

        return vec
    }

    public free(itemID: number) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemID == itemID) {
                this.items[i].isFree = false
                return true
            }
        }
        return false
    }

    public getUnlockNum() {
        return this.items.length - 2
    }

    public getIsFree(itemID: number) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemID == itemID) {
                return this.items[i].isFree
            }
        }

    }
}

export class ShopModuleC extends ModuleC<ShopModuleS, ShopModuleData> {
    /** 找马的配置id */
    private _findCfgId: number = 0;
    public reqUnlock(cfgId: number) {
        this.server.net_Unlock(cfgId)
    }


    public reqFind(cfgId: number) {
        this._findCfgId = cfgId;
        this.server.net_find(cfgId)
    }

    public async reqBuy(index: number) {
        this._findCfgId = 0;
        this.server.net_buy(index);
    }

    /**
     * @description: 解锁血统
     * @return {*}
     */
    public net_onUnlock(cfgId: number, result: boolean) {
        if (result) {
            this.data.unlock(cfgId)
            mw.UIService.getUI(ShopUI).unlock(cfgId)
        } else {
            Tips.showTips(GameConfig.Language.UnlockDefeat.Value)
        }
    }

    public net_onFree(cfgId: number, result: boolean) {
        if (result) {
            this.data.free(cfgId)
            // mw.UIService.getUI(ShopUI).unlock(cfgId)
        }
        // else {
        //     Tips.showTips(GameConfig.Language.UnlockDefeat.Value)
        // }
    }

    public net_find(horseInfos: IHorseInfo[]) {
        mw.UIService.getUI(ShopUI).onFind(horseInfos)
    }

    public getAllUnlockInfo() {
        return this.data.getUnlockLinageIndex()
    }

    public getIsFree(cfgid: number) {
        return this.data.getIsFree(cfgid)
    }

    public getUnlockNum() {
        return this.data.getUnlockNum()
    }

    public stopTrading() {
        if (this._findCfgId) {
            this.server.net_stopTrade(this._findCfgId);
        }
        this._findCfgId = 0;
        mw.UIService.hide(ShopUI);
        mw.UIService.hide(ShopInnerUI);
    }

}

export class ShopModuleS extends ModuleS<ShopModuleC, ShopModuleData> {

    private _findResult: Map<number, IHorseInfo[]> = new Map();
    /**
     * 解锁马
     * @param cfgId |
     */
    public net_Unlock(cfgId: number) {
        this.unlock(this.currentPlayerId, cfgId)
    }

    /**
    * 解锁马
    * @param playerId 
    * @param cfgId 
    */
    public free(cfgId: number) {
        let resutl = this.currentData.free(cfgId)
        if (resutl) {

        }
        this.getClient(this.currentPlayerId).net_onFree(cfgId, resutl)
    }

    /**
     * 解锁马
     * @param playerId 
     * @param cfgId 
     */
    public unlock(playerId: number, cfgId: number) {
        const cost = GameConfig.Global.getElement(1051).Parameter2
        const cost0 = cost[this.getUnlockNum()]
        let resutl = this.currentData.unlock(cfgId)
        if (resutl) {
            ModuleService.getModule(PlayerModuleS).costDiamond(playerId, cost0)
        }
        this.getClient(playerId).net_onUnlock(cfgId, resutl)
    }

    /**
     * 找马
     * @param cfgId 
     */
    public net_find(cfgId: number) {
        const cfg = GameConfig.Lineage.getElement(cfgId)
        if (!this.currentData.getIsFree(cfgId)) {
            ModuleService.getModule(PlayerModuleS).costDiamond(this.currentPlayerId, cfg.lineagePrice)
        } else {
            this.free(cfgId)
        }

        let horseList: IHorseElement[] = []
        let allHorseConfig = GameConfig.Horse.getAllElement()
        for (const horseConfig of allHorseConfig) {
            if (horseConfig.lineage == cfgId) {
                horseList.push(horseConfig)
            }
        }
        let arr = [];

        const rands = Utils.GetRandomUnRepeat(0, horseList.length, 3)
        for (let i = 0; i < rands.length; i++) {
            const horseId = horseList[rands[i]].ID
            const horseInfo = ModuleService.getModule(SyntheticModuleS).getRandomHorseInfoByHorseID(horseId);
            arr.push(horseInfo)
        }
        this._findResult.set(this.currentPlayerId, arr);
        this.getClient(this.currentPlayerId).net_find(arr)
    }

    /**
     * 停止交易，返还找马钻石
     * @param cfgId 找马的血统配置id
     */
    public net_stopTrade(cfgId: number) {
        const cfg = GameConfig.Lineage.getElement(cfgId);
        ModuleService.getModule(PlayerModuleS).addDiamond(this.currentPlayerId, cfg.lineagePrice)
    }

    public net_buy(index: number) {
        if (this._findResult.has(this.currentPlayerId)) {
            const horseInfo = this._findResult.get(this.currentPlayerId)[index];
            const price = ModuleService.getModule(SyntheticModuleS).getPrice(horseInfo.property);
            const success = ModuleService.getModule(PlayerModuleS).costDiamond(this.currentPlayerId, price)
            if (success) {
                ModuleService.getModule(BagMouduleS).addHorse(this.currentPlayerId, horseInfo);
            }
        }
    }

    public getUnlockNum() {
        return this.currentData.getUnlockNum()
    }
}

