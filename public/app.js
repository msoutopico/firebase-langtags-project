const langtagList = document.querySelector('#langtag-list');
const addForm = document.querySelector('#add-langtag-form');
const updateForm = document.querySelector('#langtag-edit-form');
const langtagTable = document.querySelector('#langtag-table');
const fields = ['cApStAn', 'OmegaT'];

// const button = document.querySelector('button#popup-triggerer')
const popup = document.querySelector('.popup-wrapper')
const close = document.querySelector('.popup-close')

const isoLangtagPattern = /^[a-z]{3}-[A-Z]{3}$/
const feedback = document.querySelector('.feedback')
feedback.style.display = 'none' // by default

function showTempAlert(elem, msg, delay){
	elem.textContent = msg;
	elem.style.display = 'block';
	setTimeout(() => elem.style.display = 'none', delay);
}

function renderLangtagRow(doc, change, fields) {

	let row = document.createElement('tr');
	row.setAttribute('data-id', doc.id);
	langtagTable.appendChild(row);

	row = langtagTable.querySelector("[data-id='" + doc.id + "']");


	let omegat = document.createElement('td');
	let capstan = document.createElement('td');
	let cross = document.createElement('td');
	let editBtn = document.createElement('td');

	let windowClose = document.createElement('i')
	windowClose.classList.add('fa');
	windowClose.classList.add('fa-window-close');

	omegat.textContent = doc.data().omegat;
	capstan.textContent = doc.data().capstan;
	cross.textContent = '×';
	// cross.appendChild(windowClose);
	cross.classList.add('del-btn');
	editBtn.textContent = 'Eddit';
	editBtn.classList.add('edit-btn');
	editBtn.classList.add('popup-triggerer');

	// remove all children from row
	row.innerHTML = '';

	row.appendChild(omegat);
	row.appendChild(capstan);
	row.appendChild(editBtn);
	row.appendChild(cross);

	// delete data
	cross.addEventListener('click', e => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('langtags').doc(id).delete();
	})

	// open editing form (popup)
	editBtn.addEventListener('click', e => {
		// e.stopPropagation();
		popup.style.display = 'block';

		const omegat = document.createElement('input'); omegat.id = 'omegat';
		omegat.setAttribute('type', 'text');

		/* 		const getValues = async () => {
					const response = await docRef.get();
					if (response === null){ // does not have status... ??
						throw new Error('Could not fetch the data, sorry');
					}
					const data = await response.data();
					return data;
				}
				getValues()
					.then(data => {
						omegat.setAttribute('value', data.omegat);
					})
					.catch(err => console.log('rejected:', err.message)); */
		let id = e.target.parentElement.getAttribute('data-id');

		updateForm.setAttribute('data-id', id);

		var docRef = db.collection('langtags').doc(id);

		docRef.get().then(resp => { // resp is a doc
			// console.log(resp);
			return resp.data();
		}).then(data => {
			// fields.forEach( field => create element etc.)
			omegat.setAttribute('value', data.omegat);
		}).catch(err => {
			console.log('rejected', err);
		})

		var appended = updateForm.querySelector('input#omegat') != null;
		if (!appended) {
			updateForm.appendChild(omegat);
		}

	})


}

close.addEventListener('click', () => {
	popup.style.display = 'none';
	// remove all input children from element
	let inputChild = updateForm.querySelector("input");
	updateForm.removeChild(inputChild);
})

// update data
updateForm.addEventListener('submit', e => {
	e.preventDefault();

	let id = e.target.getAttribute('data-id');
	console.log('submit\'s parent\'s id: ' + id);
	// check that data does not exist already
	db.collection('langtags').doc(id).update({
		omegat: updateForm.omegat.value
	});

	popup.style.display = 'none';
	// remove all children from element
	// updateForm.innerHTML = '';
	let inputChild = updateForm.querySelector("input"); 
	updateForm.removeChild(inputChild);
})

// saving data
addForm.addEventListener('submit', e => {
	e.preventDefault()
	// check that data does not exist already

	// check that some data has been entered
	if (addForm.omegat.value == '' || addForm.capstan.value == '') {
		showTempAlert(feedback, "Your new language code is empty.\
		Provide at least the cApStAn and an OmegaT codes.", 5000);
	} // check that data is valid
	else if (!isoLangtagPattern.test(addForm.capstan.value)) {
		// warning
		showTempAlert(feedback, "The cApStAn language code is not valid.", 5000);
	} else {
		feedback.style.display = 'none';
		db.collection('langtags').add({
			omegat: addForm.omegat.value,
			capstan: addForm.capstan.value
		})
		addForm.omegat.value = ''
		addForm.capstan.value = ''
	}

})

// add validation upkey -> box border
// https://www.udemy.com/course/modern-javascript-from-novice-to-ninja/learn/lecture/14174981#overview

// real-time listener
db.collection('langtags').orderBy('capstan').onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	changes.forEach(change => {
		// console.log(change.doc.data())
		if (change.type == 'added') {
			// renderLangtag(change.doc)
			renderLangtagRow(change.doc, change = 'new', fields)
		} else if (change.type == 'removed') {
			let row = langtagTable.querySelector("[data-id='" + change.doc.id + "']");
			langtagTable.removeChild(row);
		} else if (change.type == 'modified') {
			console.log('change.doc: ' + change.doc)
			// updateLangtag(change.doc);
			renderLangtagRow(change.doc, change = 'update', fields)
		}
	})
})