import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {setUser} from '../store/slices/userSlice';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import { updateUserProfile, uploadProfileImage } from '../services/authService';
import useAuth from '../hook/useAuth';
import { launchImageLibrary } from 'react-native-image-picker';

interface ProfileProps {
  navigation: any;
}

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const {user} = useAuth();
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1, // High quality image
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          Alert.alert('Image Picker Error', response.errorMessage);
        } else {
          const source = response?.assets ?  response?.assets[0].uri : undefined;
          setImageUri(source); // Store image URI
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
      await updateUserProfile({photoURL: uploadedImageUrl});

      dispatch(setUser({...user, photoURL: uploadedImageUrl}));
      Alert.alert('Success', 'Profile image uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 12}}>
      <View
        style={{
          flex: 2,
          backgroundColor: 'pink',
          alignItems: 'center',
          justifyContent: 'center',
        }}></View>
        <View style={{alignItems: 'center'}}>
          <Image
            source={user?.photoURL ? {uri: user.photoURL} : require('../assets/imgs/profile_placeholder_image.png')}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
          <ActionButton
          onClick={handleUploadImage}
          loader={loading}
          color="#3D4A7A"
          onLoadText="Uploading...">
          Upload Profile Image
        </ActionButton>
        </View>
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
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={{flex: 2}}>
        <ActionButton
          onClick={() => console.log('Update profile')}
          loader={loading}
          color="#3D4A7A"
          onLoadText="Updating...">
          Update Profile
        </ActionButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D4A7A',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});

export default Profile;
