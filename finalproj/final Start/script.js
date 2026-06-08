// =========================================================================
// 1. Navigation / Page Display Logic
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
    [00:12.30] I, I just woke up from a dream
    [00:18.10] Where you and I had to say goodbye
    [00:23.90] And I don't know what it all means
    [00:35.40] But since I survived, I realized
    [00:47.00] Wherever you go, that's where I'll follow
    [00:52.80] Nobody's promised tomorrow
    [00:55.60] So I'ma love you every night like it's the last night
    [01:05.50] Like it's the last night
    [01:09.90] If the world was ending, I'd wanna be next to you
    [01:15.70] If the party was over and our time on Earth was through
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
  `,
  "taylor-swift-mo3": `
    [00:00.00] (Intro)
    [00:05.00] I'm riding in your car
    [00:10.00] I'm looking at the stars
    [00:15.00] You're telling me you love me
    [00:20.00] And I know exactly where we are
    [00:25.00] (Outro)
  `,
  "cruel-summer": `
    [00:00.00] (Intro)
    [00:02.00] Fever dream high in the quiet of the night
    [00:05.50] You know that I caught it
    [00:08.00] Bad, bad boy, shiny toy with a price
    [00:11.00] You know that I bought it
    [00:14.00] Killing me slow, out the window
    [00:17.00] I'm always waiting for you to be waiting below
    [00:20.00] Devils roll the dice, angels roll their eyes
    [00:23.00] What doesn't kill me makes me want you more
    [00:26.00] And it's new, the shape of your body
    [00:29.00] It's blue, the feeling I've got
    [00:31.00] And it's ooh, woah-oh
    [00:33.50] It's a cruel summer
  `,
  "billie-birds": `
[00:00.00] (Intro)
[00:02.50] I want you to stay
[00:06.00] 'Til I'm in the grave
[00:09.00] 'Til I rot away, dead and buried
[00:13.00] 'Til I'm in the casket you carry
[00:17.00] If you go, I'm going too, uh
[00:21.00] 'Cause it was always you
[00:26.00] And if I'm turning blue, please don't save me
[00:30.00] Nothing left to lose without my baby
[00:34.50] Birds of a feather, we should stick together, I know
[00:39.50] I said I'd never think I'd be better alone
[00:43.50] Can't change the weather, might not be forever
[00:47.50] But if it's forever, it's even better
[01:03.00] I don't know what I'm crying for
[01:07.00] I don't think I could love you more
[01:11.00] It might not be long, but baby, I
[01:15.50] I'll love you 'til the day that I die
[01:19.00] 'Til the day that I die
[01:23.00] 'Til the light leaves my eyes
    `,
  "i-hope-this-doesnt-find-you": `
[00:00.00] (Intro)
[00:05.00] This is a sample excerpt for the audiobook.
[00:30.00] Chapter 1 starts: The narrator speaks...
[01:00.00] Chapter 1 continues: A short passage.
    `,
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
    let videoHTML = "";

    if (mainHeading && mainHeading.textContent.includes("Billie Jean")) {
      videoHTML = `
        <video controls autoplay>
          <source src="Michael Jackson - Billie Jean.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else if (mainHeading && mainHeading.textContent.includes("Taylor Swift")) {
      videoHTML = `
        <video controls autoplay>
          <source src="taylor_stift_mo3.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else if (mainHeading && mainHeading.textContent.includes("Cruel Summer")) {
      videoHTML = `
        <video controls autoplay>
          <source src="Taylor Swift - Cruel Summer.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else if (mainHeading && mainHeading.textContent.includes("Birds of a Feather")) {
      videoHTML = `
        <video controls autoplay>
          <source src="Billie Eilish - Birds of a Feather.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else {
      videoHTML = `
        <video controls autoplay>
          <source src="Lady Gaga - Die With A Smile.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    }

    // Inject video player template
    videoContainer.innerHTML = `<div class="video-wrapper">${videoHTML}</div>`;
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
    } else if (mainHeading && mainHeading.textContent.includes("I Hope This Doesn't Find You")) {
      audioSrc = "I Hope This Doesn't Find You.mp3";
      currentSong = "i-hope-this-doesnt-find-you";
    } else if (mainHeading && mainHeading.textContent.includes("Taylor Swift")) {
      audioSrc = "taylor_stift_mo3.mp3"; 
      currentSong = "taylor-swift-mo3";
    } else if (mainHeading && mainHeading.textContent.includes("Cruel Summer")) {
      audioSrc = "Taylor Swift - Cruel Summer.mp3"; 
      currentSong = "cruel-summer";
    } else if (mainHeading && mainHeading.textContent.includes("Birds of a Feather")) {
      audioSrc = "Billie Eilish - Birds of a Feather.mp3"; 
      currentSong = "billie-birds";
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