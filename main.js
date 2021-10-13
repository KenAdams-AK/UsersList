const apiLink = 'https://jsonplaceholder.typicode.com/users'

const getUserListBtn = document.querySelector('#btn-UsersList')
const addUserBtn = document.getElementById('btn-addUser')

const usersTable = document.querySelector('.table')
const usersTableBody = document.getElementById('tableBody')

const addUserModal = document.querySelector('.addUserModal')
const addUserModal_CloseBtn = document.querySelector('.addUserClose')
const addUserModal_SaveBtn = document.querySelector('.saveNewUser')
const addUserModal_Inputs = document.querySelectorAll('input')

const fetchedData = getDataFromApi()

// ! Fetch Data by API

function getDataFromApi() {
	return fetch(apiLink)
		.then(res => res.json())
}

fetchedData.then(usersData => console.log(usersData))

// ! Render Fetched Data in Table

getUserListBtn.addEventListener('click', renderUsersTable)

function renderUsersTable() {
	fetchedData.then(usersData => {
		let output = ''
		usersData.forEach(userData => {
			output += `
				<tr>
					<th id="full-info" scope="row">${userData.id}</th>
					<td id="full-info">${userData.name}</td>
					<td id="full-info">${userData.email}</td>
					<td id="full-info">${userData.address.city},
										${userData.address.street},
										${userData.address.suite}</td>
					<td id="full-info">${userData.company.name}</td>
					<td id="full-info">${userData.address.zipcode}</td>
				</tr>
			`
			console.log(userData)
		})
		usersTableBody.innerHTML = output
	})
	usersTable.removeAttribute('style')
}

// ! Add User to the Table

addUserBtn.addEventListener('click', showAddUserModal)
addUserModal_CloseBtn.addEventListener('click', closeAddUserModal)
addUserModal_SaveBtn.addEventListener('click', saveNewUser)

function showAddUserModal() {
	addUserModal.style.display = 'block'
}

function closeAddUserModal() {
	addUserModal.style.display = ''
	clearAddUserModal()
}

function clearAddUserModal() {
	addUserModal_Inputs.forEach(input => input.value = '')
}

function saveNewUser() {
	let output = `
			<tr>
				<th id="full-info" scope="row">${document.querySelector('input[placeholder = "ID"]').value}</th>
				<td id="full-info">${document.querySelector('input[placeholder = "Full Name"]').value}</td>
				<td id="full-info">${document.querySelector('input[placeholder = "Email"]').value}</td>
				<td id="full-info">${document.querySelector('input[placeholder = "City"]').value},
									${document.querySelector('input[placeholder = "Street"]').value},
									${document.querySelector('input[placeholder = "Suite"]').value}</td>
				<td id="full-info">${document.querySelector('input[placeholder = "Company Name"]').value}</td>
				<td id="full-info">${document.querySelector('input[placeholder = "Zipcode"]').value}</td>
			</tr>
`
	usersTable.innerHTML += output
	closeAddUserModal()
}