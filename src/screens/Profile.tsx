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
import {
  logoutUser,
  updateUserProfile,
  uploadProfileImage,
} from '../services/auth';
import appAuth from '../hooks/useAuth';
import {launchImageLibrary} from 'react-native-image-picker';
import ContentViewer from '../components/ContentViewer';
import {AppDispatch, RootState} from '../store/store';
import {ScrollView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {removeUserFromStorage} from '../services/authHelpers';
import {clearUser} from '../store/slices/userSlice';

const initialState = {
  name: '',
  email: '',
  status: '',
  imageUri: null as string | null,
};

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [userData, setUserData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('User (Profile) => ', user);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || '',
        email: user.email || '',
        status: user.status || '',
        imageUri: user.photoURL || null,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | null) => {
    setUserData(prevState => ({...prevState, [field]: value}));
  };

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          Alert.alert(
            'Image Picker Error',
            response.errorMessage || 'Unknown error',
          );
        } else {
          const source = response?.assets ? response.assets[0].uri : undefined;
          setUserData(prevState => ({...prevState, imageUri: source || null}));
        }
      },
    );
  };

  const handleUploadImage = async () => {
    if (!userData.imageUri) {
      Alert.alert('Error', 'No image selected');
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrl = await uploadProfileImage(userData.imageUri);

      if (user) {
        const updatedUser = {
          ...user,
          photoURL: uploadedImageUrl,
        };

        console.log('User:', updatedUser);
      }

      Alert.alert('Success', 'Profile image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
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
        name: userData.name,
        email: userData.email,
      });

      if (user) {
        const updatedUser = {
          ...user,
          displayName: userData.name || null,
          email: userData.email || null,
          photoURL: userData.imageUri || null,
          status: userData.status || null,
        };
      }

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
      dispatch(clearUser());
    } catch (error) {
      console.error('Failed to log out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <ContentViewer title="Profile">
      <ScrollView style={{flex: 1, paddingHorizontal: 12}}>
        <TouchableOpacity onPress={handlePickImage} style={styles.header}>
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
            loader={loading}
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
