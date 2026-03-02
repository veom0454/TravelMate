import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  Timestamp,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ExchangeOffer {
  id?: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  userTrustScore: number;
  type: 'buy' | 'sell';
  amount: number;
  rate: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  completedTrades?: number;
}

const sortByDate = (items: any[]) =>
  items.sort((a, b) => {
    const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return bTime - aTime;
  });

export const exchangeService = {
  async createOffer(offer: Omit<ExchangeOffer, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'exchanges'), {
      ...offer,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getActiveOffers(filter?: { type?: 'buy' | 'sell' }): Promise<ExchangeOffer[]> {
    let q;
    if (filter?.type) {
      q = query(
        collection(db, 'exchanges'),
        where('status', '==', 'active'),
        where('type', '==', filter.type),
        limit(50)
      );
    } else {
      q = query(
        collection(db, 'exchanges'),
        where('status', '==', 'active'),
        limit(50)
      );
    }

    const snapshot = await getDocs(q);
    const offers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as ExchangeOffer[];
    return sortByDate(offers);
  },

  subscribeToOffers(
    callback: (offers: ExchangeOffer[]) => void,
    filter?: { type?: 'buy' | 'sell' }
  ): () => void {
    let q;
    if (filter?.type) {
      q = query(
        collection(db, 'exchanges'),
        where('status', '==', 'active'),
        where('type', '==', filter.type),
        limit(50)
      );
    } else {
      q = query(
        collection(db, 'exchanges'),
        where('status', '==', 'active'),
        limit(50)
      );
    }

    return onSnapshot(q, (snapshot) => {
      const offers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as ExchangeOffer[];
      callback(sortByDate(offers));
    }, (error) => {
      console.warn('Exchanges subscription error:', error.message);
      callback([]);
    });
  },

  async updateOfferStatus(offerId: string, status: ExchangeOffer['status']): Promise<void> {
    await updateDoc(doc(db, 'exchanges', offerId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteOffer(offerId: string): Promise<void> {
    await deleteDoc(doc(db, 'exchanges', offerId));
  },
};
