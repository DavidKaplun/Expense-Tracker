import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getYearlySummary } from '../utils/api';

const COLORS = ['#7B5EA7', '#3DA35D', '#A0522D', '#B8860B', '#2979C8', '#8B3A52', '#9E9E9E', '#6C8EBF', '#82B366', '#D6A84E'];

function getColorForName(name, colorMap) {
  if (!colorMap[name]) {
    const keys = Object.keys(colorMap);
    colorMap[name] = COLORS[keys.length % COLORS.length];
  }
  return colorMap[name];
}

export default function YearlySummaryPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [tab, setTab] = useState('Individual');
  const [yearExpenses, setYearExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getYearlySummary(token, currentYear)
      .then(data => {
        if (data && typeof data === 'object') {
          setYearExpenses(Array.isArray(data.expenses) ? data.expenses : []);
          setTotal(data.total ?? 0);
        }
      })
      .finally(() => setLoading(false));
  }, [token, currentYear]);

  const canGoNext = currentYear < new Date().getFullYear();

  const colorMap = {};
  const individualData = [...yearExpenses]
    .sort((a, b) => b.amount - a.amount)
    .map(e => ({
      id: e.id,
      name: e.description || 'Expense',
      category: e.category?.name ?? 'Uncategorized',
      color: getColorForName(e.category?.name ?? 'Uncategorized', colorMap),
      amount: e.amount,
      percent: total > 0 ? (e.amount / total) * 100 : 0,
    }));

  const colorMap2 = {};
  const categoryMap = {};
  for (const e of yearExpenses) {
    const catName = e.category?.name ?? 'Uncategorized';
    if (!categoryMap[catName]) categoryMap[catName] = { name: catName, amount: 0, expenses: 0 };
    categoryMap[catName].amount += e.amount;
    categoryMap[catName].expenses += 1;
  }
  const categoriesData = Object.values(categoryMap)
    .sort((a, b) => b.amount - a.amount)
    .map(cat => ({
      ...cat,
      color: getColorForName(cat.name, colorMap2),
      percent: total > 0 ? (cat.amount / total) * 100 : 0,
    }));

  const data = tab === 'Individual' ? individualData : categoriesData;

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.main}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>yearly summary</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 60 }} color="#888" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>

              {/* Year navigation + total */}
              <View style={styles.headerRow}>
                <View style={styles.yearNav}>
                  <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentYear(y => y - 1)}>
                    <Text style={styles.navArrow}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.yearTitle}>{currentYear}</Text>
                  <TouchableOpacity
                    style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
                    disabled={!canGoNext}
                    onPress={() => setCurrentYear(y => y + 1)}
                  >
                    <Text style={styles.navArrow}>›</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.totalBlock}>
                  <Text style={styles.totalLabel}>TOTAL SPENT</Text>
                  <Text style={styles.totalAmount}>₪{total.toLocaleString()}</Text>
                </View>
              </View>

              {/* Toggle */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleTrack}>
                  {['Individual', 'Categories'].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.toggleBtn, tab === t && styles.toggleBtnActive]}
                      onPress={() => setTab(t)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.toggleBtnText, tab === t && styles.toggleBtnTextActive]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* List */}
              {data.length === 0 ? (
                <Text style={styles.emptyText}>No expenses for {currentYear}.</Text>
              ) : (
                <View style={styles.list}>
                  {data.map((item, index) => (
                    <TouchableOpacity
                      key={item.id ?? item.name}
                      style={[styles.row, index < data.length - 1 && styles.rowBorder]}
                      activeOpacity={tab === 'Categories' ? 0.7 : 1}
                      onPress={() => tab === 'Categories' && router.push(`/category-detail?name=${item.name}&year=${currentYear}`)}
                    >
                      <View style={[styles.colorBar, { backgroundColor: item.color }]} />

                      <View style={styles.nameCol}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemSub}>
                          {tab === 'Individual'
                            ? item.category
                            : `${item.expenses} expense${item.expenses !== 1 ? 's' : ''}`}
                        </Text>
                      </View>

                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${Math.min(item.percent, 100)}%`, backgroundColor: item.color }]} />
                      </View>

                      <Text style={styles.percent}>{item.percent.toFixed(1)}%</Text>
                      <Text style={styles.amount}>₪{item.amount.toLocaleString()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            </View>
          </ScrollView>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    position: 'relative',
  },
  topBarTitle: {
    fontSize: 13,
    color: '#aaa',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  scrollContent: {
    padding: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  yearNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    padding: 4,
  },
  navBtnDisabled: {
    opacity: 0.25,
  },
  navArrow: {
    fontSize: 26,
    color: '#1a1a1a',
    lineHeight: 30,
  },
  yearTitle: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2979C8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: '#ebe8e3',
    borderRadius: 30,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 26,
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  toggleBtnText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  toggleBtnTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  list: {
    borderWidth: 1,
    borderColor: '#f0ede8',
    borderRadius: 12,
    overflow: 'hidden',
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
  colorBar: {
    width: 4,
    height: 34,
    borderRadius: 2,
    flexShrink: 0,
  },
  nameCol: {
    width: 100,
    flexShrink: 0,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  itemSub: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
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
    width: 58,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'right',
    flexShrink: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    paddingVertical: 32,
  },
});
