import { Database } from '@/types_db';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPosts({
  posts
}: {
  posts: Database['public']['Tables']['posts']['Row'][];
}) {
  return (
    <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 underline max-w-xl mx-auto">
      {posts.map((post) => (
        <Link
          key={post.id} // Added key for best practice
          className="flex flex-col items-center justify-center mt-4"
          href={`/blog/${post.slug}`}
        >
          <Image
            src={`/${post.image_url}`}
            alt="Media"
            width="0"
            height="0"
            sizes="100vw"
            className="rounded overflow-hidden object-cover border border-pink-400"
            style={{ width: '150px', height: '150px' }}
          />
          <p className="text-center max-w-[160px]">{post.title}</p>
        </Link>
      ))}
    </div>
  );
}
