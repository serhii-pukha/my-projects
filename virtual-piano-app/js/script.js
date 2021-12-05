const keys = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyW', 'KeyE', 'KeyT', 'KeyY', 'KeyU'];

document.addEventListener("keydown", function (event) {
    if (keys.includes(event.code)) {
        let audio = new Audio('audio/' + event.code + '.mp3');
        audio.play();
    }
});