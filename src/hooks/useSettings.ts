import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '../types/navigation';

const useSettings = () => {
  const user = useSelector((state: RootState) => state.user);

  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  return {
    user,
    navigation,
  };
};

export default useSettings;

const styles = StyleSheet.create({});
