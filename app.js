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

    const popupLeft = new mapboxgl.Popup( {
      closeButton: false,
      closeOnClick: false
    } )

    const popupRight = new mapboxgl.Popup( {
      closeButton: false,
      closeOnClick: false
    } )

    const addPopup = ( event ) => {
      if ( event.features[0].properties.name ) {
        event.target.getCanvas().style.cursor = 'pointer'

        popupLeft.setLngLat( event.features[0].geometry.coordinates )
          .setText( event.features[0].properties.name )
          .addTo( leftMap )

        popupRight.setLngLat( event.features[0].geometry.coordinates )
          .setText( event.features[0].properties.name )
          .addTo( rightMap )
      }
    }

    const removePopup = ( event ) => {
      event.target.getCanvas().style.cursor = ''

      popupLeft.remove()
      popupRight.remove()
    }

    [ rightMap, leftMap ].forEach( ( map ) => {
      map.on('mouseenter', 'poi', addPopup );
      map.on('mouseleave', 'poi', removePopup );
    } )
  } )
})()
