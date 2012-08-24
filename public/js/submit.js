var X, Y;

(function() {
 
    var WIDTH = 80;
    var HEIGHT = 80;

    var GRID = { width : 5, height : 7 };

    function downSample( id, PANE ) {
        var rez = [];

        var canvas = document.getElementById( id.substring(1) );
        // Get the 2D canvas context.
        var context = canvas.getContext('2d');

        var downSampler = DownSampler( id );

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

    function recognize() {
        $("#answer").html(""); 

        var result = downSample("#area", { width : 12, height : 5 } );

        renderDownsampled(result);
        renderData(result);

        var brojac = 0;
        var recognized = new Array( result.length ); 
        
        var url = "/recognize/som"; 

        for( var i = 0; i < result.length; i++ ) {
            if( result[i] === null ) continue;
            var data = [];

            for( var y = 0; y < GRID.height; y++) {
                for( var x = 0; x < GRID.width; x++) {
                    data.push( result[i][y][x] ? 1 : 0 );
                }
            }

            (function (i) {
                //console.log("saljem ", data);

                $.post( url , { data : data}, function( value ) {
                    recognized[i] = value;
                    
                    if( brojac === result.length - 1 ) {
                        console.log( recognized );
                    }

                });

            }(i));
        }

    }

    function train() {
        var result = downSample("#trainArea", { width : 12, height : 12 } );
        console.log( result );

        var ok = true;
        for( var i = 0; i < result.length; i++ ) {
            if( result[i] === null ) ok = false;
        }

        if( ok ) {
            $.post('/train', { 'data' : JSON.stringify( result ) } );
        }
    }



    $( function() { 
        $('#recognizeBtn').click( recognize );
        $('#trainBtn').click( train );
    });

})();
