import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../constant/Colors";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [activeSection, setActiveSection] = React.useState("সর্বশেষ");
  const [apiNews, setApiNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const sections = [
    { id: "সর্বশেষ", title: "সর্বশেষ" },
    { id: "জাতীয়", title: "জাতীয়" },
    { id: "আন্তর্জাতিক", title: "আন্তর্জাতিক" },
    { id: "খেলা", title: "খেলা" },
    { id: "রাজনীতি", title: "রাজনীতি" },
    { id: "বিনোদন", title: "বিনোদন" },
    { id: "অর্থনীতি", title: "অর্থনীতি" },
  ];

  // Fetch API data
  React.useEffect(() => {
    fetch("https://banglashorts.xri.com.bd/articles")
      .then((res) => res.json())
      .then((data) => {
        setApiNews(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Map API categories to your section ids (Bangla)
  const categoryMap = {
    Entertainment: "বিনোদন",
    Sports: "খেলা",
    National: "জাতীয়",
    International: "আন্তর্জাতিক",
    Politics: "রাজনীতি",
    Economy: "অর্থনীতি",
  };

  // Filter API news by active section
  const filteredApiNews = apiNews.filter(
    (item) =>
      activeSection === "সর্বশেষ" ||
      categoryMap[item.category] === activeSection
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../assets/images/bs-logo.jpg")}
          style={styles.logo}
        />
      </View>
      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionContainer}
        contentContainerStyle={styles.sectionContent}
      >
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            onPress={() => setActiveSection(section.id)}
            style={[
              styles.sectionButton,
              activeSection === section.id && styles.activeSectionButton,
            ]}
          >
            <Text
              style={[
                styles.sectionText,
                activeSection === section.id && styles.activeSectionText,
              ]}
            >
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 30 }}>Loading...</Text>
        ) : filteredApiNews.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 30 }}>No news found.</Text>
        ) : (
          filteredApiNews.map((card, idx) => (
            <View key={card.url || idx} style={styles.card}>
              <Image
                source={{ uri: card.images && card.images[0] }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardCaption}>{card.title}</Text>
                <Text style={styles.cardDetails} numberOfLines={5}>
                  {card.content}
                </Text>
              </View>
              <TouchableOpacity onPress={() => card.url && Linking.openURL(card.url)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.viewbuttonText}>View full article</Text>
                  <Icon
                    name="arrow-right"
                    size={15}
                    color={Colors.PRIMARY}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 12,
  },
  logoWrapper: {
    paddingBottom: 2,
    backgroundColor: Colors.WHITE,
  },
  sectionContainer: {
    backgroundColor: Colors.WHITE,

    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  sectionContent: {
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: 5,
  },
  sectionButton: {
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },
  activeSectionButton: {
    backgroundColor: Colors.PRIMARY,
  },
  sectionText: {
    fontSize: 15,
    fontFamily: "poppins-medium",
    lineHeight: 35,
    marginBottom: 5,
    color: Colors.DARK_GRAY,
  },
  activeSectionText: {
    color: Colors.WHITE,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: width * 0.6,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  cardCaption: {
    fontSize: 14,
    fontFamily: "poppins-semibold",
    color: Colors.PRIMARY,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  cardDetails: {
    fontSize: 15,
    fontFamily: "poppins",
    color: Colors.DARK_GRAY,
    lineHeight: 22,
  },
  viewbuttonText: {
    textAlign: "left",
    paddingHorizontal: 15,
    paddingVertical: 2,
    fontSize: 15,
    color: Colors.PRIMARY,
    fontFamily: "poppins-semibold",
  },
});
