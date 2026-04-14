import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Add expense', icon: '+', href: '/add-expense' },
    { label: 'Analysis', icon: '▦', href: '/analysis' },
    { label: 'Categories', icon: '⊙', href: '/categories' },
  ];

  return (
    <View style={styles.sidebar}>
      <View style={styles.logo}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>$</Text>
        </View>
        <Text style={styles.logoText}>ExpenseTracker</Text>
      </View>

      {navItems.map((item) => (
        <TouchableOpacity
          key={item.href}
          style={[
            styles.navItem,
            pathname === item.href && styles.navItemActive,
          ]}
          onPress={() => router.push(item.href)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={styles.navLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e0ddd8',
    paddingTop: 24,
    paddingHorizontal: 16,
    height: '100%',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#f0ede8',
  },
  navIcon: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  navLabel: {
    fontSize: 14,
    color: '#1a1a1a',
  },
});