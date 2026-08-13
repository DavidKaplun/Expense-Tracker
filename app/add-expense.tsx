import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ApiError, addExpense, createCategory, getCategories, extractInvoice } from '../utils/api';
import type { CategorySummary } from '../types';

export default function AddExpensePage() {
  const { token } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategorySummary | null>(null);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [scansInfo, setScansInfo] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, [token]);

  const loadCategories = async () => {
    if (!token) return;
    try {
      setCategories(await getCategories(token));
    } catch {
      setCategories([]);
    }
  };

  const handleAddCategory = async () => {
    if (!token || !newCategoryName.trim()) return;
    try {
      const created = await createCategory(token, newCategoryName.trim());

      // The list holds aggregates, but POST /categories returns the plain
      // record. A category that was just created has no expenses yet, so the
      // aggregate fields are genuinely zero rather than unknown.
      const summary: CategorySummary = {
        id: created.id,
        name: created.name,
        expenses: 0,
        amount: 0,
        percent: 0,
      };

      setCategories(prev => [...prev, summary]);
      setSelectedCategory(summary);
      setNewCategoryName('');
      setShowNewCategory(false);
      setDropdownOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to add category');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!token) return;
    if (!selectedCategory) return setError('Please select a category');
    if (!amount) return setError('Please enter an amount');

    const today = new Date().toISOString().slice(0, 10);

    try {
      await addExpense(token, {
        amount: parseFloat(amount),
        description,
        date: today,
        category_id: selectedCategory.id,
      });
      setSuccess('Expense added!');
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to add expense');
    }
  };

  const handleInvoiceUpload = () => {
    if (!token) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,application/pdf';

    input.onchange = async () => {
      // Read from `input` rather than the event target, which is only typed
      // as a generic EventTarget and would need a cast to reach .files.
      const file = input.files?.[0];
      if (!file) return;

      setExtracting(true);
      setError('');
      try {
        const data = await extractInvoice(token, file);
        if (data.description) setDescription(data.description);
        if (data.amount) setAmount(String(data.amount));

        // Held in a local so the narrowing survives into the callback below.
        const extractedCategory = data.category;
        if (extractedCategory) {
          const match = categories.find(
            c => c.name.toLowerCase() === extractedCategory.toLowerCase(),
          );
          if (match) setSelectedCategory(match);
        }

        setScansInfo(`${data.scansUsed}/${data.scansLimit} scans used this month`);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Failed to read invoice');
      } finally {
        setExtracting(false);
      }
    };

    input.click();
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Sidebar />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Add expense</Text>

          <Text style={styles.label}>Category</Text>

          <TouchableOpacity
            style={[styles.dropdownTrigger, dropdownOpen && styles.dropdownTriggerOpen]}
            onPress={() => setDropdownOpen(o => !o)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownTriggerLeft}>
              <View style={[styles.dot, { backgroundColor: '#999' }]} />
              <Text style={styles.dropdownText}>{selectedCategory ? selectedCategory.name : 'Select category'}</Text>
            </View>
            <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownPanel}>
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

              {filtered.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.dropdownItem}
                  onPress={() => { setSelectedCategory(cat); setDropdownOpen(false); setSearch(''); }}
                >
                  <View style={styles.dropdownItemLeft}>
                    <View style={[styles.dot, { backgroundColor: '#999' }]} />
                    <Text style={styles.dropdownItemText}>{cat.name}</Text>
                  </View>
                  {selectedCategory?.id === cat.id && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}

              {showNewCategory ? (
                <View style={styles.newCategoryRow}>
                  <TextInput
                    style={styles.newCategoryInput}
                    placeholder="Category name..."
                    placeholderTextColor="#bbb"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleAddCategory} style={styles.newCategoryConfirm}>
                    <Text style={styles.newCategoryConfirmText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addCategoryBtn} onPress={() => setShowNewCategory(true)}>
                  <Text style={styles.addCategoryText}>+ Add category</Text>
                </TouchableOpacity>
              )}
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
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>How much?</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>₪</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <Text style={styles.label}>
            Attach invoice{' '}
            <Text style={styles.labelMuted}>(optional)</Text>
          </Text>
          <View style={styles.invoiceRow}>
            <TouchableOpacity style={styles.invoiceBtn} onPress={handleInvoiceUpload} disabled={extracting}>
              <Text style={styles.invoiceBtnText}>{extracting ? '⏳ Reading...' : '↑ Upload'}</Text>
              {!extracting && (
                <View style={styles.autofillBadge}>
                  <Text style={styles.autofillText}>Auto-fill</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {scansInfo ? <Text style={styles.scansInfo}>{scansInfo}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    outlineWidth: 0,
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
  newCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  newCategoryInput: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    outlineWidth: 0,
  },
  newCategoryConfirm: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newCategoryConfirmText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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
    outlineWidth: 0,
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
    outlineWidth: 0,
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
  scansInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 13,
    marginBottom: 10,
  },
});
