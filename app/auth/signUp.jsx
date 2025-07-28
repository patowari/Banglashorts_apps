import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { UserDetailContext } from "./../../Context/UserDetailContext";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const SaveUser = async (user) => {
    try {
      const data = {
        name: fullName,
        email: email,
        member: false,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.uid), data);
      setUserDetail(data);
      console.log("User saved successfully");
    } catch (error) {
      console.error("Detailed error saving user:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  const createNewAccount = async () => {
    if (!auth) {
      Alert.alert(
        "Error",
        "Authentication service is not ready. Please try again."
      );
      return;
    }

    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      await SaveUser(user);

      Alert.alert("Success", "Account created! Please verify your email.", [
        { text: "OK", onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch (error) {
      let errorMessage = "Sign up failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/bs-logo.jpg")}
        style={styles.image}
      />

      <Text style={styles.title}>Create New Account</Text>

      <TextInput
        placeholder="Full Name"
        onChangeText={setFullName}
        value={fullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        onPress={createNewAccount}
        style={styles.signupButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text style={styles.signupText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signinLink}
        onPress={() => router.push("/auth/signIn")}
      >
        <Text style={styles.signinText}>
          Already have an account?{" "}
          <Text style={{ fontWeight: "bold", color: Colors.PRIMARY }}>
            Sign In
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    paddingTop: 80,
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontFamily: "poppins-bold",
    marginBottom: 10,
    color: Colors.BLACK,
  },
  input: {
    width: "85%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  signupButton: {
    backgroundColor: Colors.PRIMARY,
    width: "85%",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  signupText: {
    textAlign: "center",
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  signinLink: {
    marginTop: 20,
  },
  signinText: {
    fontSize: 14,
    color: "#555",
  },
});
