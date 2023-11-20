/*
*@Author: zhaomengyao
*@Date:  2022/02/15 13:31:24
*@Description:计算FPS
*/

let bFirst: boolean = true;
let frameCount: number = 0; //总帧数
let lastTime: number = 0;
let elapsedTime: number = 0;//总时间
let fps = 0;//帧率

//每帧计算帧率
export function CalcFps(): number {
    if (bFirst) {
        lastTime = mw.TimeUtil.time() * 1000; //ms
        bFirst = false;
    }
    let nowTime = mw.TimeUtil.time() * 1000;
    elapsedTime += (nowTime - lastTime);
    lastTime = nowTime;
    frameCount++;

    if (elapsedTime >= 1000) {
        fps = frameCount / (elapsedTime * 0.001);
        frameCount = 0;
        elapsedTime = 0;
    }
    return fps;
}
