import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';

const CATEGORIES = [
  { label: 'General', color: '#999' },
];

export default function AddExpensePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState('General');
  const [search, setSearch] = useState('');

  const filtered = CATEGORIES.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Sidebar />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Add expense</Text>

          <Text style={styles.label}>Category</Text>

          {/* Dropdown trigger */}
          <TouchableOpacity
            style={[styles.dropdownTrigger, dropdownOpen && styles.dropdownTriggerOpen]}
            onPress={() => setDropdownOpen(o => !o)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownTriggerLeft}>
              <View style={[styles.dot, { backgroundColor: CATEGORIES.find(c => c.label === selected)?.color ?? '#999' }]} />
              <Text style={styles.dropdownText}>{selected}</Text>
            </View>
            <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <View style={styles.dropdownPanel}>
              {/* Search */}
              <View style={styles.searchRow}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search categories..."
                  placeholderTextColor="#bbb"
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                />
              </View>

              {/* List */}
              {filtered.map(cat => (
                <TouchableOpacity
                  key={cat.label}
                  style={styles.dropdownItem}
                  onPress={() => { setSelected(cat.label); setDropdownOpen(false); setSearch(''); }}
                >
                  <View style={styles.dropdownItemLeft}>
                    <View style={[styles.dot, { backgroundColor: cat.color }]} />
                    <Text style={styles.dropdownItemText}>{cat.label}</Text>
                  </View>
                  {selected === cat.label && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}

              {/* Add category */}
              <TouchableOpacity style={styles.addCategoryBtn}>
                <Text style={styles.addCategoryText}>+ Add category</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>
            What is this expense for?{' '}
            <Text style={styles.labelMuted}>(50 chars)</Text>
          </Text>
          <TextInput
            style={styles.textarea}
            placeholder="e.g. Weekly grocery run..."
            placeholderTextColor="#bbb"
            multiline
            maxLength={50}
          />

          <Text style={styles.label}>How much?</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>₪</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>
            Attach invoice{' '}
            <Text style={styles.labelMuted}>(optional)</Text>
          </Text>
          <View style={styles.invoiceRow}>
            <TouchableOpacity style={styles.invoiceBtn}>
              <Text style={styles.invoiceBtnText}>↑ Upload</Text>
              <View style={styles.autofillBadge}>
                <Text style={styles.autofillText}>Auto-fill</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.invoiceBtn}>
              <Text style={styles.invoiceBtnText}>⊙ Camera</Text>
              <View style={styles.autofillBadge}>
                <Text style={styles.autofillText}>Auto-fill</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add expense</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0ede8',
  },
  main: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  labelMuted: {
    fontWeight: '400',
    color: '#bbb',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fafaf8',
    marginBottom: 4,
  },
  dropdownTriggerOpen: {
    borderColor: '#c5c0b8',
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#bbb',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dropdownPanel: {
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede8',
    gap: 8,
  },
  searchIcon: {
    fontSize: 13,
    color: '#bbb',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a1a',
    outlineStyle: 'none',
    paddingVertical: 0,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f0',
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  checkmark: {
    fontSize: 14,
    color: '#888',
  },
  addCategoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  addCategoryText: {
    fontSize: 13,
    color: '#888',
  },
  textarea: {
    height: 90,
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#fafaf8',
    marginBottom: 20,
    outlineStyle: 'none',
    textAlignVertical: 'top',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fafaf8',
    marginBottom: 20,
    gap: 8,
  },
  currency: {
    fontSize: 14,
    color: '#888',
  },
  amountInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    outlineStyle: 'none',
  },
  invoiceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 10,
    backgroundColor: '#fafaf8',
  },
  invoiceBtnText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
  autofillBadge: {
    backgroundColor: '#eeeafe',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  autofillText: {
    fontSize: 11,
    color: '#534AB7',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 46,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
