import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase';

function CustomCheckBox({ value, onValueChange }) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={{
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: value ? '#4caf50' : 'white',
        marginRight: 8,
      }}
    />
  );
}

export default function SignUpEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwCondition, setPwCondition] = useState(false);
  const [pwSame, setPwSame] = useState(false);
  const isCompleted = pwCondition && pwSame && email.length > 0;
  const [showTerms, setShowTerms] = useState(false);
  const [agreedCheck, setAgreedCheck] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    setPwCondition(regex.test(pw));
    setPwSame(pw === pwConfirm && pw.length > 0);
  }, [pw, pwConfirm]);

  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pw);
      await sendEmailVerification(userCredential.user);
      setSuccess('회원가입 성공! 이메일 인증을 완료해주세요.');
      navigation.navigate('EmailVerify', { expected: email });
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (e.code === 'auth/weak-password') {
        setError('비밀번호는 6자 이상이어야 합니다.');
      } else if (e.code === 'auth/missing-email') {
        setError('이메일을 입력해주세요.');
      } else if (e.code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else {
        setError(e.message);
      }
    }
  };

  const handleEmailVerifyPress = () => {
    setAgreedCheck(false);
    setShowTerms(true);
  };

  const handleAgree = () => {
    setShowTerms(false);
    handleSignUp();
  };

  return (
    <View style={{ padding: 40, flex: 1, backgroundColor: 'white' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 60 }}>회원가입</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>이메일을 입력해주세요.</Text>
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 40, borderWidth: 1, padding: 10, borderRadius: 5 }}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>비밀번호를 입력해주세요.</Text>
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        autoCapitalize="none"
        style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
      />
      <TextInput
        placeholder="비밀번호 재확인"
        secureTextEntry
        value={pwConfirm}
        onChangeText={setPwConfirm}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 10 }}
      />

      <Text style={{ color: pwCondition ? 'green' : 'gray', marginBottom: 5 }}>
        {pwCondition ? '✅' : '❌'} 대문자, 소문자, 숫자, 특수기호 포함 8자 이상
      </Text>
      <Text style={{ color: pwSame ? 'green' : 'gray', marginBottom: 80 }}>
        {pwSame ? '✅' : '❌'} 비밀번호 일치
      </Text>

      <Button
        title="이메일 인증"
        onPress={handleEmailVerifyPress}
        disabled={!isCompleted}
        color={!isCompleted ? 'gray' : undefined}
      />
      <View style={{ height: 10 }} />
      <Button title="로그인 하러가기" onPress={() => navigation.navigate('Login')} />
      {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
      {success ? <Text style={{ color: 'green', marginTop: 10 }}>{success}</Text> : null}

      <Modal
        visible={showTerms}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 20 }}>
              서비스 이용에 필요한{'\n'}약관에 동의해주세요.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <CustomCheckBox value={agreedCheck} onValueChange={setAgreedCheck} />
              <Text>[필수] 동의</Text>
            </View>

            <Button
              title="동의 후 인증메일 받기"
              onPress={handleAgree}
              disabled={!agreedCheck}
              color={!agreedCheck ? 'gray' : undefined}
            />
            <View style={{ height: 10 }} />
            <Button title="취소" onPress={() => setShowTerms(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
