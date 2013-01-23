//	=================================================================
//	jquery.gpop - v0.2.0
//	(c) 2012-2013 Vanamco GmbH, http://www.vanamco.com
//	jquery.imagegallery may be freely distributed under the MIT license
//	=================================================================

(function($){

    var $gpopRootShown = null;
    
    $.fn.gpop = function(myOptions){
        var options = $.extend(
            {
                scale:              1.03,
                resizeTimeout:      500,
                limitedToWrapper:   true,
                centered: true,
                renderDescription: function($image){
                    if($image.parent().next().length > 0){
                        return $image.parent().next().html();
                    }
                    else{
                        return '';
                    }

                },
                showHover: function($image){
					// render the popup
                	$root
                		.find('img').attr('src', $image.attr('src'))
                        .css('max-width', $image.data('w1'))
                        .css('width', $image.data('w1'))
                        .css('height', $image.data('h1'));
                        
                    if($image.parent().is('a')){
                        $link.attr('href', $image.parent().attr('href'));
                    }
                    $text.html(options.renderDescription($image));

					// position the popup
                	var offs = findOffset($image);
                    $root
                        .css('left', offs.left)
                        .css('top', offs.top);
                    
                    if ( $gpopRootShown != null ){
                        $gpopRootShown
                            .removeClass('gpop-clonedImageVisible')
                            .addClass('gpop-clonedImageInvisible');
                    }
                    $root
                            .removeClass('gpop-clonedImageInvisible')
                            .addClass('gpop-clonedImageVisible');
                    $gpopRootShown = $root;

                    
                },
                delay: 50
            }, 
            myOptions);
    
        
        var $wrapper = this, $clone = null, $root = null, $text = null, $link = null;
        var resizeTimer = null;
        var delayTimer = null;
        var myMouseX = 0, myMouseY = 0;

        
        function create(){
            $root = $('<div id="gpop-rootContainer"></div>');
            $link = $('<a/>').appendTo($root);
            $clone = $('<img/>').appendTo($link);
            $text = $('<div/>').appendTo($root);
            $root.addClass('gpop-clonedImageInvisible').addClass('gpop-clonedImage').prependTo($wrapper);
        }
        
        function init(){
            $wrapper.find('li img').each(function(index, item){
                var w0 = $(this).width();
                var w1 = w0 * options.scale;
                var h0 = $(this).height();
                var h1 = h0 * options.scale;
                $(this)
                    .data('h0', h0)
                    .data('h1', h1)
                    .data('w0', w0)
                    .data('w1', w1)
                    .data('offsetL', null)
                    .data('offsetT', null);
            });
            
            $root.on('mouseleave.gpop', function(event){
                $root.removeClass('gpop-clonedImageVisible').addClass('gpop-clonedImageInvisible');
                $gpopRootShown = null;
            }); 
                        
            $wrapper.on('mouseenter.gpop', 'ul li a img', function(event){
                if(delayTimer != null){
                    window.clearTimeout(delayTimer);
                }
                
                delayTimer = window.setTimeout(function(){
                    var $img = $(event.currentTarget);
                    options.showHover($img);
                }, options.delay);

            });
            
            $(window).on('resize.gpop', function(event){
                if(resizeTimer != null){
                    window.clearTimeout(resizeTimer);
                    // invalidate precalculated offsets
                    $wrapper.find('ul li img').each(function(index, item){
                    	$(this).data('offsetL', null).data('offsetT', null);
                    });
                }
                resizeTimer = window.setTimeout(init, options.resizeTimeout);
            });
        } 
        
        function findOffset($img){
        	var offsetL = $img.data('offsetL');
        	var offsetT = $img.data('offsetT');
        	
        	if(offsetL === null || offsetT === null)
			{        	
				// offsets haven't been set yet or have been invalidated: calculate
				var w0 = $img.data('w0');	// do we really want to store these values?
				var w1 = $root.outerWidth(true);
				var h0 = $img.data('h0');
				var h1 = $root.outerHeight(true);
				offsetL = $img.position().left;
				offsetT = $img.position().top;
						
				if(options.centered){
					offsetL -= (w1-w0) / 2;
					offsetT -= (h1-h0) / 2;
				}
				
				if(options.limitedToWrapper){
					var maxRight = 0;
					var maxBottom = 0;
					//var offsetWrapper = $wrapper.offset();
					$wrapper.find('ul li img').each(function(index, item){
						var offs = $(this).offset();
						maxRight = Math.max(maxRight, offs.left + $(this).width());
						maxBottom = Math.max(maxBottom, offs.top + $(this).height());
					});
	
					if(offsetL + w1 > maxRight){
						offsetL = maxRight - w1;
					}
					
					if(offsetT + h1 > maxBottom){
						offsetT = maxBottom - h1;
					}
				}
								
				var refPos = $wrapper.find('ul').position();

				if(offsetL < refPos.left){
					offsetL = refPos.left;
				}
				
				if(offsetT < refPos.top){
					offsetT = refPos.top;
				}
				
				// set offset data
				$img.data('offsetL', offsetL).data('offsetT', offsetT);
			}
			
			return {left: offsetL, top: offsetT};
        }

        create();
        init();
        return this;
    }
})(jQuery);
