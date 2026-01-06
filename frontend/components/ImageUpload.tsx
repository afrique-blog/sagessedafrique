'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (path: string) => void;
  folder?: string;
  prefix?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'articles',
  prefix = '',
  label = 'Image',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);

    try {
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        throw new Error('Seules les images sont autorisées');
      }

      // Vérifier la taille (10 MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse (max 10 MB)');
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      if (!token) {
        throw new Error('Vous devez être connecté pour uploader une image');
      }
      
      const response = await fetch(
        `${apiUrl}/uploads/image?folder=${folder}&prefix=${encodeURIComponent(prefix)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      onChange(data.file.path);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [folder, prefix, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Construire l'URL complète de l'image
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return path;
    if (path.startsWith('/images')) return path;
    // Ancien format (juste le nom du fichier)
    return `/images/articles/${path}`;
  };

  const imageUrl = value ? getImageUrl(value) : '';

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {/* Zone de drop / upload */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700/30'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p className="text-sm text-slate-500">Upload en cours...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"
              >
                📷 Changer
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
              >
                🗑️ Supprimer
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 break-all">{value}</p>
          </div>
        ) : (
          <div className="py-8">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Cliquez ou glissez une image ici
            </p>
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG, WebP ou GIF (max 10 MB)
            </p>
          </div>
        )}
      </div>

      {/* Champ texte pour saisie manuelle (fallback) */}
      <div className="mt-3">
        <details className="text-xs">
          <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
            💡 Ou saisir le chemin manuellement
          </summary>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/articles/mon-image.webp"
            className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
          />
        </details>
      </div>

      {/* Message d'erreur */}
      {error && (
        <p className="mt-2 text-sm text-red-500">❌ {error}</p>
      )}
    </div>
  );
}
