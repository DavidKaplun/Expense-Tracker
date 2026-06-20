import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

const PUBLIC_ROUTES = ['/', '/register'];

function AuthGuard({ children }) {
  const { token } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (!token && !isPublic) {
      router.replace('/');
    }
  }, [token, pathname]);

  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGuard>
    </AuthProvider>
  );
}
