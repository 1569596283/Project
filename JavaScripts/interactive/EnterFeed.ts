import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonTrigger, ESceneType } from "../Common"
import { PlayerModuleC } from "../module/PlayerModule"
@Component
export default class EnterFeed extends mw.Script {

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
                ModuleService.getModule(PlayerModuleC).quickEnterScene(ESceneType.Breed, CommonTrigger.BREED_TRIGGER_POS);
                Player.localPlayer.character.worldTransform.rotation = (CommonTrigger.BREED_TRIGGER_ROA);
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