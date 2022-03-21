/*  
Mozilla's Using Geolocation API Guide Start + Google Geolocation API Start
Mozilla Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API 
Google Source: https://developers.google.com/maps/documentation/javascript/geolocation
*/

function geoFindMe() {

    const status = document.getElementsByClassName("info-box")[0];

    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                // Do something for the user here. 
                db.collection("users").doc(user.uid)
                    .get()
                    .then(function (doc) {
                        var xpos = doc.data().lat;
                        var ypos = doc.data().lng;


                        const pos = {
                            lat: xpos,
                            lng: ypos,
                        };
                
                        map.setCenter(pos);
                        map.setZoom(11)
                
                        var x = document.getElementsByClassName("info-box")[0];
                        x.style.display = "block";
                
                        status.innerHTML = '<span id="close"><i class="fa fa-times-circle"></i></span>'
                        + '<p>Your Location: </p>'
                        + '<p>Latitude: '  + xpos + '</p>'
                        + '<p>Longitude: '  + ypos + '</p>'
                
                        document.getElementById("close").addEventListener("click", hideItem);
                    })
                }
            })
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
}

document.querySelector('#locate-me').addEventListener('click', geoFindMe);

/*
Mozilla's Using Geolocation API Guide Start + Google Geolocation API End
Mozilla Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
Google Source: https://developers.google.com/maps/documentation/javascript/geolocation
*/

    /* How TO - Toggle Hide and Show START
    @Author: W3Schools
    @link: https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp */

    function hideItem() {
        var x = document.getElementsByClassName("info-box")[0];
        x.style.display = "none";
    }

    /* How TO - Toggle Hide and Show END
        @Author: W3Schools
        @link: https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp */