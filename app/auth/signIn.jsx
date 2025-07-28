import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constant/Colors";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { auth } from "./../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { UserDetailContext } from './../../Context/UserDetailContext' ;

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const {userDetail, setUserDetail}=useContext(UserDetailContext)
  const [loading, setLoading]=useState(false);
  const onSignInClick = () => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        await getUserDetail;
        setLoading(false);
        router.replace('/(tabs)/home')
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        ToastAndroid.show("Incorrect Email and Password", ToastAndroid.BOTTOM);
      });
  };

  const getUserDetail = async () => {
    const result = await getDoc(doc(db, "users", email));
    console.log(result.data());
    setUserDetail(result.data())
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/bs-logo.jpg")}
        style={styles.image}
      />

      <Text style={styles.title}>Sign In to Your Account</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signupButton} onPress={onSignInClick} disabled={loading}>
        {!loading? <Text style={styles.signupText}>Sign In</Text>: <ActivityIndicator size = {'large'} color= {Colors.WHITE}/>}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signinLink}
        onPress={() => router.push("/auth/signUp")}
      >
        <Text style={styles.signinText}>
          Don’t have an account?{" "}
          <Text style={{ fontWeight: "bold", color: Colors.PRIMARY }}>
            Sign Up
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
    fontSize: 20,
    fontFamily: "poppins-bold",
    marginTop: 30,
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
