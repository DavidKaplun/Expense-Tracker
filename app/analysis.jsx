import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../components/Sidebar';

const summaryItems = [
  {
    key: 'monthly',
    icon: '▦',
    iconBg: '#d6f0e0',
    iconColor: '#2e9e5b',
    title: 'Monthly summary',
    subtitle: 'Total + expenses this month',
  },
  {
    key: 'yearly',
    icon: '▦',
    iconBg: '#e4e0f8',
    iconColor: '#6b5ce7',
    title: 'Yearly summary',
    subtitle: 'Total + expenses this year',
  },
  {
    key: 'categories',
    icon: '⊙',
    iconBg: '#fdefd6',
    iconColor: '#d4872a',
    title: 'Categories',
    subtitle: 'Spending by category',
  },
];

export default function AnalysisPage() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Sidebar />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.title}>Analysis</Text>

          {/* Summaries section */}
          <Text style={styles.sectionLabel}>SUMMARIES</Text>
          <View style={styles.summariesList}>
            {summaryItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.summaryCard}
                activeOpacity={0.75}
                onPress={() => {
                  if (item.key === 'monthly') router.push('/monthly-summary');
                  if (item.key === 'yearly') router.push('/yearly-summary');
                  if (item.key === 'categories') router.push('/categories');
                }}
              >
                <View style={[styles.summaryIcon, { backgroundColor: item.iconBg }]}>
                  <Text style={[styles.summaryIconText, { color: item.iconColor }]}>
                    {item.icon}
                  </Text>
                </View>
                <View style={styles.summaryText}>
                  <Text style={styles.summaryTitle}>{item.title}</Text>
                  <Text style={styles.summarySubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Averages section */}
          <Text style={styles.sectionLabel}>AVERAGES</Text>
          <View style={styles.averagesRow}>
            {/* Avg monthly */}
            <View style={styles.avgCard}>
              <View style={styles.avgHeader}>
                <View style={[styles.avgIcon, { backgroundColor: '#fdefd6' }]}>
                  <Text style={styles.avgIconText}>▦</Text>
                </View>
                <Text style={styles.avgLabel}>Avg monthly</Text>
              </View>
              <Text style={styles.avgAmount}>₪4,210</Text>
              <Text style={styles.avgMeta}>based on 4 months</Text>
            </View>

            {/* Avg yearly */}
            <View style={styles.avgCard}>
              <View style={styles.avgHeader}>
                <View style={[styles.avgIcon, { backgroundColor: '#fde8e8' }]}>
                  <Text style={[styles.avgIconText, { color: '#d94f4f' }]}>∿</Text>
                </View>
                <Text style={styles.avgLabel}>Avg yearly</Text>
              </View>
              <Text style={styles.avgAmount}>₪50,520</Text>
              <Text style={styles.avgMeta}>based on 2 years</Text>
            </View>
          </View>
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
    padding: 24,
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 594,
    padding: 28,
  },
  title: {
    fontSize: 29,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 31,
  },

  // Section label
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#aaa',
    letterSpacing: 0.8,
    marginBottom: 11,
  },

  summariesList: {
    gap: 11,
    marginBottom: 31,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 15,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 18,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  summarySubtitle: {
    fontSize: 13,
    color: '#aaa',
  },
  chevron: {
    fontSize: 20,
    color: '#ccc',
  },

  // Averages
  averagesRow: {
    flexDirection: 'row',
    gap: 15,
  },
  avgCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 13,
  },
  avgIcon: {
    width: 31,
    height: 31,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgIconText: {
    fontSize: 14,
    color: '#d4872a',
  },
  avgLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  avgAmount: {
    fontSize: 31,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  avgMeta: {
    fontSize: 13,
    color: '#aaa',
  },
});
