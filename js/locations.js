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


function displayTrendingLocations() {
  db.collection("malls")
    .orderBy("currentvisitorcount", "desc")
    .limit(3)
    .get()
    .then(function (snap) {
      var count = 1;
        snap.forEach(function (doc) {
          var name = doc.data().name;
          var icon = doc.data().picture;
          var like = doc.data().likes;
          var uniquevisitors = doc.data().uniquevisitors.length;
          var favorites = doc.data().favoritescount.length;
          var visitors = doc.data().currentvisitors.length;
          var item = '<div class="location">'
            + '<div class="location-icon">'
            + '<img src="/images/' + icon + '\"' + ' alt=' + name + '>'
            + '</div>'
            + '<div class="location-info">'
            + '<div class="text-content">'
            + '<p class="info-text"><b>' + name + "</b></p>"
            + '</div>'
            + '<div class="rank">'
            + '<img src="images/fire.png" alt="heat">'
            + '<div class="rank-number">' + count + '</div>'
            + '</div>'
            + '<div class="like">'
            + '<button class="like-button"><i class="fa fa-thumbs-up"></i></button>'
            + '<span class="stat-count">' + like + '</span>'
            + '</div>'
            + '<div class="favorites">'
            + '<i class="fa fa-heart"></i>'
            + '<span class="stat-count">' + favorites + '</span>'
            + '</div>'
            + '<div class="visitors">'
            + '<i class="fa fa-street-view"></i>'
            + '<span class="stat-count">' + visitors + '</span>'
            + '</div>'
            + '<div class="uniquevisitors">'
            + '<i class="fa fa-fingerprint"></i>'
            + '<span class="stat-count">' + uniquevisitors + '</span>'
            + '</div>'
            + '</div>'
            + '</div>'
          $("#trending-locations-here").append(item);
          count++;
        })
    })
}
displayTrendingLocations();

/* 
w3schools navigation tabs and full page tabs guide end
@ Navigation Tabs link: https://www.w3schools.com/w3css/w3css_tabulators.asp 
@ Full Page Tabs link: https://www.w3schools.com/howto/howto_js_full_page_tabs.asp
*/

function displayMalls() {
  db.collection("malls")
    .orderBy("name", "asc")
    .get()
    .then(function (snap) {
      snap.forEach(function (doc) {
        var name = doc.data().name;
        var icon = doc.data().picture;
        var like = doc.data().likes;
        var uniquevisitors = doc.data().uniquevisitors.length;
        var favorites = doc.data().favoritescount.length;
        var visitors = doc.data().currentvisitors.length;

        var item = '<div class="location">'
          + '<div class="location-icon">'
          + '<img src="/images/' + icon + '\"' + ' alt=' + name + '>'
          + '</div>'
          + '<div class="location-info">'
          + '<div class="text-content">'
          + '<p class="info-text"><b>' + name + "</b></p>"
          + '</div>'
          + '<div class="like">'
          + '<button class="like-button"><i class="fa fa-thumbs-up"></i></button>'
          + '<span class="stat-count">' + like + '</span>'
          + '</div>'
          + '<div class="favorites">'
          + '<i class="fa fa-heart"></i>'
          + '<span class="stat-count">' + favorites + '</span>'
          + '</div>'
          + '<div class="visitors">'
          + '<i class="fa fa-street-view"></i>'
          + '<span class="stat-count">' + visitors + '</span>'
          + '</div>'
          + '<div class="uniquevisitors">'
          + '<i class="fa fa-fingerprint"></i>'
          + '<span class="stat-count">' + uniquevisitors + '</span>'
          + '</div>'
          + '</div>'
          + '</div>'
        $("#all-locations-here").append(item);
      })
    })
}
displayMalls();

/* 
BCIT Carly Orr: Tech-Tip 011: How do I search for more than one filter from Firestore? Start
@ link: https://www.notion.so/Tech-Tip-011-How-do-I-search-for-more-than-one-filter-from-Firestore-a5ef26555e3044b3ab31f627e6412015
*/
function displayFavorites() {

  firebase.auth().onAuthStateChanged(function (user) {
    db.collection("users").doc(user.uid).get()
      .then(function (snap) {
        var faves = snap.data().favorites;
        console.log("Your Favorites: " + faves);

        if (faves.length != 0) {
          db.collection("malls")
            .where("name", "in", faves)
            .orderBy("likes", "desc")
            .get()
            .then(function (result) {
              if (result) {                           //not null
                result.forEach(function (doc) {       //cycle thru results
                  var name = doc.data().name;
                  var icon = doc.data().picture;
                  var like = doc.data().likes;
                  var uniquevisitors = doc.data().uniquevisitors.length;
                  var favorites = doc.data().favoritescount.length;
                  var visitors = doc.data().currentvisitors.length;
                  var removeid = "remove" + doc.id;
                  var locationid = doc.id;
                  var userID = user.uid;

                  var item = '<div class="location">'
                    + '<div class="location-icon">'
                    + '<img src="/images/' + icon + '\"' + ' alt=' + name + '>'
                    + '</div>'
                    + '<div class="location-info">'
                    + '<div class="text-content">'
                    + '<p class="info-text"><b>' + name + "</b></p>"
                    + '</div>'
                    + '<div id=' + removeid + '>'
                    + '<i class="fa fa-times-circle"></i>'
                    + '</div>'
                    + '<div class="like">'
                    + '<button class="like-button"><i class="fa fa-thumbs-up"></i></button>'
                    + '<span class="stat-count">' + like + '</span>'
                    + '</div>'
                    + '<div class="favorites">'
                    + '<i class="fa fa-heart"></i>'
                    + '<span class="stat-count">' + favorites + '</span>'
                    + '</div>'
                    + '<div class="visitors">'
                    + '<i class="fa fa-street-view"></i>'
                    + '<span class="stat-count">' + visitors + '</span>'
                    + '</div>'
                    + '<div class="uniquevisitors">'
                    + '<i class="fa fa-fingerprint"></i>'
                    + '<span class="stat-count">' + uniquevisitors + '</span>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                  $("#favorite-locations-here").append(item);
                  addRemoveListener(removeid, userID, locationid, name);
                })
              }
            })
        } else {
          $("#favorite-locations-here").html('<p class="empty-location-msg">Looks like you don\'t have any favorite locations yet!</p>');
        }
      })
  })
}
displayFavorites();

/* 
BCIT Carly Orr: Tech-Tip 011: How do I search for more than one filter from Firestore? End
@ link: https://www.notion.so/Tech-Tip-011-How-do-I-search-for-more-than-one-filter-from-Firestore-a5ef26555e3044b3ab31f627e6412015
*/


function addRemoveListener(removeid, userID, locationid, name) {
  document.getElementById(removeid).addEventListener("click", function () {
    db.collection("users")
      .doc(userID)
      .update({
        favorites: firebase.firestore.FieldValue.arrayRemove(name)
      }).then(() => {
        db.collection("malls")
          .doc(locationid)
          .update({
            favoritescount: firebase.firestore.FieldValue.arrayRemove(userID)
          })
      }).then(() => {
        console.log(name + " removed from favorites.");
        $("#favorite-locations-here").html("");
        $("#all-locations-here").html("");
        $("#trending-locations-here").html("");

      }).then(() => {
        displayFavorites();
        displayMalls();
        displayTrendingLocations();
      })
  })
}
