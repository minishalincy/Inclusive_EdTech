import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const Header = ({ navigation, iconName }) => {
  return (
    <View
      className="flex-row items-center bg-blue-500 px-4"
      style={{ height: 54 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
        <Icon name="keyboard-backspace" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 flex-row items-center justify-center">
        <Icon name={iconName} size={24} color="white" className="mr-2" />
        <Text className="font-bold text-2xl text-white">Classroom</Text>
      </View>
      <View className="w-10" />
    </View>
  );
};

const ClassroomLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="announcement"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="student"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="marks"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="assignment"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="remark"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="attendance"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="timetable"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="class" />
          ),
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
};

export default ClassroomLayout;
