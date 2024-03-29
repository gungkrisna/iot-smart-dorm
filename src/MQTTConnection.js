import init from 'react_native_mqtt';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export default class MQTTConnection {
    constructor() {
        this.mqtt = null;
        this.QOS = 0;
        this.RETAIN = true;
    }

    connect(host, port, options) {
        let currentTime = +new Date();
        let clientID = currentTime + uuid.v1();
        clientID = clientID.slice(0, 23);

        this.mqtt = new Paho.MQTT.Client(host, port, clientID);

        this.mqtt.onConnectionLost = (res) => {
            this.onMQTTLost;
        };

        this.mqtt.onMessageArrived = (message) => {
            this.onMQTTMessageArrived(message);
        };
        
        this.mqtt.onMessageDelivered = (message) => {
            this.onMQTTMessageDelivered(message);
        };

        const connectOptions = options;

        this.mqtt.connect({
            onSuccess: this.onMQTTSuccess,
            onFailure: this.onMQTTFailure,
            ...connectOptions
        });
    }

    onMQTTSuccess = () => {
        this.onMQTTConnect()
    }

    onMQTTFailure = () => {
        this.onMQTTLost()
    }

    subscribeChannel(channel) {
        if (!this.mqtt || !this.mqtt.isConnected()) {
            return;
        }
        this.mqtt.subscribe(channel, this.QOS);
    }

    unsubscribeChannel(channel) {
        if (!this.mqtt || !this.mqtt.isConnected()) {
            return;
        }
        this.mqtt.unsubscribe(channel);
    }

    send(channel = null, payload) {
        if (!this.mqtt || !this.mqtt.isConnected()) {
            return;
        }

        if (!channel || !payload) {
            return false;
        }
        this.mqtt.publish(channel, payload, this.QOS, this.RETAIN);
    }

    close() {
        this.mqtt && this.mqtt.disconnect();
        this.mqtt = null;
    }

}

MQTTConnection.prototype.onMQTTConnect = null
MQTTConnection.prototype.onMQTTLost = null
MQTTConnection.prototype.onMQTTMessageArrived = null
MQTTConnection.prototype.onMQTTMessageDelivered = null