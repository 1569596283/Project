
export default class CameraUtils {
    static changeCamera(go: GameObject) {
        Camera.currentCamera.parent = go;
        Camera.currentCamera.springArm.localTransform = Transform.identity;
        Camera.currentCamera.rotationMode = CameraRotationMode.RotationFollow;
    }

    static resetCamera() {
        Camera.currentCamera.parent = Player.localPlayer.character;
        Camera.currentCamera.springArm.localTransform = Transform.identity;
        Camera.currentCamera.rotationMode = CameraRotationMode.RotationControl;
    }
}