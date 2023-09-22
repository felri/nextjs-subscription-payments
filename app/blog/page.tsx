import { getAllPosts } from '@/utils/supabase-admin';
import BlogPosts from './Blog';

export default async function HomeContent() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white text-center text-3xl my-6">Primabela - Blog</h1>
      <BlogPosts posts={posts} />
    </div>
  );
}
