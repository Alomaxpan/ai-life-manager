import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, EnergyLog, Habit, HabitLog, UserProfile } from "@/types";

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, "tasks"), {
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<void> {
  await updateDoc(doc(db, "tasks", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, "tasks", id));
}

// ─── Energy Logs ──────────────────────────────────────────────────────────────

export async function getEnergyLogs(userId: string, days = 7): Promise<EnergyLog[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const q = query(
    collection(db, "energyLogs"),
    where("userId", "==", userId),
    where("date", ">=", since.toISOString().split("T")[0]),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EnergyLog));
}

export async function logEnergy(
  log: Omit<EnergyLog, "id" | "createdAt">
): Promise<void> {
  // Upsert: one entry per user/date/period
  const q = query(
    collection(db, "energyLogs"),
    where("userId", "==", log.userId),
    where("date", "==", log.date),
    where("period", "==", log.period)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, { level: log.level });
  } else {
    await addDoc(collection(db, "energyLogs"), {
      ...log,
      createdAt: new Date().toISOString(),
    });
  }
}

// ─── Habits ───────────────────────────────────────────────────────────────────

export async function getHabits(userId: string): Promise<Habit[]> {
  const q = query(
    collection(db, "habits"),
    where("userId", "==", userId),
    where("active", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Habit));
}

export async function createHabit(habit: Omit<Habit, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "habits"), {
    ...habit,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getHabitLogs(userId: string, days = 7): Promise<HabitLog[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const q = query(
    collection(db, "habitLogs"),
    where("userId", "==", userId),
    where("date", ">=", since.toISOString().split("T")[0])
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HabitLog));
}

export async function logHabit(
  log: Omit<HabitLog, "id" | "createdAt">
): Promise<void> {
  const q = query(
    collection(db, "habitLogs"),
    where("userId", "==", log.userId),
    where("habitId", "==", log.habitId),
    where("date", "==", log.date)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, { done: log.done });
  } else {
    await addDoc(collection(db, "habitLogs"), {
      ...log,
      createdAt: new Date().toISOString(),
    });
  }
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function createOrUpdateUserProfile(
  profile: Partial<UserProfile> & { uid: string }
): Promise<void> {
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
}

export async function updateStreak(uid: string): Promise<number> {
  const profile = await getUserProfile(uid);
  if (!profile) return 1;

  const today = new Date().toISOString().split("T")[0];
  const last = profile.lastActiveDate;

  if (last === today) return profile.streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = last === yesterdayStr ? profile.streak + 1 : 1;

  await updateDoc(doc(db, "users", uid), {
    streak: newStreak,
    lastActiveDate: today,
  });

  return newStreak;
}
