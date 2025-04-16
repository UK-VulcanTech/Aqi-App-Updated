// services/websocket.service.js

let socket = null;
let reconnectInterval = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Properly transform the URL from HTTP to WebSocket protocol
const BASE_URL = 'https://api.innovateitsolutions.co.uk';
console.log('🚀 ~ BASE_URL:', BASE_URL);
const WS_URL = BASE_URL.replace('https://', 'wss://') + '/ws';
console.log('🚀 ~ WS_URL:', WS_URL);

const websocketService = {
    listeners: new Map(),


    connect: () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return socket;
        }

        // Clear any existing reconnect interval
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }

        console.log(`Connecting to WebSocket: ${WS_URL}`);
        reconnectAttempts = 0;

        try {
            socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                console.log('WebSocket connection established successfully!');
                reconnectAttempts = 0;
                if (reconnectInterval) {
                    clearInterval(reconnectInterval);
                    reconnectInterval = null;
                }
            };

            socket.onmessage = (event) => {
                try {
                    console.log('WebSocket message received, parsing data...');
                    const data = JSON.parse(event.data);
                    console.log('Message parsed successfully, data type:', Array.isArray(data) ? 'Array' : typeof data);

                    if (Array.isArray(data)) {
                        console.log(`Array contains ${data.length} items`);
                    }

                    // Notify all listeners with the parsed data
                    if (websocketService.listeners.size === 0) {
                        console.log('No listeners registered for WebSocket updates');
                    } else {
                        console.log(`Notifying ${websocketService.listeners.size} listeners`);

                        websocketService.listeners.forEach((callback, queryKeyString) => {
                            console.log(`Notifying listener for ${queryKeyString}`);
                            try {
                                callback(data);
                            } catch (callbackError) {
                                console.error(`Error in listener callback for ${queryKeyString}:`, callbackError);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    console.log('Raw message:', event.data);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = (event) => {
                console.log('WebSocket connection closed with code:', event.code);

                // Only attempt to reconnect if we have listeners and haven't exceeded max attempts
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && websocketService.listeners.size > 0) {
                    reconnectAttempts++;
                    console.log(`WebSocket reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

                    if (!reconnectInterval) {
                        reconnectInterval = setInterval(() => {
                            console.log('Attempting to reconnect WebSocket...');
                            websocketService.connect();
                        }, 5000);
                    }
                } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                    console.log('Max reconnect attempts reached, giving up');
                    if (reconnectInterval) {
                        clearInterval(reconnectInterval);
                        reconnectInterval = null;
                    }
                }
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }

        return socket;
    },

    disconnect: () => {
        if (socket) {
            console.log('Disconnecting WebSocket');
            socket.close();
            socket = null;
        }

        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }

        reconnectAttempts = 0;
    },

    isConnected: () => {
        return socket && socket.readyState === WebSocket.OPEN;
    },

    subscribeToUpdates: (queryKey, callback) => {
        const queryKeyString = JSON.stringify(queryKey);
        console.log(`Subscribing to WebSocket updates for ${queryKeyString}`);

        websocketService.listeners.set(queryKeyString, callback);

        // Ensure connection is established
        if (websocketService.listeners.size > 0) {
            websocketService.connect();
        }

        return () => {
            console.log(`Unsubscribing from WebSocket updates for ${queryKeyString}`);
            websocketService.listeners.delete(queryKeyString);

            // Disconnect if no more listeners
            if (websocketService.listeners.size === 0) {
                websocketService.disconnect();
            }
        };
    },
};

export default websocketService;