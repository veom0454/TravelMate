import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { reviewService } from './reviewService';

export interface TrustBreakdown {
    profileCompleteness: number;
    emailVerified: number;
    completedExchanges: number;
    reviewScore: number;
    accountAge: number;
    total: number;
}

const WEIGHTS = {
    profileCompleteness: 20,
    emailVerified: 15,
    completedExchanges: 25,
    reviewScore: 25,
    accountAge: 15,
};

export const trustScoreService = {
    async calculateTrustScore(userId: string): Promise<TrustBreakdown> {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            return { profileCompleteness: 0, emailVerified: 0, completedExchanges: 0, reviewScore: 0, accountAge: 0, total: 0 };
        }

        const data = userDoc.data();

        const hasName = data.displayName ? 1 : 0;
        const hasBio = data.bio ? 1 : 0;
        const hasUniversity = data.university ? 1 : 0;
        const hasPhoto = data.photoURL ? 1 : 0;
        const profileCompleteness = Math.round(((hasName + hasBio + hasUniversity + hasPhoto) / 4) * WEIGHTS.profileCompleteness);

        const emailVerified = data.isVerified ? WEIGHTS.emailVerified : Math.round(WEIGHTS.emailVerified * 0.3);

        const exchanges = data.completedExchanges || 0;
        const exchangeScore = Math.min(exchanges / 10, 1);
        const completedExchanges = Math.round(exchangeScore * WEIGHTS.completedExchanges);

        const { average, count } = await reviewService.getAverageRating(userId);
        const reviewFactor = count > 0 ? (average / 5) * Math.min(count / 5, 1) : 0;
        const reviewScore = Math.round(reviewFactor * WEIGHTS.reviewScore);

        const createdAt = data.createdAt?.toDate?.() || new Date();
        const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        const ageFactor = Math.min(daysSinceCreation / 180, 1);
        const accountAge = Math.round(ageFactor * WEIGHTS.accountAge);

        const total = Math.min(profileCompleteness + emailVerified + completedExchanges + reviewScore + accountAge, 100);

        return { profileCompleteness, emailVerified, completedExchanges, reviewScore, accountAge, total };
    },

    async updateUserTrustScore(userId: string): Promise<number> {
        const breakdown = await this.calculateTrustScore(userId);
        await updateDoc(doc(db, 'users', userId), {
            trustScore: breakdown.total,
        });
        return breakdown.total;
    },
};
