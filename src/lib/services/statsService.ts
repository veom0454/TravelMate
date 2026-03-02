import {
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface PlatformStats {
    totalExchanges: number;
    activeListings: number;
    totalUsers: number;
}

let cachedStats: PlatformStats | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const safeCount = async (q: any): Promise<number> => {
    try {
        const snap = await getDocs(q);
        return snap.size;
    } catch {
        return 0;
    }
};

export const statsService = {
    async getPlatformStats(): Promise<PlatformStats> {
        const now = Date.now();
        if (cachedStats && (now - cacheTimestamp) < CACHE_DURATION) {
            return cachedStats;
        }

        const [totalExchanges, activeListings, totalUsers] = await Promise.all([
            safeCount(collection(db, 'exchanges')),
            safeCount(query(collection(db, 'rooms'), where('status', '==', 'active'))),
            safeCount(collection(db, 'users')),
        ]);

        cachedStats = { totalExchanges, activeListings, totalUsers };
        cacheTimestamp = now;
        return cachedStats;
    },
};
