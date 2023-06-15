import { useRef, useState, useEffect, useCallback } from "react";
import MQTTConnection from "../MQTTConnection";

import { Buffer } from 'buffer';
global.Buffer = Buffer;

export default function useMQTT(rootPath, userName, password, server, port) {
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [DHTLastUpdate, setDHTLastUpdate] = useState(0);

  const [isConnected, setIsConnected] = useState(false);
  const [isDoorLocked, setIsDoorLocked] = useState(false);
  const [isLedTurnedOn, setIsLedTurnedOn] = useState([false, false, false]);
  const [ledBrightness, setLedBrightness] = useState([0, 0, 0]);
  const [ledTimer, setLedTimer] = useState([0, 0, 0])

  const mqttConnectRef = useRef(null);

  useEffect(() => {
    const options = {
      useSSL: true,
      userName: userName,
      password: password,
      onFailure: (e) => {
        console.log('Here is the error: ', e);
      },
      reconnect: true,
      cleanSession: true,
      mqttVersion: 3,
    };

    mqttConnectRef.current = new MQTTConnection();
    mqttConnectRef.current.onMQTTConnect = onMQTTConnect;
    mqttConnectRef.current.onMQTTLost = onMQTTLost;
    mqttConnectRef.current.onMQTTMessageArrived = onMQTTMessageArrived;
    mqttConnectRef.current.onMQTTMessageDelivered = onMQTTMessageDelivered;

    mqttConnectRef.current.connect(
      server,
      port,
      options
    );

    return () => {
      mqttConnectRef.current.close();
    };
  }, [rootPath, userName, password, server, port]);

  const onMQTTConnect = useCallback(() => {
    mqttConnectRef.current.subscribeChannel(`/${rootPath}/#`);
    setIsConnected(true);
  }, [rootPath]);

  const onMQTTLost = useCallback(() => {
    setIsConnected(false);
  });

  const onMQTTMessageDelivered = useCallback((message) => {
    /*console.log(
        'MQTT message delivered: ' +
        message.destinationName +
        ' ' +
        message.payloadString
    );*/
  }, []);

  const onMQTTMessageArrived = useCallback((message) => {
    const topic = message.destinationName;
    const payload = message.payloadString;
    console.log('MQTT message arrived: ' + topic + ' ' + payload);

    // temp & hum
    if (topic === `/${rootPath}/TEMPERATURE`) {
      const newTemp = payload;
      setTemp(newTemp);
    }
    if (topic === `/${rootPath}/HUMIDITY`) {
      const newHum = payload;
      setHum(newHum);
    }
    if (topic === `/${rootPath}/DHT_LAST_UPDATE`) {
      const newDHTLastUpdate = payload;
      setDHTLastUpdate(newDHTLastUpdate);
    }

    // door lock
    if (topic === `/${rootPath}/IS_DOOR_LOCKED`) {
      const newDoorState = payload;
      setIsDoorLocked(newDoorState === '1');
    }

    // led
    if (topic === `/${rootPath}/IS_LED_0_TURNED_ON`) {
      const newLed0State = payload;
      setIsLedTurnedOn((prevIsLedTurnedOn) => {
        const updatedIsLedTurnedOn = [...prevIsLedTurnedOn];
        updatedIsLedTurnedOn[0] = newLed0State === '1';
        return updatedIsLedTurnedOn;
      });
    }
    if (topic === `/${rootPath}/IS_LED_1_TURNED_ON`) {
      const newLed1State = payload;
      setIsLedTurnedOn((prevIsLedTurnedOn) => {
        const updatedIsLedTurnedOn = [...prevIsLedTurnedOn];
        updatedIsLedTurnedOn[1] = newLed1State === '1';
        return updatedIsLedTurnedOn;
      });
    }
    if (topic === `/${rootPath}/IS_LED_2_TURNED_ON`) {
      const newLed2State = payload;
      setIsLedTurnedOn((prevIsLedTurnedOn) => {
        const updatedIsLedTurnedOn = [...prevIsLedTurnedOn];
        updatedIsLedTurnedOn[2] = newLed2State === '1';
        return updatedIsLedTurnedOn;
      });
    }

    // led brightness
    if (topic === `/${rootPath}/LED_0_BRIGHTNESS`) {
      const newLed0Brightness = payload;
      setLedBrightness((prevLedBrightness) => {
        const updatedLedBrightness = [...prevLedBrightness];
        updatedLedBrightness[0] = newLed0Brightness;
        return updatedLedBrightness;
      });
    }
    if (topic === `/${rootPath}/LED_1_BRIGHTNESS`) {
      const newLed1Brightness = payload;
      setLedBrightness((prevLedBrightness) => {
        const updatedLedBrightness = [...prevLedBrightness];
        updatedLedBrightness[1] = newLed1Brightness;
        return updatedLedBrightness;
      });
    }
    if (topic === `/${rootPath}/LED_2_BRIGHTNESS`) {
      const newLed2Brightness = payload;
      setLedBrightness((prevLedBrightness) => {
        const updatedLedBrightness = [...prevLedBrightness];
        updatedLedBrightness[2] = newLed2Brightness;
        return updatedLedBrightness;
      });
    }

    // led timer
    if (topic === `/${rootPath}/LED_0_TIMER`) {
        const newLed0Timer = payload;
        setLedTimer((prevLedTimer) => {
          const updatedLedTimer = [...prevLedTimer];
          updatedLedTimer[0] = newLed0Timer;
          return updatedLedTimer;
        });
      }
    if (topic === `/${rootPath}/LED_1_TIMER`) {
    const newLed1Timer = payload;
    setLedTimer((prevLedTimer) => {
        const updatedLedTimer = [...prevLedTimer];
        updatedLedTimer[1] = newLed1Timer;
        return updatedLedTimer;
    });
    }
    if (topic === `/${rootPath}/LED_2_TIMER`) {
    const newLed2Timer = payload;
    setLedTimer((prevLedTimer) => {
        const updatedLedTimer = [...prevLedTimer];
        updatedLedTimer[2] = newLed2Timer;
        return updatedLedTimer;
    });
    }

  }, [rootPath]);

  const toggleLock = useCallback(() => {
    setIsDoorLocked((prevIsDoorLocked) => {
      const isDoorLocked = !prevIsDoorLocked;
      mqttConnectRef.current.send(`/${rootPath}/IS_DOOR_LOCKED`, isDoorLocked ? '1' : '0');
      return isDoorLocked;
    });
  }, [rootPath]);

  const handleLedToggle = useCallback(
    (ledIndex) => {
      setIsLedTurnedOn((prevIsLedTurnedOn) => {
        const updatedIsLedTurnedOn = [...prevIsLedTurnedOn];
        updatedIsLedTurnedOn[ledIndex] = !prevIsLedTurnedOn[ledIndex];

        const isLedTurnedOn = updatedIsLedTurnedOn[ledIndex];

        mqttConnectRef.current.send(
          `/${rootPath}/IS_LED_${ledIndex}_TURNED_ON`,
          isLedTurnedOn ? '1' : '0'
        );

        return updatedIsLedTurnedOn;
      });
    },
    [mqttConnectRef, rootPath]
  );

  const handleLedBrightness = useCallback(
    (ledIndex, brightness) => {
      mqttConnectRef.current.send(
        `/${rootPath}/LED_${ledIndex}_BRIGHTNESS`,
        brightness.toString()
      );
    },
    [rootPath]
  );

  const handleLedTimer = useCallback(
    (ledIndex, timestamp) => {
        mqttConnectRef.current.send(
            `/${rootPath}/LED_${ledIndex}_TIMER`,
            Math.round(timestamp / 1000).toString()
        )
    }
  )

  return {
    mqttConnectRef,
    isConnected,
    temp,
    hum,
    DHTLastUpdate,
    isDoorLocked,
    isLedTurnedOn,
    ledBrightness,
    handleLedBrightness,
    ledTimer,
    handleLedTimer,
    toggleLock,
    handleLedToggle,
  };
}
