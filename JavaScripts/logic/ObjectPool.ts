import { SpawnManager,SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
﻿import { Singleton } from "../utils/Singleton";

export class ObjectPool extends Singleton {

	private _map: Map<string, mw.GameObject[]> = new Map()


	private put_(key: string, obj: mw.GameObject) {
		if (!this._map.has(key)) {
			this._map.set(key, [])
		}
		obj.worldTransform.position = new mw.Vector(0, 0, -100000)
		const arr = this._map.get(key)
		if (arr.length < 1) {
			arr.push(obj)
		} else {
			obj.destroy()
		}
	}

	/**
	 * 放入
	 * @param key 
	 * @param obj 
	 */
	public put(key: string, obj: mw.GameObject) {
		this.put_(key, obj)
	}

	/**
	 * 取出
	 * @param key 
	 * @returns 
	 */
	public get(key: string, guid?: string) {
		if (!this._map.has(key)) {
			this._map.set(key, [])
		}

		const arr = this._map.get(key)
		if (arr.length == 0) {
			const obj = SpawnManager.spawn({ guid: guid })
			if (obj) {
				this.put_(key, obj)
			}
		}

		const ret = arr.pop()
		if (ret) {
			ret.worldTransform.scale = mw.Vector.one
			ret.localTransform.position = (mw.Vector.zero)
			ret.localTransform.rotation = (mw.Rotation.zero)
		}
		return ret
	}

	public getObjectCount() {
		let num1 = 0
		this._map.forEach((arr) => {
			num1 += arr.length
		})
		return num1
	}
}
