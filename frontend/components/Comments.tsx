'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, Comment } from '@/lib/api';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface CommentsProps {
  articleId: number;
  articleSlug: string;
  lang: string;
}

export default function Comments({ articleId, articleSlug, lang }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  // Load comments
  const loadComments = useCallback(async () => {
    try {
      const data = await api.getComments(articleSlug);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  }, [articleSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Load reCAPTCHA script
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    
    const existingScript = document.querySelector(`script[src*="recaptcha"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [RECAPTCHA_SITE_KEY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      let recaptchaToken = '';
      
      if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
        recaptchaToken = await new Promise((resolve, reject) => {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_comment' });
              resolve(token);
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      const result = await api.createComment({
        articleId,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        content: formData.content,
        recaptchaToken,
      });

      setSuccess(result.message);
      setFormData({ authorName: '', authorEmail: '', content: '' });
    } catch (err: any) {
      setError(err.message || (lang === 'fr' ? 'Une erreur est survenue' : 'An error occurred'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-serif font-bold mb-8">
        💬 {lang === 'fr' ? 'Commentaires' : 'Comments'} ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-10">
        <h3 className="font-bold text-lg mb-4">
          {lang === 'fr' ? 'Laisser un commentaire' : 'Leave a comment'}
        </h3>
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
            ✅ {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {lang === 'fr' ? 'Nom' : 'Name'} *
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                required
                minLength={2}
                maxLength={100}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={lang === 'fr' ? 'votre@email.com (ne sera pas publié)' : 'your@email.com (will not be published)'}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {lang === 'fr' ? 'Commentaire' : 'Comment'} *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder={lang === 'fr' ? 'Partagez votre réflexion...' : 'Share your thoughts...'}
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.content.length}/2000 {lang === 'fr' ? 'caractères' : 'characters'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {lang === 'fr' 
                ? '* Les commentaires sont modérés avant publication.' 
                : '* Comments are moderated before publication.'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {lang === 'fr' ? 'Envoi...' : 'Sending...'}
                </>
              ) : (
                <>
                  <span>📤</span>
                  {lang === 'fr' ? 'Envoyer' : 'Submit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <span className="animate-pulse">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <span className="text-4xl mb-4 block">💭</span>
          {lang === 'fr' 
            ? 'Soyez le premier à commenter cet article !' 
            : 'Be the first to comment on this article!'}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{comment.authorName}</span>
                    <span className="text-xs text-slate-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
