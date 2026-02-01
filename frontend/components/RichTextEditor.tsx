'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Commencez a ecrire...',
  height = 400 
}: RichTextEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleInit = (_evt: unknown, editor: unknown) => {
    editorRef.current = editor;
  };

  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={handleInit}
      value={value}
      onEditorChange={handleChange}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'link image media | blockquote | removeformat | code | help',
        // Markdown auto-formatting patterns
        text_patterns: [
          { start: '# ', format: 'h1' },
          { start: '## ', format: 'h2' },
          { start: '### ', format: 'h3' },
          { start: '#### ', format: 'h4' },
          { start: '* ', cmd: 'InsertUnorderedList' },
          { start: '- ', cmd: 'InsertUnorderedList' },
          { start: '1. ', cmd: 'InsertOrderedList' },
          { start: '> ', format: 'blockquote' },
          { start: '---', replacement: '<hr />' },
          { start: '`', end: '`', format: 'code' },
          { start: '**', end: '**', format: 'bold' },
          { start: '*', end: '*', format: 'italic' },
          { start: '__', end: '__', format: 'bold' },
          { start: '_', end: '_', format: 'italic' },
          { start: '~~', end: '~~', format: 'strikethrough' },
        ],
        content_style: `
          body { 
            font-family: Georgia, Cambria, serif; 
            font-size: 16px; 
            line-height: 1.7;
            padding: 10px;
          }
          h2 { font-size: 1.75em; margin-top: 1.5em; margin-bottom: 0.5em; }
          h3 { font-size: 1.5em; margin-top: 1.25em; margin-bottom: 0.5em; }
          p { margin-bottom: 1em; }
          blockquote { 
            border-left: 4px solid #d4a855; 
            padding-left: 1em; 
            margin: 1.5em 0;
            font-style: italic;
            color: #666;
          }
        `,
        placeholder,
        language: 'fr_FR',
        branding: false,
        promotion: false,
        skin: 'oxide',
        content_css: 'default',
        block_formats: 'Paragraphe=p; Titre 2=h2; Titre 3=h3; Citation=blockquote',
        formats: {
          blockquote: { block: 'blockquote', wrapper: true }
        },
        image_caption: true,
        image_advtab: true,
        link_default_target: '_blank',
        paste_data_images: true,
        automatic_uploads: false,
      }}
    />
  );
}
