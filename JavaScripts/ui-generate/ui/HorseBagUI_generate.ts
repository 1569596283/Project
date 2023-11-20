
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/HorseBagUI.ui
 * TIME: 2023.05.15-17.57.13
 */

 

 @UIBind('UI/ui/HorseBagUI.ui')
 export default class HorseBagUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/mBtnFree/mTexFree')
    public mTexFree: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnFree')
    public mBtnFree: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBtnSelect/mSelText')
    public mSelText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnSelect')
    public mBtnSelect: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBtnLeave')
    public mBtnLeave: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/textgg')
    public textgg: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_breed/button_left')
    public button_left: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_breed/button_right')
    public button_right: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_breed/button_choose/mTexChoose')
    public mTexChoose: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_breed/button_choose')
    public button_choose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/canvas_breed')
    public canvas_breed: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas/mHpbar_1')
    public mHpbar_1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas/mHpbar_2')
    public mHpbar_2: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas/mHpbar_3')
    public mHpbar_3: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas/mHpbar_4')
    public mHpbar_4: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas/mHpbar_5')
    public mHpbar_5: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas/mTexEnargy')
    public mTexEnargy: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mEnergyCanvas')
    public mEnergyCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas/mBearbar_1')
    public mBearbar_1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas/mBearbar_2')
    public mBearbar_2: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas/mBearbar_3')
    public mBearbar_3: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas/mBearbar_4')
    public mBearbar_4: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas/mBearbar_5')
    public mBearbar_5: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas/mTexBirthNum')
    public mTexBirthNum: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear/mBearCanvas')
    public mBearCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mEnergyBear')
    public mEnergyBear: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mIcon')
    public mIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mLineage')
    public mLineage: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mCharacter')
    public mCharacter: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mHobby')
    public mHobby: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mTexNature')
    public mTexNature: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mTexHobby')
    public mTexHobby: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mName')
    public mName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mModifyTex')
    public mModifyTex: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty0')
    public panelProperty0: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty1')
    public panelProperty1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty2')
    public panelProperty2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty3')
    public panelProperty3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty4')
    public panelProperty4: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty5')
    public panelProperty5: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelProperty6')
    public panelProperty6: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyCurrent1')
    public panelPropertyCurrent1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyCurrent2')
    public panelPropertyCurrent2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyCurrent3')
    public panelPropertyCurrent3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyCurrent4')
    public panelPropertyCurrent4: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyCurrent5')
    public panelPropertyCurrent5: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyCurrent6')
    public panelPropertyCurrent6: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyValue/textPropertValue')
    public textPropertValue: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/panelProperties/panelPropertyValue')
    public panelPropertyValue: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/panelProperties')
    public panelProperties: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/canvas_rate/image_rate')
    public image_rate: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/canvas_rate/text_rate')
    public text_rate: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/canvas_rate')
    public canvas_rate: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/item1')
    public item1: mw.UserWidget=undefined;
    @UIWidgetBind('RootCanvas/mEnergyTimer/mTexTimer')
    public mTexTimer: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mEnergyTimer')
    public mEnergyTimer: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mInputName')
    public mInputName: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/mModify')
    public mModify: mw.Button=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mBtnFree.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnFree");
		})
		this.mBtnFree.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnSelect.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnSelect");
		})
		this.mBtnSelect.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnLeave.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnLeave");
		})
		this.mBtnLeave.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_left.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_left");
		})
		this.button_left.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_right.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_right");
		})
		this.button_right.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.button_choose.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "button_choose");
		})
		this.button_choose.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mModify.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mModify");
		})
		this.mModify.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTexFree)
		
	
		this.initLanguage(this.mSelText)
		
	
		this.initLanguage(this.textgg)
		
	
		this.initLanguage(this.mTexChoose)
		
	
		this.initLanguage(this.mTexEnargy)
		
	
		this.initLanguage(this.mTexBirthNum)
		
	
		this.initLanguage(this.mLineage)
		
	
		this.initLanguage(this.mCharacter)
		
	
		this.initLanguage(this.mHobby)
		
	
		this.initLanguage(this.mTexNature)
		
	
		this.initLanguage(this.mTexHobby)
		
	
		this.initLanguage(this.mName)
		
	
		this.initLanguage(this.mModifyTex)
		
	
		this.initLanguage(this.textPropertValue)
		
	
		this.initLanguage(this.text_rate)
		
	
		this.initLanguage(this.mTexTimer)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock_2_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelProperties/panelProperty1/TextPropertyName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelProperties/panelProperty2/TextPropertyName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelProperties/panelProperty3/TextPropertyName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelProperties/panelProperty4/TextPropertyName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelProperties/panelProperty5/TextPropertyName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/panelProperties/panelProperty6/TextPropertyName") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mEnergyTimer/TextBlock_3") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 