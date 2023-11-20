/*
 * @Author: jiezhong.zhang
 * @Date: 2022-12-06 09:21:19
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2022-12-20 15:26:48
 */

import { EffectScene } from "../Common";
import { Singleton } from "../utils/Singleton";

export class EffectMgr extends Singleton {
    /** 场景 - 特效数组 */
    private _effectMap: Map<string, mw.Effect[]> = new Map();
    /** 当前场景 */
    private _curScene: string = EffectScene.EffectNone;
    /** 当前场景 */
    private _lastScene: string = EffectScene.EffectNone;

    /** 初始化 */
    public init() {
        this._curScene = EffectScene.EffectNone;

        this.setParticle(EffectScene.EffectGuess);
        this.setParticle(EffectScene.EffectHall);
        this.setParticle(EffectScene.EffectBusiness);
        this.setParticle(EffectScene.EffectBreed);
        this.setParticle(EffectScene.EffectFinish);
        this.setParticle(EffectScene.EffectAward);
        this.setParticle(EffectScene.EffectShop);

        this.playEffect(EffectScene.EffectHall);
    }

    /**
     * 切换场景
     * @param type 切换到的场景
     */
    public ChangeScene(type: string) {
        if (this._curScene !== EffectScene.EffectNone) {
            this.stopEfeect(this._curScene);
            this._lastScene = this._curScene;
        }
        this.playEffect(type);
        this._curScene = type;
    }

    /**
     * 恢复到上一个场景
     */
    public restore() {
        if (this._lastScene !== EffectScene.EffectNone) {
            this.stopEfeect(this._curScene);
            this.playEffect(this._lastScene);
            this._curScene = this._lastScene;
            this._lastScene = EffectScene.EffectNone;
        }
    }


    /**
     * 设置特效
     * @param type 所处场景
     * @param arr guid数组
     */
    private setParticle(type: string) {
        let ret: mw.Effect[] = mw.GameObject.findGameObjectsByTag(type) as mw.Effect[];
        this._effectMap.set(type, ret);
    }

    /**
     * 停止特效播放
     * @param type 停止场景
     */
    public stopEfeect(type: string) {
        let arr = this._effectMap.get(type);
        arr.forEach((effect) => {
            effect.stop();
        })
    }

    /**
     * 开始特效播放
     * @param type 开始场景
     */
    public playEffect(type: string) {
        let arr = this._effectMap.get(type);
        arr.forEach((effect) => {
            effect.loop = true;
            effect.play();
        })
    }
}