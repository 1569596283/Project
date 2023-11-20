
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/TouchUI.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/TouchUI.ui')
 export default class TouchUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/button_feed/mTexChoose')
    public mTexChoose: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/button_feed')
    public button_feed: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/button_tounch')
    public button_tounch: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_feed.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_feed");
		})
		this.button_feed.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_tounch.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_tounch");
		})
		this.button_tounch.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTexChoose)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/button_tounch/Text") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 