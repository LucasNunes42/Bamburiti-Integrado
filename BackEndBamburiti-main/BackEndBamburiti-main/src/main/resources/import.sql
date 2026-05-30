-- INSERT INTO USUARIO (email, senha, esta_logado, tipo_usuario) VALUES ('teste@bamburiti.com', '$2a$12$QHxANnSJ7skjP/EeBdHKsOzhSNVJgK8cuuALIuK1tQEBXN/Uk5O/q', false, 'ADMIN'); --
-- INSERT INTO posts (titulo, conteudo, url_imagem, data_publicacao, autor) VALUES ('Minha Primeira Bicicleta de Bambu', 'Conteúdo sobre a sustentabilidade do bambu...', 'http://link-da-imagem.jpg', NOW(), 'Admin'); --
<<<<<<< HEAD
INSERT INTO USUARIO (email, senha, esta_logado, tipo_usuario) VALUES ('teste@bamburiti.com', '$2a$04$lonU1veBqclixtuQsOpCiuBfmNmpUokTlzNSSOHBUE88XByGHiYsi', false, 'ADMIN');
-- --
=======
INSERT INTO USUARIO (email, senha, esta_logado, tipo_usuario, data_cadastro) VALUES ('teste@bamburiti.com', '$2a$04$lonU1veBqclixtuQsOpCiuBfmNmpUokTlzNSSOHBUE88XByGHiYsi', false, 'ADMIN', NOW());
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f

INSERT INTO posts (titulo, conteudo, autor, url_imagem, data_publicacao) VALUES ('Bambu - A tecnologia da Natureza', 'O bambu é uma planta da família das gramíneas (a mesma do arroz e do trigo), conhecida por sua alta resistência e crescimento ultrarrápido, podendo crescer até 50 cm por dia. É um recurso 100% renovável, famoso por suas mais de mil utilidades, que vão desde a bioconstrução até a culinária.', 'Equipe Bamburiti', '/uploads/bambu1.png', NOW());

INSERT INTO posts (titulo, conteudo, autor, url_imagem, data_publicacao) VALUES ('Como Plantar Bambu', 'O bambu é uma planta tropical renovável e que produz anualmente de maneira rápida e sem a necessidade de replantio, apresentando um grande potencial agrícola. Além de ser um eficiente sequestrador de carbono, apresenta excelentes características físicas, químicas e mecânicas. Também o bambu é o recurso natural que se renova em menor intervalo de tempo, não havendo nenhuma outra espécie florestal que possa competir com ele em velocidade de crescimento e de aproveitamento por área.', 'Equipe Bamburiti', '/uploads/bambu2.jpg', NOW());

INSERT INTO posts (titulo, conteudo, autor, url_imagem, data_publicacao) VALUES ('Sem ideias pro almoço? Carne e Broto de Bambu', 'A receita de hoje leva broto de bambu, um ingrediente bastante apreciado na gastronomia oriental (principalmente entre japoneses e chineses). Eu utilizei broto de bambu já picado e fervido, que você pode encontrar em Londrina na feira, nas barraquinhas dos japoneses, ou então no Mercado Shangri-lá. Se você não tiver esse ingrediente a disposição já preparado desta forma, pode, também, escolher um broto de bambu no pé.', 'Equipe Bamburiti', '/uploads/bambu3.jpg', NOW());