import BuffServer from "../BuffServer";
import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin"
import { RacingModuleS } from "../../module/RacingModule";

export default class BuffImpactS extends BuffServer {

    public start() {
        this._active = true
        this._durationTiming = 0
        this.onStart()
    }
    public onStart() {

    }
    public getActive() {
        return this._active;
    }

    public update(dt: number) {
        if (!this._active) { return }

        this.onUpdate(dt)

        this._durationTiming += dt
        if (this._config.TargetDuration && this._durationTiming > this._config.TargetDuration) {
            this.destroy()
        }
    }

    public onUpdate(dt: number) {

    }

    private destroy() {
        this.onDestroy()
        this._active = false
        this._horse.deleteBuffImpact([this._configId])
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}