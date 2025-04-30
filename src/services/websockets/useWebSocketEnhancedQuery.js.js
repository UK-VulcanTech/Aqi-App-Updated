// services/useWebSocketEnhancedQuery.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import websocketService from './websocket.service';
// import websocketService from './websocket.service';

/**
* Hook to enhance existing queries with WebSocket updates
* @param {Array} queryKey - The query key to watch for updates
* @param {Function} shouldUpdateFn - Function to determine if a WS message should update this query
* @param {Function} updateDataFn - Function to update the query data with the WebSocket message
*/
export const useWebSocketEnhancedQuery = (queryKey, shouldUpdateFn, updateDataFn) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!queryKey || !Array.isArray(queryKey) || !shouldUpdateFn || !updateDataFn) {
            console.error('Invalid parameters for useWebSocketEnhancedQuery');
            return () => { };
        }

        // Create handler for WebSocket messages
        const handleWebSocketMessage = (message) => {
            try {
                console.log(`Processing WebSocket message for ${JSON.stringify(queryKey)}:`, message);

                if (shouldUpdateFn(message)) {
                    console.log(`Message matches criteria for ${JSON.stringify(queryKey)}, updating data`);

                    queryClient.setQueryData(queryKey, (oldData) => {
                        if (!oldData) {
                            console.log(`No existing data for ${JSON.stringify(queryKey)}`);
                            return message; // If no existing data, just use the message directly
                        }

                        const newData = updateDataFn(oldData, message);
                        console.log(`Data updated for ${JSON.stringify(queryKey)}`);
                        return newData;
                    });
                } else {
                    console.log(`Message does not match criteria for ${JSON.stringify(queryKey)}`);
                }
            } catch (error) {
                console.error(`Error handling WebSocket message for ${JSON.stringify(queryKey)}:`, error);
            }
        };

        // Subscribe to WebSocket updates
        console.log(`Subscribing to WebSocket updates for ${JSON.stringify(queryKey)}`);
        const unsubscribe = websocketService.subscribeToUpdates(
            queryKey,
            handleWebSocketMessage
        );

        // Cleanup on unmount
        return unsubscribe;
    }, [queryKey, queryClient, shouldUpdateFn, updateDataFn]);
};
