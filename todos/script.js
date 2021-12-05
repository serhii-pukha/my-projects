// Selectors //
// =============================================== //
const listsContainer = document.querySelector('[data-lists]')
const tasksContainer = document.querySelector('[data-tasks]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const deleteTaskButton = document.querySelector(".tasks")
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

// EventListeners // 
// =============================================== //
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li' || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'h3' || e.target.tagName.toLowerCase() === 'use') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

deleteTaskButton.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'use'){
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => task.id !== e.target.id)
    saveAndRender()
  }
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

// Functions //
// =============================================== //
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedList == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {

    const taskElement = document.createElement('div')
    taskElement.classList.add("task__item")

    const checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.id = task.id
    checkbox.checked = task.complete

    const label = document.createElement('label')
    label.classList.add("task__text")
    label.append(task.name)

    const a = document.createElement('a')
    a.classList.add("remove")
    a.id = task.id 

    const remove = document.createElementNS('http://www.w3.org/2000/svg', "svg")
    remove.classList.add("remove__icon")
    remove.id = task.id

    const removeInner = document.createElementNS('http://www.w3.org/2000/svg', "use")
    removeInner.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#remove')
    removeInner.id = task.id
    
    remove.appendChild(removeInner)
    a.appendChild(remove) 
    taskElement.appendChild(checkbox)
    taskElement.appendChild(label)
    taskElement.appendChild(a)
    tasksContainer.appendChild(taskElement)
  })
}

function renderLists() {
  lists.forEach(list => {

    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list__name")

    const svg = document.createElementNS('http://www.w3.org/2000/svg', "svg")
    svg.classList.add("list__icon")
    svg.dataset.listId = list.id

    const use = document.createElementNS('http://www.w3.org/2000/svg', "use")
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#list')
    use.dataset.listId = list.id

    const taskText = document.createElement("h3")
    taskText.classList.add("list__title")
    taskText.innerText = list.name
    taskText.dataset.listId = list.id

    if (list.id === selectedListId) {
      listElement.classList.add('list--active')
    }

    svg.appendChild(use)
    listElement.appendChild(svg)
    listElement.appendChild(taskText)
    listsContainer.appendChild(listElement)

  })
}

render()