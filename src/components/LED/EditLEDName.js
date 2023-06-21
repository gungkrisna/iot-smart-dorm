import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { setLedName } from '../../store/auth';

const EditLEDName = ({ledIndex, ledName, onUpdateLedName, bottomSheetModalRef}) => {
    const [newName, setNewName] = useState(ledName);

    const handleSave = () => {
        setLedName(ledIndex, newName);
        onUpdateLedName(newName);
        bottomSheetModalRef.current?.close();
    }

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color:'white' }}>Edit Nama LED</Text>
            </View>
            <BottomSheetTextInput
                value={newName}
                onChangeText={(newName) => setNewName(newName)}
                placeholder={'Masukkan nama LED'}
                style={styles.input}
            >

            </BottomSheetTextInput>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    !newName && { backgroundColor: 'rgb(44, 44, 44)' },
                    { opacity: pressed ? 0.5 : 1.0 },
                ]} onPress={(newName) => handleSave(newName)}>
                <Text style={[styles.buttonText, !newName && { color: 'rgb(59, 130, 247)' }]}>Simpan</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        backgroundColor: '#212121',
    },
    headingContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 6,
        marginBottom: 24,
    },
    input: {
        height: 40,
        marginBottom: 12,
        padding: 10,
        borderRadius: 12,
        color: 'white',
        backgroundColor: '#424242',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginBottom: 24,
        backgroundColor: 'rgb(59, 130, 247)'
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default EditLEDName;