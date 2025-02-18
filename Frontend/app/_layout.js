import React, { useEffect } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./context/authContext";
import "../global.css";
import { AuthProvider } from "./context/authContext";
import Header from "./teacher/header";
import ParentHeader from "./parent/parentHeader";

function ProtectedLayout() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // protected routes
    const protectedRoutes = [
      "teacher/(tabs)/home",
      "teacher/(tabs)/profile",
      "teacher/(tabs)/audio-recorder",
      "parent/(tabs)/home",
      "parent/(tabs)/profile",
    ];

    // authentication routes
    const authRoutes = [
      "/(auth)/login",
      "/(auth)/registerTeacher",
      "/(auth)/registerParent",
      "index",
      "/role",
    ];

    // If still loading, do nothing
    if (loading) return;

    // Check if current route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Check if current route is an auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect logic
    if (isProtectedRoute && !user) {
      router.replace("index");
    } else if (isAuthRoute && user && role === "teacher") {
      router.replace("/teacher/(tabs)/home");
    } else if (isAuthRoute && user && role === "parent") {
      router.replace("/parent/(tabs)/home");
    }
  }, [user, loading, pathname, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="teacher/(tabs)"
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="parent/(tabs)"
        options={{
          headerShown: true,
          header: () => <ParentHeader />,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <ProtectedLayout />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
