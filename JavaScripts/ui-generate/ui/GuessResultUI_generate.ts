
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/GuessResultUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/GuessResultUI.ui')
 export default class GuessResultUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/text_tittle')
    public text_tittle: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/text_bet')
    public text_bet: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/text_winer')
    public text_winer: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/text_result')
    public text_result: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/button_confirm')
    public button_confirm: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_confirm.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_confirm");
		})
		this.button_confirm.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.text_tittle)
		
	
		this.initLanguage(this.text_bet)
		
	
		this.initLanguage(this.text_winer)
		
	
		this.initLanguage(this.text_result)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/button_confirm/TextBlock_4") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 