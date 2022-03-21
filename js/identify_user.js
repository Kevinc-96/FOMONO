function identifyUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;

                    /* Stack Overflow Start
                            @Author: Christian C. Salvadó
                             @link: https://stackoverflow.com/questions/1731190/check-if-a-string-has-white-space */
                    if (n.indexOf(" ") >= 0) {
                        var firstname = n.substr(0, n.indexOf(" "));
                    } else {
                        var firstname = n;
                    }
                    /* Stack Overflow End
                   @Author: Christian C. Salvadó
                    @link: https://stackoverflow.com/questions/1731190/check-if-a-string-has-white-space */
                    console.log(n + " ID: " + user.uid);
                    $("#name").text(firstname);
                    $("#fullname").text(n);

                })
        } else {
            document.location.href = "index.html";
        }
    });
}
identifyUser();
addIcon();

function addIcon() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var icon = doc.data().icon;
                    var string = '<img src="/images/' + icon + '\"' + ' alt=' + "Avatar" + '>'
                    $("#icon-here").prepend(string);
                })
        }
    });
}