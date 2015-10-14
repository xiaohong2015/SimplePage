var tabs=document.getElementById('tabs');
var tabsNav=document.getElementById('tabsNav');
var tabsNavBtn=tabsNav.getElementsByTagName('div');
var tabsCon=document.getElementById('tabsCon');
var conList=tabsCon.getElementsByTagName('ul');
var now=0;
for(var i=0;i<tabsNavBtn.length;i++){
   tabsNavBtn[i].index=i;
   tabsNavBtn[i].onmouseover=function(){
   for(var i=0;i<tabsNavBtn.length;i++){
     tabsNavBtn[i].className="title";
   }
   this.className+=" active";
   conList[now].style.display="none";
   conList[this.index].style.display="block";
     now=this.index;
    }
}


var view=document.getElementById('sider');
var sider=view.getElementsByTagName('ul')[0];
var siderLi=sider.getElementsByTagName('li');
var siderImg=sider.getElementsByTagName('img');
var liLen=siderLi.length;
var siderBtns=document.getElementById('siderBtns');
var sBtn=siderBtns.getElementsByTagName('a');
var btnLen=sBtn.length;
var liWidth=328;
var cacNum=0;
var cacNum2=0;
var timer=null;
var j=0;
sider.style.width=liWidth*liLen+'px';
for(var i=0;i<btnLen;i++){
	sBtn[i].index=i;
	sBtn[i].onclick=function(){
		for(var j=0;j<btnLen;j++){
			sBtn[j].className="";
		}
		this.className="active";
		startMove(sider,{left:-i.index*liWidth});
	}	
}

timer=setInterval(autoPlay,3000);
function autoPlay(){
	if(cacNum==liLen-1){
		siderLi[0].style.position="relative";
		siderLi[0].style.left=siderLi.length*liWidth+'px';
		cacNum=0;
	}else{
		cacNum++;
	}
	cacNum2++;
	for(var i=0;i<btnLen;i++){
		sBtn[i].className="";
	}
	sBtn[cacNum].className="active";
	startMove(sider,{left:-cacNum2*liWidth},function(){
		if(cacNum==0){
			siderLi[0].style.position="static";
			sider.style.left=0;
			cacNum2=0;
		}
	});
}

function startMove(obj,json,endFn){
	
		clearInterval(obj.timer);
		
		obj.timer = setInterval(function(){
			
			var bBtn = true;
			
			for(var attr in json){
				
				var iCur = 0;
			
				if(attr == 'opacity'){
					if(Math.round(parseFloat(getStyle(obj,attr))*100)==0){
					iCur = Math.round(parseFloat(getStyle(obj,attr))*100);
					
					}
					else{
						iCur = Math.round(parseFloat(getStyle(obj,attr))*100) || 100;
					}	
				}
				else{
					iCur = parseInt(getStyle(obj,attr)) || 0;
				}
				
				var iSpeed = (json[attr] - iCur)/8;
			iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				if(iCur!=json[attr]){
					bBtn = false;
				}
				
				if(attr == 'opacity'){
					obj.style.filter = 'alpha(opacity=' +(iCur + iSpeed)+ ')';
					obj.style.opacity = (iCur + iSpeed)/100;
					
				}
				else{
					obj.style[attr] = iCur + iSpeed + 'px';
				}
				
				
			}
			
			if(bBtn){
				clearInterval(obj.timer);
				
				if(endFn){
					endFn.call(obj);
				}
			}
			
		},30);
	
	}
	
	
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		else{
			return getComputedStyle(obj,false)[attr];
		}
	}