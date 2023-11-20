import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
﻿/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-23 17:40:23
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-11-03 11:32:21
 */
import { CommonTrigger, ESceneType } from "../Common"
import { PlayerModuleC } from "../module/PlayerModule"
@Component
export default class EnterStable extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        await Player.asyncGetLocalPlayer();
        if (this.gameObject instanceof mw.Trigger) {
            this.gameObject.onEnter.add((go: mw.GameObject) => {
                if (!(PlayerManagerExtesion.isCharacter(go))) {
                    return;
                }
                let player = Player.localPlayer;
                if (!player || go != player.character) {
                    return;
                }
                let ch = Player.localPlayer.character
                // let tmpLoc = ModuleService.getModule(PlayerModuleC).getCurSceneBirthLoc(ESceneType.Stable)
                let tmpRot = CommonTrigger.SELLFAT_TRIGGER_ROA
                ch.worldTransform.rotation = (tmpRot)
                ModuleService.getModule(PlayerModuleC).translateToScene(ESceneType.Stable);
            })
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