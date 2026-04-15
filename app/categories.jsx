import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';

const CATEGORIES = [
  { name: 'General', color: '#9E9E9E', expenses: 0, amount: 0, percent: 100 },
];

const FILTERS = ['This month', 'This year', 'All time'];

export default function CategoriesPage() {
  const [filter, setFilter] = useState('This month');
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Sidebar />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
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
              <TouchableOpacity style={styles.newCategoryBtn} activeOpacity={0.8}>
                <Text style={styles.newCategoryPlus}>+</Text>
                <Text style={styles.newCategoryText}>New{'\n'}category</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category rows */}
          <View style={styles.list}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.row, index < CATEGORIES.length - 1 && styles.rowBorder]}
                activeOpacity={0.7}
              >
                {/* Dot */}
                <View style={[styles.dot, { backgroundColor: cat.color }]} />

                {/* Name + expense count */}
                <View style={styles.nameCol}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={styles.catExpenses}>
                    {cat.expenses} {cat.expenses === 1 ? 'expense' : 'expenses'}
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${cat.percent}%`, backgroundColor: cat.color }]} />
                </View>

                {/* Percentage */}
                <Text style={styles.percent}>{cat.percent.toFixed(1)}%</Text>

                {/* Amount */}
                <Text style={styles.amount}>₪{cat.amount.toLocaleString()}</Text>

                {/* Chevron */}
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add category button */}
          <TouchableOpacity style={styles.addCategoryBtn} activeOpacity={0.7}>
            <Text style={styles.addCategoryText}>+ Add category</Text>
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
    padding: 28,
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

  // Add category
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
