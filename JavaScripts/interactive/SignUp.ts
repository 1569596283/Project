import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { CommonAssets, CommonTrigger, ECompetitionState, EHorseSomatoType, ErrorCode, ETalkIndex, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { PlayerModuleC } from "../module/PlayerModule";
import { RacingModuleC } from "../module/RacingModule";
import InteractiveUI, { EInteractiveShowType, EInteractiveType, IInteractiveInfo } from "../ui/InteractiveUI"
import Tips from "../ui/Tips";

@Component
export default class Interactive extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        await Player.asyncGetLocalPlayer();
        if (this.gameObject instanceof mw.Trigger) {
            CommonTrigger.SIGN_TRIGGER_POS = this.gameObject.worldTransform.position;
            CommonTrigger.SIGN_TRIGGER_ROA = this.gameObject.worldTransform.rotation;

            this.gameObject.onEnter.add((go: mw.GameObject) => {
                if (!(PlayerManagerExtesion.isCharacter(go))) {
                    return;
                }
                let player = Player.localPlayer;
                if (!player || go != player.character) {
                    return;
                }
                const racingC = ModuleService.getModule(RacingModuleC);
                let info: IInteractiveInfo = {
                    text_yes: GameConfig.Language.Btn_yes.Value,
                    text_no: GameConfig.Language.Btn_no.Value,
                    desc: ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.SignUp),
                    type: EInteractiveType.SignUp,
                    triggerGuid: this.gameObject.gameObjectId,
                    comfirmCallback: (cost: number = 0) => {
                        let playerC = ModuleService.getModule(PlayerModuleC);
                        if (!playerC.hasEquipedHorse()) {
                            Tips.showTips(GameConfig.Language[ErrorCode[1006]].Value);
                            return;
                        }


                        if (playerC.getEquipHorseInfo().property.energy <= 0) {
                            Tips.showTips(GameConfig.Language[ErrorCode[1007]].Value)
                        } else {
                            if (playerC.getMoney() < cost) {
                                Tips.showTips(GameConfig.Language[ErrorCode[1017]].Value)
                                return;
                            }
                            ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.SignUp);
                            ModuleService.getModule(RacingModuleC).reqSignUp();
                        }
                        mw.UIService.getUI(InteractiveUI).turnAgain();
                    }
                }
                // 是否是第一次报名，第一次报名不用花钱
                if (ModuleService.getModule(PlayerModuleC).getTalkIndex(ETalkIndex.SignUp) > 1) {
                    info.cost = GlobalVar.SIGN_UP_COST;
                }

                let playerC = ModuleService.getModule(PlayerModuleC);
                //玩家有跟随的小马
                if (playerC.hasEquipedHorse()) {
                    let horse = playerC.getEquipHorseInfo();
                    // 跟随的马是小马
                    if (horse.property.somatoType == EHorseSomatoType.Filly) {
                        let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.UncleSmall);
                        ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.UncleSmall);
                        info.desc = str;
                        info.cost = 0;
                        info.comfirmCallback = null;
                    }
                } else {
                    let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.UncleTips);
                    ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.UncleTips);
                    info.desc = str;
                    info.cost = 0;
                    info.comfirmCallback = null;
                }

                let showType = ModuleService.getModule(PlayerModuleC).getInteractiveType();
                (showType == info.type) && (info.showType = EInteractiveShowType.Choose);

                //不是报名时间
                if (racingC.getCompotitionState() != ECompetitionState.Sign) {
                    info.showType = EInteractiveShowType.Talk;
                    let str = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.SignUPNone)
                    ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.SignUPNone)
                    info.desc = str;
                } else {
                    //玩家已经报名了
                    if (racingC.getPlayerHorse()) {
                        info.showType = EInteractiveShowType.Talk;
                        info.desc = ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.UncleRace);
                        ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.UncleRace)
                        // info.desc = GameConfig.Language.Uncle_race1.Value;
                    }
                }
                mw.UIService.show(InteractiveUI, info);
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