import React from 'react';
import {Dimensions, Image, Modal, StyleSheet, View} from 'react-native';
import {SplashScreen} from '../constants/imgs';

const LoaderScreen = () => {
  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.loaderContainer}>
        <Image source={SplashScreen} style={{width: '100%', height: '100%'}} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
