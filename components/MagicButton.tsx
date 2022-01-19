import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function MagicButton () {

    const [click, setClick] = useState(0);


    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: 'fe8d932d92d501a77c50e1f9318292e8' })
    };              



    return (
        <View>
            <Text>Here is my Magic Button !</Text>
            <Button title="MagicButton" onPress={()=>setClick(click+1)}>Magic button</Button>
            <Text>My Magic Button was pressed {click} time(s) !</Text>
        </View>
    );

}