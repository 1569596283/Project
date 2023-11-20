
export class GeneralManager {

    private vscodeChange(): void {
        let animation: Animation;
        animation.speed = 1;// 先通过vscodeF2替换为 rate 再替换为 speed
        let obj: GameObject;
        obj.gameObjectId;// 先通过vscodeF2替换为 guid 再替换为 gameObjectId
        let camera: GameObject;
        camera.worldTransform;// 先通过vscodeF2替换为 transform 再替换为 worldTransform
        let model: mw.Model;
        model.onTouch;// 先通过vscodeF2替换为 onEnter 再替换为 onTouch
        model.onTouchEnd;// 先通过vscodeF2替换为 onLeave 再替换为 onTouchEnd 
        let effect: mw.Effect;
        effect.maskcolor;// 先通过vscodeF2替换为 color 再替换为 maskcolor
        effect.onFinish;// 先通过vscodeF2替换为 onFinished 再替换为 onFinish
        effect.timeLength;// 先通过vscodeF2替换为 particleLength 再替换为 timeLength
        let sound: mw.Sound;
        sound.timePosition;// 先通过vscodeF2替换为 currentProgress 再替换为 timePosition
        sound.timeLength;// 先通过vscodeF2替换为 duration 再替换为 timeLength
        sound.timeLength;// 先通过vscodeF2替换为 timelength 再替换为 timeLength
        sound.isLoop;// 先通过vscodeF2替换为 loop 再替换为 isLoop
        let transform: Transform;
        transform.position;// 先通过vscodeF2替换为 location 再替换为 position
        class module extends ModuleC<null, null>{
            protected get localPlayer(): mw.Player {// 先通过vscodeF2替换为 currentPlayer 再替换为 localPlayer
                return null;
            }
            protected get localPlayerId(): number {// 先通过vscodeF2替换为 currentPlayerId 再替换为 localPlayerId
                return null;
            }
        }

    }

    public static async asyncRpcGetData(key: string): Promise<any> {
        let value = await DataStorage.asyncGetData(key);
        return value.data;
    }

    public static async asyncRpcGetPlayer(playerId: number): Promise<mw.Player> {
        let player = Player.getPlayer(playerId);
        return Promise.resolve(player);
    }

    public static rpcPlayEffectOnPlayer(source: string, target: mw.Player | mw.Character, slotType: mw.HumanoidSlotType, loopCount?: number, offset?: mw.Vector, rotation?: mw.Rotation, scale?: mw.Vector): number {
        let duration = undefined;
        if (loopCount < 0) {
            duration = -loopCount;
            loopCount = undefined;
        }
        return EffectService.playOnGameObject(source, target instanceof mw.Player ? target.character : target, {
            slotType: slotType,
            loopCount: loopCount,
            duration: duration,
            position: offset,
            rotation: rotation,
            scale: scale
        });
    }

    public static rpcPlayEffectOnGameObject(source: string, target: mw.GameObject, loopCount?: number, offset?: mw.Vector, rotation?: mw.Rotation, scale?: mw.Vector): number {
        let duration = undefined;
        if (loopCount < 0) {
            duration = -loopCount;
            loopCount = undefined;
        }
        return EffectService.playOnGameObject(source, target, {
            loopCount: loopCount,
            duration: duration,
            position: offset,
            rotation: rotation,
            scale: scale
        });
    }

    public static rpcPlayEffectAtLocation(source: string, location: mw.Vector, loopCount?: number, rotation?: mw.Rotation, scale?: mw.Vector): number {
        let duration = undefined;
        if (loopCount < 0) {
            duration = -loopCount;
            loopCount = undefined;
        }
        return EffectService.playAtPosition(source, location, {
            loopCount: loopCount,
            duration: duration,
            rotation: rotation,
            scale: scale,
        })
    }

    public static modifyShowAd(adsType: AdsType, callback: (state: AdsState) => void): void {
        AdsService.showAd(adsType, isSuccess => {
            if (isSuccess) {
                callback(AdsState.Success);
                callback(AdsState.Close);
                callback(AdsState.Reward);
            } else {
                callback(AdsState.Fail);
            }
        });
    }

    public static modiftEnterInteractiveState(inter: mw.Interactor, characterObj: mw.GameObject): Promise<boolean> {
        if (!(characterObj instanceof mw.Character)) {
            return Promise.resolve(false);
        }
        let reult = inter.enter(characterObj);
        if (!reult) return Promise.resolve(false);
        return new Promise<boolean>((resolve, reject) => {
            let resultFun = () => {
                inter.onEnter.remove(resultFun);
                resolve(true);
            }
            inter.onEnter.add(resultFun);
        });
    }

    public static modifyExitInteractiveState(inter: mw.Interactor, Location: Vector, stance?: string): Promise<boolean> {
        let result = inter.leave(Location, null, stance);
        return Promise.resolve(result);
    }

    public static modifyaddOutlineEffect(obj: mw.GameObject, OutlineColor?: mw.LinearColor, OutlineWidth?: number, OutlineDepthOffset?: number, OutlineClampValue?: number, considerCameraPosition?: boolean, outlineSilhouetteOnly?: boolean): void {
        if (obj instanceof mw.Model) {
            obj.setOutline(true, OutlineColor, OutlineWidth);
        }
    }

    public static modifyRemoveOutlineEffect(obj: mw.GameObject) {
        if (obj instanceof mw.Model) {
            obj.setOutline(false);
        }
    }

    public static modiftboxOverlap(startLocation: Vector, endLocation: Vector, width: number, height: number, drawDebug?: boolean, objectsToIgnore?: Array<string>, ignoreObjectsByType?: boolean, self?: GameObject): Array<GameObject> {
        let halfSize = new Vector(1, width / 2, height / 2);
        let orientation = Vector.subtract(endLocation, startLocation).toRotation();
        let results = QueryUtil.boxTrace(startLocation, endLocation, halfSize, orientation, true, drawDebug, objectsToIgnore, ignoreObjectsByType, self);
        let objResults = new Array<GameObject>();
        for (let i = 0; i < results.length; i++) {
            let obj = results[i].gameObject;
            if (!obj) continue;
            if (objResults.indexOf(obj) == -1) objResults.push(obj);
        }
        return objResults;
    }

    public static modifyboxOverlapInLevel(StartLocation: Vector, EndLocation: Vector, Width: number, Height: number, debug: boolean, IgnoreObjectsGuid?: Array<string>, IgnoreByKind?: boolean, Source?: GameObject): Array<GameObject> {
        let halfSize = new Vector(1, Width / 2, Height / 2);
        let orientation = Vector.subtract(EndLocation, StartLocation).toRotation();
        let results = QueryUtil.boxTrace(StartLocation, EndLocation, halfSize, orientation, true, debug, IgnoreObjectsGuid, IgnoreByKind, Source);
        let objResults = new Array<GameObject>();
        for (let i = 0; i < results.length; i++) {
            let obj = results[i].gameObject;
            if (!obj) continue;
            if (objResults.indexOf(obj) == -1) objResults.push(obj);
        }
        return objResults;
    }

    public static modifyGetShootDir(chara: Character, startPos: Vector, shootRange: number): Vector {
        const camera = Camera.currentCamera;
        let start = Vector.zero;
        let end = Vector.zero;
        let dir = Vector.zero;
        if (startPos) {
            start = startPos;
        }
        if (camera) {
            end = camera.worldTransform.position.add(camera.worldTransform.getForwardVector().multiply(shootRange));
            const hits = QueryUtil.lineTrace(camera.worldTransform.position, end, false, true, [], false, false, chara);
            dir = end.subtract(start);
            if (hits.length > 0) {
                dir = hits[0].impactPoint.subtract(start);
            }
        }
        return dir.normalize();
    }

    public static modifyProjectWorldLocationToWidgetPosition(player: mw.Player, worldLocation: mw.Vector, outScreenPosition: mw.Vector2, isPlayerViewportRelative: boolean): boolean {
        let result = InputUtil.projectWorldPositionToWidgetPosition(worldLocation, isPlayerViewportRelative);
        outScreenPosition.x = result.screenPosition.x;
        outScreenPosition.y = result.screenPosition.y;
        return result.result;
    }

    public static setMaterialColor(model: Model, Index: number, InColor: LinearColor): void {
        let materialList = model.getMaterialInstance();
        materialList[Index].getAllVectorParameterName().forEach((v, i) => {
            materialList[Index].setVectorParameterValue(v, InColor);
        });
    }

    public static getMaterialColor(model: Model, Index: number): LinearColor {
        let materialList = model.getMaterialInstance();
        if (!(materialList.length > 0)) {
            return;
        }
        let nameList = materialList[Index].getAllVectorParameterName();
        return nameList.length > 0 ? materialList[Index].getVectorParameterValue(nameList[0]) : new LinearColor(1, 1, 1, 1);
    }

}
