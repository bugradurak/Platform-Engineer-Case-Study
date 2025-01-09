Project: Platform Engineer - Case Study
In this project, a Kafka cluster with three brokers, Kafka UI, Producer, Consumer, API, MongoDB, and Prometheus can be set up to work together using both Docker Compose and Helm on an Ubuntu server.
• Docker Compose option: Ideal for local development or quick testing.
• Helm Chart option: Suitable for setting up in a Kubernetes environment.
Note: In both approaches, Kafka broker metrics are collected by Prometheus through the JMX Exporter.

Folder Structure
| docker-compose.yaml
| prometheus.yml
| + api
| | node_modules
| | api.js
| | dockerfile
| | package.json
| | package-lock.json
| + consumer
| | node_modules
| | consumer.js
| | dockerfile
| | package.json
| | package-lock.json
| + helm
| | Chart.yaml
| | values.yaml
| | + templates
| | | api-deployment.yaml
| | | api-service.yaml
| | | consumer-deployment.yaml
| | | consumer-service.yaml
| | | kafka-ui-deployment.yaml
| | | kafka-ui-service.yaml
| | | kafka1-deployment.yaml
| | | kafka1-service.yaml
| | | kafka2-deployment.yaml
| | | kafka2-service.yaml
| | | kafka3-deployment.yaml
| | | kafka3-service.yaml
| | | mongo-deployment.yaml
| | | mongo-service.yaml
| | | producer-deployment.yaml
| | | producer-service.yaml
| | | prometheus-config.yaml
| | | prometheus-deployment.yaml
| | | prometheus-service.yaml
| + kafka
| | dockerfile
| | jmx_exporter_config.yaml
| + producer
| | node_modules
| | dockerfile
| | producer.js
| | package.json
| | package-lock.json

Installation Options
2.1. Docker Compose Installation

Ensure Docker and Docker Compose are installed.
Navigate to the project folder and run the following command:
bash docker-compose up --build
Verify that all containers are “Up” by running:
bash watch docker ps -a
You can test the services on the following ports:
Kafka UI: http://localhost:8081
Prometheus: http://localhost:9090
Advantages of Docker Compose
• Quick solution for local development and testing.
• Easily run on a single machine.
2.2. Helm Chart Installation (Kubernetes)

Ensure Kubernetes and Helm (v3 or later) are installed.
Navigate to the helm folder in the project and run:
bash helm install my-kafka-cluster .
Verify that the resources are up by running:
bash watch kubectl get pods
Access Kafka UI and Prometheus pages:
Kafka UI: http://localhost:30080
Prometheus: http://localhost:30082
Advantages of Helm Chart
• Easy to scale (scaling), high availability, and other features in Kubernetes environments.
• Manage configurations by modifying values.yaml for different environments (dev, stage, prod).
Kafka Metrics and Prometheus
• Kafka brokers expose metrics on port 5556 via JMX Exporter.
• Prometheus scrapes the following addresses for metrics: kafka1:5556, kafka2:5556, kafka3:5556 (configured in prometheus.yml for Compose or ConfigMap for Helm).
• You can check the status of the "kafka-jmx" job in Prometheus by navigating to the "Status > Targets" section at:
- http://localhost:9090 (Compose)
- http://localhost:30082 (Helm)

Workflow

Producer → Connects to Kafka brokers using the KAFKA_BROKER_URL environment variable and writes messages to the events topic.
Consumer → Listens to the events topic, retrieves new messages, and saves them to MongoDB.
API → Reads data from MongoDB and serves a REST endpoint at http://localhost:8080 (Compose) or via NodePort.
Kafka UI → Provides a graphical interface to manage topics, partitions, consumer groups, etc.
Prometheus → Collects Kafka JMX metrics and other service metrics. You can observe them via the Prometheus UI.
Result
This project allows you to quickly deploy a 3-broker Kafka cluster + Mongo + Producer + Consumer + API + Prometheus using either Docker Compose or Helm Chart. It provides a realistic streaming and metrics environment that you can easily test.