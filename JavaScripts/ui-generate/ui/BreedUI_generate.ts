
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/BreedUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/BreedUI.ui')
 export default class BreedUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/canvas_info/mItem1')
    public mItem1: mw.UserWidget=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/mItem2')
    public mItem2: mw.UserWidget=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/button_icon2')
    public button_icon2: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/button_icon1')
    public button_icon1: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/button_leave/tex_breedUI_Leave')
    public tex_breedUI_Leave: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/button_leave')
    public button_leave: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/button_breed/tex_BreedUI_Breed')
    public tex_BreedUI_Breed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_info/button_breed')
    public button_breed: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_info')
    public canvas_info: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/image_shady')
    public image_shady: mw.Image=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.button_icon2.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_icon2");
		})
		this.button_icon2.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_icon1.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_icon1");
		})
		this.button_icon1.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_leave.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_leave");
		})
		this.button_leave.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_breed.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_breed");
		})
		this.button_breed.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.tex_breedUI_Leave)
		
	
		this.initLanguage(this.tex_BreedUI_Breed)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_info/button_icon2/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/canvas_info/button_icon1/TextBlock_2") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 