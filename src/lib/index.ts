// place files you want to import through the `$lib` alias in this folder.


/**
     * Converts the provided polyline to a longitude and latitude 
     * https://developers.google.com/maps/documentation/utilities/polylinealgorithm
     * @param encoded the polyline to be decoded
     * @returns an array of points decoded from the polyline
*/
export function decodePolyline(encoded: string): Array<{ lat: number, lng: number }> {


    let points: Array<{ lat: number, lng: number }> = [];

    let index = 0;
    let len = encoded.length;
    let lat = 0;
    let lng = 0;

    while(index < len) {
        let b: number;
        let shift = 0;
        let result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while(b >= 0x20);

        let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push({lat: lat / 1E5, lng: lng / 1E5 });
    }

    return points;

}


/**
     * Converts an array of longitude and latitude points into a .gpx file
     * @param points the array of points with a longitude and latitude to be converted into a gpx file
     * @returns the string content of a gpx file
*/
export function genGPX(points: Array<{ lat: number, lng: number }>): string {
    
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        gpx += `<gpx version="1.1" creator="PolylineToGPX" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n`;
        gpx += `  <trk>\n`;
        gpx += `    <trkseg>\n`;
    
    for(let i = 0; i < points.length; i++) {

        let point = points[i];
        gpx += `      <trkpt lat="${point.lat}" lon="${point.lng}"></trkpt>\n`;
    }

    gpx += `    </trkseg>\n`;
    gpx += `  </trk>\n`;
    gpx += `</gpx>`;

    return gpx;

}

/**
 * Converts the data from the strava API into a more useable format
 * @param data The LatLng data from a strava activity stream
 * @returns An array of the latlng data from the strava api
 */
export function normalizeStravaLatLng(data: { data: Array<Array<number>>, series_type: string, original_size: number, resolution: string }): Array< { lat: number, lng: number }> {

    let normalData: Array< { lat: number, lng: number } > = [];

    for(let i = 0; i < data.data.length; i++) {
        normalData.push({ lat: data.data[i][0], lng: data.data[i][1] })
    }

    return normalData;

}