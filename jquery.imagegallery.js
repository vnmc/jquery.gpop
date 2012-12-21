//	=================================================================
//	jquery.imagegallery
//	(c) 2012 Vanamco GmbH, http://www.vanamco.com
//	jquery.imagegallery may be freely distributed under the MIT license
//	=================================================================

(function($){
    $.fn.imagegallery = function(myOptions){
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
                }
            }, 
            myOptions);
    
        
        var $wrapper = this, $clone = null, $root = null, $text = null, $link = null;
        var resizeTimer = null;

        
        function create(){
            $root = $('<div></div>');
            $link = $('<a/>').appendTo($root);
            $clone = $('<img/>').appendTo($link);
            $text = $('<div/>').appendTo($root);
            $root.addClass('clonedImageInvisible').addClass('clonedImage').prependTo($wrapper);
        }
        
        function init(){
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
            
            
            $root.on('mouseleave.imagegallery', function(event){
                $root.removeClass('clonedImageVisible').addClass('clonedImageInvisible');
            }); 
                        
            $(document).on('mouseenter.imagegallery', '.gallery ul li a img', function(event){
                var $img = $(event.currentTarget);
                $root
                    .removeClass('clonedImageInvisible')
                    .addClass('clonedImageVisible')
                    .css('left', $img.data('offsetL'))
                    .css('top', $img.data('offsetT'))
                    .css('max-width', $img.data('w1'))
                    .find('img').attr('src', $img.attr('src'))
                    .css('width', $img.data('w1'))
                    .css('height', $img.data('h1'));

                if($img.parent().is('a')){
                    $link.attr('href', $img.parent().attr('href'));
                }
                $text.html(options.renderDescription($img));
            });
            
            $(window).on('resize.imagegallery', function(event){
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