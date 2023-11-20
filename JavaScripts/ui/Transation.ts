/*
 * @Author: jiezhong.zhang
 * @Date: 2023-03-10 09:52:42
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-05-15 18:21:08
 */
import { ESceneType } from "../Common";
import Translation_Generate from "../ui-generate/ui/Translation_generate";
import { ActionMgr } from "../utils/ActionMgr";
import SoundHelper from "../utils/SoundHelper";

export default class Transation extends Translation_Generate {
    private _tweens: mw.Tween<mw.Vector2 | { value: number }>[] = []

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onAwake(): void {
        super.onAwake()
        this.layer = mw.UILayerTop;
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.bUseUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onShow(sceneName: string, fn: () => void): void {
        const viewSize = mw.getViewportSize()
        for (const tween of this._tweens) {
            tween.stop()
        }
        this._tweens.length = 0
        this.textSceneName.renderOpacity = 0
        this.textSceneName.text = sceneName
        this.panelBg.renderOpacity = 1
        this.panelEffect.position = new mw.Vector2(viewSize.x, 0)


        const tween1 = ActionMgr.instance().moveTo2D(this.panelEffect, new mw.Vector2(viewSize.x, 0), new mw.Vector2(-this.panelEffect.size.x, 0), 1200, this, () => {
            fn()
        })
        const tween2 = ActionMgr.instance().fadeIn(this.textSceneName, 1200, this, () => {
            const tween3 = ActionMgr.instance().fadeOut(this.panelBg, 1000, this, null, mw.TweenUtil.Easing.Cubic.In)
            const tween4 = ActionMgr.instance().fadeOut(this.textSceneName, 1000, this, () => {
                mw.UIService.hide(Transation)
            }, mw.TweenUtil.Easing.Cubic.In)
            this._tweens.push(tween3)
            this._tweens.push(tween4)
        }, mw.TweenUtil.Easing.Cubic.In).delay(400)
        this._tweens.push(tween2)
        this._tweens.push(tween1)

        SoundHelper.instance().play(1040)
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}