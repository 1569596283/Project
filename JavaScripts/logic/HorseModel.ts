import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { CommonAssets, EHorseAnimation, EPartType, GlobalVar, IHorseInfo, IPartInfo } from "../Common";
import { GameConfig } from "../config/GameConfig";
import PrefabAnimation, { CustomAniamtionEvent } from '../Prefabs/模板/Script/PrefabAnimation';
import { Scheduler } from "../utils/Scheduler";
import PartsMgr from "./PartsMgr";

export default class HorseModel {

    //肢体列表
    protected _parts: IPartInfo[]

    //图纸生成的实例
    protected _instance: mw.GameObject

    protected _info: IHorseInfo
    protected _scriptContext: PrefabAnimation

    public get instance() {
        return this._instance
    }

    constructor(info: IHorseInfo) {
        this._parts = info.parts
        this._info = info
    }

    public getHorseInfo() {
        return this._info
    }

    public setHorseInfo(replaceInfo: IHorseInfo) {
        this._info = replaceInfo
    }

    public destory() { }

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

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

    public forzen(): void {
        this.instance.worldTransform.position = mw.Vector.one.multiply(100000)
    }
}


export class HoresModelS extends HorseModel {
    constructor(info: IHorseInfo) {
        super(info)
    }

    /**
     * 销毁
     */
    public destory() {
    }
}


export class HoresModelC extends HorseModel {

    /** 大腿名称 */
    private _thighName: string[] = ["body_leftleg1", "body_rightleg1", "body_leftleg3", "body_rightleg3"];
    /** 当前需要创建的大腿的序号，顺序为 左前、右前、左后、右后 */
    private _thighIndex: number = 0;

    /** 小腿名称 */
    private _calfName: string[] = ["body_leftleg1_leftleg2", "body_rightleg1_rightleg2", "body_leftleg3_leftleg4", "body_rightleg3_rightleg4"];
    /** 当前需要创建的小腿的序号，顺序为 左前、右前、左后、右后 */
    private _calfIndex: number = 0;
    /** 当前动画名称 */
    private _curAnimationName: string = '';
    /** 当前奔跑动画名称 */
    private _curRunAnimationName: string = '';
    /** 行为动画切换定时器 */
    private _behaviorTime: number = 0;


    constructor(info: IHorseInfo) {
        super(info)
    }

    /**
     * 绑定到物体
     * @param parent 
     */
    public attachTo(parent: mw.GameObject) {
        if (!this._instance) { return }
        this._instance.parent = parent;
        this._instance.localTransform.position = (new mw.Vector(0, 0, 0))
        this._instance.localTransform.rotation = (new mw.Rotation(0, 0, 0));
    }


    private _bodyObjects: mw.GameObject[] = [];

    /**
     * 剥离
     */
    public detach() {
        this._instance.parent = null
    }

    /**
     * 构造身体
     */
    public async build(effect: boolean) {
        if (!mw.AssetUtil.assetLoaded(CommonAssets.HORSE_GUID)) {
            await mw.AssetUtil.asyncDownloadAsset(CommonAssets.HORSE_GUID)
        }
        this._thighIndex = 0;
        this._calfIndex = 0;

        this._instance = SpawnManager.spawn({ guid: CommonAssets.HORSE_GUID });

        this._instance.setCollision(mw.PropertyStatus.Off);

        this._scriptContext = this._instance.getScriptByName('PrefabAnimation') as PrefabAnimation
        this.createPart(0);

        if (effect) {
            if (this._info.trailingID) {
                let trailingCfg = GameConfig.Trailing.getElement(this._info.trailingID);
                await mw.AssetUtil.asyncDownloadAsset(trailingCfg.GUID);
            }
        }
    }

    private createPart(index: number) {
        if (index >= this._parts.length || !this._instance) {
            console.log("创建肢体出错了  ：", index, this._parts.length);
            return;
        }
        const partInfo = this._parts[index];

        PartsMgr.instance().createPart(partInfo.partId, partInfo.name, this.setPart);
        if (index + 1 < this._parts.length) {
            this.createPart(index + 1);
        }
    }

    setPart = (partType: EPartType, part: mw.GameObject) => {
        const node = this.findChild(partType)
        part.parent = node
        part.setCollision(mw.PropertyStatus.Off)
        part.localTransform.position = (mw.Vector.zero)
        part.localTransform.rotation = (mw.Rotation.zero)
        part.localTransform.scale = (mw.Vector.one)
        this._bodyObjects.push(part)
    }


    /**
     * 查找子节点
     * @param partType 
     * @returns 
     */
    protected findChild(partType: number) {
        let path: string;
        switch (partType) {
            case EPartType.Head:
                path = "body_neck_head";
                break;
            case EPartType.Neck:
                path = "body_neck";
                break;
            case EPartType.Body:
                path = "body";
                break;
            case EPartType.Tail:
                path = "body_tail";
                break;
            case EPartType.Thigh:
                path = this._thighName[this._thighIndex];
                this._thighIndex++;
                break;
            case EPartType.Calf:
                path = this._calfName[this._calfIndex];
                this._calfIndex++;
                break;

        }
        const pathNodes = path.split('_')
        let retNode: mw.GameObject = null
        let node = this._instance
        // console.log("模型路径", path)
        for (let i = 0; i < pathNodes.length; i++) {
            node = node.getChildByName(pathNodes[i])
            if (!node) {
                console.error("没有找到节点名字", pathNodes[i])
                return null
            }
            retNode = node
        }
        return retNode
    }

    /**
     * 播放动画
     * @param animationName 动画名
     * @param timeScale 播放速度，默认是1, 越小越快
     * @param loop 是否循环
     */
    public playAnimation(animationName: string, timeScale: number, loop: boolean) {
        if (this._scriptContext && this.switchAnimaition(animationName)) {
            this._curAnimationName = animationName;
            this._scriptContext.play(animationName, timeScale, loop);
        }
    }

    /**
     * 能否直接切换动画
     * @param animationName 要播放的动画名称
     * @returns 能否切换
     */
    private switchAnimaition(animationName: string): boolean {
        // 切换为跑步动画
        if (animationName.startsWith("Run")) {
            //是否是第二次切换为这个跑步动作（第二次切换就允许切换）
            if (this._curRunAnimationName == animationName) {
                return true;
            }
            this._curRunAnimationName = animationName
            // 当前在播放行为动画
            if (this._curAnimationName.startsWith("Action")) {
                return false;
            }
        }
        return true;
    }

    /**
     * 播放行为动画
     * @param animationName 动画名称
     * @param time 播放时间
     */
    public playBehavior(animationName: string, time: number) {
        this.playAnimation(animationName, 0.7, true);
        this.clearBehaviorTime();
        this._behaviorTime = Scheduler.TimeStart(() => {
            this.playAnimation(this._curRunAnimationName, 0.7, true);
        }, time);
    }

    /**
     * 清理行为动画播放计时器
     */
    public clearBehaviorTime() {
        if (this._behaviorTime) {
            Scheduler.Cancel(this._behaviorTime);
            this._behaviorTime = 0;
        }
    }

    /**
     * 设置大小
     * @param scale 
     */
    public setScale(scale: number = 1) {
        this.instance.localTransform.scale = (new mw.Vector(scale, scale, scale))
    }

    /**
     * 注册动画事件
     * @param fn 
     */
    public registerAnimationEvent(fn: (script: PrefabAnimation, event: CustomAniamtionEvent) => void) {
        if (this._scriptContext)
            this._scriptContext.registerEvent(fn)
    }

    /**
     * 停止动画
     */
    public stopAnimation() {
        if (this._scriptContext)
            this._scriptContext.stop()
    }

    /**
     * 销毁
     */
    public destory() {
        if (this._bodyObjects.length < this._parts.length) {
            setTimeout(() => {
                this.destory();
            }, 50);
            return;
        }
        this.stopAnimation();
        this._bodyObjects.forEach((obj, key) => {
            obj.parent = null
            const script = obj.getScript('PrefabAnimation') as unknown as PrefabAnimation
            if (script) {
                script.stop()
            }
            this.destroyChild(obj)
        })
        this._bodyObjects.length = 0

        // if (this._instance) {
        // 	this._instance.destroy()
        // 	this._instance = null
        // }
        this.destroyChild(this._instance)
        this._instance = null
    }

    private destroyChild(gameobject: mw.GameObject) {
        if (!gameobject) return
        const childs = gameobject.getChildren()
        childs.forEach(c => {
            this.destroyChild(c)
        })
        gameobject.destroy()
    }

    /**
     * 对指定对象的子物体描边
     * @param go 对象
     */
    protected childAddOutline(go: mw.GameObject) {
        let child = go.getChildren();
        if (child.length > 0) {
            child.forEach(cGo => {
                this.addOutline(cGo);
            });
        }
    }

    /**
     * 给指定物体及子物体添加描边（tag为 WithoutStroke 的物体及子物体不会被描边）
     * @param go 需要添加描边的物体
     * @returns 
     */
    protected addOutline(go: mw.GameObject) {
        let child = go.getChildren();
        if (go instanceof mw.Model) {
            // let sm = go as mw.Model;
            go.asyncReady().then((obj) => {
                obj.setOutline(true, LinearColor.black, 12);
                // GeneralManager.modifyaddOutlineEffect(obj, mw.LinearColor.black);
            })

        }
        if (child.length > 0) {
            child.forEach(cGo => {
                this.addOutline(cGo);
            });
        }
    }

    /**
     * 获得指定肢体节点
     * @param partType 部位
     * @param index 肢体数组的第几个（一匹马的所有肢体都算，从0开始）
     * @returns 节点
     */
    public getPartNode(partType: EPartType, index: number) {
        //是第几条腿（使用前提：头、脖子、身体、尾巴、大腿、小腿依次存放）
        let num = index - 4;
        num = Math.floor(num / 2);
        let path: string;
        switch (partType) {
            case EPartType.Head:
                path = "body_neck_head";
                break;
            case EPartType.Neck:
                path = "body_neck";
                break;
            case EPartType.Body:
                path = "body";
                break;
            case EPartType.Tail:
                path = "body_tail";
                break;
            case EPartType.Thigh:
                path = this._thighName[num];
                break;
            case EPartType.Calf:
                path = this._calfName[num];
                break;
        }
        const pathNodes = path.split('_')
        let retNode: mw.GameObject = null
        let node = this._instance
        for (let i = 0; i < pathNodes.length; i++) {
            node = node.getChildByName(pathNodes[i])
            if (!node) {
                console.error("没有找到节点名字", pathNodes[i])
                return null
            }
            retNode = node
        }
        return retNode
    }
}