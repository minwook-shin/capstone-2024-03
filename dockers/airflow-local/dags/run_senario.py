import logging
from datetime import datetime

import requests
from airflow import DAG
from airflow.exceptions import AirflowException
from airflow.operators.python import PythonOperator
from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def check_server():
    try:
        response = requests.get("http://host.docker.internal:80")
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise AirflowException("Server is not alive") from e

def requests_run_api():
    response = requests.get("http://host.docker.internal:80/run")
    response.raise_for_status()
    logger.info(response.json())
    return response.json()

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "retries": 1,
}

with DAG(
    dag_id="run_sample",
    schedule_interval='@daily',
    default_args=default_args,
    catchup=False,
    max_active_runs=1,
    start_date=datetime(2024, 1, 1),
    end_date=datetime(2025, 1, 1),
    concurrency=1
) as new_dag:
    check = PythonOperator(
        task_id="check_server",
        python_callable=check_server
    )

    run = PythonOperator(
        task_id="requests_run_api",
        python_callable=requests_run_api
    )

    send_slack_message = SlackWebhookOperator(
        task_id='send_slack',
        slack_webhook_conn_id='slack_webhook',
        message='The senario is completed successfully',
    )

    check >> run >> send_slack_message
