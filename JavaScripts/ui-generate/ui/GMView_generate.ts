
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/GMView.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/GMView.ui')
 export default class GMView_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/Canvas_1/inputSelfWay')
    public inputSelfWay: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/inputAddBuff')
    public inputAddBuff: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btnAddBuffImpact')
    public btnAddBuffImpact: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btnAddBuff')
    public btnAddBuff: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_0')
    public btn_0: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_1')
    public btn_1: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_2')
    public btn_2: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_3')
    public btn_3: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_4')
    public btn_4: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_5')
    public btn_5: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_6')
    public btn_6: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/btn_7')
    public btn_7: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_0')
    public buff_0: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_1')
    public buff_1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_2')
    public buff_2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_3')
    public buff_3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_4')
    public buff_4: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_5')
    public buff_5: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_6')
    public buff_6: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/ScrollBox_1/buff_7')
    public buff_7: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horse/input_horseID')
    public input_horseID: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horse/text_horse')
    public text_horse: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horse/button_create')
    public button_create: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horse')
    public canvas_horse: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horseAnimation/input_animation')
    public input_animation: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horseAnimation/text_animation')
    public text_animation: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horseAnimation/button_play')
    public button_play: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest/canvas_horseAnimation')
    public canvas_horseAnimation: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_horsetest')
    public canvas_horsetest: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.btnAddBuffImpact.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnAddBuffImpact");
		})
		this.btnAddBuffImpact.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btnAddBuff.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btnAddBuff");
		})
		this.btnAddBuff.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_0.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_0");
		})
		this.btn_0.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_1.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_1");
		})
		this.btn_1.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_2.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_2");
		})
		this.btn_2.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_3.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_3");
		})
		this.btn_3.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_4.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_4");
		})
		this.btn_4.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_5.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_5");
		})
		this.btn_5.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_6.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_6");
		})
		this.btn_6.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.btn_7.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "btn_7");
		})
		this.btn_7.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_create.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_create");
		})
		this.button_create.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_play.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_play");
		})
		this.button_play.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.text_horse)
		
	
		this.initLanguage(this.text_animation)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btnAddBuffImpact/TextBlock_3") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btnAddBuff/TextBlock_3") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_0/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_1/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_2/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_3/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_4/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_5/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_6/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_1/btn_7/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_0/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_0/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_1/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_1/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_2/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_2/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_3/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_3/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_4/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_4/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_5/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_5/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_6/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_6/TextBuffDesc") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_7/TextBuffId") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ScrollBox_1/buff_7/TextBuffDesc") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 