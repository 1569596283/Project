import { Singleton } from "./Singleton"

export namespace emitter {
    let _events = new Map<any, Map<string, mw.EventListener>>()

    /**派发本地事件 */
    export function emit(eventName: string, ...data: any[]): void {
        Event.dispatchToLocal(eventName, data)
    }

    /**
     * 添加本地事件
     * @param eventName 
     * @param fn: 支持最多接受10个参数
     * @param target 
     */
    export function on(eventName: string, fn: (...args) => void, target: any): void {
        let listener = Event.addLocalListener(eventName, (data: any[]) => {
            fn(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9])
        })

        let eventItem = _events.get(target)
        if (eventItem) {
            eventItem.set(eventName, listener)
        } else {
            let eventItem = new Map<string, mw.EventListener>()
            _events.set(target, eventItem)

            eventItem.set(eventName, listener)
        }
    }

    /**
     * 移除本地事件
     * @param target 
     */
    export function remove(target: any): void {
        let has = _events.has(target)
        if (has) {
            _events.get(target).forEach(listener => {
                listener.disconnect()
            });
            _events.delete(target)
        }
    }
}