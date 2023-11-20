import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
﻿/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-23 17:40:23
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-01-08 14:34:12
 */
import { ESceneType } from "../Common"
import { PlayerModuleC } from "../module/PlayerModule"
import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin"
@Component
export default class EnterHall extends mw.Script {

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
                // if (!player || player.playerId != go.player.playerId) {
                //     return;
                // }
                const playerC = ModuleService.getModule(PlayerModuleC);
                const curScene = playerC.getSceneType();
                let pos = mw.Vector.zero;
                switch (curScene) {
                    case ESceneType.Bussiness:
                    case ESceneType.Bet:
                    case ESceneType.Shop:
                    case ESceneType.Sign:
                        pos = GameObject.findGameObjectById("DC7FD79B").worldTransform.position;
                        break;
                    case ESceneType.Breed:
                        pos = GameObject.findGameObjectById("3C2B5015").worldTransform.position;
                        break;
                    case ESceneType.Stable:
                        pos = GameObject.findGameObjectById("D54A1E7E").worldTransform.position;
                        break;
                    default:
                        break;
                }
                playerC.translateToScene(ESceneType.Hall, pos);
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