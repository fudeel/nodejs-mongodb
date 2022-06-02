const get_max_lat_max_lng_5_km = (lat, lng) => {
    const dy=2850000, dx=2850000, r_earth=6378137000;

    const new_latitude = lat + (dy / r_earth) * (180 / Math.PI);
    const new_longitude = lng + (dx / r_earth) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {"max_lat": new_latitude, "max_lng": new_longitude}
}


module.exports = { get_max_lat_max_lng_5_km }
