
const loadFromLocalStorage = () => JSON.parse(localStorage.getItem('my-invites'))

const removeFromLocalStorage = () => localStorage.removeItem('my-invites')

const saveToLocalStorage = data =>  localStorage.setItem('my-invites', JSON.stringify(data))

export {
  loadFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage
}
