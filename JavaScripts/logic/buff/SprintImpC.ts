/*
 * @Author: jiezhong.zhang
 * @Date: 2022-12-16 09:22:32
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-16 09:23:46
 */
import BuffClient from "../BuffClient";

export default class SprintImpC extends BuffClient {

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