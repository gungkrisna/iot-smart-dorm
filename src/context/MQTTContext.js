import React, { createContext, useEffect, useState } from 'react';
import useMQTT from '../hooks/useMQTT';

export const MQTTContext = createContext(isLoading = true);

export const MQTTProvider = (props) => {
  const { rootPath, userName, password, server, port } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { onMQTTLost, mqttConnectRef, isConnected, temp, hum, DHTLastUpdate, isDoorLocked, isLedTurnedOn, ledBrightness, handleLedBrightness, ledTimer, handleLedTimer, toggleLock, handleLedToggle } = useMQTT(
    rootPath, userName, password, server, port
  );

  useEffect(() => {
    setIsLoading(!isConnected);
  }, [isConnected]);

  return (
    <MQTTContext.Provider value={{ rootPath, onMQTTLost, mqttConnectRef, isLoading, temp, hum, DHTLastUpdate, isDoorLocked, isLedTurnedOn, ledBrightness, handleLedBrightness,ledTimer, handleLedTimer, toggleLock, handleLedToggle }}>
      {props.children}
    </MQTTContext.Provider>
  );
};

