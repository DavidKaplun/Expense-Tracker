import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

const PUBLIC_ROUTES: string[] = ['/', '/register'];

function AuthGuard({ children }: { children: ReactNode }) {
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
