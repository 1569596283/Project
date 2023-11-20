import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonTrigger, ETalkIndex } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { GameEvents } from "../GameEvents";
import { PlayerModuleC } from "../module/PlayerModule";
import { StableModuleC } from "../module/StableModule"
import InteractiveUI, { EInteractiveType, IInteractiveInfo } from "../ui/InteractiveUI";
import PopWindowUI, { IPopWindowInfo } from "../ui/PopWindowUI";
import { emitter } from "../utils/Emitter";

@Component
export default class SellFat extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        await Player.asyncGetLocalPlayer();
        if (this.gameObject instanceof mw.Trigger) {

            CommonTrigger.SELLFAT_TRIGGER_POS = this.gameObject.worldTransform.position;
            CommonTrigger.SELLFAT_TRIGGER_ROA = this.gameObject.worldTransform.rotation;
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
                let info: IInteractiveInfo = {
                    text_yes: GameConfig.Language.Btn_yes.Value,
                    text_no: GameConfig.Language.Btn_no.Value,
                    desc: '',
                    type: EInteractiveType.Shit,
                    triggerGuid: this.gameObject.gameObjectId,
                }
                let stableModule = ModuleService.getModule(StableModuleC);
                let little = stableModule.getLittleFatNum();
                let big = stableModule.getBigFatNum();

                let fatNum = little + big
                if (fatNum <= 0) {
                    let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.ShitNone)
                    ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.ShitNone)
                    info.desc = str
                } else {
                    info.desc = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.Shit);
                    info.comfirmCallback = () => {
                        ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.Shit);
                        this.showFatUI(little, big)
                    }
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
                mw.UIService.getUI(InteractiveUI).leave();
            })
        }
    }

    private showFatUI(littleFatNum: number, bigFatNum: number) {

        let tmpStr = GameConfig.Language.Reward_3.Value
        if (bigFatNum > 0) {
            tmpStr += mw.StringUtil.format(GameConfig.Language.Reward_4.Value, bigFatNum)
        }
        if (bigFatNum > 0 && littleFatNum > 0) {
            tmpStr += "，"
        }
        if (littleFatNum > 0) {
            tmpStr += mw.StringUtil.format(GameConfig.Language.Reward_5.Value, littleFatNum)
        }
        let littlePrice = GameConfig.Global.getElement(1005).Parameter1 * littleFatNum
        let bigPrice = GameConfig.Global.getElement(1004).Parameter1 * bigFatNum
        let priceStr = mw.StringUtil.format(GameConfig.Language.Reward_6.Value, littlePrice + bigPrice)


        let info: IPopWindowInfo = {
            comfirmCallback: () => {
                emitter.emit(GameEvents.EVENT_SELL_FAT)
            },
            cancelCallback: () => {

            },
            title: GameConfig.Language.Reward_1.Value,
            desc: tmpStr,
            desc2: priceStr,
            titleImg: "130977",
            contentImg: "131519"
        }
        mw.UIService.show(PopWindowUI, info)
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