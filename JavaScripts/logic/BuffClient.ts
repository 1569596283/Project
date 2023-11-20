/*
 * @Author: pengcheng.zhang 
 * @Date: 2022-11-16 10:06:14 
 * @Last Modified by: pengcheng.zhang
 * @Last Modified time: 2022-11-28 14:22:43
 */

import { GameConfig } from "../config/GameConfig"
import { ISkillElement } from "../config/Skill"
import HorseClient from "./HorseClient"
import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin"
import { CommonAssets } from "../Common"
import { IWordUI, WorldShowUI, WorldUIModuleC } from "../module/WorldUIModule"

export default class BuffClient {
    protected _configId: number
    protected _config: ISkillElement
    protected _durationTiming: number = 0
    protected _active = false
    protected _wordUI: WorldShowUI = null


    protected _horse: HorseClient
    constructor(id: number, horse: HorseClient) {
        this._configId = id
        this._config = GameConfig.Skill.getElement(id)
        this._horse = horse
    }

    public getType() {
        return this._config.Type
    }

    public getConfig() {
        return this._config
    }

    public start() {
        this._active = true

        if (this._config.Talk > 0) {
            let say = GameConfig.TalkInfo.getElement(this._config.Talk).Talk
            let offset = GameConfig.TalkInfo.getElement(this._config.Talk).offsetPos

            let iWordUI: IWordUI = {
                playerID: Player.localPlayer.playerId,
                uiStr: CommonAssets.Competition_Talk3D,
                talkStr: [GameConfig.Language.getElement(say).Value],
                attachTarget: this._horse.getHorseObject().instance.gameObjectId,
                isInteval: false,
                isResident: false,
                offset: new mw.Vector(offset[0], offset[1], offset[2])
            }
            // ModuleService.getModule(WorldUIModuleC).reqAddToAllPlayer(iWordUI)
            this._wordUI = ModuleService.getModule(WorldUIModuleC).net_addWorldUI(iWordUI)
        }

        this.onStart()
    }


    public update(dt: number) {

    }


    public destroy() {
        this.onDestroy()

        this._wordUI && this._wordUI.destroy()

        this._active = false
        // this._horse.deleteBuffImpact([this._configId])
    }

    public getDuration() { return this._durationTiming }
    public getConfigId() { return this._configId }

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.bUseUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}