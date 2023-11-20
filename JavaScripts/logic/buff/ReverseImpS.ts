import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin";
import BuffServer from "../BuffServer";
import BuffImpactS from "./BuffImpactS";

export default class ReverseImpactS extends BuffImpactS {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    public onStart(): void {
        this._horse.setRunDirParam(-1)
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    public onDestroy(): void {
        this._horse.setRunDirParam(1)
    }
}