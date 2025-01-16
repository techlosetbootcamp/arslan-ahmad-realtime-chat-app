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
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

const Header: React.FC<ContentViewerProps> = ({children, title}) => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const handlePressLeft = () => {
    if (route.name === 'Chat') {
      navigation.goBack();
    } else {
      navigation.navigate('Search');
    }
  };

  const isChatScreen = route.name === 'Chat';

  return (
    <SafeAreaView style={styles.Maincontainer}>
      <ImageBackground
        source={require('../assets/imgs/launch_screen.png')}
        style={styles.bgImage}></ImageBackground>
      <View style={styles.Maincontainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handlePressLeft}>
            <Image
              source={
                isChatScreen
                  ? require('../assets/icons/back.png')
                  : require('../assets/icons/search.png')
              }
              style={styles.iconText}
            />
          </TouchableOpacity>
          {!isChatScreen && <Text style={styles.title}>{title}</Text>}
          {!isChatScreen && (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={require('../assets/imgs/profile_placeholder_image.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.content}>{children}</View>
      </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
  },
  iconText: {
    width: 20,
    height: 20,
    fontWeight: '400',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
});

export default Header;
