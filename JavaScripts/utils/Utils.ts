import { SpawnManager } from '../Modified027Editor/ModifiedSpawn';
import { Scheduler } from "./Scheduler";
import { GameConfig } from '../config/GameConfig';

declare global {
    var UE: any;
}

class Utils {

    static createEffect(pos: mw.Vector, scale: mw.Vector, asset: string, isLoop: boolean) {

        let eff = SpawnManager.spawn({ guid: asset.toString() }) as mw.Effect
        eff.worldTransform.position = pos
        eff.worldTransform.scale = scale
        eff.loop = (isLoop)
        eff.play()
        eff.parent = null
        // console.log("createEffect", asset, eff)
        if (!eff)
            return false
        return true
    }

    // static GetResource(id: number): DBConfig_Resources {
    //     return DataServices.GetConfig(DBConfig_Resources, id);
    // }
    // static getPosition(id: number): DBScenePoint {
    //     return DataServices.GetConfig(DBScenePoint, id);
    // }
    // static GetGlobalText(id: number) {
    //     return DataServices.GetConfig(DBText, id).Text;
    // }
    static FormatString(text: string, ...args: any[]) {
        return text.replace(/\{(\d+)\}/g, (text, index, ...parms) => {
            if (args[index] === 0) return 0;
            return args[index] || "undefined";
        });
    }
    // static FormatGlobalString(id: number, ...args: any[]) {
    //     let text = Utils.GetGlobalText(id);
    //     return text.replace(/\{(\d+)\}/g, (text, index, ...parms) => {
    //         if (args[index] === 0) return 0;
    //         return args[index] || "undefined";
    //     });
    // }
    static Seconds2Hour(second: number) {
        let minutes = second % 3600;
        let h = Math.floor(second / 3600);
        let m = Math.floor(minutes / 60);
        let s = minutes % 60;
        return [h < 10 ? ("0" + h) : h, m < 10 ? ("0" + m) : m, s < 10 ? ("0" + s) : s];
    }
    static Seconds2HourToString(second: number) {
        let time = this.Seconds2Hour(second);
        return `${time[0]}:${time[1]}:${time[2]}`;
    }
    static RandomItemRange(...ranges: number[]): number {
        let sum = ranges.reduce((pr, current) => {
            return pr + current;
        }, 0);
        let ran = Utils.RangeInt(0, sum);
        for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] > ran) {
                return i;
            }
            ran -= ranges[i];
        }
        return ranges.length - 1;
    }
    public static RandomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static GetRandomNumFloor(Min, Max): number {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.floor(Rand * Range));
    }

    public static GetRandomPlusOrMinus(MinPlus, MaxPlus): number {
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        return Utils.RangeFloat(MinPlus, MaxPlus) * plusOrMinus;
    }

    public static spawn(guid: string, bInReplicates: boolean = false) {
        return SpawnManager.spawn({ guid: guid, replicates: bInReplicates });
    }
    public static ArrayToPoint(list: number[]): mw.Vector {
        return new mw.Vector(list[0], list[1], list[2]);
    }

    public static RoundNumber(value: number, min: number, max: number) {
        if (value > max) return min;
        if (value < min) return max;
        return value;
    }
    public static SubVecNum(v1: mw.Vector, v2: mw.Vector): mw.Vector {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        let z = v1.z - v2.z;
        return new mw.Vector(x, y, z);
    }
    public static AddVecNum(v1: mw.Vector, v2: mw.Vector): mw.Vector {
        let x = v1.x + v2.x;
        let y = v1.y + v2.y;
        let z = v1.z + v2.z;
        return new mw.Vector(x, y, z);
    }

    /**向量的差值计算 */
    public static LerpVector(from: mw.Vector, to: mw.Vector, d: number): mw.Vector {
        let out = new mw.Vector(0, 0, 0);
        let x1 = from.x;
        let y1 = from.y;
        let z1 = from.z;

        let x2 = to.x;
        let y2 = to.y;
        let z2 = to.z;

        let distance = 1;
        out.x = x1 + ((x2 - x1) / distance) * d;
        out.y = y1 + ((y2 - y1) / distance) * d;
        out.z = z1 + ((z2 - z1) / distance) * d;
        return out;
    }

    /**
    * 计算两点距离
    * @param from 初始坐标
    * @param to 目标坐标
    * @param isPlane 是否只计算平面距离
    * @returns 距离
    */
    public static Distance(from: mw.Vector, to: mw.Vector, isPlane: boolean = false): number {
        let x1 = from.x;
        let y1 = from.y;
        let z1 = from.z;
        let x2 = to.x;
        let y2 = to.y;
        let z2 = to.z;
        let distance: number;
        let num = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (!isPlane) {
            num += (z1 - z2) * (z1 - z2);
        }
        if (num > 0) {
            distance = Math.sqrt(num);
        } else {
            distance = 0.1;
        }
        return distance;
    }

    /**
    * 计算两点距离
    * @param from 初始坐标
    * @param to 目标坐标
    * @returns 距离的平方
    */
    public static DistancePow(from: mw.Vector, to: mw.Vector, isPlane: boolean = false): number {
        let x1 = from.x;
        let y1 = from.y;
        let z1 = from.z;
        let x2 = to.x;
        let y2 = to.y;
        let z2 = to.z;
        let distance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (!isPlane) {
            distance += (z1 - z2) * (z1 - z2);
        }
        if (distance <= 0) {
            distance = 1;
        }
        return distance;
    }

    /**平面点的曼哈顿距离 */
    public static ManhattanDistance(from: mw.Vector, to: mw.Vector) {
        return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    }

    public static TransformDistance(from: mw.Transform, to: mw.Transform): number {
        return this.Distance(from.position, to.position);
    }

    public static PlayerOrId2Id(playerOrId: mw.Player | number): number | undefined {
        if (typeof (playerOrId) === "number") {
            return playerOrId;
        }
        if (playerOrId instanceof mw.Player) {
            return playerOrId.playerId;
        }
    }

    // public static PlayerOrId2Player(playerOrId: mw.Player | number): mw.Player | undefined {
    //     if (typeof (playerOrId) === "number") {
    //         return mw.PlayerMgr.Get(playerOrId);
    //     }
    //     if (playerOrId instanceof mw.Player) {
    //         return playerOrId;
    //     }
    // }

    /**随机 [min,max) 区间内的浮点数字 */
    public static RangeFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    /**随机 [min,max) 区间内的整数 */
    public static RangeInt(min: number, max: number): number {
        return Math.floor(Utils.RangeFloat(min, max));
    }

    public static CombinationString(from: string, insert: string[]): string {
        for (let i of insert) {
            from = from.replace(/@/, i);
        }
        return from;
    }

    public static Camp(min: number, max: number, value: number) {
        if (min > max) return Utils.Camp(max, min, value);
        return Math.min(max, Math.max(min, value));
    }
    public static ListToVector(list: number[], defNum: number = 1): mw.Vector {
        return new mw.Vector(list[0] || defNum, list[1] || defNum, list[2] || defNum);
    }
    public static GetRandomUnRepeat(min: number, max: number, count: number): number[] {
        if (count > max - min) {
            count = max - min;
        }
        let outlist: number[] = [];
        let num = 0;
        while (num < count) {
            let value = Math.floor(Math.random() * (max - min)) + min;
            if (outlist.indexOf(value) == -1) {
                outlist.push(value);
                num++;
            }
        }

        return outlist;
    }
    public static CloneArray<T>(arr: IterableIterator<T> | T[]): T[] {
        let res = [];
        for (let i of arr)
            res.push(i);
        return res;
    }

    //旋转刚开始的子弹方向
    public static bullet_RotateVector(from: mw.Vector, axis: mw.Vector, angle: number): mw.Vector {
        let rot = new UE.Quat(new Vector(axis.x, axis.y, axis.z), angle * Math.PI / 180);
        let fromV3 = new Vector(from.x, from.y, from.z);
        let newV3 = rot.op_Multiply(fromV3);

        return new mw.Vector(newV3.X, newV3.Y, newV3.Z);
    }

    // public static Clone(source: mw.GameObject, parent?: mw.GameObject): mw.GameObject {
    //     const actor = UE.MetaWorldStatics.CloneActor(source.getGuid()) as any;
    //     actor.bAlwaysRelevant = true;
    //     actor.K2_GetRootComponent().SetMobility(UE.EComponentMobility.Movable);
    //     parent && actor.SetParent(parent.Actor, false);

    //     const dest = GameObject.findGameObjectById(actor.getGuid());
    //     for (const child of source.getChildren()) {
    //         Utils.Clone(child, dest);
    //     }

    //     dest.SetTransform(source.GetTransform());
    //     dest.setName(source.name);
    //     dest.setVisibility(source.GetIsVisible() ? mw.PropertyStatus.On : mw.PropertyStatus.Off);

    //     if (dest instanceof mw.SkillObj && source instanceof mw.SkillObj) {
    //         dest.skillName = source.SkillName;
    //         dest.addSkill(parent);

    //         console.log(`--- 设置技能参数`);
    //         (dest.Actor as UE.MWSysSkillObject).SkillDataBase = (source.Actor as UE.MWSysSkillObject).SkillDataBase;
    //     }

    //     return dest;
    // }
    /**
     * 提取一个对象所有成员转化为字符串，用于打印显示
     * @param object 被提取的对象
     * @param showFunc 是否显示函数成员
     * @param deep 递归深度，最多5层
     */
    public static DumpObject(object: any, showFunc: boolean = false, deep: number = 5) {
        if (object == null || object == undefined) {
            if (typeof (object) == "object") {
                return "null";
            }
            return String(object);
        }
        if (typeof (object) != "object") {
            return String(object);
        }
        deep = Math.min(5, deep);//最多递归5层
        let spaceLength = Math.abs(deep - 5) * 2;//空格数量
        let space = "";
        for (let i = 0; i < spaceLength; i++) {
            space += " ";
        }
        let result = "\n" + space + "{";
        if (object instanceof Map)//本身是Map对象
        {
            result += "\n" + space;
            if (deep <= 0) {
                result += `(Map):${object}`;
            }
            else {
                result += "(Map):";
                for (let key of object.keys()) {
                    result += "\n" + space + ` [${key}]:${Utils.DumpObject(object.get(key), showFunc, deep - 1)}`;
                }
            }
        }
        else {
            for (let k in object) {

                if (object[k] instanceof Map)//是一个map对象
                {
                    result += "\n" + space;
                    //递归深度到底
                    if (deep <= 0) {
                        result += `${k}(Map):${object[k]}`;
                    }
                    else {
                        result += k + "(Map):";
                        // result += "\n{";
                        for (let key of object[k].keys()) {
                            result += "\n" + space + ` [${key}]:${Utils.DumpObject(object[k].get(key), showFunc, deep - 1)}`;
                        }
                        // result += "\n}"
                    }
                }
                //是一个对象成员，再次递归
                else if (typeof (object[k]) == "object") {
                    result += "\n" + space;
                    //递归深度到底
                    if (deep <= 0) {
                        result += `${k}:${object[k]}`;
                    }
                    else {
                        result += `${k}:${Utils.DumpObject(object[k], showFunc, deep - 1)}`;
                    }
                }
                else if (typeof (object[k]) == "function") {
                    if (showFunc) {
                        result += "\n" + space;
                        result += `${k}:function`;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    result += "\n" + space;
                    result += `${k}:${object[k]}`;
                }
                // result += "\n" + space;
            }
        }

        result += "\n" + space + "}";
        return result;
    }
    public static findChildByPath<T extends mw.Widget>(ObjClass: { new(): T, Get(p: mw.Widget): T; }, uiPrefab: mw.UserWidgetPrefab, path: string): T {
        let child = uiPrefab.findChildByPath(path);
        if (child == null) {
            console.error('SuperPanelBase: Child not found in panel!  path=' + path);
            return null;
        }
        let widget: unknown = ObjClass.Get(child);
        if (ObjClass.name == mw.Button.name) {
            (widget as mw.Button).focusable = (false);//设置了这个 按钮就不会按下后自动抛出抬起事件了
        }
        return widget as T;
    }

    static V3Dot(lhs: mw.Vector, rhs: mw.Vector): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    }
    static V2Dot(lhs: mw.Vector2, rhs: mw.Vector2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }

    static V3CosAngle(lhs: mw.Vector, rhs: mw.Vector): number {
        let dotValue = Utils.V3Dot(lhs, rhs)
        return dotValue / (lhs.length * rhs.length)
    }

    static V3Cross(v1: mw.Vector, v2: mw.Vector) {
        let x = v1.y * v2.z - v1.z * v2.y
        let y = v2.x * v1.z - v1.x * v2.z
        let z = v1.x * v2.y - v1.y * v2.x
        return new mw.Vector(x, y, z)
    }

    /**
     * 根据不同概率取值
     * @param arr 对象列表,rate:概率
     * @returns 随机结果
     */
    public static RandomObjByRate<T>(arr: { obj: any, rate: number; }[]) {
        let totalRate = 0;
        arr.forEach(element => {
            totalRate += element.rate;
        });

        let randomValue = Math.floor(Math.random() * totalRate);

        let left = 0, right = 0, index = -1;
        for (let i = 0; i < arr.length; ++i) {
            left = right;
            right = left + arr[i].rate;

            if (left <= randomValue && randomValue < right) {
                index = i;
                break;
            }
        }
        // console.log("根据不同概率取值", index, randomValue);
        return arr[index].obj as T;
    }

    /**
     * 旋转一个二维向量
     * @param vec2 向量
     * @param angle 角度
     * @returns 旋转后的向量
     */
    public static RotationVecter2(vec2: mw.Vector2, angle: number) {
        let rad = angle / 180 * Math.PI;
        let x = vec2.x * Math.cos(rad) - vec2.y * Math.sin(rad);
        let y = vec2.x * Math.sin(rad) + vec2.y * Math.cos(rad);
        return new mw.Vector2(x, y);
    }

    /**
     * 判断玩家是否站在某个点上
     * @param player 玩家
     * @param point 坐标
     * @param offset 坐标范围
     * @returns 判断结果
     */
    public static checkPointNearPoint(playerPoint: mw.Vector, point: mw.Vector, radius: number): boolean {
        return Math.floor(Utils.Distance(playerPoint, point)) <= Math.floor(radius);
    }

    /**
     * 对两个数值做一个的插值，每帧和结束都可以提供回调,返回Timer句柄
     * @param start 起始值
     * @param end 
     * @param time  时间 s
     * @param tickCallBack 
     * @param onComplete 
     * @param easingFunction 插值函数
     */
    public static DoLerpForValue(start: number, end: number, time: number, tickCallBack: (value: number) => void, onComplete: () => void = null, easingFunction: TweenEasingFunction = mw.TweenUtil.Easing.Linear.None): number {
        let dist = end - start;
        let curTime = 0;
        let scale = 0;;
        let nowValue = start;
        time = time == 0 ? 1 : time;
        let tickTimer = Scheduler.TickStart((dt) => {
            curTime += dt;
            let over = false;
            scale = curTime / time;
            if (scale >= 1) {
                scale = 1;
                over = true;
            }
            scale = easingFunction(scale);
            nowValue = start + scale * dist;
            tickCallBack(nowValue);
            if (over) {
                Scheduler.Cancel(tickTimer);
                onComplete && onComplete();
            }
        }, 1, -1);
        return tickTimer;
    }

    /**根据条件，移除数组内所有符合条件的元素，其余元素依次补全索引位 */
    public static ArrayRemoveBy<T>(array: Array<T>, callbackfn: (arg: T) => boolean): void {
        for (let i = array.length - 1; i >= 0; i--) {
            if (callbackfn(array[i])) {
                array.splice(i, 1);
            }
        }
    }

    /**数组去重，以及特定元素，返回新数组 */
    public static ArrayUnLink<T>(array: Array<T>, ...args: T[]) {
        let result: Array<T> = []
        for (let i = 0; i < array.length; i++) {
            if (!result.includes(array[i]) && !args.includes(array[i])) {
                result.push(array[i]);
            }
        }
    }

    public static async sleep(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


    /**
     * 获取物体的所有子级(包含子级的子级，不包含自身)
     * @param parent 父节点
     * @param deep 查找深度
     * @param property 特定查找成员名，没有则返回游戏物体本身
     * @returns 
     */
    public static getAllChild(parent: mw.GameObject, deep: number = 5, property: string = null): any[] {
        if (parent.getChildren().length <= 0 || deep <= 0) {
            return null;
        }
        else {
            let result: any[] = []
            for (let c of parent.getChildren()) {
                if (property) {
                    result.push(c[property as keyof typeof c]);
                }
                else {
                    result.push(c);
                }
                // result.push(c);//加上本身
                let cc = this.getAllChild(c, deep - 1, property);//拿到此子级的子级
                if (cc != null) {
                    result = result.concat(cc);
                }
            }
            return result;
        }
    }

    /**
     * 删除表中元素
     * @param array 
     * @param value 
     */
    public static removeArrayByValue(array: any[], value) {
        for (let index = array.length - 1; index >= 0; index--) {
            const element = array[index];
            if (value === element) {
                array.splice(index, 1)
            }
        }
    }
    public static removeArrayByIndex(array: any[], index: number) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (i === index) {
                array.splice(index, 1)
            }
        }
    }

    public static getUIPostion(ui: mw.Widget) {
        let pos = new mw.Vector2(0, 0)
        pos.x = ui.position.x
        pos.y = ui.position.y
        let parent: mw.Widget = ui.parent
        while (parent) {
            pos = pos.clone().add(parent.position)
            parent = parent.parent
            if (parent.name == "RootCanvas") {
                return pos
            }
        }
        return pos
    }

    /**
     * 随机一个长度为len的数组，数组内是 0~len-1 的整数的随机排列
     * @param len 长度
     */
    public static getNumberArray(len: number) {
        let arr: number[] = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        let ret: number[] = [];
        for (let i = 0; i < len; i++) {
            let ran = Math.floor(Math.random() * arr.length);
            ret.push(ran);
            arr.splice(ran, 1);
        }
        return ret;
    }

    /**
     * 返回一个在第一个数和第二个数之间的数
     * @param num1 第一个数
     * @param num2 第二个数
     * @returns 一个整数
     */
    public static getRandomNumber(num1: number, num2: number) {
        let max = Math.max(num1, num2);
        let min = Math.min(num1, num2);
        let random = Math.random() * (max - min) + min;
        let res: number = Math.floor(Math.round(random))
        return res;
    }

    //--- 文字对话拆分工具
    public static stringToChars(str: string) {
        // --主要用了Unicode(UTF - 8)编码的原理分隔字符串
        // --简单来说就是每个字符的第一位定义了该字符占据了多少字节
        // --UTF - 8的编码：它是一种变长的编码方式
        // --对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF - 8编码和ASCII码是相同的。
        // --对于n字节的符号（n > 1），第一个字节的前n位都设为1，第n + 1位设为0，后面字节的前两位一律设为10。
        // --剩下的没有提及的二进制位，全部为这个符号的unicode码。
        let list = []
        let len = str.length
        let i = 0
        while (i < len) {
            let c = str.charCodeAt(i)
            let shift = 1
            console.log("unicode", c)
            if (c > 0 && c <= 127) {
                shift = 1
            }
            else if (c >= 192 && c <= 223) {
                shift = 2
            }
            else if (c >= 224 && c <= 239) {
                shift = 3
            }
            else if (c >= 240 && c <= 247) {
                shift = 4
            }
            let char = str.substring(i, i + shift - 1)
            i = i + shift
            list.push(char)
        }

        return list
    }


    //Widget视口坐标转本地坐标
    public static convertUIToNodeSpace(node: mw.Widget, worldPos: mw.Vector2) {
        let viewPos = mw.Vector2.zero
        let pixelPos = mw.Vector2.zero
        mw.localToViewport(node.cachedGeometry, mw.Vector2.zero, pixelPos, viewPos)
        const viewScale = mw.getViewportScale()
        return new mw.Vector2((worldPos.x - pixelPos.x) / viewScale, (worldPos.y - pixelPos.y) / viewScale)
    }

    //Widget本地坐标转视口坐标
    public static convertUIToWroldSpace(node: mw.Widget, localPos: mw.Vector2) {
        let viewPos = mw.Vector2.zero
        let pixelPos = mw.Vector2.zero
        const viewScale = mw.getViewportScale()
        mw.localToViewport(node.cachedGeometry, localPos, pixelPos, viewPos)
        return pixelPos.divide(viewScale)
    }

    static Seconds2Minute(second: number) {
        let minutes = second % 3600;
        let m = Math.floor(minutes / 60);
        let s = Math.floor(minutes % 60);
        let ms = Math.floor(second % 1 * 100);
        return [m < 10 ? ("0" + m) : m, s < 10 ? ("0" + s) : s, ms < 10 ? ("0" + ms) : ms];
    }
    static Seconds2MinuteToString(second: number) {
        let time = this.Seconds2Minute(second);
        return `${time[0]}:${time[1]}:${time[2]}`;
    }

    static GetRandomPos(center: mw.Vector, radius: number) {
        const distance = Math.floor(Math.random() * radius)
        const dir = Utils.RotationVecter2(new mw.Vector(1, 0), Math.floor(Math.random() * 360)).multiply(distance)
        return new mw.Vector(center.x + dir.x, center.y + dir.x, center.z)
    }

    public static getLanguage(id: string | number): { info: string; size: number } {
        let textEle = GameConfig.Language.getElement(id);
        if (!textEle) {
            // console.error("getLanguage 出错 id:" + id);
            return;
        }
        let lbSize = 0;
        // switch (GameUtils.systemLanguageIndex) {
        //     case 0:
        //         lbSize = textEle.EnglishSize;
        //         break;
        //     case 1:
        //         lbSize = textEle.ChinsesSize;
        //         break;
        //     case 2:
        //         lbSize = textEle.JanpanseSize;
        //         break;
        //     case 3:
        //         lbSize = textEle.GermanSize;
        //         break;
        // }
        return { info: textEle.Value, size: lbSize };
    }
}
export default Utils;
