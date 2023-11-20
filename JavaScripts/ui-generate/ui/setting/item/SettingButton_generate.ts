﻿
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/setting/item/SettingButton.ui
 * TIME: 2023.05.15-17.57.15
 */

 

 @UIBind('UI/ui/setting/item/SettingButton.ui')
 export default class SettingButton_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/mCanvas/mBtn/mTextName')
    public mTextName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mCanvas/mBtn')
    public mBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mCanvas')
    public mCanvas: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtn");
		})
		this.mBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTextName)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 