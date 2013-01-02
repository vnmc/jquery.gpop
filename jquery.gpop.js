//	=================================================================
//	jquery.imagegallery
//	(c) 2012-2013 Vanamco GmbH, http://www.vanamco.com
//	jquery.imagegallery may be freely distributed under the MIT license
//	=================================================================

(function($){
    $.fn.gpop = function(myOptions){
        var options = $.extend(
            {
                scale:              1.3,
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
                    $root
                        .removeClass('gi-clonedImageInvisible')
                        .addClass('gi-clonedImageVisible')
                        .css('left', $image.data('offsetL'))
                        .css('top', $image.data('offsetT'))
                        .css('max-width', $image.data('w1'))
                        .find('img').attr('src', $image.attr('src'))
                        .css('width', $image.data('w1'))
                        .css('height', $image.data('h1'));

                    if($image.parent().is('a')){
                        $link.attr('href', $image.parent().attr('href'));
                    }
                    $text.html(options.renderDescription($image));
                },
                delay: 0
            }, 
            myOptions);
    
        
        var $wrapper = this, $clone = null, $root = null, $text = null, $link = null;
        var resizeTimer = null;
        var delayTimer = null;

        
        function create(){
            $root = $('<div></div>');
            $link = $('<a/>').appendTo($root);
            $clone = $('<img/>').appendTo($link);
            $text = $('<div/>').appendTo($root);
            $root.addClass('gi-clonedImageInvisible').addClass('gi-clonedImage').prependTo($wrapper);
        }
        
        function init(){

            var refPos = $wrapper.find('ul').position();
            

            $wrapper.find('li img').each(function(index, item){
                var w0 = $(this).width();
                var w1 = w0 * options.scale;
                var h0 = $(this).height();
                var h1 = h0 * options.scale;
                var offsetL = $(this).position().left;
                var offsetT = $(this).position().top;
                
                if(options.centered){
                    offsetL -= (w1-w0) / 2;
                    offsetT -= (h1-h0) / 2;
                }
                
                
                if(offsetL < refPos.left){
                    offsetL = refPos.left;
                }
                
                if(offsetT < refPos.top){
                    offsetT = refPos.top;
                }   

                           


                

                if(options.limitedToWrapper){
                    
                }
                $(this)
                    .data('h0', h0)
                    .data('h1', h1)
                    .data('w0', w0)
                    .data('w1', w1)
                    .data('offsetL', offsetL)
                    .data('offsetT',  offsetT);
                    
            });
            
            
            $root.on('mouseleave.gpop', function(event){
                $root.removeClass('gi-clonedImageVisible').addClass('gi-clonedImageInvisible');
            }); 
                        
            $(document).on('mouseenter.gpop', '.gi-gallery ul li a img', function(event){
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
                }
                resizeTimer = window.setTimeout(init, options.resizeTimeout);
            });
            
        } 

        create();
        init();
        return this;
    }
})(jQuery);
