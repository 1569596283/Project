import PopWindow_Generate from "../ui-generate/ui/PopWindow_generate"


export class IPopWindowInfo {
	title: string = ''
	desc: string = ''
	desc2?: string = ''
	comfirmCallback: () => void
	cancelCallback?: () => void
	titleImg: string//头顶图片
	contentImg?: string//内容图片
	isShowCancel?: boolean
	enableBg?: boolean
	extendData?: any
}



export default class PopWindowUI extends PopWindow_Generate {

	private _comfirmCallback: (data: any) => void
	private _cancelCallback: () => void
	private _enableBg: boolean = true
	private _extendData: any = null
	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onAwake() {
		//设置能否每帧触发onUpdate
		super.onAwake()

		this.btnBG.onClicked.add(() => {

			if (this._enableBg) {
				mw.UIService.hide(PopWindowUI)
			}
		})

		this.btnCancel.onClicked.add(() => {

			this._cancelCallback && this._cancelCallback()
			mw.UIService.hide(PopWindowUI)
		})
		this.btnComfirm.onClicked.add(() => {
			this._comfirmCallback && this._comfirmCallback(this._extendData)
			mw.UIService.hide(PopWindowUI)
		})

	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(...params: any[]) {
		console.log("显示选择界面");
		this.clearParams()
		let info = params[0] as IPopWindowInfo
		if (info) {
			if (info.isShowCancel == undefined || info.isShowCancel) {
				this.btnCancel.visibility = mw.SlateVisibility.Visible
			} else {
				this.btnCancel.visibility = mw.SlateVisibility.Hidden
			}

			this.textTitle.text = info.title
			this.textDesc.text = info.desc

			this._enableBg = info.enableBg
			if (this._enableBg == undefined) {
				this._enableBg = true
			}
			if (info.desc2 && info.desc2.length > 0) {
				this.textDesc2.visibility = mw.SlateVisibility.Visible
				this.textDesc2.text = info.desc2
			}
			else {
				this.textDesc2.visibility = mw.SlateVisibility.Hidden
			}

			if (info.contentImg && info.contentImg.length > 0) {
				this.contentImg.visibility = mw.SlateVisibility.Visible
				this.contentImg.imageGuid = info.contentImg
			}
			else {
				this.contentImg.visibility = mw.SlateVisibility.Hidden
			}


			if (info.titleImg && info.titleImg.length > 0) {
				this.titleImg.imageGuid = info.titleImg
			}

			this._extendData = info.extendData

			console.log("设置是的回调函数");
			this._comfirmCallback = info.comfirmCallback
			this._cancelCallback = info.cancelCallback
		}
	}

	protected clearParams() {
		this._enableBg = true
		this._extendData = null
		this._comfirmCallback = null
		this._cancelCallback = null
	}

}
