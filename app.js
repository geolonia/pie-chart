(function(){
    const left = new geolonia.Map( document.querySelector( '#left .map' ) )
    const right = new geolonia.Map( document.querySelector( '#right .map' ) )

    const syncLeft = () => {
        right.off( 'move', syncRight )

        right.setCenter( left.getCenter() )
        right.setZoom( left.getZoom() )
    }

    const syncRight = () => {
        left.off( 'move', syncLeft )

        left.setCenter( right.getCenter() )
        left.setZoom( right.getZoom() )
    }

    right.on( 'moveend', () => {
        left.on( 'move', syncLeft )
    } )

    left.on( 'moveend', () => {
        right.on( 'move', syncRight )
    } )

    right.on( 'move', syncRight )
    left.on( 'move', syncLeft )
})()