import BuffImpactS from "./BuffImpactS"


export default class QTEImpS extends BuffImpactS {
    private _deltal: number = 0
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        this._deltal = this._horse.getAccalerate() * this._config.Impact / 1000;
        let limit = this._horse.getSpeedLimit() + this._deltal
        let speed = this._horse.getCurrentSpeed() + this._deltal
        this._horse.setCurrentSpeedAndSpeedLimit(speed, limit);
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {
        let limit = this._horse.getSpeedLimit() - this._deltal
        let speed = this._horse.getCurrentSpeed() - this._deltal
        this._horse.setCurrentSpeedAndSpeedLimit(speed, limit);
    }

}