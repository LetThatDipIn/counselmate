/**
 * Custom hooks for API calls
 */

import { useState, useEffect } from 'react';
import { profilesAPI, searchAPI, subscriptionAPI } from '@/lib/api';
import type { Profile, ProfileSearchParams, SearchResponse, Subscription, TagsResponse } from '@/lib/api/types';

/**
 * Hook to fetch a profile by ID
 */
export function useProfile(id: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await profilesAPI.getProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return { profile, loading, error };
}

/**
 * Hook to fetch current user's profile
 */
export function useMyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profilesAPI.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
}

/**
 * Hook to search profiles
 */
export function useProfileSearch(params: ProfileSearchParams) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (searchParams: ProfileSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchAPI.search(searchParams);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(params);
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: () => search(params) };
}

/**
 * Hook to fetch subscription details
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionAPI.getSubscription();
      setSubscription(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return { subscription, loading, error, refetch: fetchSubscription };
}

/**
 * Hook to fetch available tags
 */
export function useTags() {
  const [tags, setTags] = useState<TagsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchAPI.getTags();
        setTags(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}
