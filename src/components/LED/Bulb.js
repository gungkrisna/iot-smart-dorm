import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from 'react-native-reanimated';

const Bulb = ({ isLit, isBulbWhite, brightness = 255 }) => {
    const bulbOpacity = useSharedValue(isLit ? 1 : 0);

    const bulbContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: bulbOpacity.value,
        };
    });

    useEffect(() => {
        bulbOpacity.value = withTiming(isLit ? 1 : 0, {
            duration: 300,
            easing: Easing.linear,
        });
    }, [isLit, bulbOpacity]);

    const normalizedBrightness = brightness / 255; // Convert brightness to the range of 0-1

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/bulb/clear.png')} style={styles.bulbImage} />
            <Animated.View style={[styles.bulbContainer, bulbContainerStyle]}>
                <Image
                    source={isBulbWhite ? require('../../../assets/bulb/white.png') : require('../../../assets/bulb/yellow.png')}
                    style={[styles.bulbImage, { opacity: normalizedBrightness } // Add red color overlay
                ]}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    bulbContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bulbImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'    },
});

export default Bulb;
