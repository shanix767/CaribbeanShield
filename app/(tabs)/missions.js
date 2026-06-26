//Mission Screen
//Display tasks for the player

import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';


export default function MissionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Missions Page</Text>
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