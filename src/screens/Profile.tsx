import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {setUser} from '../store/slices/userSlice';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import {logoutUser, updateUserProfile, uploadProfileImage} from '../services/auth';
import useAuth from '../hooks/useAuth';
import {launchImageLibrary} from 'react-native-image-picker';
import ContentViewer from '../components/ContentViewer';

const Profile: React.FC = () => {
  const {user, handleLogout} = useAuth();
  const dispatch = useDispatch();

  console.log('User => ', user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  console.log('User:', user);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setImageUri(user.photoURL || undefined);
    }
  }, [user]);
  
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
          setImageUri(source);
        }
      },
    );
  };

  const handleUploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected');
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrl = await uploadProfileImage(imageUri);

      if (user) {
        const updatedUser = {
          uid: user.uid,
          displayName: user.displayName || null,
          email: user.email || null,
          photoURL: uploadedImageUrl || null,  // Use photoURL here
        };

        // dispatch(setUser(updatedUser));
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
      await updateUserProfile({name, email});

      if (user) {
        const updatedUser = {
          uid: user.uid,
          displayName: name || null,
          email: email || null,
          photoURL: user.photoURL || null,
        };

        console.log('User (inProfile):', updatedUser);
        // dispatch(setUser(updatedUser));
      }

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentViewer title="Profile">
    <View style={{flex: 1, paddingHorizontal: 12}}>
      <TouchableOpacity onPress={handlePickImage} style={styles.header}>
        <Image
          source={
            imageUri
              ? {uri: imageUri}
              : require('../assets/imgs/profile_placeholder_image.png')
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <View style={{flex: 6, gap: 40, padding: 20}}>
        <InputField
          title="Name"
          placeholder="Enter your name"
          type="default"
          val={name}
          setVal={setName}
        />
        <InputField
          title="Email"
          placeholder="Enter your email"
          type="email-address"
          val={email}
          setVal={setEmail}
        />
        <InputField
          title="Your Status"
          placeholder="Enter your status"
          type="default"
          val={status}
          setVal={setStatus}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={{flex: 2, rowGap: 10}}>
        <ActionButton
          onClick={handleUpdateProfile}
          loader={loading}
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
    </View>
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
