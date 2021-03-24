from sanic import Sanic, response as res
from sanic.exceptions import NotFound
from sanic.websocket import ConnectionClosed
import json
import copy
from database import get_messages, post_message

app = Sanic('app')

# list of connected clients
clients = set()

async def broadcast(message):
  # must iterate a copy of the clients set
  # because the loop gets inconsistent if removing
  # an element while iterating
  for client in copy.copy(clients):
    try: 
      await client.send(message)
    except ConnectionClosed:
      # remove client from list if disconnected
      clients.remove(client)

@app.websocket('/ws')
async def websockets(req, ws):
  # add connected client to list
  clients.add(ws)

  while True:
    # wait to receive message from client
    data = await ws.recv()
    data = json.loads(data) # parse json

    # save message to db
    data['id'] = await post_message(data)

    print(data)

    data = json.dumps(data) # stringify dict

    # broadcast message to all clients
    await broadcast(data)

@app.get('/rest/messages')
async def messages(req):
  return res.json(await get_messages())

app.static('/', './dist')

@app.exception(NotFound)
async def ignore_404s(request, exception):
    return await res.file('./dist/index.html')

if __name__ == '__main__':
  app.run(port=5000)
