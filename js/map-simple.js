var refresh = document.getElementById("toggle-refresh");
refresh.addEventListener("click", reloadPage);

function reloadPage() {
    window.location.reload();
}

var icon = document.getElementById("icon-here");
icon.addEventListener("click", profile);

function profile() {
    window.location = "profile.html";
}