import CustomButton from '@components/Button';
import { RadioGroup } from '@components/RadioButton';
import { navigate } from '@navigation/NavigationService';
import { Languges } from '@utils/constants';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './LangugeSelection.style';
import { s } from '@theme/scaling-utils';

const LangugeSelection = () => {
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | undefined>('en');
  return (
    <SafeAreaView style={styles.constainer}>
      <Text style={styles.title}>choose your{'\n'}preferred language</Text>

      <Text style={styles.subtitle}>
        Travel light and stress-free.{'\n'}
        We deliver your luggage safely, door to door.
      </Text>

      <View style={styles.radioContainer}>
        <RadioGroup
          radioButtons={Languges}
          onPress={setSelectedId}
          selectedId={selectedId}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Next  →"
          variant="filled"
          style={{ width: s(213) }}
          onPress={() => {
            i18n.changeLanguage(selectedId || 'en');
            navigate('Login');
          }}
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>🔒 Insured & Secure</Text>
        <Text style={styles.infoText}>⭐ 10,000+ Travelers</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={styles.stepDot} />
        <View style={styles.stepActive} />
        <View style={styles.stepDot} />
      </View>
    </SafeAreaView>
  );
};

export default LangugeSelection;
