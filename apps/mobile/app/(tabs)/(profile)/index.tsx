import React from "react";
import ScreenView from "@/src/components/safe-area-view-component";
import { ProfileHeader } from "@/src/components/profile-header";

export default function ProfileScreen() {
  return (
    <ScreenView>
      <ProfileHeader />
    </ScreenView>
  );
}
