/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-29 17:17:53
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-01 11:17:58
 */
import BuffServer from "../BuffServer";
import BuffImpactS from "./BuffImpactS";

export default class AccImpactS extends BuffImpactS {
    private _deltal: number = 0;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        let acc = this._horse.getAccalerate();
        this._deltal = this._horse.getAccalerate() * this._config.Impact / 1000;
        acc += this._deltal;
        if (acc < 0) {
            acc = 0;
        }
        this._horse.setAccalerate(acc);
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {
        let acc = this._horse.getAccalerate() - this._deltal;
        if (acc < 0) {
            acc = 0;
        }
        this._horse.setAccalerate(acc);
    }
}