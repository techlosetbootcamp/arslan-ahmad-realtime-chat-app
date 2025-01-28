import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import {logoutUser} from '../services/auth';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import ContentViewer from '../components/ContentViewer';
import {useAppDispatch, useAppSelector} from '../store/store';
import {ScrollView} from 'react-native-gesture-handler';
import {clearUser, setLoading, setUser} from '../store/slices/user';
import {EditIcon} from '../constants/imgs';
import {color} from '../constants/colors';
import Loader from '../components/LoaderScreen';
import {updateUserProfile} from '../services/user';
import {showToast} from '../components/Toast';

const Profile: React.FC = () => {
  const {isLoading, ...user} = useAppSelector(state => state.user);
  const [userData, setUserData] = useState({
    name: user.displayName || '',
    email: user.email || '',
    status: user.status || '',
    imageUri: user.photoURL || '',
  });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (user) {
  //     setUserData({
  //       name: user.displayName || '',
  //       email: user.email || '',
  //       status: user.status || '',
  //       imageUri: user.photoURL || '',
  //     });
  //   }

  // }, [user]);

  const handleInputChange = (field: string, value: string | null) => {
    setUserData(prevState => ({...prevState, [field]: value}));
  };

  const handlePickAndUploadImage = async () => {
    setLoading(true);
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (response.didCancel) {
        console.error('User canceled image picker');
        setLoading(false);
        return;
      }

      if (response.errorCode) {
        showToast(
          'Image Picker Error',
          response.errorMessage || 'Unknown error',
          'error',
        );
        setLoading(false);
        return;
      }

      const imageBase64 = response.assets?.[0].base64;
      if (!imageBase64) {
        showToast('Error', 'Failed to get image data', 'error');
        setLoading(false);
        return;
      }

      const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

      const userId = user?.uid;
      if (!userId) {
        throw new Error('User ID is not available');
      }

      await firestore().collection('users').doc(userId).set(
        {
          photoURL: imageDataUri,
        },
        {merge: true},
      );

      if (user) {
        const updatedUser = {
          ...user,
          photoURL: imageDataUri,
        };

        console.log('Updated User =>', updatedUser);
        setUserData(prevState => ({
          ...prevState,
          imageUri: imageDataUri,
        }));
      }

      if (user?.uid) {
        dispatch(setUser({...user, photoURL: imageDataUri, uid: user.uid}));
      }
    } catch (error) {
      console.error('Error handling image:', error);
      showToast('Error', 'Failed to upload image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateUserProfile({
        name: userData.name || '',
        email: userData.email || '',
      });

      const userId = user?.uid;
      if (userId) {
        await firestore()
          .collection('users')
          .doc(userId)
          .update({
            displayName: userData.name || '',
            email: userData.email || '',
            status: userData.status || '',
          });
      }

      setUserData(prevState => ({
        ...prevState,
        name: userData.name || '',
        email: userData.email || '',
        status: userData.status || '',
      }));
    } catch (error) {
      console.error('Failed to update profile (Profile.tsx):', error);
      showToast(
        'Failed to update profile',
        'There are some issue, that your profile is not updated. Please try again later.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      dispatch(clearUser());
    } catch (error) {
      console.error('Failed to logout:', error);
      showToast('Error', 'Failed to logout', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentViewer title="Profile">
      <ScrollView style={{flex: 1, paddingHorizontal: 12}}>
        <TouchableOpacity
          onPress={handlePickAndUploadImage}
          activeOpacity={0.8}
          style={styles.header}>
          {isLoading ? (
            <Loader />
          ) : (
            <Image
              style={styles.profileImage}
              source={
                userData.imageUri
                  ? {uri: userData.imageUri}
                  : require('../assets/imgs/profile_placeholder_image.png')
              }
            />
          )}

          <View style={styles.editButton}>
            <Image source={EditIcon} style={{width: 10, height: 10}} />
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
          {error && <Text style={styles.error}>{error}</Text>}
        </KeyboardAvoidingView>

        <View style={{flex: 2, rowGap: 10}}>
          <ActionButton
            onClick={handleUpdateProfile}
            loader={isLoading}
            color="#3D4A7A"
            onLoadText="Updating...">
            Update Profile
          </ActionButton>

          <ActionButton
            onClick={handleLogout}
            color="tomato"
            onLoadText="Logging out...">
            Logout
          </ActionButton>
        </View>
      </ScrollView>
    </ContentViewer>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '40%',
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#3D4A7A',
  },
  emailText: {
    fontSize: 16,
    color: '#3D4A7A',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 15,
    width: 15,
    height: 15,
    borderRadius: 10,
    padding: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.black,
  },
});

export default Profile;
