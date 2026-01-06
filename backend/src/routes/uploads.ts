import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import multipart from '@fastify/multipart';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import crypto from 'crypto';

// Dossier de destination des uploads (dans le frontend public)
const UPLOAD_DIR = path.join(process.cwd(), '..', 'frontend', 'public', 'uploads');

// Types de fichiers autorisés
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Créer les dossiers si nécessaire
function ensureDirectoryExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Générer un nom de fichier unique
function generateFileName(originalName: string, prefix: string = ''): string {
  const ext = path.extname(originalName).toLowerCase() || '.webp';
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  const safeName = prefix ? `${prefix}-${timestamp}-${random}${ext}` : `${timestamp}-${random}${ext}`;
  return safeName;
}

export async function uploadRoutes(fastify: FastifyInstance) {
  // Register multipart support
  await fastify.register(multipart, {
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

  // POST /api/uploads/image - Upload une image
  fastify.post('/image', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Querystring: { folder?: string; prefix?: string } }>, reply: FastifyReply) => {
    try {
      const { folder = 'articles', prefix = '' } = request.query;
      
      // Dossier cible
      const targetDir = path.join(UPLOAD_DIR, folder);
      ensureDirectoryExists(targetDir);

      // Récupérer le fichier
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'Aucun fichier envoyé' });
      }

      // Vérifier le type
      if (!ALLOWED_TYPES.includes(data.mimetype)) {
        return reply.status(400).send({ 
          error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.' 
        });
      }

      // Générer le nom du fichier
      const fileName = generateFileName(data.filename, prefix);
      const filePath = path.join(targetDir, fileName);

      // Sauvegarder le fichier
      await pipeline(data.file, createWriteStream(filePath));

      // Chemin public (relatif à /public)
      const publicPath = `/uploads/${folder}/${fileName}`;

      return reply.status(201).send({
        success: true,
        message: 'Image uploadée avec succès',
        file: {
          name: fileName,
          path: publicPath,
          folder: folder,
          url: publicPath,
        },
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      
      if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
        return reply.status(400).send({ error: 'Fichier trop volumineux (max 10 MB)' });
      }
      
      return reply.status(500).send({ error: 'Erreur lors de l\'upload' });
    }
  });

  // POST /api/uploads/images - Upload multiple images
  fastify.post('/images', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Querystring: { folder?: string; prefix?: string } }>, reply: FastifyReply) => {
    try {
      const { folder = 'articles', prefix = '' } = request.query;
      
      const targetDir = path.join(UPLOAD_DIR, folder);
      ensureDirectoryExists(targetDir);

      const parts = request.files();
      const uploadedFiles = [];

      for await (const part of parts) {
        if (!ALLOWED_TYPES.includes(part.mimetype)) {
          continue; // Skip invalid files
        }

        const fileName = generateFileName(part.filename, prefix);
        const filePath = path.join(targetDir, fileName);
        
        await pipeline(part.file, createWriteStream(filePath));

        const publicPath = `/uploads/${folder}/${fileName}`;
        uploadedFiles.push({
          name: fileName,
          path: publicPath,
          originalName: part.filename,
        });
      }

      return reply.status(201).send({
        success: true,
        message: `${uploadedFiles.length} image(s) uploadée(s)`,
        files: uploadedFiles,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return reply.status(500).send({ error: 'Erreur lors de l\'upload' });
    }
  });

  // GET /api/uploads/list - Lister les images d'un dossier
  fastify.get('/list', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Querystring: { folder?: string } }>, reply: FastifyReply) => {
    try {
      const { folder = 'articles' } = request.query;
      const targetDir = path.join(UPLOAD_DIR, folder);

      if (!existsSync(targetDir)) {
        return { files: [] };
      }

      const { readdirSync, statSync } = await import('fs');
      const files = readdirSync(targetDir)
        .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .map(f => {
          const stats = statSync(path.join(targetDir, f));
          return {
            name: f,
            path: `/uploads/${folder}/${f}`,
            size: stats.size,
            createdAt: stats.birthtime,
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { files };
    } catch (error) {
      console.error('List error:', error);
      return { files: [] };
    }
  });

  // DELETE /api/uploads/:folder/:filename - Supprimer une image
  fastify.delete('/:folder/:filename', {
    preHandler: [(fastify as any).authenticate],
  }, async (request: FastifyRequest<{ Params: { folder: string; filename: string } }>, reply: FastifyReply) => {
    try {
      const { folder, filename } = request.params;
      
      // Sécurité : empêcher les path traversal
      if (folder.includes('..') || filename.includes('..')) {
        return reply.status(400).send({ error: 'Chemin invalide' });
      }

      const filePath = path.join(UPLOAD_DIR, folder, filename);

      if (!existsSync(filePath)) {
        return reply.status(404).send({ error: 'Fichier non trouvé' });
      }

      const { unlinkSync } = await import('fs');
      unlinkSync(filePath);

      return { success: true, message: 'Image supprimée' };
    } catch (error) {
      console.error('Delete error:', error);
      return reply.status(500).send({ error: 'Erreur lors de la suppression' });
    }
  });
}
