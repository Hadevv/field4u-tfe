## Structure des Seeders

Ce dossier contient les seeders pour initialiser la base de données avec des données de test réalistes.

### Organisation des fichiers

```
prisma/
  ├── seeders/
     ├── data/           # Données statiques pour chaque modèle
     ├── seeders/        # Logique de seeding pour chaque modèle
     ├── types.ts        # Types TypeScript
     └── cleanDatabase.ts # Utilitaire de nettoyage
     └──  seed.ts             # Point d'entrée principal
```

### Comment utiliser

1. Pour lancer les seeders :
   ```bash
   npm run seed
   ```

2. Pour ajouter de nouvelles données :
   - Ajoutez vos données dans le fichier approprié dans `seeders/data/`
   - Les fichiers sont organisés par modèle (users.ts, farms.ts, etc.)
   - Suivez le format existant pour maintenir la cohérence

3. Pour ajouter un nouveau type de données :
   - Créez un nouveau fichier dans `seeders/data/`
   - Créez un nouveau seeder dans `seeders/seeders/`
   - Ajoutez le type dans `types.ts`
   - Importez et ajoutez le seeder dans `seed.ts`

### Ordre de seeding

Les données sont créées dans cet ordre pour respecter les dépendances :

1. Users
2. CropTypes
3. Farms
4. Fields
5. GlanagePeriods
6. Announcements
7. Participations
8. Glanages
9. Reviews
10. Statistics
11. Comments
12. Likes
13. Favorites
14. Feedbacks
15. Notifications
16. Agendas

### Notes importantes

- Toutes les données sont nettoyées avant le seeding
- Les relations sont gérées automatiquement
- Les mots de passe de test sont tous "password123"
- Les données sont adaptées au contexte belge