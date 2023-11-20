
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/PopWindow.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/PopWindow.ui')
 export default class PopWindow_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/btnBG')
    public btnBG: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/btnCancel/mTexCancel')
    public mTexCancel: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/btnCancel')
    public btnCancel: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/btnComfirm/mTexOk')
    public mTexOk: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/btnComfirm')
    public btnComfirm: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/textDesc')
    public textDesc: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/textDesc2')
    public textDesc2: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/titleImg')
    public titleImg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/textTitle')
    public textTitle: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/contentImg')
    public contentImg: mw.Image=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.btnBG.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnBG");
		})
		this.btnBG.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btnCancel.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnCancel");
		})
		this.btnCancel.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btnComfirm.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnComfirm");
		})
		this.btnComfirm.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTexCancel)
		
	
		this.initLanguage(this.mTexOk)
		
	
		this.initLanguage(this.textDesc)
		
	
		this.initLanguage(this.textDesc2)
		
	
		this.initLanguage(this.textTitle)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 