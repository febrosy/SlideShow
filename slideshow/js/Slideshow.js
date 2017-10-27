;(function($){ 
	var Slide=function(Slide){
		var _self=this;
		//保存单个对象
		this.Slide=Slide;
		this.SlideAll=Slide.find(".SlideAll");
		this.SlidePrev=Slide.find(".SlidePrev");
		this.SlideNext=Slide.find(".SlideNext");
		this.SlideNodes=this.SlideAll.find("li.SlideNode");
		this.SlideFristNode=this.SlideNodes.first();
		this.SlideLastNode=this.SlideNodes.last();
		this.rotateFlag=true;
		this.setting={
			"width":500,  	     //幻灯片宽度
			"height":500,        //幻灯片高度
			"slideWidth":500,    //第一帧宽度
			"slideHeight":500,   //第一帧高度 
			"scale":0.9,      	 //比例大小
			"verticalAlign":"middle",  //其他帧数居中
			"speed":500,          //速度
			"autoPlay":true,    //自动播放
			"delay":500
		}
		$.extend(this.setting,this.getSetting());
		
		this.setSettingValue();
		this.setSlidePos();
		
		this.SlideNext.on("click",function(event){
			if(_self.rotateFlag){
				_self.carousRotate("left");
				_self.rotateFlag=false;
				event.stopPropagation();
			}
		});
		
		this.SlidePrev.on("click",function(event){
			if(_self.rotateFlag){
				_self.carousRotate("right");
				_self.rotateFlag=false;
				event.stopPropagation();
			}
		});
		
		//自动播放
		if(this.setting.autoPlay){
			this.autoPlay();
			this.Slide.hover(function(){
				window.clearInterval(_self.timer);
			},function(){
				_self.autoPlay();
			});
		}
	}
	
	Slide.prototype={
		//自动播放
		autoPlay:function(){
			var _self=this;
			this.timer=window.setInterval(function(){
				_self.SlideNext.click();
			},this.setting.delay);
		},
		
		//旋转木马效果
		carousRotate:function(dir){
			var _this_=this;
			
			var zindexArr=[];
			
			if(dir==="left"){
				this.SlideNodes.each(function(){
					var _self_=$(this),
						prev=_self_.prev().get(0)?_self_.prev():_this_.SlideLastNode,
						width=prev.width(),
						height=prev.height(),
						zIndex=prev.css("zIndex"),
						opacity=prev.css("opacity"),
						left=prev.css("left"),
						top=prev.css("top");
						zindexArr.push(zIndex);
						_self_.animate({
							width:width,
							height:height,
							opacity:opacity,
							left:left,
							top:top
							
						},_this_.setting.speed,function(){
							_this_.rotateFlag=true;
						});
				});
				
				this.SlideNodes.each(function(i){
					$(this).css("zIndex",zindexArr[i]);
				});
				
			}else if(dir==="right"){
				
				this.SlideNodes.each(function(){
					var _self_=$(this),
						next=_self_.next().get(0)?_self_.next():_this_.SlideFristNode,
						width=next.width(),
						height=next.height(),
						zIndex=next.css("zIndex"),
						opacity=next.css("opacity"),
						left=next.css("left"),
						top=next.css("top");
						zindexArr.push(zIndex);
						_self_.animate({
							width:width,
							height:height,
							opacity:opacity,
							left:left,
							top:top
							
						},_this_.setting.speed,function(){
							_this_.rotateFlag=true;
						});
				});
				
				this.SlideNodes.each(function(i){
					$(this).css("zIndex",zindexArr[i]);
				});
			}
		},
		
		//设置垂直对齐关系
		setverticalAlign:function(height){
			var verticalType=this.setting.verticalAlign,
			    top         =0;
			if(verticalType==="middle"){
				top=(this.setting.height-height)/2;
			}else if(verticalType==="top"){
				top=0;
			}else if(verticalType==="bottom"){
				top=this.setting.height-height;
			}else{
				top=(this.setting.height-height)/2;
			}
			return top;
		},
		
		//设置剩余帧数位置
		setSlidePos:function(){
			var self=this;
			
			var sliceSlideNodes =this.SlideNodes.slice(1),
				sliceSize 		=Math.floor(this.SlideNodes.size()/2),
				rightSlideNodes =sliceSlideNodes.slice(0,sliceSize),
				level			=Math.floor(this.SlideNodes.size()/2),
				leftSlideNodes  =sliceSlideNodes.slice(sliceSize);
			
			var rightwidth=this.setting.slideWidth,
				rightheight=this.setting.slideHeight,
				gap=((this.setting.width-this.setting.slideWidth)/2)/level;
				
			var fristLeft=(this.setting.width-this.setting.slideWidth)/2;
			var fixOffsetLeft=fristLeft+rightwidth;
			//设置右边帧数的各种参数信息
			rightSlideNodes.each(function(i){
				level--;
				rightwidth=rightwidth*self.setting.scale;
				rightheight=rightheight*self.setting.scale;
				
				var j=i;
				$(this).css({
					zIndex:level,
					width:rightwidth,
					height:rightheight,
					opacity:1/++j,
					left:fixOffsetLeft+(++i)*gap-rightwidth,
					top:self.setverticalAlign(rightheight)
				})
			});
			
			
			//设置左边帧数参数设置
			var leftwidth=rightSlideNodes.last().width(),
				leftheight=rightSlideNodes.last().height(),
				opacityLoop=Math.floor(this.SlideNodes.size()/2);
				
			leftSlideNodes.each(function(i){
				$(this).css({
					zIndex:i,
					width:leftwidth,
					height:leftheight,
					opacity:1/opacityLoop,
					left:i*gap,
					top:self.setverticalAlign(leftheight)
				});
				leftwidth=leftwidth/self.setting.scale;
				leftheight=leftheight/self.setting.scale;
				opacityLoop--;
			});
		},
		
		//控制基本高度宽度
		setSettingValue:function(){
			this.Slide.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.SlideAll.css({
				width:this.setting.width,
				height:this.setting.height
			});
			
			//上下切换按钮宽度
			var w=(this.setting.width-this.setting.slideWidth)/2;
			this.SlidePrev.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.SlideNodes.size()/2)
			});
			
			this.SlideNext.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.SlideNodes.size()/2)
			});
			
			this.SlideFristNode.css({
				left:w,
				width:this.setting.slideWidth,
				height:this.setting.slideHeight,
				zIndex:Math.floor(this.SlideNodes.size()/2)
				
			});
			
		},
		//获取人工配置参数
		getSetting:function(){
			var setting=this.Slide.attr("data-setting");
			if(setting&&setting!=''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		}
	}
	
	Slide.init=function(Slides){
		var _this_=this;
		Slides.each(function(){
			new _this_($(this));
		});
	}
	
	window["Slide"]=Slide;
	
})(jQuery);
