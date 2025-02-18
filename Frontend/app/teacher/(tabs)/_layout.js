import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const CustomTabButton = ({ label, icon, isFocused, onPress, t }) => {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
        <Text
          style={[
            styles.tabLabel,
            { color: isFocused ? colors.darkBlue : colors.gray },
          ]}
        >
          {t(label)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = (routeName, color, size) => {
          switch (routeName) {
            case "home":
              return <FontAwesome name="home" size={size + 4} color={color} />;
            case "profile":
              return <FontAwesome name="user" size={size} color={color} />;
            default:
              return null;
          }
        };

        return (
          <CustomTabButton
            key={route.key}
            label={options.title || route.name}
            icon={getIcon(
              route.name,
              isFocused ? colors.darkBlue : colors.gray,
              24
            )}
            isFocused={isFocused}
            onPress={onPress}
            t={t}
          />
        );
      })}
    </View>
  );
};

const colors = {
  lightBlue: "white",
  darkBlue: "#1E40AF",
  gray: "#94A3B8",
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.lightBlue,
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: -4,
  },
});

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
