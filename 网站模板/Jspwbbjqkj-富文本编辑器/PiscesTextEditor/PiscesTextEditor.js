//---------------------------------------------------------
// 双鱼文本编辑器 PiscesTextEditor V1.0
// 作者：月伤 melody
// 作品链接：http://www.2fstory.net/blog/View.aspx?blogID=47
//---------------------------------------------------------

var tabKey = 9;		// Tab键
var enterKey = 13;	// Enter键

var editor = TextEdit_Editor;		// 编辑器
var htmlbox = TextEdit;				// html代码框
var previewbox = TextEdit_Preview;	// 预览框
var toolbar = TextEdit_Toolbar;		// 工具条
var screenmode = ScreenMode;		// 全屏模式图片

TextEdit_Initialize(editor,htmlbox); 
TextEdit_ApplyEditorStyles(editor);
TextEdit_Preview.document.designMode = "Off";
TextEdit_Preview.document.open();
TextEdit_Preview.document.close();
TextEdit_ApplyEditorStyles(previewbox);

<!-- 初始化 -->
var TextEdit_HtmlMode = "design";	// 编辑模式

// 初始式
function TextEdit_Initialize() {
	editor.document.designMode = "On";
	editor.document.open();
	editor.document.write(htmlbox.value);
	editor.document.close();
	editor.document.body.contentEditable = "True";
	editor.document.onkeydown = TextEdit_Editor_onKeyDown;
	htmlbox.onkeydown = function() { ChangeMode_onKeyDown(window,"preview"); };
	htmlbox.onkeypress = function() { GetWordCount(); };
	previewbox.onkeydown = function() { ChangeMode_onKeyDown(previewbox,"design"); };
	ExecCmd("2D-Position",true);
}
// 设置iframe控件中的body样式
function TextEdit_ApplyEditorStyles(iframe) {
	iframe.document.createStyleSheet("");
	iframe.document.styleSheets[0].addRule("p","margin-top:0px;margin-bottom:0px;");
	bs = iframe.document.body.style;
	bs.margin="5";
	bs.scrollbar3dLightColor= "#D4D0C8";
	bs.scrollbarArrowColor= "#000000";
	bs.scrollbarBaseColor= "#D4D0C8";
	bs.scrollbarDarkShadowColor= "#D4D0C8";
	bs.scrollbarFaceColor= "#D4D0C8";
	bs.scrollbarHighlightColor= "#808080";
	bs.scrollbarShadowColor= "#808080";
	bs.scrollbarTrackColor= "#D4D0C8";
	bs.border="0";
}
// 同时按下tab+ctrl切换视图模式
function ChangeMode_onKeyDown(win,mode){
	if (win.event.keyCode == tabKey && win.event.ctrlKey) {
		win.event.returnValue = false;
		TextEdit_ChangeMode(mode);
		win.focus();
	}
}
// 编辑窗口的按下事件
function TextEdit_Editor_onKeyDown() {
	var _QUOTE = 222;
	var _OPENCURLY = "&#8220;";
	var _CLOSECURLY = "&#8221;";
	// 切换模式 (Ctrl+TAB)
	if (editor.event.keyCode==tabKey && !editor.event.ctrlKey) {
		editor.event.returnValue = false;
		editor.document.selection.createRange().pasteHTML("&nbsp;&nbsp;&nbsp;&nbsp;");
	}
	ChangeMode_onKeyDown(editor,"html")
	if (editor.event.keyCode == _QUOTE && editor.event.shiftKey) {
		var sel = editor.document.selection;
		if (sel.type == "Control") return;
		var r = sel.createRange();
		var before = CharBefore(r);
		var after = CharAfter(r);
		var r = sel.createRange();

		if (before == "start") {
			r.pasteHTML(_OPENCURLY);
			editor.event.cancelBubble = true;
			editor.event.returnValue = false;
			return false;
		} else if (before != " " && after == "end") {
			r.pasteHTML(_CLOSECURLY);
			editor.event.cancelBubble = true;
			editor.event.returnValue = false;
			return false;
		} else if (before == " " && after == "end") {
			r.pasteHTML(_OPENCURLY);
			editor.event.cancelBubble = true;
			editor.event.returnValue = false;
			return false;
		} else if (before != " " && after == " ") {
			r.pasteHTML(_CLOSECURLY);
			editor.event.cancelBubble = true;
			editor.event.returnValue = false;
			return false;
		} else {
			r.pasteHTML(_OPENCURLY);
			editor.event.cancelBubble = true;
			editor.event.returnValue = false;
			return false;
		}
	}
}
// 切换编辑模式
function TextEdit_ChangeMode(mode) {
	document.getElementsByName(editor.name)[0].style.display = (mode == "design") ? "block" : "none";
	htmlbox.style.display = (mode == "html") ? "block" : "none";
	document.getElementsByName(previewbox.name)[0].style.display = (mode == "preview") ? "block" : "none";
	toolbar.style.display = (mode == "design") ? "inline" : "none";
	if (TextEdit_HtmlMode != mode) {
		switch (mode) {
			case "design":	// 转到设计模式
				editor.focus();
				editor.document.body.innerHTML = htmlbox.value;
				SetActiveTab(document.getElementById("TextEdit_DesignModeTab"));
				break;
			case "html":	// 转到代码模式
				htmlbox.focus();
				SetActiveTab(document.getElementById("TextEdit_HtmlModeTab"));
				CopyToHtmlBox();
				break;
			case "preview":	// 转到预览模式
				previewbox.focus();
				previewbox.document.body.innerHTML = htmlbox.value;
				SetActiveTab(document.getElementById("TextEdit_PreviewModeTab"));
				break;
		}
		TextEdit_HtmlMode = mode;
	}
}
// 将Html代码复制到代码框中
function CopyToHtmlBox() {
	htmlbox.value = editor.document.body.innerHTML.replace(/<p>&nbsp;<\/p>/gi,"");
	htmlbox.value = htmlbox.value.replace(/<\/p>\s*<p>/gi,"<BR>");
	htmlbox.value = htmlbox.value.replace(/<\/?p.*?>/gi,""); 
	GetWordCount();
}

<!-- 工具栏 -->
// 保存
function Save() {
	CopyToHtmlBox();
	ExecCmd("SaveAs",false,"C:\\code.htm");
}
// 全屏编辑
function FullScreen() {
	if (screenmode.alt == "全屏模式") {
		EditDiv.style.position = "absolute";
		EditDiv.style.zindex = "100";
		EditDiv.style.left = "0";
		EditDiv.style.top = "0";
		EditTable.width = document.body.scrollWidth;
		if (document.body.scrollHeight < screen.height) {
			EditTable.height = screen.height-160;
		}
		else {
			EditTable.height = document.body.scrollHeight;
		}
		screenmode.alt = "正常模式";
		screenmode.src = "PiscesTextEditor/images/normalscreen.gif";
		location.href = "#top";
	}
	else {
		EditDiv.style.position = "relative";
		EditDiv.style.zindex = "0";
		EditDiv.style.left = "0";
		EditDiv.style.top = "0";
		EditTable.width = "100%";
		EditTable.height = "100%";
		screenmode.alt = "全屏模式";
		screenmode.src = "PiscesTextEditor/images/fullscreen.gif";
	}
}
// 设置段落
function SetParagraph(controlName,value,text) {
	editor.focus();
	ExecCmd("formatBlock",value);
	document.getElementById(controlName).style.display='none';
	document.getElementById('currentParagraph').innerHTML = text;
}
// 设置字体
function SetFontName(controlName,name) {
	editor.focus();
	ExecCmd('fontname',name);
	document.getElementById(controlName).style.display='none';
	document.getElementById('currentfontname').innerHTML = name;
}
// 设置字号
function SetFontSize(controlName,size) {
	editor.focus();
	ExecCmd('fontsize',size);
	document.getElementById(controlName).style.display='none';
	document.getElementById('currentfontsize').innerHTML = size;
}
// 调用document.execCommand命令
function ExecCmd(param,value) {
	editor.focus();
	editor.document.execCommand(param,"",value); 
}
// 前景色
function ForeColor(color) {
	var range = editor.document.selection.createRange();
	range.pasteHTML("<span style=\"color:"+color+";\">"+range.text+"</span>");
}
// 设置前景色
var isAutoForeColor = true;
function SetForeColor(color) {
	var colorsArray = new Array(
				"#000000","#993300","#333300","#003300","#003366","#000080","#333399","#333333",
				"#800000","#FF6600","#808000","#008000","#008080","#0000FF","#666699","#808080",
				"#FF0000","#FF9900","#99CC00","#339966","#33CCCC","#3366FF","#800080","#999999",
				"#FF00FF","#FFCC00","#FFFF00","#00FF00","#00FFFF","#00CCFF","#993366","#C0C0C0",
				"#FF99CC","#FFCC99","#FFFF99","#CCFFCC","#CCFFFF","#99CCFF","#CC99FF","#FFFFFF");
	var edgeColor = "#AAAAAA";
	var autoStyle = (isAutoForeColor) ? 'TextEdit_ButtonDown' : 'TextEdit_ButtonNormal';

	var str = "";
	str += "<table cellpadding='0' cellspacing='0' style='display:inline;border-top: 1px solid "+edgeColor+";"+
			"border-left: 1px solid "+edgeColor+";border-right: 1px solid "+edgeColor+";border-bottom:0px;'>"+
			"<tr><td width='29' height='20'></td></tr></table>"+
			"<table width='121' cellpadding='0' cellspacing='0' border='0' style='display:inline;' bgcolor='#0f0f0f'>"+
			"<tr><td height='1' bgcolor='"+edgeColor+"'></td></tr></table>"+
			"<table cellpadding='0' cellspacing='0' height='122' border='0' style='display:block;'>"+
			"<tr><td height='122' style='border-left: 1px solid "+edgeColor+";"+
			"border-right: 1px solid "+edgeColor+"; border-bottom: 1px solid "+edgeColor+"'>"+
			"<table cellpadding='0' cellspacing='3' style='background-color:#FFFFFF;'>"+
			"<tr><td width='100%' height='7'><img src='PiscesTextEditor/images/colorpickettitle.gif' border='0' /></td></tr><tr>"+
			"<td height='22' class='"+autoStyle+"' onmouseover='ButtonOver(this);'"+
			" onmouseout='ButtonOut(this);' onmousedown='SetColor(\"#000000\",\"ForeColor\",\"forecolor\",\"forecolorpicket\");'>"+
			"<table cellpadding='0' cellspacing='0' width='100%' style='font-size:9pt;'><tr><td width='18' align='right'>"+
			"<table cellpadding='0' border='1' cellspacing='0' bgcolor='#000000'"+
			" bordercolor='"+edgeColor+"' width='11' height='11'><tr><td></td></tr></table>"+
			"</td><td height='16' style='padding-left:42px;'>自动</td></tr></table></td></tr>"+
			"<tr><td align='center'>" +
			"<table cellspacing='0' border='1' bordercolor='#FFFFFF' noWrap>"
	for (var i=0;i<5;i++) {
		str += "<tr>";
		for (var j=0;j<8;j++) {
			str += "<td width='13' height='13' style='padding: 1px;' align='center'";
			if (color == colorsArray[8*i+j])
				str += " class='TextEdit_ButtonDown'";
			str += " onmouseover='ButtonOver(this);' onmouseout='ButtonOut(this);' "+
					" onmousedown='SetColor(\""+colorsArray[8*i+j]+"\",\"ForeColor\",\"forecolor\",\"forecolorpicket\");'>"+
					"<table cellpadding='0' cellspacing='0' border='1' width='12' height='12' bordercolor='#CCCCCC'"+
					" style='background-color:"+colorsArray[8*i+j]+"'>"+
					"<tr><td></td></tr></table></td>";
		}
		str += "</tr>";
	}
	str += "</table></td></tr>"+
//			"<tr><td height='22' align='center' class='TextEdit_ButtonNormal'"+
//			" onmouseover='ButtonOver(this);' onmouseout='ButtonOut(this);'>"+
//			"<table cellpadding='0' cellspacing='0' width='100%' border='0' style='font-size:9pt;'>"+
//			"<tr><td align='center'>其它颜色...</td></tr></table></td></tr>"+
			"</table></td></tr></table>";
	var control = document.getElementById('forecolorpicket');
	control.style.display = 'block';
	control.innerHTML = str;
}
function SetColor(color,colorshow,colortype,colorpicket) {
	isAutoForeColor = false;
	isAutoBackColor = false;
	editor.document.execCommand(colortype,false,color);
	document.getElementById(colorshow).style.backgroundColor=color;
	document.getElementById(colorpicket).innerHTML = '';
	editor.focus();
}
// 背景色
var isAutoBackColor = false;
function BackColor(color) {
	var range = editor.document.selection.createRange();
	range.pasteHTML("<span style=\"background-color:"+color+";\">"+range.text+"</span>");
}
// 设置背景色
function SetBackColor(color) {
	var colorsArray = new Array(
			"#ffff00","#00ff00","#00ffff","#ff00ff","#0000ff",
			"#ff0000","#000080","#008080","#008000","#800080",
			"#800000","#808000","#808080","#c0c0c0","#000000");
	var edgeColor = "#AAAAAA";
	var autoStyle = (isAutoBackColor) ? 'TextEdit_ButtonDown' : 'TextEdit_ButtonNormal';
	
	var str = "";
	str += "<table cellpadding='0' cellspacing='0' style='display:inline;border-top: 1px solid "+edgeColor+";"+
			"border-left: 1px solid "+edgeColor+";border-right: 1px solid "+edgeColor+";border-bottom:0px;'>"+
			"<tr><td width='29' height='20'></td></tr></table>"+
			"<table width='64' cellpadding='0' cellspacing='0' border='0' style='display:inline;' bgcolor='#0f0f0f'>"+
			"<tr><td height='1' bgcolor='"+edgeColor+"'></td></tr></table>"+
			"<table cellpadding='0' cellspacing='0' height='62' border='0' style='display:block;'>"+
			"<tr><td height='62' style='border-left: 1px solid "+edgeColor+";"+
			"border-right: 1px solid "+edgeColor+"; border-bottom: 1px solid "+edgeColor+"'>"+
			"<table cellpadding='0' cellspacing='3' style='background-color:#FFFFFF;'>"+
			"<tr><td height='22' class='"+autoStyle+"' align='center' onmouseover='ButtonOver(this);'"+
			" onmouseout='ButtonOut(this);'"+
			" onmousedown='SetColor(\"#FFFFFF\",\"BackColor\",\"backcolor\",\"backcolorpicket\");isAutoBackColor=true;'>"+
			"无</td></tr>"+
			"<tr><td align='center'>";	str += "<table cellspacing='0' border='1' bordercolor='#FFFFFF' noWrap>"
	for (var i=0;i<3;i++) {
		str += "<tr>";
		for (var j=0;j<5;j++) {
			str += "<td width='13' height='13' style='padding: 1px;' align='center'";
			if (color == colorsArray[5*i+j])
				str += " class='TextEdit_ButtonDown'";
			str += " onmouseover='ButtonOver(this);' onmouseout='ButtonOut(this);' "+
					" onmousedown='SetColor(\""+colorsArray[5*i+j]+"\",\"BackColor\",\"backcolor\",\"backcolorpicket\");'>"+
					"<table cellpadding='0' cellspacing='0' border='1' width='12' height='12' bordercolor='#CCCCCC'"+
					" style='background-color:"+colorsArray[5*i+j]+"'>"+
					"<tr><td></td></tr></table></td>";
		}
		str += "</tr>";
	}
	str += "</table></td></tr></table></td></tr></table>";
	var control = document.getElementById('backcolorpicket');
	control.style.display = "block";
	control.innerHTML = str;
}
// 设置对齐方式
function SetAlign(theTD,param,value) {
	editor.focus();
	if (oldClass == 'TextEdit_ButtonNormal')	
		ExecCmd(param,value);
	else
		ExecCmd('justifyleft',null);
}
// 插入符号
function InsertSymbol(name) {
	editor.focus();
	var page = "PiscesTextEditor/specialchar.htm";
	var str = showModalDialog(page,window,"dialogWidth:360px;dialogHeight:280px;status:0;scroll:0;help:0;");
	var range = editor.document.selection.createRange();
	if (str!=null) range.pasteHTML(str);
}
// 插入表情
function InsertEmot(){
	editor.focus();
	var page = "PiscesTextEditor/emot.htm";
	var str = showModalDialog(page,window,"dialogWidth:286px;dialogHeight:202px;status:0;scroll:0;help:0;");
	var range = editor.document.selection.createRange();
	if (str!=null) range.pasteHTML(str);
	editor.focus();
}
// 查找替换
function Replace() {
	editor.focus();
	var page = "PiscesTextEditor/replace.htm";
	showModalDialog(page,window,"dialogWidth:285px;dialogHeight:182px;status:0;scroll:0;help:0;");
}
// 转换为大写字母
function UpperCase() {
	editor.focus();
	var range = editor.document.selection.createRange();
	range.pasteHTML(range.htmlText.toUpperCase());
}
// 转换为小写字母
function LowerCase() {
	editor.focus();
	var range = editor.document.selection.createRange();
	range.pasteHTML(range.htmlText.toLowerCase());
}
// 设置绝对位置
var isAbsolutePosition = false;
function SetAbsolutePosition() {
	editor.focus();
	isAbsolutePosition = !isAbsolutePosition;
	ExecCmd("AbsolutePosition",isAbsolutePosition)
}
// 建立超链接
function CreateLink() {
	editor.focus();
	editor.document.execCommand("createlink","true",null);
}
// 取消超链接
function UnLink() {
	editor.focus();
	editor.document.execCommand("unlink","true",null); 
}
// 插入图片
function InsertPicture() {
	editor.focus();
	var str = showModalDialog("PiscesTextEditor/image.htm", "", "dialogWidth:438px;dialogHeight:424px;scroll:no;status:0;help:0");
	var range = editor.document.selection.createRange();
	if (str != null) range.pasteHTML(str);
}
// 插入今天日期
function InsertToday() {
	editor.focus();
	var now = new Date();
	var range = editor.document.selection.createRange();
	range.pasteHTML(now.getYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日");
}
// 插入现在时间
function InsertTime() {
	editor.focus();
	var now = new Date();
	var hour = now.getHours().toString();
	hour = (hour.length==1)?("0"+hour):hour;
	var minute = now.getMinutes().toString();
	minute = (minute.length==1)?("0"+minute):minute;
	var second = now.getSeconds().toString();
	second = (second.length==1)?("0"+second):second;
	var range = editor.document.selection.createRange();
	range.pasteHTML(hour+":"+minute+":"+second);
}
// 拼写检查
function IeSpellCheck() {
	try {
		var tspell = new ActiveXObject("ieSpell.ieSpellExtension");
		tspell.CheckAllLinkedDocuments(window.document);
	}
	catch (err){
		if (window.confirm("你确定要安装IE的拼写检查吗？")){
			window.open("http://www.iespell.com/download.php");}
	};
}
// 插入表格
function InsertTable() {
	editor.focus();
	var range = editor.document.selection.createRange();
	var str = showModalDialog("PiscesTextEditor/table.htm", "", "dialogWidth:400px;dialogHeight:350px;scroll:no;status:no;help:no");
	if (str != null) range.pasteHTML(str);
}
// 插入层
function InsertLayer() {
	editor.focus();
	var range = editor.document.selection.createRange();
	var str = "<div style='WIDTH: 104px; POSITION: absolute; HEIGHT: 104px'>在这里输入文字</div>";
	range.pasteHTML(str);
}
// 插入栏目框
function InsertFieldset() {
	editor.focus();
	var str = showModalDialog("PiscesTextEditor/fieldset.htm", "", "dialogWidth:350px;dialogHeight:210px;scroll:no;status:no;help:no;");
	var range = editor.document.selection.createRange();
	if (str != null) range.pasteHTML(str);
}
// 插入网页
function InsertIframe() {
	editor.focus();
	var str = showModalDialog("PiscesTextEditor/iframe.htm", "", "dialogWidth:350px;dialogHeight:245px;scroll:no;status:no;help:no;");  
	var range = editor.document.selection.createRange();
	if (str != null) range.pasteHTML(str);
}
// 插入Flash
function InsertFlash() {
	editor.focus();
	var range = editor.document.selection.createRange();
	var str = showModalDialog("PiscesTextEditor/flash.htm", "", "dialogWidth:320px;dialogHeight:190px;scroll:no;status:no;help:no;"); 
	if (str != null) range.pasteHTML(str);
}
// 插入mediaplayer
function InsertMediaPlayer() {
	editor.focus();
	var str = showModalDialog("PiscesTextEditor/media.htm", "", "dialogWidth:320px; dialogHeight:190px; scroll:no;status:no;help:no;");
	var range = editor.document.selection.createRange();
	if (str != null) range.pasteHTML(str);
}
// 插入realplayer
function InsertRealPlayer() {
	editor.focus();
	var str = showModalDialog("PiscesTextEditor/rm.htm", "", "dialogWidth:320px; dialogHeight:190px; scroll:no;status:0;help:0");  
	var range = editor.document.selection.createRange();
	if (str != null) range.pasteHTML(str);
}
// 插入代码
function InsertCode() {
	editor.focus();
	var str = showModalDialog("PiscesTextEditor/InsertCode.htm",window,"dialogWidth:510px;dialogHeight:400px;status:0;scroll:0;help:0;");
	var range = editor.document.selection.createRange();
	if (str!=null) range.pasteHTML(str);
}
// 帮助
function Help() {
	window.showModalDialog("PiscesTextEditor/help.htm","","dialogWidth:400px;dialogHeight:260px;scroll:no;status:no;help:no");
}

<!-- 工具栏风格 -->
var oldClass = 'TextEdit_ButtonNomal';
function ButtonOver(theTD) {
	oldClass = theTD.className;
	theTD.className = "TextEdit_ButtonOver";
}
function ButtonOut(theTD) {
	document.body.style.cursor = "default";
	theTD.className = oldClass;
}
function ButtonDown(theTD) {
	document.body.style.cursor = "default";
	theTD.className = "TextEdit_ButtonDown";
}
function ButtonSelect(theTD) {
	oldClass = (oldClass == "TextEdit_ButtonDown") ? "TextEdit_ButtonNormal" : "TextEdit_ButtonDown";
	document.body.style.cursor = "default";
	theTD.className = "TextEdit_ButtonDown";
}

<!-- 显示模式菜单 -->
function SetActiveTab(theTD) {
	var parentTR = theTD.parentElement;
	for (var i=0;i<5;i++) {
		if (parentTR.cells[i].className == "TextEdit_TabOn")
			parentTR.cells[i].className = "TextEdit_TabOff";
	}
	theTD.className = "TextEdit_TabOn";
}
function TabOver() { document.body.style.cursor="hand"; }
function TabOut() { document.body.style.cursor="auto"; }
function CheckTag(item,tagName) {
	if (item.tagName.search(tagName)!=-1) {
		return item;
	}
	if (item.tagName=="BODY") {
		return false;
	}
	item=item.parentElement;
	return CheckTag(item,tagName);
}
function CharBefore(sel) {
	if (sel.move("character",-1) == -1) {
		sel.expand("character");
		return sel.text;
	} else {
		return "start";
	}
}
function CharAfter(sel) {
	var sel2 = sel;
	if (sel.expand("character")) {
		sel2.move("character",1);
		sel2.expand("character");
		return sel2.text;
	} else {
		return "end";
	}
}

<!--公共函数-->
// 统计文本框中的总字数
function GetWordCount() {
	totalchars.innerHTML = htmlbox.value.toString().length;
}
function GetClassSubName(className) {
	underscore = className.indexOf("_");
	if (underscore < 0) return className;
	return className.substring(underscore+1);
}