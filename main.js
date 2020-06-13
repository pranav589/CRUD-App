//get reference to elements
const alert = document.querySelector('.alert');

const form = document.querySelector('.grocery-form');

const grocery = document.getElementById('grocery');

const submitBtn = document.querySelector('.submit-btn');

const container = document.querySelector('.grocery-container');

const list = document.querySelector('.grocery-list');

const clearBtn = document.querySelector('.clear-btn');

//editing options
let editElement;
let editFlag = false;
let editID = '';


//submit form event
form.addEventListener('submit', addItem)

//clear items
clearBtn.addEventListener('click', clearItem)

//load items
window.addEventListener('DOMContentLoaded', setupItems)

//function for form submit
function addItem(event) {

  event.preventDefault();

  //getting value of input
  const value = grocery.value;

  //creating ids
  const id = new Date().getTime().toString();

  if (value !== '' && editFlag === false) {
    createListItem(id, value)

    //display alert
    displayAlert('Item added to the list', 'success');

    //show container
    container.classList.add('show-container');

    //add to local storage
    addToLocalStorage(id, value);

    //set back to default
    setBackToDefault()
  }

  else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  }

  else {
    displayAlert('Please enter the item', 'danger')
  }
}

//display alert 
function displayAlert(text, action) {

  //text for the alert 
  alert.textContent = text;

  //action for alert
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function() {

    alert.textContent = '';

    alert.classList.remove(`alert-${action}`)

  }, 1000)
}

//function clear Item  
function clearItem() {

  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {

    items.forEach(function(item) {

      list.removeChild(item);
    })
  }

  container.classList.remove('show-container');

  displayAlert('Empty List', 'danger');

  setBackToDefault();
  localStorage.removeItem('list')
}

//delete function. 
function deleteItem(event) {

  const element = event.currentTarget.parentElement.parentElement;

  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length = 0) {

    container.classList.remove('show-container')
  }

  displayAlert('Item removed', 'danger');

  setBackToDefault();
  //remove from local storage 
  removeFromLocalStorage(id)
}

function editItem(event) {

  const element = event.currentTarget.parentElement.parentElement;

  //set edit item 
  editElement = event.currentTarget.parentElement.previousElementSibling;

  //set form value 
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = 'Update';
}
//set to default 
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}

//local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function(item) {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function(item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}


function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function(item) {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem(id, value) {
  //creating element
  const element = document.createElement('article');

  //adding class to element
  element.classList.add('grocery-item');

  //creating attribute
  const attr = document.createAttribute('data-id');

  //value of attribute equals id
  attr.value = id;

  //adding attribute to element
  element.setAttributeNode(attr);

  //innerHTML of element
  element.innerHTML = `
         <p class="title">${value}</p> 
         <div class = "btn-container">
           <button type="button" class="edit-btn">Edit</button> 
           <button type = "button" class = "delete-btn"> X </button> 
           </div>`

  const deleteBtn = element.querySelector('.delete-btn');

  const editBtn = element.querySelector('.edit-btn');

  deleteBtn.addEventListener('click', deleteItem);

  editBtn.addEventListener('click', editItem);

  //append child
  list.appendChild(element);
}