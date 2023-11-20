import { SpawnManager,SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { oTraceError, oTrace, oTraceWarning, LogManager, AnalyticsUtil, IFightRole, AIMachine, AIState } from "odin";
import { CommonAssets, IHorseInfo } from "../Common";
import { Scheduler } from "../utils/Scheduler";
import Utils from "../utils/Utils";
import { BagMouduleC } from "./BagMoudule";
import { RacingModuleC } from "./RacingModule";

/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2022-11-30 15:37:19
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-10-15 10:21:53
 * @FilePath: \horseracing\JavaScripts\module\WorldUIModule.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE 
*/

//最大识别范围
const MAX_RECOG_DISTANCE = 500
//显示间隔范围
const DISPLAY_INTEVAL_RANGE: number[] = [10, 15]

export class WorldShowUI {
    private _widget: mw.UIWidget
    private _rootUI: mw.UserWidget
    private _textComponent: mw.TextBlock

    private _ownerID: number
    //依附的物体
    private _attachObj: mw.GameObject
    //依附的马匹guid
    private _attachInfoID: string
    //控制其他世界ui
    private _controlUI: WorldShowUI = null
    private _canControl: boolean = false
    /**是否常驻显示 */
    private _isResident: boolean = false

    //持续显示计时器
    private _inteval: number = null

    private _startDisplay: boolean = false
    private _isDestroy: boolean = false
    private _isInteval: boolean = false

    //预留的文本 用于随机
    private _preloadTexts: string[] = []
    public callback: (ui: WorldShowUI, pid: number) => void = null


    public init(uiStr: string, isInteval: boolean, isResident: boolean, talks: string[]) {

        this._widget = SpawnManager.spawn({ guid: CommonAssets.WorldUserWidget }) as unknown as mw.UIWidget
        this._widget.setUIbyID(uiStr)
        this._widget.pivot = new mw.Vector2(0.5, 0.5)
        this._widget.widgetSpace = mw.WidgetSpaceMode.OverheadUI
        this._widget.headUIMaxVisibleDistance = 8000;
        this._rootUI = this._widget.getTargetUIWidget()

        this._textComponent = this._rootUI.findChildByPath("RootCanvas/mInfo") as mw.TextBlock;

        if (uiStr != CommonAssets.Competition_Horse3D && uiStr != CommonAssets.Competition_Talk3D) {
            this._widget.scaledByDistanceEnable = true;
        }
        else {
            this._widget.scaledByDistanceEnable = false;
        }
        if (isInteval) {
            this._startDisplay = true
            this._rootUI.rootContent.renderOpacity = 1
            this.setPreLoadTalks(talks)
            this.setInteval()
        } else if (isResident) {
            this._startDisplay = true
            this._rootUI.rootContent.renderOpacity = 1
            this.setResident(true)
            this.setTalkTex(talks[0])
        } else {
            this._startDisplay = true
            this._rootUI.rootContent.renderOpacity = 1
            let showTime = Utils.RangeFloat(DISPLAY_INTEVAL_RANGE[0], DISPLAY_INTEVAL_RANGE[1] + 1)
            Scheduler.TimeStart(() => {
                // this._startDisplay = false
                this.destroy()
            }, showTime)
            this.setTalkTex(talks[0])
        }


    }


    public setTalkTex(str: string) {
        this._textComponent.text = str
    }

    public setPreLoadTalks(talks: string[]) {
        this._preloadTexts = talks
        this.setTalkTex(this._preloadTexts[Utils.RangeInt(0, this._preloadTexts.length)])
    }

    public setInteval() {
        this._isInteval = true
        let time = Utils.RangeInt(DISPLAY_INTEVAL_RANGE[0], DISPLAY_INTEVAL_RANGE[1] + 1)
        this.setTalkTex(this._preloadTexts[Utils.RangeInt(0, this._preloadTexts.length)])
        this._inteval = Scheduler.TimeStart(() => {
            this._startDisplay = !this._startDisplay
            if (this._canControl) {
                let iWordUI: IWordUI = {
                    playerID: 0,
                    attachTarget: this._attachInfoID,
                    isInteval: false,
                    isResident: true
                }
                this._controlUI = ModuleService.getModule(WorldUIModuleC).getWorldUI(iWordUI)
            }

            if (this._startDisplay) {
                this.setTalkTex(this._preloadTexts[Utils.RangeInt(0, this._preloadTexts.length)])
                this._rootUI.rootContent.renderOpacity = 1
                if (this._canControl) {
                    this._controlUI && this._controlUI.setVisable(false, () => { this._canControl = false })
                }
            } else {
                if (this._canControl) {
                    Scheduler.TimeStart(() => {
                        this._controlUI && this._controlUI.setVisable(true, () => { this._canControl = false })
                    }, 0.8)
                }
            }

        }, time, -1)
    }

    /**
     * @description:设置玩家id
     * @param {number} pid
     * @return {*}
     */
    public setTarget(pid: number) {
        this._ownerID = pid
    }



    //超过一定距离渐渐隐藏
    public update(dt: number) {
        if (this._isDestroy) {
            return
        }
        // this._widget.refresh()
        if (!this._startDisplay) {
            if (this._rootUI.rootContent.renderOpacity > 0) {
                this._rootUI.rootContent.renderOpacity -= dt
            }
        }
    }

    //设置常驻
    public setResident(flag: boolean) {
        this._isResident = flag
    }


    public setControl(flag: boolean) {
        this._canControl = flag
    }

    public setEnable() {
        this._isResident = false
        this._isInteval = false
    }

    public setVisable(flag: boolean, falseCallBack: () => void): boolean {
        if (!this._widget && !this._widget.getTargetUIWidget()) {
            falseCallBack && falseCallBack()
            return false
        }
        flag ? this._widget.setVisibility(mw.PropertyStatus.On) : this._widget.setVisibility(mw.PropertyStatus.Off)
        return true
    }


    public getVisable() {
        return this._rootUI.rootContent.renderOpacity > 0 ? true : false
    }

    public getInteval() {
        return this._isInteval
    }

    public getResident() {
        return this._isResident
    }

    public destroy() {
        if (this._isDestroy) {
            return
        }
        this._inteval && Scheduler.Cancel(this._inteval)
        this._isDestroy = true
        this.callback && this.callback(this, this._ownerID)
        // ObjectPool.instance().put("3DUI", this._widget)
        this._widget && this._widget.destroy()
    }


    public attach(obj: mw.GameObject, offset?: mw.Vector) {
        this._attachObj = obj
        this._attachInfoID = obj.gameObjectId
        this._widget.parent = obj
        if (offset) {
            this._widget.localTransform.position = (offset)
        }
    }

    public detach() {
        this._widget.parent = null
    }

    //获取依附物体
    public getAttachedObj() {
        return this._attachObj
    }

    //获取依附物体
    public geUI() {
        return this._widget
    }
}

export interface IWordUI {
    playerID: number
    isAll?: boolean//是否传递给除自己以外的玩家
    uiStr?: string //绑定的2dui工程id
    talkStr?: string[] //对话内容
    attachTarget: string | mw.GameObject //依附物体 or 依附物体guid or 请求同步的马匹infoid
    isInteval: boolean //是否连续
    isResident: boolean //是否常驻显示
    offset?: mw.Vector //依附在物体的偏移
    controlOtherUI?: boolean//是否控制其他世界ui
}

export class WorldUIModuleS extends ModuleS<WorldUIModuleC, null> {

    //同步ui
    public net_addWorldUI(iWordUI: IWordUI) {
        this.getAllClient().net_addWorldUI(iWordUI)
    }

    //同步ui
    public net_detachWorldUI(iWordUI: IWordUI) {
        this.getAllClient().net_detachWorldUI(iWordUI)
    }


}

export class WorldUIModuleC extends ModuleC<WorldUIModuleS, null> {
    private _UIMap: Map<number, WorldShowUI[]> = new Map()

    /**
     * @description: 客户端添加世界ui
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public net_addWorldUI(iWordUI: IWordUI) {
        if (!this._UIMap.has(iWordUI.playerID)) {
            this._UIMap.set(iWordUI.playerID, [])
        }
        let group = this._UIMap.get(iWordUI.playerID)

        let obj: mw.GameObject
        if (iWordUI.attachTarget instanceof mw.GameObject) {
            obj = iWordUI.attachTarget as mw.GameObject
        } else {
            let horseList = ModuleService.getModule(RacingModuleC).getParticleHorses()
            for (const tmp of horseList) {
                if (tmp.getHorseObject() && tmp.getHorseObject().instance.gameObjectId == iWordUI.attachTarget) {
                    obj = tmp.getHorseObject().instance
                    break
                }
            }
            if (!obj) {
                let follow = ModuleService.getModule(BagMouduleC).getFollowingHorse(iWordUI.playerID)
                if (follow) {
                    obj = follow.getHorseObject().instance
                }
            }

        }
        //销毁之前的3dui 不连续不常驻的
        if (obj) {
            for (const t of group) {
                if (t.getAttachedObj().gameObjectId == obj.gameObjectId && !t.getInteval() && !t.getResident()) {
                    t.destroy()
                    break
                }
            }
        } else {
            return null
        }

        let use: WorldShowUI = new WorldShowUI()
        if (iWordUI.isAll && iWordUI.playerID == Player.localPlayer.playerId) {
            this.changeWorldUIText(iWordUI)
        }
        else {
            use.init(iWordUI.uiStr, iWordUI.isInteval, iWordUI.isResident, iWordUI.talkStr)
            use.setTarget(iWordUI.playerID)

            if (iWordUI.controlOtherUI) {
                use.setControl(true)
            }
            use.attach(obj, iWordUI.offset)
            use.callback = (tmpUI: WorldShowUI, tmpID: number) => {
                let group = this._UIMap.get(tmpID)
                group.splice(group.indexOf(tmpUI), 1)
            }
            group.push(use)
        }
        return use
    }

    /**
     * @description: 删除客户端世界ui
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public delWorldUI(iWordUI: IWordUI) {
        let uiGroup = this._UIMap.get(iWordUI.playerID)
        if (!uiGroup) {
            return
        }

        for (const ui of uiGroup) {
            if (ui.getAttachedObj().gameObjectId == iWordUI.attachTarget &&
                ui.getInteval() == iWordUI.isInteval && ui.getResident() == iWordUI.isResident) {
                ui.destroy()
                break
            }
        }
    }

    /**
     * @description: 解绑世界ui
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public net_detachWorldUI(iWordUI: IWordUI) {
        let uiGroup = this._UIMap.get(iWordUI.playerID)
        for (const ui of uiGroup) {
            if (ui.getAttachedObj().gameObjectId == iWordUI.attachTarget &&
                ui.getInteval() == iWordUI.isInteval && ui.getResident() == iWordUI.isResident) {
                ui.detach()
            }
        }

    }

    /**
     * @description: 获得世界ui
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public getWorldUI(iWordUI: IWordUI) {
        let find: WorldShowUI = null
        let uiGroup = this._UIMap.get(Player.localPlayer.playerId)
        for (const ui of uiGroup) {
            if (ui.getAttachedObj().gameObjectId == iWordUI.attachTarget &&
                ui.getInteval() == iWordUI.isInteval && ui.getResident() == iWordUI.isResident) {
                find = ui
                break
            }
        }
        return find
    }

    /**
     * @description: 改变对话框内容
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public changeWorldUIText(iWordUI: IWordUI) {
        let uiGroup = this._UIMap.get(Player.localPlayer.playerId)
        for (const ui of uiGroup) {
            if (ui.getAttachedObj().gameObjectId == iWordUI.attachTarget &&
                ui.getInteval() == iWordUI.isInteval && ui.getResident() == iWordUI.isResident) {
                ui.setPreLoadTalks(iWordUI.talkStr)
                break
            }
        }
    }

    /**
     * @description: 同步给其他玩家
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public reqAddToAllPlayer(iWordUI: IWordUI) {
        this.server.net_addWorldUI(iWordUI)
    }

    /**
     * @description: 请求解绑全部玩家
     * @param {IWordUI} iWordUI
     * @return {*}
     */
    public reqDetachToAllPlayer(iWordUI: IWordUI) {
        this.server.net_detachWorldUI(iWordUI)
    }

    onUpdate(dt: number): void {
        if (this._UIMap.size > 0) {
            this._UIMap.forEach(group => {
                group.forEach(e => {
                    e.update(dt)
                })
            })
        }
    }

}