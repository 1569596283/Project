
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/ReportCell.ui
 * TIME: 2023.05.15-17.57.14
 */

 

 @UIBind('UI/ui/ReportCell.ui')
 export default class ReportCell_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/contentBg')
    public contentBg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/contentRoot')
    public contentRoot: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/imageNotice')
    public imageNotice: mw.Image=undefined;
    

 
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
 