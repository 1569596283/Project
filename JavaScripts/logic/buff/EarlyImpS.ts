/*
 * @Author: jiezhong.zhang
 * @Date: 2022-11-29 17:17:53
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-06 13:57:41
 */
import BuffImpactS from "./BuffImpactS";
import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin"
import { RacingModuleS } from "../../module/RacingModule";
import { ECompetitionState, GlobalVar } from "../../Common";

export default class EarlyImpactS extends BuffImpactS {
    public onStart(): void {

    }

    public update(dt: number) {
        if (!this._active) { return }
        super.update(dt)

        const stateInfo = ModuleService.getModule(RacingModuleS).getCompetition().getStateInfo()
        if (!this._horse.isRunning() && stateInfo.state == ECompetitionState.CountDown) {
            if (stateInfo.elasped > GlobalVar.Duration_Competition_CountDown + 1 - this._config.TargetDuration) {
                this._horse.startRun()
                ModuleService.getModule(RacingModuleS).notifyBrocastEvent(this._horse.getOwner().uid, this._configId, [this._horse.getOwner().uid])
                this._horse.deleteBuff([this._configId])
            }
        }
    }
}