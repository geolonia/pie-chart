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
      const poi = event.features[0]

      if ( poi.properties.name ) {
        event.target.getCanvas().style.cursor = 'pointer'

        const table = `<table class="popup">
          <tr><th>Class</th><td>${poi.properties.class}</td></tr>
          <tr><th>Name</th><td>${poi.properties.name}</td></tr>
          <tr><th>Lat</th><td>${poi.geometry.coordinates[1]}</td></tr>
          <tr><th>Lng</th><td>${poi.geometry.coordinates[0]}</td></tr>
          </table>`

        popupLeft.setLngLat( poi.geometry.coordinates )
          .setHTML( table )
          .addTo( leftMap )

        popupRight.setLngLat( poi.geometry.coordinates )
          .setHTML( table )
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
