//---------------------------------------------------------
// 双鱼文本编辑器 PiscesTextEditor V1.0
// 作者：月伤 melody
// 作品链接：http://www.2fstory.net/blog/View.aspx?blogID=47
//---------------------------------------------------------

var CodeDivBgColor = "#eeeeee";
var CodeDivFontColor = "#000000";

function code()
{
	var str = CodeText.innerHTML;
	var language = LanguageDropDownList.value;
	var showLine = chkLineNumberMarginVisible.checked;
	var canCollapse = chkOutliningEnabled.checked;
	var canAllCollapse = ckbIsCollapse.checked;
	var allRegion = txbCollapseText.value;
	window.returnValue = FormateCode(str,language,showLine,canCollapse,canAllCollapse,allRegion);
	window.close();
}

// 转化为代码格式(代码，语言，是否有行号，是否折叠，是否全部折叠，整个代码的标题)
function FormateCode(str,language,showLine,canCollapse,canAllCollapse,allRegion)
{
	var CodeDivStyle = "color: "+CodeDivFontColor+";BACKGROUND-COLOR: "+CodeDivBgColor+";font-family: Verdana,宋体;width: 98%;line-height:16px;BORDER: #cccccc 1px solid;PADDING: 4px;FONT-SIZE: 10pt;WORD-BREAK: break-all;";
	if (language != "CSS") {
	    // 将双引号替换成&quot;
	    str = str.replace(/([^\\])"/g,"$1&quot;");
	}
	switch (language)
	{
		case "C#": str = FormatCSharp(str,canCollapse); break;
		case "HTML": str = FormatHTML(str,canCollapse); break;
		case "VBScript": str = FormatVBScript(str,canCollapse); break;
		case "JScript": str = FormatJScript(str,canCollapse); break;
		case "CSS": str = FormatCSS(str,canCollapse); break;
		case "XML": str = FormatXML(str,canCollapse); break;
		case "SQL": str = FormatSQL(str,canCollapse); break;
	}
	if (showLine) str = AddLineNumber(str);
	// 替换换行符为<BR>
	str = str.replace(/\n/g,"<BR>");
	// 替换1个Tab为4个空格，使界面美观一些
	str = str.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
	if (canAllCollapse) str = GetHeader(" ",allRegion,"Code",canAllCollapse,true)+"<BR>"+str+"</span>";
	// 给代码加一个边框
	str = "<div style=\""+CodeDivStyle+"\">" + str + "</div>";
	return(str);
}

//---------------------------------------   格式化C#代码   ----------------------------------------
// 格式化C#代码
function FormatCSharp(str,canCollapse)
{	
	if (str.match(/using/g)!=null)
		str = FormatUsing(str,canCollapse);
	str = FormatRegion(str,canCollapse);
	str = FormatBrace(str); 
	str = FormatFunctionRemark(str);
	// 给所有没有收缩功能的行的行头加图片
	str = str.replace(/(^|\n)([^<])/g,"$1<IMG src=\"PiscesTextEditor/codeimages/InBlock.gif\" align=\"top\">$2");
	// 所有关键字变成蓝色
	var re = /\b(abstract|event|new|struct|as|explicit|null|switch|base|extern|object|this|bool|false|operator|throw|break|finally|out|true|byte|fixed|override|try|case|float|params|typeof|catch|for|private|uint|char|foreach|protected|ulong|checked|goto|public|unchecked|class|if|readonly|unsafe|const|implicit|ref|ushort|continue|in|return|using|decimal|int|sbyte|virtual|default|interface|sealed|volatile|delegate|internal|short|void|do|is|sizeof|while|double|lock|stackalloc|else|long|static|enum|namespace|string)\b/g;
	str = str.replace(re,"<font color=\"#0000FF\">$1</font>");
	str = FormatCodeRemark(str);
	// 值变为棕色
    str = FormatValue(str);
	// 展开和收缩在同一行时，去掉ExpandedSubBlockEnd.gif
//	str = str.replace(/(<IMG src="PiscesTextEditor\/codeimages\/ContractedSubBlock.gif.*?>)<IMG src="PiscesTextEditor\/codeimages\/ExpandedSubBlockEnd.gif.*?>/gi,"$1");
	str = str.replace(/(<IMG src="PiscesTextEditor\/codeimages\/Contracted(Sub)?Block.gif)([\s\S]*?)(\n)/gi,
		function() {
			var s = arguments[3].replace(/<IMG src="PiscesTextEditor\/codeimages\/Expanded(Sub)?BlockEnd.gif.*?>/gi,"");
			return(arguments[1]+s+arguments[4]);
		});
	// 替换第一个收缩图片为ExpandedBlockStart.gif，并替换第一个收缩图片前的全部InBlock.gif图片为None.gif
	str = str.replace(/([\s\S]*?)(<IMG src="PiscesTextEditor\/codeimages\/Expanded)(?:Sub)(BlockStart.gif)/i,
			function() {
				var s = arguments[1].replace(/(<IMG src="PiscesTextEditor\/codeimages\/)(InBlock)(.gif".*?>)/gi,"$1None$3");
				s += arguments[2]+arguments[3];
				return (s);
			});
	str = str.replace(/(<IMG src="PiscesTextEditor\/codeimages\/Contracted)(?:Sub)(Block.gif)/i,"$1$2");
	// 替换最后一个收缩图片为ExpandedBlockEnd.gif，并替换最后一个收缩图片后的全部InBlock.gif图片为None.gif
	str = str.replace(/([\s\S]*)(<IMG src=.*?Expanded)(?:Sub)(BlockEnd.gif)([\s\S]*?)$/i,
			function() {
				var s = arguments[1]+arguments[2]+arguments[3];
				s += arguments[4].replace(/(<IMG src="PiscesTextEditor\/codeimages\/)(InBlock)(.gif".*?>)/gi,"$1None$3");
				return (s);
			});
	// 双引号中关键字不变色
	str = str.replace(/(&quot;)([\s\S]*?)\1/g,
			function() {
				return(arguments[1]+arguments[2].replace(/(<[\s\S]*?>)/g,"")+arguments[1]);
			});
	str = str.replace(/<IMG src="PiscesTextEditor\/codeimages\/ExpandedSubBlockEnd.gif" align="top"><IMG src="PiscesTextEditor\/codeimages\/ExpandedSubBlockStart.gif[\s\S]*?><IMG src="PiscesTextEditor\/codeimages\/ContractedSubBlock.gif[\s\S]*?>/gi,"<IMG src=\"PiscesTextEditor/codeimages/InBlock.gif\" align=\"top\">");
	return (str);
}

// 格式化using
function FormatUsing(str)
{
	// 给using和正式代码之间的行的行头加上空白图片
	str = str.replace(/^([\s\S]*?)({)/g,
			function() {
				var s = arguments[1].replace(/(\n)([^u])/g,"$1<img src=\"PiscesTextEditor/codeimages/None.gif\" align=\"top\">$2");
				s = s.replace(/(\n)([^u<])/g,"$1<img src=\"PiscesTextEditor/codeimages/None.gif\" align=\"top\">$2");
				return(s+arguments[2]);
			});
	// using加一个收缩功能
	str = str.replace(/^([\s\S]*?)\b(using\s)/i,
			function() {
				var rndnum = Math.floor((Math.random()*1000000)).toString().substr(0,4);
				var s = arguments[1].replace(/(.*)([^\n]*)$/g,"$2")
						+GetHeader(arguments[1].replace(/(.*)([^\n]*)$/g,"$2")+arguments[2],"...","CodeUsing",false,true);
				return(s);
			});	
	var arr = str.match(/.*using.*/g);
	if (arr!=null)
		str = str.replace(arr[arr.length-1],
			"<IMG src=\"PiscesTextEditor/codeimages/ExpandedBlockEnd.gif\" align=\"top\">"+arr[arr.length-1]+"</span>");	
//	str = str.replace(/([\s\S]*\n)(using[\s\S]*?)\n/g,"$1<IMG src=\"PiscesTextEditor/codeimages/ExpandedBlockEnd.gif\" align=\"top\">$2</span>");
	return(str);
}

// 格式化Region
function FormatRegion(str,canCollapse)
{
	// 替换region处
	str = str.replace(/(.*)(#region\s+)([^\r\n]*)/g,	
		function() {				
				var s = GetHeader(arguments[1],arguments[3],"CodeRegion",canCollapse,false)
						+"<font color=\"#0000ff\">"+arguments[2]+"</font>"+arguments[3];
				return(s);
			});
	// 替换endregion处
	str = str.replace(/(.*)(#endregion)/g,
		"<img src=\"PiscesTextEditor/codeimages/ExpandedSubBlockEnd.gif\" align=\"top\"/>$1<font color=\"#0000ff\">$2</font></span>");
	return(str);
}

// 格式化{}
function FormatBrace(str)
{
	// 替换左边大括号
	str = str.replace(/([^{]*\n)(.*?)(\{)/g, 
			function() {
					var rndnum = Math.floor((Math.random()*1000000)).toString().substr(0,4);
					var str = arguments[1]+GetHeader(arguments[2],"...","CodeFunction",false,false)+arguments[3];
					return(str);
    					});
	// 替换右边大括号
	str = str.replace(/(.*\})/g,
		"<IMG src=\"PiscesTextEditor/codeimages/ExpandedSubBlockEnd.gif\" align=\"top\">$1</span>"); 
	return str;
}

// 格式化函数头注释
function FormatFunctionRemark(str)
{
	// 函数头注释处的<summary>值变绿色
	str = str.replace(/(\/{3}\s*&lt;summary&gt;.*?\n)([\s\S]*?)(\/{3}\s*&lt;\/summary&gt;)/g,
			function() {
				str = arguments[2].replace(/(\/{3})([\s\S]*?)(\n)/g,"$1<font color=\"#008000\">$2</font>$3");
				return(arguments[1]+str+arguments[3]); 
			});
	// <param>值变为绿色
	str = str.replace(/(\/{3}\s*&lt;param([\s\S]*?)&gt;)([\s\S]*?)(&lt;\/param&gt;)/g,"$1<font color=\"#008000\">$3</font>$4");
	// <returns><example><remarks><value>值变为绿色
	str = str.replace(/(\/{3}\s*&lt;(returns|example|remarks|value)&gt;)([\s\S]*?)(&lt;\/\2&gt;)/g,
		"$1<font color=\"#008000\">$3</font>$4");
	// 加收缩功能
	str = str.replace(/(.*)(\/{3}\s*&lt;summary&gt;)([\s\S]*?)(\n\s*\b(public|protected|private)\b)/g,
			function() {
				var rndnum = Math.floor((Math.random()*1000000)).toString().substr(0,4);
				var s1 = GetHeader(arguments[1],"/**/","CodeRemark",false,false)+arguments[2];
				var arr = arguments[3].match(/[\s\S]*?\n/g);
				var maxStr = arr[arr.length-1];
				var s2 = arguments[3].replace(maxStr,maxStr+"<IMG src=\"PiscesTextEditor/codeimages/ExpandedSubBlockEnd.gif\" align=\"top\">");
				return(s1+s2+"</span>"+arguments[4]);
			});
	// 函数头注释处其它字符变为灰色
	str = str.replace(/(\/{3})([\s\S]*?)(<\/SPAN>|\n|$)/gi,"<font color=\"#808080\">$1$2</font>$3");
	return(str);
}

//---------------------------------------   格式化HTML代码   ----------------------------------------
// 格式化HTML代码
function FormatHTML(str,canCollapse)
{
	// 给Flash加折叠功能，默认为收缩状态
//	str = str.replace(/(.*)(&lt;object)([\s\S]*)(\n)(.*&lt;\/object.*)/gi,
//			function() {
//				var s = GetHeader(arguments[1],"<-- OBJECT class=ShockwaveFlash -->","CodeFlash",true,true)+arguments[2]+arguments[3].replace(/(\n)/g,"$1<IMG src=\"PiscesTextEditor/codeimages/InBlock.gif\" align=\"top\">")+arguments[4]+"<IMG src=\"PiscesTextEditor/codeimages/ExpandedBlockEnd.gif\" align=\"top\">"+arguments[5]+"</span>";
//				return (s);
//			});
	// 替换HTML注释为绿色
	str = str.replace(/(&lt;!)(--.*?--)(&gt;)/g,"$1<font color=\"#008000\">$2</font>$3");
	// 替换HTML标签的属性为红色，HTML标签为棕色
/*	str = str.replace(/(&lt;)([^\s\/%!]*?)((\s+.*?)*)(\/?&gt;)/gi,
		function() {
			var s="<font color=\"#0000FF\">"+arguments[1]+"</font><font color=\"#800000\">"+
			    arguments[2]+"</font>"+arguments[3].replace(/(\s+)([^\s]*?)(=)(&quot;|')(.*?)\4/g,"$1<font color=\"#FF0000\">$2</font><font color=\"#0000FF\">$3$4$5$4</font>")+"<font color=\"#0000FF\">"+arguments[5]+"</font>";
			return (s);
		});*/
	str = str.replace(/(&lt;\/?)([^\s\/\&!]*)(.*?)(\/?&gt;)/gi,
			function() {
			var s="<font color=\"#0000FF\">"+arguments[1]+"</font><font color=\"#800000\">"+arguments[2]+"</font>"+
			arguments[3].replace(/(\s+)([^\s]*?)(=)(&quot;|')(.*?)\4/g,"$1<font color=\"#FF0000\">$2</font><font color=\"#0000FF\">$3$4$5$4</font>")+
			"<font color=\"#0000FF\">"+arguments[4]+"</font>";
			return (s);
            });
	str = str.replace(/(&lt;\/)(.*?)(&gt;)/gi,
		"<font color=\"#0000FF\">$1</font><font color=\"#800000\">$2</font><font color=\"#0000FF\">$3</font>");
	// 替换全部特殊符号标签为红色
	var symbolReg = /(&amp;)(quot|amp|lt|gt|nbsp|aacute|euro|lsquo|rsquo|rsquo|ldquo|rdquo|ndash|mdash|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|uuml|yacute|thorn|yuml)(;)/gi;
	str = str.replace(symbolReg,"<font color=\"#FF0000\">$1$2$3</font>")
	// 给<%和%>加个黄色背景
	str = str.replace(/(&lt;%)(.*?)(%&gt;)/gi,
			function() {
				var s="<font style=\"color:#000000;background-color:#FFFF00;\">"+arguments[1]+
				    "</font>"+arguments[2]+
				    "<font style=\"color:#000000;background-color:#FFFF00;\">"+arguments[3]+"</font>";
				return (s);
			});
	return (str);
}

//--------------------------------------   格式化JScript函数   --------------------------------------
// 格式化JScript函数
function FormatJScript(str,canCollapse)
{
	// 关键字变为蓝色
	var keywordReg = /\b(break|delete|function|return|typeof|case|do|if|switch|var|catch|else|in|this|void|continue|false|instanceof|throw|while|debugger|finally|new|true|with|default|for|null|try|abstract|double|goto|native|static|boolean|enum|implements|package|super|byte|export|import|private|synchronized|char|extends|int|protected|throws|class|final|interface|public|transient|const|float|long|short|volatile)\b/g;
	str = str.replace(keywordReg,"<font color=\"#0000FF\">$1</font>");
//	str = FormatBrace(str);
	str = FormatValue(str);
	// 注释变为绿色
	str = FormatCodeRemark(str);
	return (str);
}

//--------------------------------------   格式化CSS   --------------------------------------
// 格式化CSS
function FormatCSS(str,canCollapse)
{
    str = str.replace(/(@\w*)(.*?;)/g,"<font color=\"#0000FF\">$1</font><font color=\"#000000\">$2</font>");
	str = str.replace(/(^|})([\s\S]*?)({|$)/g,"$1<font color=\"#800000\">$2</font>$3");
	str = str.replace(/({)([\s\S]*?)(})/g,
		function() {
			var s = arguments[2].replace(/(^|;)([\s\S]*?)(:)/g,"$1<font color=\"#FF0000\">$2</font>$3");
			s = s.replace(/(:)([\s\S]*?)(;|$)/g,"$1<font color=\"#0000FF\">$2</font>$3");
			s = arguments[1]+s+arguments[3];
			return (s);
		});
	return (str);
}

//--------------------------------------   格式化XML   --------------------------------------
// 格式化XML
function FormatXML(str,canCollapse)
{
	// 替换XML标签的属性为红色，XML标签为棕色
	str = str.replace(/(&lt;\??)([^!\s\/%]*?)((\s+.*?)*)([\/\?]?&gt;)/gi,
		function() {
			var s = arguments[3];
			s="<font color=\"#0000FF\">"+arguments[1]+"</font><font color=\"#800000\">"+arguments[2]+"</font>"+s.replace(/(\s+)([^\s]*?)(=)(&quot;|')(.*?)\4/g,"$1<font color=\"#FF0000\">$2</font><font color=\"#0000FF\">$3$4$5$4</font>")+"<font color=\"#0000FF\">"+arguments[5]+"</font>";
			return (s);
		});
	str = str.replace(/(&lt;\/)(.*?)(&gt;)/gi,
		"<font color=\"#0000FF\">$1</font><font color=\"#800000\">$2</font><font color=\"#0000FF\">$3</font>");
	
	// 替换全部特殊符号标签为红色
	var symbolReg = /(&amp;)(quot|amp|lt|gt|nbsp|aacute|euro|lsquo|rsquo|rsquo|ldquo|rdquo|ndash|mdash|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|uuml|yacute|thorn|yuml)(;)/gi;
	str = str.replace(symbolReg,"<font color=\"#FF0000\">$1$2$3</font>");
	str = str.replace(/(&lt;!--)([\s\S]*?)(--&gt;)/g,
	        function() {
	            return (arguments[1]+"<font color=\"#008000\">"+ClearColorTag(arguments[2])+"</font>"+arguments[3]);
	        });
	return (str);
}

//---------------------------------------   格式化VBScript代码   ----------------------------------------
// 格式化VBScript代码
function FormatVBScript(str,canCollapse)
{
	// 关键字变为蓝色
	var re = /\b(And|As|ByRef|Call|Case|Class|Const|Dim|Do|Each|Else|ElseIf|Empty|End|Eqv|Erase|Execute|ExecuteGlobal|Exit|Explicit|False|For|Get|Goto|If|Imp|In|Is|Let|Loop|Mod|Next|Not|Nothing|Null|On|Option|Or|Private|Public|Randomize|ReDim|Rem|Resume|Select|Set|Stop|Then|To|True|Until|Wend|While|With|Xor)\b/gi;
	str = str.replace(re,"<font color=\"#0000FF\">$1</font>");
	// 注释变为绿色
	str = str.replace(/('.*)/g,
			function() {
				return ("<font color=\"#008000\">" + arguments[1].replace(/<.*?>/g,"") + "</font>");
			});
	// 字符串值中关键字不变色
	str = str.replace(/(&quot;.*?&quot;)/g,
			function() {
				return (ClearColorTag(arguments[1]));
			});
	return (str);
}

//---------------------------------------   格式化SQL代码   ----------------------------------------
// 格式化SQL代码
function FormatSQL(str,canCollapse)
{
	// 符号等变为灰色
	str = str.replace(/([%\^\*\(\)\-\+=|\/,\.~])/gi,"<font color=\"#999999\">$1</font>");
	str = str.replace(/(&lt;|&gt;|&amp;)/gi,"<font color=\"#999999\">$1</font>")
	re = /\b(not|or|null|exists|and|all|any|between|join|some|like|cross|outer|in)\b/gi;
	str = str.replace(re,"<font color=\"#999999\">$1</font>");
	// 关键字变为蓝色
	var re = /\b(ADD|EXIT|PRIMARY|FETCH|PRINT|ALTER|FILE|PRIVILEGES|FILLFACTOR|PROC|FLOPPY|PROCEDURE|AS|FOR|PROCESSEXIT|ASC|FOREIGN|PUBLIC|AUTHORIZATION|FREETEXT|RAISERROR|AVG|FREETEXTTABLE|READ|BACKUP|FROM|READTEXT|BEGIN|FULL|RECONFIGURE|GOTO|REFERENCES|BREAK|GRANT|REPEATABLE|BROWSE|GROUP|REPLICATION|BULK|HAVING|RESTORE|BY|HOLDLOCK|RESTRICT|CASCADE|RETURN|CASE|IDENTITY_INSERT|REVOKE|CHECK|IDENTITYCOL|RIGHT|CHECKPOINT|IF|ROLLBACK|CLOSE|CLUSTERED|INDEX|ROWGUIDCOL|COALESCE|INNER|RULE|COLUMN|INSERT|SAVE|COMMIT|INTERSECT|SCHEMA|COMMITTED|INTO|SELECT|COMPUTE|IS|SERIALIZABLE|CONFIRM|ISOLATION|SESSION_USER|CONSTRAINT|SET|CONTAINS|KEY|SETUSER|CONTAINSTABLE|KILL|SHUTDOWN|CONTINUE|LEFT|CONTROLROW|LEVEL|STATISTICS|CONVERT|SUM|COUNT|LINENO|SYSTEM_USER|CREATE|LOAD|TABLE|MAX|TAPE|CURRENT|MIN|TEMP|CURRENT_DATE|MIRROREXIT|TEMPORARY|CURRENT_TIME|NATIONAL|CURRENT_TIMESTAMP|NOCHECK|THEN|CURRENT_USER|NONCLUSTERED|TO|CURSOR|TOP|DATABASE|TRAN|DBCC|IF|TRANSACTION|DEALLOCATE|OF|TRIGGER|DECLARE|OFF|TRUNCATE|DEFAULT|OFFSETS|TSEQUAL|DELETE|ON|UNCOMMITTED|DENY|ONCE|UNION|DESC|ONLY|UNIQUE|DISK|OPEN|UPDATE|DISTINCT|OPENDATASOURCE|UPDATETEXT|DISTRIBUTED|OPENQUERY|USE|DOUBLE|OPENROWSET|USER|DROP|OPTION|VALUES|DUMMY|VARYING|DUMP|ORDER|VIEW|ELSE|WAITFOR|END|OVER|WHEN|ERRLVL|PERCENT|WHERE|ERROREXIT|PERM|WHILE|ESCAPE|PERMANENT|WITH|EXCEPT|PIPE|WORK|EXEC|PLAN|WRITETEXT|EXECUTE|PRECISION|PREPARE|NAME|FILENAME|FILEGROWTH|SIZE|COLLATE|bigint|Binary|bit|char|cursor|datetime|Decimal|float|image|int|money|Nchar|ntext|nvarchar|real|smalldatetime|Smallint|smallmoney|text|timestamp|tinyint|Varbinary|Varchar|uniqueidentifier)\b/gi;
	str = str.replace(re,"<font color=\"#0000FF\">$1</font>");
	// 系统存储过程名称变为棕色
	re = /\b(atalogs_cursor|sp_fulltext_column|sp_help_fulltext_columns|sp_fulltext_database|sp_help_fulltext_columns_cursor|sp_fulltext_service|sp_help_fulltext_tables|sp_fulltext_table|sp_help_fulltext_tables_cursor|sp_help_fulltext_catalogs|sp_add_log_shipping_database|sp_delete_log_shipping_database|sp_add_log_shipping_plan|sp_delete_log_shipping_plan|sp_add_log_shipping_plan_database|sp_delete_log_shipping_plan_database|sp_add_log_shipping_primary|sp_delete_log_shipping_primary|sp_add_log_shipping_secondary|sp_delete_log_shipping_secondary|sp_can_tlog_be_applied|sp_get_log_shipping_monitor_info|sp_change_monitor_role|sp_remove_log_shipping_monitor|sp_change_primary_role|sp_resolve_logins|sp_change_secondary_role|sp_update_log_shipping_monitor_info|sp_create_log_shipping_monitor_account|sp_update_log_shipping_plan|sp_define_log_shipping_monitor|sp_update_log_shipping_plan_database|sp_OACreate|sp_OAMethod|sp_OADestroy|sp_OASetProperty|sp_OAGetErrorInfo|sp_OAStop|sp_OAGetProperty|sp_add_agent_parameter|sp_enableagentoffload|sp_add_agent_profile|sp_enumcustomresolvers|sp_addarticle|sp_enumdsn|sp_adddistpublisher|sp_enumfullsubscribers|sp_adddistributiondb|sp_expired_subscription_cleanup|sp_adddistributor|sp_generatefilters|sp_addmergealternatepublisher|sp_getagentoffloadinfo|sp_addmergearticle|sp_getmergedeletetype|sp_addmergefilter|sp_get_distributor|sp_addmergepublication|sp_getqueuedrows|sp_addmergepullsubscription|sp_getsubscriptiondtspackagename|sp_addmergepullsubscription_agent|sp_grant_publication_access|sp_addmergesubscription|sp_help_agent_default|sp_addpublication|sp_help_agent_parameter|sp_addpublication_snapshot|sp_help_agent_profile|sp_addpublisher70|sp_helparticle|sp_addpullsubscription|sp_helparticlecolumns|sp_addpullsubscription_agent|sp_helparticledts|sp_addscriptexec|sp_helpdistpublisher|sp_addsubscriber|sp_helpdistributiondb|sp_addsubscriber_schedule|sp_helpdistributor|sp_addsubscription|sp_helpmergealternatepublisher|sp_addsynctriggers|sp_helpmergearticle|sp_addtabletocontents|sp_helpmergearticlecolumn|sp_adjustpublisheridentityrange|sp_helpmergearticleconflicts|sp_article_validation|sp_helpmergeconflictrows|sp_articlecolumn|sp_helpmergedeleteconflictrows|sp_articlefilter|sp_helpmergefilter|sp_articlesynctranprocs|sp_helpmergepublication|sp_articleview|sp_helpmergepullsubscription|sp_attachsubscription|sp_helpmergesubscription|sp_browsesnapshotfolder|sp_helppublication|sp_browsemergesnapshotfolder|sp_help_publication_access|sp_browsereplcmds|sp_helppullsubscription|sp_change_agent_parameter|sp_helpreplfailovermode|sp_change_agent_profile|sp_helpreplicationdboption|sp_changearticle|sp_helpreplicationoption|sp_changedistpublisher|sp_helpsubscriberinfo|sp_changedistributiondb|sp_helpsubscription|sp_changedistributor_password|sp_ivindexhasnullcols|sp_changedistributor_property|sp_helpsubscription_properties|sp_changemergearticle|sp_link_publication|sp_changemergefilter|sp_marksubscriptionvalidation|sp_changemergepublication|sp_mergearticlecolumn|sp_changemergepullsubscription|sp_mergecleanupmetadata|sp_changemergesubscription|sp_mergedummyupdate|sp_changepublication|sp_mergesubscription_cleanup|sp_changesubscriber|sp_publication_validation|sp_changesubscriber_schedule|sp_refreshsubscriptions|sp_changesubscriptiondtsinfo|sp_reinitmergepullsubscription|sp_changesubstatus|sp_reinitmergesubscription|sp_change_subscription_properties|sp_reinitpullsubscription|sp_check_for_sync_trigger|sp_reinitsubscription|sp_copymergesnapshot|sp_removedbreplication|sp_copysnapshot|sp_repladdcolumn|sp_copysubscription|sp_replcmds|sp_deletemergeconflictrow|sp_replcounters|sp_disableagentoffload|sp_repldone|sp_drop_agent_parameter|sp_repldropcolumn|sp_drop_agent_profile|sp_replflush|sp_droparticle|sp_replicationdboption|sp_dropanonymouseagent|sp_replication_agent_checkup|sp_dropdistpublisher|sp_replqueuemonitor|sp_dropdistributiondb|sp_replsetoriginator|sp_dropmergealternatepublisher|sp_replshowcmds|sp_dropdistributor|sp_repltrans|sp_dropmergearticle|sp_restoredbreplication|sp_dropmergefilter|sp_revoke_publication_access|sp_scriptsubconflicttable|sp_dropmergepublication|sp_script_synctran_commands|sp_dropmergepullsubscription|sp_setreplfailovermode|sp_showrowreplicainfo|sp_dropmergesubscription|sp_subscription_cleanup|sp_droppublication|sp_table_validation|sp_droppullsubscription|sp_update_agent_profile|sp_dropsubscriber|sp_validatemergepublication|sp_dropsubscription|sp_validatemergesubscription|sp_dsninfo|sp_vupgrade_replication|sp_dumpparamcmd|sp_addalias|sp_droprolemember|sp_addapprole|sp_dropserver|sp_addgroup|sp_dropsrvrolemember|sp_addlinkedsrvlogin|sp_dropuser|sp_addlogin|sp_grantdbaccess|sp_addremotelogin|sp_grantlogin|sp_addrole|sp_helpdbfixedrole|sp_addrolemember|sp_helpgroup|sp_addserver|sp_helplinkedsrvlogin|sp_addsrvrolemember|sp_helplogins|sp_adduser|sp_helpntgroup|sp_approlepassword|sp_helpremotelogin|sp_changedbowner|sp_helprole|sp_changegroup|sp_helprolemember|sp_changeobjectowner|sp_helprotect|sp_change_users_login|sp_helpsrvrole|sp_dbfixedrolepermission|sp_helpsrvrolemember|sp_defaultdb|sp_helpuser|sp_defaultlanguage|sp_MShasdbaccess|sp_denylogin|sp_password|sp_dropalias|sp_remoteoption|sp_dropapprole|sp_revokedbaccess|sp_dropgroup|sp_revokelogin|sp_droplinkedsrvlogin|sp_setapprole|sp_droplogin|sp_srvrolepermission|sp_dropremotelogin|sp_validatelogins|sp_droprole|sp_processmail|xp_sendmail|xp_deletemail|xp_startmail|xp_findnextmsg|xp_stopmail|xp_readmail|sp_trace_create|sp_trace_setfilter|sp_trace_generateevent|sp_trace_setstatus|sp_trace_setevent|sp_add_alert|sp_help_jobhistory|sp_add_category|sp_help_jobschedule|sp_add_job|sp_help_jobserver|sp_add_jobschedule|sp_help_jobstep|sp_add_jobserver|sp_help_notification|sp_add_jobstep|sp_help_operator|sp_add_notification|sp_help_targetserver|sp_add_operator|sp_help_targetservergroup|sp_add_targetservergroup|sp_helptask|sp_add_targetsvrgrp_member|sp_manage_jobs_by_login|sp_addtask|sp_msx_defect|sp_apply_job_to_targets|sp_msx_enlist|sp_delete_alert|sp_post_msx_operation|sp_delete_category|sp_purgehistory|sp_delete_job|sp_purge_jobhistory|sp_delete_jobschedule|sp_reassigntask|sp_delete_jobserver|sp_remove_job_from_targets|sp_delete_jobstep|sp_resync_targetserver|sp_delete_notification|sp_start_job|sp_delete_operator|sp_stop_job|sp_delete_targetserver|sp_update_alert|sp_delete_targetservergroup|sp_update_category|sp_delete_targetsvrgrp_member|sp_update_job|sp_droptask|sp_update_jobschedule|sp_help_alert|sp_update_jobstep|sp_help_category|sp_update_notification|sp_help_downloadlist|sp_update_operator|sp_helphistory|sp_update_targetservergroup|sp_help_job|sp_updatetask|xp_sqlagent_proxy_accountsp_add_data_file_recover_suspect_db|sp_helpconstraint|sp_addextendedproc|sp_helpdb|sp_addextendedproperty|sp_helpdevice|sp_add_log_file_recover_suspect_db|sp_helpextendedproc|sp_addmessage|sp_helpfile|sp_addtype|sp_helpfilegroup|sp_addumpdevice|sp_helpindex|sp_altermessage|sp_helplanguage|sp_autostats|sp_helpserver|sp_attach_db|sp_helpsort|sp_attach_single_file_db|sp_helpstats|sp_bindefault|sp_helptext|sp_bindrule|sp_helptrigger|sp_bindsession|sp_indexoption|sp_certify_removable|sp_invalidate_textptr|sp_configure|sp_lock|sp_create_removable|sp_monitor|sp_createstats|sp_procoption|sp_cycle_errorlog|sp_recompile|sp_datatype_info|sp_refreshview|sp_dbcmptlevel|sp_releaseapplock|sp_dboption|sp_rename|sp_dbremove|sp_renamedb|sp_delete_backuphistory|sp_resetstatus|sp_depends|sp_serveroption|sp_detach_db|sp_setnetname|sp_dropdevice|sp_settriggerorder|sp_dropextendedproc|sp_spaceused|sp_dropextendedproperty|sp_tableoption|sp_dropmessage|sp_unbindefault|sp_droptype|sp_unbindrule|sp_executesql|sp_updateextendedproperty|sp_getapplock|sp_updatestats|sp_getbindtoken|sp_validname|sp_help|sp_who|sp_dropwebtask|sp_makewebtask|sp_enumcodepages|sp_runwebtask|sp_xml_preparedocument|sp_xml_removedocument|xp_cmdshell|xp_logininfo|xp_enumgroups|xp_msver|xp_findnextmsg|xp_revokelogin|xp_grantlogin|xp_sprintf|xp_logevent|xp_sqlmaint|xp_loginconfig|xp_sscanf|sp_cursor|sp_cursorclose|sp_cursorexecute|sp_cursorfetch|sp_cursoropen|sp_cursoroption|sp_cursorprepare|sp_cursorunprepare|sp_execute|sp_prepare|sp_unprepare|sp_createorphan|sp_droporphans|sp_reset_connection|sp_sdidebug)\b/gi;
	str = str.replace(re,"<font color=\"#800000\">$1</font>");
	// 函数变为紫色
	re = /\b(ASCII|SOUNDEX|PATINDEX|SPACE|CHARINDEX|REPLACE|STR|DIFFERENCE|QUOTENAME|STUFF|LEFT|REPLICATE|SUBSTRING|LEN|REVERSE|UNICODE|LOWER|RIGHT|UPPER|LTRIM|RTRIM|DATEADD|DATEDIFF|DATENAME|DATEPART|DAY|GETDATE|GETUTCDATE|MONTH|YEAR|ABS|DEGREES|RAND|ACOS|EXP|ROUND|ASIN|FLOOR|SIGN|ATAN|LOG|SIN|ATN2|LOG10|SQUARE|CEILING|PI|SQRT|COS|POWER|TAN|COT|RADIANS|AVG|COUNT|SUM|APP_NAME|CASE|CAST|CONVERT|COALESCE|COLLATIONPROPERTY|CURRENT_TIMESTAMP|CURRENT_USER|DATALENGTH|@@ERROR|FORMATMESSAGE|HOST_NAME|IDENT_CURRENT|IDENT_INCR|IDENT_SEED|@@IDENTITY|ISDATE|ISNULL|ISNUMERIC|NEWID|NULLIF|PARSENAME|PERMISSIONS|@@ROWCOUNT|SCOPE_IDENTITY|SERVERPROPERTY|SESSIONPROPERTY|SESSION_USER|STATS_DATE|SYSTEM_USER|@@TRANCOUNT|USER_NAME|@@DATEFIRST|@@OPTIONS|@@DBTS|@@REMSERVER|@@LANGID|@@SERVERNAME|@@LANGUAGE|@@SERVICENAME|@@LOCK_TIMEOUT|@@SPID|@@MAX_CONNECTIONS|@@TEXTSIZE|@@MAX_PRECISION|@@VERSION|@@NESTLEVEL|@@CURSOR_ROWS|CURSOR_STATUS|@@FETCH_STATUS|COL_LENGTH|COL_NAME|FULLTEXTCATALOGPROPERTY|COLUMNPROPERTY|FULLTEXTSERVICEPROPERTY|DATABASEPROPERTY|INDEX_COL|DATABASEPROPERTYEX|INDEXKEY_PROPERTY|DB_ID|INDEXPROPERTY|DB_NAME|OBJECT_ID|FILE_ID|OBJECT_NAME|FILE_NAME|OBJECTPROPERTY|FILEGROUP_ID|@@PROCID|FILEGROUP_NAME|SQL_VARIANT_PROPERTY|FILEGROUPPROPERTY|TYPEPROPERTY|FILEPROPERTY|IS_SRVROLEMEMBER|SUSER_SID|SUSER_SNAME|USER_ID|USER|IS_MEMBER|@@CONNECTIONS|@@PACK_RECEIVED|@@CPU_BUSY|@@PACK_SENT|@@TIMETICKS|@@IDLE|@@TOTAL_ERRORS|@@IO_BUSY|@@TOTAL_READ|@@PACKET_ERRORS|@@TOTAL_WRITE|PATINDEX|TEXTPTR|TEXTVALID|@@LANGUAGE)\b/gi;
	str = str.replace(re,"<font color=\"#FF00FF\">$1</font>");
	// 系统表名称变为绿色
	re = /\b(sysaltfiles|syscacheobjects|syscharsets|syscolumns|syscomments|sysconfigures|syscurconfigs|syscursorcolumns|syscursorrefs|syscursors|syscursortables|sysdatabases|sysdepends|sysdevices|sysfilegroups|sysfiles|sysfiles1|sysforeignkeys|sysfulltextcatalogs|sysfulltextnotify|sysindexes|sysindexkeys|syslanguages|syslockinfo|syslocks|sysmembers|sysmessages|sysobjects|sysperfinfo|syspermissions|sysprocesses|sysproperties|sysprotects|sysreferences|SYSREMOTE_CATALOGS|SYSREMOTE_COLUMN_PRIVILEGES|SYSREMOTE_COLUMNS|SYSREMOTE_FOREIGN_KEYS|SYSREMOTE_INDEXES|SYSREMOTE_PRIMARY_KEYS|SYSREMOTE_PROVIDER_TYPES|SYSREMOTE_SCHEMATA|SYSREMOTE_STATISTICS|SYSREMOTE_TABLE_PRIVILEGES|SYSREMOTE_TABLES|SYSREMOTE_VIEWS|sysservers|systypes|sysusers|sysxlogins)\b/gi;
	str = str.replace(re,"<font color=\"#008000\">$1</font>");
	// 值变为红色
		str = str.replace(/(N)('.*?')/gi,
		function() {
			return (arguments[1]+"<font color=\"#FF0000\">"+arguments[2].replace(/<.*?>/g,"")+"</font>");
		});

	return (str);
}

//---------------------------------------   公共函数   ----------------------------------------
// 获取可折叠的行头(文字之前的空白，收缩时显示的文字，要收缩的控件名称，默认是否折叠，是否显示为ExpandedBlockStart.gif)
function GetHeader(blank,text,control,canCollapse,isTopImage)
{
	var CodeRegionStyle = "color: #808080;BORDER: #808080 1px solid; PADDING: 0px; BACKGROUND-COLOR: #FFFFFF;";
	if (canCollapse)
	{
		var ExpandedImageStyle = "display:none;";
		var ContractedImageStyle = "display:inline;";
	}
	else
	{
		var ExpandedImageStyle = "display:inline;";
		var ContractedImageStyle = "display:none;";
	}
	if (isTopImage)
	{
		var ImageName = "Block";
	}
	else
	{
		var ImageName = "SubBlock";
	}
	var rndnum = Math.floor((Math.random()*1000000)).toString().substr(0,4);
	return ("<img src=\"PiscesTextEditor/codeimages/Expanded"+ImageName+"Start.gif\" name=\""+control+rndnum+"_expand_img\" align=\"top\" onclick=\""+control+rndnum+"_shrink_img.style.display='inline';"+control+rndnum+"_expand_img.style.display='none';"+control+rndnum+"_expand_text.style.display='none';"+control+rndnum+"_shrink_text.style.display='inline'\" style=\""+ExpandedImageStyle+"\"><img src=\"PiscesTextEditor/codeimages/Contracted"+ImageName+".gif\" name=\""+control+rndnum+"_shrink_img\" align=\"top\" onclick=\""+control+rndnum+"_shrink_img.style.display='none';"+control+rndnum+"_expand_img.style.display='inline';"+control+rndnum+"_expand_text.style.display='inline';"+control+rndnum+"_shrink_text.style.display='none';\" style=\""+ContractedImageStyle+"\">"+blank+"<span id=\""+control+rndnum+"_shrink_text\" style=\""+CodeRegionStyle+ContractedImageStyle+"\">"+text+"</span><span id=\""+control+rndnum+"_expand_text\" style=\""+ExpandedImageStyle+"\">");
}

// 给代码加上行号
function AddLineNumber(str)
{
	var i = 0;
	var arr = str.match(/\n/g);
	arrlen = (arr != null) ? arr.length+1 : 1;
	var rowCount = arrlen.toString().length;
	str = str.replace(/(^|\n)/g,
			function(){
					i++;
					var blankstr = "0000".substr(0,rowCount-i.toString().length);
					var s = (blankstr=="") ? "" : "<font color=\""+CodeDivBgColor+"\">"+blankstr+"</font>";
					return(arguments[1]+s+"<font color=\"#008080\">"+i+"</font> ");
				});
	return(str);
}

// 格式化函数代码注释//和/**/
function FormatCodeRemark(str)
{
	// 所有注释被绿色
	str = str.replace(/([^\/])(\/{2})(.*)/g,
			function() {
					var s;
					if (arguments[3].substr(0,1) != "/")
						s = "<font color=\"#008000\">"+arguments[2]+ClearColorTag(arguments[3])+"</font>";
					else
						s = arguments[2]+arguments[3];
					return(arguments[1]+s);
				});
	str = str.replace(/(\/\*)([\s\S]*?)(\*\/)/g,
			function() {
					var s = arguments[1];
					if (arguments[2] != "")
						s = "<font color=\"#008000\">"+s+ClearColorTag(arguments[2])+arguments[3]+"</font>";
					else
						s += arguments[3];
					return(s);
				});
	return(str);
}

// 格式化值
function FormatValue(str)
{
    // 所有值（双引号或单引号之间的字符串）变为棕色
	str = str.replace(/(@?)(&quot;)(.*?)\2/g,
	function() {
		var s = arguments[3].replace(/<.*?>/g,"");
		return("<font color=\"#800000\">"+arguments[1]+arguments[2]+s+arguments[2]+"</font>");
	});
	return (str);
}

// 清除字符串中所有的颜色标签
function ClearColorTag(str)
{
    str = str.replace(/<\/?font.*?>/g,"");
    return (str);
}