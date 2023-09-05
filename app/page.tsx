import BlogPosts from './blog/Blog';
import HomeContent from '@/components/HomeContent';
import SearchBar from '@/components/SearchBar';
import LogoTitle from '@/components/ui/Logo';
import { getAllPosts } from '@/utils/supabase-admin';
import { Suspense } from 'react';

export default async function PricingPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen py-2 w-full">
      <LogoTitle />
      <Suspense>
        <SearchBar />
      </Suspense>
      <HomeContent />
      <h1 className="text-white text-center text-3xl my-6">Primabela - Blog</h1>
      <BlogPosts posts={posts} />
    </div>
  );
}
