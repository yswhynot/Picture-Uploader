function picElement(newID) {
	var outputElement = document.createElement('div');

	var fileUpload = document.createElement('input');
	var buttonDelete = document.createElement('input');
	var buttonChange = document.createElement('input');
	var buttonWrapper = document.createElement('div');
	var imgDefault = document.createElement('img');
	var uploadForm = document.createElement('form');
	var idInput = document.createElement('input');

	buttonChange.setAttribute('class', 'pic-button pic-change');
	buttonDelete.setAttribute('class', 'pic-button pic-delete');
	buttonChange.setAttribute('value', 'Change');
	buttonDelete.setAttribute('value', 'Delete');
	buttonChange.setAttribute('type', 'button');
	buttonDelete.setAttribute('type', 'button');
	buttonChange.setAttribute('onclick', 'changeImg(this);');
	buttonDelete.setAttribute('onclick', 'deleteImg(this);');

	fileUpload.setAttribute('type', 'file');
	fileUpload.setAttribute('onchange', 'imgChange(this);');
	fileUpload.setAttribute('name', 'file');
	idInput.setAttribute('type', 'text');
	idInput.setAttribute('name', 'elementID');
	uploadForm.setAttribute('class', 'file-uploader');

	buttonWrapper.setAttribute('class', 'button-wrapper');
	imgDefault.setAttribute('src', '../images/default.png');

	outputElement.setAttribute('class', 'pic-element');
	outputElement.setAttribute('id', '56ab0d087dfe95b0b168892a');
	
	buttonWrapper.appendChild(buttonChange);
	buttonWrapper.appendChild(buttonDelete);

	uploadForm.appendChild(fileUpload);
	uploadForm.appendChild(idInput);

	outputElement.appendChild(imgDefault);
	outputElement.appendChild(buttonWrapper);
	outputElement.appendChild(uploadForm);

	return outputElement;
}

function imgChange(element) {
	var elementID = element.parentNode.parentNode.id;
	var fileUpload = document.getElementById(elementID).lastChild.firstChild;
	var currentImg = document.getElementById(elementID).childNodes[0];

	// load uploaded img file & elementID
	var imgFile = fileUpload.files[0];
	var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result;
        }

    var formData = new FormData();
    formData.append('elementID', elementID);
    formData.append('file', imgFile);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/change');
    xhr.send(formData);

	// update HTML img src
	var reader = new FileReader();
	reader.onload = function (e) {
		currentImg.setAttribute('src', e.target.result);
	}
	reader.readAsDataURL(imgFile);
}

function changeImg(element) {
	var elementID = element.parentNode.parentNode.id;
	document.getElementById(elementID).lastChild.firstChild.click();
}

function deleteImg(element) {
	var elementID = element.parentNode.parentNode.id;

	// POST elementID
	var request = new XMLHttpRequest();
	request.open('POST', '/change', true);
	request.setRequestHeader('Content-Type', 'text/plain');
	request.send(elementID);

	// delete corresponding div in  HTML
	var currentRoot = element.parentNode.parentNode;
	currentRoot.parentNode.removeChild(currentRoot);
}

function addImg() {
	// GET elementID
	var newID;
	var request = new XMLHttpRequest();
	request.open('GET', '/add', true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			newID = request.responseText;
		}
	};

	// add HTML div with elementID
	var picContainer = document.getElementById('pic-container');
	// var newElement = picElement(newID);
	var newElement = picElement();
	picContainer.insertBefore(newElement, picContainer.lastChild.previousSibling);
}

function initGetImg() {
	// GET media stream

	// decode media stream

	// init all div list in HTML
}
