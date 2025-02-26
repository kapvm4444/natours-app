export const setMapboxMap = (locations) => {
  const defaultCenterPoint = [-118.286813, 34.083757];

  mapboxgl.accessToken =
    'pk.eyJ1Ijoia2Fwdm0iLCJhIjoiY201aDUwNG0zMGN1bDJqczYybm1vemNiZCJ9.y2MVT4rTGjVpjW-utihvfA';

  const map = new mapboxgl.Map({
    container: 'map',
    center: defaultCenterPoint,
    zoom: 9,
    style: 'mapbox://styles/kapvm/cm5h6ozro000h01s9g2h1g1z9',
    // scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const pin = document.createElement('div');
    pin.className = 'marker';

    new mapboxgl.Marker({
      element: pin,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 200,
      right: 200,
    },
  });
};
