import BuffServer from "../BuffServer";
import BuffImpactS from "./BuffImpactS";

/**
 * 放弃比赛
 */
export default class GiveupImpactS extends BuffImpactS {
    public onStart(): void {
        this._horse.giveup()
    }
}