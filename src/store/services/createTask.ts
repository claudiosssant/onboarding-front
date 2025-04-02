import { TaskEntity } from '@/common/entities/task';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  Firestore,
  getDoc,
  getFirestore,
  setDoc
} from 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";
import firebaseApp from '@/config/firebase';

const tableName = 'tasks';
const db = getFirestore(firebaseApp);
const taskConverter = {
  toFirestore: (task: TaskEntity) => {
    return {
      name: task.name,
      description: task.description,
      status: task.status,
      createdAt: Timestamp.fromDate(task.createdAt),
      updatedAt: Timestamp.fromDate(task.updatedAt)
    };
  },
  fromFirestore: (snapshot: any, options: any): TaskEntity => {
    const data = snapshot.data(options);
    return {
      uid: snapshot.id,
      name: data.name,
      description: data.description,
      status: data.status,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    };
  }
};

const tasksRef = collection(db, 'tasks').withConverter(taskConverter);

export const addTask = async (data: Omit<TaskEntity, "uid">) => {
  const taskId = uuidv4();
  try {
    const taskRef = doc(collection(db, tableName), taskId);
    await setDoc(taskRef, {
      ...data,
      uid: taskId,
      id: taskId
    });
    return { id: taskId, error: null };
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const TaskService = {
  
  
  async getTaskById(taskId: string): Promise<TaskEntity | null> {
    const taskDoc = doc(db, 'tasks', taskId).withConverter(taskConverter);
    const docSnapshot = await getDoc(taskDoc);
    return docSnapshot.exists() ? docSnapshot.data() : null;
  }
};

export const getAllTasks = async ()=> {
  const q = query(collection(db, tableName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id
  }));
};

export const deleteTask = async (taskId: string) => {
  const taskDoc = doc(db, 'tasks', taskId);
  await deleteDoc(taskDoc);
};