
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/GetMoneyUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/GetMoneyUI.ui')
 export default class GetMoneyUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas_info/text_money')
    public text_money: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_info')
    public canvas_info: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_coin/image_coin0')
    public image_coin0: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_coin/image_coin1')
    public image_coin1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_coin/image_coin2')
    public image_coin2: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_coin/imageIcon')
    public imageIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_coin')
    public canvas_coin: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_jem/image_jem0')
    public image_jem0: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_jem/image_jem1')
    public image_jem1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_jem/image_jem3')
    public image_jem3: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_jem/imageJem')
    public imageJem: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_jem')
    public canvas_jem: mw.Canvas=undefined;
    

 
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
		
		this.initLanguage(this.text_money)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_coin/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_jem/TextBlock_1_1") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 