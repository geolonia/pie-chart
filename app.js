(function(){
    const rightMap = new geolonia.Map( document.querySelector( '#right .map' ) )

    rightMap.on( 'load', () => {
        const leftMap = new geolonia.Map( document.querySelector( '#left .map' ) )
        leftMap.setCenter( rightMap.getCenter() )
        leftMap.setZoom( rightMap.getZoom() )
        leftMap.setPitch( rightMap.getPitch() )
        leftMap.setBearing( rightMap.getBearing() )

        const syncLeftMap = () => {
            rightMap.off( 'move', syncRightMap )
    
            rightMap.setCenter( leftMap.getCenter() )
            rightMap.setZoom( leftMap.getZoom() )
            rightMap.setPitch( leftMap.getPitch() )
            rightMap.setBearing( leftMap.getBearing() )
        }
    
        const syncRightMap = () => {
            leftMap.off( 'move', syncLeftMap )
    
            leftMap.setCenter( rightMap.getCenter() )
            leftMap.setZoom( rightMap.getZoom() )
            leftMap.setPitch( rightMap.getPitch() )
            leftMap.setBearing( rightMap.getBearing() )
        }
    
        rightMap.on( 'moveend', () => {
            leftMap.on( 'move', syncLeftMap )
        } )
    
        leftMap.on( 'moveend', () => {
            rightMap.on( 'move', syncRightMap )
        } )
    
        rightMap.on( 'move', syncRightMap )
        leftMap.on( 'move', syncLeftMap )
    } )
})()