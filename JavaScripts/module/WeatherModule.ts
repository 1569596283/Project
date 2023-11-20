import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
﻿import * as odin from 'odin'
import { EWeatherState as EWeatherState, EWeatherType, GlobalVar, IWeatherInfo } from '../Common'
import { GameEvents } from '../GameEvents'
import WeatherUI from '../ui/WeatherUI'
import { emitter } from '../utils/Emitter'
import { StateMachine } from '../utils/StateMachine'
import Utils from '../utils/Utils'
import { RacingModuleS } from './RacingModule'


export class WeatherData extends Subdata {

}
export class WeatherModuleC extends ModuleC<WeatherModuleS, WeatherData> {
    private _year: number = 2175

    private _month: number = 12

    private _day: number = 1

    private _weatherType: EWeatherType

    private _fsm: StateMachine<EWeatherState> = new StateMachine()

    onStart(): void {
        super.onStart()
        this._fsm.register(EWeatherState.Morning, { enter: this.onMorningEneter.bind(this), update: this.onMorningUpdate.bind(this), exit: this.onMorningExit.bind(this) })
        this._fsm.register(EWeatherState.Match, { enter: this.onMatchEneter.bind(this), update: this.onMatchUpdate.bind(this) })
        this._fsm.register(EWeatherState.Dusk, { enter: this.onDuskEneter.bind(this), update: this.onDuskUpdate.bind(this) })
        this._fsm.register(EWeatherState.Night, { enter: this.onNightEneter.bind(this), update: this.onNightUpdate.bind(this), exit: this.onNightExit.bind(this) })
        Skybox.skyDomeGradientEnabled = true
    }

    public onUpdate(dt: number): void {
        this._fsm.update(dt)
    }

    /**
     * 当收到天气消息
     * @param weatherType 
     * @param year 
     * @param month 
     * @param day 
     */
    public net_onRecieveWeatherInfo(weatherType: EWeatherType, year: number, month: number, day: number, state?: EWeatherState) {
        this._weatherType = weatherType
        this._year = year
        this._month = month
        this._day = day

        if (state != undefined) {
            this.changeState(state)
        }

        emitter.emit(GameEvents.EVENT_WEATHER_INFO, this._weatherType, this._year, this._month, this._day)
    }

    /**
     * 同步天气变化
     * @param weatherState 
     * @param weatherType 
     */
    public net_onWeatherChagne(weatherState: EWeatherState) {
        this.changeState(weatherState)
    }

    public changeState(state: EWeatherState, ...data: any) {
        this._fsm.switch(state, ...data)
    }

    /**
     * 获取天气信息
     * @returns 
     */
    public getWeatherInfo() {
        let info: IWeatherInfo = { weatherType: this._weatherType, year: this._year, month: this._month, day: this._day }
        return info
    }

    /**
     * 获取天气类型
     * @returns 
     */
    public getWeatherType() { return this._weatherType }

    /**************************************************************************私有方法******************************************************** */

    private onMorningEneter() {
        // mw.UIService.show(WeatherUI, EWeatherState.Morning)
        Skybox.preset = (mw.SkyPreset.Morning2D)
    }
    private onMorningUpdate(dt: number, eslapsed: number) { }
    private onMorningExit() {
        // mw.UIService.hide(WeatherUI)
    }

    private onMatchEneter() {
        Skybox.preset = (mw.SkyPreset.Noon2D)
    }
    private onMatchUpdate(dt: number, eslapsed: number) { }

    /**
     * 黄昏
     */
    private onDuskEneter() {
        console.log("黄昏时段")
        Skybox.preset = (mw.SkyPreset.Dusk2D)
    }
    private onDuskUpdate(dt: number, eslapsed: number) { }

    private onNightEneter() {
        console.log("夜晚时段")
        // mw.UIService.show(WeatherUI, EWeatherState.Night)
    }
    private onNightUpdate(dt: number, eslapsed: number) { }
    private onNightExit() {
        // mw.UIService.hide(WeatherUI)
    }
}

export class WeatherModuleS extends ModuleS<WeatherModuleC, WeatherData> {
    private _weatherType: EWeatherType

    private _year: number = 2175

    private _month: number = 12

    private _day: number = 1

    private _toNightCountDown = 0
    private _bPreNight

    private _fsm: StateMachine<EWeatherState> = new StateMachine()

    onStart(): void {
        super.onStart()

        this.initWeatherData()

        this._fsm.register(EWeatherState.Morning, { enter: this.onMorningEneter.bind(this), update: this.onMorningUpdate.bind(this) })
        this._fsm.register(EWeatherState.Match, { enter: this.onMatchEneter.bind(this), update: this.onMatchUpdate.bind(this) })
        this._fsm.register(EWeatherState.Dusk, { enter: this.onDuskEneter.bind(this), update: this.onDuskUpdate.bind(this) })
        this._fsm.register(EWeatherState.Night, { enter: this.onNightEneter.bind(this), update: this.onNightUpdate.bind(this) })

        this.newDay()
    }

    private async initWeatherData() {
        let weatherData = await GeneralManager.asyncRpcGetData('WeatherData')
        if (weatherData) {
            this._year = weatherData['year']
            this._month = weatherData['month']
            this._day = weatherData['day']
        }
    }

    public onUpdate(dt: number): void {
        this._fsm.update(dt)
    }

    private changeState(state: EWeatherState, ...data: any) {
        this._fsm.switch(state, ...data)
        this.getAllClient().net_onWeatherChagne(state)
    }

    /**
     * 同步天气消息
     */
    public syncWeatherInfo(id: number) {
        this.getClient(id).net_onRecieveWeatherInfo(this._weatherType, this._year, this._month, this._day, this._fsm.getStateInfo().state)
    }

    /**
    * 同步天气消息
    */
    public nofityWeatherInfo() {
        this.getAllClient().net_onRecieveWeatherInfo(this._weatherType, this._year, this._month, this._day)
    }

    /**
     * 新的一天
     */
    private newDay() {
        this._day++
        if (this._day > 30) {
            this._day = 1
            this._month++
            if (this._month > 12) {
                this._month = 1
                this._year++
            }
        }

        DataStorage.asyncSetData('WeatherData', { weatherType: this._weatherType, year: this._year, month: this._month, day: this._day })
        this._weatherType = this.getRandomWeatherType()
        this.nofityWeatherInfo()
        this.changeState(EWeatherState.Morning)
    }

    /**
     * 获取随机的天气
     * @returns 
     */
    private getRandomWeatherType() {
        let weatherlist = [EWeatherType.Sunny, EWeatherType.Rain, EWeatherType.Snowy, EWeatherType.Overcast]
        let rand = Utils.GetRandomNumFloor(0, weatherlist.length)
        let weather = weatherlist[rand]
        return weather
    }

    /**
     * 获取当前的时段
     * @returns 
     */
    public getDayTimeState() {
        return this._fsm.getStateInfo().state
    }

    /**
     * 获取天气状态
     * @returns 
     */
    public getWeatherType() { return this._weatherType }

    /**************************************************************************状态方法******************************************************** */


    /**
     * 清晨
     */
    private onMorningEneter() {
        console.log("清晨时段")
    }
    private onMorningUpdate(dt: number, eslapsed: number) {
        if (eslapsed > GlobalVar.Duration_Weather_Morning) {
            this.changeState(EWeatherState.Match)
        }
    }

    /**
     * 比赛
     */
    private onMatchEneter() {
        console.log("比赛时段")
        ModuleService.getModule(RacingModuleS).startMatch()
    }
    private onMatchUpdate(dt: number, eslapsed: number) {
        if (eslapsed > GlobalVar.Duration_Weather_Match) {
            this.changeState(EWeatherState.Dusk)
        }
    }

    /**
     * 黄昏
     */
    private onDuskEneter() {
        console.log("黄昏时段")
    }
    private onDuskUpdate(dt: number, eslapsed: number) {
        if (eslapsed > GlobalVar.Duration_Weather_Dust && !ModuleService.getModule(RacingModuleS).isMatchRunning()) {
            this.changeState(EWeatherState.Night)
        }
    }

    /**
     * 夜晚
     */
    private onNightEneter() {
        console.log("夜晚时段")
        ModuleService.getModule(RacingModuleS).enterNight()
    }
    private onNightUpdate(dt: number, eslapsed: number) {
        if (eslapsed > GlobalVar.Duration_Weather_Night) {
            this.newDay()
        }
    }
}