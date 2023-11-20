import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-22 18:07:36
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-10-15 09:36:21
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import { CommonTrigger, ETalkIndex, ErrorCode, GlobalVar } from "../Common";
import { GameConfig } from "../config/GameConfig";
import { BagMouduleC } from "../module/BagMoudule";
import InteractiveUI, { EInteractiveType, IInteractiveInfo } from "../ui/InteractiveUI";
import Tips from "../ui/Tips";
import SoundHelper from "../utils/SoundHelper";
import { BreedModuleC } from "../module/BreedModule";
import { PlayerModuleC } from "../module/PlayerModule";

@Component
export default class AdoptPony extends mw.Script {

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

                let index = Number(this.gameObject.name.replace("Trigger", ""));
                // let horseInfo = BreedMgr.instance().getPonyInfo(index);
                let horseInfo = ModuleService.getModule(BreedModuleC).getPonyInfo(index);
                if (!horseInfo) {
                    return;
                }
                let info: IInteractiveInfo = {
                    text_yes: GameConfig.Language.Btn_yes.Value,
                    text_no: GameConfig.Language.Btn_no.Value,
                    desc: ModuleService.getModule(PlayerModuleC).getTalkInfo(ETalkIndex.AdoptPony),
                    type: EInteractiveType.AdoptPony,
                    triggerGuid: this.gameObject.gameObjectId,
                    comfirmCallback: () => {
                        let bagNum = ModuleService.getModule(BagMouduleC).getHoresInfo()
                        if (bagNum.length >= GlobalVar.STABLE_MAX_POSSESS) {
                            Tips.showTips(GameConfig.Language[ErrorCode[1005]].Value)
                        } else {
                            SoundHelper.instance().play(1014)
                            // ModuleService.getModule(BagMouduleC).addHorseInfo(horseInfo);
                            // BreedMgr.instance().delPony(index);
                            ModuleService.getModule(BreedModuleC).takePony(index);
                        }
                    }
                }
                ModuleService.getModule(PlayerModuleC).reqChangeTalkNum(ETalkIndex.AdoptPony)
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
}