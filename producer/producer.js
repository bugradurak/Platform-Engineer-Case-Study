const { KafkaClient, Producer } = require('kafka-node');
const { v4: uuidv4 } = require('uuid');

// Kafka bağlantı ayarları
const kafkaBroker = process.env.KAFKA_BROKER_URL || 'localhost:9092';
const kafkaTopic = process.env.KAFKA_TOPIC || 'events';

// Kafka Client ve Producer oluşturuluyor
const client = new KafkaClient({ kafkaHost: kafkaBroker });
const producer = new Producer(client, { requireAcks: 1 });

// Payload oluşturma fonksiyonu
function generatePayload() {
  return {
    eventId: uuidv4(),
    eventType: 'user_signup',
    timestamp: new Date().toISOString(),
    payload: {
      username: Math.random().toString(36).substring(2, 12),
    },
  };
}

// Producer bağlandığında mesaj gönderimi başlatılır
producer.on('ready', () => {
  console.log('Kafka producer is ready.');

  setInterval(() => {
    const message = JSON.stringify(generatePayload());

    producer.send(
      [
        {
          topic: kafkaTopic,
          messages: [message],
        },
      ],
      (err) => {
        if (err) console.error('Error sending message:', err);
        else console.log('Message sent:', message);
      }
    );
  }, 3000);
});

// Hata yönetimi
producer.on('error', (err) => console.error('Producer error:', err));
client.on('error', (err) => console.error('Kafka client connection error:', err));
