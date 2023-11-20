/*
* @Date: 2022-04-27 17:41:04
 * @LastEditors: hym
 * @LastEditTime: 2022-05-19 14:08:17
 * @FilePath: \JavaScripts\common\Queue.ts
*/
/**隊列 */
export class Queue<T>
{
    private readonly _ary: T[] = []
    private _count: number = 0;
    get Count(): number {
        return this._count;
    }

    constructor(_defval?: T[]) {
        if (_defval != null && _defval != undefined) {
            this._ary = _defval;
            this._count = _defval.length;
        }
    }

    /**一个内容入队 */
    public push(_val: T): void {
        if (_val == null || _val == undefined) {
            return;
        }
        this._ary.unshift(_val);//数组开头添加新元素
        this._count++;
    }

    /**拿到并移除首个内容 */
    public pop(): T {
        if (this._count > 0) {
            this._count--;
            return this._ary.pop();//返回并移除数组末尾
        }
        return null;
    }

    /**清空所有内容 */
    public clear(fn?: (v: T) => void): void {
        while (this._count > 0) {
            let v = this.pop();
            if (fn != null && fn != null) {
                fn(v);
            }
        }
        this._ary.length = 0;
        this._count = 0;
    }

    /**拿到当前队列的首个内容 */
    public get first() {
        if (this._count > 0) {
            return this._ary[this._count - 1];
        }
        else {
            return null;
        }
    }

    /**根据队列顺序从头到尾依次遍历执行 */
    public foreach(act: (v: T) => void): void {
        for (let i = this._count - 1; i >= 0; i--) {
            act(this._ary[i]);
        }
    }



}
