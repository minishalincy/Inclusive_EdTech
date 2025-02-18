import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";

const LearningContent = () => {
  const [activeTab, setActiveTab] = useState("video");
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const content = {
    videos: [
      {
        id: "1",
        url: "https://www.youtube.com/embed/22T-6duM9nI?playsinline=1&fs=1",
      },
      {
        id: "2",
        url: "https://www.youtube.com/embed/PHpPtdk9rco?playsinline=1&fs=1",
      },
    ],
    audios: [
      {
        id: "1",
        title: "Sample Audio 1",
        url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
      },
      {
        id: "2",
        title: "Sample Audio 2",
        url: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
      },
    ],
  };

  async function playSound(audioUrl) {
    try {
      if (sound) {
        await sound.unloadAsync();
        setIsPlaying(false);
        setSound(null);
        return;
      }

      console.log("Loading Sound");
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const renderContent = () => {
    if (activeTab === "video") {
      return (
        <ScrollView
          className="flex-1 px-4 pt-2"
          showsVerticalScrollIndicator={false}
        >
          {content.videos.map((video) => (
            <View
              key={video.id}
              style={{ height: 220, marginBottom: 20 }}
              className="rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <View className="flex-1">
                <WebView
                  className="w-full h-full"
                  source={{
                    uri: video.url,
                    headers: {
                      Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    },
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  allowsFullscreenVideo={true} // Enable fullscreen
                  scalesPageToFit={true}
                  style={{ opacity: 0.99 }} // Fix for iOS fullscreen
                  injectedJavaScript={`
                    document.getElementsByTagName('video')[0].webkitEnterFullscreen();
                  `}
                  onShouldStartLoadWithRequest={() => true}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {content.audios.map((audio) => (
          <TouchableOpacity
            key={audio.id}
            activeOpacity={0.7}
            className="mb-3 bg-white rounded-xl shadow-sm overflow-hidden"
            onPress={() => playSound(audio.url)}
          >
            <View className="flex-row items-center p-4">
              <View className="h-10 w-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                <MaterialIcons
                  name={isPlaying ? "pause-circle-filled" : "play-circle-fill"}
                  size={24}
                  color="#3b82f6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-800">
                  {audio.title}
                </Text>
                <Text className="text-sm text-blue-500 mt-1">
                  {sound && isPlaying ? "Playing..." : "Tap to play"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1 bg-gray-50">
        {/* Tab Bar */}
        <View className="px-4 pt-2 pb-1">
          <View className="flex-row bg-white rounded-full p-1 shadow-sm">
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-1 flex-row items-center justify-center py-2.5 px-4 rounded-xl ${
                activeTab === "video" ? "bg-blue-500" : ""
              }`}
              onPress={() => setActiveTab("video")}
            >
              <MaterialIcons
                name="play-circle-outline"
                size={20}
                color={activeTab === "video" ? "white" : "#6b7280"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-base font-medium ${
                  activeTab === "video" ? "text-white" : "text-gray-500"
                }`}
              >
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-1 flex-row items-center justify-center py-2.5 px-4 rounded-xl ${
                activeTab === "audio" ? "bg-blue-500" : ""
              }`}
              onPress={() => setActiveTab("audio")}
            >
              <MaterialIcons
                name="headset"
                size={20}
                color={activeTab === "audio" ? "white" : "#6b7280"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-base font-medium ${
                  activeTab === "audio" ? "text-white" : "text-gray-500"
                }`}
              >
                Audio
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </>
  );
};

export default LearningContent;
