import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Campaign } from "../models/Campaign";
import { db } from "./firebase";


export async function getCampaigns(): Promise<Campaign[]> {
  const q = query(collection(db, "campaigns"), where("isActive", "==", true));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Campaign[];
}
export async function createCampaign(id: string, data: any, bannerUrl: string) {
  await setDoc(doc(db, "campaigns", id), {
    ...data,
    bannerImage: bannerUrl,
    createdAt: new Date(),
  });
}
