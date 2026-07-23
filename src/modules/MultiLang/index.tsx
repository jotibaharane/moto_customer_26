import CustomButton from '@components/Button';
import { RadioGroup } from '@components/RadioButton';
import { navigate } from '@navigation/NavigationService';
import { Languges } from '@utils/constants';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './LangugeSelection.style';

const LangugeSelection = () => {
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | undefined>('en');
  return (
    <SafeAreaView style={styles.constainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@assets/images/lanLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>choose your{'\n'}preferred language</Text>

      <View style={styles.radioContainer}>
        <RadioGroup
          radioButtons={Languges}
          onPress={setSelectedId}
          selectedId={selectedId}
        />
      </View>

      <CustomButton
        title="Next"
        variant="filled"
        onPress={() => {
          i18n.changeLanguage(selectedId || 'en');
          navigate('Login');
        }}
      />
    </SafeAreaView>
  );
};

export default LangugeSelection;
