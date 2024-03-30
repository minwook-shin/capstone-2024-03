import pickle
import json
from flask import Blueprint, render_template, Response

manager = Blueprint('manager', __name__)

@manager.route('/manager')
def variable_manager():
    try:
        with open('api_data.pkl', 'rb') as f:
            api_data = pickle.load(f)
    except (FileNotFoundError, EOFError):
        api_data = {}

    return render_template('manager.html', data=api_data)

@manager.route('/manager/clear')
def clear_manager():
    with open('api_data.pkl', 'wb') as f:
        pickle.dump({}, f)

    return render_template('manager.html', data={})


@manager.route('/manager/download', methods=['GET'])
def download():
    with open('api_data.pkl', 'rb') as f:
        api_data = pickle.load(f)
    json_data = json.dumps(api_data, ensure_ascii=False)
    response = Response(json_data, mimetype='application/json')
    response.headers['Content-Disposition'] = 'attachment; filename=archive.json'
    return response
