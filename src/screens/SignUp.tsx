import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconButton from '../components/IconButton';
import RulerText from '../components/RulerText';
import InputField from '../components/InputField';
import {ScrollView} from 'react-native-gesture-handler';
import useAuth from '../hooks/useAuth';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import ActionButton from '../components/ActionButton';
import AuthHeaderSection from '../components/AuthHeaderSection';
import ActionText from '../components/ActionText';
import {GoogleIcon} from '../constants/imgs';
import {color} from '../constants/colors';
import SimpleText from '../components/SimpleText';
import {showToast} from '../components/Toast';
import Loader from '../components/Loader';

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
  const [error, setError] = useState<string>('');
  const {handleSignUp, loading, observeAuth} = useAuth();

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
      if (!userData.email || !userData.password || !userData.name) {
        return showToast('Error', 'Please fill in all fields', 'error');
      }
      const userCredential = await handleSignUp(
        userData.email,
        userData.password,
        userData.name,
      );
      if (userCredential) {
        showToast('Success', 'You are successfully logged in!', 'success');
        setUserData(initialState);
        navigation.navigate('MainTabs');
      }
    } catch {
      showToast('Error', error || 'An unknown error occurred', 'error');
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingHorizontal: 20,
          paddingVertical: 60,
          columnGap: 40,
        }}>
        <AuthHeaderSection
          title="Sign up with Email"
          subText="Get chatting with friends and family today by signing up for our chat
        app!"
          styleSubTitle={{width: '80%'}}
        />

        <View style={{flex: 6, paddingHorizontal: 10, paddingVertical: 10}}>
          <IconButton
            src={GoogleIcon}
            onPress={() => console.log("'Google Icon' on Sign Clicked")}
          />
          <View style={styles.gapVertical}>
            <RulerText lineColor={color.dark_gray} />
          </View>

          <View style={{gap: 25}}>
            <InputField
              val={userData.name}
              setVal={value => handleInputChange('name', value)}
              title="Enter Name"
              type="default"
              placeholder="Jhon Doe"
              setError={setError}
            />
            <InputField
              val={userData.email}
              setVal={value => handleInputChange('email', value)}
              title="Enter Email"
              type="email-address"
              placeholder="i.e. Jhon@gmail.com"
              setError={setError}
            />

            <InputField
              val={userData.password}
              setVal={value => handleInputChange('password', value)}
              placeholder="Enter your password"
              title="Password"
              type="default"
              secureTextEntry={true}
              setError={setError}
            />

            <InputField
              val={userData.confirmPassword}
              setVal={value => handleInputChange('confirmPassword', value)}
              title="Confirm Password"
              type="default"
              secureTextEntry={true}
              placeholder="Enter confirm password"
              setError={setError}
            />
          </View>
        </View>

        <View style={{flex: 2, marginTop: 20, paddingVertical: 10}}>
          <ActionButton
            onClick={SignUphandler}
            loader={loading}
            error={error}
            onLoadText="Adding yourself...">
            Reginster Me
          </ActionButton>
        </View>
      </ScrollView>
    </>
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
