import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';

const EXPENSES = [
  { name: 'Rent',          category: 'Housing',       color: '#7B5EA7', percent: 45.5, amount: 2200 },
  { name: 'Groceries',     category: 'Food',          color: '#3DA35D', percent: 16.1, amount: 780  },
  { name: 'Shopping',      category: 'Shopping',      color: '#A0522D', percent: 12.4, amount: 600  },
  { name: 'Transport',     category: 'Transport',     color: '#B8860B', percent: 9.3,  amount: 450  },
  { name: 'Dining out',    category: 'Food',          color: '#2979C8', percent: 7.9,  amount: 380  },
  { name: 'Hobbies',       category: 'Hobbies',       color: '#8B3A52', percent: 5.4,  amount: 260  },
  { name: 'Subscriptions', category: 'Subscriptions', color: '#9E9E9E', percent: 3.3,  amount: 160  },
];

const CATEGORIES_DATA = [
  { name: 'Housing',       color: '#7B5EA7', percent: 45.5, amount: 2200, expenses: 1 },
  { name: 'Food',          color: '#3DA35D', percent: 24.0, amount: 1160, expenses: 2 },
  { name: 'Shopping',      color: '#A0522D', percent: 12.4, amount: 600,  expenses: 1 },
  { name: 'Transport',     color: '#B8860B', percent: 9.3,  amount: 450,  expenses: 1 },
  { name: 'Hobbies',       color: '#8B3A52', percent: 5.4,  amount: 260,  expenses: 1 },
  { name: 'Subscriptions', color: '#9E9E9E', percent: 3.3,  amount: 160,  expenses: 1 },
];

const TOTAL = EXPENSES.reduce((sum, e) => sum + e.amount, 0);

export default function MonthlySummaryPage() {
  const [tab, setTab] = useState('Individual');
  const data = tab === 'Individual' ? EXPENSES : CATEGORIES_DATA;

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.main}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>individual view</Text>
          <TouchableOpacity style={styles.menuBtn}>
            <Text style={styles.menuDots}>•••</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>

            {/* Month + total */}
            <View style={styles.monthRow}>
              <Text style={styles.monthTitle}>March 2026</Text>
              <View style={styles.totalBlock}>
                <Text style={styles.totalLabel}>TOTAL SPENT</Text>
                <Text style={styles.totalAmount}>₪{TOTAL.toLocaleString()}</Text>
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
            <View style={styles.list}>
              {data.map((item, index) => (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.row, index < data.length - 1 && styles.rowBorder]}
                  activeOpacity={0.7}
                >
                  {/* Left color bar */}
                  <View style={[styles.colorBar, { backgroundColor: item.color }]} />

                  {/* Name + sub */}
                  <View style={styles.nameCol}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSub}>
                      {tab === 'Individual'
                        ? item.category
                        : `${item.expenses} expense${item.expenses !== 1 ? 's' : ''}`}
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
                  </View>

                  {/* Percent */}
                  <Text style={styles.percent}>{item.percent.toFixed(1)}%</Text>

                  {/* Amount */}
                  <Text style={styles.amount}>₪{item.amount.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

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

  // Top bar
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
  menuBtn: {
    position: 'absolute',
    right: 20,
    top: 12,
    padding: 4,
  },
  menuDots: {
    fontSize: 13,
    color: '#aaa',
    letterSpacing: 2,
  },

  // Scroll
  scrollContent: {
    padding: 24,
    paddingTop: 8,
    alignItems: 'center',
  },

  // Outer card
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

  // Month row
  monthRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 32,
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

  // Toggle
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

  // List
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
});
