function getInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var email = doc.data().email;
                    var lat = doc.data().lat;
                    var lng = doc.data().lng;

                    $("#email").text(email);
                    $("#lat").text(lat);
                    $("#lng").text(lng);

                })
        } else {
            document.location.href = "index.html";
        }
    });
}
getInfo();