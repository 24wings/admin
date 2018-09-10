declare var editormd: EditorMd;


declare class EditorClass {
    /**
     * 设置主题
     * @param theme 
     * 
     */
    setTheme(theme: string)
    /**
     * 跳转指定行号
     * @param num 
     */
    gotoLine(num: number);

    /**
     * 显示
     */
    show()

    /**隐藏 */
    hide();


    /**
     * 获取markdown内容
     */
    getMarkdown()

    /**
     * 获取html内容
     */
    getHTML()

    /**
     * 同时比编辑预览
     */
    watch();

    /**
     * 编辑模式
     */
    unwatch();

    /**完全预览模式 */
    previewing();

    /**
     * 全屏模式
     */
    fullscreen();

    /**
     * 显示工具条
     */
    showToolbar();

    /**
     * 隐藏工具条
     */
    hideToolbar();

    config(options: { tocDropdown: boolean, tocTitle: string });
    config(prop: "tocDropdown", boolean);





    constructor(querySelector: string, config: EditorConfig)
}


interface EditorConfig {

    width?: number | string,
    height?: number | string,
    /**
     * '/assets/lib/'
     */
    path?: string,
    /**
     * "dark"
     */
    theme?: string,
    /**
     * "dark"
     */
    previewTheme?: string,
    /**
     * "pastel-on-dark"
     */
    editorTheme?: string,
    /**
     * 'default'
     */
    editormdTheme?: string,
    markdown?: string,
    codeFold?: boolean,
    //syncScrolling : false,
    saveHTMLToTextarea?: boolean,    // 保存 HTML 到 Textarea
    searchReplace?: boolean,
    //watch : false,                // 关闭实时预览
    /**"style,script,iframe|on*",      开启 HTML 标签解析，为了安全性，默认不开启    */
    htmlDecode?: string,
    toolbar?: boolean,             //关闭工具栏
    //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
    emoji?: boolean,
    taskList?: boolean,
    tocm?: boolean,         // Using [TOCM]
    tex?: boolean,                   // 开启科学公式TeX语言支持，默认关闭
    flowChart?: boolean,             // 开启流程图支持，默认关闭
    sequenceDiagram?: boolean,       // 开启时序/序列图支持，默认关闭,
    //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
    //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
    //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
    //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
    //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
    imageUpload?: boolean,
    //["jpg", "jpeg", "gif", "png", "bmp", "webp"]
    imageFormats?: string[],
    /**
     * "./php/upload.php"
     */
    imageUploadURL?: string,
    /**
     * 
       function () {
      console.log('onload', this);
      //this.fullscreen();
      //this.unwatch();
      //this.watch().fullscreen();

      //this.setMarkdown("#PHP");
      //this.width("100%");
      //this.height(480);
      //this.resize("100%", 640);
    }
    */
    onload?: Function;



}


declare type EditorMd = (selector: string, config: EditorConfig) => EditorClass;
