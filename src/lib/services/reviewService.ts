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

export interface Review {
    id?: string;
    targetUserId: string;
    reviewerUserId: string;
    reviewerName: string;
    reviewerAvatar?: string;
    rating: number;
    text: string;
    createdAt: Date | Timestamp;
}

const sortByDate = (items: any[]) =>
    items.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return bTime - aTime;
    });

export const reviewService = {
    async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
        const docRef = await addDoc(collection(db, 'reviews'), {
            ...review,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    },

    async getReviewsForUser(userId: string): Promise<Review[]> {
        const q = query(
            collection(db, 'reviews'),
            where('targetUserId', '==', userId),
            limit(50)
        );

        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Review[];
        return sortByDate(reviews);
    },

    subscribeToReviews(
        userId: string,
        callback: (reviews: Review[]) => void
    ): () => void {
        const q = query(
            collection(db, 'reviews'),
            where('targetUserId', '==', userId),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            const reviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Review[];
            callback(sortByDate(reviews));
        }, (error) => {
            console.warn('Reviews subscription error:', error.message);
            callback([]);
        });
    },

    async getAverageRating(userId: string): Promise<{ average: number; count: number }> {
        const reviews = await this.getReviewsForUser(userId);
        if (reviews.length === 0) return { average: 0, count: 0 };
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return { average: total / reviews.length, count: reviews.length };
    },
};
