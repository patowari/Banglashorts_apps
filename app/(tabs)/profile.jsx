import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { UserDetailContext } from "../../Context/UserDetailContext";
import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(true);

  // Fetch user data if not in context
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser && !userDetail) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserDetail(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserDetail(null);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/images/default-user.png")}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userDetail?.name || "User"}</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email || ""}</Text>

        {auth.currentUser?.emailVerified ? (
          <Text style={styles.verifiedText}>✓ Email Verified</Text>
        ) : (
          <Text style={styles.unverifiedText}>⚠ Email Not Verified</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY,
  },
  userName: {
    fontSize: 22,
    fontFamily: "poppins-semibold",
    color: Colors.BLACK,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: "poppins",
    color: Colors.GRAY,
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
  },
  logoutText: {
    color: Colors.WHITE,
    fontFamily: "poppins-semibold",
    fontSize: 15,
  },
  verifiedText: {
    color: "green",
    marginTop: 8,
    fontFamily: "poppins",
  },
  unverifiedText: {
    color: "orange",
    marginTop: 8,
    fontFamily: "poppins",
  },
});
