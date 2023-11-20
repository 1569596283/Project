/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2022-12-21 14:43:20
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2022-12-21 14:48:51
 * @FilePath: \horseracing\JavaScripts\ui\WorldUI\World1.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Name5_Generate from "../../ui-generate/ui/WorldUI/Name5_generate";


export default class World5 extends Name5_Generate {

    /** 
    * 构造UI文件成功后，在合适的时机最先初始化一次 
    */
    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }

    /** 
    * 构造UI文件成功后，onStart之后 
    * 对于UI的根节点的添加操作，进行调用
    * 注意：该事件可能会多次调用
    */
    protected onAdded() {
    }

    /** 
     * 构造UI文件成功后，onAdded之后
     * 对于UI的根节点的移除操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onRemoved() {
    }

    /** 
    * 构造UI文件成功后，UI对象再被销毁时调用 
    * 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
    */
    protected onDestroy() {
    }

    /**
    * 每一帧调用
    * 通过canUpdate可以开启关闭调用
    * dt 两帧调用的时间差，毫秒
    */
    //protected onUpdate(dt :number) {
    //}

    /**
     * 设置显示时触发
     */
    //protected onShow(...params:any[]) {
    //}

    /**
     * 设置不显示时触发
     */
    //protected onHide() {
    //}

}
