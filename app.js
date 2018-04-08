// Declare variables globally so they can be referenced where needed
var $lowerCaseKeyboard;
var $upperCaseKeyboard;
let sentences;
var currentSentenceIndex;
var currentSentence;
var currentCharacterIndex;
var currentCharacter;
var $currentSentenceAsParagraph;
var isLastLetterInWord;
var isLastLetterInSentence;
var numberOfCorrectKeysPressed;
var numberOfMistakes;
var numberOfWords
var $sentenceDiv;
var $targetLetter;
var startDate;
var endDate;
var $yellowBlock;
main();

function main() {
    // assign initial values to variables in main so when game restarts, we can just call main.
    startDate = new Date(); // For now, the game starts when the page loads. I want to start the timer when the user presses a key for the first time.
    $lowerCaseKeyboard = $("#keyboard-lower-container");
    $upperCaseKeyboard = $("#keyboard-upper-container");
    sentences = ['ten ate neite ate nee enet ite ate inet ent eate', 'Too ato too nOt enot one totA not anot tOO aNot', 'oat itain oat tain nate eate tea anne inant nean', 'itant eate anot eat nato inate eat anot tain eat', 'nee ene ate ite tent tiet ent ine ene ete ene ate'];
    currentSentenceIndex = 0;
    currentSentence = sentences[currentSentenceIndex];
    currentCharacterIndex = 0;
    currentCharacter = currentSentence[currentCharacterIndex];
    $currentSentenceAsParagraph = $("<p>" + currentSentence + "</p>");
    isLastLetterInWord = false;
    isLastLetterInSentence = false
    numberOfCorrectKeysPressed = 0;
    numberOfMistakes = 0;
    numberOfWords = calculateNumberOfWords();
    $sentenceDiv = $("#sentence");
    $targetLetter = $("#target-letter");
    $yellowBlock = $("#yellow-block");

    $currentSentenceAsParagraph.attr("id", "currentSentence");
    $upperCaseKeyboard.css("display", "none");
    $currentSentenceAsParagraph.appendTo($sentenceDiv);
    updateTargetLetter();
    resetYellowBlock();
}

// Helper functions
function evaluateKeyPressed(selectedKeyCodeWithHash) {
    currentCharacter = currentSentence[currentCharacterIndex];
    displayAppropriateSymbol(String.fromCharCode(removeHash(selectedKeyCodeWithHash)));
    isLastLetterInSentence = atEndOfSentence();
    isLastLetterInWord = atEndOfWord();
    currentCharacterIndex++;
    updateTargetLetter();
    nudgeYellowBlock();
}
function clearChecksAndXs() {
    var $icons = $(".ui-icon");
    $icons.remove();
}

function nudgeYellowBlock() {
    var pixelValueAsString = $yellowBlock.css("left");
    var numberOfPixels = getNumberOfPixels(pixelValueAsString);
    if (isLastLetterInWord) {
        if (isLastLetterInSentence) {
            resetYellowBlock();
            updateSentence();
            clearChecksAndXs();
            resetFlags();
            return;
        }
        else {
            var numberOfPixels = numberOfPixels + 19;
        }
    }
    else {
        var numberOfPixels = numberOfPixels + 17;
    }
    var newNumAsStringWithPX = (numberOfPixels.toString()) + "px";
    $yellowBlock.css("left", newNumAsStringWithPX);
    resetFlags();

}

function resetYellowBlock() {
    $yellowBlock.css({
        "left": "31px",
        "display": "block"
    });
}

function isSpecialKey(num) {
    var specialKeys = [192, 189, 187, 220, 221, 219, 222, 186, 191, 190, 188];
    var correctValue = [96, 45, 61, 92, 93, 91, 39, 59, 47, 46, 44];
    for (var i = 0; i < specialKeys.length; i++) {
        if (num == specialKeys[i]) {
            return [true, "#" + correctValue[i]];
        }
    }
    return [false];
}

function removeHash(str) {
    if (str.length == 3) {
        return parseInt(str[1] + str[2]);
    }
    return parseInt(str[1] + str[2]) + str[3];
}

function updateTargetLetter() {
    currentCharacter = currentSentence[currentCharacterIndex];
    $targetLetter.text(currentCharacter);
}

function clearSentenceAndYellowBlock() {
    $sentenceDiv.text("");
    $yellowBlock.css("display", "none");
}

function updateSentence() {
    if (isLastSentence()) {
        clearSentenceAndYellowBlock();
        stopTimer();
        return;
    }
    currentSentenceIndex++;
    currentSentence = sentences[currentSentenceIndex];
    $("#currentSentence").text(currentSentence);
    resetCharacterIndex();
    updateTargetLetter();
}

function resetFlags() {
    isLastLetterInWord = false;
    isLastLetterInSentence = false;
}

function resetCharacterIndex() {
    currentCharacterIndex = 0;
}

function getNumberOfPixels(pixelValueAsString) {
    if (pixelValueAsString.length == 2) {
        return parseInt(pixelValueAsString[0] + pixelValueAsString[1]);
    }
    return parseInt(pixelValueAsString[0] + pixelValueAsString[1] + pixelValueAsString[2]);
}

function displayAppropriateSymbol(characterInput) {
    var $div = $("#feedback");
    if (characterInput == currentCharacter) {
        numberOfCorrectKeysPressed++;
        var $span = $("<span class='ui-icon ui-icon-check glyphicon-ok'></span>");  
    }
    else {
        numberOfMistakes++;
        var $span = $("<span class='ui-icon ui-icon-closethick glyphicon-remove'></span>"); 
    }
    $span.appendTo($div); 
}

function atEndOfSentence() {
    return (currentCharacterIndex + 1) == currentSentence.length;
}

function atEndOfWord() {
    return currentSentence[currentCharacterIndex + 1] == " " || atEndOfSentence();
}

function isLastSentence() {
    return currentSentenceIndex + 1 == sentences.length;
}

function checkTime(i) {
    if (i < 10) {   // add zero in front of numbers < 10
        i = "0" + i;
    }
    return i;
}

function calculateDuration() {
    var totalHours = endDate.getHours() - startDate.getHours();
    var totalMinutes = endDate.getMinutes() - startDate.getMinutes();
    var totalSeconds = endDate.getSeconds() - startDate.getSeconds();
    var hoursInMinutes = totalHours * 60;
    var secondsInMinutes = totalSeconds / 60;
    return hoursInMinutes + totalMinutes + secondsInMinutes;
}

function askUserToPlayAgain() {
    // VERSION USING CONFIRM
    var answer = confirm("Would you like to play again?");
    if (answer) {
        restartGame();
    }

    // VERSION USING DIV
    // var $div = $("<div id='prompt'></div>");
    // var $p = $("<p>Would you like to play again?</p>");
    // var $confirmButton = $("<button class='greenBackground button' onclick='restartGame()'> Yes </button>");
    // var $denyButton = $("<button class='redBackground button'> No </button>");
    // $p.appendTo($div);
    // $confirmButton.appendTo($div);
    // $denyButton.appendTo($div);
    // $div.prependTo("body");
    // $div.css({
    //     "text-align": "center",
    //     "width": "100%"
    // });
}

function restartGame() {
    $("#prompt").css("display", "none");
    // $("#prompt").hide();
    main();
}

function stopTimer() {
    // At this point,the game is over
    endDate = new Date();
    var minutes = calculateDuration();
    $targetLetter.text("Score: " + Math.floor(numberOfCorrectKeysPressed / minutes - 2 * numberOfMistakes));
    setTimeout(function() {
        askUserToPlayAgain();
    }, 3000);
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function calculateNumberOfWords() {
    var count = 0;
    for (var i = 0; i < sentences.length; i++) {
        for (var j = 0; j < sentences[i].length; j++) {
            count++;
        }
    }
    return count;
}




// Key action detectors 
$(document).keydown(function (e) {
    if (e.which == 16) {
        $upperCaseKeyboard.toggle();
        $lowerCaseKeyboard.toggle();
    }
});

$(document).keyup(function (e) {
    if (e.keyCode == 16) {
        $upperCaseKeyboard.toggle();
        $lowerCaseKeyboard.toggle();
    }
    testArray = isSpecialKey(e.keyCode);
    if (testArray[0]) {
        $(testArray[1]).removeClass("highlighted");
    }
    else {
        var num = e.keyCode;
        var key = "#" + num;
        var otherKey = "#" + (num + 32);
        $(key).removeClass("highlighted");
        $(otherKey).removeClass("highlighted");
    }
});

$(document).keypress(function (e) {
    // hasGameStarted = true;
    var key = "#" + e.which;
    $(key).addClass("highlighted");
    evaluateKeyPressed(key);
});