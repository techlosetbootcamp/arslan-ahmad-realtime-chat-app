// Header.tsx

import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

const Header: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={handlePressLeft}>
        <Image
          source={
            isChatScreen
              ? require('../assets/imgs/back.png')
              : require('../assets/imgs/search.png')
          }
          style={styles.iconText}
        />
      </TouchableOpacity>

      {/* Title in the center */}
      {!isChatScreen && <Text style={styles.title}>{route.name}</Text>}

      {/* Right button - Profile image */}
      {!isChatScreen && (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/imgs/profile_placeholder_image.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#ccc',
    borderRadius: '50%',
  },
  iconText: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
});

export default Header;
