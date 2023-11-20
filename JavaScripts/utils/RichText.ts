/*
 * @Author: pengcheng.zhang 
 * @Date: 2022-11-30 17:44:54 
 * @Last Modified by: pengcheng.zhang
 * @Last Modified time: 2022-12-14 14:19:19
 */
const FontDefinition = {
    'originSize': 24,
    "32": { 'char': '空格', 'width': 8, xoffset: 0 },
    "33": { 'char': '!', 'width': 8, xoffset: 0 },
    "34": { 'char': '"', 'width': 10.667, xoffset: 0 },
    "35": { 'char': '#', 'width': 18.667, xoffset: 0 },
    "36": { 'char': '$', 'width': 18.667, xoffset: 0 },
    "37": { 'char': '%', 'width': 24, xoffset: 0 },
    "38": { 'char': '&', 'width': 18.667, xoffset: 0 },
    "39": { 'char': '\'', 'width': 8, xoffset: 0 },
    "40": { 'char': '(', 'width': 10.667, xoffset: 0 },
    "41": { 'char': ')', 'width': 10.667, xoffset: 0 },
    "42": { 'char': '*', 'width': 13.333, xoffset: 0 },
    "43": { 'char': '+', 'width': 18.667, xoffset: 0 },
    "44": { 'char': ',', 'width': 5.333, xoffset: 0 },
    "45": { 'char': '-', 'width': 13.333, xoffset: 0 },
    "46": { 'char': '.', 'width': 8, xoffset: 0 },
    "47": { 'char': '/', 'width': 13.333, xoffset: 0 },

    "48": { 'char': '0', 'width': 18.667, xoffset: 0 },
    "49": { 'char': '1', 'width': 18.667, xoffset: 0 },
    "50": { 'char': '2', 'width': 18.667, xoffset: 0 },
    "51": { 'char': '3', 'width': 18.667, xoffset: 0 },
    "52": { 'char': '4', 'width': 18.667, xoffset: 0 },
    "53": { 'char': '5', 'width': 18.667, xoffset: 0 },
    "54": { 'char': '6', 'width': 18.667, xoffset: 0 },
    "55": { 'char': '7', 'width': 18.667, xoffset: 0 },
    "56": { 'char': '8', 'width': 18.667, xoffset: 0 },
    "57": { 'char': '9', 'width': 18.667, xoffset: 0 },

    "65": { 'char': "A", 'width': 21.333, xoffset: 0 },
    "66": { 'char': "B", 'width': 21.333, xoffset: 0 },
    "67": { 'char': "C", 'width': 21.333, xoffset: 0 },
    "68": { 'char': "D", 'width': 21.333, xoffset: 0 },
    "69": { 'char': "E", 'width': 18.667, xoffset: 0 },
    "70": { 'char': "F", 'width': 18.667, xoffset: 0 },
    "71": { 'char': "G", 'width': 21.333, xoffset: 0 },
    "72": { 'char': "H", 'width': 21.333, xoffset: 0 },
    "73": { 'char': "I", 'width': 8, xoffset: 0 },
    "74": { 'char': "J", 'width': 18.667, xoffset: 0 },
    "75": { 'char': "K", 'width': 21.333, xoffset: 0 },
    "76": { 'char': "L", 'width': 18.667, xoffset: 0 },
    "77": { 'char': "M", 'width': 26.667, xoffset: 0 },
    "78": { 'char': "N", 'width': 21.333, xoffset: 0 },
    "79": { 'char': "O", 'width': 21.333, xoffset: 0 },
    "80": { 'char': "P", 'width': 21.333, xoffset: 0 },
    "81": { 'char': "Q", 'width': 21.333, xoffset: 0 },
    "82": { 'char': "R", 'width': 21.333, xoffset: 0 },
    "83": { 'char': "S", 'width': 18.667, xoffset: 0 },
    "84": { 'char': "T", 'width': 18.667, xoffset: 0 },
    "85": { 'char': "U", 'width': 21.333, xoffset: 0 },
    "86": { 'char': "V", 'width': 21.333, xoffset: 0 },
    "87": { 'char': "W", 'width': 26.667, xoffset: 0 },
    "88": { 'char': "X", 'width': 21.333, xoffset: 0 },
    "89": { 'char': "Y", 'width': 21.333, xoffset: 0 },
    "90": { 'char': "Z", 'width': 18.667, xoffset: 0 },
    "91": { 'char': "[", 'width': 8.667, xoffset: 1 },
    "92": { 'char': "\\", 'width': 13.333, xoffset: 0 },
    "93": { 'char': "]", 'width': 8.667, xoffset: 1 },
    "94": { 'char': "^", 'width': 13.333, xoffset: 0 },
    "95": { 'char': "_", 'width': 13.333, xoffset: 0 },
    "96": { 'char': "`", 'width': 10.667, xoffset: 0 },

    "97": { 'char': 'a', 'width': 18.667, xoffset: 0 },
    "98": { 'char': 'b', 'width': 18.667, xoffset: 0 },
    "99": { 'char': 'c', 'width': 18.667, xoffset: 0 },
    "100": { 'char': 'd', 'width': 18.667, xoffset: 0 },
    "101": { 'char': 'e', 'width': 16, xoffset: 0 },
    "102": { 'char': 'f', 'width': 10.667, xoffset: 1 },
    "103": { 'char': 'g', 'width': 18.667, xoffset: 0 },
    "104": { 'char': 'h', 'width': 18.667, xoffset: 0 },
    "105": { 'char': 'i', 'width': 8, xoffset: 0 },
    "106": { 'char': 'j', 'width': 8, xoffset: 0 },
    "107": { 'char': 'k', 'width': 16, xoffset: 0 },
    "108": { 'char': 'l', 'width': 8, xoffset: 0 },
    "109": { 'char': 'm', 'width': 26.667, xoffset: 0 },
    "110": { 'char': 'n', 'width': 18.667, xoffset: 0 },
    "111": { 'char': 'o', 'width': 18.667, xoffset: 0 },
    "112": { 'char': 'p', 'width': 18.667, xoffset: 0 },
    "113": { 'char': 'q', 'width': 18.667, xoffset: 0 },
    "114": { 'char': 'r', 'width': 10.667, xoffset: 0 },
    "115": { 'char': 's', 'width': 16, xoffset: 0 },
    "116": { 'char': 't', 'width': 10.667, xoffset: 0 },
    "117": { 'char': 'u', 'width': 18.667, xoffset: 0 },
    "118": { 'char': 'v', 'width': 16, xoffset: 0 },
    "119": { 'char': 'w', 'width': 24, xoffset: 0 },
    "120": { 'char': 'x', 'width': 16, xoffset: 0 },
    "121": { 'char': 'y', 'width': 16, xoffset: 0 },
    "122": { 'char': 'z', 'width': 16, xoffset: 0 },
    "123": { 'char': '{', 'width': 10.667, xoffset: 0 },
    "124": { 'char': '|', 'width': 8, xoffset: 0 },
    "125": { 'char': '}', 'width': 10.667, xoffset: 0 },
    "126": { 'char': '~', 'width': 21.333, xoffset: 0 },
}

function caculateStringWidth_(str: string, fontSize: number) {
    let length = 0
    for (let i = 0; i < str.length; ++i) {
        let unicode = str.charCodeAt(i)
        if (unicode < 127) {
            if (FontDefinition[unicode] != undefined) {
                length += (FontDefinition[unicode].width + FontDefinition[unicode].xoffset) * fontSize / FontDefinition.originSize
            }
        } else {
            length += 32 * fontSize / FontDefinition.originSize
        }
    }
    return length
}

export interface RichTextElementParams {
    text: string
    color?: mw.LinearColor
    inParam?: any
    clickCb?: (param: any) => void
}

class TextElement {
    width: number
    private _fontSize: number
    private _parent: mw.Canvas
    private _params: RichTextElementParams
    private _text: mw.TextBlock
    private _touchBtn: mw.Button

    constructor(parent: mw.Canvas, params: RichTextElementParams, fontSize: number) {
        this._parent = parent
        this._params = params
        this._fontSize = fontSize

        this.width = caculateStringWidth_(this._params.text, fontSize)
    }

    public render() {
        this._text = mw.TextBlock.newObject(this._parent)
        this._text.fontSize = this._fontSize
        this._text.text = this._params.text
        this._text.size = new mw.Vector2(2000, 50)
        this._text.textHorizontalLayout = mw.UITextHorizontalLayout.NoClipping
        this._text.textAlign = mw.TextJustify.Left
        this._text.textVerticalAlign = mw.TextVerticalJustify.Top
        if (this._params.color) {
            this._text.fontColor = this._params.color
        }
        if (this._params.clickCb) {
            this._touchBtn = mw.Button.newObject(this._parent)
            this._touchBtn.size = new mw.Vector2(this.width, this._text.textHeight)
            this._touchBtn.renderOpacity = 0
            this._touchBtn.onClicked.add(() => {
                this._params.clickCb(this._params.inParam)
            })
        }
    }

    public setPosition(pos: mw.Vector2) {
        this._text.position = pos.clone()
        if (this._touchBtn) {
            this._touchBtn.position = pos.clone()
        }
    }

    public enabledClicked() { return this._params.clickCb }
    public getString() { return this._params.text }
    public getFontSize() { return this._fontSize }

    public split(firstWidth: number) {
        let text1 = ''
        let text2 = ''
        let length = 0
        for (let i = 0; i < this._params.text.length; i++) {
            let unicode = this._params.text.charCodeAt(i)
            if (unicode < 127) {
                if (FontDefinition[unicode] != undefined) {
                    length += FontDefinition[unicode].width * this._fontSize / FontDefinition.originSize
                }
            } else {
                length += 32 * this._fontSize / FontDefinition.originSize
            }
            if (length < firstWidth) {
                text1 = text1 + this._params.text[i]
            } else {
                text2 = text2 + this._params.text[i]
            }
        }
        let ret = [new TextElement(this._parent, { text: text1, color: this._params.color, inParam: this._params.inParam }, this._fontSize)]
        if (text2.length > 0) {
            ret.push(new TextElement(this._parent, { text: text2, color: this._params.color, inParam: this._params.inParam }, this._fontSize))
        }
        return ret
    }
    public canSplit() { return !this._params.clickCb }
    public setFontSize(size: number) { this._text.fontSize = size }
    public getText() { return this._text }
    public getParams() { return this._params }
}

class ElementLine {
    private _width: number = 0
    private _elements: TextElement[] = []

    public pushbackElement(element: TextElement) {
        this._width += caculateStringWidth_(element.getString(), element.getFontSize()) + 2
        this._elements.push(element)
    }

    public getWidth() {
        return this._width
    }

    public setPosition(pos: mw.Vector2) {
        let newPos = pos.clone()
        for (let i = 0; i < this._elements.length; i++) {
            const element = this._elements[i];
            element.setPosition(newPos.clone())
            newPos.x += element.width
        }
    }

    public render() {
        for (let i = 0; i < this._elements.length; i++) {
            const element = this._elements[i];
            element.render()
        }
    }
    public getElements() { return this._elements }
}

/**
 * 富文本类
 */
export class RichText {
    private _root: mw.Canvas
    private _width: number
    private _originElements: TextElement[] = []
    private _lineElements: ElementLine[] = []
    private _fontSize: number
    private _lineHeight: number
    private _contentBg: mw.Image

    /**
     * 构造函数
     * @param parent 父节点 
     * @param width 富文本宽度，高度会根据文本长度自动计算
     * @param fontSize 文字的尺寸
     */
    constructor(parent: mw.Canvas, width: number, fontSize: number) {
        this._root = mw.Canvas.newObject(parent)
        this._contentBg = mw.Image.newObject(this._root)
        this._contentBg.position = mw.Vector2.zero

        this._root.position = mw.Vector2.zero
        this._width = width
        this._fontSize = fontSize

        let tempText = mw.TextBlock.newObject(parent)
        tempText.fontSize = fontSize
        this._lineHeight = tempText.textHeight
        tempText.destroyObject()
    }

    /**
     * 设置背景颜色
     * @param color 
     */
    public setBackgroundColor(color: { x: number, y: number, z: number, a?: number }) {
        if (color.a == undefined) {
            color.a = 1
        }
        this._contentBg.imageColor = new mw.LinearColor(color.x, color.y, color.z, color.a)
        this._contentBg.renderOpacity = color.a
    }

    /**
     * 添加文本元素
     * @param params 
     * @returns 
     */
    public pushbackElement(params: RichTextElementParams) {
        if (!params.text) { return }
        let element = new TextElement(this._root, params, this._fontSize)
        this._originElements.push(element)
    }

    /**
     * 渲染文本内容
     */
    public render() {
        let line = this.createLine()
        for (let i = 0; i < this._originElements.length; i++) {
            let element = this._originElements[i]
            if (line.getWidth() + element.width > this._width) {
                if (element.canSplit()) {
                    let inElements: TextElement[] = []
                    this.splitElement(element, inElements, this._width - line.getWidth())
                    for (let i = 0; i < inElements.length; i++) {
                        const element = inElements[i];
                        line.pushbackElement(element)
                        if (i < inElements.length - 1) {
                            line = this.createLine()
                        }
                    }
                } else {
                    line = this.createLine()
                    line.pushbackElement(element)
                }
            } else {
                line.pushbackElement(element)
            }
        }
        for (let i = 0; i < this._lineElements.length; i++) {
            const line = this._lineElements[i];
            line.render()
            line.setPosition(new mw.Vector2(0, this._lineHeight * i))
        }
        this._contentBg.size = this.getSize()
    }

    public getSize() {
        return new mw.Vector2(this._width, this._lineElements.length * this._lineHeight)
    }

    public getAllElements() {
        let elements: TextElement[] = []
        for (const line of this._lineElements) {
            elements.push(...line.getElements())
        }
        return elements
    }

    private createLine() {
        let line = new ElementLine()
        this._lineElements.push(line)
        return line
    }

    private splitElement(element: TextElement, outElements: TextElement[], firstWidth: number) {
        if (!element) {
            return
        }

        if (element.width < firstWidth) {
            outElements.push(element)
            return
        }

        let newElements = element.split(firstWidth)
        outElements.push(newElements[0])
        this.splitElement(newElements[1], outElements, this._width)
    }

    /**
     * 计算文本长度
     * @param str 
     * @param fontSize 
     * @returns 
     */
    static caculateStringWidth(str: string, fontSize: number) {
        return caculateStringWidth_(str, fontSize)
    }
}