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
					data.forEach(function(gal,index){
						var $imgD = $('<div class="box"><img src="'+ gal.img +'"></div>');
						$imgD.find('img').on('load',function(){
							if(index > _this.num-4) {
								_this.busy = false;
							}
							$('#masonry').masonry(masonry.settings);
						})
						$('#masonry').masonry().append($imgD).masonry( 'appended', $imgD ).masonry();
					})
					_this.start+=_this.num;
				},
				error: function(err){
					console.log(err);
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
		}
	}
	gals.init();
	gals.eventBind();
})