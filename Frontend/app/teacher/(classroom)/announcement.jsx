import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const Announcements = () => {
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/classroom/${params.id}/announcements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Sort announcements by createdAt in descending order (newest first)
        const sortedAnnouncements = response.data.announcements.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements(sortedAnnouncements);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      Alert.alert("Error", "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      Alert.alert("Error", "Please fill both title and content");
      return;
    }

    setSending(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/classroom/${params.id}/announcement`,
        {
          title: announcementTitle,
          content: announcementContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAnnouncementTitle("");
        setAnnouncementContent("");
        Alert.alert("Success", "Announcement posted successfully");
        fetchAnnouncements(); // Refresh the list to show the new announcement
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      Alert.alert("Error", "Failed to post announcement");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 p-6">
        <Text className="text-2xl font-bold text-white">Announcements</Text>
        <Text className="text-white mt-2">
          Grade {params.grade} - Section {params.section}
        </Text>
      </View>

      {/* Create Announcement Section */}
      <View className="p-4 bg-white mb-4">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="campaign" size={24} color="#3b82f6" />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Make an Announcement
          </Text>
        </View>

        <TextInput
          className="border border-gray-300 p-3 rounded-lg mb-3"
          placeholder="Announcement Title"
          value={announcementTitle}
          onChangeText={setAnnouncementTitle}
        />

        <TextInput
          className="border border-gray-300 p-3 rounded-lg mb-3"
          placeholder="Announcement Content"
          value={announcementContent}
          onChangeText={setAnnouncementContent}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg"
          onPress={handleAddAnnouncement}
          disabled={sending}
        >
          <Text className="text-white text-center font-semibold">
            {sending ? "Sending..." : "Post Announcement"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Announcements List */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          All Announcements
        </Text>

        {announcements && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <View
              key={announcement._id}
              className="bg-white p-4 rounded-lg mb-3 shadow-sm border-b border-gray-300"
            >
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {announcement.title}
              </Text>
              <Text className="text-gray-600 mb-2">{announcement.content}</Text>
              <Text className="text-gray-400 text-sm">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-gray-500 text-center">
              No announcements yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Announcements;
