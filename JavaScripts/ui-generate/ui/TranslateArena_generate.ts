
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/TranslateArena.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/TranslateArena.ui')
 export default class TranslateArena_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/Canvas_2/panel1/image1')
    public image1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/panel1')
    public panel1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/panel3/image3')
    public image3: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/panel3')
    public panel3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/panel2/image2')
    public image2: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/panel2')
    public panel2: mw.Canvas=undefined;
    

 
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
		
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 