const tiledisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let wordle

// /function to get random five letter word with help of api

const getWordle = () => {
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json => {
        console.log(json)
        wordle = json.toUpperCase()
    })
    .catch (err => {
        console.log(err)
        wordle = "PLACE"
    })
}

getWordle()

// Keyboard keys array
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<<',
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0
let currentTile = 0
let isGameover = false

guessRows.forEach((guessrow,guessindex) => {
    const rowelement = document.createElement('div')
    rowelement.setAttribute('id', 'guessrow-' + guessindex)
    guessrow.forEach((guess, index) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessrow-'+guessindex+'-tile-'+index)
        tileElement.classList.add('tile')
        rowelement.append(tileElement)
    })
    tiledisplay.append(rowelement)
})

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6)  {

        const tile = document.getElementById('guessrow-'+currentRow+'-tile-'+currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data',letter)
        currentTile++
    }
}

// click handler
const handleclick = (key) => {
    if (!isGameover) {
        console.log('clicked',key)
        if (key == "<<") {
            deleteLetter()
            return 
        }
        if (key == "ENTER") {
            checkRow()
            return
        }
        addLetter(key)
    }
}


keys.forEach( key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id',key)
    buttonElement.addEventListener('click', () => handleclick(key))
    keyboard.append(buttonElement)
})

//Backspace utility function
const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessrow-'+currentRow+'-tile-'+currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

//Validates each row
const checkRow = () => {
    if (currentTile === 5) {

        const guess = guessRows[currentRow].join('')

        /*fetch(`http://localhost:8080/check/?word=${guess}`)
        .then (response => response.json())
        .then(json => {
            console.log(json)
            if (json != 'Success') {
                showMessage('Enter valid word')
                return
            }
        }).catch (err => console.log(err))
        */
        console.log('guess is ' + guess, 'wordle is ' + wordle)

        flipTile(guess)

        if (wordle == guess) {
            showMessage('You got it right')
            isGameover = true
            return
        }
        else {
            if (currentRow >= 5) {
                isGameover = true
                showMessage('Game Over')
                return
            }
            if (currentRow < 5) {
                currentRow++
                currentTile = 0
            }
        }
    }
}

const showMessage = (message) => {
    const msgElement = document.createElement('p')
    msgElement.textContent = message
    messageDisplay.append(msgElement)
    setTimeout(() => messageDisplay.removeChild(msgElement), 2000)
}

const addColorToKeyboard = (key, style) => {
    const selectedKey = document.getElementById(key)
    selectedKey.classList.add(style)
}


const flipTile = (guessWord) => {
    const rowTiles = document.querySelector('#guessrow-'+currentRow).childNodes

    let checkWordle = wordle
    let lcsString = lcs(guessWord,checkWordle)
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == lcsString[index]) {
            guess.color = 'blue-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKeyboard(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

// Checks lcs for the guess word and the wordle
function lcs(guess, wordle, alp=2, accumulator = ''){
    for( let a in guess ){
        for( let b=a-alp; b<a+alp; b++ ){
            accumulator += ( wordle[b] === guess[a] && a-b < alp && b-a < alp ) ? guess[a]:"";
        }
    }
    let res = ""
    let j=0
    for ( let i=0; i<guess.length; i++ ) {
        if (accumulator[j] === guess[i] ) {
            res += guess[i]
            j++
        }
        else {
            res += "0"
        }
    }
    return res
}