/* 
BCIT Carly Orr: Tech-Tip B001:   How do I get text field input, and use it to search database? Start
@ link: https://www.notion.so/Tech-Tip-B001-How-do-I-get-text-field-input-and-use-it-to-search-database-881a9dc3a14f4869bb0f8db5c509687d
*/

function getUser() {
    document.getElementById("submit").addEventListener('click', function () {
        $("#results-here").html("");
        var user = document.getElementById("user").value;
        db.collection("users")
            .where("name", "<=", user)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user.uid != doc.id) {
                            var myID = user.uid;
                            console.log("My id: " + myID);
                            console.log("Their id: " + doc.id);
                            var icon = doc.data().icon;
                            var name = doc.data().name;
                            var addid = "add" + doc.id;
                            var theirID = doc.id;
                            console.log("user id: " + addid);
                            var item = '<div class="friend">'
                                + '<div class="friend-icon">'
                                + '<img src="/images/' + icon + '\"' + ' alt=' + name + '>'
                                + "</div>"
                                + '<div class="text-content">'
                                + '<p class="info-text">' + '<b>' + name + '</b>' + '</p>'
                                + '</div>'
                                + '<div class="add-friend">'
                                + '<button class="add-button" id="' + addid + '">' + "Add Friend" + '</button>'
                                + '</div>'
                                + '</div>'
                            $("#results-here").append(item);
                            addFriendListener(addid, myID, theirID);
                        }
                    });




                })
            })
    })
}
getUser();

function addFriendListener(addid, myID, theirID) {
    document.getElementById(addid).addEventListener("click", function () {
        db.collection("users")
            .doc(theirID)
            .update({
                friendrequests: firebase.firestore.FieldValue.arrayUnion(myID)
            })
        console.log(myID + " added to " + theirID + "'s" + " friend requests.");
    })
}

/* 
BCIT Carly Orr: Tech-Tip B001:   How do I get text field input, and use it to search database? End
@ link: https://www.notion.so/Tech-Tip-B001-How-do-I-get-text-field-input-and-use-it-to-search-database-881a9dc3a14f4869bb0f8db5c509687d
*/

function displayRequests() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid).get()
            .then(function (doc) {
                var requests = doc.data().friendrequests;
                var userID = user.uid;
                console.log(requests);
                console.log("user id: " + userID);

                if (requests.length == 0) {
                    $("#requests-here").html('<p class="no-request-msg">' + "No friend requests yet!" + '</p>');
                } else {
                    for (var i = 0; i < requests.length; i++) {
                        var requestID = requests[i];
                        db.collection("users").doc(requestID)
                            .get()
                            .then(function (req) {
                                var icon = req.data().icon;
                                var name = req.data().name;
                                var id = req.id;
                                var acceptid = "add" + id;
                                var rejectid = "reject" + id;

                                console.log("id: " + id);

                                var item = '<div class="friendreq">'
                                    + '<div class="friendreq-icon">'
                                    + '<img src="/images/' + icon + '\"' + ' alt=' + name + '>'
                                    + '</div>'
                                    + '<div class="text-content">'
                                    + '<p class="info-text">' + '<b>' + name + '</b>' + '</p>'
                                    + '</div>'
                                    + '<div class="options">'
                                    + '<div class="accept-friend">'
                                    + '<button class="accept-button" id="' + acceptid + '">' + '<p>' + "Accept" + '</p>' + '</button>'
                                    + '</div>'
                                    + '<div class="reject-friend">'
                                    + '<button class="remove-button" id="' + rejectid + '">' + '<p>' + "Delete" + '</p>' + '</button>'
                                    + '</div>'
                                    + '</div>'
                                    + '</div>'
                                $("#requests-here").append(item);
                                addResponseListener(acceptid, rejectid, id, userID);
                            })
                    }
                }

            })
    })
}
displayRequests();

function addResponseListener(acceptid, rejectid, id, userID) {
    document.getElementById(acceptid).addEventListener("click", function () {
        db.collection("users")
            .doc(userID)
            .update({
                friendrequests: firebase.firestore.FieldValue.arrayRemove(id),
                friends: firebase.firestore.FieldValue.arrayUnion(id)
            }).then(() => {
                $("#requests-here").html("");
            }).then(() => {
                displayFriends();
            })
        console.log(id + "'s friend request accepted.");
    })

    document.getElementById(rejectid).addEventListener("click", function () {
        db.collection("users")
            .doc(userID)
            .update({
                friendrequests: firebase.firestore.FieldValue.arrayRemove(id)
            }).then(() => {
                $("#requests-here").html("");
            }).then(() => {
                displayFriends();
            })
        console.log(id + "'s friend request rejected.");
    })
}

function displayFriends() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var friends = doc.data().friends;
                    var friendnumber = friends.length;
                    console.log("friends: " + friends);
                    console.log("number of friends: " + friendnumber);
                    var userID = doc.id;

                    for (var i = 0; i < friendnumber; i++) {
                        db.collection("users").doc(friends[i])
                            .get()
                            .then((friend) => {

                                var icon = friend.data().icon;
                                var name = friend.data().name;
                                var id = friend.id;
                                var removeid = "remove" + friend.id;

                                var item = '<div class="friend">'
                                    + '<div class="friend-icon">'
                                    + '<img src="/images/' + icon + '\"' + ' alt=' + name + '>'
                                    + "</div>"
                                    + '<div class="text-content">'
                                    + '<p class="info-text">' + '<b>' + name + '</b>' + '</p>'
                                    + '</div>'
                                    + '<div class="remove-friend">'
                                    + '<button class="remove-button" id="' + removeid + '">' + "Remove" + '</button>'
                                    + '</div>'
                                    + '</div>'
                                $("#friends-here").append(item);
                                removeFriendListener(removeid, userID, id);
                            })
                    }

                })
        }
    });
}
displayFriends();

function removeFriendListener(removeid, userID, id) {
    document.getElementById(removeid).addEventListener("click", function () {
        db.collection("users")
            .doc(userID)
            .update({
                friends: firebase.firestore.FieldValue.arrayRemove(id)
            }).then(() => {
                $("#friends-here").html("");
            }).then(() => {
                displayFriends();
            })
        console.log(id + "removed from friends");
    })
}


/* 
w3schools navigation tabs and full page tabs guide start
@ Navigation Tabs link: https://www.w3schools.com/w3css/w3css_tabulators.asp 
@ Full Page Tabs link: https://www.w3schools.com/howto/howto_js_full_page_tabs.asp
*/

function openList(event, listName) {
    var i, tabs;
    var x = document.getElementsByClassName("location-list");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    tabs = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" underline", "");
    }

    document.getElementById(listName).style.display = "block";
    event.currentTarget.className += " underline";
}

document.getElementById("default").click();

/*
w3schools navigation tabs and full page tabs guide end
@ Navigation Tabs link: https://www.w3schools.com/w3css/w3css_tabulators.asp
@ Full Page Tabs link: https://www.w3schools.com/howto/howto_js_full_page_tabs.asp
*/
