
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/LuckyUI.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/LuckyUI.ui')
 export default class LuckyUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas_root/canvas')
    public canvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_root/canvas_reference')
    public canvas_reference: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_root')
    public canvas_root: mw.Canvas=undefined;
    

 
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
 