/*
 * @Author: jiezhong.zhang
 * @Date: 2022-12-15 09:08:24
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-15 09:20:12
 */

@Component
export default class HidePlayerName extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

        if (mw.SystemUtil.isClient()) {
            let interval = setInterval(() => {
                let character = this.gameObject as mw.Character;
                if (character) {
                    character.displayName = "";
                    clearInterval(interval);
                }
            }, 500)
        }
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