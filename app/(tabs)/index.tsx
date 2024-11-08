import { StyleSheet, TouchableOpacity } from "react-native";
import Parse from "@/services/Parse";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  const testParse = async () => {
    try {
      // Create a test object
      const TestObject = Parse.Object.extend("TestObject");
      const testObject = new TestObject();
      testObject.set("message", "Hello from ChoirSync!");

      // Save it
      const savedObject = await testObject.save();
      console.log("✅ Parse Test Successful!");
      console.log("Created object with id:", savedObject.id);
      console.log("Message:", savedObject.get("message"));

      // Clean up by deleting the test object
      await savedObject.destroy();
      console.log("🧹 Test object cleaned up");
    } catch (error) {
      console.error("❌ Parse Test Failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomePage</Text>
      <TouchableOpacity style={styles.button} onPress={testParse}>
        <Text style={styles.buttonText}>Test Parse Connection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#313234",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
