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
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import keywordMap from '../data/keywordMap.json';

const { height } = Dimensions.get('window');

const ReviewBox = ({ visible, onClose, item }) => {
  const [tagsReason, setTagsReason] = useState([]);
  const [tagsSituation, setTagsSituation] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

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
    console.log('별점:', rating);
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
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.foodName}>★ {item.name} ★</Text>
                </View>

                <View style={styles.contentBox}>
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
                    placeholder="후기 남기기..."
                    value={comment}
                    onChangeText={setComment}
                  />

                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <TouchableOpacity key={i} onPress={() => setRating(i)}>
                        <Text style={[styles.star, rating >= i && styles.starSelected]}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                      <Text style={styles.backText}>뒤로가기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                      <Text style={styles.submitText}>후기 등록</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReviewBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'transparent',
    maxHeight: height * 0.85,
  },
  container: {
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#e60000',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  foodName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentBox: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5c0a0a',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#A94946',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    margin: 5,
    shadowColor: '#A94946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tagSelected: {
    backgroundColor: '#fbe4c2',
    borderColor: '#c03c3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  star: {
    fontSize: 30,
    color: '#aaa',
    marginHorizontal: 3,
  },
  starSelected: {
    color: '#A94946',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  backText: {
    fontWeight: 'bold',
    color: '#555',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#e60000',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
