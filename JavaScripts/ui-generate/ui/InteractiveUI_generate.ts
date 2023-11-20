
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/InteractiveUI.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/InteractiveUI.ui')
 export default class InteractiveUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas_button/button_yes/text_yes')
    public text_yes: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_button/button_yes')
    public button_yes: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_button/button_no/text_no')
    public text_no: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_button/button_no')
    public button_no: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_button/canvas_cost/button_cost')
    public button_cost: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_button/canvas_cost/text_money')
    public text_money: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_button/canvas_cost')
    public canvas_cost: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_button')
    public canvas_button: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_describe/button_close')
    public button_close: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_describe/text_descirbe')
    public text_descirbe: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_describe')
    public canvas_describe: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/button_talk')
    public button_talk: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_yes.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_yes");
		})
		this.button_yes.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_no.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_no");
		})
		this.button_no.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_cost.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_cost");
		})
		this.button_cost.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_close.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_close");
		})
		this.button_close.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_talk.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_talk");
		})
		this.button_talk.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.text_yes)
		
	
		this.initLanguage(this.text_no)
		
	
		this.initLanguage(this.text_money)
		
	
		this.initLanguage(this.text_descirbe)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_button/canvas_cost/TextBlock_3") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/button_talk/TextBlock_1") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 