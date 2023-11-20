/*
 * @Author: daichun chun.dai@apshahe.com
 * @Date: 2022-07-29 14:47:10
 * @LastEditors: daichun chun.dai@apshahe.com
 * @LastEditTime: 2022-08-12 15:53:31
 * @FilePath: \JavaScripts\utils\List.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by daichun chun.dai@apshahe.com, All Rights Reserved. 
 */
export class List<T>{
	private arr: Array<T> = [];

	public constructor(arr?: Array<T>) {
		if (arr) {
			this.arr = arr;
		}
	}

	public get(index: number): T {
		return this.arr[index];
	}

	public get count(): number {
		return this.arr.length;
	}

	public add(data: T) {
		if (data)
			this.arr.push(data);
	}

	public addRange(arr: Array<T>) {
		if (arr)
			this.arr = this.arr.concat(arr);
	}

	public clear() {
		while (this.arr.length > 0) {
			this.arr.pop();
		}
	}

	public remove(data: T): boolean {
		if (data) {
			let index = this.arr.indexOf(data);
			if (index >= 0)
				this.arr.splice(index, 1);
		}
		return false;
	}

	public removeAt(index: number): boolean {
		if (index < 0 || index >= this.arr.length)
			return false;
		this.arr.splice(index, 1);
	}

	public insert(index: number, item: T) {
		this.arr.splice(index, 0, item);
	}

	public sort() {
		this.arr.sort();
	}

	public reverse() {
		this.arr.reverse();
	}

	public toArray(): T[] {
		let result: Array<T> = [];
		result.concat(this.arr);
		return result;
	}

	public contains(item: T): boolean {
		if (this.arr.length <= 0)
			return
		return this.arr.indexOf(item) >= 0;
	}

	public indexOf(item: T): number {
		return this.arr.indexOf(item);
	}

	public lastIndexOf(item: T): number {
		return this.arr.lastIndexOf(item);
	}

	public toString(): string {
		let result: string = "";
		for (let item of this.arr) {
			result += item + " ";
		}
		return result;
	}
}
