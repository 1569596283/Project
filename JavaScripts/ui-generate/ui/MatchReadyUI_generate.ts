
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/MatchReadyUI.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/MatchReadyUI.ui')
 export default class MatchReadyUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/Canvas_1/title')
    public title: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/canvas_way')
    public canvas_way: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/canvas_weather')
    public canvas_weather: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/canvas_desc/text_desc')
    public text_desc: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/canvas_desc')
    public canvas_desc: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.title)
		
	
		this.initLanguage(this.text_desc)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/Number") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 