'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { api, PaysChapitreDetail, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper function to get country emoji from ISO code
function getCountryEmoji(countryCode: string | null): string {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Convert number to Roman numeral
function toRoman(num: number): string {
  if (num === 0) return '0';
  const lookup: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1,
  };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export default function DossiersPaysChapitre() {
  const { slug, chapitre } = useParams();
  const { lang } = useApp();
  const [data, setData] = useState<PaysChapitreDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // TTS state
  const [ttsLoading, setTtsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Reading progress
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!slug || !chapitre) return;

      try {
        const [chapitreData, categoriesData] = await Promise.all([
          api.getPaysChapitre(slug as string, chapitre as string, lang),
          api.getCategories(lang),
        ]);
        setData(chapitreData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch chapitre:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, chapitre, lang]);

  // Reading progress handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    setReadingProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading || !data) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await api.sendPaysAIMessage(userMessage, data.dossier.slug, chatMessages);
      setChatMessages(response.history);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: lang === 'fr' ? 'Désolé, une erreur est survenue.' : 'Sorry, an error occurred.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // TTS - Read section
  const readSection = async () => {
    if (ttsLoading || !data) return;

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      return;
    }

    setTtsLoading(true);

    try {
      // Extract text from content (first 1000 chars)
      const div = document.createElement('div');
      div.innerHTML = data.chapitre.contentHtml;
      const text = (div.textContent || '').substring(0, 1000);

      const response = await api.generatePaysTTS(text);

      // Convert base64 to audio
      const byteCharacters = atob(response.audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.mimeType });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.play();
      setCurrentAudio(audio);

      audio.onended = () => {
        setCurrentAudio(null);
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setTtsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg text-slate-600 dark:text-slate-400">
            {lang === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4">404</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {lang === 'fr' ? 'Chapitre non trouvé' : 'Chapter not found'}
            </p>
            <Link
              href={`/dossier-pays/${slug}`}
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {lang === 'fr' ? 'Retour au sommaire' : 'Back to contents'}
            </Link>
          </div>
        </main>
        <Footer categories={categories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Header />

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
            <Link href="/dossiers-pays" className="hover:text-amber-400 transition-colors">
              {lang === 'fr' ? 'Dossiers Pays' : 'Country Reports'}
            </Link>
            <span>/</span>
            <Link href={`/dossier-pays/${data.dossier.slug}`} className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>{getCountryEmoji(data.dossier.countryCode)}</span>
              {data.dossier.title.split(':')[0]}
            </Link>
            <span>/</span>
            <span className="text-amber-400">{data.chapitre.title.split(':')[0]}</span>
          </div>

          {/* Chapter Title */}
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            {data.chapitre.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-slate-300 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {data.chapitre.readingMinutes} min
            </span>
            <button
              onClick={readSection}
              disabled={ttsLoading}
              className="flex items-center gap-2 hover:text-amber-400 transition-colors disabled:opacity-50"
            >
              {ttsLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : currentAudio ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
              {currentAudio ? (lang === 'fr' ? 'Arrêter' : 'Stop') : (lang === 'fr' ? 'Écouter' : 'Listen')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12 max-w-7xl">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-1/4">
          <div className="sticky top-20 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              {lang === 'fr' ? 'Sommaire' : 'Contents'}
            </h3>
            <ul className="space-y-2 text-sm">
              {data.sommaire.map((item, idx) => (
                <li key={item.slug}>
                  <Link
                    href={`/dossier-pays/${data.dossier.slug}/${item.slug}`}
                    className={`block py-1 pl-3 border-l-2 transition-colors ${
                      item.current
                        ? 'border-amber-500 text-amber-600 dark:text-amber-500 font-semibold'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-xs text-slate-400 mr-2">{idx === 0 ? '0' : toRoman(idx)}</span>
                    {item.title.split(':')[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Article Content */}
        <main className="w-full lg:w-3/4">
          <article
            className="prose prose-lg dark:prose-invert max-w-none 
                       prose-headings:font-serif prose-headings:font-bold
                       prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b-2 prose-h2:border-amber-400 prose-h2:pb-3
                       prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-slate-800 dark:prose-p:text-slate-200 prose-p:leading-relaxed
                       prose-a:text-amber-600 dark:prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-slate-900 dark:prose-strong:text-white
                       prose-blockquote:border-l-4 prose-blockquote:border-amber-600 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                       prose-ul:list-disc prose-ul:pl-6
                       prose-ol:list-decimal prose-ol:pl-6
                       [&_.drop-cap]:first-letter:text-5xl [&_.drop-cap]:first-letter:font-bold [&_.drop-cap]:first-letter:float-left [&_.drop-cap]:first-letter:mr-3 [&_.drop-cap]:first-letter:mt-1 [&_.drop-cap]:first-letter:text-amber-700"
            dangerouslySetInnerHTML={{ __html: data.chapitre.contentHtml }}
          />

          {/* Navigation */}
          <nav className="flex items-center justify-between mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            {data.navigation.prev ? (
              <Link
                href={`/dossier-pays/${data.dossier.slug}/${data.navigation.prev.slug}`}
                className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm line-clamp-1">{data.navigation.prev.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {data.navigation.next ? (
              <Link
                href={`/dossier-pays/${data.dossier.slug}/${data.navigation.next.slug}`}
                className="flex items-center gap-3 text-slate-900 dark:text-white font-semibold hover:text-amber-600 dark:hover:text-amber-500 transition-colors group"
              >
                <span className="text-sm line-clamp-1">{data.navigation.next.title}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/dossier-pays/${data.dossier.slug}`}
                className="flex items-center gap-2 text-amber-600 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {lang === 'fr' ? 'Fin du dossier' : 'End of report'}
              </Link>
            )}
          </nav>
        </main>
      </div>

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {/* Chat Window */}
        {chatOpen && (
          <div className="w-96 h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden mb-2">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="text-sm font-semibold">
                  Guide IA {getCountryEmoji(data.dossier.countryCode)}
                </h3>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 space-y-4">
              {chatMessages.length === 0 && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-lg">
                    🤖
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%]">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {lang === 'fr'
                        ? `Bonjour ! Posez-moi vos questions sur ${data.dossier.title.split(':')[0]}.`
                        : `Hello! Ask me anything about ${data.dossier.title.split(':')[0]}.`}
                    </p>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                      msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-amber-100'
                    }`}
                  >
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div
                    className={`p-3 rounded-xl max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder={lang === 'fr' ? 'Posez votre question...' : 'Ask a question...'}
                  className="w-full pl-4 pr-12 py-3 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                {lang === 'fr' ? 'Propulsé par Gemini' : 'Powered by Gemini'}
              </p>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-medium group animate-pulse hover:animate-none"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap pl-0 group-hover:pl-2">
            {lang === 'fr' ? 'Guide IA' : 'AI Guide'}
          </span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      <Footer categories={categories} />
    </div>
  );
}
