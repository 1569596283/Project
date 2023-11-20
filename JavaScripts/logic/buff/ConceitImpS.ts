/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-29 17:17:53
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-06 13:57:43
 */
import BuffImpactS from "./BuffImpactS";

export default class ConceitImpactS extends BuffImpactS {

    public onStart(): void {
        this._horse.stopRun();
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {
        this._horse.startRun();
    }
}