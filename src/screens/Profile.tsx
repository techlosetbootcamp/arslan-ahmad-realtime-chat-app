import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import {updateUserProfile} from '../services/auth';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import ContentViewer from '../components/ContentViewer';
import {AppDispatch, RootState} from '../store/store';
import {ScrollView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {removeUserFromStorage} from '../services/authHelpers';
import {clearUser, setLoading} from '../store/slices/userSlice';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const initialState = {
  name: '',
  email: '',
  status: '',
  imageUri: '',
};

const Profile: React.FC = () => {
  const {isLoading, ...user} = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [userData, setUserData] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || '',
        email: user.email || '',
        status: user.status || '',
        imageUri: user.photoURL || '',
      });
    }
  }, [user]);

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
        Alert.alert(
          'Image Picker Error',
          response.errorMessage || 'Unknown error',
        );
        setLoading(false);
        return;
      }

      const imageBase64 = response.assets?.[0].base64;
      if (!imageBase64) {
        Alert.alert('Error', 'Failed to get image data');
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

      Alert.alert('Success', 'Profile image updated successfully');
    } catch (error) {
      console.error('Error handling image:', error);
      Alert.alert('Error', 'Failed to upload image');
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

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      await removeUserFromStorage();
      await GoogleSignin.signOut();
      dispatch(clearUser());
    } catch (error) {
      console.error('Failed to log out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <ContentViewer title="Profile">
      <ScrollView style={{flex: 1, paddingHorizontal: 12}}>
        <TouchableOpacity
          onPress={handlePickAndUploadImage}
          style={styles.header}>
          <Image
            source={
              userData.imageUri
                ? {uri: userData.imageUri}
                : require('../assets/imgs/profile_placeholder_image.png')
            }
            style={styles.profileImage}
          />
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
            onClick={() => handleLogout()}
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
});

export default Profile;
