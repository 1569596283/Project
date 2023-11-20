
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/GuidanceUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/GuidanceUI.ui')
 export default class GuidanceUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/panelFocus/maskTouch')
    public maskTouch: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelFocus/maskTop')
    public maskTop: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelFocus/maskBottom')
    public maskBottom: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelFocus/maskLeft')
    public maskLeft: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelFocus/maskRight')
    public maskRight: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelFocus/focusBtn')
    public focusBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelFocus')
    public panelFocus: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/btnFinger')
    public btnFinger: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/maskBackground')
    public maskBackground: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/imageTranslate')
    public imageTranslate: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/panelLetterContent/image')
    public image: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/panelLetterContent/textLetterContent')
    public textLetterContent: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/panelLetterContent/canvas_yes/btnYes')
    public btnYes: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/panelLetterContent/canvas_yes')
    public canvas_yes: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/panelLetterContent')
    public panelLetterContent: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/route1')
    public route1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/route2')
    public route2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/route3')
    public route3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelLetter/route4')
    public route4: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelLetter')
    public panelLetter: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelDialog/buttonDialog')
    public buttonDialog: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelDialog/textDialog')
    public textDialog: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelDialog')
    public panelDialog: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelIntroduce/panelIntroduceContent/buttonIntroduce')
    public buttonIntroduce: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/panelIntroduce/panelIntroduceContent/Canvas_9/imageIntroduce')
    public imageIntroduce: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/panelIntroduce/panelIntroduceContent/Canvas_9/textIntroduce')
    public textIntroduce: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelIntroduce/panelIntroduceContent')
    public panelIntroduceContent: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelIntroduce')
    public panelIntroduce: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.focusBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "focusBtn");
		})
		this.focusBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btnFinger.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnFinger");
		})
		this.btnFinger.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.maskBackground.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "maskBackground");
		})
		this.maskBackground.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btnYes.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnYes");
		})
		this.btnYes.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.buttonDialog.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonDialog");
		})
		this.buttonDialog.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.buttonIntroduce.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "buttonIntroduce");
		})
		this.buttonIntroduce.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.textLetterContent)
		
	
		this.initLanguage(this.textDialog)
		
	
		this.initLanguage(this.textIntroduce)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelLetter/panelLetterContent/canvas_yes/btnYes/TextBlock_2") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 