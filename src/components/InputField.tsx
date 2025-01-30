import React, {useState, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';
import {InputFieldProps} from '../types/inputField';
import {color} from '../constants/colors';

function InputField({
  placeholder,
  type = 'default',
  title,
  secureTextEntry = false,
  setVal,
  val,
  setError,
}: InputFieldProps) {
  const [isError, setIsError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasNumber = /[0-9]/;
    const hasAlphabet = /[a-zA-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/;

    return {
      hasNumber: hasNumber.test(password),
      hasAlphabet: hasAlphabet.test(password),
      hasSpecialChar: hasSpecialChar.test(password),
    };
  };

  const handleChange = (text: string) => {
    setVal(text);
    setTouched(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      validateField(text);
    }, 500);
    setTypingTimeout(newTimeout);
  };

  const validateField = (text: string) => {
    let error = '';
    if (text.length === 0 && touched) {
      let text = title;
      if (title.split(' ')[0] === 'Enter') {
        text = title.split(' ')[1];
      }
      error = `${text} is important.`;
    } else if (type === 'email-address') {
      if (!validateEmail(text)) {
        error = 'Please enter a valid email address.';
      }
    } else {
      if (title.toLowerCase().includes('password')) {
        const {hasNumber, hasAlphabet, hasSpecialChar} = validatePassword(text);

        if (!hasNumber) {
          error = 'Your password must contain at least one number.';
        } else if (!hasAlphabet) {
          error = 'Your password must contain at least one letter.';
        } else if (!hasSpecialChar) {
          error = 'Your password must contain at least one special character.';
        }
      }
    }
    setIsError(error);
    if (setError) {
      setError(error);
    }
  };

  return (
    <View>
      <Text
        style={{
          color: isError ? color.red : color.primary,
          fontWeight: '500',
          fontSize: 16,
        }}>
        {title}
      </Text>
      <TextInput
        style={{
          height: 38,
          borderBottomWidth: 1,
          borderBottomColor: isError ? color.light_red : color.light_grey,
          paddingInlineStart: 0,
          color: '#3D4A7A',
        }}
        placeholder={placeholder || ''}
        placeholderTextColor="#CDD1D0"
        value={val}
        secureTextEntry={secureTextEntry}
        onChangeText={text => handleChange(text)}
        keyboardType={type}
        autoCapitalize="none"
      />
      {isError && (
        <Text
          style={{
            color: 'red',
            fontSize: 12,
            fontWeight: '300',
            marginTop: 2,
            textAlign: 'right',
          }}>
          {isError}
        </Text>
      )}
    </View>
  );
}

export default InputField;
