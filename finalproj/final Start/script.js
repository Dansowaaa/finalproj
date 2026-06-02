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
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'block';
  }
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
    [00:12.30] I mended all my habits, became a different man
    [00:18.10] All the things you needed, I bought into your plan
    [00:23.90] So if the world was ending, I'd wanna be next to you
    [00:35.40] If the party was over and our time on Earth was through
    [00:47.00] I'd wanna hold you just for a while
    [00:52.80] And die with a smile
    [00:55.60] If the world was ending, I'd wanna be next to you
    [01:05.50] (Bruno Mars Verse)
    [01:09.90] Ooh, lost in the words that you say
    [01:15.70] Got me thinking I might not see another day
    [01:21.20] 'Cause you're the only one I've ever really known
    [01:26.70] And I don't wanna do this on my own
    [01:32.60] So if the world was ending, I'd wanna be next to you
    [01:44.10] If the party was over and our time on Earth was through
    [01:55.70] I'd wanna hold you just for a while
    [02:01.50] And die with a smile
    [02:04.30] If the world was ending, I'd wanna be next to you
    [02:16.00] Right next to you
    [02:27.50] I'd wanna hold you just for a while
    [02:33.30] And die with a smile
    [02:36.10] If the world was ending, I'd wanna be next to you
    [02:47.60] If the party was over and our time on Earth was through
    [02:59.20] I'd wanna hold you just for a while
    [03:05.00] And die with a smile
    [03:07.80] If the world was ending, I'd wanna be next to you
    [03:15.50] (Outro)
  `,
  "billie-jean": `
    [00:00.00] (Intro)
    [00:29.00] She was more like a beauty queen from a movie scene
    [00:35.00] I said don't mind, but what do you mean, I am the one
    [00:42.00] Who will dance on the floor in the round?
    [00:46.00] She said I am the one, who will dance on the floor in the round
    [00:54.00] She told me her name was Billie Jean, as she caused a scene
    [01:00.00] Then every head turned with eyes that dreamed of being the one
    [01:07.00] Who will dance on the floor in the round
    [01:14.00] People always told me be careful of what you do
    [01:17.00] And don't go around breaking young girls' hearts
    [01:21.00] And mother always told me be careful of who you love
    [01:24.00] And be careful of what you do 'cause the lie becomes the truth
    [01:29.00] Billie Jean is not my lover
  `
};

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

// =========================================================
// 3. Button Action Event Listeners
// =========================================================

// Global Element - Declared exactly ONCE globally
const videoContainer = document.getElementById('video-container');

// ---------------------------------------------------------
// BUTTON ONE: UNIFIED MUSIC VIDEO IFRAME PLAYER
// ---------------------------------------------------------
const musicVideoBtn = document.getElementById('music-video-btn') || document.getElementById('songs');

if (musicVideoBtn) {
  musicVideoBtn.addEventListener('click', function() {
    if (!videoContainer) return;

    // Toggle logic: If video is already showing, hide it and stop
    if (videoContainer.innerHTML !== "") {
      videoContainer.innerHTML = "";
      return;
    }

    // Detect current song dynamically from the page heading
    const mainHeading = document.querySelector('.name');
    let videoUrl = "";

    if (mainHeading && mainHeading.textContent.includes("Billie Jean")) {
      // Billie Jean embed-safe stream
      videoUrl = "https://www.youtube.com/embed/Zi_XLOBDo_Y?autoplay=1&mute=1";
    } else {
      // Die With A Smile embed-safe stream
      videoUrl = "https://www.youtube.com/embed/5-rBPPqerBE?autoplay=1&mute=1";
    }

    // Inject video player template
    videoContainer.innerHTML = `
      <div class="video-wrapper">
        <iframe 
          src="${videoUrl}" 
          title="Music Video Player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  });
}

// ---------------------------------------------------------
// BUTTON TWO: LYRICS AND LOCAL AUDIO (FIXED CLOSURES)
// ---------------------------------------------------------
const lyricsAudioBtn = document.getElementById('lyrics-audio-btn') || document.getElementById('lyrics');

if (lyricsAudioBtn) {
  lyricsAudioBtn.addEventListener('click', function() {
    if (!videoContainer) return;

    // Detect current song dynamically from the page heading
    const mainHeading = document.querySelector('.name');
    let audioSrc = "Die With A Smile - Lady Gaga.mp3";
    let currentSong = "die-with-a-smile";

    if (mainHeading && mainHeading.textContent.includes("Billie Jean")) {
      audioSrc = "Michael Jackson - Billie Jean (Official Video).mp3"; 
      currentSong = "billie-jean";
    }

    // 1. Inject the audio player and the lyrics container box
    videoContainer.innerHTML = `
      <div class="lyrics-player-wrapper">
        <audio id="lyric-audio-element" controls autoplay>
          <source src="${audioSrc}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
        <div id="dynamic-lyrics-box"></div>
      </div>
    `;

    // 2. Map and print out every lyric line immediately
    if (typeof parseLRC === "function" && typeof lyricsDatabase === "object") {
      if (lyricsDatabase[currentSong]) {
        const activeLyrics = parseLRC(lyricsDatabase[currentSong]);
        const lyricsBox = document.getElementById('dynamic-lyrics-box');
        const audioTrack = document.getElementById('lyric-audio-element');

        if (!lyricsBox || !audioTrack) return;
        let lastLineIndex = -1;

        lyricsBox.innerHTML = ""; // Reset box
        activeLyrics.forEach((lineData, index) => {
          const p = document.createElement('p');
          p.textContent = lineData.text;
          p.className = 'lyric-line-item';
          p.id = `lyric-line-${index}`;
          lyricsBox.appendChild(p);
        });

        // 3. Highlight lines and scroll automatically as the track updates time
        audioTrack.addEventListener('timeupdate', function() {
          const currentTime = audioTrack.currentTime;
          let currentLineIndex = -1;

          for (let i = 0; i < activeLyrics.length; i++) {
            if (currentTime >= activeLyrics[i].time) {
              currentLineIndex = i;
            } else {
              break;
            }
          }

          // Only update the DOM if the active line has actually changed
          if (currentLineIndex !== -1 && currentLineIndex !== lastLineIndex) {
            lastLineIndex = currentLineIndex;

            // Remove previous active highlights
            document.querySelectorAll('.lyric-line-item').forEach(el => {
              el.classList.remove('active-lyric');
            });

            // Highlight the active row line
            const currentLineElement = document.getElementById(`lyric-line-${currentLineIndex}`);
            if (currentLineElement) {
              currentLineElement.classList.add('active-lyric');

              // Compute scrolling position alignment offsets
              const containerHeight = lyricsBox.clientHeight;
              const elementTop = currentLineElement.offsetTop;
              const elementHeight = currentLineElement.clientHeight;

              lyricsBox.scrollTo({
                top: elementTop - (containerHeight / 2) + (elementHeight / 2),
                behavior: 'smooth'
              });
            }
          }
        });
      }
    }
  });
}

// ---------------------------------------------------------
// CAROUSEL UTILITY FUNCTIONS
// ---------------------------------------------------------
function scrollCarousel(button, direction) {
  const wrapper = button.parentElement;
  const row = wrapper.querySelector('.first-row') || wrapper.querySelector('.carousel-wrapper');
  if (!row) return;
  const scrollAmount = row.clientWidth * 0.8;
  row.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}