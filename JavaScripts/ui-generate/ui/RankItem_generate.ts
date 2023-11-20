
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/RankItem.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/RankItem.ui')
 export default class RankItem_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas_item/button_camera')
    public button_camera: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_item/text_name')
    public text_name: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_item/text_speed')
    public text_speed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_item/text_way')
    public text_way: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_item')
    public canvas_item: mw.Canvas=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_camera.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_camera");
		})
		this.button_camera.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.text_name)
		
	
		this.initLanguage(this.text_speed)
		
	
		this.initLanguage(this.text_way)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 