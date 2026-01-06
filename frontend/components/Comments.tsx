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

interface CommentWithReplies extends Comment {
  replies?: Comment[];
}

interface CommentsProps {
  articleId: number;
  articleSlug: string;
  lang: string;
}

export default function Comments({ articleId, articleSlug, lang }: CommentsProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; authorName: string } | null>(null);
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
    subscribeNewsletter: false,
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
        subscribeNewsletter: formData.subscribeNewsletter,
        parentId: replyingTo?.id,
      });

      setSuccess(result.message);
      setFormData({ authorName: '', authorEmail: '', content: '', subscribeNewsletter: false });
      setReplyingTo(null);
    } catch (err: any) {
      setError(err.message || (lang === 'fr' ? 'Une erreur est survenue' : 'An error occurred'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo({ id: comment.id, authorName: comment.authorName });
    // Scroll to form
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Compte total des commentaires (avec réponses)
  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  // Composant pour afficher un commentaire
  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 border-l-2 border-slate-200 dark:border-slate-600 pl-4' : ''}`}>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`${isReply ? 'w-8 h-8 text-sm' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0`}>
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-bold">{comment.authorName}</span>
              {isReply && (
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
                  {lang === 'fr' ? 'Réponse' : 'Reply'}
                </span>
              )}
              <span className="text-xs text-slate-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            {!isReply && (
              <button
                onClick={() => handleReply(comment)}
                className="mt-3 text-sm text-primary dark:text-accent hover:underline flex items-center gap-1"
              >
                ↩️ {lang === 'fr' ? 'Répondre' : 'Reply'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-serif font-bold mb-8">
        💬 {lang === 'fr' ? 'Commentaires' : 'Comments'} ({totalCount})
      </h2>

      {/* Comment Form */}
      <div id="comment-form" className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-10">
        <h3 className="font-bold text-lg mb-4">
          {replyingTo ? (
            <span className="flex items-center gap-2 flex-wrap">
              ↩️ {lang === 'fr' ? 'Répondre à' : 'Reply to'} <span className="text-primary dark:text-accent">{replyingTo.authorName}</span>
              <button
                onClick={cancelReply}
                className="text-sm text-slate-500 hover:text-red-500 ml-2"
              >
                ✕ {lang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
            </span>
          ) : (
            lang === 'fr' ? 'Laisser un commentaire' : 'Leave a comment'
          )}
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
              {replyingTo 
                ? (lang === 'fr' ? 'Votre réponse' : 'Your reply')
                : (lang === 'fr' ? 'Commentaire' : 'Comment')
              } *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder={replyingTo
                ? (lang === 'fr' ? 'Votre réponse...' : 'Your reply...')
                : (lang === 'fr' ? 'Partagez votre réflexion...' : 'Share your thoughts...')
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.content.length}/2000 {lang === 'fr' ? 'caractères' : 'characters'}
            </p>
          </div>

          {/* Option inscription newsletter */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.subscribeNewsletter}
              onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-500 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              📧 {lang === 'fr' 
                ? "M'inscrire à la newsletter pour recevoir les nouveaux articles" 
                : 'Subscribe to newsletter to receive new articles'}
            </span>
          </label>

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
                  {replyingTo 
                    ? (lang === 'fr' ? 'Répondre' : 'Reply')
                    : (lang === 'fr' ? 'Envoyer' : 'Submit')
                  }
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
            <div key={comment.id} className="space-y-4">
              {/* Commentaire principal */}
              <CommentItem comment={comment} />
              
              {/* Réponses */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-4">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
