
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/setting/item/SettingChoose.ui
 * TIME: 2023.05.15-17.57.15
 */

 

 @UIBind('UI/ui/setting/item/SettingChoose.ui')
 export default class SettingChoose_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvasContent/canvas_1/textBlock_1')
    public textBlock_1: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvasContent/canvas_1')
    public canvas_1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvasContent/canvas_3/textBlock_3')
    public textBlock_3: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvasContent/canvas_3')
    public canvas_3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvasContent/canvas_2/textBlock_2')
    public textBlock_2: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvasContent/canvas_2')
    public canvas_2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvasContent')
    public canvasContent: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/chooseLeft')
    public chooseLeft: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/chooseRight')
    public chooseRight: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/chooseSelect')
    public chooseSelect: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.chooseLeft.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "chooseLeft");
		})
		this.chooseLeft.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.chooseRight.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "chooseRight");
		})
		this.chooseRight.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.chooseSelect.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "chooseSelect");
		})
		this.chooseSelect.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.textBlock_1)
		
	
		this.initLanguage(this.textBlock_3)
		
	
		this.initLanguage(this.textBlock_2)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 