import React from 'react';
import { FlatList } from 'react-native';

import RadioButton from './RadioButton';
import { RadioGroupProps } from './types';

export default function RadioGroup({
  onPress,
  radioButtons,
  selectedId,
}: RadioGroupProps) {
  return (
    <FlatList
      data={radioButtons}
      renderItem={({ item: button }) => (
        <RadioButton
          {...button}
          key={button.id}
          selected={button.id === selectedId}
          onPress={onPress}
        />
      )}
    />
  );
}
