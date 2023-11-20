import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonTrigger, ETalkIndex, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { BagMouduleC } from "../module/BagMoudule";
import { PlayerModuleC } from "../module/PlayerModule";
import InteractiveUI, { EInteractiveShowType, EInteractiveType, IInteractiveInfo } from "../ui/InteractiveUI";
import ShopUI from "../ui/ShopUI";

@Component
export default class Shop extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        await Player.asyncGetLocalPlayer();
        if (this.gameObject instanceof mw.Trigger) {
            CommonTrigger.SHOP_TRIGGER_POS = this.gameObject.worldTransform.position;
            CommonTrigger.SHOP_TRIGGER_ROA = this.gameObject.worldTransform.rotation;

            this.gameObject.onEnter.add((go: mw.GameObject) => {
                if (!(PlayerManagerExtesion.isCharacter(go))) {
                    return;
                }
                let player = Player.localPlayer;
                if (!player || go != player.character) {
                    return;
                }
                
                let info: IInteractiveInfo = {
                    text_yes: GameConfig.Language.Btn_yes.Value,
                    text_no: GameConfig.Language.Btn_no.Value,
                    desc: ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.Shop),
                    type: EInteractiveType.Shop,
                    triggerGuid: this.gameObject.gameObjectId,
                    comfirmCallback: () => {
                        mw.UIService.show(ShopUI);
                        ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.Shop);
                    },
                }
                let showType = ModuleService.getModule(PlayerModuleC).getInteractiveType();
                (showType == info.type) && (info.showType = EInteractiveShowType.Choose);

                if (ModuleService.getModule(BagMouduleC).getHoresInfo().length >= GlobalVar.STABLE_MAX_POSSESS) {
                    let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.ShopNone)
                    ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.ShopNone)
                    info.desc = str
                }

                mw.UIService.show(InteractiveUI, info)
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
                mw.UIService.getUI(InteractiveUI).leave();
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