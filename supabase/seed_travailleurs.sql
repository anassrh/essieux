-- Insertion de données de test pour la table travailleurs
INSERT INTO travailleurs (
  matricule, nom, prenom, specialite, niveau, statut, date_embauche, 
  telephone, email, essieux_assignes, interventions_realisees, 
  note_moyenne, derniere_intervention, competences
) VALUES 
(
  'T001', 'Benali', 'Ahmed', 'Mécanique', 'senior', 'ACTIF', '2020-03-15',
  '+212 6 12 34 56 78', 'ahmed.benali@emsi.ma', 15, 45,
  8.5, '2024-09-15', ARRAY['Diagnostic moteur', 'Réparation freins', 'Maintenance préventive']
),
(
  'T002', 'Alaoui', 'Fatima', 'Électricité', 'intermediaire', 'ACTIF', '2021-06-20',
  '+212 6 23 45 67 89', 'fatima.alaoui@emsi.ma', 12, 32,
  7.8, '2024-09-10', ARRAY['Systèmes électriques', 'Diagnostic électronique', 'Câblage']
),
(
  'T003', 'Hassani', 'Youssef', 'Soudure', 'expert', 'ACTIF', '2019-01-10',
  '+212 6 34 56 78 90', 'youssef.hassani@emsi.ma', 20, 67,
  9.2, '2024-09-18', ARRAY['Soudure TIG', 'Soudure MIG', 'Réparation structures', 'Contrôle qualité']
),
(
  'T004', 'Chraibi', 'Aicha', 'Inspection', 'senior', 'ACTIF', '2020-09-05',
  '+212 6 45 67 89 01', 'aicha.chraibi@emsi.ma', 8, 28,
  8.7, '2024-09-12', ARRAY['Inspection visuelle', 'Contrôle non destructif', 'Documentation']
),
(
  'T005', 'Bennani', 'Omar', 'Maintenance', 'junior', 'ACTIF', '2023-02-14',
  '+212 6 56 78 90 12', 'omar.bennani@emsi.ma', 5, 12,
  6.5, '2024-09-08', ARRAY['Maintenance de base', 'Nettoyage', 'Lubrification']
),
(
  'T006', 'Tazi', 'Khadija', 'Diagnostic', 'intermediaire', 'CONGE', '2021-11-30',
  '+212 6 67 89 01 23', 'khadija.tazi@emsi.ma', 10, 25,
  7.9, '2024-08-25', ARRAY['Diagnostic avancé', 'Analyse de pannes', 'Rapports techniques']
),
(
  'T007', 'Idrissi', 'Hassan', 'Formation', 'expert', 'ACTIF', '2018-04-12',
  '+212 6 78 90 12 34', 'hassan.idrissi@emsi.ma', 0, 15,
  9.0, '2024-09-05', ARRAY['Formation technique', 'Encadrement', 'Développement compétences']
),
(
  'T008', 'Mansouri', 'Zineb', 'Supervision', 'senior', 'ACTIF', '2019-08-22',
  '+212 6 89 01 23 45', 'zineb.mansouri@emsi.ma', 0, 8,
  8.8, '2024-09-20', ARRAY['Gestion d&apos;équipe', 'Planification', 'Contrôle qualité', 'Reporting']
);

-- Mise à jour des statistiques
UPDATE travailleurs SET 
  essieux_assignes = FLOOR(RANDOM() * 20) + 1,
  interventions_realisees = FLOOR(RANDOM() * 50) + 10,
  note_moyenne = ROUND((RANDOM() * 3 + 6)::numeric, 1),
  derniere_intervention = CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 30)
WHERE essieux_assignes = 0;
