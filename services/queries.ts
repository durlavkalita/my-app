import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const getTasks = async () => {
  let queriedData: Task[] = [];
  const q = query(collection(db, "tasks"));
  const querySnapshot = await getDocs(q);

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const task: Task = {
        ...(doc.data() as Task),
        id: doc.id,
      };
      queriedData.push(task);
    })
  );
  return queriedData;
};

export const postTask = async (
  task: Omit<Task, "id">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const updateTaskCompletion = async (
  taskId: string,
  completed: boolean
) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { completed });
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
};

export const getFinances = async () => {
  let queriedData: Finance[] = [];
  const q = query(collection(db, "finances"));
  const querySnapshot = await getDocs(q);

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const finance: Finance = {
        ...(doc.data() as Finance),
        id: doc.id,
      };
      queriedData.push(finance);
    })
  );
  return queriedData;
};

export const postFinance = async (
  finance: Omit<Finance, "id">
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, "finances"), finance);
    return docRef.id;
  } catch (error) {
    console.error("Error adding finance data:", error);
    return null;
  }
};

export const deleteFinance = async (financeId: string) => {
  const financeRef = doc(db, "finances", financeId);
  await deleteDoc(financeRef);
};
