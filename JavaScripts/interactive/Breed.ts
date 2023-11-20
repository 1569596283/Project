import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonAssets, CommonTrigger, ETalkIndex } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { BagMouduleC } from "../module/BagMoudule";
import { PlayerModuleC } from "../module/PlayerModule";
import BreedUI from "../ui/BreedUI"
import InteractiveUI, { EInteractiveShowType, EInteractiveType, IInteractiveInfo } from "../ui/InteractiveUI";
import { BreedModuleC } from "../module/BreedModule";
import { NewGuideModuleC } from "../module/GuideModule";

@Component
export default class Breed extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        await Player.asyncGetLocalPlayer();
        if (this.gameObject instanceof mw.Trigger) {
            CommonTrigger.BREED_TRIGGER_POS = this.gameObject.worldTransform.position;
            CommonTrigger.BREED_TRIGGER_ROA = this.gameObject.worldTransform.rotation;

            this.gameObject.onEnter.add((go: mw.GameObject) => {
                if (!(PlayerManagerExtesion.isCharacter(go))) {
                    return;
                }
                let player = Player.localPlayer;
                if (!player || go != player.character) {
                    return;
                }

                if (!player || !go.player || player.playerId != go.player.playerId) {
                    return;
                }
                let guideID = ModuleService.getModule(NewGuideModuleC).getCurrentGuidingID()
                if (guideID > 1020 && guideID < 1025) {
                    return
                }
                let info: IInteractiveInfo = {
                    text_yes: GameConfig.Language.Btn_yes.Value,
                    text_no: GameConfig.Language.Btn_no.Value,
                    desc: '',
                    type: EInteractiveType.Breed,
                    triggerGuid: this.gameObject.gameObjectId,
                }
                let showType = ModuleService.getModule(PlayerModuleC).getInteractiveType();
                (showType == info.type) && (info.showType = EInteractiveShowType.Choose);

                // let ponyMum = BreedMgr.instance().getPonyNum();
                let ponyMum = ModuleService.getModule(BreedModuleC).getPonyNum();
                if (ponyMum > 0) {
                    info.desc = GameConfig.Language.Interactive_Talk3.Value;
                    info.comfirmCallback = () => {
                        this.checkHorse(info, false);
                    }
                    mw.UIService.show(InteractiveUI, info);
                } else {
                    this.checkHorse(info, true);
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
                mw.UIService.getUI(InteractiveUI).leave()
            })
        }

    }

    /**
     * 检查大马
     * @param info 对话信息
     */
    private checkHorse = (info: IInteractiveInfo, showInteeractiveUI: boolean) => {
        // BreedMgr.instance().init();
        ModuleService.getModule(BreedModuleC).init();
        mw.UIService.hide(InteractiveUI);
        let allMatureHorse = ModuleService.getModule(BagMouduleC).getAllMatureHorse();
        let num = allMatureHorse.length;
        // 判断大马数量
        if (num <= 1) {
            info.showType = EInteractiveShowType.Talk;
            let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.BreedNone)
            ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.BreedNone)
            info.desc = str;
        } else {
            let canBreedHorse = allMatureHorse.filter(horse => {
                if (horse.property.birthNum > 0) {
                    return horse
                }
            })
            // 判断可生育大马数量
            if (canBreedHorse.length >= 2) {
                if (!showInteeractiveUI) {
                    mw.UIService.show(BreedUI);
                    return;
                }
                info.desc = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.Breed);
                info.comfirmCallback = () => {
                    mw.UIService.show(BreedUI);
                    ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.Breed);
                }
            } else {
                info.desc = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.BreedNone)
                info.showType = EInteractiveShowType.Talk;
            }
        }
        mw.UIService.show(InteractiveUI, info);
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