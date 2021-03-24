const messages = document.querySelector('#messages')
const form = document.querySelector('form')
const username = document.querySelector('#username')
const newMessage = document.querySelector('#new-message')
let ws;

_init()
async function _init() {
  username.value = localStorage['username'] || ''
  newMessage.focus()

  let messages = await fetch('/rest/messages')
  messages = await messages.json()

  for(let msg of messages) {
    appendMessage(msg)
  }
}

connect()
async function connect() {
  console.log('connecting');
  const protocol = location.protocol == 'https:' ? 'wss' : 'ws'
  ws = new WebSocket(`${protocol}://${location.host}/ws`)
  
  ws.onmessage = message => {
    let data = JSON.parse(message.data)
    appendMessage(data)
  }

  ws.onopen = () => console.log('connected');

  // try to reconnect every second
  ws.onclose = () => {
    console.log('disconnected');

    setTimeout(() => {
      connect()
    }, 1000);
  }
}

function send(message) {
  if(ws) {
    ws.send(message)
  }
}

function appendMessage(message) {
  let messageDiv = document.createElement('div')
  messageDiv.innerHTML = `
    <p>${new Date(message.time).toLocaleString()}</p>
    <p><strong>${message.sender}: </strong>${message.text}</p>
  `
  messages.append(messageDiv)
}

form.addEventListener('submit', e => {
  e.preventDefault() // prevent page reload

  let message = {
    sender: username.value,
    text: newMessage.value,
    time: Date.now()
  }

  send(JSON.stringify(message))

  newMessage.value = ''
})

username.addEventListener('keyup', () => (localStorage['username'] = username.value))