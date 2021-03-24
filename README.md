# python-chat
A simple Python chat application with Sanic websockets

## Getting started
- `python -m venv venv` create virtual environment
- `venv/Scripts/activate.bat` activate venv
- `python -m pip install -r requirements.txt` install requirements
- `python main.py` launch server

## Deploy to Heroku
- `npm install -g heroku` install heroku CLI
- `heroku login` login with heroku
- `heroku git:remote -a sanic-chat` connect git repo with heroku remote
- `git push heroku main` deploy new version