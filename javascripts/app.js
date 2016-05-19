$(function(){
	var masonry = {
		settings: {
		    itemSelector: '.box',
		    gutter: 20
		}
	}
	var gals = {
		start: null,
		num: null,
		type: null,
		busy: false,
		init: function(){
			this.start = 0;
			this.num = 30;
			this.type = 1;
			this.getGals();
		},
		getGals: function(){
			var _this = this;
			_this.busy = true;
			$.ajax({
				type: 'get',
				url: 'http://ghost2dj.duapp.com/k/getGals',
				dataType:'jsonp',
				jsonp:'cb',
				data: {
					start: this.start,
					num: this.num,
					type: this.type
				},
				success: function(data){
					_this.loadNum = 0;
					_this.dataLen = data.length;
					data.forEach(function(gal,index){
						var html = '<div class="box">'+
										'<div class="imgBox" data-clipboard-text="'+ gal.torrent +' title="Click to copy to clipboard.">'+
											'<img src="'+ gal.img +'">'+ (
												gal.torrent?
													'<div class="shadow "><p>点击复制磁力链</p></div>':
													'<div class="shadow "><p>无资源</p></div>'
													) +
										'</div>'+
										'<div class="content">'+
											'<ul>'+
												'<li>'+
													'<p class="title">游戏名</p>'+
													'<p class="ellipsis">'+ gal.title +'</p>'+
												'</li>'+
												'<li>'+
													'<p class="title">发售日期</p>'+
													'<p class="ellipsis">'+ gal.date +'</p>'+
												'</li>'+
												'<li>'+
													'<p class="title">大小</p>'+
													'<p class="ellipsis">'+ gal.size +' G</p>'+
												'</li>'+
											'</ul>'+
										'</div>'+
									'</div>';
						var $imgD = $(html);
						$imgD.find('img').on('load',function(){
							_this.loadNum ++;
							if(_this.loadNum >= _this.dataLen-4){
								console.log('执行');
								$('#masonry').masonry(masonry.settings);
								_this.busy = false;
							}
						});
						$('#masonry').masonry().append($imgD).masonry( 'appended', $imgD ).masonry();
					})
					_this.start+=_this.num;
				},
				error: function(err){
					console.log(err);
					setTimeout(function(){_this.getGals();},500)
				},
				done: function(data){
					console.log(data)
				}
			})
		},
		eventBind: function(){ 
			var _this = this;
			$(document).scroll(function(){  
			   if($(this).height() - $(window).height() - $(this).scrollTop() <10 && !_this.busy){ 
			   		_this.getGals();
			   }  
			});
			
			$('#masonry').on('mouseover','.imgBox',function(){
				var client = new ZeroClipboard(this);
				client.on( "aftercopy", function( event ) {
					t = setTimeout(function(){
						clearTimeout(t);
						alert('复制成功',event.target);
					},100);	
				});
			});
			window.alert = function(msg,el){
				$(el).parent().append('<p class="alert">'+ msg +'</p>');
				setTimeout(function(){
					$('.alert').fadeOut('slow',function(){
						$(this).remove();
					});
				},800)
			};
			
		}
	}
	gals.init();
	gals.eventBind();
})