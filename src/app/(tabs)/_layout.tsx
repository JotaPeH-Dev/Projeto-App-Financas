import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext'; // Importe seu hook

export default function TabLayout() {
  const { user } = useAuth(); // Pegue o usuário logado

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#032ad7' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />

      {/* A MÁGICA ACONTECE AQUI: */}
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-shield" size={20} color={color} />,
          // Use APENAS o tabBarButton para esconder. Remova o href.
          tabBarButton: user?.is_admin ? undefined : () => null,
        }}
      />
    </Tabs>
  );
}