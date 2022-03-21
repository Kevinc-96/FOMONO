var ui = new firebaseui.auth.AuthUI(firebase.auth());
var provider = new firebase.auth.GoogleAuthProvider();

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write. 
            //------------------------------------------------------------------------------------------
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {       
                db.collection("users").doc(user.uid).set({         
                    name: user.displayName,                    
                    email: user.email,
                    favorites: [],
                    friendrequests: [],
                    lat: 0,
                    lng: 0,
                    icon: ""                         
                }).then(function () {
                    console.log("New user added to firestore");
                    window.location.assign("main.html");       
                })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                console.log("Old user logged in");
                window.location.assign("map.html");
                return true;
            }
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'redirect',
    signInSuccessUrl: 'map.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        /* firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID, */
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        /* firebase.auth.PhoneAuthProvider.PROVIDER_ID */
    ],
    // Terms of service url.
    tosUrl: 'tos.html',
    // Privacy policy url.
    privacyPolicyUrl: 'privacy_policy.html'
};

ui.start('#firebaseui-auth-container', uiConfig);