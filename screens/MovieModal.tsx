import React,{Modal, StyleSheet, Text } from "react-native";

export default function MovieModal(props: any) {
    
    return (

<Modal visible={props.visible} animationType = {"slide"} transparent={false} onRequestClose={() => {alert("lol")}}>
    <Text>Hey ho</Text>
</Modal>
    
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  