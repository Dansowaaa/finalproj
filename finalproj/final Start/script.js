const music = document.querySelector("#music");
const audio = document.querySelector("#audiobook");

const musicpage = document.querySelector("#Music-Page");
const audiopage = document.querySelector("#AudioBook-Page");

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
    showPage('audiobook');
});

showPage('Music-Page'); // Show the music page by default when the website loads

var activeId = "";

function addActiveClass(elId) {
  if (activeId !== "") {
    document.getElementById(activeId).className = "";
  }
  document.getElementById(elId).className = "active";
  activeId = elId;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.first-row').forEach(function(row) {
    var wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    row.parentNode.insertBefore(wrapper, row);
    wrapper.appendChild(row);

    var leftBtn = document.createElement('button');
    leftBtn.type = 'button';
    leftBtn.className = 'carousel-button left';
    leftBtn.textContent = '◄';

    var rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'carousel-button right';
    rightBtn.textContent = '►';

    wrapper.appendChild(leftBtn);
    wrapper.appendChild(rightBtn);

    leftBtn.addEventListener('click', function() {
      row.scrollBy({ left: -row.clientWidth * 0.8, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', function() {
      row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' });
    });
  });
});

