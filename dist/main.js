const messages = document.querySelector('#messages')
const form = document.querySelector('form')
const input = document.querySelector('form > input')
let ws;

connect()
async function connect() {
  console.log('connecting');
  ws = new WebSocket('ws://localhost:5000/ws')
  
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

  let messages = await fetch('/rest/messages')
  messages = await messages.json()

  for(let msg of messages) {
    appendMessage(msg)
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
    <p>${message.text}</p>
  `
  messages.append(messageDiv)
}

form.addEventListener('submit', e => {
  e.preventDefault() // prevent page reload

  let message = {
    text: input.value,
    time: Date.now()
  }

  send(JSON.stringify(message))

  input.value = ''
})