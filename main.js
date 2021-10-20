const apiLink = 'https://jsonplaceholder.typicode.com/users'

const addUserBtn = document.getElementById('btn-addUser')

const usersTableBody = document.getElementById('tableBody')

const addUserModal = document.querySelector('.addUserModal')
const addUserModal_CloseBtn = document.querySelector('.addUserClose')
const addUserModal_SaveBtn = document.querySelector('.saveNewUser')

const inputs = document.querySelectorAll('input')

const fetchedData = getDataFromApi()

// ! Fetch Data by API

function getDataFromApi() {
	return fetch(apiLink)
		.then(res => res.json())
}

fetchedData.then(usersData => console.log(usersData))

// ! Render Fetched Data in Table

let globalUsersData;
initTable();

function initTable() {
	fetchedData.then(usersData => {

		usersData.forEach(userData => {
			userData.isAditable = false;
		});

		globalUsersData = usersData;
		renderTable(usersData);
	})
}

function renderTable(usersData) {

	let tableRow = '';

	globalUsersData.forEach(userData => {
		if (userData.isAditable === true) {
			tableRow += `
			<tr>
				<th id="id-${userData.id}" scope="row">${userData.id}</th>
				<td> <input id="userName-${userData.id}" type="text" value="${userData.name}"></td>
				<td> <input id="email-${userData.id}" type="text" value="${userData.email}"></td>
				<td> <input id="city-${userData.id}" type="text" value="${userData.address.city}">
					<input id="street-${userData.id}" type="text" value="${userData.address.street}" class="my-1">
					<input id="suite-${userData.id}" type="text" value="${userData.address.suite}">
				</td>
				<td> <input id="companyName-${userData.id}" type="text" value="${userData.company.name}"></td>
				<td> <input id="zipcode-${userData.id}" type="text" value="${userData.address.zipcode}"></td>
				<th scope="row">
					<div class="editDataBtns d-flex">
						<button onclick="saveEditedData(${userData.id})" class="btn-success rounded-3 m-1" style="cursor: pointer">Save</button>
						<button onclick="cancelEditing(${userData.id})" class="btn-secondary rounded-3 m-1" style="cursor: pointer">Cancel</button>
					</div>
				</th>
			</tr>
			`
		} else {
			tableRow += `
			<tr>
				<th onclick="showFullDataModal(${userData.id})" id="id-${userData.id}" scope="row">${userData.id}</th>
				<td onclick="showFullDataModal(${userData.id})" id="userName-${userData.id}">${userData.name}</td>
				<td onclick="showFullDataModal(${userData.id})" id="email-${userData.id}">${userData.email}</td>
				<td onclick="showFullDataModal(${userData.id})" id="adress-${userData.id}">${userData.address.city},
							${userData.address.street},
							${userData.address.suite}</td>
				<td onclick="showFullDataModal(${userData.id})" id="companyName-${userData.id}">${userData.company.name}</td>
				<td onclick="showFullDataModal(${userData.id})" id="zipcode-${userData.id}">${userData.address.zipcode}</td>
				<th scope="row">
					<div class="defaultBtns d-flex">
						<button onclick="editUserData(${userData.id})" class="btn-primary rounded-3 m-1" style="cursor: pointer">Edit</button>
						<button onclick="removeUser(${userData.id})" class="btn-danger rounded-3 m-1" style="cursor: pointer">Remove</button>
					</div>
				</th>
			</tr>
			`
		}
	});
	usersTableBody.innerHTML = tableRow;
}

// ! Add User to the Table

addUserBtn.addEventListener('click', showAddUserModal)
addUserModal_CloseBtn.addEventListener('click', closeAddUserModal)
addUserModal_SaveBtn.addEventListener('click', saveNewUser)

function showAddUserModal() {
	addUserModal.style.display = 'block'
}

function closeAddUserModal() {
	addUserModal.style.display = 'none'
	clearInputs()

	console.log('adding new user was canceled');
}

function clearInputs() {
	inputs.forEach(input => input.value = '')
}

function saveNewUser() {
	const id = globalUsersData.length + 1;
	const fullName = document.querySelector('input[placeholder = "Full Name"]').value
	const email = document.querySelector('input[placeholder = "Email"]').value
	const city = document.querySelector('input[placeholder = "City"]').value
	const street = document.querySelector('input[placeholder = "Street"]').value
	const suite = document.querySelector('input[placeholder = "Suite"]').value
	const companyName = document.querySelector('input[placeholder = "Company Name"]').value
	const zipCode = document.querySelector('input[placeholder = "Zipcode"]').value

	const newUser = {
		id: id,
		name: fullName,
		email: email,
		address: {
			city: city,
			street: street,
			suite: suite,
			zipcode: zipCode,
		},
		company: {
			name: companyName,
		},
		isAditable: false,
	}

	globalUsersData.push(newUser)
	renderTable(globalUsersData)
	closeAddUserModal()

	console.log('new user has been added');
	console.log(globalUsersData);
}

// ! Table Sorting

const tableThs = document.querySelectorAll('th[scope="col"]');
sortTable(globalUsersData);

function sortTable() {
	for (const tableTh of tableThs) {
		tableTh.addEventListener('click', sortColumn);

		function sortColumn() {
			const order = this.dataset.order;
			const column = this.dataset.column;
			const nested = this.dataset.nested;

			if (order == 'desc') {
				this.setAttribute('data-order', 'asc');
				globalUsersData = globalUsersData.sort((a, b) => a[column] > b[column] ? 1 : -1);
				globalUsersData = globalUsersData.sort((a, b) => a[column][nested] > b[column][nested] ? 1 : -1);
			} else {
				this.setAttribute('data-order', 'desc');
				globalUsersData = globalUsersData.sort((a, b) => a[column] < b[column] ? 1 : -1);
				globalUsersData = globalUsersData.sort((a, b) => a[column][nested] < b[column][nested] ? 1 : -1);
			};

			renderTable(globalUsersData);

			console.log('column: ' + column + ' has been sorted: ' + order);
			console.log(globalUsersData);
		}
	}
}

// ! Add Column with Action Buttons

function removeUser(userToRemoveId) {
	globalUsersData = globalUsersData.filter(userData => userData.id != userToRemoveId);
	renderTable(globalUsersData);

	console.log('userToRemoveId ' + userToRemoveId + ': has been removed');
	console.log(globalUsersData);
}

function editUserData(userToEditId) {
	globalUsersData.find(userData => userData.id === userToEditId).isAditable = true;
	renderTable(globalUsersData);

	console.log('userToEditId ' + userToEditId + ': selected to edit');
}

function saveEditedData(editedUserDataId) {
	const editedUser = {
		id: editedUserDataId,
		name: document.querySelector(`#userName-${editedUserDataId}`).value,
		email: document.querySelector(`#email-${editedUserDataId}`).value,
		address: {
			city: document.querySelector(`#city-${editedUserDataId}`).value,
			street: document.querySelector(`#street-${editedUserDataId}`).value,
			suite: document.querySelector(`#suite-${editedUserDataId}`).value,
			zipcode: document.querySelector(`#zipcode-${editedUserDataId}`).value,
		},
		company: {
			name: document.querySelector(`#companyName-${editedUserDataId}`).value,
		},
		isAditable: false,
	}

	let editedUserIndex = globalUsersData.findIndex(userData => userData.id == editedUserDataId);

	globalUsersData.splice(editedUserIndex, 1, editedUser);
	cancelEditing(editedUserDataId);

	console.log('editedUserDataId ' + editedUserDataId + ' : was changed');
	console.log(globalUsersData);
}

function cancelEditing(userToEditId) {
	globalUsersData.find(userData => userData.id == userToEditId).isAditable = false;
	renderTable(globalUsersData);

	console.log('userToEditId ' + userToEditId + ': editing was canceled');
}

// ! Click on the row of the table

function showFullDataModal(selectedUserId) {
	document.querySelector('.showFullUserData').style.display = 'block';

	let selectedUserIndex = globalUsersData.findIndex(userData => userData.id == selectedUserId);

	document.querySelector('.userName').innerHTML = globalUsersData[selectedUserIndex].username;
	document.querySelector('.name').innerHTML = globalUsersData[selectedUserIndex].name;
	document.querySelector('.id').innerHTML = '<b>Id: </b>' + globalUsersData[selectedUserIndex].id;
	document.querySelector('.phone').innerHTML = '<b>Phone: </b>' + globalUsersData[selectedUserIndex].phone;
	document.querySelector('.website').innerHTML = '<b>Website: </b>' + globalUsersData[selectedUserIndex].website;
	document.querySelector('.city').innerHTML = '<b>City: </b>' + globalUsersData[selectedUserIndex].address.city;
	document.querySelector('.geo-lat').innerHTML = '<b>lat: </b>' + globalUsersData[selectedUserIndex].address.geo.lat;
	document.querySelector('.geo-lng').innerHTML = '<b>lng: </b>' + globalUsersData[selectedUserIndex].address.geo.lng;
	document.querySelector('.street').innerHTML = '<b>Street: </b>' + globalUsersData[selectedUserIndex].address.street;
	document.querySelector('.suite').innerHTML = '<b>Suite: </b>' + globalUsersData[selectedUserIndex].address.suite;
	document.querySelector('.zipcode').innerHTML = '<b>Zipcode: </b>' + globalUsersData[selectedUserIndex].address.zipcode;
	document.querySelector('.companyName').innerHTML = '<b>name: </b>' + globalUsersData[selectedUserIndex].company.name;
	document.querySelector('.catchPhrase').innerHTML = '<b>catch phrase: </b>' + globalUsersData[selectedUserIndex].company.catchPhrase;
	document.querySelector('.bs').innerHTML = '<b>bs: </b>' + globalUsersData[selectedUserIndex].company.bs;

	console.log('fullDataModal index: ' + selectedUserIndex + ' has been shown');
}

function closeFullDataModal() {
	document.querySelector('.showFullUserData').style.display = 'none';
	console.log('fullDataModal was closed');
}