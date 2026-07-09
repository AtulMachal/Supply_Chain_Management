import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";

// Example demo data for the Supply Chain dashboard
const sampleInventory = [
  { itemName: "Steel Pipes", quantity: 500, unit: "kg", site: "Site A" },
  { itemName: "Cement Bags", quantity: 1200, unit: "bags", site: "Site B" },
  { itemName: "Copper Wiring", quantity: 300, unit: "meters", site: "Site A" }
];

export const seedDemoData = async () => {
  try {
    const inventoryRef = collection(db, "inventory");
    
    for (const item of sampleInventory) {
      const docRef = await addDoc(inventoryRef, item);
      console.log("Document written with ID: ", docRef.id);
    }
    
    console.log("Demo data successfully seeded!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
