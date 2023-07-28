let response = null;
let gongHelp = document.querySelector('.gong-icon')
let infoGong = document.querySelector('.infoGong')
let btnStart = document.querySelector('.start-timer')
let btnPause = document.querySelector('.pause-timer')
let t = null
let minutesInput = document.querySelector('#number-timer-minutes')
let secondesInput = document.querySelector('#number-timer-seconds')
let selectedSound = null;
let selectedGongButton = 15;
let timeGongButton = selectedGongButton;
let gongCheckbox = document.querySelector('#gong-check')
gongCheckbox.checked = false
let gongIsEnable = false;

const soundSea = new Audio('./assets/sons/sea.mp3');
const soundForest = new Audio('./assets/sons/forest.mp3');
const soundGong = new Audio('./assets/sons/gong.mp3');


function convertCurrentTime(response, inputMinutes, inputSecondes) {
    const minutes = Math.floor(response.lastTime / 60) // 600 sec -> 10 min -> 10 : 00
    const secondes = response.lastTime - minutes * 60;
    inputMinutes.value = minutes.toString().padStart(2, 0)
    inputSecondes.value = secondes.toString().padStart(2, 0)
}

fetch("/database/data.json").then(res => res.json()).then((r) => {
    response = r
    convertCurrentTime(response, minutesInput, secondesInput)
})

btnPause.addEventListener('click', () => {
    btnPause.style.display = 'none';
    btnStart.style.display = 'block';
    clearInterval(t);
    soundSea.pause();
    soundForest.pause();
});

btnStart.addEventListener('click', () => {
    btnPause.style.display = 'block';
    btnStart.style.display = 'none';

    soundGong.play()

    t = setInterval(() => {
        console.log(--response.lastTime);
        if (gongIsEnable) {
            console.log(--timeGongButton);
        }
        convertCurrentTime(response, minutesInput, secondesInput);

        if (response.lastTime <= 0) {
            clearInterval(t);
            btnPause.style.display = 'none';
            btnStart.style.display = 'block';

            soundGong.play();
            
            soundSea.pause()
            console.log(soundSea)

            soundForest.pause()
            console.log(soundForest)

            selectedSound = 'no-sound'
        }

        if (gongIsEnable && timeGongButton === 0 && response.lastTime > (timeGongButton - 5)) {
            soundGong.play();
            timeGongButton = selectedGongButton;
            console.log('sounded')
        }

        if (selectedSound === 'sea') {
            soundSea.play();
        } else if (selectedSound === 'forest') {
            soundForest.play();
        } else {
            soundSea.pause();
            soundForest.pause();
        }

    }, 1000);

});

gongHelp.addEventListener('mouseenter', (e) => {
        infoGong.style.display = 'block';
})

gongHelp.addEventListener('mouseleave', (e) => {
    infoGong.style.display = 'none';
})

gongHelp.addEventListener('click', () => {
    if (infoGong.style.display  === 'block') {
        infoGong.style.display  = 'none'
    } else {
        infoGong.style.display = 'block'
    }
})

secondesInput.addEventListener('input', (event) => {
    let v = event.target.value.trim()

    if (v.length < 2) {
        return;
    }

    if (isNaN(v)) {
        console.log(v + " : n'est pas un nombre");
        secondesInput = ''
        return;
    }

    if (!(Number.isInteger(parseInt(v)))) {
        console.log(v + " : n'est pas un nombre entier");
        secondesInput = ''
        return;
    }

    if (parseInt(v) < 0) {
        console.log(v + " : est un nombre inférieur à 0");
        secondesInput = ''
        return;
    }

    if (parseInt(v) >= 60) {
        console.log(v + " : est  un nombre supérieur à 60");
        secondesInput = ''
        return;
    }

    console.log(v + " est un nombre entre 0 et 60")
})


minutesInput.addEventListener('input', (event) => {
    let v = event.target.value.trim()

    if (v.length < 2) {
        return;
    }

    if (isNaN(v)) {
        console.log(v + " : n'est pas un nombre");
        minutesInput.value = ''
        return;
    }

    if (!(Number.isInteger(parseInt(v)))) {
        console.log(v + " : n'est pas un nombre entier");
        minutesInput.value = ''
        return;
    }

    if (parseInt(v) < 0) {
        console.log(v + " : est un nombre inférieur à 0");
        minutesInput.value = ''
        return;
    }

    if (parseInt(v) >= 60) {
        console.log(v + " : est  un nombre supérieur à 60");
        minutesInput.value = ''
        return;
    }

    console.log(v + " est un nombre entre 0 et 60")
})

const soundButtons = document.querySelectorAll('.row-sound button');
soundButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Récupérer le son sélectionné
        selectedSound = button.dataset.sound;

        soundButtons.forEach(btn => {
            btn.classList.remove('button-active')
            const underline = btn.querySelector('.underline');
            underline.style.transform = 'scaleX(0)'
        });
        button.classList.add('button-active');
        
        // Arrêter la lecture des autres sons
        soundSea.pause();
        soundForest.pause();

        const underline = button.querySelector('.underline');
        underline.style.transform = "scaleX(1)";

        selectedSound = button.dataset.sound;
    });
});

const gongButtonsTiming = document.querySelectorAll('.btn-gong-time > button')
gongButtonsTiming.forEach(b => {

    b.addEventListener('click', () => {
        selectedGongButton = parseInt(b.dataset.time);
        timeGongButton = selectedGongButton
        console.log(selectedGongButton);

        gongButtonsTiming.forEach(b => {
            b.classList.remove('button-active-gong')
            let underline = b.querySelector('.underline-gong');
            underline.style.transform = 'scaleX(0)'
        })

        b.classList.add('button-active-gong')
        let underline = b.querySelector('.underline-gong');
        underline.style.transform = 'scaleX(1)'
    })
})

gongCheckbox.addEventListener('change', (e) => {
    gongIsEnable = e.currentTarget.checked
})