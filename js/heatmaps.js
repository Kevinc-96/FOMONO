displayTrendingData();
/* Google Maps HeatMaps Sample Start
source: https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap#maps_layer_heatmap-javascript
*/
function loadHeatMap(heatmapdata) {
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapdata,
        map: map,
    });
    heatmap.set("radius", 30);
    heatmap.set("opacity", 1);
    document.getElementById("toggle-heatmap").addEventListener("click", toggleHeatmap);
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

/* Google Maps HeatMaps Sample Start
source: https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap#maps_layer_heatmap-javascript
*/


/* function userHeat() {
    navigator.geolocation.getCurrentPosition(success);
    function success(position) {
        userheatmap = new google.maps.visualization.HeatmapLayer({
            data: new google.maps.LatLng(49.18395451634957, -123.13416386615923),
            map: map,
          });
          userheatmap.set("radius", 10);
    }
}
 */

function displayTrendingData() {
    db.collection("malls")
      .orderBy("currentvisitorcount", "desc")
      .limit(3)
      .get()
      .then(function (snap) {
        var count = 1;
        var heatmapdata = [];
          snap.forEach(function (doc) {
            var x = doc.data().lat;
            var y = doc.data().lng;

            heatmapdata.push(new google.maps.LatLng(x, y));

            const userIcon = new google.maps.Marker({
                position: { lat: x, lng: y },
                map,
                title: "Rank: " + count.toString(),
                label: {
                    text: count.toString(),
                    fontSize: "11px",
                    className: "rank-label"
                },
                icon: {
                    url: "/images/fire.png",
                    scaledSize: new google.maps.Size(26, 26)
                },
            });
            userIcon.setZIndex(180);
            count++;
          })
          loadHeatMap(heatmapdata);
      })
  }
