// selectors
const coverImage = document.getElementById('cover-image');
const closePlaylistBtn = document.querySelector('.fa-xmark');
const playlistWrapper = document.getElementById('aside-wrapper');
const openPlaylistBtn = document.querySelector('.fa-magnifying-glass');
const playPauseBtn = document.getElementById('play-btn');
const track = document.getElementById('track');
const currentTime = document.getElementById('current-time');
const timeLeft = document.getElementById('remaining-time');
const currentBar = document.getElementById('current-progress');
const progressBar = document.getElementById('progress-bar-container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const title = document.getElementById('current-title');
const artist = document.getElementById('current-artist');
const img = document.getElementById('cover-image');
const shuffle = document.querySelector('.fa-shuffle');
const repeat = document.querySelector('.fa-repeat');
const inputValue = document.getElementById('search-input');

//global
let tracks;
let playing = false;
let currentTrack = 0;
let random = false;
let repeating = false;


//functions
async function loadTracks() {
    try {
        const response = await fetch('./tracks.json');
        tracks = await response.json();
        console.log('Tracce caricate con successo');
        coverImage.src = tracks[0].cover;
        // let totalTrack = tracks.length;
        
        populateTracks(tracks);
        trackDetails(tracks);
    }
    catch(error) {
        console.error('Errore durante il caricamento delle tracce:', error);
        return;
    }
}

function populateTracks(tracks, searchTerm = '') {
    const cardWrapper = document.getElementById('card-wrapper');
    cardWrapper.innerHTML = '';
    tracks.forEach((track, i) => {
        // Controlla se il titolo della traccia contiene la stringa di ricerca (ignorando maiuscole/minuscole)
        if (track.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-track', `${track.id}`);
            if (i === currentTrack) card.classList.add('playing');

            const audio = new Audio(track.url);
            audio.addEventListener('loadedmetadata', () => {
                const duration = formatTime(audio.duration);
                card.querySelector('.time').textContent = duration;
            });

            card.innerHTML = `
                <p class="id">${i + 1}</p>
                <div class="song-info-container">
                    <img class="playlist-img" src=${track.cover} alt=${track.title}>
                    <div class="info custom-overflow-text">
                        <p class="title custom-overflow-text font-indie">${track.title}</p>
                        <p class="author font-orbitron">${track.artist}</p>
                    </div>
                </div>
                <p class="album"><i data-track="${i}" id="playlist-play-btn" class="fa-solid fa-play tc-main pointer sidebar-play"></i></p>
                <p class="time">...</p>
            `;
            cardWrapper.appendChild(card);
        }
    });

    const playBtns = document.querySelectorAll('.sidebar-play');
    playBtns.forEach(btn=>btn.addEventListener('click', ()=>{
        const selectedTrack = parseInt(btn.getAttribute('data-track'), 10);
        currentTrack = selectedTrack;
        trackDetails(tracks);
        changePlaylistActive();
        closePlaylist();
        if(playing ){
            play()
        }
        if (!playing) {
            play()
        }        
    }))
}

function changePlaylistActive() {
    const trackListCard = document.querySelectorAll('.card')
    trackListCard.forEach((card, i) => {
        const playBtn = card.querySelector('.sidebar-play');
        if (i === currentTrack) {
            card.classList.add('playing');
            if (playing) {
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
            } else {
                playBtn.classList.remove('fa-pause');
                playBtn.classList.add('fa-play');
            }
        } else {
            card.classList.remove('playing'); 
        }
    });
}


function closePlaylist() {
    playlistWrapper.style.left = '-100%';
}

function openPlaylist() {
    playlistWrapper.style.left = '0';
    inputValue.value = '';
}

function trackDetails(tracks) {
    img.src = tracks[currentTrack].cover;
    title.textContent = tracks[currentTrack].title;
    artist.textContent = tracks[currentTrack].artist;
    track.src = tracks[currentTrack].url;
}

function play() {
    if (!playing) {
        playPauseBtn.classList.remove('fa-play');
        playPauseBtn.classList.add('fa-pause');
        playing = true;
        track.play();
        setTimeout(() => {
            const time = document.getElementById('remaining-time').textContent;
            if(time === 'NaN.NaN') next();
            console.log(time);
        }, 5000);
    } else {
        playPauseBtn.classList.remove('fa-pause');
        playPauseBtn.classList.add('fa-play');
        playing = false;
        track.pause();
    }
}

function next() {
    if (!repeating) {
        if (random) {
            randomTrack();
        } else {
            currentTrack++;
        }
        if (currentTrack === tracks.length) currentTrack = 0;
    }
    trackDetails(tracks); 
    controlPlaying();
}


function prev() {
    if (random) {
        randomTrack();
    } else {
        currentTrack--;
    }
    if (currentTrack < 0) currentTrack = tracks.length - 1;
    trackDetails(tracks);
    controlPlaying();
}

function randomTrack() {
    let newTrack;
    do {
        newTrack = Math.floor(Math.random() * tracks.length);
    } while (newTrack === currentTrack);
    currentTrack = newTrack;
}


function calculateTime() {
    setInterval(() => {
        currentTime.innerText = formatTime(track.currentTime);
        timeLeft.innerText = formatTime(track.duration - track.currentTime);
        const progress = (track.currentTime / track.duration) * 100;
        currentBar.style.width = `${progress}%`;

    }, 900);
}

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec - minutes * 60);
    return `${minutes}.${seconds < 10 ? `0${seconds}` : seconds}`;
}

function controlPlaying() {
    if (playing) {
        playing = false;
        play();
    }
}

function toggleFeature(element, feature) {
    if (!feature) {
        element.classList.add('active');
        return true;
    } else {
        element.classList.remove('active');
        return false;
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = track.duration;
    track.currentTime = ((clickX / width) * duration);
}

//listeners
document.addEventListener('DOMContentLoaded', loadTracks);
document.addEventListener('DOMContentLoaded', calculateTime);
closePlaylistBtn.addEventListener('click', closePlaylist);
openPlaylistBtn.addEventListener('click', () => {
    changePlaylistActive();
    openPlaylist();
    populateTracks(tracks);
});
playPauseBtn.addEventListener('click', play);
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
track.addEventListener('ended', next);
repeat.addEventListener('click', (event) => {
    repeating = toggleFeature(event.target, repeating);
});
shuffle.addEventListener('click', (event) => {
    if (!random && repeating) repeating = toggleFeature(repeat, repeating);

    random = toggleFeature(event.target, random);
});
progressBar.addEventListener('click', setProgress);
inputValue.addEventListener('input', (ev)=> {
    const searchTerm = ev.target.value;
    if(searchTerm.length >= 3) {
        populateTracks(tracks, searchTerm);
    } else {
        populateTracks(tracks);
    }
})
document.addEventListener('keydown', (e) => {
    if(e.code === 'Space') play();
    if(e.code === 'KeyO') openPlaylist();
    if(e.code === 'KeyC') closePlaylist();
    if(e.code === 'ArrowLeft') prev();
    if(e.code === 'ArrowRight') next();
})  