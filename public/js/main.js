(function() {

    function DrawingArea( id ) {

        var mouseDown = false;
        var lastx = 0, lasty = 0;
        var started= false;
        var eraser = false;
 
        var canvas = document.getElementById( id.substring(1) );
        var context = canvas.getContext('2d');

        var public = {};
        
        function init() {
            $( id ).mousedown( function() { mouseDown = true; });  

            $("body").mouseup( function() { mouseDown = false; started = false; });
        
            $( id ).mouseleave( function() { started = false; } );

            $( id ).mousemove( public.draw );

            $("body").keydown( function(e) { console.log(e.keyCode == 17) ; if(e.keyCode == 17) eraser = true; });
            $("body").keyup( function(e) { if(e.keyCode == 17){ eraser = false; started = false; } })
        }

        public.clear = function() {
            var w = $( id ).width();
            var h = $( id ).height();
            context.clearRect( 0, 0, w, h );
        }

        public.draw = function( ev ) {
            if( !mouseDown ) return;
            //console.log('crtanje');
            var x, y;

            // Get the mouse position relative to the canvas element.
            if (ev.layerX || ev.layerX == 0) { // Firefox
                x = ev.layerX;
                y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                x = ev.offsetX;
                y = ev.offsetY;
            }
            //console.log( x, y );
            // The event handler works like a drawing pencil which tracks the mouse 
            // movements. We start drawing a path made up of lines.

            var gCO = context.globalCompositeOperation;
            if( eraser ) {
                context.globalCompositeOperation = "destination-out";
                context.strokeStyle = "rgba(0,0,0,1.0)";
                context.lineWidth = 10; 
            } else {
                context.lineWidth = 1;
            }

            if (!started) {
                context.beginPath();
                context.moveTo(x, y);
                started = true;
            } else {
                context.lineTo(x, y);
                context.stroke();
            }    

            if( eraser ) {
                context.globalCompositeOperation = gCO;
                context.lineWidth = 1;
            }
        }
        
        init();
        return public;        
    }




    $( function() {
        var area = DrawingArea("#area");
        var train = DrawingArea("#trainArea");

        $('#clearBtn').click( area.clear );
    });

})();
