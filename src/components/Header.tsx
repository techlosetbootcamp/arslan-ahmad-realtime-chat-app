import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  title?: string;
  children: React.ReactNode; // Allow React components as children
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require('../assets/imgs/search.png')}
            style={styles.iconText}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/imgs/profile_placeholder_image.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
    </SafeAreaView>
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
