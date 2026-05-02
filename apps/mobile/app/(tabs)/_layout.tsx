import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/src/constant";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.white,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
      }}
      
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="links"
        options={{
          title: 'My Links',
          tabBarIcon: ({ color }) => (
            <AntDesign name="link" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-link"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
