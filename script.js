console.log('Playing song using javascript');

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
            songs.push((element.href.split("/songs/")[1]).split(".mp3")[0]);
        }
    }
    return songs;
}

async function main() {
    //get the list of all songs
    let songs = await getSongs();
    console.log(songs);

    //play the first song
    var audio = new Audio(songs[3]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration, audio.currentSrc);
    })

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += `<li> ${song.replaceAll("_"," ")} </li>`;  
    }
}

main();