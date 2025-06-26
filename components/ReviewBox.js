import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import keywordMap from '../data/keywordMap.json';

const tagsReason = ['스트레스가 풀려요', '단짠단짠', '달달해요', '매콤해요', '가성비갑'];
const tagsSituation = ['혼밥', '친구랑', '회식', '야식'];

const ReviewBox = ({ visible, onClose, item }) => {
  const [tagsReason, setTagsReason] = useState([]);
  const [tagsSituation, setTagsSituation] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!item?.name) return;
    const tagData = keywordMap[item.name];
    if (tagData) {
      setTagsReason(tagData.reason || []);
      setTagsSituation(tagData.situation || []);
    } else {
      setTagsReason(['맛있어요']);
      setTagsSituation(['혼밥']);
    }
  }, [item]);

  const toggleTag = (tag, selectedList, setSelectedList) => {
    if (selectedList.includes(tag)) {
      setSelectedList(selectedList.filter(t => t !== tag));
    } else {
      setSelectedList([...selectedList, tag]);
    }
  };

  const handleSubmit = () => {
    console.log('이유:', selectedReasons);
    console.log('상황:', selectedSituations);
    console.log('한줄평:', comment);
    alert('후기가 등록되었습니다!');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType='none'
      transparent
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.foodName}>{item.name}</Text>

              <Text style={styles.subtitle}>왜 이 음식이 좋았나요?</Text>
              <View style={styles.tagContainer}>
                {tagsReason.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedReasons.includes(tag) && styles.tagSelected,
                    ]}
                    onPress={() => toggleTag(tag, selectedReasons, setSelectedReasons)}
                  >
                    <Text>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.subtitle}>어떤 상황에서 먹었나요?</Text>
              <View style={styles.tagContainer}>
                {tagsSituation.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedSituations.includes(tag) && styles.tagSelected,
                    ]}
                    onPress={() => toggleTag(tag, selectedSituations, setSelectedSituations)}
                  >
                    <Text>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.subtitle}>한줄평을 남겨주세요!</Text>
              <TextInput
                style={styles.input}
                placeholder="한줄평 입력창"
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>후기 등록</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons
                  name='close'
                  size={22}
                  color='black'
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ReviewBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 30,
    width: '85%',
  },
  container: {
    alignItems: 'center',
  },
  foodName: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 25,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: '#ffe8e8',
    borderColor: '#f00',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 30,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 8,
  },
  submitText: {
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: -1,
    right: 0,
    zIndex: 10,
  },
});
