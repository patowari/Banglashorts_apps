import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { UserDetailContext } from "./../Context/UserDetailContext";
import { useState } from "react";
import React from "react";

export default function RootLayout() {
  useFonts({
    "poppins-black": require("./../assets/fonts/Poppins-Black.ttf"),
    "poppins-bold": require("./../assets/fonts/Poppins-Bold.ttf"),
    "poppins-semibold": require("./../assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-Light": require("./../assets/fonts/Poppins-Light.ttf"),
  });

  const [userDetail, setUserDetail] = useState();
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
    </UserDetailContext.Provider>
  );
}
