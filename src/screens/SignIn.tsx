import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconButton from '../components/IconButton';
import RulerText from '../components/RulerText';
import InputField from '../components/InputField';
import {ScrollView} from 'react-native-gesture-handler';
import useAuth from '../hooks/useAuth';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import ActionButton from '../components/ActionButton';

type SignInProps = {
  navigation: NativeStackNavigationProp<any>;
};

const initialState = {
  email: '',
  password: '',
};

const SignIn: React.FC<SignInProps> = ({navigation}) => {
  const [signInData, setSignInData] = useState(initialState);
  const {handleLogin, loading, error, observeAuth} = useAuth();

  useEffect(() => {
    const unsubscribe = observeAuth();
    return unsubscribe;
  }, [observeAuth]);

  const handleInputChange = (field: string, value: string) => {
    setSignInData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await handleLogin(
        signInData.email,
        signInData.password,
      );
      if (userCredential) {
        Alert.alert('Success', 'You are successfully logged in!');
        setSignInData(initialState);
        navigation.navigate('MainTabs');
      }
    } catch {
      Alert.alert('Error', error || 'An unknown error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
      style={{flex: 1, flexDirection: 'column', padding: 20}}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View
          style={{
            flex: 3,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'blue',
              fontSize: 18,
              fontWeight: '700',
              textAlign: 'center',
            }}>
            Log in to Chatbox
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontWeight: '300',
              width: 293,
              textAlign: 'center',
            }}>
            Welcome back! Sign in using your social account or email to continue
            with us
          </Text>
        </View>

        <View style={{flex: 6}}>
          <IconButton
            src={require('../assets/icons/google_icon.png')}
            onPress={() => console.log("'Google Icon' on Sign Clicked")}
          />
          <View style={styles.gapVertical}>
            <RulerText lineColor="#797C7B">OR</RulerText>
          </View>

          <View style={{gap: 25}}>
            <InputField
              val={signInData.email}
              setVal={value => handleInputChange('email', value)}
              title="Enter Email"
              type="email-address"
              placeholder="i.e. Jhon@gmail.com"
            />

            <InputField
              val={signInData.password}
              setVal={value => handleInputChange('password', value)}
              title="Password"
              type="default"
              secureTextEntry={true}
              placeholder="Enter your password"
            />
          </View>
        </View>

        <View style={{flex: 2}}>
          <ActionButton
            onClick={handleSignIn}
            loader={loading}
            onLoadText="Signing in...">
            Sign in with email
          </ActionButton>

          <TouchableOpacity
            onPress={() => console.log('Forget Password, clicked')}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                marginTop: 15,
              }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  ghostIcon: {
    paddingVertical: 5,
    width: 40,
    height: 40,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  gapVertical: {marginTop: 10},
});
