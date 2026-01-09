'use client';

import React from 'react';

// Composant Skeleton de base
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-slate-200 dark:bg-slate-700';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Skeleton pour une carte d'article (petite)
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Image placeholder */}
      <Skeleton className="w-full h-48" />
      
      {/* Content */}
      <div className="p-6">
        {/* Category badge */}
        <Skeleton className="w-20 h-5 mb-3" />
        
        {/* Title */}
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-4" />
        
        {/* Excerpt */}
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-5/6 h-4 mb-4" />
        
        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton className="w-24 h-4" />
          </div>
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pour une carte d'article (grande/featured)
export function ArticleCardLargeSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="md:flex">
        {/* Image placeholder */}
        <Skeleton className="md:w-2/3 h-64 md:h-96" />
        
        {/* Content */}
        <div className="md:w-1/3 p-8 flex flex-col justify-center">
          {/* Category badge */}
          <Skeleton className="w-24 h-6 mb-4" />
          
          {/* Title */}
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-2/3 h-8 mb-6" />
          
          {/* Excerpt */}
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-4/5 h-4 mb-6" />
          
          {/* Meta */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="w-10 h-10" />
            <div>
              <Skeleton className="w-32 h-4 mb-2" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton pour la sidebar (articles populaires)
export function PopularArticleSkeleton() {
  return (
    <div className="flex items-start gap-4 py-4">
      <Skeleton className="w-20 h-20 flex-shrink-0" />
      <div className="flex-grow">
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
  );
}

// Skeleton pour une catégorie
export function CategorySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg">
      <Skeleton className="w-full h-32" />
      <div className="p-4">
        <Skeleton className="w-3/4 h-5 mb-2" />
        <Skeleton className="w-full h-3 mb-1" />
        <Skeleton className="w-5/6 h-3" />
      </div>
    </div>
  );
}

// Skeleton pour la page d'accueil complète
export function HomePageSkeleton() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero section */}
      <section className="bg-slate-100 dark:bg-slate-900 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <Skeleton className="w-3/4 h-12 mx-auto mb-4" />
            <Skeleton className="w-2/3 h-6 mx-auto" />
          </div>
          <ArticleCardLargeSkeleton />
        </div>
      </section>

      {/* Section "Commencer ici" */}
      <section className="container mx-auto px-4 -mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Skeleton className="w-32 h-4 mx-auto mb-2" />
            <Skeleton className="w-64 h-4 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <Skeleton className="w-14 h-14 mb-4" />
                <Skeleton className="w-3/4 h-5 mb-2" />
                <Skeleton className="w-full h-3 mb-1" />
                <Skeleton className="w-5/6 h-3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <div className="lg:w-2/3">
            {/* Must Read */}
            <div className="mb-12">
              <Skeleton className="w-40 h-8 mb-6" />
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            </div>

            {/* Latest */}
            <div>
              <Skeleton className="w-48 h-8 mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6">
              <Skeleton className="w-3/4 h-6 mb-2 bg-white/20" />
              <Skeleton className="w-full h-4 mb-4 bg-white/20" />
              <Skeleton className="w-full h-10 mb-3 bg-white/20" />
              <Skeleton className="w-full h-10 bg-white/20" />
            </div>

            {/* Popular articles */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <Skeleton className="w-40 h-6 mb-4" />
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {[1, 2, 3, 4, 5].map((i) => (
                  <PopularArticleSkeleton key={i} />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="w-20 h-8" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

// Skeleton pour la liste d'articles (archives, recherche)
export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton pour la page article
export function ArticlePageSkeleton() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
      
      {/* Title */}
      <Skeleton className="w-full h-12 mb-4" />
      <Skeleton className="w-3/4 h-12 mb-6" />
      
      {/* Meta */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div>
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>
      
      {/* Featured image */}
      <Skeleton className="w-full h-96 mb-8" />
      
      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-5" />
        ))}
        <Skeleton className="w-4/5 h-5" />
        <div className="py-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-5" />
        ))}
      </div>
    </article>
  );
}

export default Skeleton;
