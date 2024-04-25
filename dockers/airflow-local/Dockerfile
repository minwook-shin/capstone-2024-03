FROM apache/airflow:2.9.0-python3.12

ENV AIRFLOW_HOME=/opt/airflow

WORKDIR $AIRFLOW_HOME

USER root
RUN apt-get update -qq && apt-get install vim -qqq && apt-get install -y python3-pip

RUN python3 -m pip install --upgrade pip

RUN python3 -m pip install --no-cache-dir requests apache-airflow-providers-slack

COPY scripts scripts
RUN chmod +x scripts

USER $AIRFLOW_UID