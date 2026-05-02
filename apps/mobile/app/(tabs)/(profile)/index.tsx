import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/zustand/user-store";
import { router } from "expo-router";

export default function ProfileScreen() {
  const logout = useAuth((s) => s.logout);

  function handleLogout() {
    logout();
    router.navigate("/auth");
  }

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
