Proje: Platform Mühendisi - Vaka Çalışması
Bu projede,ubuntu-server üzerinde üç broker’lı bir Kafka kümesi, Kafka UI, Producer, Consumer, API, MongoDB ve Prometheus birlikte çalışacak şekilde hem Docker Compose hem de Helm ile ayağa kaldırılabilir.
• Docker Compose seçeneği: Lokal geliştirme veya hızlı test için idealdir.
• Helm Chart seçeneği: Kubernetes ortamında kurulum yapmak için uygundur.
Not: Her iki yaklaşımda da JMX Exporter sayesinde Kafka broker metrikleri Prometheus tarafından toplanır. 

Klasör Yapısı
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
 
• docker-compose.yml: Tüm servislerin (kafka broker’ları, kafka-ui, producer, consumer, API, mongo, prometheus) Docker Compose tanımı.
• prometheus.yml: Prometheus’un hangi hedeflerden metrik toplayacağını belirler.
• kafka klasörü: Kafka JMX Exporter entegresi için özel Dockerfile ve config.
• producer, consumer, api klasörleri: Her servise ait Dockerfile ve uygulama kaynak dosyaları.
• helm klasörü: Kubernetes ortamında kullanmak için hazırlanmış Helm Chart dosyaları.

Kurulum Seçenekleri
2.1. Docker Compose ile Kurulum
  1.Docker ve Docker Compose kurulu olduğundan emin ol.
  2.Proje klasörüne gir ve şu komutu çalıştır:
    bash docker-compose up --build
  3.Aşağıdaki komut ile tüm konteynerlerin “Up” durumda olduğunu doğrula.
    bash watch docker ps -a  
  4.Aşağıdaki portlar üzerinden servisleri test edebilirsin .
    Kafka UI: http://localhost:8081
    Prometheus: http://localhost:9090
Docker Compose Avantajları
•Lokal geliştirme ve test için hızlı çözümdür.
•Tek bir makinede kolayca çalıştırabilirsin.

2.2. Helm Chart ile Kurulum (Kubernetes)
  1.Kubernetes ve Helm (v3 veya üstü) kurulu olduğundan emin ol.
  2.Proje klasöründen helm klasörüne gir ve bu kodu çalıştır :
    bash helm install my-kafka-cluster .
  3.Aşağıdaki komutla kaynakların ayağa kalktığını doğrula.
    bash watch kubectl get pods  
  4.Kafka UI ve Prometheus sayfalarına ulaşmak için:
    Kafka UI: http://localhost:30080
    Prometheus: http://localhost:30082 
Helm Chart Avantajları
•Kubernetes ortamında ölçekleme (scaling), yüksek erişilebilirlik vb. kolaydır.
•Ortam (dev, stage, prod) bazında values.yaml değiştirerek konfigürasyonu yönetebilirsin.

Kafka Metrikleri ve Prometheus
•Kafka brokerları, JMX Exporter ile 5556 portundan metrik sağlar.
•Prometheus prometheus.yml (Compose) veya ConfigMap (Helm) içerisinden kafka1:5556, kafka2:5556, kafka3:5556 adreslerini scrape eder.
•http://localhost:9090 (Compose) veya http://localhost:30082 (Helm) üzerinden Prometheus arayüzüne girip “Status > Targets” altında “kafka-jmx” job’unun UP olduğunu görebilirsin.

İş Akışı
1.Producer → KAFKA_BROKER_URL ortam değişkeniyle Kafka broker’larına bağlanarak events topic’ine mesaj yazar.
2.Consumer → events topic’ini dinler, yeni mesajları alıp MongoDB’ye kaydeder.
3.API → MongoDB’den verileri okuyarak http://localhost:8080 (Compose) veya NodePort üzerinden REST endpoint sunar.
4.Kafka UI → Topic’leri, partition’ları, consumer group’ları vs. görsel arayüzde yönetmeni sağlar.
5.Prometheus → Kafka JMX metrikleri + diğer servislerin metriklerini toplar. Prometheus UI üzerinden gözlemleme imkânı sunar.

Sonuç
Bu proje, 3 broker’lı Kafka cluster + Mongo + Producer + Consumer + API + Prometheus bileşenlerini Docker Compose veya Helm Chart üzerinde hızla çalıştırmanı sağlar. Böylece gerçekçi bir streaming ve metrics ortamını hızlıca deneyimlenebilir.

