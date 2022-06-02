const get_max_lat_max_lng = (lat, lng, maxDistance) => {
    const r_earth=6378137000;
    let dy = 0, dx = 0;

    if (maxDistance === 5) {
        dy=2850000
        dx=2850000;
    } else if (maxDistance === 10) {
        dy=5700000
        dx=5700000;
    } else if (maxDistance === 15) {
        dy=8550000
        dx=8550000;
    } else if (maxDistance === 20) {
        dy=11400000
        dx=11400000;
    } else {
        dy=14250000
        dx=14250000;
    }

    const new_latitude = lat + (dy / r_earth) * (180 / Math.PI);
    const new_longitude = lng + (dx / r_earth) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {"max_lat": new_latitude, "max_lng": new_longitude}
}


module.exports = { get_max_lat_max_lng }
