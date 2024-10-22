console.log('Playing song using javascript');

let currentSong = new Audio();
let songs;

function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds <= 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with leading zeros if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();

    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    // console.log(as);

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href);
            // songs.push(element.href.split("/songs/")[1]);
            songs.push((element.href.split("/songs/")[1]));
        }
    }
    return songs;
}



const playMusic = (track, pause = false) => {

    // let audio = new Audio("/songs/" + track);
    // console.log(track);
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track.split(".mp3")[0]);//decode - to remove %20 and other encoding
    document.querySelector(".songTime").innerHTML = "00:00/00:00";

}


async function main() {


    //get the list of all songs
    songs = await getSongs();
    playMusic(songs[0], true);

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    console.log(songUL);
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="images/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")} </div>
                    <div>Harry</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img class="invert" src="images/play.svg" alt="">
                </div> 
            </li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    //Attach an event Listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";

        }
        else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", (a) => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //listen for seekbar
    document.querySelector(".seekBar").addEventListener("click", e => {
        let fraction = (e.offsetX / e.target.getBoundingClientRect().width);//getBoundingClientRect().width : This gets the width of the .seekBar element in pixels.
        document.querySelector(".circle").style.left = fraction * 100 + "%";
        currentSong.currentTime = currentSong.duration * fraction;
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = 0;
    })

    //add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    //add an event listenet to previous
    previous.addEventListener("click",()=>{
        console.log("Previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })

    //add an event listenet to next
    next.addEventListener("click",()=>{
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if((index+1) < songs.length ){
            playMusic(songs[index+1]);
        }
    })
}

main();