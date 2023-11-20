import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
/*
* @Author: 代纯 chun.dai@appshahe.com
* @Date: 2022-12-13 15:53:47
* @LastEditors: 代纯 chun.dai@appshahe.com
* @LastEditTime: 2022-12-23 19:04:07
* @FilePath: \horseracing\JavaScripts\ui\TouchUI.ts
* @Description: 
* 
* Copyright (c) 2022 by 代纯 chun.dai@appshahe.com, All Rights Reserved. 
*/

import { oTraceError, oTrace, oTraceWarning, LogManager, AnalyticsUtil, IFightRole, AIMachine, AIState } from "odin";
import { CommonAssets, EHorseAnimation, EHorseSomatoType, EStableHorseState, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import { HoresModelC } from "../logic/HorseModel";
import StableHorse from "../logic/StableHorse";
import { BagMouduleC } from "../module/BagMoudule";
import { StableModuleC } from "../module/StableModule";
import TouchUI_Generate from "../ui-generate/ui/TouchUI_generate";
import Utils from "../utils/Utils";
import GrowUI from "./GrowUI";
import SoundHelper from "../utils/SoundHelper";

export default class TouchUI extends TouchUI_Generate {

    private _horse: StableHorse = null
    private _loveParticle: mw.Effect = null
    private _playerAnim: mw.Animation = null

    protected async onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
        this.button_feed.onClicked.add(() => {
            let index = this._horse.getHorseInfo().stableIndex
            mw.UIService.show(GrowUI, index)
            mw.UIService.hide(TouchUI)
        })
        this.button_tounch.onClicked.clear()
        this.button_tounch.onClicked.add(() => {
            const random = Utils.RangeFloat(0, 1)
            let player = Player.localPlayer.character
            this._playerAnim = PlayerManagerExtesion.rpcPlayAnimation(player, "14599")

            let horseObj = this._horse.getHorseObject()
            horseObj.playAnimation(EHorseAnimation.GetTop, 1, true)
            this._loveParticle.parent = null
            this._loveParticle.parent = horseObj.instance
            this._loveParticle.localTransform.position = (new mw.Vector(0, 0, 200))
            this._loveParticle.stop()
            this._loveParticle.play()

            let info = this._horse.getHorseInfo()

            if (info.property.somatoType == EHorseSomatoType.Filly) {
                SoundHelper.instance().play(1014, false, false)
            } else {
                SoundHelper.instance().play(1030, false, false)
            }

            if (random <= GameConfig.Global.getElement(1044).Parameter1) {
                let pos = this._horse.getHorseObject().instance.worldTransform.position
                ModuleService.getModule(StableModuleC).creatDiamond(info.ID, pos)
            }
            ModuleService.getModule(StableModuleC).fatCreateDelCd(info.ID)
        })

        if (!mw.AssetUtil.assetLoaded(CommonAssets.LoveEffect)) {
            await mw.AssetUtil.asyncDownloadAsset(CommonAssets.LoveEffect)
        }

        this._loveParticle = SpawnManager.spawn({ guid: CommonAssets.LoveEffect }) as mw.Effect
        this._loveParticle.loop = false
    }
    protected onShow(...params: any[]) {
        this._horse = params[0] as StableHorse

        if (this._horse.getHorseInfo().property.somatoType == EHorseSomatoType.Filly) {
            this.button_feed.visibility = mw.SlateVisibility.Visible
        }
        else {
            this.button_feed.visibility = mw.SlateVisibility.Hidden
        }
    }

    protected onHide() {
        // this._playerAnim && this._playerAnim.stop()
        // this._playerAnim = null

    }
}