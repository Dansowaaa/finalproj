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
if (music) {
  music.addEventListener("click", function() {
      showPage('Music-Page');
  });
}
if (audio) {
  audio.addEventListener("click", function() {
      showPage('audiobook');
  });
}

if (document.querySelector('#Music-Page')) {
  showPage('Music-Page'); // Show the music page by default when the website loads
}

var activeId = "";

function addActiveClass(elId) {
  if (activeId !== "") {
    document.getElementById(activeId).className = "";
  }
  document.getElementById(elId).className = "active";
  activeId = elId;
}

function markCurrentNavLink() {
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
  var musicLink = document.getElementById('music');
  var audioLink = document.getElementById('audiobook');
  if (!musicLink || !audioLink) return;

  musicLink.classList.remove('active');
  audioLink.classList.remove('active');

  if (page.indexOf('audiobook') !== -1 || page.indexOf('recommendeda') !== -1 || page.indexOf('recenta') !== -1 || page.indexOf('trending') !== -1) {
    audioLink.classList.add('active');
  } else if (page.indexOf('music') !== -1 || page.indexOf('popularm') !== -1 || page.indexOf('recommendedm') !== -1) {
    musicLink.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  markCurrentNavLink();
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

const fileInput = document.getElementById('photo-upload');
        const submitBtn = document.getElementById('submit-btn');
        const preview = document.getElementById('preview');
        const uploadZone = document.getElementById('upload-zone');

        // Click to upload functionality
        if (uploadZone) {
          uploadZone.addEventListener('click', function() {
            fileInput.click();
          });
        }

        // Drag and drop functionality
        if (uploadZone) {
          uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.add('dragover');
          });

          uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');
          });

          uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
              fileInput.files = files;
              handleFileSelect(files[0]);
            }
          });
        }

        // Handle file selection
        function handleFileSelect(file) {
          if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
              preview.src = e.target.result;
              preview.classList.add('show');
            }
            reader.readAsDataURL(file);
          }
        }

        // File input change event
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
              handleFileSelect(this.files[0]);
            }
        });

        // Handle the button click
        submitBtn.addEventListener('click', function() {
            const file = fileInput.files[0];
            if (file) {
                alert(`Ready to upload: ${file.name}`);
                // This is where you would add your backend upload logic (e.g., using fetch or Axios)
            } else {
                alert('Please select a photo first!');
            }
        });


const nameInput = document.getElementById('name-input');
const saveBtn = document.getElementById('save-btn');
const greeting = document.getElementById('greeting');

// 1. Check if a name was previously saved when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('userUniqueName');
    if (savedName) {
        greeting.textContent = `Saved Name: ${savedName}`;
        nameInput.value = savedName; // Put it back in the input box too
    } else {
        greeting.textContent = "No name saved yet.";
    }
});

// 2. Save the name when the button is clicked
saveBtn.addEventListener('click', () => {
    const enteredName = nameInput.value.trim();

    if (enteredName !== "") {
        // Save to the browser's local storage
        localStorage.setItem('userUniqueName', enteredName);
        
        // Update the text on the screen
        greeting.textContent = `Saved Name: ${enteredName}`;
        alert('Name saved successfully!');
    } else {
        alert('Please type a name before saving.');
    }
});