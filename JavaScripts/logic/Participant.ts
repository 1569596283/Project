/*
 * @Author: pengcheng.zhang 
 * @Date: 2022-11-17 15:57:39 
 * @Last Modified by: pengcheng.zhang
 * @Last Modified time: 2022-11-23 16:37:46
 */


/**
 * 参赛者
 */

import { oTraceError, oTrace, oTraceWarning, LogManager ,AnalyticsUtil, IFightRole, AIMachine, AIState} from "odin"
import { IHorseInfo } from "../Common"
import { SyntheticModuleS } from "../module/SyntheticModule"

export default class Participant {
    public uid: number

    public userName: string

    public horseInfo: IHorseInfo

    constructor(uid: number, username: string, info: IHorseInfo) {
        this.uid = uid
        this.userName = username
        this.horseInfo = info
    }
}