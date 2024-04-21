"""
This module contains the blueprint for the manager page of the ADB API.
"""
import os
import pickle
import json
from flask import Blueprint, render_template, Response

manager = Blueprint('manager', __name__)
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
api_data_path = os.path.join(root_dir, 'api_data.pkl')

@manager.route('/manager')
def variable_manager():
    """
    Render the manager page.
    ---
    get:
        responses:
            200:
            description: The manager page.
    """
    try:
        with open(api_data_path, 'rb') as f:
            api_data = pickle.load(f)
    except (FileNotFoundError, EOFError):
        api_data = {}

    return render_template('manager.html', data=api_data)

@manager.route('/manager/clear')
def clear_manager():
    """
    Clear the API data.
    ---
    get:
        responses:
            200:
            description: The manager page with cleared data.
    """
    with open(api_data_path, 'wb') as f:
        pickle.dump({}, f)

    return render_template('manager.html', data={})


@manager.route('/manager/download', methods=['GET'])
def download():
    """
    Download the API data as a JSON file.
    ---
    get:
        responses:
            200:
            description: The API data as a JSON file.
    """
    with open(api_data_path, 'rb') as f:
        api_data = pickle.load(f)
    json_data = json.dumps(api_data, ensure_ascii=False)
    response = Response(json_data, mimetype='application/json')
    response.headers['Content-Disposition'] = 'attachment; filename=archive.json'
    return response
