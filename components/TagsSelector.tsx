'use client';

import { Database } from '@/types_db';
import React, { useState } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

interface TagsSelectorProps {
  tags: Database['public']['Tables']['seller_services_tags']['Row'][];
  selectedTags: string[];
  toggleTag?: (tagSlug: string | null) => void;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({
  tags,
  selectedTags,
  toggleTag
}) => {
  return (
    <div className="flex flex-wrap text-gray-800 mt-4 mx-auto items-center justify-center">
      {tags.map((tag) => (
        <button
          key={tag.slug}
          onClick={() => toggleTag && toggleTag(tag.slug)}
          className={`m-1 px-4 py-2 rounded bg-gray-200 focus:outline-none ${
            tag.slug && selectedTags.includes(tag.slug)
              ? 'bg-gray-800 text-white'
              : ''
          }`}
        >
          {tag.slug && selectedTags.includes(tag.slug) ? (
            <AiOutlineCheckCircle className="inline-block mr-2 text-green-500" />
          ) : (
            <AiOutlineCloseCircle className="inline-block mr-2 text-red-500" />
          )}
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagsSelector;
