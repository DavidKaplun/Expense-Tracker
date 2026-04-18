import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { TextInput } from 'react-native';
import { getCategories, createCategory } from '../utils/api';

const FILTERS = ['This month', 'This year', 'All time'];
const FILTER_KEYS = { 'This month': 'month', 'This year': 'year', 'All time': 'all' };
const COLORS = ['#6C8EBF', '#82B366', '#D6A84E', '#AE6BBD', '#E07070', '#5BBFBF', '#E0934E', '#9E9E9E'];

export default function CategoriesPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [filter, setFilter] = useState('This month');
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || adding) return;
    setAdding(true);
    const data = await createCategory(token, newCategoryName.trim());
    if (data.id) {
      setNewCategoryName('');
      setShowNewCategory(false);
      setLoading(true);
      getCategories(token, FILTER_KEYS[filter])
        .then(d => setCategories(Array.isArray(d) ? d : []))
        .finally(() => setLoading(false));
    }
    setAdding(false);
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getCategories(token, FILTER_KEYS[filter])
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token, filter]);

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.main}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.mainContent}>
        <View style={styles.card}>

          {/* Header row */}
          <View style={styles.header}>
            <Text style={styles.title}>Categories</Text>

            <View style={styles.headerActions}>
              {/* Filter dropdown */}
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setFilterOpen(o => !o)}
                activeOpacity={0.8}
              >
                <Text style={styles.filterBtnText}>{filter}</Text>
                <Text style={styles.filterArrow}>▾</Text>
              </TouchableOpacity>

              {/* Filter dropdown panel */}
              {filterOpen && (
                <View style={styles.filterDropdown}>
                  {FILTERS.map(f => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.filterOption, f === filter && styles.filterOptionActive]}
                      onPress={() => { setFilter(f); setFilterOpen(false); }}
                    >
                      <Text style={[styles.filterOptionText, f === filter && styles.filterOptionTextActive]}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* New category button */}
              <TouchableOpacity style={styles.newCategoryBtn} activeOpacity={0.8} onPress={() => setShowNewCategory(true)}>
                <Text style={styles.newCategoryPlus}>+</Text>
                <Text style={styles.newCategoryText}>New{'\n'}category</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category rows */}
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 32 }} color="#888" />
          ) : (
            <View style={styles.list}>
              {categories.length === 0 ? (
                <Text style={styles.emptyText}>No categories yet.</Text>
              ) : categories.map((cat, index) => {
                const color = COLORS[index % COLORS.length];
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.row, index < categories.length - 1 && styles.rowBorder]}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/category-detail?name=${cat.name}`)}
                  >
                    <View style={[styles.dot, { backgroundColor: color }]} />

                    <View style={styles.nameCol}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catExpenses}>
                        {cat.expenses} {cat.expenses === 1 ? 'expense' : 'expenses'}
                      </Text>
                    </View>

                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${cat.percent ?? 0}%`, backgroundColor: color }]} />
                    </View>

                    <Text style={styles.percent}>{(cat.percent ?? 0).toFixed(1)}%</Text>
                    <Text style={styles.amount}>₪{(cat.amount ?? 0).toLocaleString()}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Add category */}
          {showNewCategory ? (
            <View style={styles.newCategoryRow}>
              <TextInput
                style={styles.newCategoryInput}
                placeholder="Category name..."
                placeholderTextColor="#bbb"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
                onSubmitEditing={handleAddCategory}
              />
              <TouchableOpacity onPress={handleAddCategory} style={styles.newCategoryConfirm} disabled={adding}>
                <Text style={styles.newCategoryConfirmText}>{adding ? '...' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowNewCategory(false); setNewCategoryName(''); }} style={styles.newCategoryCancel}>
                <Text style={styles.newCategoryCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addCategoryBtn} activeOpacity={0.7} onPress={() => setShowNewCategory(true)}>
              <Text style={styles.addCategoryText}>+ Add category</Text>
            </TouchableOpacity>
          )}

        </View>
        </ScrollView>
      </View>
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
    flexDirection: 'column',
  },
  topBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 22,
    color: '#1a1a1a',
    lineHeight: 26,
  },
  backText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    paddingTop: 3,
  },
  mainContent: {
    padding: 28,
    paddingTop: 8,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 640,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    zIndex: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    zIndex: 10,
  },

  // Filter button
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0ddd8',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  filterBtnText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  filterArrow: {
    fontSize: 11,
    color: '#888',
  },
  filterDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ddd8',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 20,
    minWidth: 130,
  },
  filterOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterOptionActive: {
    backgroundColor: '#f5f3f0',
  },
  filterOptionText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
  filterOptionTextActive: {
    fontWeight: '600',
  },

  // New category button
  newCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0ddd8',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  newCategoryPlus: {
    fontSize: 16,
    color: '#888',
    lineHeight: 18,
  },
  newCategoryText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
    lineHeight: 16,
  },

  // Category list
  list: {
    borderWidth: 1,
    borderColor: '#f0ede8',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: '#fff',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede8',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  nameCol: {
    width: 110,
    flexShrink: 0,
  },
  catName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  catExpenses: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 1,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#f0ede8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  percent: {
    width: 44,
    fontSize: 13,
    color: '#888',
    textAlign: 'right',
    flexShrink: 0,
  },
  amount: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'right',
    flexShrink: 0,
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
    marginLeft: 4,
  },

  emptyText: {
    padding: 20,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
  },

  // Add category
  newCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  newCategoryInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0ddd8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    outlineStyle: 'none',
  },
  newCategoryConfirm: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  newCategoryConfirmText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  newCategoryCancel: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  newCategoryCancelText: {
    color: '#aaa',
    fontSize: 13,
  },
  addCategoryBtn: {
    borderWidth: 1.5,
    borderColor: '#e0ddd8',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addCategoryText: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '500',
  },
});
