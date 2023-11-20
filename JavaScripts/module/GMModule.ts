/*
 * @Author: jiezhong.zhang
 * @Date: 2023-01-11 10:52:04
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-10-15 10:16:15
 */
/**
 * 天气模块
 */
import * as odin from 'odin'
import { GameConfig } from '../config/GameConfig'
import { GameEvents } from '../GameEvents'
import GMView from '../ui/GMView'
import { emitter } from '../utils/Emitter'
import { RacingModuleC, RacingModuleS } from './RacingModule'
export class GMModuleC extends ModuleC<GMModuleS, null> {
    private _open: boolean = false
    onStart(): void {

        InputUtil.onKeyDown(mw.Keys.F5, () => {
            if (this._open) {
                mw.UIService.hide(GMView)
            } else {
                mw.UIService.show(GMView)
            }
            this._open = !this._open
        })
    }
    private _presetRacingWay: number
    public presetRacingWay(index: number) {
        this.server.net_presetRacingWay(index)
    }
    public net_onPresetRacingWay(index: number) {
        this._presetRacingWay = index
        emitter.emit(GameEvents.EVENT_PRESET_RACE_WAY, index)
    }

    public clearPresetRacingWay() {
        this.server.net_clearPresetRacingWay()
    }
    public net_onClearPresetRacingWay() {
        this._presetRacingWay = undefined
        emitter.emit(GameEvents.EVENT_PRESET_RACE_WAY)
    }

    public addBuff(buffId: number) {
        let horse = ModuleService.getModule(RacingModuleC).getPlayerHorse(this.localPlayerId)
        let config = GameConfig.Skill.getElement(buffId)
        if (!config || !horse) { return }

        this.server.net_addBuff(buffId)
    }

    public addBuffImpact(buffId: number) {
        let horse = ModuleService.getModule(RacingModuleC).getPlayerHorse(this.localPlayerId)
        let config = GameConfig.Skill.getElement(buffId)
        if (!config || !horse) { return }

        this.server.net_addBuffImpact(buffId)
    }

    public getPresetRacingWay() {
        return this._presetRacingWay
    }
}


export class GMModuleS extends ModuleS<GMModuleC, null> {
    private _presetRacingWay: Map<number, number> = new Map()
    private _presetBuffs: number[] = []

    public net_presetRacingWay(index: number) {
        this._presetRacingWay.set(this.currentPlayerId, index)
        this.getClient(this.currentPlayerId).net_onPresetRacingWay(index)
    }

    public net_clearPresetRacingWay() {
        this._presetRacingWay = undefined
        this.getClient(this.currentPlayerId).net_onClearPresetRacingWay()
    }

    public getPresetRacingWay(playerId: number) {
        return this._presetRacingWay.get(playerId)
    }

    public net_addBuff(buffId: number) {
        let horse = ModuleService.getModule(RacingModuleS).getPlayerHorse(this.currentPlayerId)
        if (horse) {
            horse.addBuff(buffId)
        }
    }

    public net_addBuffImpact(buffId: number) {
        let horse = ModuleService.getModule(RacingModuleS).getPlayerHorse(this.currentPlayerId)
        if (horse) {
            horse.addBuffImpact([buffId])
        }
    }
}