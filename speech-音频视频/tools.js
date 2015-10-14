
(function(){	//禁止选中
	window.getSelection
		? window.getSelection().removeAllRanges()
		: document.selection.empty();
	document.onselectstart = function(){return false};
	document.ondragstart = function(){return false};
	document.orientationchange = function(e){
		e.preventDefault();
		return false;
	}
	document.documentElement.style.webkitTouchCallout = "none"; //禁止弹出菜单
	document.documentElement.style.webkitUserSelect = "none";	//禁止选中
})
();

//判断
function find(a,b){
	return a.indexOf(b)+1;
}
(function(){	//brwoser
	var browser = navigator.userAgent.toLowerCase();
	isIE 		= find(browser, "msie");
	isIE9 		= find(browser, "msie 9");
	isIE678 	= isIE && !isIE9;
	isAndroid 	= find(browser, "android");	
	isIphone 	= find(browser, "iphone");
	isIpad 		= find(browser, "ipad");
	isTouch 	= isIphone || isIpad || isAndroid;
})();
function isVoid(a){
	return typeof(a)=='undefined' || a===null
};
function isVoidN(a){
	return isVoid(a) || isNaN(a)
	//myalert(isNaN(null), isNaN(''), isNaN('0ab'), isNaN('ab0'), isNaN({}), isNaN([], isNaN(NaN)))
	// 0, 0, 1, 1, 1, 0, 1
	// 数组被当作数字了
};
function isArray(o) {  
  return Object.prototype.toString.call(o) === '[object Array]';   
} 

//animate
animate = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame
    || function(callback) {setTimeout(callback, 1000 / 60)};

tween = {
	easeOut: function(f){
		return function(r,b,d){
			return f(1-r, b+d, -d);
		}	
	}
	,easeInOut: function(f){
		return function(r,b,d){
			if(r<.5) return f(r+r,b,d/2);
			else     return f(2-r-r,b+d,-d/2);	
		}
	}
	,linear: function(r,b,d){return b+d*r;}
	,quad  : function(r,b,d){return b+d*r*r;}
	,cubic : function(r,b,d){return b+d*r*r*r;}
	,quart : function(r,b,d){return b+d*r*r*r*r;}
	,quint : function(r,b,d){return b+d*r*r*r*r*r;}
	,sine  : function(r,b,d){return b+d*(1-Math.cos(r * (Math.PI/2)));}
	,expo  : function(r,b,d){return b+d*Math.pow(2, 10 * (r - 1));}
	,circ  : function(r,b,d){return b+d * (1-Math.sqrt(1 - r*r));}
	,back: function(r,b,d,s){
		s = s || 1.70158;
		return d*r*r*((s+1)*r - s) + b;
	}
	,bounce: function(r,b,d){
		if (r > 1.75/2.75) {
			return b+d*(1-7.5625*(r=1-r)*r);
		} else if (r > 0.75/2.75) {
			return b+d*(0.25-7.5625*(r=1.25/2.75-r)*r);
		} else if (r > 0.25/2.75) {
			return b+d*(0.0625-7.5625*(r=0.5/2.75-r)*r);
		} else {
			return b+d*(0.015625-7.5625*(r=0.125/2.75-r)*r);
		}
	}
	,active: 1
	,list: {}
	,delay: function(channel, delay, func){
		this.add(channel, '', '', '', '', delay, func)
	}
	,item: ['l','t','w','h','a']
	,add: function(channel, obj, to, from, duration, delay, sTween, sEase){
		if(!this.active && channel!='loading'){
			$S(obj, {l:to.l, t:to.t, w:to.w, h:to.h, a:to.a});
			return;
		}
		var z = this.list[channel]; 
		if(!z){
			z = {
				obj: obj
			};
			if(typeof(sTween)=='function'){
				z.myfunc = sTween;
			}else{
				z.myfunc = 0;
				sTween = sTween || 'sine';//'quad';
				sEase = sEase || 'easeInOut';
				if(sEase=='easeInOut' || sEase=='easeOut'){
					z.func = this[sEase](this[sTween]);
				}else{
					z.func = this[sTween];
				}
			}
			this.list[channel] = z;
		}
		from = from || {};
		
		var t;
		for(var i=0, len=this.item.length; i<len; i++){
			t = this.item[i];
			z['f_'+t] = isVoidN(from[t]) ? obj['_'+t]: from[t];
			z['t_'+t] = isVoidN(to[t]) ? z['f_'+t] : to[t];
			if(!isVoidN(z['f_'+t]) && !isVoidN(z['t_'+t])){
				z['d_'+t] = z['t_'+t] - z['f_'+t];
			}
		}

		
		if(!z.myfunc &&
			!z.d_l &&
			!z.d_t &&
			!z.d_w &&
			!z.d_h &&
			!z.d_a){
			delete this.list[channel];
			return;
		}

		z.delay = getMS() + (delay || 0);
		z.duration = isVoidN(duration) ? 618 : duration;
		if(!this.is_run){
			animate(this.run);
			this.is_run = 1;
		}
	}
	,run: function(){
		var z, y, live = 0, t, now = getMS();
		each(tween.list, function(z){
			if(!z.delay){
			}
			else if(now>=z.delay+z.duration || (!tween.active)){
				if(z.myfunc){
					z.myfunc(1,z.f_l,z.t_l-z.f_l, z);
				}else{
					$S(z.obj, {
						l: z.t_l,
						t: z.t_t,
						w: z.t_w,
						h: z.t_h,
						a: z.t_a
					});				
				}
				z.delay = 0;
				live++;
			}
			else{
				live++;
				if(now>=z.delay){
					t = (now-z.delay)/z.duration;
					if(z.myfunc){
						z.myfunc(t, z.f_l, z.d_l, z);
					}
					else{
						y = {};
						each(tween.item, function(a){
							if(z['d_'+a]){
								y[a] = z.func(t, z['f_'+a], z['d_'+a])
							}
						});
						$S(z.obj, y);
					}
				}
			}
		})
		
		if(live){
			msg(live);
			animate(tween.run);
		}else{
			msg(0);
			tween.list = {};
			tween.is_run = 0;
		}
	}
};

//myjson
function jsonToObj(a){
	a = a.replace(/;/g,',')
	a = a.replace(/:/g,'":"');
	a = a.replace(/,/g,'","');
	
	a = a.replace(/\{/g,'{"');
	a = a.replace(/\}/g,'"}');
	a = a.replace(/"\{/g,'{');
	a = a.replace(/\}"/g,'}');
	
	a = a.replace(/\[/g,'["');
	a = a.replace(/\]/g,'"]');
	a = a.replace(/"\[/g,'[');
	a = a.replace(/\]"/g,']');

	return a;
}
function objToJson(a){
	if(isArray(a)){
		var _ = [];
		each(a, function(b){
			_.p(objToJson(b));
		});
		return '['+_.join(',')+']';
	}else if(a===null){
		return '';
	}else if(typeof(a)=='object'){
		var _ = [],
			z;
		each(a, function(b, i){
			z = objToJson(b);
			if(z) _.p(i+':'+z);
		});
		return '{'+_.join(',')+'}';
	}else{
		return a;
	}
}
function parse(a){
	try{
		if(!a || a=='nil'){
			return '';
		}else{
			eval('var z='+jsonToObj(a));
			return z;
		}
	}
	catch(e){
		alert('edit 128'+':'+e+'\n'+a);
	}
}

//obj
function extend(){
	var z = arguments;
	for(var i=1, len = z.length; i<len; i++){
		each(z[i], function(a, j){
			z[0][j] = a;
		});
	}
	return z[0];
}

//num
PI = Math.PI;
PI2 = PI+PI;
function between(min, max, c) {
    return Math.max(min, Math.min(max, c))
}
function getAngLen(dx, dy){
	return {ang:Math.atan2(dy, dx), len:getLen(dx, dy)};
}
function getLen(x, y){
	return Math.sqrt(x*x+y*y)
}
function pow2(a){
	return a*a;
}
function R(a){
	return a>>0;
}
function toHex(n){//10进制-> 16进制
	var z = Math.round(n).toString(16);
	return z.length==1 ? '0'+z : z
}

//color
function getRGBA(a, o) {
    /// <summary>返回color字符串</summary>
    var
	  r = '0x' + a.substring(1, 3)
	, g = '0x' + a.substring(3, 5)
	, b = '0x' + a.substring(5, 7);

    return ['rgba(', +r, ',', +g, ',', +b, ',', o, ')'].join('');
}

//str
function trim(a){
  return typeof(a)=="string" ? a.replace(/(^\s+)|(\s+$)/g,'') : a
};
function fixTo(a, b, c) {
    var s;
    var f = c || Math.round;
    if (isVoidN(a)) s = '';
    else if (typeof(b) == 'undefined') s = f(a * 100) / 100;
    else if (b === 0) s = f(a);
    else if (b == 1) s = f(a * 10) / 10;
    else if (b == 3) s = f(a * 1000) / 1000;
	else {
        s = f(a * 100) / 100
    }
    return s
}
function myLen(a) {
	return isVoid(a) ? 0 : a.length
	//isVoid([])==0
};

//loop
function each(obj, func){
	var is_array = isArray(obj);
	if(is_array){
		for(var i=0, len=obj.length; i<len; i++){
			func(obj[i], i, is_array);
		}
	}else if(!isVoidN(obj)){
		for(var i=0; i<obj; i++){
			func(i);
		}
	}else{
		for(var i in obj){
			func(obj[i], i, is_array);
		}
	}
}

//time
function getMS(){
	var z = new Date();
	return (z.getMinutes()*60+z.getSeconds())*1000+z.getMilliseconds()
}

//debug
function myalert() {
	var z = '';
	each(arguments, function(a){
		z += a + '; ';
	});
	alert(z);
};
function msg(){
	var z = '';
	each(arguments, function(a){
		z += a + '; ';
	});
	document.title = z;
}

//ajax
function Ajax(a){
	var _z = false; //xmlHTTP
	if(window.XMLHttpRequest){ // Mozilla, Safari,...
		_z = new XMLHttpRequest()
	}else if(window.ActiveXObject){ // IE
		try {		_z = new ActiveXObject("Msxml2.XMLHTTP")
		} catch(e){
			try {	_z = new ActiveXObject("Microsoft.XMLHTTP")
			} catch(e){}
		}
	}
	this.setRequest = function(url,fun,content,type){
		_z.open(type, type=='get' ? url+'?'+content : url, a==='syc' ? false : true);
		_z.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		_z.onreadystatechange = function(){
			if(_z.readyState==4 && _z.status==200){	fun(_z.responseText)}
		}
		_z.send(type=='get' ? 'NULL' : (content || 'NULL'))
	}
};
function setChannel(type){	//channel, ? Script : AJAX
	var _pool = {}
	, _state = {}
	, _timer = 0
	, _xmlhttp = type && type.toLowerCase()=='ajax' ? new Ajax() : ''
	, _app = 'http://hdcafe.com/feiheapp/call16.php'
	, callAjax = function(){
		var _gets = [];

		each(_pool, function(a, _key){
			_gets.p(_key + '=' + a);
		});

		_pool = {};
		var quest_str = _gets.join('&');
		quest_str = quest_str.replace(/#/g, '~');	//在createBook恢复

		//escape             不编码字符有69个：              * +   - . /         @ _   0-9 a-z A-Z
		//encodeURI          不编码字符有82个：! # $ & ' ( ) * + , - . / : ; = ? @ _ ~ 0-9 a-z A-Z
		//encodeURIComponent 不编码字符有71个：!       ' ( ) *     - .             _ ~ 0-9 a-z A-Z

		if(_xmlhttp){	//Ajax
			_xmlhttp.setRequest(_app, function(a){
				eval(a);
			}, quest_str, 'get');
		}
		else{		//Script
			if(!window.ajid){
				ajid = $A('',{type:'text/javascript'},'script');
			}
			ajid.src = _app + '?' + quest_str;
		}
	};

	//公有
	this.add = function(a,b,c){
		_pool[a] = b||0;
		clearTimeout(_timer);
		_timer = setTimeout(callAjax, c || 20)
	};

	_ = function(b){
		var y, x;
		each(b.split('^^'), function(a){
			y = a.split('::');
			x = y[0].split('=');
			switch (x[0]){
			case 'ex':
			case 'SAVE':
			case 'GPJC':
			case 'GROUP':
				break;
			default:
				redis.receive(y[1], x[1]);
			}
		});
	}

	this.sent = function(key, value, fun){
		this.add(key, value);
		this.fun = fun;
	};
	this.receive = function(result){
		if(this.fun){
			this.fun(result);
		}
	}
}

//prototype
Array.prototype.p = function(){
	this.push.apply(this,arguments);
}

//event
function addEvent(ele, type, fn){
	if(isIphone || isIpad){
		var mapping = {
			mousedown	: 'touchstart',
			mouseup		: 'touchend',
			mousemove	: 'touchmove'
		}
		type = mapping[type] || type;
	}
	if (ele.addEventListener) {
		ele.addEventListener(type, fn, false);
	}
	else {
		ele.attachEvent('on'+type, fn);
	}
}
function getEvent(e, def){
	e = e || window.event;
	if(!def){	//缺省执行
	//if(def){	//缺省不执行
		if(!e.stopPropagation){	//IE
			e.cancelBubble = true
		}else{
			e.stopPropagation()
		}
		if(!e.preventDefault){	//IE
			//e.returnValue = false
		}else{
			//e.preventDefault()
		}
	}
	e = e.touches ? e.touches[0] : e;
	//e.posX = e.clientX + scroll_div.scrollLeft;
	//e.posY = e.clientY + scroll_div.scrollTop;
	return e;
}

//dom
function $(a){		//document.getElement
	return document.getElementById(a);
}
function $C(tag){	//document.createElement
	return document.createElement(tag);
}
function $A(father, css, tag){
	tag = tag || 'div';
	var z = $C(tag);
	$S(z, extend({
		p: 'absolute'
	  , l: 0
	  , t: 0
	}, css));

	if(tag.toLowerCase()=='canvas'){
		if(z.getContext){
			z.ctx = z.getContext('2d');
			extend(z.ctx, {
				lineCap: 'round',
				lineJoin: 'round'
			});
		}else{	//IE6-8
			z.ctx = new ieCanvas(z)
		}
	}
	(father || document.body).appendChild(z);

	return z;
}
function $S(ele, css){
	if(typeof(ele)=='undefined' || !ele || !ele.style){
		return;
	}
	var	z = ele.style;
	var x, w;
	each(css, function(y, i){
		if(ele['_'+i] == y || isVoid(y)){
			return;
		}
		if(!isVoidN(y)){
			x = R(y) + 'px';
		}else{
			x = y;
		}
		ele['_'+i] = y;

		switch(i){
			case 'l': z.marginLeft 	=  x; break;
			case 't': z.marginTop 	=  x; break;
			case 'w': z.width 		=  x; break;
			case 'h': z.height 		=  x; break;

			case 'f': z.fontSize	=  x; break;
			case 'lh': z.lineHeight	=  x; break;

			case 'a': z.opacity		=  y; break;
			case 'c': z.color 		=  y; break;
			case 'd': z.display 	=  y; break;
			case 'o': z.overflow	=  y; break;
			case 'p': z.position	=  y; break;
			case 'z': z.zIndex		=  y; break;
			case 'cs': z.cursor		=  y; break;
			case 'ta': z.textAlign	=  y; break;
			case 'bd': z.border		=  y; break;
			case 'bg': z.background	=  y; break;

			case 'i': ele.innerHTML	=  y; break;
			case 'v': ele.value		=  y; break;
			case 'cn': ele.className=  y; break;
			
			case 'id':
			case 'src':
			case 'name':
			case 'type':
			case 'title':
			case 'value':
			case 'width':
			case 'height':
			case 'resize':
			case 'border':
			case 'cellSpacing':
			case 'cellPadding':	ele[i] = y; break;

			case 'p':
				var w = {};
				if(!isVoidN(y[0])) w.l = y[0];
				if(!isVoidN(y[1])) w.t = y[1];
				if(!isVoidN(y[2])) w.w = y[2];
				if(!isVoidN(y[3])) w.h = y[3];
				$S(ele, w);
				break;

			default : z[i] = y; break;
		}
	});
	return ele;
}
function $H(ele){
	$S(ele, {d: 'none'});
}
function $V(ele){
	$S(ele, {d: ''});
}
function $I(ele, str){
	$S(ele, {i: str || (str===0 ? '0' : '')});
}
function getPos(o) {
    var x = 0,
    y = 0;
    do {
        x += o._l || 0;
        y += o._t || 0;
    }
    while ((o = o.offsetParent));
    return {
        'x': x,
        'y': y
    };
};
function isHide(ele){
	if(ele){
		return ele._d=='none';
	}else{
		//alert('bad');
	}
}
function toggle(ele){
	isHide(ele) ? $V(ele) : $H(ele);
}

//canvas
function vec(canvas, w, h){
	canvas.width  = w;
	canvas.height = h;
}
extend(window.CanvasRenderingContext2D
	? CanvasRenderingContext2D.prototype
	: ieCanvas.prototype, (function(){
	fun1 = function(fun){
		return function(){
			this[fun].apply(this, arguments);
			return this;
		}	
	};
	fun2 = function(fun){
		return function(a){
			this[fun] = a;
			return this;
		}	
	};
	result = {};
	obj = {
		a: 'arc',
		b: 'beginPath',
		bc: 'bezierCurveTo',
		c: 'closePath',
		cl: 'clip',
		di: 'drawImage',
		fr: 'fillRect',
		ft: 'fillText',
		l: 'lineTo',
		m: 'moveTo',
		qc: 'quadraticCurveTo',
		r: 'rect',
		rs: 'restore',
		rt: 'rotate',
		sr: 'strokeRect',
		sv: 'save',
		tl: 'translate'
	};
	for(var i in obj){
		result[i] = fun1(obj[i]);
	}
	
	
	obj = {
		fo: 'font',
		fs: 'fillStyle',
		gc: 'globalCompositeOperation',
		lj: 'lineJoin',
		ss: 'strokeStyle'
	};
	for(var i in obj){
		result[i] = fun2(obj[i]);
	}
	
	extend(result, 	{
		as: function (a, b) {
			if(isIE678) return;
			each(b, function(z){
				a.addColorStop(z[0], z[1]);
			})
		}
		, cb: function (b, c, d, e, f) { //x, y, w, h, curv//1,2 // curvBorder
			b = b + .5;
			c = c + .5;
			d = d + b - 1;
			e = e + c - 1;
			f = f;
			this.lw()
			.b()
			.m(b + f, c)			//左上
			.l(d - f, c)			//右上
			.qc(d, c, d, c + f)
			.l(d, e - f)			//右下
			.qc(d, e, d - f, e)
			.l(b + f, e)			//左下
			.qc(b, e, b, e - f)
			.l(b, c + f)			//左上
			.qc(b, c, b + f, c)
			.c();

			return this;
		}
		, cg: function (r, w, c, a) {	//rate, width, color, opacity; curve border grad
			w = R(w);
			var o = this,
				z = R(w * r),
				y = R(w - z);

			o.b()	//纵过渡
			.lg(0, 0, 0, w, [
				[0, $T.getRGBA(c, 0)],
				[r, $T.getRGBA(c, a)],
				[1 - r, $T.getRGBA(c, a)],
				[1, $T.getRGBA(c, 0)]
			])
			.fr(z, 0, y - z, w)
			.b()	//左过渡
			.lg(0, 0, z, 0, [
				[0, $T.getRGBA(c, 0)],
				[1, $T.getRGBA(c, a)]
			])
			.fr(0, z, z, y - z)
			.b()	//右过渡
			.lg(y, 0, w, 0, [
				[0, $T.getRGBA(c, a)],
				[1, $T.getRGBA(c, 0)]
			])
			.fr(y, z, z, y - z)
			.b()	//1
			.rg(y, y, 0, y, y, z, [
				[0, $T.getRGBA(c, a)],
				[1, $T.getRGBA(c, 0)]
			])
			.a(y, y, z, 0, PI * 0.5, 0)
			.l(y, y)
			.c()
			.f()
			.b()	//2
			.rg(y, z, 0, y, z, z, [
				[0, $T.getRGBA(c, a)],
				[1, $T.getRGBA(c, 0)]
			])
			.a(y, z, z, PI * 1.5, 0, 0)
			.l(y, z)
			.c()
			.f()
			.b()	//3
			.rg(z, z, 0, z, z, z, [
				[0, $T.getRGBA(c, a)],
				[1, $T.getRGBA(c, 0)]
			])
			.a(z, z, z, PI, PI * 1.5, 0)
			.l(z, z)
			.c()
			.f()
			.b()	//4
			.rg(z, y, 0, z, y, z, [
				[0, $T.getRGBA(c, a)],
				[1, $T.getRGBA(c, 0)]
			])
			.a(z, y, z, PI * 0.5, PI, 0)
			.l(z, y)
			.c()
			.f();
			return this;
		}
		, cr: function (a, b, c, d) { this.clearRect(a || 0, b || 0, c || this.canvas.width, d || this.canvas.height); return this; }
		, f: function (a) { if (a) { this.fs(a) } this.fill(); return this; }
		, i: function (a, b) { this.cr().lc().lj().ml().b(); return this; }
		, lc: function (a) { this.lineCap = a || 'round'; return this; }
		, ln: function (a, b, c, d) { this.m(a, b).l(c, d); return this; }
		, lg: function (a, b, c, d, e, f) {
			var grad = this.createLinearGradient(a, b, c, d);
			this.as(grad, e);
			if (f) {
				this.ss(grad);
			}
			else {
				this.fs(grad);
			}
			return this;
		}
		, lw: function (a) { this.lineWidth = a || 1; return this; }
		, ml: function (a) { this.miterLimit = a || 3; return this; }
		, rg: function (a, b, c, d, e, f, g, h) {
			var grad = this.createRadialGradient(a, b, c, d, e, f);
			this.as(grad, g);
			if (h) {
				this.ss(grad);
			}
			else {
				this.fs(grad);
			}
			return this;
		}
		, s: function (a) { if (a) { this.ss(a) } this.stroke(); return this; }
		, sd: function (a, b, c, d) {
			if (a) {
				this.shadowOffsetX = a;
			}
			if (b) {
				this.shadowOffsetY = b;
			}
			if (c) {
				this.shadowColor = c;
			}
			if (d) {
				this.shadowBlur = d;
			}
			return this;
		}
		, ts: function (a, b, c) { this.font = a; this.textBaseline = b || 'top'; this.textAlign = c || 'left'; return this; }
		
	});
	return result;
})())

//css3D
function $S3D(ele, Perspective, PerspectiveOrigin){
	ele.style[pre('TransformStyle')] = 'preserve-3d';
	ele.style[pre('Perspective')] = Perspective || 300;
	ele.style[pre('PerspectiveOrigin')] =
		PerspectiveOrigin || '50% 50%';
	ele.state = {rx:0, ry:0, rz:0, tx:0, ty:0, tz:0, sc:1};
	ele.change = function(obj){
		each(obj, function(a, i){
			ele.state[i] = a;
		})
	}
}
function pre(a){
	return isFirefox
		? 'Moz'+a
		: (isOpera ? 'O'+a : 'Webkit'+a)
}
function set3D(obj, change){
	obj.change(change);
	var z = obj.state;
	var s = ([
		'rotateX(', z.rx || 0, 'deg) ',
		'rotateY(', z.ry || 0, 'deg) ',
		'rotateZ(', z.rz || 0, 'deg) ',
		'translate3d(',
			z.tx || 0, 'px, ',
			z.ty || 0, 'px, ',
			z.tz || 0, 'px) ',
		'scale(', z.sc || 1, ')'
	]).join('');
	obj.style[pre('Transform')] = s;
}

//image
function loadImages(files, callback){
	var imgs_num = 0;
	var imgs_obj = {};
	each(files, function(file, i){
		var img = new Image();
		img.src = file;
		img.onload = function(){
			imgs_num++;
			if(imgs_num==files.length){
				imgs_obj.is_ok = 1;
				callback();
			}
		};
		imgs_obj[file.replace('.','_')] = img;
	});
	return imgs_obj;
}