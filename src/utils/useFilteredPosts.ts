import { useMemo } from 'react';
import type Post from '../interfaces/Post.ts';
import type UserData from '../interfaces/UserData.ts';

type UseFilteredPostsParams = {
  posts: Post[] | undefined; // changed: allow undefined
  searchTerm: string;
  typeFilter: string;
  sortOption: string;
  userData: UserData | null;
};

export function useFilteredPosts({
  posts,
  searchTerm,
  typeFilter,
  sortOption,
  userData
}: UseFilteredPostsParams): Post[] {
  return useMemo(() => {
    // Ensure posts is a valid array
    const validPosts = Array.isArray(posts) ? posts : [];
    let filtered = validPosts;

    // Normalize post.data into an object
    const getPostData = (post: Post) => {
      if (typeof post.data === 'string') {
        try {
          return JSON.parse(post.data);
        } catch {
          return {};
        }
      }
      return post.data ?? {};
    };

    // Filter by search term in title or blurb
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => {
        const data = getPostData(post);
        const title = (data.title ?? '').toLowerCase();
        const blurb = (data.blurb ?? '').toLowerCase();
        return title.includes(term) || blurb.includes(term);
      });
    }

    // Filter by type (if selected)
    if (typeFilter) {
      filtered = filtered.filter(post => post.type === typeFilter);
    }

    // Filter by "own posts" if selected
    if (sortOption === 'own' && userData) {
      filtered = filtered
        .filter(post => post.authorId === userData.id)
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()); // newest first
    }

    // Sort by created date
    if (sortOption === 'newest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    } else if (sortOption === 'oldest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
    }

    return filtered;
  }, [posts, searchTerm, typeFilter, sortOption, userData]);
}