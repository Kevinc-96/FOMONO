document.addEventListener("DOMContentLoaded", function (event) {

    var x = document.getElementsByClassName("info-box")[0];
    x.style.display = "none";

    /* Google Maps Markers API Start
    source: https://developers.google.com/maps/documentation/javascript/markers
    
    Google Maps Geolocation API Start
    source: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation#maps_map_geolocation-javascript
     */
    function initMap() {
        map = new google.maps.Map(document.getElementById('map-goes-here'), {
            center: { lat: 49.23156157012451, lng: -123.07835074745864 },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            zoom: 11,
            gestureHandling: "greedy",
            mapId: '5f0967f90853399b'
        });
    }
    initMap();
    loadMarkers();
    displayFriendsOnMap();
    locateUser();
    updateCurrentVisitors();
    updateVisitorNumber();  
    /* loadHeatMap(); */
    /* userHeat(); */

    function error() {
        status.textContent = 'Cannot find your location';
    }

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


    /*
Mozilla's Using Geolocation API Guide Start
Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
*/

    function locateUser() {
        var conditions = {
            enableHighAccuracy: true
        };

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser';
        } else {
            status.textContent = 'Finding your position...';
            navigator.geolocation.getCurrentPosition(success, error, conditions);
        }

        function success(position) {
            firebase.auth().onAuthStateChanged(function (user) {
                var x = position.coords.latitude
                var y = position.coords.longitude
                console.log("User Position: " + "lat: " + x + " lng: " + y);
                 if (user) {
                    db.collection("users").doc(user.uid).update({
                        "lat": x,
                        "lng": y
                    })
                }  

            });

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    db.collection("users").doc(user.uid)
                        .get()
                        .then(function (doc) {
                            var name = doc.data().name;
                            var icon = doc.data().icon;
                            var x = doc.data().lat;
                            var y = doc.data().lng;
                            var string = "/images/" + icon

                            const userIcon = new google.maps.Marker({
                                position: { lat: x, lng: y },
                                map,
                                title: name,
                                label: {
                                    text: "Me",
                                    fontSize: "10px",
                                    className: "me-label",
                                },
                                icon: {
                                    url: string,
                                    scaledSize: new google.maps.Size(28, 28),
                                },
                            });

                            userIcon.setZIndex(200);
                            userIcon.addListener("click", () => {
                                console.log("User clicked");

                            });
                        })
                }
            });
        }
    }

    /*
    Mozilla's Using Geolocation API Guide End
    Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
    */

    function loadMarkers() {
        db.collection("malls")
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    var x = doc.data().lat;
                    var y = doc.data().lng;
                    var title = doc.data().name;
                    var image = doc.data().iconURL;
                    var icon = doc.data().picture;
                    var desc = doc.data().description;
                    var likes = doc.data().likes;
                    var currentvisitors = doc.data().currentvisitors.length;
                    var unique = doc.data().uniquevisitors.length;
                    var favorites = doc.data().favoritescount.length;
                    var likeid = "like" + doc.id;
                    var favoriteid = "favorite" + doc.id;
                    var locationid = "location" + doc.id;
                    var id = doc.id;

                    const marker = new google.maps.Marker({
                        position: { lat: x, lng: y },
                        map,
                        title: title,
                        icon: {
                            url: image,
                            scaledSize: new google.maps.Size(38, 38)
                        },
                        /* animation: google.maps.Animation.DROP */
                    });

                    marker.set("id", doc.id);

                    const contentString =
                        '<span id="close"><i class="fa fa-times-circle"></i></span>'

                        + '<div class="info-window-content">'
                        + '<div class="selected-icon" id="' + locationid + '">'
                        + '<img src="/images/' + icon + '\"' + ' alt=' + title + '>'
                        + '</div>'
                        + '<b>' + title + '</b>'
                        + "<br>"

                        + '<div class="location-buttons">'

                        + '<div class="like">'
                        + '<button class="like-button" id="' + likeid + '">' + '<i class="fa fa-thumbs-up"></i></button>'
                        + '<span class="like-count">' + likes + '</span>'
                        + '</div>'

                        + '<div class="favorite">'
                        + '<button class="favorite-button" id="' + favoriteid + '">' + '<i class="fa fa-heart"></i></button>'
                        + '<span class="favorite-count">' + favorites + '</span>'
                        + '</div>'

                        + '<div class="visitors">'
                        + '<i class="fa fa-street-view"></i>'
                        + '<span class="visitor-count">' + currentvisitors + '</span>'
                        + '</div>'

                        + '<div class="uniquevisitors">'
                        + '<i class="fa fa-fingerprint"></i>'
                        + '<span class="uniquevisitors-count">' + unique + '</span>'
                        + '</div>'

                        + '</div>'

                        + '<p>' + desc + '</p>'

                        + '</div>'

                        + '<p id="status">'
                        + '</p>'


                    marker.addListener("click", () => {
                        var x = document.getElementsByClassName("info-box")[0];
                        x.style.display = "block";
                        x.innerHTML = contentString;
                        document.getElementById("close").addEventListener("click", hideItem);

                        loadMarkers();
                        addLikeListener(id, likeid);

                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                var user = user.uid;
                                addFavoriteListener(title, favoriteid, user, id);
                            }
                        });
                    });
                })
            })
    }
    /* Google Maps Markers API End
    source: https://developers.google.com/maps/documentation/javascript/markers
     */
});

function updateCurrentVisitors() {
    db.collection("malls")
        .get()
        .then((mall) => {
            if (mall) {
                mall.forEach(function (malldoc) {
                    firebase.auth().onAuthStateChanged(function (user) {
                        db.collection("users").doc(user.uid)
                            .get()
                            .then(function (doc) {
                                var x = doc.data().lat;
                                var y = doc.data().lng;
                                var userID = user.uid;
                                var currentvisitorarray = malldoc.data().currentvisitors;
                                var mallx = malldoc.data().lat;
                                var mallxHigh = mallx + 0.003;
                                var mallxLow = mallx - 0.003;
                                var mally = malldoc.data().lng;
                                var mallyHigh = mally + 0.003;
                                var mallyLow = mally - 0.003;

                                if ((x <= mallxHigh && x >= mallxLow) && (y <= mallyHigh && y >= mallyLow)) {
                                    db.collection("malls").doc(malldoc.id).update({
                                        currentvisitors: firebase.firestore.FieldValue.arrayUnion(userID),
                                        uniquevisitors: firebase.firestore.FieldValue.arrayUnion(userID)
                                    }).then(() => {
                                        console.log("visitors in the array: " + malldoc.data().currentvisitors.length);
                                        db.collection("malls").doc(malldoc.id).update({
                                            currentvisitorcount: malldoc.data().currentvisitors.length
                                        })
                                        console.log("current visitor count (array): " + malldoc.data().currentvisitors.length
                                            + " currentvisitorcount: " + malldoc.data().currentvisitorcount);
                                    })
                                    updateVisitorNumber(); 
                                } else {
                                    for (var i = 0; i <= currentvisitorarray.length; i++) {
                                        if (userID == currentvisitorarray[i]) {
                                            db.collection("malls").doc(malldoc.id).update({
                                                currentvisitors: firebase.firestore.FieldValue.arrayRemove(userID)
                                            }).then(() => {
                                                console.log("visitors in the array: " + malldoc.data().currentvisitors.length);
                                                db.collection("malls").doc(malldoc.id).update({
                                                    currentvisitorcount: malldoc.data().currentvisitors.length
                                                })
                                                console.log("current visitor count (array): " + malldoc.data().currentvisitors.length
                                                    + " currentvisitorcount: " + malldoc.data().currentvisitorcount);
                                            })
                                            db.collection("malls").doc(malldoc.id).update({
                                                currentvisitorcount: malldoc.data().currentvisitors.length
                                            })
                                        } else {
                                            db.collection("malls").doc(malldoc.id).update({
                                                currentvisitorcount: malldoc.data().currentvisitors.length
                                            })
                                        }
                                    }
                                    updateVisitorNumber(); 
                                }
                            })
                    });
                })
            }
        })
        updateVisitorNumber(); 
}

function updateVisitorNumber() {
    db.collection("malls")
        .get()
        .then((mall2) => {
            if (mall2) {
                mall2.forEach(function (mall2doc) {
                    firebase.auth().onAuthStateChanged(function (user) {
                        db.collection("malls").doc(mall2doc.id).update({
                            currentvisitorcount: mall2doc.data().currentvisitors.length
                        })
                    })
                })
            }
        })
}


/* BCIT COMP 1800 Tech Gems #6 Start
source: https://www.notion.so/Demo-6-more-tech-gems-25571bcb4ff74986bcb2c05b83111c15
*/
function addLikeListener(id, likeid) {
    var y = document.getElementsByClassName("like-count")[0];
    document.getElementById(likeid)
        .addEventListener("click", function () {
            db.collection("malls")
                .doc(id)
                .update({
                    likes: firebase.firestore.FieldValue.increment(1)
                }).then(() => {
                    db.collection("malls").doc(id).get().then(function (doc) {
                        var likes = doc.data().likes;
                        y.innerHTML = likes;
                    })
                })
        })
}
/* BCIT COMP 1800 Tech Gems #6 End
source: https://www.notion.so/Demo-6-more-tech-gems-25571bcb4ff74986bcb2c05b83111c15
*/

/* BCIT COMP 1800 Tech Gems #6 Start
source: https://www.notion.so/Demo-6-more-tech-gems-25571bcb4ff74986bcb2c05b83111c15
*/
function addFavoriteListener(title, favoriteid, user, id) {
    console.log(user + " favorites will be added here.");
    var y = document.getElementsByClassName("favorite-count")[0];
    document.getElementById(favoriteid)
        .addEventListener("click", function () {
            db.collection("users")
                .doc(user)
                .update({
                    favorites: firebase.firestore.FieldValue.arrayUnion(title)
                }).then(() => {
                    db.collection("malls")
                        .doc(id)
                        .update({
                            favoritescount: firebase.firestore.FieldValue.arrayUnion(user)
                        }).then(() => {
                            db.collection("malls").doc(id).get().then(function (doc) {
                                var favorites = doc.data().favoritescount.length;
                                y.innerHTML = favorites;
                            })
                        })
                })
            console.log(title + " added to favorites.");
        })
}
/* BCIT COMP 1800 Tech Gems #6 End
source: https://www.notion.so/Demo-6-more-tech-gems-25571bcb4ff74986bcb2c05b83111c15
*/

/* Google Maps Markers API Start
source: https://developers.google.com/maps/documentation/javascript/markers
 
Google Maps Geolocation API Start
source: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation#maps_map_geolocation-javascript */

/*
Mozilla's Using Geolocation API Guide Start
Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
*/

function displayFriendsOnMap() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid)
            .get()
            .then(function (doc) {
                var friends = doc.data().friends;
                var friendnumber = friends.length;
                console.log("friends: " + friends);
                console.log("number of friends: " + friendnumber);

                for (var i = 0; i < friendnumber; i++) {
                    db.collection("users").doc(friends[i])
                        .get()
                        .then((friend) => {

                            var icon = friend.data().icon;
                            var name = friend.data().name;
                            var x = friend.data().lat;
                            var y = friend.data().lng;
                            var string = "/images/" + icon

                            /* Stack Overflow Start
                            @Author: Christian C. Salvadó
                             @link: https://stackoverflow.com/questions/1731190/check-if-a-string-has-white-space */
                            if (name.indexOf(" ") >= 0) {
                                var firstname = name.substr(0, name.indexOf(" "));
                            } else {
                                var firstname = name;
                            }
                            /* Stack Overflow End
                           @Author: Christian C. Salvadó
                            @link: https://stackoverflow.com/questions/1731190/check-if-a-string-has-white-space */
                            console.log("friend name: " + name);

                            const userIcon = new google.maps.Marker({
                                position: { lat: x, lng: y },
                                map,
                                title: name,
                                label: {
                                    text: firstname,
                                    fontSize: "10px",
                                    className: "user-label"
                                },
                                icon: {
                                    url: string,
                                    scaledSize: new google.maps.Size(26, 26)
                                },
                            });
                            userIcon.setZIndex(180);
                            userIcon.addListener("click", () => {
                                console.log(name + " clicked");

                            });
                        })
                }

            })
    });
}

/* Google Maps Markers API End
source: https://developers.google.com/maps/documentation/javascript/markers

Google Maps Geolocation API End
source: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation#maps_map_geolocation-javascript
 */

/* Mozilla's Using Geolocation API Guide End
Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API */

