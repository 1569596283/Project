import { Singleton } from "./Singleton";

/**
 * 缓存器
 */
export class ObjectCache {
    public _cache: Map<string, any[]> = new Map<string, any[]>()
    private _limit: number = 10
    /**
     * 存入
     * @param key 
     * @param obj 
     * @returns 
     */
    put(key: string, obj: any): boolean {
        let group = this.getGroup(key)
        if (!group) {
            group = []
            this._cache.set(key, group)
        }
        group.push(obj)

        return true
    }

    getGroup(key: string): any[] {
        let ret = null
        if (this._cache.has(key)) {
            ret = this._cache.get(key)
        }
        return ret
    }

    deleteGroup(key: string) {
        if (this._cache.has(key)) {
            this._cache.delete(key);
        }
    }

    getCount() {
        let length = 0
        this._cache.forEach((obj) => {
            length += obj.length
        })
        return length
    }

    /**
     * 取出
     * @param key 
     * @returns 
     */
    get(key: string): any {
        let ret = null
        let group = this.getGroup(key)
        if (group && group.length > 0) {
            ret = group.shift()
        }
        return ret
    }

    setLimit(limit: number) {
        this._limit = limit
    }

    foreach(fn: (_1: string, _2: any[]) => void) {
        this._cache.forEach((arr, key) => {
            fn(key, arr)
        })
    }
}