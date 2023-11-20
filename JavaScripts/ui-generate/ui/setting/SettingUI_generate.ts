
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/setting/SettingUI.ui
 * TIME: 2023.05.15-17.57.15
 */

 

 @UIBind('UI/ui/setting/SettingUI.ui')
 export default class SettingUI_Generate extends mw.UIScript {
	 @UIWidgetBind('MWCanvas_2147482460/mBG')
    public mBG: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1/music_Canvas/mMusicTex')
    public mMusicTex: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1/music_Canvas/barItem_BGM')
    public barItem_BGM: mw.UserWidget=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1/music_Canvas')
    public music_Canvas: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1/audio_Canvas/mAudioTex')
    public mAudioTex: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1/audio_Canvas/barItem_Sound')
    public barItem_Sound: mw.UserWidget=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1/audio_Canvas')
    public audio_Canvas: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas/contentCanvas_1')
    public contentCanvas_1: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvas')
    public mCanvas: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_2/mTitle')
    public mTitle: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mBtnClose/mTextClose')
    public mTextClose: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mBtnClose')
    public mBtnClose: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mScroll')
    public mScroll: mw.ScrollBox=undefined;
    

 
	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		this.mBtnClose.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnClose");
		})
		this.mBtnClose.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mMusicTex)
		
	
		this.initLanguage(this.mAudioTex)
		
	
		this.initLanguage(this.mTitle)
		
	
		this.initLanguage(this.mTextClose)
		
	
		//文本多语言
		

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 