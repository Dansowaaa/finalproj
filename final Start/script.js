const music = document.querySelector("#music");
const audio = document.querySelector("#audiobook");

const musicpage = document.querySelector("#Music-Page");
const audiopage = document.querySelector("#audiopage");

function showPage(pageId) {
    // Hide all pages
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }

    // Show the selected page
    document.getElementById(pageId).style.display = 'block';
}
music.addEventListener("click", function() {
    showPage('Music-Page');
});
audio.addEventListener("click", function() {
    showPage('audiopage');
});

showPage('audiopage'); // Show the music page by default when the website loads

var activeId = "";

function addActiveClass(elId) {
  if (activeId !== "") {
    document.getElementById(activeId).className = "";
  }
  document.getElementById(elId).className = "active";
  activeId = elId;
}

