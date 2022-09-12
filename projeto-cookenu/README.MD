# Projeto Cookenu
- Projeto proposto para praticar programação orientada a objetos. 

## API - Postman
- link: https://documenter.getpostman.com/view/20786077/VUjLLnSK

## Surge - Heroku
- link: https://projeto-cookenu-nicoly.herokuapp.com/ping

## Autor
- gitHub: https://github.com/NicolyBarros

## Instalação das dependências
- npm install : Instala as dependências utilizadas no desenvolvimento do projeto.

## Criando e preenchenco arquivo .env
- Criar o arquivo .env e configurar com as informações de seu banco de dados.

PORT: 3003
DB_HOST = host
DB_USER = usuario
DB_PASSWORD = senha
DB_NAME = nome-do-banco-de-dados

JWT_KEY = senha
JWT_EXPIRES_IN = duração do token

BCRYPT_SALT_ROUNDS = 12 (padrão é 10/12)

## Popular tabelas
- npm run migrations: Cria e popula as tabelas no banco de dados com base no arquivo data.ts

## Executar o projeto
- npm run dev: Estabelece a conexão com o banco de dados e reinicia automaticamente o servidor localhost toda a vez que o projeto for alterado e salvo.


## Funcionalidades básicas

### Endpoint 1) Signup
Requisição de cadastro de novo usuário “NORMAL” que retorna ao final um token de acesso ao sistema.

### Endpoint 2) Login
Requisição de acesso de usuários já cadastrados ao sistema. Ao final, um token de acesso é retornado.

### Endpoint 3) Register recipe
Requisição que permite um usuário logado no sistema criar uma nova receita. A receita criada é retornada ao final da operação.

### Endpoint 4) Edit recipe
Requisição que permite um usuário logado no sistema alterar o título e/ou a descrição de uma receita existente. Usuários do tipo “NORMAL” só poderão alterar as receitas que foram criados por eles mesmo, enquanto usuários do tipo “ADMIN” podem alterar qualquer receita do sistema. A receita alterada é retornada ao final da operação com a updatedAt atualizada.

### Endpoint 5) Delete recipe
Requisição que permite um usuário logado no sistema remover uma receita pela sua id. Usuários do tipo “NORMAL” só poderão remover as receitas que foram criados por eles mesmo, enquanto usuários do tipo “ADMIN” podem remover qualquer receita do sistema. 

### Endpoint 6) Get recipes
Requisição que permite um usuário logado no sistema buscar a lista de receitas com possibilidade de busca por titulo e com ordenação e paginação.

### Endpoint 7) Delete user
Requisição que permite a deleção de um usuário existente no sistema pelo seu id. Somente usuários do tipo “ADMIN” poderão consumir este recurso.