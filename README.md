# python-chat
A simple Python chat application with Sanic websockets

## Live example
https://sanic-chat.herokuapp.com/

Deployed example uses sqlite as a database, and gets reset at regular intervals

## Getting started
- `python -m venv venv` create virtual environment
- `venv/Scripts/activate.bat` activate venv
- `python -m pip install -r requirements.txt` install requirements
- `python main.py` launch server

## Deploy to Heroku
- Create `requirements.txt` -> `python -m pip freeze > requirements.txt` 
- Create a file in root directory named: `Procfile`, with the content: 
  `web: python main.py`
- In main.py, set port to env variable:
  `app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))`
- `npm install -g heroku` install heroku CLI
- `heroku login` login with heroku
- `heroku git:remote -a sanic-chat` connect git repo with heroku remote
- `git push heroku main` deploy new version
  - If version error when installing packages: update to latest found version in the `requirements.txt`, commit and push again.