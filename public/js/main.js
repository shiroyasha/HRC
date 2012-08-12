(function() {

    var mouseDown = false;
    var lastx = 0, lasty = 0;
    var started= false;
    var eraser = false;

    var canvas;
    var context;

    function draw( ev ) {
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

    function clear() {
        var w = $('#area').width();
        var h = $('#area').height();
        context.clearRect( 0, 0, w, h );
    }

    $( function() {
        canvas = document.getElementById("area");
        // Get the 2D canvas context.
        context = canvas.getContext('2d');


        $("#area").mousedown( function() { mouseDown = true; });  

        $("body").mouseup( function() { mouseDown = false; started = false; });
        
        $("#area").mouseleave( function() { started = false; } );

        $("#area").mousemove( draw );

        $('.clear-btn').click( clear );

        $("body").keydown( function(e) { console.log(e.keyCode == 17) ; if(e.keyCode == 17) eraser = true; });
        $("body").keyup( function(e) { if(e.keyCode == 17){ eraser = false; started = false; } })
    });

})();
