// Do any page setup, like modifying placeholder text
function init() {
	var textarea = document.getElementsByTagName('textarea')[0];
	textarea.placeholder = textarea.placeholder.replace(/\\n/g, '\n');
}

function getRandomTeam(arr, groupSize) {
	var currentTeam = '';
	for (var i=0; i < groupSize; i++) {

		var randomPerson = arr[Math.floor(Math.random()*arr.length)];

		// If we get undefined, out of choices.  Need to remove the last "&"
		// that we appended and break out of loop.
		if (randomPerson === undefined) {
			var trailingAmpersandIndex = currentTeam.lastIndexOf(' &');
			currentTeam = currentTeam.substring(0, trailingAmpersandIndex);
			break; 
		}

		// Get person's index and remove person from the array
		var indexOfPerson = arr.indexOf(randomPerson);
		arr.splice(indexOfPerson, 1);

		// Append an & if we're on any but the last group member 
		var stringToAppend = randomPerson;
		if (i < groupSize - 1) { stringToAppend += ' & '; }
		currentTeam += stringToAppend;
	}
	return currentTeam;
}

function generateAllTeams(peopleArray, groupSize) {
	var teams = [];
	while(peopleArray.length > 0) {
		var currentGroup = getRandomTeam(peopleArray, groupSize);
		teams.push(currentGroup);
	}
	addTeamsHTML(teams);
}

function addTeamsHTML(teamsArray) {
	var teamContainerEl = document.getElementById('team-container');
	for (var i=0; i<teamsArray.length; i++) {
		var teamGroupHTML = document.createElement('div');
		var teamNumber = i + 1;
		teamGroupHTML.classList.add('team');
		teamGroupHTML.innerHTML = 'Team #' + teamNumber + ': ' + teamsArray[i];
		teamContainerEl.appendChild(teamGroupHTML);
	}
}

function formatTextareaValue(textAreaValue) {
	var peopleArray = textAreaValue.split('\n');
	var valueToDelete = '';

	// loop backwards because splice will re-index the array
	for (var i=peopleArray.length; i >= 0; i--) {
		if (peopleArray[i] === valueToDelete) {
			peopleArray.splice(i, 1);
		}
	}
	return peopleArray;
}

function validateUserInput(value) {
	// must be > 0 and an integer
	return value > 0 && value % 1 === 0;
}

function generateErrors(inputValidity, textareaValidity) {
	var validityTests = [
		{
			validity: inputValidity,
			errorId: 'size-error',
			type: 'input'
		},
		{
			validity: textareaValidity,
			errorId: 'people-error',
			type: 'textarea'
		}
	];

	for (var i=0; i < validityTests.length; i++) {
		var targetEl = document.getElementById(validityTests[i].errorId);
		var inputError = 'Values must be an integer > 0';
		var textareaError = 'No People Info Entered';
		var errorText = validityTests[i].type === 'input' ? inputError : textareaError;
		
		if (!validityTests[i].validity) {
			targetEl.innerHTML = errorText;
		} else {
			targetEl.innerHTML = '';
		}
	}
}

document.getElementById('team-settings').addEventListener('submit', function(e) {
	e.preventDefault();

	var inputValue = document.getElementsByTagName('input')[0].value;
	var textAreaValue = document.getElementsByTagName('textarea')[0].value;

	var peopleArray = formatTextareaValue(textAreaValue);

	var isValidInputValue = validateUserInput(inputValue);
	var isValidTextarea = validateUserInput(peopleArray.length);

	generateErrors(isValidInputValue, isValidTextarea);

	if (isValidInputValue && isValidTextarea) {
		document.getElementById('team-container').innerHTML = '';
		generateAllTeams(peopleArray, inputValue);
	}
});

init();

