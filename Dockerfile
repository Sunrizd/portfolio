FROM node:18-alpine

WORKDIR /app

# On copie uniquement les fichiers de dépendances d'abord
COPY package.json package-lock.json ./

# Installation des dépendances dans le conteneur
RUN npm install

# On n'a pas besoin de copier tout le reste car on utilisera un "bind mount" (volume)
# pour que les modifications soient répercutées directement sur vos fichiers réels.

EXPOSE 3030

# Commande de démarrage
CMD ["node", "cms-server.js"]
