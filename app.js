const pi = Math.PI
const tan = Math.tan

function is8thRadianOf(value, n) {
  return pi * (n - 1) / 4 <= value && value <= pi * n / 4
}

function clippath2str(patharray) {
  return patharray.map(function(point) {
    return point.map(function(value) {
      return (100 * value + '%')
    }).join(' ')
  }).join(', ')
}

function percentage2Clippath(percent, r = 0.5) {
  const theta = percent * 2 * pi
  const lt = [0, 0]
  const ct = [r, 0]
  const rt = [2 * r, 0]
  const rb = [2 * r, 2 * r]
  const lb = [0, 2 * r]
  const c = [r, r]
  if (is8thRadianOf(theta, 1)) {
    const x = r * (tan(theta) + 1)
    const y = 0
    return clippath2str([lt, ct, c, [x, y], rt, rb, lb])
  } else if (is8thRadianOf(theta, 2)) {
    const x = 2 * r
    const y = r * (1 - tan(pi / 2 - theta))
    return clippath2str([lt, ct, c, [x, y], rb, lb])
  } else if (is8thRadianOf(theta, 3)) {
    const x = 2 * r
    const y = r * (1 + tan(theta - pi / 2))
    return clippath2str([lt, ct, c, [x, y], rb, lb])
  } else if (is8thRadianOf(theta, 4)) {
    const x = 1 - r * (1 - tan(pi - theta))
    const y = 2 * r
    return clippath2str([lt, ct, c, [x, y], [0, 1]])
  } else if (is8thRadianOf(theta, 5)) {
    const x = r * (1 - tan(theta - pi))
    const y = 2 * r
    return clippath2str([lt, ct, c, [x, y], lb])
  } else if (is8thRadianOf(theta, 6)) {
     const x = 0
     const y = r * (1 + tan(pi * 3 / 2 - theta))
     return clippath2str([lt, ct, c, [x, y]])
  } else if (is8thRadianOf(theta, 7)) {
     const x = 0
     const y = r * (1 - tan(theta - pi * 3 / 2))
     return clippath2str([lt, ct, c, [x, y]])
  } else if (is8thRadianOf(theta, 8)) {
     const x = r * (1 - tan(2 * pi - theta))
     const y = 0
     return clippath2str([ct, c, [x, y]])
  }else {
    throw new Error("invalid value");
  }
};

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

    const right = document.querySelector( '#right')

    const renderClip = (percentage = 0.5) => {
      const clipPath = percentage2Clippath(percentage)
      right.style.setProperty( 'clip-path', `polygon(${clipPath})` )
      right.style.setProperty( '-webkit-clip-path', `polygon(${clipPath})` )
    }

    AColorPicker.from( '#color-picker' ).on( 'change', ( picker, color ) => {
      const rgb = AColorPicker.parseColor( color, "rgb" );
      const waterColor = [ rgb[0] * 0.4, rgb[1] * 0.4, rgb[2] * 0.4 ]
      leftMap.setPaintProperty( 'background', 'background-color', color );
      leftMap.setPaintProperty( 'water', 'fill-color', AColorPicker.parseColor( waterColor, "rgbcss" ) );
      leftMap.setPaintProperty( 'waterway_tunnel', 'line-color', AColorPicker.parseColor( waterColor, "rgbcss" ) );
      leftMap.setPaintProperty( 'waterway', 'line-color', AColorPicker.parseColor( waterColor, "rgbcss" ) );
    } )

    const slider = document
      .getElementById( 'percentage' )

    slider.addEventListener( 'input', function( event ) {
      renderClip( event.target.value )
    } )

    renderClip( slider.value )
  } )
})()
