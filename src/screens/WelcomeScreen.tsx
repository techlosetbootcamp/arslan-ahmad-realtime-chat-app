import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import RulerText from '../components/RulerText';
import IconButton from '../components/IconButton';
import ActionButton from '../components/ActionButton';
import {color} from '../constants/colors';
import {signInWithGoogle} from '../services/auth';
import useNavigate from '../hooks/useNavigation';
import useAuth from '../hooks/useAuth';

const Welcome = () => {
  const {navigation} = useNavigate();
  return (
    <View style={styles.container}>
      <Text style={styles.link}>Connect friends easily & quickly</Text>
      <Text style={styles.description}>
        Our chat app is the perfect way to stay connected with friends and
        family.
      </Text>

      <IconButton
        src={require('../assets/icons/google_icon.png')}
        onPress={signInWithGoogle}
      />

      {/* <RulerText textColor="white">OR</RulerText> */}

      <ActionButton
        onClick={() => navigation.navigate('SignUp')}
        loader={false}
        color="rgba(255, 255, 255, 0.30)"
        onLoadText="Signing up...">
        Sign up with mail
      </ActionButton>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('SignIn')}>
        <Text
          style={{
            ...styles.description,
            fontSize: 14,
            color: 'white',
            textAlign: 'center',
            marginTop: 20,
          }}>
          Existing account?{' '}
          <Text style={{color: 'white', fontWeight: 'bold', marginTop: 9}}>
            Log in
          </Text>{' '}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#050821',
    flex: 1,
    padding: 20,
  },
  link: {
    marginTop: 45,
    fontSize: 68,
    lineHeight: 80,
    fontWeight: 400,
    color: 'white',
    paddingVertical: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 400,
    color: color.light_grey,
    paddingVertical: 15,
  },
  ghostButton_text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  ghostIcon: {
    paddingVertical: 5,
    width: 40,
    height: 40,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.ghost,
    alignSelf: 'center',
  },
});
export default Welcome;
