import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import InputField from '../../components/InputField';
import ActionButton from '../../components/actionButton/ActionButton';
import ContentViewer from '../../components/ContentViewer';
import {ScrollView} from 'react-native-gesture-handler';
import useProfile from './useProfile';
import Images from '../../constants/imgs';
import {profileStyles} from '../../styles/profile';
import { COLOR } from '../../constants/colors';

const Profile: React.FC = () => {
  const {
    handlePickAndUploadImage,
    userData,
    handleInputChange,
    error,
    handleLogout,
    handleUpdateProfile,
    updateLoader,
    logoutLoader,
  } = useProfile();

  return (
    <>
      <ContentViewer title="Profile">
        <ScrollView style={{flex: 1, paddingHorizontal: 12}}>
          <TouchableOpacity
            onPress={handlePickAndUploadImage}
            activeOpacity={0.8}
            style={profileStyles.header}>
            {
              <Image
                style={profileStyles.profileImage}
                source={
                  userData.imageUri
                    ? {uri: userData.imageUri}
                    : Images.PlaceholderImg
                }
              />
            }

            <View style={profileStyles.editButton}>
              <Image
                source={Images?.EditIcon}
                style={{width: 10, height: 10}}
              />
            </View>
          </TouchableOpacity>

          <KeyboardAvoidingView style={{flex: 6, gap: 40, padding: 20}}>
            <InputField
              title="Name"
              placeholder="Enter your name"
              type="default"
              val={userData.name}
              setVal={value => handleInputChange('name', value)}
            />
            <InputField
              title="Email"
              placeholder="Enter your email"
              type="email-address"
              val={userData.email}
              setVal={value => handleInputChange('email', value)}
            />
            <InputField
              title="Your Status"
              placeholder="Enter your status"
              type="default"
              val={userData.status}
              setVal={value => handleInputChange('status', value)}
            />
            {error && <Text style={profileStyles.error}>{error}</Text>}
          </KeyboardAvoidingView>

          <View style={{flex: 2, rowGap: 10}}>
            <ActionButton
              onClick={handleUpdateProfile}
              color="#3D4A7A"
              loader={updateLoader}
              onLoadText="Updating...">
              Update Profile
            </ActionButton>

            <ActionButton
              onClick={handleLogout}
              color={COLOR.red}
              loader={logoutLoader}
              onLoadText="Logging out...">
              Logout
            </ActionButton>
          </View>
        </ScrollView>
      </ContentViewer>
    </>
  );
};

export default Profile;
