import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';

export default function AddExpensePage() {
  return (
    <View style={styles.container}>
      <Sidebar />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Add expense</Text>

          <Text style={styles.label}>Category</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>General</Text>
            <Text style={styles.dropdownArrow}>-</Text>
          </View>

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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fafaf8',
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#bbb',
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
