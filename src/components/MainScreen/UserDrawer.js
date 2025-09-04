import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const UserDrawer = ({
  isVisible,
  onClose,
  email,
  onNavigateToLanding,
  onLogout,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="right"
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={styles.drawerModal}
    >
      <View style={styles.drawerContent}>
        <Text style={styles.emailText}>{email}</Text>
        <Button title="로그인/랜딩" onPress={onNavigateToLanding} />
        <Button title="로그아웃" onPress={onLogout} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  drawerModal: {
    margin: 0,
  },
  drawerContent: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default UserDrawer;