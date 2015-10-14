/* 上方菜单 */
function switchTab(tabpage,tabid){
var oItem = document.getElementById(tabpage).getElementsByTagName("li"); 
    for(var i=0; i<oItem.length; i++){
        var x = oItem[i];    
        x.className = "";
}
	document.getElementById(tabid).className = "Selected";
	var dvs=document.getElementById("cnt").getElementsByTagName("div");
	for (var i=0;i<dvs.length;i++){
	  if (dvs[i].id==('d'+tabid))
	    dvs[i].style.display='block';
	  else
  	  dvs[i].style.display='none';
	}
}
/* 左侧菜单 */
function border_left(tabpage,left_tabid){
var oItem = document.getElementById(tabpage).getElementsByTagName("li"); 
    for(var i=0; i<oItem.length; i++){
        var x = oItem[i];    
        x.className = "";
}
	document.getElementById(left_tabid).className = "Selected";
	var dvs=document.getElementById("left_menu_cnt").getElementsByTagName("ul");
	for (var i=0;i<dvs.length;i++){
	  if (dvs[i].id==('d'+left_tabid))
	    dvs[i].style.display='block';
	  else
  	  dvs[i].style.display='none';
	}
}
/* 左侧菜单active */
function dleft_tab_active(tabpage,activeid){
var obj=activeid
var oItem = document.getElementById(tabpage).getElementsByTagName("a"); 
    for(var i=0; i<oItem.length; i++){
        var x = oItem[i];    
        x.className = "";
}
	obj.className = "Selected";
}
function menu(tab){
if(tab.style.display=='block')tab.style.display='block';
else tab.style.display='block';
}
function su_click(obj){
	if(obj.className == 'open')
	{obj.className = 'close';}
	else{obj.className = 'open';}
	
}
function show_title(str){
	document.getElementById("dnow99").innerHTML=str;
}
function go_cmdurl(title,tabid){
	show_title(title);
	switchTab('TabPage1','Tab3');
	menu(document.getElementById('Tab3')); 
	dleft_tab_active('TabPage3',tabid);
}