var X, Y;

(function() {
 
    var canvas;
    var context;

    var WIDTH = 80;
    var HEIGHT = 80;

    var PANE = { width : 12, height : 5 };
    var GRID = { width : 10, height : 14 };

    function downSample() {
        var rez = [];

        var downSampler = DownSampler();

        for( var j = 0; j < PANE.height ; j++ ) {
           for( var i = 0; i < PANE.width ; i++ ) {
                var image = context.getImageData( i * WIDTH, j * HEIGHT, WIDTH, HEIGHT );

                X = i * WIDTH;
                Y = j * HEIGHT;
                
                rez.push( downSampler.downSample( image, GRID ) );
           }
        }

        return rez;
    }

    function renderDownsampled(rez) {
        $('#answer').append("<canvas width=961 height=401 id='area2'> </canvas>");

        var canvas2 = document.getElementById("area2");
        var c2 = canvas2.getContext('2d');

        for( var i = 0; i < rez.length; i++) {
            
            if( rez[i] === null ) continue;

            for( var y = 0; y < GRID.height; y++) {

                for( var x = 0; x < GRID.width; x++) {

                    if( rez[i][y][x] === true ) {
                        
                        var w = 70 / GRID.width;
                        var h = 70 / GRID.height;
                        
                        c2.fillRect( 5 + (i % 12) * 80 + x*w ,
                                     5 +  Math.floor( i / 12 ) * 80 + y*h,
                                      w,
                                      h );
                    }  
                }
            }
        }

    }

    function renderData(rez) {
        for( var i = 0; i < rez.length; i++) { 
            if( rez[i] === null ) continue;

            var d = "[ ";
            for( var y = 0; y < GRID.height; y++ ) {
                for( var x = 0; x < GRID.width; x++) {
                    var b = rez[i][y][x] ? 1 : 0;
                    d += ( x == GRID.width - 1 && y == GRID.height - 1) ? b : b + ", " ;    
                }
            }    
            d += i === rez.lenght - 1 ? "]" : "],";
            $("#answer").append("<p>" + d + "</p>");
        }
    }

    function submit() {
        $("#answer").html(""); 

        var result = downSample();

        renderDownsampled(result);
        renderData(result); 
        
        /*
        for( var i = 0; i < result.length; i++ ) {
            $.post('/', { data : result[i]}, function(data) {
                console.log(i, " -> ", data );
            });
        }
        */
    }



    $( function() {

        canvas = document.getElementById("area");
        // Get the 2D canvas context.
        context = canvas.getContext('2d');
 
        $('.submit-btn').click( submit );
    });

})();
