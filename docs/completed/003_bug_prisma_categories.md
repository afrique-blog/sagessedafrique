# Tâche 1.3 — Corriger bug sauvegarde image catégorie (Prisma)

**Date** : 26/12/2024  
**Durée** : 20min  
**Statut** : ✅ Terminé

## Problème

Les images des catégories ne se sauvegardaient pas via l'interface admin. Le champ apparaissait dans le formulaire mais après enregistrement, la valeur était perdue.

## Cause

Le client Prisma sur le serveur n'était pas synchronisé avec le schéma qui contenait le nouveau champ `image` sur le modèle `Category`.

## Solution

### Commandes exécutées sur le serveur

```bash
cd /var/www/vhosts/sagessedafrique.blog/httpdocs

# Récupérer le code
git pull origin main

# Supprimer le cache Prisma et régénérer le client
cd backend
rm -rf node_modules/.prisma
npx prisma generate

# Recompiler le backend
npm run build

# Redémarrer l'application
cd .. && pkill -f "node" && nohup /opt/plesk/node/25/bin/node app.js > app.log 2>&1 & disown
```

## Fichiers concernés

- `backend/prisma/schema.prisma` — Contient le champ `image` sur `Category`
- `backend/src/routes/categories.ts` — Gère la lecture/écriture de l'image
- `node_modules/.prisma/client` — Client Prisma généré

## Vérification

```bash
# Tester que l'API retourne l'image
curl -s "http://localhost:3001/api/categories/arts?lang=fr" | grep -o '"image":"[^"]*"'
# Devrait retourner: "image":"/images/categories/arts.jpg"
```

## Leçon apprise

Après toute modification du schéma Prisma :
1. `npx prisma db push` — Synchronise la base de données
2. `npx prisma generate` — Régénère le client Prisma
3. `npm run build` — Recompile le backend TypeScript
4. Redémarrer l'application Node.js

