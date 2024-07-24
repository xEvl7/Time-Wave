import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

// 这里定义两个图片的路径（请根据实际情况修改路径）
const ON_IMAGE = require('../assets/toggleon.png');
const OFF_IMAGE = require('../assets/toggleoff.png');

const ToggleButton = () => {
    const [isToggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!isToggle);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleToggle}>
                <Image 
                    source={isToggle ? ON_IMAGE : OFF_IMAGE}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row', // 确保容器的布局方式是行方向
      justifyContent: 'flex-end', // 将内容对齐到容器的右边
      margin: 20,
       // 确保容器宽度占满可用空间
    },
    image: {
        width: 40, // 根据你的图片尺寸调整
        height: 40, // 根据你的图片尺寸调整
    },
});

export default ToggleButton;