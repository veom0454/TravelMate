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

export interface RoomListing {
  id?: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  userTrustScore: number;
  area: string;
  rent: number;
  type: 'Single Room' | 'Double Room' | 'Studio' | 'Shared Room';
  gender: 'Any' | 'Male Only' | 'Female Only';
  foodPreference?: string;
  moveIn: string;
  tags: string[];
  description?: string;
  status: 'active' | 'rented' | 'cancelled';
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  images?: string[];
}

const sortByDate = (items: any[]) =>
  items.sort((a, b) => {
    const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return bTime - aTime;
  });

export const roomService = {
  async createListing(listing: Omit<RoomListing, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'rooms'), {
      ...listing,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getActiveListings(filters?: {
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
  }): Promise<RoomListing[]> {
    const q = query(
      collection(db, 'rooms'),
      where('status', '==', 'active'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    let listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as RoomListing[];

    if (filters) {
      if (filters.area && filters.area !== 'All Areas') {
        listings = listings.filter(r => r.area === filters.area);
      }
      if (filters.minPrice) {
        listings = listings.filter(r => r.rent >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        listings = listings.filter(r => r.rent <= filters.maxPrice!);
      }
      if (filters.gender && filters.gender !== 'All') {
        listings = listings.filter(r =>
          r.gender === filters.gender || r.gender === 'Any'
        );
      }
    }

    return sortByDate(listings);
  },

  subscribeToListings(
    callback: (listings: RoomListing[]) => void,
    filters?: {
      area?: string;
      minPrice?: number;
      maxPrice?: number;
      gender?: string;
    }
  ): () => void {
    const q = query(
      collection(db, 'rooms'),
      where('status', '==', 'active'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      let listings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as RoomListing[];

      if (filters) {
        if (filters.area && filters.area !== 'All Areas') {
          listings = listings.filter(r => r.area === filters.area);
        }
        if (filters.minPrice) {
          listings = listings.filter(r => r.rent >= filters.minPrice!);
        }
        if (filters.maxPrice) {
          listings = listings.filter(r => r.rent <= filters.maxPrice!);
        }
        if (filters.gender && filters.gender !== 'All') {
          listings = listings.filter(r =>
            r.gender === filters.gender || r.gender === 'Any'
          );
        }
      }

      callback(sortByDate(listings));
    }, (error) => {
      console.warn('Rooms subscription error:', error.message);
      callback([]);
    });
  },

  async updateListingStatus(listingId: string, status: RoomListing['status']): Promise<void> {
    await updateDoc(doc(db, 'rooms', listingId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteListing(listingId: string): Promise<void> {
    await deleteDoc(doc(db, 'rooms', listingId));
  },
};
