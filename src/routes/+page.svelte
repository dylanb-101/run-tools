<script lang="ts">

    import { decodePolyline, genGPX, normalizeStravaLatLng } from "$lib";

    import data from "$lib/test-data.json";

    console.log(data.latlng);

    let polyline: string = "heyo";

    /**
     * Downloads the gpx file based on whatever is input into the polyline input field
     */
    function downloadGPX() {

        let points = normalizeStravaLatLng(data.latlng);
        let gpxContent = genGPX(points);
        let blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        let url = URL.createObjectURL(blob);

        window.open(url);
    }

</script>

<body>

    <input bind:value={polyline} name="polyline"/>

    <button on:click={downloadGPX}>Convert to GPX</button>

</body>