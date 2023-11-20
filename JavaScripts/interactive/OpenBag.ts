import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { EHorseSomatoType, GlobalVar } from "../Common"
import { BagMouduleC } from "../module/BagMoudule"
import GrowUI from "../ui/GrowUI"
import HorseBagUI from "../ui/HorseBagUI"


@Component
export default class OpenBag extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */

    private _curUI: new () => mw.UIScript
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

                let index = Number(this.gameObject.name.replace("背包触发", "")) - 1
                let curHeroInfo = ModuleService.getModule(BagMouduleC).getHoresInfoByIndex(index)


                if (!curHeroInfo) {
                    return
                }
                if (curHeroInfo.property.somatoType == EHorseSomatoType.Filly) {
                    mw.UIService.show(GrowUI, index)
                    this._curUI = GrowUI
                }
                else if (curHeroInfo.property.somatoType == EHorseSomatoType.Mature) {
                    mw.UIService.show(HorseBagUI, index)
                    this._curUI = HorseBagUI
                }

            })
            this.gameObject.onLeave.add((go: mw.GameObject) => {
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
                if (this._curUI) {
                    mw.UIService.hide(this._curUI)
                    this._curUI = null
                }

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