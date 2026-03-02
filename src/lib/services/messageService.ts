import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  limit,
  Timestamp,
  onSnapshot,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date | Timestamp;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date | Timestamp;
  unreadCount?: { [userId: string]: number };
}

const sortAsc = (items: any[]) =>
  items.sort((a, b) => {
    const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return aTime - bTime;
  });

const sortDesc = (items: any[]) =>
  items.sort((a, b) => {
    const aTime = a.lastMessageAt instanceof Date ? a.lastMessageAt.getTime() : 0;
    const bTime = b.lastMessageAt instanceof Date ? b.lastMessageAt.getTime() : 0;
    return bTime - aTime;
  });

export const messageService = {
  async getConversationId(userId1: string, userId2: string): Promise<string> {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId1)
    );

    const snapshot = await getDocs(q);
    const existing = snapshot.docs.find(doc => {
      const data = doc.data();
      return data.participants.includes(userId2) && data.participants.length === 2;
    });

    if (existing) {
      return existing.id;
    }

    const newConv = await addDoc(conversationsRef, {
      participants: [userId1, userId2],
      createdAt: serverTimestamp(),
      unreadCount: { [userId1]: 0, [userId2]: 0 },
    });

    return newConv.id;
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    receiverId: string,
    text: string
  ): Promise<string> {
    const messageRef = await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId,
      receiverId,
      text,
      status: 'sent',
      createdAt: serverTimestamp(),
    });

    const convDoc = await getDoc(doc(db, 'conversations', conversationId));
    const currentUnread = convDoc.data()?.unreadCount?.[receiverId] || 0;

    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      [`unreadCount.${receiverId}`]: currentUnread + 1,
    });

    return messageRef.id;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Message[];
    return sortAsc(messages);
  },

  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];
      callback(sortAsc(messages));
    }, (error) => {
      console.warn('Messages subscription error:', error.message);
      callback([]);
    });
  },

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastMessageAt: doc.data().lastMessageAt?.toDate(),
    })) as Conversation[];

    return sortDesc(conversations);
  },

  subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageAt: doc.data().lastMessageAt?.toDate(),
      })) as Conversation[];

      callback(sortDesc(conversations));
    }, (error) => {
      console.warn('Conversations subscription error:', error.message);
      callback([]);
    });
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await updateDoc(doc(db, 'conversations', conversationId), {
      [`unreadCount.${userId}`]: 0,
    });

    try {
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('receiverId', '==', userId),
        limit(50)
      );

      const snapshot = await getDocs(messagesQuery);
      const unread = snapshot.docs.filter(d => d.data().status !== 'read');
      const updates = unread.map(d =>
        updateDoc(d.ref, { status: 'read' })
      );
      await Promise.all(updates);
    } catch (error) {
      console.warn('Mark as read error:', error);
    }
  },
};
