// MapView.js
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const MapView = ({
  webViewRef,
  htmlContent,
  onWebViewMessage,
  onWebViewLoad,
  onWebViewError,
}) => {
  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{html: htmlContent}}
      onMessage={onWebViewMessage}
      onLoad={onWebViewLoad}
      onError={onWebViewError}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}
      containerStyle={{flex: 1}}
      nestedScrollEnabled={true}
      scalesPageToFit={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      directionalLockEnabled={false}
      androidLayerType="hardware"
      scrollEnabled={true}
      bounces={false}
      allowFileAccess={true}
      useWebKit={true}
      cacheEnabled={true}
      javaScriptEnabledAndroid={true}
      geolocationEnabled={true}
      mediaPlaybackRequiresUserAction={false}
      mixedContentMode="always"
      allowsInlineMediaPlayback={true}
      allowsBackForwardNavigationGestures={false}
      injectedJavaScript={`
        if (map) {
          map.invalidateSize();
          debug("Map size invalidated to ensure proper rendering");
        }
        true;
      `}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default MapView;
