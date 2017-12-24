(function($) {
    "use strict";

    // Detecting IE
    var oldIE;
    if ($('html').is('.lt-ie7, .lt-ie8, .lt-ie9')) {
        oldIE = true;
    }

    if (oldIE) {
        // JS for IE..
    } else {

        $('img.inline-svg').each(function() {
            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('srcset');

            $.get(imgURL, function(data) {
                var $svg = $(data).find('svg');

                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns:a');
                $svg = $svg.removeAttr('xmlns');
                $svg = $svg.removeAttr('xmlns:xlink');

                $img.replaceWith($svg);
                
            }, 'xml');

        });
    }

}(jQuery));