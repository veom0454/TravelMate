import { useState, useEffect, useCallback } from 'react';

interface LiveRateResult {
    rate: number;
    loading: boolean;
    lastUpdated: Date | null;
    error: string | null;
    refresh: () => void;
}

let cachedRate: number | null = null;
let cachedTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;
const FALLBACK_RATE = 104.5;

export function useLiveRate(): LiveRateResult {
    const [rate, setRate] = useState<number>(cachedRate || FALLBACK_RATE);
    const [loading, setLoading] = useState(!cachedRate);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(
        cachedTimestamp ? new Date(cachedTimestamp) : null
    );
    const [error, setError] = useState<string | null>(null);

    const fetchRate = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && cachedRate && (now - cachedTimestamp) < CACHE_DURATION) {
            setRate(cachedRate);
            setLastUpdated(new Date(cachedTimestamp));
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://open.er-api.com/v6/latest/GBP');
            if (!response.ok) throw new Error('Rate API unavailable');

            const data = await response.json();
            if (data.result === 'success' && data.rates?.INR) {
                const inrRate = data.rates.INR;
                cachedRate = inrRate;
                cachedTimestamp = now;
                setRate(inrRate);
                setLastUpdated(new Date(now));
            } else {
                throw new Error('Invalid rate data');
            }
        } catch (err: any) {
            console.warn('Rate fetch failed, using fallback:', err.message);
            setError(err.message);
            if (!cachedRate) {
                setRate(FALLBACK_RATE);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRate();

        const interval = setInterval(() => fetchRate(), CACHE_DURATION);
        return () => clearInterval(interval);
    }, [fetchRate]);

    return { rate, loading, lastUpdated, error, refresh: () => fetchRate(true) };
}
