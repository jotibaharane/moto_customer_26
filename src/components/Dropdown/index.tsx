import { InputOutline } from '@components/Input';
import { COLORS } from '@theme/index';
import { ChevronDown } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

/* ================= TYPES ================= */

export interface Item {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  data: Item[];

  multi?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  disabled?: boolean;
  error?: string;
  inputeStyle?: StyleProp<TextStyle>;
}

/* ================= COMPONENT ================= */

const Dropdown: React.FC<DropdownProps> = ({
  label = '',
  data,
  multi = false,
  value,
  onChange,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  disabled = false,
  error,
  inputeStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  /* ---------- INIT ---------- */
  useEffect(() => {
    if (!value) {
      setSelected([]);
      return;
    }

    setSelected(Array.isArray(value) ? value : [value]);
  }, [value]);

  /* ---------- FILTER ---------- */
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    return data.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, data]);

  /* ---------- HANDLERS ---------- */

  const openModal = useCallback(() => {
    if (!disabled) setVisible(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setVisible(false);
    setSearch('');
  }, []);

  const handleSelect = useCallback(
    (val: string) => {
      if (multi) {
        const updated = selected.includes(val)
          ? selected.filter(v => v !== val)
          : [...selected, val];

        setSelected(updated);
      } else {
        onChange(val);
        setSelected([val]);
        closeModal();
      }
    },
    [multi, selected, onChange, closeModal],
  );

  const handleDone = useCallback(() => {
    onChange(selected);
    closeModal();
  }, [selected, onChange, closeModal]);

  const handleClear = useCallback(() => {
    setSelected([]);
    onChange(multi ? [] : '');
  }, [multi, onChange]);

  /* ---------- DISPLAY LABEL ---------- */
  const displayLabel = useMemo(() => {
    if (!selected.length) return placeholder;

    const labels = selected
      .map(v => data.find(d => d.value === v)?.label)
      .filter(Boolean);

    return labels.join(', ');
  }, [selected, data, placeholder]);

  /* ---------- ITEM ---------- */
  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const isSelected = selected.includes(item.value);

      return (
        <TouchableOpacity
          style={[styles.item, isSelected && styles.itemSelected]}
          onPress={() => handleSelect(item.value)}
        >
          <Text style={styles.itemLabel}>{item.label}</Text>
          {isSelected && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      );
    },
    [selected, handleSelect],
  );

  /* ================= RENDER ================= */

  return (
    <>
      {/* INPUT */}
      <View style={styles.wrapper}>
        <View style={{ position: 'relative' }}>
          <InputOutline
            placeholder={label}
            value={displayLabel}
            editable={false}
            TrailingIcon={() => <ChevronDown />}
            error={error}
            style={inputeStyle}
          />

          {/* ✅ FULL CLICKABLE OVERLAY */}
          {!disabled && (
            <TouchableOpacity
              activeOpacity={1}
              style={StyleSheet.absoluteFillObject}
              onPress={() => {
                console.log('FULL CLICK WORKING');
                setVisible(true);
              }}
            />
          )}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* MODAL */}
      <Modal visible={visible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{label}</Text>

            <View style={styles.headerActions}>
              {multi && selected.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.clear}>Clear</Text>
                </TouchableOpacity>
              )}

              {multi ? (
                <TouchableOpacity onPress={handleDone}>
                  <Text style={styles.done}>Done ({selected.length})</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.clear}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* SEARCH */}
          <RNTextInput
            placeholder={searchPlaceholder}
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {/* LIST */}
          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.empty}>{emptyMessage}</Text>
            }
          />
        </View>
      </Modal>
    </>
  );
};

export default Dropdown;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: '#00000060',
  },

  sheet: {
    backgroundColor: '#fff',
    maxHeight: '80%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },

  done: {
    color: COLORS.primary[500],
    fontWeight: '600',
  },

  clear: {
    color: '#666',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },

  itemSelected: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },

  itemLabel: {
    fontSize: 16,
    flex: 1,
  },

  check: {
    color: COLORS.primary[500],
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  },

  errorBorder: {
    borderColor: '#D32F2F',
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },

  disabledInput: {
    backgroundColor: '#f2f2f2',
    opacity: 0.7,
  },
});
