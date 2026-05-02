import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { formatDistanceToNow, isBefore } from "date-fns";

import type { Link } from "@/src/api/links-api-api";
import { COLORS, UPLOAD_URL } from "@/src/constant";
import { getItem } from "@/src/utils/storage";
import DeleteLinkModal from "./delete-link-modal";

interface Props {
  link: Link;
}

function getExpiryInfo(expiresAt?: string) {
  if (!expiresAt) {
    return { expired: false, badgeText: "Never expires" };
  }
  const expiryDate = new Date(expiresAt);
  const expired = isBefore(expiryDate, new Date());
  return {
    expired,
    badgeText: expired
      ? `Expired ${formatDistanceToNow(expiryDate)} ago`
      : `Expires in ${formatDistanceToNow(expiryDate)}`,
  };
}

export default function LinkCard({ link }: Props) {
  const { expired, badgeText } = getExpiryInfo(link.expiresAt);
  const [secret, setSecret] = useState<{ key: string; iv: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getItem(`key:${link.token}`).then(setSecret);
  }, [link.token]);

  const fullLink = secret
    ? `${UPLOAD_URL}?token=${link.token}#key=${secret.key}&iv=${secret.iv}`
    : null;

  const linkName = link.name?.trim() || `link:${link.id.slice(0, 8)}`;

  const handleCopy = async () => {
    if (!fullLink) {
      Alert.alert("Key not found", "Encryption key for this link was not found on this device.");
      return;
    }
    await Clipboard.setStringAsync(fullLink);
    Alert.alert("Copied", "Upload link copied to clipboard.");
  };

  const handleOpenUploadPage = async () => {
    if (!fullLink) {
      Alert.alert("Key not found", "Encryption key for this link was not found on this device.");
      return;
    }
    await WebBrowser.openBrowserAsync(fullLink);
  };

  const badgeContainerClass = expired ? "bg-zinc-800" : "bg-green-950";
  const badgeTextClass = expired ? "text-zinc-500" : "text-green-400";

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-zinc-900 rounded-xl p-4"
        onPress={() => router.push(`/link/${link.id}?token=${link.token}`)}
      >
        <View className="flex-row items-start justify-between mb-3">
          <Text className="font-semibold text-brand flex-1 mr-3 text-base" numberOfLines={1}>
            {linkName}
          </Text>
          <View className={`px-2.5 py-1 rounded-full ${badgeContainerClass}`}>
            <Text className={`text-xs font-medium ${badgeTextClass}`}>{badgeText}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <AntDesign name="upload" size={12} color={COLORS.icon} />
            <Text className="text-white text-sm">
              {link.uploadCount}/{link.maxUploads} uploads
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleCopy}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1.5 rounded-lg bg-zinc-800"
            >
              <AntDesign name="copy" size={13} color={COLORS.iconSubtle} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenUploadPage}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1.5 rounded-lg bg-zinc-800"
            >
              <AntDesign name="export" size={13} color={COLORS.iconSubtle} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1.5 rounded-lg bg-zinc-800"
            >
              <AntDesign name="delete" size={13} color="#f87171" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <DeleteLinkModal
        visible={showDeleteModal}
        linkId={link.id}
        linkName={linkName}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
