import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { auth } from '../../firebase';

export default function EmailVerifyScreen({ route, navigation }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { expected } = route.params;

  const checkVerification = async () => {
    setLoading(true);
    setStatus('');

    try {
      await auth.currentUser.reload();
      const currentUser = auth.currentUser;
``
      if (!currentUser) {
        setStatus('❌ 로그인된 사용자가 없습니다.');
      } else if (currentUser.email !== expected) {
        setStatus('❌ 인증된 이메일이 다릅니다.\n현재: ${currentUser.email}\n기대: ${expected}');
      } else if (!currentUser.emailVerified) {
        setStatus('❌ 아직 이메일 인증이 완료되지 않았습니다.');
      } else {
        setStatus('✅ 이메일 인증이 완료되었습니다!');
        setTimeout(() => {
          navigation.replace('Main');
        }, 1500);
      }
    } catch (e) {
      setStatus(e.message);
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 40, flex: 1, backgroundColor: 'white' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 30, marginBottom: 20 }}>
        이메일에서 링크를 클릭하여{'\n'}인증을 완료해주세요.
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 80, borderWidth: 1, padding: 10, borderRadius: 5 }}>
        {expected}
      </Text>
      <Button title="인증 완료" onPress={checkVerification} disabled={loading} />
      {status !== '' && (
        <Text style={{ marginTop: 20, lineHeight: 22 }}>{status}</Text>
      )}
    </View>
  );
}
