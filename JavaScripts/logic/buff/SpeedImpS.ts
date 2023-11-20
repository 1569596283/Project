import BuffImpactS from "./BuffImpactS"


export default class SpeedImpactS extends BuffImpactS {
    private _deltalLimit: number = 0
    private _deltaSpeed: number = 0
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        this._deltalLimit = this._horse.getSpeedLimit() * this._config.Impact / 1000
        let limit = this._horse.getSpeedLimit() + this._deltalLimit
        this._horse.setSpeedLimit(limit)
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {
        let limit = this._horse.getSpeedLimit() - this._deltalLimit
        this._horse.setSpeedLimit(limit)
    }
}