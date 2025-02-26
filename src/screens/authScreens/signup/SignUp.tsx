import React from 'react';
import {StyleSheet, View} from 'react-native';
import InputField from '../../../components/InputField';
import {ScrollView} from 'react-native-gesture-handler';
import ActionButton from '../../../components/actionButton/ActionButton';
import AuthHeaderSection from '../../../components/AuthSectionHeader';
import useSignup from './useSignup';

const SignIn: React.FC = () => {
  const {userData, handleInputChange, SignUphandler, loading, error, setError} =
    useSignup();

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={true} style={styles.container}>
        <AuthHeaderSection
          title="Sign up with Email"
          subText="Get chatting with friends and family today by signing up for our chat
        app!"
          styleSubTitle={{width: '80%'}}
        />

        <View style={styles.fieldsContainer}>
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

        <View style={styles.bottomText}>
          <ActionButton
            onClick={SignUphandler}
            loader={loading}
            error={error}
            onLoadText="Adding yourself...">
            Create an Account
          </ActionButton>
        </View>
      </ScrollView>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 60,
    columnGap: 40,
  },
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
  fieldsContainer: {flex: 6, paddingHorizontal: 10, paddingVertical: 10},
  bottomText: {flex: 2, marginTop: 20, paddingVertical: 10},
  gapVertical: {marginTop: 10},
});
