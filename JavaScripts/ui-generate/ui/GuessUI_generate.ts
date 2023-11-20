
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/GuessUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/GuessUI.ui')
 export default class GuessUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/Canvas_2/text_tittle')
    public text_tittle: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/text_name')
    public text_name: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/canvas_winRate/text_winRate')
    public text_winRate: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/canvas_winRate')
    public canvas_winRate: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/canvas_lineage/text_lineage')
    public text_lineage: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/canvas_lineage/image_lineage')
    public image_lineage: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/canvas_lineage')
    public canvas_lineage: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/text_hobby')
    public text_hobby: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/text_nature')
    public text_nature: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/text_odd')
    public text_odd: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/text_all')
    public text_all: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info/text_player')
    public text_player: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_info')
    public canvas_info: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_bet/input_money')
    public input_money: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_bet/button_sub')
    public button_sub: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_bet/button_add')
    public button_add: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_bet/button_bet')
    public button_bet: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_bet')
    public canvas_bet: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_rate/image_rate')
    public image_rate: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_rate/text_rate')
    public text_rate: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_2/canvas_rate')
    public canvas_rate: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_time/text_time')
    public text_time: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_time')
    public canvas_time: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/button_left')
    public button_left: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/button_right')
    public button_right: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/button_close')
    public button_close: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_sub.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_sub");
		})
		this.button_sub.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_add.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_add");
		})
		this.button_add.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_bet.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_bet");
		})
		this.button_bet.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_left.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_left");
		})
		this.button_left.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_right.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_right");
		})
		this.button_right.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_close.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_close");
		})
		this.button_close.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.text_tittle)
		
	
		this.initLanguage(this.text_name)
		
	
		this.initLanguage(this.text_winRate)
		
	
		this.initLanguage(this.text_lineage)
		
	
		this.initLanguage(this.text_hobby)
		
	
		this.initLanguage(this.text_nature)
		
	
		this.initLanguage(this.text_odd)
		
	
		this.initLanguage(this.text_all)
		
	
		this.initLanguage(this.text_player)
		
	
		this.initLanguage(this.text_rate)
		
	
		this.initLanguage(this.text_time)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/canvas_winRate/WinRate") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/canvas_lineage/TextBlock_5") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/TextBlock_6") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/TextBlock_7") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/TextBlock_8") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/TextBlock_9") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_info/TextBlock_10") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas_2/canvas_bet/button_bet/TextBlock_9") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_time/TextBlock_3") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock_2") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 