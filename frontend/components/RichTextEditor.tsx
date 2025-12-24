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
      tinymceScriptSrc="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"
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
