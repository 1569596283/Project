import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { GameConfig } from "../config/GameConfig";
import { Singleton } from "../utils/Singleton";
import { EPartType } from "../Common";
import { PlayerModuleC } from "../module/PlayerModule";

export default class PartsMgr extends Singleton {
    private _partGuidArr: number[] = [];

    private _partTypeArr: EPartType[] = [];

    private _cbArr: ((partType: EPartType, go: mw.GameObject) => void)[] = [];

    private _creating: boolean = false;

    private _loadPart: boolean = true;

    public createPart(cfgID: number, partType: EPartType, cb: (partType: EPartType, go: mw.GameObject) => void) {
        this._partGuidArr.push(cfgID);
        this._partTypeArr.push(partType);
        this._cbArr.push(cb);

        if (!this._creating) {
            this.startCreate();
        }
    }

    private async startCreate() {
        let id = this._partGuidArr.shift();
        const cb = this._cbArr.shift()
        const ty = this._partTypeArr.shift()
        const partConfig = GameConfig.Parts.getElement(id)
        this._creating = true;

        if (!mw.AssetUtil.assetLoaded(partConfig.Guid)) {
            mw.AssetUtil.asyncDownloadAsset(partConfig.Guid).then(() => {
                let obj = SpawnManager.spawn({ guid: partConfig.Guid })
                if (obj && cb) {
                    cb(ty, obj)
                } else {
                    console.error("合成::创建肢体失败", id, partConfig.Guid)
                }
                setTimeout(() => {
                    this._creating = false;
                    if (this._partGuidArr.length > 0) {
                        this.startCreate();
                    } else {
                        this._loadPart && ModuleService.getModule(PlayerModuleC).loadPart(0);
                        this._loadPart = false;
                    }
                }, 10);

            })
        } else {
            let obj = SpawnManager.spawn({ guid: partConfig.Guid })
            if (obj && cb) {
                cb(ty, obj)
            } else {
                console.error("合成::创建肢体失败", id, partConfig.Guid)
            }
            setTimeout(() => {
                this._creating = false;
                if (this._partGuidArr.length > 0) {
                    this.startCreate();
                } else {
                    this._loadPart && ModuleService.getModule(PlayerModuleC).loadPart(0);
                    this._loadPart = false;
                }
            }, 10);
        }
    }
}