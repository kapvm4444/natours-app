//=>
// Main method to load the google map in the page
export const setGoogleMap = async (locations) => {
  const defaultCenterPoint = { lng: -118.286813, lat: 34.083757 };

  const { Map } = await google.maps.importLibrary('maps');
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
  const { LatLngBounds } = await google.maps.importLibrary('core');

  const map = new Map(document.getElementById('map'), {
    zoom: 9,
    center: defaultCenterPoint,
    mapId: '63d45b5ac32af0db',
  });

  const bounds = new LatLngBounds();

  locations.forEach((loc) => {
    const coordinates = {
      lat: loc.coordinates[1],
      lng: loc.coordinates[0],
    };

    const pin = document.createElement('div');
    pin.className = 'marker';

    const marker = new AdvancedMarkerElement({
      map: map,
      position: coordinates,
      content: pin,
      title: loc.description,
    });

    bounds.extend(coordinates);
  });

  const pad = 100;

  map.fitBounds(bounds, {
    top: pad,
    right: pad,
    bottom: pad,
    left: pad,
  });
};
