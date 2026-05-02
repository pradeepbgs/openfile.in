import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ScreenView from "@/src/components/safe-area-view-component";
import { ProfileHeader } from "@/src/components/profile-header";
import { COLORS } from "@/src/constant";
import MusicScreen from "./music";
import VideosScreen from "./videos";

const Tab = createMaterialTopTabNavigator();

export default function ProfileLayout() {
  return (
    <ScreenView>
        <ProfileHeader />
        <Tab.Navigator
          style={{ flex: 1 }}
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: COLORS.brand },
            tabBarStyle: { backgroundColor: COLORS.background, borderBottomColor: COLORS.border },
            tabBarLabelStyle: { color: COLORS.iconSubtle },
            tabBarActiveTintColor: COLORS.brand,
            animationEnabled: true,
          }}
        >
          <Tab.Screen name="videos" component={VideosScreen} />
          <Tab.Screen name="music" component={MusicScreen} />
        </Tab.Navigator>
    </ScreenView>
  );
}

