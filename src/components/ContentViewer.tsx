import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import useNavigation from '../hooks/useNavigation';
import useAuth from '../hooks/useAuth';
import LinearGradient from 'react-native-linear-gradient';

const Header: React.FC<ContentViewerProps> = ({children, title}) => {
  const route = useRoute();
  const {user} = useAuth();
  const isFullNav = route.name === 'Home' || route.name === 'Contacts';
  const {navigation} = useNavigation();

  const handlePressLeft = async () => {
    if (isFullNav) {
      navigation.navigate('Search');
    } else if (route.name === 'Contacts') {
      try {
        console.log('Added Contact... Clicked (ContentViewer.tsx)');
      } catch (error) {
        console.error(
          'Got error while Added Contact (ContentViewer.tsx)',
          error,
        );
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.Maincontainer}>
      <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            style={{
              flex: 1,
              width: '100%',
            }}
            colors={['#010102', '#192f6a', '#3b5998']}>
      <ImageBackground
        source={require('../assets/imgs/launch_screen.png')}
        style={styles.bgImage}></ImageBackground>
      <View style={styles.Maincontainer}>
        <View style={styles.header}>
          <View style={styles.childView}>
            <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={handlePressLeft}>
              <Image
                source={
                  !isFullNav
                    ? require('../assets/icons/back.png')
                    : require('../assets/icons/search.png')
                }
                style={{
                  ...styles.iconText,
                  width: !isFullNav ? 30 : 20,
                  height: !isFullNav ? 30 : 20,
                }}
              />
              </TouchableOpacity>
          </View>
          <View style={styles.tabTitle}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={{...styles.childView, alignItems: 'flex-end'}}>
            {isFullNav && (
              <TouchableOpacity
              activeOpacity={0.8}
              onPress={
                route.name !== 'Contacts'
                    ? () => navigation.navigate('Profile')
                    : () => navigation.navigate('Search')
                }>
                <Image
                  source={
                    route.name !== 'Contacts'
                    ? user?.photoURL
                        ? {uri: user.photoURL}
                        : require('../assets/imgs/profile_placeholder_image.png')
                      : require('../assets/icons/add_user.png')
                  }
                  style={styles.profileImage}
                  />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
</LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
  },
  content: {
    flex: 9,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  header: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    paddingHorizontal: 16,
  },
  iconContainer: {
    padding: 8,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
  },
  iconText: {
    fontWeight: '400',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  childView: {
    width: '20%',
  },
  tabTitle: {
    width: '60%',
  },
});

export default Header;
