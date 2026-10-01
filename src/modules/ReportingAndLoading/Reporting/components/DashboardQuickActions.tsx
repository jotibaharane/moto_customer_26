import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Package, Headset, LocationEditIcon, } from 'lucide-react-native';
import { navigate } from '@navigation/NavigationService';



interface Props {
    onFindLoad?: () => void;
    onCommunication?: () => void;
}

export default function DashboardQuickActions({
    onFindLoad,
    onCommunication,
}: Props) {
    return (
        <View style={styles.container}>
            {/* Find Load */}
  
         <TouchableOpacity activeOpacity={0.8} style={styles.item}   onPress={() => navigate('LiveTrackingScreen')}> <LocationEditIcon size={16} /> <Text style={styles.title}> Live Tracking </Text> </TouchableOpacity>

            <View style={styles.divider} />

            {/* Communication */}

            <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={onCommunication}> <Headset size={(34)} color={'#ffff'} strokeWidth={2} /> <Text style={styles.title}> Communication </Text> </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',

        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 5,

        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',

        elevation: 3,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    item: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 5,
    },

    divider: {
        width: 1,
        alignSelf: 'stretch',
        backgroundColor: '#E5E5E5',
    },

    title: {
        marginLeft: 2,

        color: '#2E5A99',

        fontSize: 16,
        fontWeight: '600',
    },
});