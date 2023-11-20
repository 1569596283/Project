
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/DefaultUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/DefaultUI.ui')
 export default class DefaultUI_Generate extends mw.UIScript {
	 @UIWidgetBind('MWCanvas/mJoystick')
    public mJoystick: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mTouchPadDesigner')
    public mTouchPadDesigner: mw.TouchPad=undefined;
    @UIWidgetBind('MWCanvas/button_jump')
    public button_jump: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/canvas_image/rightTop')
    public rightTop: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_image/leftTop')
    public leftTop: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_image/leftBottom')
    public leftBottom: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_image/rightBottom')
    public rightBottom: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_image')
    public canvas_image: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/canvas_introduce/finger')
    public finger: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_introduce/movetext')
    public movetext: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/canvas_introduce/arrow1')
    public arrow1: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_introduce/arrow2')
    public arrow2: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/canvas_introduce/eyetext')
    public eyetext: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/canvas_introduce')
    public canvas_introduce: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_jump.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_jump");
		})
		this.button_jump.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.movetext)
		
	
		this.initLanguage(this.eyetext)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 