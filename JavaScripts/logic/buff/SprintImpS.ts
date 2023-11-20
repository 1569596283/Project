/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-27 19:05:26
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-16 09:31:27
 */
import { GameConfig } from "../../config/GameConfig"
import BuffImpactS from "./BuffImpactS"


export default class SprintImpS extends BuffImpactS {
    private _deltalLimit: number = 0
    private _deltaAcc: number = 0
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        this._deltalLimit = this._horse.getSpeedLimit() * this._config.Impact / 1000
        let limit = this._horse.getSpeedLimit() + this._deltalLimit
        this._horse.setSpeedLimit(limit)

        let mul = GameConfig.Global.getElement(1052).Parameter1;
        this._deltaAcc = this._horse.getAccalerate() * this._config.Impact / 1000 * mul;
        let acc = this._horse.getAccalerate() + this._deltaAcc
        this._horse.setAccalerate(acc)
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {
        let limit = this._horse.getSpeedLimit() - this._deltalLimit
        this._horse.setSpeedLimit(limit)

        let acc = this._horse.getAccalerate() - this._deltaAcc
        this._horse.setAccalerate(acc)
    }
}