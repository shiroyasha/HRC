(function() {
 
    var canvas;
    var context;

    var WIDTH = 80;
    var HEIGHT = 80;

    var HORIZONTAL = 5;
    var VERTICAL = 7;

    function crop( data ) {
        var min_x = WIDTH, min_y = HEIGHT, max_x = 0, max_y = 0;

        for( var i = 0; i < HEIGHT; i++ ) {
            for( var j = 0; j < WIDTH; j++ ) {
                
                var b = data[i*(WIDTH*4) + j * 4 + 3] == 0;
                
                if( !b ) {
                    //if( p + h == 0 ) console.log( data[i*(WIDTH*4) + j * 4],  data[i*(WIDTH*4) + j * 4 + 1], data[i*(WIDTH*4) + j * 4 + 2] );
                    if( min_x > j ) min_x = j;
                    if( min_y > i ) min_y = i;
                    if( max_x < j ) max_x = j;
                    if( max_y < i ) max_y = i;     
                }

            }
        }

        return { x : min_x, y : min_y, width : max_x - min_x, height : max_y - min_y }
    }

    function findPixel( x, y, width, height, data ) {
        
        //if( p + h == 0 ) console.log(x,  x + width ,y,  y + height, " -> ", data );

        for( var i = 0; i < width + 1; i++ ) {
            for( var j = 0; j < height + 1; j++ ) {

                //if(p + h == 0) console.log("incrop", i, j, data[ (i + y)*WIDTH*4 + (j + x)*4 + 3] == 0 );

                var b = data[ (i + y)*WIDTH*4 + (j + x)*4 + 3] == 0;

                if( !b ) return true;

            }
        }

        return false;
    }

    function downSampleRegion( ii, jj, data ) {

        var rez = [];
        var size = crop( data );

        var w = Math.floor( size.width / HORIZONTAL );
        var h = Math.floor( size.height / VERTICAL );

        if( ii + jj == 0 ) console.log( w, h );

        for( var i = 0; i < VERTICAL; i++ ) {
            for( var j = 0; j < HORIZONTAL; j++ ) {
                var fx = size.x + j*w;
                var fy = size.y + i*h;
                var fw = w;
                var fh = h;

                if( j == HORIZONTAL - 1 ) fw = size.width - j * w;
                if ( i == VERTICAL - 1 ) fh = size.height - i * h;
                
                //if( ii + jj == 0 ) console.log("crop", size.x + j * w , size.y + i * h, w, h, " -> ", f );
                //if( j==HORIZONTAL || i == VERTICAL ) console.log('special case');
                //console.log( fx, fy, fw, fh);
                rez.push( findPixel(fx, fy, fw, fh, data) ? 1 : 0 );
            }
        }
        /*
        //if( ii + jj == 0 ) { 
            console.log( ii, jj, " -> ", size.x, size.y, size.width, size.height );
            //console.log( "rez", rez );
            for( var i = 0; i < VERTICAL; i++ ) {

                var row = "";
                for( var j = 0; j < HORIZONTAL; j++ ) {
                    row += rez[i*HORIZONTAL + j] ? '# ' : '_ ';
                }

                console.log(row);
            }
        //}
        */

        //console.log( rez );
        return rez;
    }

    function downSample() {
        var rez = [];

        for( var i = 0; i < 12; i++ ) {
           for( var j = 0; j < 5; j++ ) {
                var d = context.getImageData( i * WIDTH, j * HEIGHT, WIDTH, HEIGHT );
                
                rez.push( downSampleRegion( i, j, d.data ) );
           } 
        }

        console.log( rez.length );

        //for( var i = 0; i < rez.length; i++)
        //    console.log( rez[i] );
        
        return rez;
    }

    function submit() {
        $('#answer').html('yay')

        var result = downSample();

        for( var i = 0; i < result.length; i++ ) {
            $.post('/', { data : result[i]}, function(data) {
                console.log(i, " -> ", data );
            });
        }
    }

    $( function() {

        canvas = document.getElementById("area");
        // Get the 2D canvas context.
        context = canvas.getContext('2d');
 
        $('.submit-btn').click( submit );
    });

})();
