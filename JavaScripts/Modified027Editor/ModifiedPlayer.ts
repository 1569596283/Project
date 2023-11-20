
export class PlayerManagerExtesion {

    public static init(): void {
        ModuleService.registerModule(RpcExtesionS, RpcExtesionC, null);
    }

    public static isNpc(obj: any): obj is Character {
        if ((obj instanceof Character) && obj.player == null) {
            return true;
        }
        return false;
    }

    public static isCharacter(obj: any): obj is Character {
        if ((obj instanceof Character) && obj.player != null) {
            return true;
        }
        return false;
    }

    private static isUseRpc(isSync: boolean): boolean {
        if (SystemUtil.isServer()) {
            return false;
        } else {
            return isSync;
        }
    }

    public static stopStanceExtesion(char: mw.Character, sync?: boolean): void {
        sync = sync === undefined ? true : sync;
        if (!this.isUseRpc(sync)) {
            char.currentSubStance?.stop();
            return;
        }
        let mtStance = new RpcStance("", char);
        let module = ModuleService.getModule(RpcExtesionC);
        module.stopStanceSync(char.gameObjectId, mtStance);
    }

    public static changeBaseStanceExtesion(char: mw.Character, assetId: string): void {
        if (!this.isUseRpc(true)) {
            if (assetId == "") {
                char.currentStance?.stop();
                return;
            }
            let basicStance = char.loadStance(assetId);
            basicStance.play();
        } else {
            let module = ModuleService.getModule(RpcExtesionC);
            module.playBasicStance(char.gameObjectId, assetId);
        }
    }

    public static changeStanceExtesion(char: mw.Character, assetId: string): void {
        let sync = true;
        if (!this.isUseRpc(sync)) {
            if (assetId == "") {
                char.currentSubStance?.stop();
                return;
            }
            char.loadSubStance(assetId).play();
            return;
        }
        let mtStance = new RpcStance(assetId, char);
        let module = ModuleService.getModule(RpcExtesionC);
        module.playStanceSync(char.gameObjectId, mtStance);
    }

    public static loadStanceExtesion(char: mw.Character, assetId: string, sync?: boolean): mw.SubStance {
        sync = sync === undefined ? true : sync;
        if (!this.isUseRpc(sync)) {
            return char.loadSubStance(assetId);
        }
        sync = sync == undefined ? true : sync;
        const stance = new RpcStance(assetId, char);
        return stance;
    }

    public static rpcPlayAnimation(owner: mw.Character, assetId: string, loop: number = 1, speed: number = 1): mw.Animation {
        let ani = this.loadAnimationExtesion(owner, assetId) as RpcAnimation;
        ani.loop = loop;
        ani.speed = speed;
        ani.play();
        return ani;
    }

    public static rpcStopAnimation(owner: mw.Character, assetId: string): void {
        if (!this.isUseRpc(true)) {
            if (owner.currentAnimation && owner.currentAnimation.assetId == assetId) owner.currentAnimation.stop();
            return;
        }
        if (owner.currentAnimation && owner.currentAnimation.assetId == assetId) owner.currentAnimation.stop();
        let module = ModuleService.getModule(RpcExtesionC);
        module.stopAnimationSync(owner.gameObjectId, assetId);
    }

    public static rpcPlayAnimationLocally(owner: mw.Character, assetId: string, AnimationLength: number = 0, loopCount: number = 1) {
        if (owner === undefined || owner === null) return;
        let anim = owner.loadAnimation(assetId);
        anim.loop = loopCount;
        anim.speed = AnimationLength === 0 ? 1 : this.getRate(anim.length / AnimationLength);
        anim.play();
        return anim;
    }

    private static getRate(num: number): number {
        return Math.round(num * 100) / 100;
    }

    public static loadAnimationExtesion(char: mw.Character, assetid: string, sync?: boolean) {
        sync = sync === undefined ? true : sync;
        if (!this.isUseRpc(sync)) {
            return char.loadAnimation(assetid);
        }
        const anim = new RpcAnimation(char, assetid);
        return anim;
    }

}

class RpcExtesionC extends ModuleC<RpcExtesionS, null>{

    private syncAnimation: RpcAnimation = null;

    public net_playerJoin(playerId: number): void {
        if (this.localPlayerId == playerId) return;
        let char = this.localPlayer.character;
        let curAnimation = char.currentAnimation;
        if (!curAnimation) return;
        let ani = this.syncAnimation;
        if (ani && curAnimation.assetId == ani.assetId && ani.isPlaying) {
            this.server.net_playAnimationSync(char.gameObjectId, ani.assetId, ani.speed, ani.loop, ani.slot, playerId);
        }
    }

    public playAnimationSync(charGuid: string, myAnimation: RpcAnimation) {
        if (charGuid == this.localPlayer.character.gameObjectId) {
            this.syncAnimation = myAnimation;
        }
        this.server.net_playAnimationSync(charGuid, myAnimation.assetId, myAnimation.speed, myAnimation.loop, myAnimation.slot);
    }

    public pauseAnimationSync(charGuid: string, myAnimation: RpcAnimation) {
        this.server.net_pauseAnimationSync(charGuid, myAnimation.assetId);
    }

    public resumeAnimationSync(charGuid: string, myAnimation: RpcAnimation) {
        this.server.net_resumeAnimationSync(charGuid, myAnimation.assetId);
    }

    public stopAnimationSync(charGuid: string, myAnimation: RpcAnimation | string) {
        if (charGuid == this.localPlayer.character.gameObjectId) {
            this.syncAnimation = null;
        }
        let assetId = typeof myAnimation == "string" ? myAnimation : myAnimation.assetId;
        this.server.net_stopAnimationSync(charGuid, assetId);
    }

    public playBasicStance(charGuid: string, basicStance: string) {
        this.server.net_playBasicStance(charGuid, basicStance);
    }

    public playStanceSync(charGuid: string, myStance: RpcStance) {
        this.server.net_playStanceSync(charGuid, myStance.assetId, myStance.blendMode);
    }

    public stopStanceSync(charGuid: string, stance: RpcStance) {
        this.server.net_stopStanceSync(charGuid, stance.assetId);
    }

    public net_playAnimation(charGuid: string, assetId: string, rate: number, loop: number, slot: mw.AnimSlot) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.playAnimation(charGuid, assetId, rate, loop, slot);
    }

    public net_pauseAnimation(charGuid: string, assetId: string) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.pauseAnimation(charGuid, assetId);
    }

    public net_resumeAnimation(charGuid: string, assetId: string) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.resumeAnimation(charGuid, assetId);
    }

    public net_stopAnimation(charGuid: string, assetId: string) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.stopAnimation(charGuid, assetId);
    }

}

class RpcExtesionS extends ModuleS<RpcExtesionC, null>{

    public async net_playBasicStance(charGuid: string, basicStance: string) {
        let char = await GameObject.asyncFindGameObjectById(charGuid) as mw.Character;
        char.loadStance(basicStance).play();
    }

    public net_playAnimationSync(charGuid: string, assetId: string, rate: number, loop: number, slot: mw.AnimSlot, playerId: number = 0) {
        if (playerId != 0) {
            this.getClient(playerId).net_playAnimation(charGuid, assetId, rate, loop, slot);
            return;
        }
        this.getAllClient().net_playAnimation(charGuid, assetId, rate, loop, slot);
    }

    public net_pauseAnimationSync(charGuid: string, assetId: string) {
        this.getAllClient().net_pauseAnimation(charGuid, assetId);
    }

    public net_resumeAnimationSync(charGuid: string, assetId: string) {
        this.getAllClient().net_resumeAnimation(charGuid, assetId);
    }

    public net_stopAnimationSync(charGuid: string, assetId: string) {
        this.getAllClient().net_stopAnimation(charGuid, assetId);
    }

    public playStanceSync(charGuid: string, mystance: RpcStance) {
        RpcStance.playStance(charGuid, mystance.assetId, mystance.blendMode)
    }

    public net_stopStanceSync(charGuid: string, assetId: string) {
        RpcStance.stopStance(charGuid, assetId);
    }

    public stopStanceSync(charGuid: string, stance: RpcStance) {
        RpcStance.stopStance(charGuid, stance.assetId);
    }

    public net_playStanceSync(charGuid: string, assetid: string, blendMode: mw.StanceBlendMode) {
        RpcStance.playStance(charGuid, assetid, blendMode);
    }

    protected onPlayerEnterGame(player: mw.Player): void {
        this.getAllClient().net_playerJoin(player.playerId);
    }

}

class RpcAnimation {

    private ani: mw.Animation = null;
    public assetId: string = null;
    private owner: Character = null;
    private _loop: number = 1;
    private _speed: number = 1;
    private _slot: mw.AnimSlot = mw.AnimSlot.Default;

    constructor(char: Character, assetId: string) {
        this.owner = char;
        this.assetId = assetId;
        this.ani = char.loadAnimation(assetId);
    }

    public get loop(): number {
        return this._loop;
    }

    public set loop(value: number) {
        this._loop = value;
        this.ani.loop = value;
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        this._speed = value;
        this.ani.speed = value;
    }

    public get slot(): mw.AnimSlot {
        return this._slot;
    }

    public set slot(value: mw.AnimSlot) {
        this._slot = value;
        this.ani.slot = value;
    }

    get length(): number {
        return this.ani.length;
    }

    get isPlaying(): boolean {
        return this.ani.isPlaying;
    }

    get onFinish(): mw.MulticastDelegate<() => void> {
        return this.ani.onFinish;
    }

    public play(): boolean {
        this.ani?.play();
        let module = ModuleService.getModule(RpcExtesionC);
        module.playAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public pause(): boolean {
        this.ani?.pause();
        let module = ModuleService.getModule(RpcExtesionC);
        module.pauseAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public resume(): boolean {
        this.ani?.resume();
        let module = ModuleService.getModule(RpcExtesionC);
        module.resumeAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public stop(): boolean {
        this.ani?.stop();
        let module = ModuleService.getModule(RpcExtesionC);
        module.stopAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public static playAnimation(guid: string, assetid: string, speed: number, loop: number, slot: mw.AnimSlot): mw.Animation {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.loadAnimation(assetid);
        anim.loop = loop;
        anim.speed = speed;
        anim.slot = slot;
        anim.play();
        return anim;
    }

    public static pauseAnimation(guid: string, assetId: string): void {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.currentAnimation;
        if (!anim) return;
        anim.pause();
    }

    public static resumeAnimation(guid: string, assetId: string): void {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.currentAnimation;
        if (!anim) return;
        anim.resume();
    }

    public static stopAnimation(guid: string, assetId: string): void {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.currentAnimation;
        if (!anim) return;
        anim.stop();
    }

}

class RpcStance {

    public assetId: string = null;
    public owner: Character = null;
    public blendMode: mw.StanceBlendMode = null;

    constructor(assetId: string, owner: Character) {
        this.assetId = assetId;
        this.owner = owner;
    }

    public play(): boolean {
        let module = SystemUtil.isServer() ? ModuleService.getModule(RpcExtesionS) : ModuleService.getModule(RpcExtesionC);
        module.playStanceSync(this.owner.gameObjectId, this);
        return true;
    }

    public stop(): boolean {
        let module = SystemUtil.isServer() ? ModuleService.getModule(RpcExtesionS) : ModuleService.getModule(RpcExtesionC);
        module.stopStanceSync(this.owner.gameObjectId, this);
        return true;
    }

    public static playStance(charGuid: string, assetId: string, blendMode: mw.StanceBlendMode) {
        let char = GameObject.findGameObjectById(charGuid) as mw.Character;
        if (!char) return;
        if (assetId == "") {
            char.currentSubStance?.stop();
            return;
        }
        let stance = char.loadSubStance(assetId);
        if (blendMode != null) stance.blendMode = blendMode;
        stance.play();
    }

    public static stopStance(charGuid: string, assetId: string) {
        let char = GameObject.findGameObjectById(charGuid) as mw.Character;
        if (!char) return;
        let currentStance = char.currentSubStance;
        if (currentStance && (currentStance.assetId == assetId || assetId == "")) {
            currentStance.stop();
        }
    }

}

PlayerManagerExtesion.init();
