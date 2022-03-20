

const getCoordinates = async () => {
    const pathname = window.location.pathname;
    const id = pathname.slice(pathname.lastIndexOf('/')+1);
    const res = await fetch(`/api/coordinates/${id}`)
    const listingCoordinates = await res.json()
    return listingCoordinates
}

const setMap = async () => {
    const coordinateData = await getCoordinates();
    mapboxgl.accessToken = coordinateData.body.token;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [coordinateData.body.coordinates[0], coordinateData.body.coordinates[1]], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    new mapboxgl.Marker()
    .setLngLat([coordinateData.body.coordinates[0], coordinateData.body.coordinates[1]])
    .addTo(map);
}

setMap();

