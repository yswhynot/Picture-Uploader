function picElement(newID, imgsrc, etitle) {
	var outputElement = document.createElement('div');

	var fileUpload = document.createElement('input');
	var buttonDeleteSpan = document.createElement('span');
	var buttonDelete = document.createElement('a');
	var buttonChangeSpan = document.createElement('span');
	var buttonChange = document.createElement('a');
	var buttonWrapper = document.createElement('div');
	var imgDefault = document.createElement('img');
	var uploadForm = document.createElement('form');
	var idForm = document.createElement('input');
	var inputDesp = document.createElement('input');

	buttonChangeSpan.setAttribute('class', 'glyphicon glyphicon-circle-arrow-up');
	buttonDeleteSpan.setAttribute('class', 'glyphicon glyphicon-remove-sign');
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
	fileUpload.setAttribute('name', 'image');
	uploadForm.setAttribute('class', 'file-uploader');
	uploadForm.setAttribute('enctype', 'multipart/form-data');
	uploadForm.setAttribute('method', 'post');
	idForm.setAttribute('type', 'text');
	idForm.setAttribute('name', 'formid');

	buttonWrapper.setAttribute('class', 'button-wrapper');
	imgDefault.setAttribute('src', imgsrc);
	inputDesp.setAttribute('class', 'pic-desp');
	inputDesp.setAttribute('placeholder', 'Your Title Here');
	inputDesp.setAttribute('onfocusout', 'updateTitle(this);');
	inputDesp.setAttribute('value', etitle);

	outputElement.setAttribute('class', 'pic-element pic-element-oplow');
	outputElement.setAttribute('id', newID);
	
	buttonChange.appendChild(buttonChangeSpan);
	buttonDelete.appendChild(buttonDeleteSpan);
	buttonWrapper.appendChild(buttonChange);
	buttonWrapper.appendChild(buttonDelete);

	uploadForm.appendChild(idForm);
	uploadForm.appendChild(fileUpload);

	outputElement.appendChild(inputDesp);
	outputElement.appendChild(imgDefault);
	outputElement.appendChild(buttonWrapper);
	outputElement.appendChild(uploadForm);

	return outputElement;
}

function imgChange(element) {
	var elementID = element.parentNode.parentNode.id;
	var fileUpload = document.getElementById(elementID).lastChild.lastChild;
	var currentImg = document.getElementById(elementID).childNodes[1];

	// load uploaded img file & elementID
	var imgFile = fileUpload.files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		var srcData = fileLoadedEvent.target.result;
	};

	var formSubmit = document.getElementById(elementID).lastChild;
	formSubmit.firstChild.setAttribute('value', elementID);
	var formData = new FormData(formSubmit);
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
	document.getElementById(elementID).lastChild.lastChild.click();
	element.stopPropagation();
}

function deleteImg(element) {
	var elementID = element.parentNode.parentNode.id;

	// POST elementID
	var request = new XMLHttpRequest();
	request.open('POST', '/delete', true);
	request.setRequestHeader('Content-Type', 'application/json');
	var sendData = {eid: elementID};
	request.send(JSON.stringify(sendData));

	// delete corresponding div in  HTML
	var currentRoot = element.parentNode.parentNode;
	currentRoot.classList.remove('pic-element-ophigh');
	currentRoot.classList.add('pic-element-oplow');
	currentRoot.parentNode.removeChild(currentRoot);
}

function addImg() {
	// GET elementID
	var newID;
	var newElement;
	var request = new XMLHttpRequest();
	request.open('GET', '/add', true);
	request.send();
	request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			newID = request.responseText;
			console.log(request.responseText);
			newElement = picElement(newID, '../images/default.png', '');

			// add HTML div with elementID
			var picContainer = document.getElementById('pic-container');
			picContainer.insertBefore(newElement, picContainer.lastChild.previousSibling);
			// newElement.classList.remove('pic-element-oplow');
			newElement.classList.add('pic-element-ophigh');
		}
	};

}

function updateTitle(element) {
	elementID = element.parentNode.id;

	var request = new XMLHttpRequest();
	request.open('POST', '/title', true);
	request.setRequestHeader('Content-Type', 'application/json');

	var etitle = document.getElementById(elementID).childNodes[0].value;
	var sendData = {eid: elementID, title: etitle};
	request.send(JSON.stringify(sendData));
}

function initGetImg() {
	var initArray;
	var picContainer = document.getElementById('pic-container');

	// GET media stream
	var request  = new XMLHttpRequest();
	request.open('GET', '/init', true);
	request.send();
	request.onreadystatechange = function() {
		if(request.readyState == XMLHttpRequest.DONE) {
			initArray = JSON.parse(request.responseText);
			console.log('init: ' + initArray);
			initArray.forEach( function(element) {
				console.log('element: ' + element);
				newElement = picElement(element.eid, 'http://127.0.0.1:3000/storage/' + element.eid + '.png', element.etitle);
				picContainer.insertBefore(newElement, picContainer.lastChild.previousSibling);
				newElement.classList.remove('pic-element-oplow');
			});
		}
	}

	// init sortable drap operation
	var el = document.getElementById('pic-container');
	var sortable = Sortable.create(el, {
		draggable: ".pic-element",
		ghostClass: "pic-ghost",
		animation: 500,
		chosenClass: "pic-chosen",
		filter: ".button-wrapper .button-add"
	});

}

