import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { UserDetailContext } from "@/Context/UserDetailContext";
import { auth, db } from "../config/firebaseConfig";
import Colors from "../constant/Colors";

export default function Index() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const result = await getDoc(doc(db, "users", user.email));
          setUserDetail(result.data());
          router.replace("/(tabs)/home");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.WHITE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("./../assets/images/bs-landing01.png")}
        style={styles.logo}
      />

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Bangla Shorts app brings you the latest news
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signIn")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.WHITE }]}
          onPress={() => router.push("/auth/signUp")}
        >
          <Text style={[styles.buttonText, { color: Colors.BLACK }]}>
            Don't have any Account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
  },
  logo: {
    width: "40%",
    height: "20%",
    alignSelf: "center",
    marginTop: "30%",
  },
  bottomSheet: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    height: "100%",
    marginTop: "20%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    fontFamily: "poppins-semibold",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: "5%",
    fontFamily: "poppins",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    marginTop: 30,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    color: Colors.WHITE,
    fontFamily: "poppins-semibold",
  },
});
