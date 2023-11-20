
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/setting/item/SettingBar.ui
 * TIME: 2023.05.15-17.57.15
 */

 

 @UIBind('UI/ui/setting/item/SettingBar.ui')
 export default class SettingBar_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas/mBar')
    public mBar: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/canvas/mBtnAdd')
    public mBtnAdd: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas/mBtnSub')
    public mBtnSub: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas/num')
    public num: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas')
    public canvas: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mBtnAdd.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnAdd");
		})
		this.mBtnAdd.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnSub.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnSub");
		})
		this.mBtnSub.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.num)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 