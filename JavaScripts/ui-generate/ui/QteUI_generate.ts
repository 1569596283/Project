
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/QteUI.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/QteUI.ui')
 export default class QteUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas_countdown/text_countdown_num')
    public text_countdown_num: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_countdown/text_countdown')
    public text_countdown: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_countdown')
    public canvas_countdown: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_guide')
    public canvas_guide: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_right/image_right')
    public image_right: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_right/button_right')
    public button_right: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_right')
    public canvas_right: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_left/image_left')
    public image_left: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_left/button_left')
    public button_left: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_left')
    public canvas_left: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/text_settle_describe')
    public text_settle_describe: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_cheer/text_cheer')
    public text_cheer: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_cheer')
    public canvas_cheer: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_count/progress_buff')
    public progress_buff: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/canvas_count/text_count')
    public text_count: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_count')
    public canvas_count: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/button_exit')
    public button_exit: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_right.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_right");
		})
		this.button_right.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_left.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_left");
		})
		this.button_left.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_exit.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_exit");
		})
		this.button_exit.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.text_countdown_num)
		
	
		this.initLanguage(this.text_countdown)
		
	
		this.initLanguage(this.text_settle_describe)
		
	
		this.initLanguage(this.text_cheer)
		
	
		this.initLanguage(this.text_count)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_guide/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_guide/TextBlock_2") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 