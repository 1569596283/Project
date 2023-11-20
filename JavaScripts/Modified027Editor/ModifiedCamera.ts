import CameraUtils from "../utils/CameraUtils";

export class ModifiedCameraSystem {

    private static followEnable;
    private static followRotationValue;
    private static isBind = false;
    public static followTargetEnable = true;
    public static followTargetInterpSpeed = 15;

    static get cameraLocationMode(): CameraPositionMode {
        if (!SystemUtil.isClient()) {
            return;
        }
        return Camera.currentCamera.positionMode;
    }

    static set cameraLocationMode(newCameraLocationMode: CameraPositionMode) {
        if (!SystemUtil.isClient()) {
            return;
        }
        let tempTransform = Camera.currentCamera.springArm.localTransform;
        Camera.currentCamera.positionMode = newCameraLocationMode;
        if (newCameraLocationMode == CameraPositionMode.PositionFollow) {
            CameraUtils.resetCamera();
        }
    }

    public static setCameraFollowTarget(target: GameObject): void {
        if (!SystemUtil.isClient()) return;
        CameraUtils.changeCamera(target);

    }

    public static cancelCameraFollowTarget(): void {
        if (!SystemUtil.isClient()) return;
        CameraUtils.resetCamera();
    }

    public static setOverrideCameraRotation(newOverrideRotation: Rotation): void {
        if (!SystemUtil.isClient()) return;
        ModifiedCameraSystem.followEnable = true;
        ModifiedCameraSystem.followRotationValue = newOverrideRotation;
        Player.setControllerRotation(ModifiedCameraSystem.followRotationValue);
        if (!ModifiedCameraSystem.isBind) {
            TimeUtil.onEnterFrame.add(() => {
                if (ModifiedCameraSystem.followEnable) {
                    Player.setControllerRotation(ModifiedCameraSystem.followRotationValue);
                }
            }, this);
            ModifiedCameraSystem.isBind = true;
        }
    }

    public static resetOverrideCameraRotation(): void {
        if (!SystemUtil.isClient()) return;
        ModifiedCameraSystem.followEnable = false;
    }

    public static getCurrentSettings(): CameraSystemData {
        if (!SystemUtil.isClient()) return;
        cameraSystemConfig.cameraRelativeTransform = Camera.currentCamera.localTransform.clone();
        cameraSystemConfig.targetArmLength = Camera.currentCamera.springArm.length;
        cameraSystemConfig.enableCameraLocationLag = Camera.currentCamera.positionLagEnabled;
        cameraSystemConfig.cameraLocationLagSpeed = Camera.currentCamera.positionLagSpeed;
        cameraSystemConfig.enableCameraRotationLag = Camera.currentCamera.rotationLagEnabled;
        cameraSystemConfig.cameraRotationLagSpeed = Camera.currentCamera.rotationLagSpeed;
        cameraSystemConfig.cameraFOV = Camera.currentCamera.fov;
        cameraSystemConfig.cameraLocationMode = Camera.currentCamera.positionMode;
        cameraSystemConfig.cameraRotationMode = Camera.currentCamera.rotationMode;
        cameraSystemConfig.enableCameraCollision = Camera.currentCamera.springArm.collisionEnabled;
        cameraSystemConfig.cameraUpLimitAngle = Camera.currentCamera.upAngleLimit;
        cameraSystemConfig.cameraDownLimitAngle = Camera.currentCamera.downAngleLimit;
        return cameraSystemConfig;
    }

    public static applySettings(CameraSetting: CameraSystemData): void {
        if (!SystemUtil.isClient()) return;
        Camera.currentCamera.localTransform = CameraSetting.cameraRelativeTransform.clone();
        Camera.currentCamera.springArm.length = CameraSetting.targetArmLength;
        Camera.currentCamera.positionLagEnabled = CameraSetting.enableCameraLocationLag;
        Camera.currentCamera.positionLagSpeed = CameraSetting.cameraLocationLagSpeed;
        Camera.currentCamera.rotationLagEnabled = CameraSetting.enableCameraRotationLag;
        Camera.currentCamera.rotationLagSpeed = CameraSetting.cameraRotationLagSpeed;
        Camera.currentCamera.fov = CameraSetting.cameraFOV;
        ModifiedCameraSystem.cameraLocationMode = CameraSetting.cameraLocationMode;
        Camera.currentCamera.rotationMode = CameraSetting.cameraRotationMode;
        Camera.currentCamera.springArm.collisionEnabled = CameraSetting.enableCameraCollision;
        Camera.currentCamera.upAngleLimit = CameraSetting.cameraUpLimitAngle;
        Camera.currentCamera.downAngleLimit = CameraSetting.cameraDownLimitAngle;
    }

    public static cameraFocusing(targetArmLength: number, targetOffset: Vector, timeInterval = 20): void {
        if (!SystemUtil.isClient()) return;
        let timer = TimeUtil.onEnterFrame.add(() => {
            let interpolationValue = Camera.currentCamera.springArm.length + (targetArmLength - Camera.currentCamera.springArm.length) / timeInterval;
            Camera.currentCamera.springArm.length = interpolationValue;
            if (Math.abs(Camera.currentCamera.springArm.length - targetArmLength) <= 0.5) {
                TimeUtil.onEnterFrame.remove(timer);
            }
        })

    }

    public static startCameraShake(shakeData: CameraModifid.CameraShakeData): void {
        if (!SystemUtil.isClient()) return;
        let info: mw.CameraShakeInfo = {
            rotationYAmplitude: shakeData.rotYawOscillation.amplitude,
            rotationYFrequency: shakeData.rotYawOscillation.frequency,

            rotationZAmplitude: shakeData.rotRollOscillation.amplitude,
            rotationZFrequency: shakeData.rotRollOscillation.frequency,

            rotationXAmplitude: shakeData.rotPitchOscillation.amplitude,
            rotationXFrequency: shakeData.rotPitchOscillation.frequency,

            positionXAmplitude: shakeData.locXOscillation.amplitude,
            positionXFrequency: shakeData.locXOscillation.frequency,

            positionYAmplitude: shakeData.locYOscillation.amplitude,
            positionYFrequency: shakeData.locYOscillation.frequency,

            positionZAmplitude: shakeData.locZOscillation.amplitude,
            positionZFrequency: shakeData.locZOscillation.frequency,
        }
        Camera.shake(info);
    }

    public static stopCameraShake(): void {
        if (!SystemUtil.isClient()) return;
        Camera.stopShake();
    }

    public static getDefaultCameraShakeData(): CameraModifid.CameraShakeData {
        const defaultOscillator: CameraModifid.Oscillator = {
            amplitude: 0,
            frequency: 0,
            waveform: CameraModifid.EOscillatorWaveform.SineWave,
        };
        const defaultCameraShakeData: CameraModifid.CameraShakeData = {
            rotPitchOscillation: { ...defaultOscillator },
            rotYawOscillation: { ...defaultOscillator },
            rotRollOscillation: { ...defaultOscillator },
            locXOscillation: { ...defaultOscillator },
            locYOscillation: { ...defaultOscillator },
            locZOscillation: { ...defaultOscillator },
            fovOscillation: { ...defaultOscillator },
        };
        return defaultCameraShakeData;
    }
}

export namespace CameraModifid {

    export type CameraShakeData = {
        rotPitchOscillation?: Oscillator;
        rotYawOscillation?: Oscillator;
        rotRollOscillation?: Oscillator;
        locXOscillation?: Oscillator;
        locYOscillation?: Oscillator;
        locZOscillation?: Oscillator;
        fovOscillation?: Oscillator;
    };

    export type Oscillator = {
        amplitude?: number;
        frequency?: number;
        waveform?: EOscillatorWaveform;
    };

    export enum EOscillatorWaveform {
        /** 正弦波 */
        SineWave = 0,
        /** Perlin噪声 */
        PerlinNoise = 1
    }
}

export type CameraSystemData = {

    cameraRelativeTransform?: Transform,

    cameraProjectionMode?: CameraProjectionMode,

    targetArmLength?: number,

    enableCameraLocationLag?: boolean,

    cameraLocationLagSpeed?: number,

    enableCameraRotationLag?: boolean,

    cameraRotationLagSpeed?: number,

    cameraFOV?: number,

    cameraLocationMode?: CameraPositionMode,

    cameraRotationMode?: CameraRotationMode,

    enableCameraCollision?: boolean,

    cameraUpLimitAngle?: number,

    cameraDownLimitAngle?: number,

}

const cameraSystemConfig: CameraSystemData = {
    cameraRelativeTransform: Transform.identity,
    targetArmLength: 400,
    enableCameraLocationLag: false,
    cameraLocationLagSpeed: 10,
    enableCameraRotationLag: false,
    cameraRotationLagSpeed: 10,
    cameraFOV: 90,
    cameraLocationMode: CameraPositionMode.PositionFollow,
    cameraRotationMode: CameraRotationMode.RotationControl,
    enableCameraCollision: true,
    cameraUpLimitAngle: 40,
    cameraDownLimitAngle: -40,
};
