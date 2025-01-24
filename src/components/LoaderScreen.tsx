import React from 'react';
import { ActivityIndicator, Dimensions, Modal, StyleSheet, View } from 'react-native';

const LoaderScreen = () => {
  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.loaderContainer}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4d9ddf" />
        </View>
      </View>
    </Modal>
  );
};

export default LoaderScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loader: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
});
