/**
 * Straight Line distance calculator
 * Input: Source { lat:<number>m lng:<number> } , Destination { lat:<number>m lng:<number> }
 * Output: Number
 */
exports.beelineDistanceCalculatorService = (src,dest) =>{

    if ((src.lat == dest.lat) && (src.lon == dest.lon)) {
		return 0;
	}

    const radlat1 = Math.PI * src.lat/180;
    const radlat2 = Math.PI * dest.lat/180;
    const theta = src.lon-dest.lon;
    const radtheta = Math.PI * theta/180;
    const dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344; 
    
}