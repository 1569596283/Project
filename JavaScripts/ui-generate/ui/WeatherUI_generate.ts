
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/WeatherUI.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/WeatherUI.ui')
 export default class WeatherUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/blackMask')
    public blackMask: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/textTips')
    public textTips: mw.TextBlock=undefined;
    

 
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
		
		this.initLanguage(this.textTips)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 