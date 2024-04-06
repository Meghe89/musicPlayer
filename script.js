//selectors
const searchBtn = document.querySelector('.fa-magnifying-glass');
const playlistBtn = document.querySelector('.fa-music');
const playBtn = document.querySelector('.fa-play');
const previewBtn = document.querySelector('.fa-chevron-left');
const nextBtn = document.querySelector('.fa-chevron-right');
const trackCover = document.getElementById('track-cover');
console.log(trackCover)

const playlist = document.querySelector('.playlist');
let track = document.querySelector('#track');

fetch('./tracks.json')
.then((res) => res.json())
.then((data) => {
    const tracks = data;
    trackCover.src = `${tracks[0].cover}`;
    // globals
    let playing = false;
    let currentTrack = 0;
    let totalTrack = tracks.length;
    let random = false;
    

    function play() {
        if (!playing) {
            playBtn.classList.remove('fa-play');
            playBtn.classList.add('fa-pause');
            track.play();
            playing = true;
        } else {
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
            track.pause();
            playing = false;
        }
    }

    function changeTrackDetails() {
        track.src = tracks[currentTrack].url;
        trackCover.src = tracks[currentTrack].cover;
    }

    playBtn.addEventListener('click', play);
})
.catch((err) => {
    console.error(err);
});


