export class Singleton {

    public static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this)._ins) {
            (<any>this)._ins = new this();
        }
        return (<any>this)._ins
    }
}