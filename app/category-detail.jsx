import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';

// Placeholder expenses per category — will come from DB later
const CATEGORY_EXPENSES = {
  Food: [
    { name: 'Groceries',  date: 'Mar 3',  amount: 780 },
    { name: 'Dining out', date: 'Mar 17', amount: 380 },
    { name: 'Coffee shop',date: 'Mar 22', amount: 95  },
    { name: 'Supermarket',date: 'Mar 25', amount: 620 },
    { name: 'Restaurant', date: 'Mar 27', amount: 450 },
    { name: 'Takeaway',   date: 'Mar 29', amount: 180 },
  ],
  Housing: [
    { name: 'Rent',       date: 'Mar 1',  amount: 2200 },
  ],
  Shopping: [
    { name: 'Clothes',    date: 'Mar 5',  amount: 250 },
    { name: 'Electronics',date: 'Mar 12', amount: 200 },
    { name: 'Home decor', date: 'Mar 20', amount: 150 },
  ],
  Transport: [
    { name: 'Bus pass',   date: 'Mar 1',  amount: 120 },
    { name: 'Taxi',       date: 'Mar 8',  amount: 85  },
    { name: 'Gas',        date: 'Mar 14', amount: 140 },
    { name: 'Parking',    date: 'Mar 21', amount: 60  },
    { name: 'Train',      date: 'Mar 28', amount: 45  },
  ],
  Hobbies: [
    { name: 'Gym',        date: 'Mar 1',  amount: 180 },
    { name: 'Books',      date: 'Mar 15', amount: 80  },
  ],
  Subscriptions: [
    { name: 'Streaming',  date: 'Mar 1',  amount: 55  },
    { name: 'Cloud',      date: 'Mar 1',  amount: 30  },
    { name: 'Music',      date: 'Mar 1',  amount: 25  },
    { name: 'News',       date: 'Mar 1',  amount: 50  },
  ],
  Health: [
    { name: 'Pharmacy',   date: 'Mar 6',  amount: 90  },
    { name: 'Doctor',     date: 'Mar 13', amount: 150 },
    { name: 'Supplements',date: 'Mar 20', amount: 80  },
  ],
  Education: [
    { name: 'Online course', date: 'Mar 3', amount: 150 },
  ],
  General: [],
};

const CATEGORY_COLORS = {
  Food:          '#3DA35D',
  Housing:       '#7B5EA7',
  Shopping:      '#A0522D',
  Transport:     '#B8860B',
  Hobbies:       '#8B3A52',
  Subscriptions: '#9E9E9E',
  Health:        '#2979C8',
  Education:     '#5BAD72',
  General:       '#9E9E9E',
};

const CATEGORY_ICONS = {
  Food:          '🍴',
  Housing:       '🏠',
  Shopping:      '🛍',
  Transport:     '🚗',
  Hobbies:       '🎨',
  Subscriptions: '📦',
  Health:        '❤️',
  Education:     '📚',
  General:       '📋',
};

export default function CategoryDetailPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  const expenses = CATEGORY_EXPENSES[name] ?? [];
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const color = CATEGORY_COLORS[name] ?? '#9E9E9E';
  const icon = CATEGORY_ICONS[name] ?? '📋';

  return (
    <View style={styles.container}>
      <Sidebar />

      <ScrollView style={styles.main} contentContainerStyle={styles.scrollContent}>

        {/* Back link */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back to categories</Text>
        </TouchableOpacity>

        <View style={styles.panel}>

          {/* Category header card */}
          <View style={styles.headerCard}>
            <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
            <View>
              <Text style={styles.catName}>{name}</Text>
              <Text style={styles.catDate}>March 2026</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TOTAL SPENT</Text>
              <Text style={styles.statValue}>₪{total.toLocaleString()}</Text>
            </View>
            <View style={[styles.statCard, styles.statCardBorder]}>
              <Text style={styles.statLabel}>EXPENSES</Text>
              <Text style={styles.statValue}>{expenses.length}</Text>
            </View>
          </View>

          {/* Expenses list */}
          <Text style={styles.sectionLabel}>EXPENSES</Text>

          {expenses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No expenses yet</Text>
            </View>
          ) : (
            <View style={styles.listCard}>
              {expenses.map((exp, index) => (
                <View
                  key={index}
                  style={[styles.expenseRow, index < expenses.length - 1 && styles.expenseRowBorder]}
                >
                  <View>
                    <Text style={styles.expenseName}>{exp.name}</Text>
                    <Text style={styles.expenseDate}>{exp.date}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>₪{exp.amount.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

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
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },

  // Back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 4,
  },
  backArrow: {
    fontSize: 20,
    color: '#888',
    lineHeight: 20,
  },
  backText: {
    fontSize: 14,
    color: '#888',
  },

  panel: {
    width: '100%',
    maxWidth: 520,
  },

  // Header card
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  catName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  catDate: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  statCard: {
    flex: 1,
    padding: 20,
  },
  statCardBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#f0ede8',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Expenses list
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  expenseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f0',
  },
  expenseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  expenseDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Empty state
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
  },
});
