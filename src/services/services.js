/**
 * Straight Line distance calculator
 * Input: Source { lat:<number>m lng:<number> } , Destination { lat:<number>m lng:<number> }
 * Output: Number
 */
exports.beelineDistanceCalculatorService = (src,dest) =>{
    
    const toRadian = (n) => n* Math.PI / 100
    const earthRadius = 6371; // km
    lat1 = parseFloat(src.lat);
    lat2 = parseFloat(dest.lat);
    lon1 = parseFloat(dest.lng);
    lon2 = parseFloat(dest.lng);

    let dLat = toRadian(lat2 - lat1);
    let dLon = toRadian(lon2 - lon1);
    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earthRadius * c;

    return Math.round(d * Math.pow(10, 4)) / Math.pow(10, 4);
    
}