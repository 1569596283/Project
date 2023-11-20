
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 今日份的晚安
 * UI: UI/ui/GrowUI.ui
 * TIME: 2023.05.15-17.57.12
 */

 

 @UIBind('UI/ui/GrowUI.ui')
 export default class GrowUI_Generate extends mw.UIScript {
	 @UIWidgetBind('RootCanvas/mInc')
    public mInc: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mName')
    public mName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mLineage')
    public mLineage: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mInput')
    public mInput: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/mProgressCanvas/mTexGrow')
    public mTexGrow: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mProgressCanvas/mDelta')
    public mDelta: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mProgressCanvas/mProgressCur')
    public mProgressCur: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mProgressCanvas/mProgressDelta')
    public mProgressDelta: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mProgressCanvas/minfo')
    public minfo: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mProgressCanvas')
    public mProgressCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBtnFree/mTexFree')
    public mTexFree: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnFree')
    public mBtnFree: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBtnFollow/mTexFollow')
    public mTexFollow: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnFollow')
    public mBtnFollow: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBtnFeed/mTextFeed')
    public mTextFeed: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnFeed')
    public mBtnFeed: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBtnLeave/mTexLeave')
    public mTexLeave: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mBtnLeave')
    public mBtnLeave: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mModify/mModifyTex')
    public mModifyTex: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mModify')
    public mModify: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mTexCh')
    public mTexCh: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mTexHobby')
    public mTexHobby: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mPerson')
    public mPerson: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mHobby')
    public mHobby: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mCanvasTalk/mTalk')
    public mTalk: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mCanvasTalk')
    public mCanvasTalk: mw.Canvas=undefined;
    

 
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
		
	
		this.mBtnFollow.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnFollow");
		})
		this.mBtnFollow.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnFeed.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnFeed");
		})
		this.mBtnFeed.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mBtnLeave.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mBtnLeave");
		})
		this.mBtnLeave.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mModify.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mModify");
		})
		this.mModify.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	

		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mName)
		
	
		this.initLanguage(this.mLineage)
		
	
		this.initLanguage(this.mTexGrow)
		
	
		this.initLanguage(this.mDelta)
		
	
		this.initLanguage(this.minfo)
		
	
		this.initLanguage(this.mTexFree)
		
	
		this.initLanguage(this.mTexFollow)
		
	
		this.initLanguage(this.mTextFeed)
		
	
		this.initLanguage(this.mTexLeave)
		
	
		this.initLanguage(this.mModifyTex)
		
	
		this.initLanguage(this.mTexCh)
		
	
		this.initLanguage(this.mTexHobby)
		
	
		this.initLanguage(this.mPerson)
		
	
		this.initLanguage(this.mHobby)
		
	
		this.initLanguage(this.mTalk)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock_1_1") as any);
		
	

	}
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
 }
 