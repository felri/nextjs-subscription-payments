'use client';

import { Card } from './Card';
import TagsSelector from '@/components/TagsSelector';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import { Database } from '@/types_db';
import React, { useState } from 'react';

interface SectionTagsProps {
  tags: Database['public']['Tables']['seller_services_tags']['Row'][];
}

const SectionTags: React.FC<SectionTagsProps> = ({ tags }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const toggleTag = (tagSlug: string | null) => {
    if (!tagSlug) return;
    setSelectedTags((prevState) => {
      if (prevState.includes(tagSlug)) {
        return prevState.filter((slug) => slug !== tagSlug);
      } else {
        return [...prevState, tagSlug];
      }
    });
  };

  const onSave = async () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <Card
      title="Serviços"
      description="Selecione os serviços que você oferece."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            Marque somente os serviços que você se sente confortável em
            oferecer.
          </p>
          <Button disabled={loading} variant="slim" onClick={onSave}>
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            {loading ? <LoadingDots /> : 'Atualizar Serviços'}
          </Button>
        </div>
      }
    >
      <TagsSelector
        tags={tags}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
      />
    </Card>
  );
};

export default SectionTags;
