-- Insert sample essieux data
INSERT INTO essieux (serie, post, numero_ordre, date_rev, mise_sce_rmt, d_roue, wagon, bogie1, bogie2, situation, age_revision_jours, age_calage_annee, marque) VALUES
(9101, 1, '11212', '15/3/24', '10/2/20', 896, '9310001', 843, 7, 'EN EXPLOITATION', '4ans2mois23jours', 18, 'SKF'),
(9102, 2, '22091', '20/3/24', '15/3/21', 900, '9310002', 467, 432, 'DEMANDE', '3ans1mois15jours', 20, 'TIMKEN'),
(9103, 3, '33123', '25/3/24', '20/4/22', 875, '9310003', 123, 456, 'EN EXPLOITATION', '2ans11mois5jours', 15, 'SKF'),
(9104, 4, '44234', '30/3/24', '25/5/23', 920, '9310004', 789, 321, 'EN EXPLOITATION', '1ans10mois5jours', 12, 'NSK'),
(9105, 1, '55345', '5/4/24', '30/6/23', 880, '9310005', 654, 987, 'DEMANDE', '1ans9mois5jours', 10, 'TIMKEN'),
(9106, 2, '66456', '10/4/24', '5/8/23', 905, '9310006', 147, 258, 'EN EXPLOITATION', '1ans8mois5jours', 8, 'SKF'),
(9107, 3, '77567', '15/4/24', '10/9/23', 890, '9310007', 369, 741, 'EN EXPLOITATION', '1ans7mois5jours', 6, 'NSK'),
(9108, 4, '88678', '20/4/24', '15/10/23', 915, '9310008', 852, 963, 'DEMANDE', '1ans6mois5jours', 4, 'TIMKEN'),
(9109, 1, '99789', '25/4/24', '20/11/23', 885, '9310009', 159, 357, 'EN EXPLOITATION', '1ans5mois5jours', 2, 'SKF'),
(9110, 2, '10890', '30/4/24', '25/12/23', 910, '9310010', 753, 951, 'EN EXPLOITATION', '1ans4mois5jours', 1, 'NSK');

-- Insert sample travailleurs data
INSERT INTO travailleurs (matricule, nom, prenom, specialite, niveau, statut, date_embauche, telephone, email, essieux_assignes, interventions_realisees, note_moyenne, derniere_intervention, competences) VALUES
('TECH-001', 'Dupont', 'Jean', 'Mécanique', 'expert', 'actif', '15/3/2018', '06.12.34.56.78', 'j.dupont@essieux.fr', 12, 156, 4.8, '2/3/24', ARRAY['Révision', 'Diagnostic', 'Soudure']),
('TECH-002', 'Martin', 'Pierre', 'Électronique', 'senior', 'actif', '22/8/2020', '06.23.45.67.89', 'p.martin@essieux.fr', 8, 89, 4.6, '5/3/24', ARRAY['Diagnostic', 'Programmation', 'Test']),
('TECH-003', 'Bernard', 'Marie', 'Hydraulique', 'senior', 'actif', '10/1/2021', '06.34.56.78.90', 'm.bernard@essieux.fr', 10, 67, 4.4, '8/3/24', ARRAY['Hydraulique', 'Pneumatique', 'Maintenance']),
('TECH-004', 'Petit', 'Lucas', 'Mécanique', 'junior', 'actif', '5/6/2022', '06.45.67.89.01', 'l.petit@essieux.fr', 6, 34, 4.2, '12/3/24', ARRAY['Révision', 'Montage', 'Démontage']),
('TECH-005', 'Robert', 'Sophie', 'Électronique', 'expert', 'en_conge', '18/9/2019', '06.56.78.90.12', 's.robert@essieux.fr', 0, 98, 4.7, '1/3/24', ARRAY['Diagnostic', 'Programmation', 'Test', 'Formation']),
('TECH-006', 'Durand', 'Thomas', 'Hydraulique', 'junior', 'actif', '12/3/2023', '06.67.89.01.23', 't.durand@essieux.fr', 4, 23, 4.0, '15/3/24', ARRAY['Hydraulique', 'Maintenance']),
('TECH-007', 'Moreau', 'Camille', 'Mécanique', 'senior', 'inactif', '8/11/2020', '06.78.90.12.34', 'c.moreau@essieux.fr', 0, 45, 4.1, '28/2/24', ARRAY['Révision', 'Diagnostic']),
('TECH-008', 'Simon', 'Alexandre', 'Électronique', 'junior', 'actif', '20/7/2023', '06.89.01.23.45', 'a.simon@essieux.fr', 3, 18, 3.9, '18/3/24', ARRAY['Diagnostic', 'Test']);

-- Insert sample stock_items data
INSERT INTO stock_items (nom, quantite, seuil_minimum, derniere_entree) VALUES
('Roulement SKF 6205', 45, 10, '15/3/24'),
('Joint torique 20x2', 120, 25, '12/3/24'),
('Vis M8x20', 200, 50, '10/3/24'),
('Garniture de frein', 8, 5, '8/3/24'),
('Huile hydraulique 46', 15, 8, '5/3/24'),
('Filtre à air', 25, 10, '3/3/24'),
('Courroie trapézoïdale', 12, 6, '1/3/24'),
('Ampoule LED 12V', 35, 15, '28/2/24');

-- Insert sample pannes data
INSERT INTO pannes (date, essieu_id, description, statut, technicien_id, notes) VALUES
('20/3/24', (SELECT id FROM essieux WHERE numero_ordre = '22091'), 'Roulement défaillant sur bogie 1', 'ouverte', (SELECT id FROM travailleurs WHERE matricule = 'TECH-001'), ARRAY['Diagnostic effectué', 'Commande pièce en cours']),
('18/3/24', (SELECT id FROM essieux WHERE numero_ordre = '55345'), 'Fuite hydraulique détectée', 'en_cours', (SELECT id FROM travailleurs WHERE matricule = 'TECH-003'), ARRAY['Réparation en cours', 'Pièces disponibles']),
('15/3/24', (SELECT id FROM essieux WHERE numero_ordre = '88678'), 'Problème électronique sur système de freinage', 'fermée', (SELECT id FROM travailleurs WHERE matricule = 'TECH-002'), ARRAY['Réparation terminée', 'Test de fonctionnement OK']),
('12/3/24', (SELECT id FROM essieux WHERE numero_ordre = '10890'), 'Usure anormale des garnitures', 'ouverte', (SELECT id FROM travailleurs WHERE matricule = 'TECH-004'), ARRAY['Inspection prévue', 'Commande garnitures']),
('10/3/24', (SELECT id FROM essieux WHERE numero_ordre = '33123'), 'Vibration excessive détectée', 'en_cours', (SELECT id FROM travailleurs WHERE matricule = 'TECH-001'), ARRAY['Diagnostic approfondi', 'Équilibrage nécessaire']);
