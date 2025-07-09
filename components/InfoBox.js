import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const GradientButton = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.buttonWrapper}>
    <LinearGradient
      colors={['#fbe4c2', '#ffffff', '#fbe4c2']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.buttonGradient}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const InfoBox = ({ visible, onClose, item, onLike, onDislike,mode }) => {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.boxContainer}>
              <View style={styles.iconBar}>
                <TouchableOpacity onPress={onClose} style={styles.iconLeft}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                  <Text style={styles.iconText}>HOME</Text>
                </TouchableOpacity>
                <Ionicons name="calendar-outline" size={22} color="#fff" />
              </View>

              <View style={[styles.header, {backgroundColor: mode === 'fast' ? '#E90C05' : '#00CA80'}]}>
                <Text style={styles.headerText}>★ {item.name} ★</Text>
              </View>

              <View style={styles.contentBox}>
                <View style={styles.imageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>사진</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.brandText}>
                  {item.brand ? `${item.brand}에서 먹을 수 있어요!` : '알 수 없는 브랜드'}
                </Text>

                <GradientButton text="다시 먹고 싶어요" onPress={onLike} />
                <GradientButton text="별로였어요" onPress={onDislike} />
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InfoBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    width: '85%',
    backgroundColor: 'transparent',
    maxHeight: height * 0.85,
  },
  iconBar: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 13,
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  contentBox: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  imageContainer: {
    width: 220,
    height: 180,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  placeholderText: {
    fontSize: 20,
    color: '#333',
  },
  brandText: {
    color: '#a38888',
    fontSize: 14,
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '90%',
    borderRadius: 30,
    marginVertical: 6,
    shadowColor: '#A94946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#6b1e1e',
    fontWeight: '600',
    fontSize: 16,
  },
});
