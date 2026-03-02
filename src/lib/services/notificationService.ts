import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export type NotificationType = 'exchange' | 'message' | 'room' | 'review' | 'system';

export interface Notification {
    id?: string;
    userId: string;
    type: NotificationType;
    title: string;
    text: string;
    isRead: boolean;
    relatedId?: string;
    createdAt: Date | Timestamp;
}

const sortByDate = (items: any[]) =>
    items.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return bTime - aTime;
    });

export const notificationService = {
    async createNotification(
        notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
    ): Promise<string> {
        const docRef = await addDoc(collection(db, 'notifications'), {
            ...notification,
            isRead: false,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    },

    async getUserNotifications(userId: string): Promise<Notification[]> {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            limit(20)
        );

        const snapshot = await getDocs(q);
        const notifs = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() || new Date(),
        })) as Notification[];
        return sortByDate(notifs);
    },

    subscribeToNotifications(
        userId: string,
        callback: (notifications: Notification[]) => void
    ): () => void {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            limit(20)
        );

        return onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
                createdAt: d.data().createdAt?.toDate() || new Date(),
            })) as Notification[];
            callback(sortByDate(notifs));
        }, (error) => {
            console.warn('Notifications subscription error:', error.message);
            callback([]);
        });
    },

    async markAsRead(notificationId: string): Promise<void> {
        await updateDoc(doc(db, 'notifications', notificationId), {
            isRead: true,
        });
    },

    async markAllRead(userId: string): Promise<void> {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            where('isRead', '==', false)
        );

        const snapshot = await getDocs(q);
        const updates = snapshot.docs.map(d =>
            updateDoc(doc(db, 'notifications', d.id), { isRead: true })
        );
        await Promise.all(updates);
    },

    async getUnreadCount(userId: string): Promise<number> {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            where('isRead', '==', false)
        );

        const snapshot = await getDocs(q);
        return snapshot.size;
    },
};
