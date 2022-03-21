function displayIcons(){
    db.collection("icons")
    .orderBy("name", "asc")
    .get()
    .then(function(snap){                                  
        snap.forEach(function(doc){                        
            var name = doc.data().name              
            var picture = doc.data().picture
            var url = doc.data().iconURL
            var id = doc.id;
            var iconid = "icon" + doc.id

            var item = '<div class="card">'
            + '<div class="avatar" id="' + iconid + '">'
            + '<img src="/images/' + picture + '\"' + ' alt=' + name + '>'
            + '</div>'
            + '<div class="avatar-name">' + name + '</div>'
            + '</div>'

            $("#icons-go-here").append(item);

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    var user = user.uid;
                    addListener(iconid, user, picture, name);
                } 
            });

        })
    })
}
displayIcons();

/* BCIT COMP 1800 Tech Gems #6 Start
source: https://www.notion.so/Demo-6-more-tech-gems-25571bcb4ff74986bcb2c05b83111c15
*/
function addListener(iconid, user, picture, name) {
    console.log(user + "'s icon will be set'");

    document.getElementById(iconid)
        .addEventListener("click", function () {
            db.collection("users")
                .doc(user)
                .update({
                    icon: picture
                }).then(function () {
                    console.log(name + " set as avatar");
                    window.location.assign("map.html");       
                })
        })
}
/* BCIT COMP 1800 Tech Gems #6 End
source: https://www.notion.so/Demo-6-more-tech-gems-25571bcb4ff74986bcb2c05b83111c15
*/





/* add icons to the database */
function writeIcons() {
    var iconsRef = db.collection("icons");
    iconsRef.add({
        name: "Assassin",
        picture: "assassin.png",
        iconURL: "/images/assassin.png"
    });
    iconsRef.add({
        name: "Bear Boy",
        picture: "bearboy.png",
        iconURL: "/images/bearboy.png"
    });
    iconsRef.add({
        name: "Robin Hood",
        picture: "robin-hood.png",
        iconURL: "/images/robin-hood.png"
    });
    iconsRef.add({
        name: "Witch",
        picture: "witch.png",
        iconURL: "/images/witch.png"
    });
    iconsRef.add({
        name: "Wizard",
        picture: "wizard.png",
        iconURL: "/images/wizard.png"
    });

}