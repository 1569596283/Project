import { EBuffTargetType, EHorseState } from "../Common"
import { GameConfig } from "../config/GameConfig"
import { ISkillElement } from "../config/Skill"
import { RacingModuleS } from "../module/RacingModule"
import { WeatherModuleS } from "../module/WeatherModule"
import Utils from "../utils/Utils"
import HorseServer from "./HorseServer"

/**
 * buff类
 * 当前buff是玩家自动拥有的本身自己不起作用，
 * buff会根据条件满足时，向目标马匹施加当前相同的buffImpact。
 * 施加的buffImpact才会起作用
 */
export default class BuffServer {
    protected _configId: number
    protected _config: ISkillElement
    //持续时间
    protected _durationTiming: number = 0
    //触发次数
    protected _intervalCounts: number = 0
    protected _active = false
    //当前马匹
    protected _horse: HorseServer

    protected _checkInterval: number = 0

    /*****************************特定参数**********************************/
    //马匹的上次的排名
    protected _lastRankIndex: number

    constructor(id: number, horse: HorseServer) {
        this._configId = id
        this._config = GameConfig.Skill.getElement(id)
        this._horse = horse
    }

    /**
     * 条件
     * @returns 
     */
    public condition() {
        //距离条件
        let condition1 = this._config.Distance
            && (this._horse.getDistance() <= this._config.Distance[0] * this._horse.getMaxDistance() || this._horse.getDistance() >= this._config.Distance[1] * this._horse.getMaxDistance())
        //天气条件
        let condition2 = this._config.Weather && !this._config.Weather.includes(ModuleService.getModule(WeatherModuleS).getWeatherType())
        //跑道条件
        let condition3 = this._config.RacingWay && !this._config.RacingWay.includes(this._horse.getRacingWay())
        //超越条件
        let condition4 = this._config.Beyond && (this._horse.beyondState() != this._config.Beyond)// || this._lastRankIndex == this._horse.getRankIndex())//检测发现排名没变将不会处理
        //名次条件
        let condition5 = this._config.Rank && this._horse.getRankIndex() < this._config.Rank[0] && this._horse.getRankIndex() <= this._config.Rank[1]


        if (condition1 || condition2 || condition3 || condition4 || condition5) {
            return false
        }
        if (Math.random() > this._config.Chance) {
            return false
        }
        return true
    }

    protected start() {
        this._active = true
        this.addImpactBuff()
    }

    public addImpactBuff() {
        // console.log("添加buffImpact", this._configId)
        let condition4 = this._config.Beyond && this._horse.beyondState() == this._config.Beyond
        if (condition4) {
            //记录上次触发超越buff的排名
            this._lastRankIndex = this._horse.getRankIndex()
        }

        let targetIds: number[] = []
        let targets = this.getTargets()
        for (const targetHorse of targets) {
            let success = targetHorse.addBuffImpact([this._configId])
            if (success) {
                targetIds.push(targetHorse.getOwner().uid)
            }
        }
        if (targetIds.length > 0) {
            ModuleService.getModule(RacingModuleS).notifyBrocastEvent(this._horse.getOwner().uid, this._configId, targetIds)
        }
    }

    public update(dt: number) {
        if (!this._active) {
            this._checkInterval += dt
            if (this._checkInterval > 1) {
                this._checkInterval = 0
                if (!this.condition()) {
                    return
                }
                this.start()
            }
        }

        //间隔触发
        this._durationTiming += dt
        if (this._config.Interval && this._durationTiming > this._config.Interval * (this._intervalCounts)) {
            this.interval()
            if (this._config.TriggerCounts && this._intervalCounts >= this._config.TriggerCounts) {
                this._horse.deleteBuff([this._configId])
                this._active = false
            }
        }
    }

    public interval() {
        if (this._horse.getOwner().uid > 0) {
            // console.log("interval添加buff", this._configId)
        }
        if (this.condition()) {
            this.addImpactBuff()
            this._intervalCounts++
        }
    }

    public getDuration() { return this._durationTiming }
    public getConfigId() { return this._configId }


    public getType() {
        return this._config.Type
    }

    public getConfig() {
        return this._config
    }

    protected getTargets() {
        let horses = ModuleService.getModule(RacingModuleS).getParticleHorses()
        let targets: HorseServer[] = []
        switch (this._config.Target) {
            case EBuffTargetType.Self:
                targets.push(this._horse)
                break;
            case EBuffTargetType.OtherRandom:
                {
                    let list = []
                    for (const horse of horses) {
                        if (horse.getOwner().uid != this._horse.getOwner().uid && horse.getState() != EHorseState.Vectory) {
                            list.push(horse)
                        }
                    }
                    let rand = Utils.GetRandomNumFloor(0, list.length)
                    targets.push(list[rand])
                }

                break;
            case EBuffTargetType.OtherAll:
                for (const horse of horses) {
                    if (horse.getOwner().uid != this._horse.getOwner().uid && horse.getState() != EHorseState.Vectory) {
                        targets.push(horse)
                    }
                }
                break;
            case EBuffTargetType.All:
                for (const horse of horses) {
                    if (horse.getState() != EHorseState.Vectory) {
                        targets.push(horse)
                    }
                }
                break;
            case EBuffTargetType.Random:
                {
                    let list = []
                    for (const horse of horses) {
                        if (horse.getState() != EHorseState.Vectory) {
                            list.push(horse)
                        }
                    }
                    let rand = Utils.GetRandomNumFloor(0, list.length)
                    targets.push(list[rand])
                }
                break;

            default:
                break;
        }
        return targets
    }
}