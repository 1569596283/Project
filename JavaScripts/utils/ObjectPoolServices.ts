/*
 * @Author: your name
 * @Date: 2021-12-06 13:38:36
 * @LastEditTime: 2021-12-20 13:49:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \JavaScripts\ObjectPoolServices.ts
 */
export namespace ObjectPoolServices {

    interface IPool {
        getSize(): number;
        Clear(): void;
        Spawn(): any;
        Return(instance: any): void;
    }

    export class ObjectPool<T> implements IPool {

        private spawnFun: () => T;

        private pool: Array<T>;

        public constructor(spawn: () => T, initNum: number = 3) {
            this.spawnFun = spawn;
            this.pool = new Array<T>(initNum);
            for (let index = 0; index < initNum; index++) {
                this.pool[index] = this.spawnFun();
            }
        }

        public Spawn(): T {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            return this.spawnFun();
        }

        public Return(instance: T): void {
            if (instance == null) {
                return;
            }
            this.pool.push(instance);
        }

        public getSize(): number {
            return this.pool.length;
        }

        public ForEach(fn: (param: T) => void) {
            this.pool.forEach((obj) => {
                fn(obj)
            })
        }

        public GetPoolEntry(): Array<T> {
            return this.pool;
        }

        public Clear(): void {
            this.pool.length = 0;
        }
    }

    const poolMap: Map<string, IPool> = new Map<string, IPool>();

    type Class<T> = { new(...arg): T }

    export function GetPool<T>(cls: Class<T>, autoCreat: boolean = true): ObjectPool<T> {
        let pool = poolMap.get(cls.name);
        if (pool === undefined && autoCreat) {
            InitPool(cls, () => new cls())
        }
        return poolMap.get(cls.name) as ObjectPool<T>;
    }

    export function InitPool<T>(cls: Class<T>, spawn: () => T, initNum: number = 3): ObjectPool<T> {
        let pool = poolMap.get(cls.name);
        if (pool === undefined) {
            pool = new ObjectPool<T>(spawn, initNum);
            poolMap.set(cls.name, pool);
        }
        return pool as ObjectPool<T>;
    }

    export function DestroyPool<T>(cls: Class<T>): void {
        let pool = poolMap.get(cls.name);
        if (pool !== undefined) {
            pool.Clear();
        }
        poolMap.delete(cls.name);
    }

    export function Clear() {
        for (const [key, pool] of poolMap) {
            pool.Clear();
        }
        poolMap.clear();
    }
}