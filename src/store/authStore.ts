import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../services/firebase"; // <-- real firebase config

export interface AuthState {
  uid: string | null;
  role: "admin" | "customer" | null;
  loading: boolean;
  init: () => void;
}
/*
export const useAuth = create<AuthState>((set) => ({
  uid: null,
  role: null,
  loading: true,

  init: () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ uid: null, role: null, loading: false });
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      const role = snap.exists() ? snap.data().role : "customer";

      set({
        uid: user.uid,
        role: role,
        loading: false,
      });
    });
  },
}));
*/
export const useAuth = create<AuthState>((set) => ({
  uid: null,
  role: null,
  loading: true,

  init: () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ uid: null, role: null, loading: false });
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const role = snap.exists() ? snap.data().role : "customer";

      set({
        uid: user.uid,
        role,
        loading: false,
      });
    });
  },
}));
