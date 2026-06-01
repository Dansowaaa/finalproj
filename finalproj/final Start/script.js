// =========================================================================
// 1. Navigation / Page Display Logic (Kept from your original setup)
// =========================================================================
const music = document.querySelector("#music");
const audio = document.querySelector("#audioBook");
const musicpage = document.querySelector("#Music-Page");
const audiopage = document.querySelector("#AudioBook-Page");

function showPage(pageId) {
  const pages = document.getElementsByClassName('page');
  for (let i = 0; i < pages.length; i++) {
    pages[i].style.display = 'none';
  }
  document.getElementById(pageId).style.display = 'block';
}

if (music) {
  music.addEventListener("click", function() {
    showPage("Music-Page");
  });
}

if (audio) {
  audio.addEventListener("click", function() {
    showPage("AudioBook-Page");
  });
}

// Show music page by default on load
if (document.querySelector("#Music-Page")) {
  showPage("Music-Page");
}

// =========================================================================
// 2. Lyrics Database & Timed Audio Setup
// =========================================================================
const lyricsDatabase = {
  "die-with-a-smile": `
    [00:00.00] (Intro)
    [00:11.50] I mended all my habits, became a different man
    [00:17.00] All the things you needed, I bought into your plan
    [00:23.00] So if the world was ending, I'd wanna be next to you
    [00:34.50] If the party was over and our time on Earth was through
    [00:45.50] I'd wanna hold you just for a while
    [00:51.00] And die with a smile
    [00:54.00] If the world was ending, I'd wanna be next to you
    [01:05.50] (Bruno Mars Verse)
    [01:08.50] Ooh, lost in the words that you say
  `
};

const videoContainer = document.getElementById('video-container');

// Fixed time parser helper
function parseTimeToSeconds(timeString) {
  const parts = timeString.split(':');
  const minutes = parseFloat(parts[0]);
  const seconds = parseFloat(parts[1]);
  return (minutes * 60) + seconds;
}

// Fixed LRC parser helper
function parseLRC(lrcText) {
  const lines = lrcText.split('\n');
  const parsed = [];
  const timeRegex = /\[(\d{2}:\d{2}\.\d{2})\]/;

  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      parsed.push({
        time: parseTimeToSeconds(match[1]),
        text: line.replace(timeRegex, '').trim()
      });
    }
  });
  return parsed;
}

// =========================================================================
// 3. Button Action Event Listeners
// =========================================================================

// Button One: Music Video (YouTube Iframe Player)
const musicVideoBtn = document.getElementById('music-video-btn');
if (musicVideoBtn) {
  musicVideoBtn.addEventListener('click', function() {
    videoContainer.innerHTML = `
      <div class="video-wrapper">
        <iframe 
          src="https://www.youtube.com/embed/RVDcQ9R0GgM?autoplay=1" 
          title="Die With A Smile Music Video" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  });
}

// Button Two: Dynamic Local Audio and Auto-Scrolling Lyrics
// Look for this block in your script.js file and update it:
const lyricsAudioBtn = document.getElementById('lyrics-audio-btn');
if (lyricsAudioBtn) {
  lyricsAudioBtn.addEventListener('click', function() {
    videoContainer.innerHTML = `
      <div class="lyrics-player-wrapper">
        <audio id="lyric-audio-element" controls autoplay>
          
          <source src="Die With A Smile - Lady Gaga.mp3" type="audio/mpeg">
          
          Your browser does not support the audio element.
        </audio>
        <div id="dynamic-lyrics-box"></div>
      </div>
    `;

    // ... leave the rest of the lyric parsing code below this exactly the same!
    const audioTrack = document.getElementById('lyric-audio-element');
    const lyricsBox = document.getElementById('dynamic-lyrics-box');
    const activeLyrics = parseLRC(lyricsDatabase["die-with-a-smile"]);

    // Build the structural paragraph elements for the lyric screen
    activeLyrics.forEach((lineData, index) => {
      const p = document.createElement('p');
      p.textContent = lineData.text;
      p.className = 'lyric-line-item';
      p.id = `lyric-line-${index}`;
      lyricsBox.appendChild(p);
    });

    // Handle high-frequency event tracking for audio updates
    audioTrack.addEventListener('timeupdate', () => {
      const currentTime = audioTrack.currentTime;
      let currentLineIndex = -1;

      for (let i = 0; i < activeLyrics.length; i++) {
        if (currentTime >= activeLyrics[i].time) {
          currentLineIndex = i;
        } else {
          break;
        }
      }

      if (currentLineIndex !== -1) {
        document.querySelectorAll('.lyric-line-item').forEach(el => el.classList.remove('active-lyric'));
        
        const currentLineElement = document.getElementById(`lyric-line-${currentLineIndex}`);
        if (currentLineElement) {
          currentLineElement.classList.add('active-lyric');
          lyricsBox.scrollTop = currentLineElement.offsetTop - lyricsBox.offsetTop - (lyricsBox.clientHeight / 2);
        }
      }
    });
  });
}
document.getElementById('songs').addEventListener('click', function() {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer.innerHTML === "") {
        videoContainer.innerHTML = `
            <div class="video-wrapper">
                <iframe 
                    src="https://www.youtube.com/embed/RVDCeVG90Rg?autoplay=1" 
                    title="Die With A Smile Music Video" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
    } else {
        videoContainer.innerHTML = "";
    }
});