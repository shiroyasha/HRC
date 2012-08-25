var DownSampler = function(id) {
    public = {};

    function visual(color, x, y, w, h ) {
        if( !VISUAL ) return;
        //console.log( X, Y );
        var canvas = document.getElementById( id.substring(1) );
        // Get the 2D canvas context.
        var c = canvas.getContext('2d');
        c.save();
        c.lineWidth = 1;
        c.strokeStyle= color;
        c.strokeRect( X + x, Y + y, w, h );
        c.restore();
        
    }

    public.crop = function(image, log) {
        var ret = {};
        min_x = image.width;
        min_y = image.height;
        max_x = 0;
        max_y = 0;
        
        for( var i = 0; i < image.height; i++ ) {
          for( var j = 0; j < image.width; j++ ) {
                
            var b = image.data[i*(image.width*4) + j * 4 + 3] === 0;
            if( log ) console.log( i, j, b );    
            if( !b ) {
              if( min_x >= j ) min_x = j;
              if( min_y >= i ) min_y = i;
              if( max_x < j ) max_x = j;
              if( max_y < i ) max_y = i;     
            }

          }
       }
       ret.x = min_x;
       ret.y = min_y;
       ret.width = max_x - min_x;
       ret.height = max_y - min_y;
   
       return (ret.width <= 0 || ret.height <= 0 ) ? null : ret;
    }

    function findPixel( image, area ) {

      for( var i = 0; i < area.height; i++ ) {
        for( var j = 0; j < area.width; j++ ) {

          if( image.data[ (i + area.y)* image.width *4 + (j + area.x)*4 + 3] !== 0 ) {
            return true;
          } 

        }
      }
      return false;      
    }

    public.downSample = function(image, grid) {
       var ret = new Array(grid.height);
       for( var i = 0; i < ret.length; i++) {
           ret[i] = new Array(grid.width);
       }

       var area = public.crop(image);
       if( area === null ) return null;

       var w = Math.floor( area.width / grid.width);
       var h = Math.floor( area.height / grid.height);
       //console.log( area, w, h );

       for( var i = 0; i < grid.height; i++ ) {
           for( var j = 0; j < grid.width; j++) {

               var arg = {};
               arg.x = area.x + j * w ;
               arg.y = area.y + i * h ;

               arg.width = ( j < grid.width - 1 ) ? w : area.width - j*w ;
               arg.height = ( i < grid.height - 1 ) ? h : area.height - i*h ;
              
               //console.log( arg );
               ret[i][j] = findPixel( image, arg );
               visual( "#f00", arg.x, arg.y, arg.width, arg.height );
           }
       }
       visual( "#0f0", area.x, area.y, area.width, area.height );

       //console.log( ret );

       return ret;
    }    
           
    return public;
};
