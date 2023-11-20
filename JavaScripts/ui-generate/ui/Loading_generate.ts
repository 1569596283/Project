
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/Loading.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/Loading.ui')
 export default class Loading_Generate extends mw.UIScript {
	 @UIWidgetBind('Canvas/mDiamondsFlash_img')
    public mDiamondsFlash_img: mw.Image=undefined;
    @UIWidgetBind('Canvas/mProgressBar')
    public mProgressBar: mw.ProgressBar=undefined;
    @UIWidgetBind('Canvas/mMsg_txt')
    public mMsg_txt: mw.TextBlock=undefined;
    

 
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
		
		this.initLanguage(this.mMsg_txt)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("Canvas/MWTextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("Canvas/MWTextBlock_2") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 