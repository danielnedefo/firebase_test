const addModal = document.querySelector('.add-modal')  
const modalWrapper = document.querySelector('.modal-wrapper')
const btnAdd = document.querySelector('.btn-add')
const addModalForm = document.querySelector('.add-modal .form')
const editModal = document.querySelector('.edit-modal')
const editModalForm = document.querySelector('.edit-modal .form')

let id;
btnAdd.addEventListener('click', function (e) {
  e.preventDefault()
  modalWrapper.classList.add('modal-show')
  addModalForm.firstName.value = '';
    addModalForm.lastName.value = '';
  addModalForm.email.value = '';
  addModalForm.phone.value = '';

})
window.addEventListener('click', e => {
  if (e.target === addModal) {
    addModal.classList.remove('modal-show')
  }
  if (e.target === editModal) {
    editModal.classList.remove('modal-show')
  }
})
db.collection('users').get().then(querySnapshot => {
  querySnapshot.forEach(doc => {
    renderUser(doc)
  })
})
const tableUser = document.querySelector('.table-users')
// create elem and render user
const renderUser = doc => {
  const tr = `<tr data-id=${doc.id}>
            <td>${doc.data().firstName}</td>
            <td>${doc.data().lastName}</td>
            <td>${doc.data().phone}</td>
            <td>${doc.data().Email}</td>
                    <td>
                  <button class="btn btn-edit">Edit</button>
                  <button class="btn btn-delete">Remove</button>
                    </td>
          </tr>`;
  tableUser.insertAdjacentHTML('beforeend', tr)

  const btnEdit = document.querySelector(`[data-id=${doc.id}] .btn-edit`)
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show')
    id = doc.id
    editModalForm.firstName.value = doc.data().firstName
    editModalForm.lastName.value = doc.data().lastName
    editModalForm.phone.value = doc.data().phone
    editModalForm.email.value = doc.data().Email

  })

  const btnDelete = document.querySelector(`[data-id=${doc.id}] .btn-delete`)
  btnDelete.addEventListener('click', () => {
    db.collection('users').doc(`${doc.id}`).delete().then(() => {
      console.log('deleted')
    }).cath(err => console.log(err))
  })
}
addModalForm.addEventListener("submit", (e) => {
  e.preventDefault()
  db.collection('users').add({

    firstName: addModalForm.firstName.value,
    lastName: addModalForm.lastName.value,
    phone: addModalForm.phone.value,
    Email: addModalForm.email.value,

  })
  auth.createUserWithEmailAndPassword(addModalForm.email.value, addModalForm.phone.value).then(cred => {
    console.log(cred.user)
  })
  modalWrapper.classList.remove('modal-show')
})
// Click submit in edit-modal
editModalForm.addEventListener('submit', (e) => {
  e.preventDefault()
  db.collection('users').doc(id).update({
    firstName: editModalForm.firstName.value,
    lastName:editModalForm.lastName.value,
    phone:editModalForm.phone.value,
    Email:editModalForm.email.value,
  })
  editModal.classList.remove('modal-show')
})
db.collection('users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    console.log(change.type)
    if (change.type === 'added') {
      renderUser(change.doc)
    } if (change.type === 'removed') {
      let tr = document.querySelector(`[data-id =${change.doc.id}]`)
      let tbody = tr.parentElement
      tableUser.removeChild(tbody)
    }if (change.type === 'modified') {
      let tr = document.querySelector(`[data-id =${change.doc.id}]`)
      let tbody = tr.parentElement
      tableUser.removeChild(tbody)
      renderUser(change.doc)
    }
  })
})
// for sign in 
//auth.signInWithEmailAndPassword(email,password).then(cred =>{
  // 
// })