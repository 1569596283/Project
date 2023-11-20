
const key_parseObjKey = "key_parseObjKey";
const key_parseObjVal = "key_parseObjVal";


declare namespace UE {

    export class Vector {

        public X: number;
        public Y: number;
        public Z: number;
        constructor(X: number, Y: number, Z: number);
    }


    export class Rotator {
        constructor(X: number, Y: number, Z: number);


    }

    export type MWActor = any;
}
/**
 * 帧事件
 */
class FrameEvent {
    key: string = ''
    paramer: string = ''
}

/**
 * 变换数据
 */
class NodeInfo {
    index: number = 0
    visible: boolean = true
    relativeLocation: mw.Vector = mw.Vector.zero
    relativeRotation: mw.Rotation = mw.Rotation.zero
    relativeScale: mw.Vector = mw.Vector.zero

    relativeLocationUE: UE.Vector = null
    relativeRotationUE: UE.Rotator = null
    relativeScaleUE: mw.Vector = null
}

/**
 * 帧数据
 */
class FrameData {
    frameIndex: number
    nodeData: Map<string, NodeInfo> = new Map()
    event: FrameEvent = new FrameEvent()
}

/**
 * 动画信息
 */
class AnimationData {
    guid: string = ''
    animationName: string = ''
    frameCount: number = 60
    speed: number = 60
    keyFrame: Map<number, FrameData> = new Map()
}

class Node {
    obj: mw.GameObject
    ueObj: UE.MWActor

    visible0: boolean = true
    visible: boolean

    location0: mw.Vector
    location: mw.Vector

    rotation0: mw.Rotation
    rotation: mw.Rotation

    scale0: mw.Vector
    scale: mw.Vector

    path: string = ''
}

export enum CustomAnimationEventType {
    Start = 'Start',
    Event = "Event",
    Complete = "Complete",
    Pause = "Pause",
    Resume = "Resume",
    Stop = "Stop"
}

export class CustomAniamtionEvent {
    animationName: string = ''
    eventName: string = ''
    eventParamer: string = ''
    type: CustomAnimationEventType
}

@Component
export default class PrefabAnimation extends mw.Script {
    @mw.Property({ displayName: '动画数据' })
    animatonData: string = ""

    @mw.Property({ displayName: '真机(true)/PC(false)' })
    isOnline: boolean = false

    //动画列表
    private _animationList: AnimationData[] = []

    //默认动画
    @mw.Property({ displayName: '默认动画' })
    private defaultAnimation: string = ''

    //当前动画帧
    private _curAnimation: AnimationData

    //动画帧
    private _animationFrames: FrameData[] = []

    //播放帧索引
    private _playIndex: number = 0

    //帧时间
    private _frameTime: number = 0

    //初始帧间隔
    private _baseFrameInterval: number = 0

    //帧间隔
    private _realFrameInterval: number = 0

    //是否播放
    private _playing: boolean = false

    //是否循环
    private _bPlayLoop: boolean = false

    //播放速度
    private _playTimeScale: number = 1

    //预制体节点列表
    private _nodes: Node[] = []

    //初始化标志
    private _bInited: boolean = false

    //经过时间缩放的帧数量
    private _realFrameCount: number = 0

    //应该时间缩放的关键帧
    private _realKeyFrameData: Map<number, FrameData> = new Map()

    private _scaleInfoList: Map<string, FrameData[]> = new Map();

    private _eventCallback: (script: PrefabAnimation, event: CustomAniamtionEvent) => void

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        super.onStart()
        this.useUpdate = true

        if (this.defaultAnimation != '') {
            this.play(this.defaultAnimation, 1, true)
        }
    }

    public init() {
        this._nodes.length = 0

        // const children = this.gameObject.getChildren()
        // for (const child of children) {
        // 	this.initNode(child)
        // }

        // this.animatonData = "\"" + this.animatonData + "\"" 

        this.initNode(this.gameObject)

        // console.log('初始化节点', this._nodes)

        this.serilaize()

        if (this.isOnline) {
            this._baseFrameInterval = 1 / 30
        } else {
            this._baseFrameInterval = 1 / 60
        }
        this._bInited = true
    }

    protected initNode(obj: mw.GameObject, parentNode?: Node) {
        // console.log("初始化节点")

        const children = obj.getChildren()
        for (const child of children) {
            if (child instanceof UIWidget || child instanceof Trigger) {
                break;
            }
            let location = child.localTransform.position;
            let rotation = child.localTransform.rotation
            let scale = child.localTransform.scale;
            let node = new Node()
            node.obj = child
            node.ueObj = child['actor'];
            node.visible = node.visible0 = node.obj.getVisibility()
            node.location = node.location0 = new mw.Vector(Number(location.x.toFixed(3)), Number(location.y.toFixed(3)), Number(location.z.toFixed(3)))
            node.rotation = node.rotation0 = new mw.Rotation(Number(Math.round(rotation.x)), Number(Math.round(rotation.y)), Number(Math.round(rotation.z)))
            node.scale = node.scale0 = new mw.Vector(Number(scale.x.toFixed(3)), Number(scale.y.toFixed(3)), Number(scale.z.toFixed(3)))
            if (parentNode) {
                node.path = parentNode.path + "." + child.name
            } else {
                node.path = child.name
            }
            this._nodes.push(node)

            this.initNode(child, node)
        }
    }

    /** 
     * 每帧被执行,与上一帧的延迟 dt 秒
     * 此函数执行需要将this.useUpdate赋值为true
     */
    protected onUpdate(dt: number): void {
        super.onUpdate(dt)
        if (this._playing) {
            this._frameTime += dt
            while (this._frameTime >= this._realFrameInterval) {
                this.playframe(this._playIndex)
                this._frameTime -= this._realFrameInterval

                this._playIndex++
                if (this._playIndex >= this._realFrameCount) {
                    if (this._bPlayLoop) {
                        this._playIndex = 0
                    } else {
                        this.stop()
                    }
                }
            }
        }
    }

    protected updateTransform(index: number) {
        const frameData = this._animationFrames[index]
        // console.log('playframe:', index,frameData.nodeData)
        for (const node of this._nodes) {
            const nodeInfo = frameData.nodeData.get(node.path)
            if (nodeInfo.relativeLocation.x != node.location.x || nodeInfo.relativeLocation.y != node.location.y || nodeInfo.relativeLocation.z != node.location.z) {
                // node.obj.setRelativeLocation(nodeInfo.relativeLocation)
                if (nodeInfo.relativeLocationUE == null)
                    nodeInfo.relativeLocationUE = new UE.Vector(nodeInfo.relativeLocation.x, nodeInfo.relativeLocation.y, nodeInfo.relativeLocation.z)
                node.ueObj.K2_SetActorRelativeLocation(nodeInfo.relativeLocationUE, false, null, true)
                node.location = nodeInfo.relativeLocation
            }

            if (nodeInfo.relativeRotation.x != node.rotation.x || nodeInfo.relativeRotation.y != node.rotation.y || nodeInfo.relativeRotation.z != node.rotation.z) {
                // node.obj.setRelativeRotation(nodeInfo.relativeRotation)
                if (nodeInfo.relativeRotationUE == null)
                    nodeInfo.relativeRotationUE = new UE.Rotator(nodeInfo.relativeRotation.y, nodeInfo.relativeRotation.z, nodeInfo.relativeRotation.x);
                node.ueObj.K2_SetActorRelativeRotation(nodeInfo.relativeRotationUE, false, null, true);
                node.rotation = nodeInfo.relativeRotation
            }

            if (nodeInfo.relativeScale.x != node.scale.x || nodeInfo.relativeScale.y != node.scale.y || nodeInfo.relativeScale.z != node.scale.z) {
                // node.obj.setRelativeScale(nodeInfo.relativeScale)
                if (nodeInfo.relativeScaleUE == null)
                    nodeInfo.relativeScaleUE = new mw.Vector(nodeInfo.relativeScale.x, nodeInfo.relativeScale.y, nodeInfo.relativeScale.z)
                node.obj.localTransform.scale = (nodeInfo.relativeScale.clone())
                node.obj.localTransform = node.obj.localTransform;
                node.scale = nodeInfo.relativeScale.clone()
            }

            if (node.visible != nodeInfo.visible) {
                if (nodeInfo.visible) {
                    node.obj.setVisibility(mw.PropertyStatus.On)
                } else {
                    node.obj.setVisibility(mw.PropertyStatus.Off)
                }
                node.visible = nodeInfo.visible
            }
        }
    }

    protected playframe(index: number) {
        const frameData = this._animationFrames[index]
        this.updateTransform(index)
        if (this._eventCallback) {
            if (index === 0) {
                let event = new CustomAniamtionEvent()
                event.animationName = this._curAnimation.animationName
                event.type = CustomAnimationEventType.Start
                event.eventName = CustomAnimationEventType.Start
                this.onEvent(event)
            } else if (index === this._realFrameCount - 1) {
                let event = new CustomAniamtionEvent()
                event.animationName = this._curAnimation.animationName
                event.type = CustomAnimationEventType.Complete
                event.eventName = CustomAnimationEventType.Complete
                this.onEvent(event)
            }
            if (frameData.event.key !== '') {
                let event = new CustomAniamtionEvent()
                event.animationName = this._curAnimation.animationName
                event.type = CustomAnimationEventType.Event
                event.eventName = frameData.event.key
                event.eventParamer = frameData.event.paramer
                this.onEvent(event)
            }
        }
    }

    /**
     * 注册事件
     * @param fn 回调函数
     */
    public registerEvent(fn: (script: PrefabAnimation, event: CustomAniamtionEvent) => void) {
        this._eventCallback = fn
    }

    /**
     * 播放动画
     * @param animationName 动画名
     * @param timeScale 播放速度，默认是1, 越小越快
     * @param loop 是否开启循环
     * @returns 
     */
    public play(animationName: string, timeScale: number = 1, loop: boolean = false) {

        if (!this._bInited) {
            this.init()
        }

        if (this._curAnimation && this._curAnimation.animationName == animationName) {
            return
        }

        //停止当前的动画
        this.stop()

        this._playTimeScale = timeScale
        this._bPlayLoop = loop

        this._curAnimation = this.getAnimation(animationName)
        if (!this._curAnimation) {
            console.error(`未找到动画${animationName}`)
            return
        }

        this._realFrameInterval = 1 / this._curAnimation.speed

        let animationKey: string = animationName + timeScale.toString() + loop;
        if (this._scaleInfoList.has(animationKey)) {
            this._animationFrames = this._scaleInfoList.get(animationKey);
            this._realFrameCount = this._animationFrames.length
        } else {
            this.zoomKeyFrame(timeScale)
            this._animationFrames = this.caculateAnimationFrame();
            this._scaleInfoList.set(animationKey, [].concat(this._animationFrames));
        }

        this._playing = true
        this._playIndex = 0
    }

    /**
     * 暂停，恢复的时候会从当前帧继续播放
     */
    public pause() {
        if (!this._curAnimation || !this._playing) {
            return
        }
        this._playing = false

        let event = new CustomAniamtionEvent()
        event.animationName = this._curAnimation.animationName
        event.eventName = CustomAnimationEventType.Pause
        event.type = CustomAnimationEventType.Pause
        this.onEvent(event)
    }

    /**
     * 恢复
     */
    public resume() {
        if (!this._curAnimation || this._playing) {
            return
        }

        this._playing = true

        let event = new CustomAniamtionEvent()
        event.animationName = this._curAnimation.animationName
        event.eventName = CustomAnimationEventType.Resume
        event.type = CustomAnimationEventType.Resume
        this.onEvent(event)
    }

    /**
     * 停止播放，下次播放将会回到第一帧
     */
    public stop() {
        if (!this._curAnimation || !this._playing) {
            return
        }

        let event = new CustomAniamtionEvent()
        event.animationName = this._curAnimation.animationName
        event.eventName = CustomAnimationEventType.Stop
        event.type = CustomAnimationEventType.Stop

        for (const node of this._nodes) {
            node.location = new mw.Vector(node.location0.x, node.location0.y, node.location0.z)
            node.ueObj.K2_SetActorRelativeLocation(new UE.Vector(node.location.x, node.location.y, node.location.z), false, null, true)

            node.rotation = new mw.Rotation(node.rotation0.x, node.rotation0.y, node.rotation0.z)
            node.ueObj.K2_SetActorRelativeRotation(new UE.Rotator(node.rotation.y, node.rotation.z, node.rotation.x), false, null, true);

            node.scale = new mw.Vector(node.scale0.x, node.scale0.y, node.scale0.z)
            node.obj.localTransform.scale = (node.scale.clone())
            node.obj.localTransform = node.obj.localTransform;
            node.visible = node.visible0
            if (node.visible) {
                node.obj.setVisibility(mw.PropertyStatus.On)
            } else {
                node.obj.setVisibility(mw.PropertyStatus.Off)
            }
        }
        this.updateTransform(0)

        this.onEvent(event)

        this._playing = false
        this._playIndex = 0
        this._frameTime = 0
        this._bPlayLoop = false
        this._curAnimation = null
    }

    /**
     * 事件触发
     * @param eventName 
     * @param paramer 
     */
    private onEvent(event: CustomAniamtionEvent) {
        if (this._curAnimation) {
            this._eventCallback && this._eventCallback(this, event)
        }
    }

    protected getAnimation(animationName: string) {
        let retAnimation: AnimationData = null
        for (const animation of this._animationList) {
            if (animation.animationName === animationName) {
                retAnimation = animation
                break
            }
        }
        return retAnimation
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {
        this._animationFrames.length = 0
        this._realKeyFrameData.clear()
        this._animationList.length = 0
        this._scaleInfoList.clear()
        this._nodes.length = 0
    }
    private serilaize() {
        this._animationList.length = 0
        // let object = JSON.parse(this.animatonData)
        // object = JSON.parse(object)
        let object = Object(this.animatonData)
        object = JSON.parse(object)


        Object.keys(object).forEach((animationName) => {
            let animationData = object[animationName]
            if (typeof (animationData) != 'object') { console.log('非法的对象', animationName); return }
            let map = new Map<number, FrameData>()
            let keyframe = animationData['keyFrame']
            Object.keys(keyframe).forEach((key) => {
                let frameIndex = Number(key)
                let frameData = new FrameData()
                frameData.frameIndex = frameIndex
                frameData.event.key = keyframe[key]['event']['key']
                frameData.event.paramer = keyframe[key]['event']['paramer']
                Object.keys(keyframe[key]['nodes']).forEach((nodedataKey) => {
                    let nodeData = keyframe[key]['nodes'][nodedataKey]
                    let nodeInfo = new NodeInfo()
                    nodeInfo.index = nodeData['index']
                    nodeInfo.visible = nodeData['visible']
                    nodeInfo.relativeLocation = new mw.Vector(nodeData['location']['x'], nodeData['location']['y'], nodeData['location']['z'])
                    nodeInfo.relativeRotation = new mw.Rotation(nodeData['rotation']['x'], nodeData['rotation']['y'], nodeData['rotation']['z'])
                    nodeInfo.relativeScale = new mw.Vector(nodeData['scale']['x'], nodeData['scale']['y'], nodeData['scale']['z'])
                    frameData.nodeData.set(nodedataKey, nodeInfo)
                })

                map.set(frameIndex, frameData)
            })

            let data = new AnimationData()
            data.animationName = animationData['animationName']
            data.frameCount = animationData['frameCount']
            data.speed = animationData['speed']
            data.guid = animationData['guid']
            data.keyFrame = map

            this._animationList.push(data)
        })
        // //console.log("序列化成功", this._animationList)
    }

    //缩放关键帧
    private zoomKeyFrame(timeScale: number) {
        this._realKeyFrameData.clear()
        for (const [frameIndex, frameData] of this._curAnimation.keyFrame) {
            const zoomIndex = Math.floor(frameIndex * timeScale)

            let newFrameData = new FrameData()
            newFrameData.frameIndex = zoomIndex

            newFrameData.event.key = frameData.event.key
            newFrameData.event.paramer = frameData.event.paramer

            for (const [string, nodeData] of frameData.nodeData) {
                let newNodeData = new NodeInfo()
                newNodeData.index = zoomIndex
                newNodeData.visible = nodeData.visible
                newNodeData.relativeLocation = new mw.Vector(nodeData.relativeLocation.x, nodeData.relativeLocation.y, nodeData.relativeLocation.z)
                newNodeData.relativeRotation = new mw.Rotation(nodeData.relativeRotation.x, nodeData.relativeRotation.y, nodeData.relativeRotation.z)
                newNodeData.relativeScale = new mw.Vector(nodeData.relativeScale.x, nodeData.relativeScale.y, nodeData.relativeScale.z)

                newFrameData.nodeData.set(string, newNodeData)
            }
            this._realKeyFrameData.set(zoomIndex, newFrameData)
        }
        let zoomFrameCount = (this._curAnimation.frameCount - 1) * (this._playTimeScale)

        this._realFrameCount = Math.ceil(zoomFrameCount) + 1
    }

    //计算动画帧
    private caculateAnimationFrame() {
        const frameCount = this._realFrameCount
        let animationFrame: FrameData[] = []
        for (let i = 0; i < frameCount; i++) {
            let frameData = new FrameData()
            frameData.frameIndex = i
            for (const node of this._nodes) {
                let nodeInfo = new NodeInfo()
                nodeInfo.index = i
                nodeInfo.visible = node.visible0
                nodeInfo.relativeLocation = new mw.Vector(node.location0.x, node.location0.y, node.location0.z)
                nodeInfo.relativeRotation = new mw.Rotation(node.rotation0.x, node.rotation0.y, node.rotation0.z)
                nodeInfo.relativeScale = new mw.Vector(node.scale0.x, node.scale0.y, node.scale0.z)

                frameData.nodeData.set(node.path, nodeInfo)
            }

            animationFrame.push(frameData)
        }
        //console.log("初始化动画帧", this._realKeyFrameData, frameCount, animationFrame)

        //将关键帧复制到动画帧上
        for (let i = 0; i < frameCount; ++i) {
            let animateData: FrameData = animationFrame[i]
            if (this._realKeyFrameData.has(i)) {
                let keyFrameData = this._realKeyFrameData.get(i)
                animateData.event.key = keyFrameData.event.key
                animateData.event.paramer = keyFrameData.event.paramer
                for (const node of this._nodes) {
                    if (keyFrameData.nodeData.has(node.path)) {
                        const nodeInfo = keyFrameData.nodeData.get(node.path)
                        animateData.nodeData.get(node.path).visible = nodeInfo.visible
                        animateData.nodeData.get(node.path).relativeLocation = new mw.Vector(nodeInfo.relativeLocation.x, nodeInfo.relativeLocation.y, nodeInfo.relativeLocation.z)
                        animateData.nodeData.get(node.path).relativeRotation = new mw.Rotation(nodeInfo.relativeRotation.x, nodeInfo.relativeRotation.y, nodeInfo.relativeRotation.z)
                        animateData.nodeData.get(node.path).relativeScale = new mw.Vector(nodeInfo.relativeScale.x, nodeInfo.relativeScale.y, nodeInfo.relativeScale.z)
                    }
                }
            }
        }
        //console.log('复制帧', animationFrame)

        //插帧
        for (const node of this._nodes) {
            let step = 0
            while (step < frameCount) {
                let lastNodeInfo = this.getLastKeyFrameTransform(step - 1, node)
                if (!lastNodeInfo) {
                    lastNodeInfo = animationFrame[0].nodeData.get(node.path)
                }

                let nextNodeInfo = this.getNextKeyFrameData(step, node)
                if (nextNodeInfo && nextNodeInfo.index > 0) {
                    for (let i = lastNodeInfo.index; i < nextNodeInfo.index; i++) {
                        let animatFrameData: FrameData = animationFrame[i]
                        let nodeInfo = animatFrameData.nodeData.get(node.path)
                        if (i == lastNodeInfo.index) {
                            nodeInfo.visible = lastNodeInfo.visible
                            nodeInfo.relativeLocation = this.vlerp(lastNodeInfo.relativeLocation, nextNodeInfo.relativeLocation, 0)
                            nodeInfo.relativeRotation = this.rlerp(lastNodeInfo.relativeRotation, nextNodeInfo.relativeRotation, 0)
                            nodeInfo.relativeScale = this.vlerp(lastNodeInfo.relativeScale, nextNodeInfo.relativeScale, 0)
                        } else {
                            nodeInfo.visible = lastNodeInfo.visible
                            const alpha = (i - lastNodeInfo.index) / (nextNodeInfo.index - lastNodeInfo.index + 1)
                            nodeInfo.relativeLocation = this.vlerp(lastNodeInfo.relativeLocation, nextNodeInfo.relativeLocation, alpha)
                            nodeInfo.relativeRotation = this.rlerp(lastNodeInfo.relativeRotation, nextNodeInfo.relativeRotation, alpha)
                            nodeInfo.relativeScale = this.vlerp(lastNodeInfo.relativeScale, nextNodeInfo.relativeScale, alpha)
                        }
                    }

                    step = nextNodeInfo.index + 1
                } else {
                    // console.log("没有找到下一帧", step, lastNodeInfo)
                    for (let i = step; i < frameCount; i++) {
                        let animatFrameData: FrameData = animationFrame[i]
                        let nodeInfo = animatFrameData.nodeData.get(node.path)
                        nodeInfo.visible = lastNodeInfo.visible
                        nodeInfo.relativeLocation = new mw.Vector(lastNodeInfo.relativeLocation.x, lastNodeInfo.relativeLocation.y, lastNodeInfo.relativeLocation.z)
                        nodeInfo.relativeRotation = new mw.Rotation(lastNodeInfo.relativeRotation.x, lastNodeInfo.relativeRotation.y, lastNodeInfo.relativeRotation.z)
                        nodeInfo.relativeScale = new mw.Vector(lastNodeInfo.relativeScale.x, lastNodeInfo.relativeScale.y, lastNodeInfo.relativeScale.z)
                    }
                    break
                }
            }
        }

        //console.log('插帧', animationFrame)
        return animationFrame
    }

    /**
     * 向量线性插值
     * @param from 起始点
     * @param to 目标点
     * @param alpha 权重
     * @returns 
     */
    private vlerp(from: mw.Vector, to: mw.Vector, alpha: number) {
        let x = mw.MathUtil.lerp(from.x, to.x, alpha)
        let y = mw.MathUtil.lerp(from.y, to.y, alpha)
        let z = mw.MathUtil.lerp(from.z, to.z, alpha)
        return new mw.Vector(Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3)))
    }

    /**
     * 旋转线性插值
     * @param from 起始点
     * @param to 目标点
     * @param alpha 权重
     * @returns 
     */
    private rlerp(from: mw.Rotation, to: mw.Rotation, alpha: number) {
        let x = mw.MathUtil.lerp(from.x, to.x, alpha)
        let y = mw.MathUtil.lerp(from.y, to.y, alpha)
        let z = mw.MathUtil.lerp(from.z, to.z, alpha)
        return new mw.Rotation(Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3)))
    }

    //上一关键帧
    private getLastKeyFrameTransform(index: number, node: Node) {
        let retNodeInfo: NodeInfo;
        while (index > 0) {
            if (this._realKeyFrameData.has(index)) {
                const keyFrame = this._realKeyFrameData.get(index)
                if (keyFrame.nodeData.has(node.path)) {
                    let nodeInfo = keyFrame.nodeData.get(node.path)
                    retNodeInfo = new NodeInfo()
                    retNodeInfo.index = nodeInfo.index
                    retNodeInfo.visible = nodeInfo.visible
                    retNodeInfo.relativeLocation = new mw.Vector(nodeInfo.relativeLocation.x, nodeInfo.relativeLocation.y, nodeInfo.relativeLocation.z)
                    retNodeInfo.relativeRotation = new mw.Rotation(nodeInfo.relativeRotation.x, nodeInfo.relativeRotation.y, nodeInfo.relativeRotation.z)
                    retNodeInfo.relativeScale = new mw.Vector(nodeInfo.relativeScale.x, nodeInfo.relativeScale.y, nodeInfo.relativeScale.z)
                    break
                }
            }
            index--
        }
        return retNodeInfo
    }

    //下一关键帧
    private getNextKeyFrameData(index: number, node: Node) {
        if (index < 0) {
            return
        }
        let retNodeInfo: NodeInfo;
        while (++index < this._realFrameCount) {
            if (this._realKeyFrameData.has(index)) {
                const keyFrame = this._realKeyFrameData.get(index)
                if (keyFrame.nodeData.has(node.path)) {
                    let nodeInfo = keyFrame.nodeData.get(node.path)
                    retNodeInfo = new NodeInfo()
                    retNodeInfo.index = nodeInfo.index
                    retNodeInfo.visible = nodeInfo.visible
                    retNodeInfo.relativeLocation = new mw.Vector(nodeInfo.relativeLocation.x, nodeInfo.relativeLocation.y, nodeInfo.relativeLocation.z)
                    retNodeInfo.relativeRotation = new mw.Rotation(nodeInfo.relativeRotation.x, nodeInfo.relativeRotation.y, nodeInfo.relativeRotation.z)
                    retNodeInfo.relativeScale = new mw.Vector(nodeInfo.relativeScale.x, nodeInfo.relativeScale.y, nodeInfo.relativeScale.z)
                    break
                }
            }
        }
        return retNodeInfo
    }

    /**
     * 获取guid前缀,目前runtime下的物件guid结构是:静态guid(32位) + 临时guid(64位)
     * @param guid 
     * @returns 
     */
    private getPrefixGuid(guid) {
        return guid.substring(0, 32)
    }

    public getAnimationData() { return this.animatonData }



    // /**
    //  * 获取对象json字符串
    //  * @param obj 序列化对象
    //  * @returns 
    //  */
    // private stringify(obj: any): string {

    //     let any = {};
    //     any[key_parseObjKey] = {};
    //     any[key_parseObjVal] = [];
    //     this.compressObj(obj, any, any[key_parseObjKey], any[key_parseObjVal]);

    //     let str = "";
    //     str = JSON.stringify(any);

    //     return str;

    // }

    /**
     * 压缩对象
     * @param targetObj 
     * @param outObj 
     * @param keysList 
     * @param valsList 
     */
    private compressObj(targetObj: any, outObj: any, keysList: any, valsList: any): any {

        Object.keys(targetObj).forEach((k, i, arr) => {

            let curObj = targetObj[k];

            let useKey = k;

            if (Array.isArray(targetObj) && i > 0) {
                useKey = "0";
            }

            if (Array.isArray(curObj)) {
                keysList[useKey] = [];
                let vals = [];
                valsList.push(vals);
                this.compressObj(curObj, keysList[useKey], keysList[useKey], vals)
            } else if (curObj instanceof Object) {
                keysList[useKey] = {};
                let vals = [];
                valsList.push(vals);
                this.compressObj(curObj, keysList[useKey], keysList[useKey], vals)
            } else {

                let typeStr = typeof curObj;

                if (typeStr === "string") {
                    keysList[k] = "";
                } else if (typeStr === "number") {
                    keysList[k] = 0;
                } else if (typeStr === "boolean") {
                    keysList[k] = false;
                } else {
                    keysList[k] = null;
                }

                valsList.push(curObj);

            }

        });

    }

    /**
     * 解压缩对象
     * @param objClass 
     * @param objdata 
     * @param outObj 
     */
    private decompressObj(objClass, objdata, outObj) {

        // 获取keys
        let classkeys = Object.keys(objClass);
        let dataKeys = Object.keys(objdata);

        let objdataType = typeof objdata;

        // 遍历 objClass 的结构
        for (let i = 0; i < classkeys.length; i++) {

            // 获取class key
            let key = classkeys[i];
            // 获取 field
            let field = objClass[key];

            // 获取 data
            let data = objdata[dataKeys[i]];

            // 如果 objdata 是基础类型，则直接 赋值 否则 则赋值结构数据
            if (objdataType == "string" || objdataType == "number" || objdataType == "boolean") {
                data = objdata;
            }

            // 返回实例是否有当前字段
            let has = true;

            // 获取结构字段 类型
            let typeClazzStr = typeof field;

            // 返回实例 是否有字段
            if (!outObj[key]) {
                has = false;
            }

            // 当前字段是否为数组
            if (Array.isArray(field)) {

                // 返回实例没有当前字段，则初始为数组
                if (!has) {
                    outObj[key] = [];
                }

                // 遍历数据
                data.forEach((e, i2, arrs) => {

                    // 设置返回实例的结构
                    outObj[key].push({});

                    // 递归解析字段对象
                    this.decompressObj(field[0], data[i2], outObj[key][i2]);

                })

                continue

            } else if (typeClazzStr === "string") {
                outObj[key] = data;
                continue;
            } else if (typeClazzStr === "number") {
                outObj[key] = data;
                continue;
            } else if (typeClazzStr === "boolean") {
                outObj[key] = data;
                continue;
            }

            // 当前 field 是 object 类型

            outObj[key] = {};

            // 当前数据是数组
            if (Array.isArray(data)) {
                // 递归解析当前字段
                this.decompressObj(field, data, outObj[key]);
                continue;
            }

            // 递归解析
            this.decompressObj(field, data[i], outObj[key]);

        }

    }

    /**
     * 解析对象
     * @param jsonString JSON字符串
     * @param outInstance 输出对象实例
     * @returns 解析后的对象
     */
    public parse<T>(jsonString: string): T {
        let outInstance = {}
        // 解析JSON字符串
        let obj = JSON.parse(jsonString);

        // 检查obj中是否存在key_parseObjVal和key_parseObjKey属性
        if (obj[key_parseObjVal] && obj[key_parseObjKey]) {

            // 如果存在，调用decompressObj函数
            this.decompressObj(obj[key_parseObjKey], obj[key_parseObjVal], outInstance);

        } else {
            outInstance = obj;
        }

        // 返回解析后的对象
        return outInstance as T;
    }
}

