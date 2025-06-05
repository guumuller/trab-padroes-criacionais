## Trabalho Prático - Padrões Criacionais

## Objetivo:

### Dar início ao projeto com uma base sólida e flexível, utilizando ao menos um padrão criacional. Esta entrega utiliza o padrão Singleton para garantir que a conexão com o banco de dados via TypeORM seja única em toda a aplicação.

### Padrão Utilizado:

#### Singleton

### Motivação da Escolha:

### O padrão Singleton foi escolhido porque:

#### - Garante uma única instância ativa da conexão com o banco de dados.

#### - Evita problemas de conexões concorrentes ou não gerenciadas.

#### - Centraliza a configuração e o acesso ao banco.

# Conexão com banco de dados:

<img width="650" height="450" alt="Captura de Tela 2025-05-28 às 23 01 03" src="https://github.com/user-attachments/assets/2262710d-08eb-445a-8728-b43e1dc31366" />

## Testes Unitários
### Objetivo dos Testes:
#### Os testes unitários foram implementados para garantir a correta aplicação do padrão Singleton no gerenciamento da conexão com o banco de dados.

### O que está sendo testado:
#### Instância única do DataSource: verifica se múltiplas chamadas ao método getInstance() retornam sempre a mesma instância.

#### Configuração correta da conexão: garante que os parâmetros definidos (host, porta, nome do banco etc.) estejam corretamente atribuídos na instância do TypeORM.

### Ferramentas Utilizadas:
#### Jest: framework de testes utilizado para escrever e executar os testes unitários.

#### ts-jest: integração entre Jest e TypeScript para suportar sintaxe moderna e tipagens.

## Adapter

## Motivação

### - Permite adaptar objetos de entrada para entidades esperadas no domínio.

### - Facilita a integração de diferentes formatos de dados sem alterar as entidades do domínio.
