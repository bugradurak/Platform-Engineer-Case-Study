const { KafkaClient, Consumer, Producer } = require('kafka-node');
const mongoose = require('mongoose');

// MongoDB bağlantısı
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/events_db';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const eventSchema = new mongoose.Schema({
  eventId: String,
  eventType: String,
  timestamp: String,
  payload: Object,
});

const Event = mongoose.model('Event', eventSchema);

// Kafka bağlantısı
const kafkaBroker = process.env.KAFKA_BROKER_URL || 'localhost:9093';
const kafkaTopic = process.env.KAFKA_TOPIC || 'events';
const deadLetterTopic = process.env.DEAD_LETTER_TOPIC || 'dead-letter-events';

const client = new KafkaClient({ kafkaHost: kafkaBroker });
const consumer = new Consumer(client, [{ topic: kafkaTopic, partition: 0 }], {
  autoCommit: true,
});
const producer = new Producer(client);

// Maksimum yeniden deneme sayısı
const MAX_RETRIES = 3;

// Hata yönetimi için yardımcı bir fonksiyon
const handleFailedMessage = (message, retries) => {
  if (retries >= MAX_RETRIES) {
    console.error(`Max retries reached. Sending message to dead-letter queue:`, message);

    // Mesajı Dead-Letter kuyruğuna gönder
    producer.send(
      [{ topic: deadLetterTopic, messages: JSON.stringify(message) }],
      (err) => {
        if (err) {
          console.error('Failed to send message to dead-letter queue:', err);
        } else {
          console.log('Message sent to dead-letter queue');
        }
      }
    );
  } else {
    console.log(`Retrying message (${retries + 1}/${MAX_RETRIES})`, message);
    // İşlenemeyen mesajı aynı kuyruğa yeniden ekle
    producer.send(
      [{ topic: kafkaTopic, messages: JSON.stringify(message) }],
      (err) => {
        if (err) {
          console.error('Failed to requeue message:', err);
        }
      }
    );
  }
};

// Mesajları işleme ve MongoDB'ye kaydetme
consumer.on('message', async (message) => {
  try {
    const event = JSON.parse(message.value);
    console.log('Received event:', event);

    const newEvent = new Event(event);
    await newEvent.save();
    console.log('Event saved to MongoDB');
  } catch (err) {
    console.error('Error saving event:', err);
    const retries = message.retries || 0;
    handleFailedMessage({ ...message, retries: retries + 1 }, retries);
  }
});

// Producer hataları
producer.on('error', (err) => {
  console.error('Producer error:', err);
});

// Consumer hataları
consumer.on('error', (err) => {
  console.error('Consumer error:', err);
});
