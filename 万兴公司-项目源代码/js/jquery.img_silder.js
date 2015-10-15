/**

 * 图片切换插件
 * Dependence jquery-1.7.2.min.js
 **/

(function ($) {
  $.fn.silderDefaults = { //默认参数
    s_width:500, //容器宽度
	s_height:395, //容器高度
	is_showTit:false, // 是否显示图片标题 false :不显示，true :显示
	s_times:3000, //设置滚动时间
  };
  $.extendSilder = function (obj,opt) { //obj 元素对象，opt 参数对象
    var g = {  //公共方法， 外部可调用
      //初始化
		init: function () {
			var wh ={width:opt.s_width,height:opt.s_height};
			var pagesize=0; //页码
			var silderList = $('#silder_list',g.obj);
			var silderList_li = $('#silder_list li',g.obj);
			g.obj.css(wh); silderList.css(wh); silderList_li.find('img').css(wh); //设置宽高属性
			var currHtml = ""; //加入播放页码 
			img_size = silderList_li.size() ;//图片个数
			
			currHtml += "<ul class='silder_page' id='silder_page'>";//分页码代码注入
			for(var i=0; i < img_size; i++){
				currHtml += "<li>"+ '' +"</li>";
			}
			currHtml +="</ul>";
            silderList_li.eq(0).show().siblings().hide(); //初始化隐藏其他图片
			g.obj.append(currHtml);//注入分页码
			var silderPage = $('#silder_page',g.obj);
			var silderPage_li =$('#silder_page li',g.obj);
			silderPage_li.eq(0).addClass('current');
			
			silderPage_li.on('click',function(){
				pagesize = $(this).index();
				silderList_li.eq(pagesize).fadeIn(1000).siblings().fadeOut(100);
				$(this).addClass('current').siblings().removeClass('current');
			});
			
			var t;
			silderList.hover(function(){window.clearInterval(t); return;},function(){ t = window.setInterval(function(){
				if(pagesize < img_size && pagesize >= 0)
				{
					silderList_li.eq(pagesize).fadeIn(1000).siblings().fadeOut(100);
					silderPage_li.eq(pagesize).addClass('current').siblings().removeClass('current');
					pagesize++;
					if(pagesize >= img_size){
						pagesize = 0;
					}
				}
			},opt.s_times);}).trigger("mouseout"); //悬浮时 停止自动动画,trigger 起默认触发作用
			
		}
    };
    g.obj = $(obj);
    g.init();
    return g;
  }
  $.fn.imgSilder = function (options) {
    if (this.length == 0) return; //判断对象是否存在
    this.each(function () {
      if (this.usedSilder) return;
      var opt = $.extend({}, $.fn.silderDefaults, options); //合并已赋值参数
      this.usedSilder = $.extendSilder(this, opt);
    });
  }
})(jQuery);