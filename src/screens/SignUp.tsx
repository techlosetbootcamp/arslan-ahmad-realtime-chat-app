import React, {useEffect, useState} from 'react';
import {
  Alert,
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignIn: React.FC<SignInProps> = ({navigation}) => {
  const [userData, setUserData] = useState(initialState);
  const {handleSignUp, loading, error, observeAuth} = useAuth();

  useEffect(() => {
    const unsubscribe = observeAuth();
    return unsubscribe;
  }, [observeAuth]);

  const handleInputChange = (field: string, value: string) => {
    setUserData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const SignUphandler = async () => {
    try {
      const userCredential = await handleSignUp(userData.email, userData.password, userData.name);
      if (userCredential) {
        Alert.alert('Success', 'You are successfully logged in!');
        setUserData(initialState);
        navigation.navigate('Home');
      }
    } catch {
      Alert.alert('Error', error || 'An unknown error occurred');
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      style={{
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 60,
        columnGap: 40,
      }}>
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
          Sign up with Email
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            fontWeight: '300',
            width: 293,
            textAlign: 'center',
          }}>
          Get chatting with friends and family today by signing up for our chat
          app!
        </Text>
      </View>

      <View style={{flex: 6, padding: 10}}>
        <IconButton
          src={require('../assets/icons/google_icon.png')}
          onPress={() => console.log("'Google Icon' on Sign Clicked")}
        />
        <View style={styles.gapVertical}>
          <RulerText lineColor="#797C7B">OR</RulerText>
        </View>

        <View style={{gap: 25}}>
          <InputField
            val={userData.name}
            setVal={(value) => handleInputChange('name', value)}
            title="Enter Name"
            type="default"
            placeholder="Jhon Doe"
          />
          <InputField
            val={userData.email}
            setVal={(value) => handleInputChange('email', value)}
            title="Enter Email"
            type="email-address"
            placeholder="i.e. Jhon@gmail.com"
          />

          <InputField
            val={userData.password}
            setVal={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            title="Password"
            type="default"
            secureTextEntry={true}
          />

          <InputField
             val={userData.confirmPassword}
             setVal={(value) => handleInputChange('confirmPassword', value)}
            title="Confirm Password"
            type="default"
            secureTextEntry={true}
            placeholder="Enter confirm password"
          />
        </View>
      </View>

      <View style={{flex: 2, marginTop: 20}}>
        <ActionButton
          onClick={SignUphandler}
          loader={loading}
          onLoadText="Adding yourself...">
          Reginster Me
        </ActionButton>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              marginTop: 15,
            }}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
