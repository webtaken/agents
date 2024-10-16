# Backend

Steps to deploy:

- Create virtual environment `python -m venv .venv` python (recommended >=11).
- Set in `runtime.txt` the python version.
- To install packages just type `pip install -r starter_requirements.txt`.
- To generate the `requirements.txt` for deployment in railway: `pip freeze > requirements.txt`.
- Create a `.env` file using the `.env.example` file as template.
- Push to main branch linked to Railway app.
