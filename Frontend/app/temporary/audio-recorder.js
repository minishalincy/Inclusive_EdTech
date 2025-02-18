import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import { Stack } from "expo-router";

export default function AudioRecorderScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  async function startRecording() {
    try {
      setIsLoading(true);
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        Alert.alert(
          "Permission required",
          "Please grant microphone permission to use the recorder."
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to start recording: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;

      setIsLoading(true);
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      setRecordings([
        ...recordings,
        {
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: recording.getURI(),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to stop recording: " + err.message);
    } finally {
      setRecording(undefined);
      setIsLoading(false);
    }
  }

  async function playRecording(sound) {
    try {
      await sound.replayAsync();
    } catch (err) {
      Alert.alert("Error", "Failed to play recording: " + err.message);
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.fill}>
          Recording #{index + 1} | {recordingLine.duration}
        </Text>
        <Button
          onPress={() => playRecording(recordingLine.sound)}
          title="Play"
          disabled={isLoading}
        />
      </View>
    ));
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Audio Recorder",
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <Button
          title={recording ? "Stop Recording" : "Start Recording"}
          onPress={recording ? stopRecording : startRecording}
          disabled={isLoading}
        />
        {getRecordingLines()}
        {recordings.length > 0 && (
          <Button
            title="Clear Recordings"
            onPress={clearRecordings}
            disabled={isLoading}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  fill: {
    flex: 1,
    marginRight: 15,
  },
});
