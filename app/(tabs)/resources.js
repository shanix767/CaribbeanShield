import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';


export default function ProfileScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Resources Page</Text>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
},

text: {
    fontSize: 20,
    color: Colors.text,
},
});