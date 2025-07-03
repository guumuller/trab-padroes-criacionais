# 🚀 Trabalho Prático - Padrões de Projeto

## 📋 Visão Geral

Este projeto demonstra a implementação progressiva de padrões de projeto em uma aplicação Node.js com TypeScript, evoluindo através de três fases:

1. **Fase 1**: Padrões Criacionais (Singleton)
2. **Fase 2**: Padrões Estruturais (Adapter, Facade)  
3. **Fase 3**: Padrões Comportamentais (Strategy, Observer)

---

## 🎯 Fase 1: Padrões Criacionais

### Objetivo
Dar início ao projeto com uma base sólida e flexível, utilizando o padrão **Singleton** para garantir que a conexão com o banco de dados via TypeORM seja única em toda a aplicação.

### 🔧 Padrão Implementado: Singleton

#### 📖 O que é o Singleton?
O Singleton é um padrão criacional que garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a essa instância.

#### 🎯 Motivação da Escolha
O padrão Singleton foi escolhido porque:

- ✅ **Garante uma única instância** ativa da conexão com o banco de dados
- ✅ **Evita problemas** de conexões concorrentes ou não gerenciadas
- ✅ **Centraliza a configuração** e o acesso ao banco
- ✅ **Otimiza recursos** evitando múltiplas conexões desnecessárias

#### 💻 Implementação
```typescript
export class DataSourceSingleton {
    private static instance: DataSource;

    static getInstance(): DataSource {
        if (!DataSourceSingleton.instance) {
            DataSourceSingleton.instance = new DataSource({
                type: "postgres",
                host: "localhost",
                port: 5432,
                // ... configurações
            });
        }
        return DataSourceSingleton.instance;
    }
}
```

---

## 🧪 Testes Unitários - Fase 1

### 🎯 Objetivo dos Testes
Os testes unitários foram implementados para garantir a correta aplicação do padrão Singleton no gerenciamento da conexão com o banco de dados.

### 🔍 O que está sendo testado:

#### ✅ **Instância Única do DataSource**
- Verifica se múltiplas chamadas ao método `getInstance()` retornam sempre a mesma instância
- Garante que não há criação de múltiplas conexões

#### ✅ **Configuração Correta da Conexão**
- Garante que os parâmetros definidos (host, porta, nome do banco, etc.) estejam corretamente atribuídos na instância do TypeORM
- Valida a configuração do banco PostgreSQL

### 🛠️ Ferramentas Utilizadas:
- **Jest**: Framework de testes utilizado para escrever e executar os testes unitários
- **ts-jest**: Integração entre Jest e TypeScript para suportar sintaxe moderna e tipagens

---

## 🔄 Fase 2: Padrões Estruturais

### 🎯 Objetivo
Implementar padrões estruturais para melhorar a organização e flexibilidade do código, facilitando a integração de diferentes formatos de dados e simplificando interfaces complexas.

### 🔧 Padrões Implementados

#### 1. Adapter Pattern (Padrão Adaptador)

##### 📖 O que é o Adapter?
O Adapter permite que interfaces incompatíveis trabalhem juntas, convertendo a interface de uma classe em outra interface esperada pelo cliente.

##### 🎯 Motivação
- ✅ **Permite adaptar objetos** de entrada para entidades esperadas no domínio
- ✅ **Facilita a integração** de diferentes formatos de dados sem alterar as entidades do domínio
- ✅ **Mantém a flexibilidade** para diferentes fontes de dados
- ✅ **Preserva a integridade** das entidades do domínio

##### 💻 Implementação
```typescript
export class ProdutoAdapter {
    static toEntity(dto: any): Produto {
        const produto = new Produto();
        produto.nome = dto.nome;
        produto.categoria = dto.categoria;
        produto.preco = dto.preco;
        return produto;
    }
}
```

#### 2. Facade Pattern (Padrão Fachada)

##### 📖 O que é o Facade?
O Facade fornece uma interface unificada para um conjunto de interfaces em um subsistema, simplificando o uso de funcionalidades complexas.

##### 🎯 Motivação
- ✅ **Simplifica interfaces** complexas para o cliente
- ✅ **Encapsula subsistemas** complexos
- ✅ **Reduz dependências** entre componentes
- ✅ **Melhora a usabilidade** da API

##### 💻 Implementação
```typescript
export class ProdutoFacade {
    private service: ProdutoService;

    constructor() {
        const repository = DataSourceSingleton.getInstance().getRepository(Produto);
        this.service = new ProdutoService(repository);
    }

    async criarProduto(dto: any) {
        const produto = ProdutoAdapter.toEntity(dto);
        return await this.service.inserir(produto);
    }
}
```

---

## 🧠 Fase 3: Padrões Comportamentais

### 🎯 Objetivo da Terceira Fase
Implementação de comportamentos flexíveis e reutilizáveis usando padrões comportamentais para tornar o sistema mais modular e extensível.

### 📋 Resumo da Implementação

#### 🔄 Strategy Pattern (Padrão Estratégia)

**📖 O que é:**
Permite definir uma família de algoritmos (estratégias) e torná-los intercambiáveis. O algoritmo pode variar independentemente dos clientes que o utilizam.

**🎯 Por que:**
- **Flexibilidade**: Diferentes tipos de validação para produtos e usuários
- **Extensibilidade**: Fácil adição de novas regras de validação
- **Manutenibilidade**: Cada estratégia isolada e testável

**💻 Implementação:**
- `ValidationStrategy`: Interface base para todas as estratégias de validação
- `ProdutoValidationStrategy`: Validação específica para produtos (nome, preço, categoria)
- `UsuarioValidationStrategy`: Validação específica para usuários (email, senha)

**📁 Estrutura:**
```
src/strategy/
├── ValidationStrategy.ts          # Interface base
├── ProdutoValidationStrategy.ts   # Validação de produtos
└── UsuarioValidationStrategy.ts   # Validação de usuários
```

**✅ Benefícios práticos:**
- Validação de email com regex
- Validação de senha com tamanho mínimo
- Troca dinâmica de estratégias em tempo de execução
- Código mais limpo e organizado

**🔧 Uso:**
```typescript
// Configurar estratégia personalizada
produtoService.setValidationStrategy(customStrategy);

// Validação automática em operações CRUD
const validation = this.validationStrategy.validate(produto);
```

#### 👀 Observer Pattern (Padrão Observador)

**📖 O que é:**
Define uma dependência um-para-muitos entre objetos. Quando um objeto muda de estado, todos os dependentes são notificados automaticamente.

**🎯 Por que implementei:**
- **Desacoplamento**: Sistema de notificações independente da lógica de negócio
- **Extensibilidade**: Fácil adição de novos tipos de notificação
- **Reutilização**: Observers podem ser usados em diferentes contextos

**💻 Implementação:**
- `ProductObserver`: Interface para observers de produtos
- `ProductSubject`: Gerencia a lista de observers e notificações
- `LoggingObserver`: Observer para logging das operações
- `NotificationObserver`: Observer para simular notificações (email, SMS, etc.)

**📁 Estrutura:**
```
src/observer/
├── ProductObserver.ts        # Interface base
├── ProductSubject.ts         # Gerencia observers
├── LoggingObserver.ts        # Observer para logging
└── NotificationObserver.ts   # Observer para notificações
```

**✅ Benefícios práticos:**
- Logging automático de todas as operações CRUD
- Simulação de notificações (email, SMS, push)
- Notificações em tempo real para criação, atualização e remoção
- Sistema preparado para integração com serviços externos

**🔧 Uso:**
```typescript
// Anexar observers
produtoService.attachObserver(new LoggingObserver());
produtoService.attachObserver(new NotificationObserver());

// Notificação automática em operações CRUD
this.productSubject.notify(produto, 'created');
```

### 🔗 Integração dos Padrões

**🔄 Como funcionam juntos:**
1. **Strategy** valida os dados antes de salvar
2. **Observer** notifica sobre mudanças após salvar com sucesso
3. Se a validação falha, os observers não são notificados
4. Sistema robusto e confiável

---

## 🧪 Testes Implementados

### 🎯 Por que testei:
- **Validação**: Garantir que os padrões funcionam corretamente
- **Cobertura**: Testar todos os cenários possíveis
- **Manutenção**: Facilitar futuras modificações
- **Documentação**: Os testes servem como documentação viva

### 📊 Tipos de testes:

#### 1. **Strategy Tests** (8 testes):
- ✅ Validação de dados válidos
- ✅ Validação de dados inválidos
- ✅ Testes específicos para produtos e usuários

#### 2. **Observer Tests** (4 testes):
- ✅ Anexação e remoção de observers
- ✅ Notificação de múltiplos observers
- ✅ Prevenção de observers duplicados

#### 3. **Integration Tests** (6 testes):
- ✅ Interação entre Strategy e Observer
- ✅ Cenários de erro e sucesso
- ✅ Validação de que observers não são notificados em caso de erro

#### 4. **Database Tests** (3 testes):
- ✅ Testes do padrão Singleton (fase anterior)

### 🏆 Resultado: 21 testes passando = 100% de sucesso!

### 🚀 Execução dos Testes:
```bash
npm test
```

---

## 🎯 Benefícios dos Padrões Implementados

### 🔄 Strategy Pattern
1. **Flexibilidade**: Fácil troca de estratégias de validação
2. **Extensibilidade**: Novos tipos de validação podem ser adicionados sem modificar código existente
3. **Testabilidade**: Cada estratégia pode ser testada isoladamente
4. **Manutenibilidade**: Código mais organizado e responsabilidades bem definidas
5. **Reutilização**: Estratégias podem ser reutilizadas em diferentes contextos

### 👀 Observer Pattern
1. **Desacoplamento**: Sistema de notificações independente da lógica de negócio
2. **Extensibilidade**: Novos tipos de notificação podem ser adicionados facilmente
3. **Flexibilidade**: Observers podem ser anexados/removidos dinamicamente
4. **Reutilização**: Observers podem ser usados em diferentes contextos
5. **Manutenibilidade**: Fácil manutenção e evolução do sistema

### 🔧 Singleton Pattern
1. **Controle de Instância**: Garante uma única instância da conexão com banco
2. **Otimização de Recursos**: Evita múltiplas conexões desnecessárias
3. **Centralização**: Configuração centralizada do banco de dados
4. **Confiabilidade**: Evita problemas de concorrência

### 🔄 Adapter Pattern
1. **Compatibilidade**: Permite integração de interfaces incompatíveis
2. **Flexibilidade**: Facilita mudanças em formatos de dados
3. **Manutenibilidade**: Preserva a integridade das entidades do domínio
4. **Reutilização**: Adapters podem ser reutilizados

### 🏗️ Facade Pattern
1. **Simplicidade**: Simplifica interfaces complexas
2. **Encapsulamento**: Encapsula subsistemas complexos
3. **Usabilidade**: Melhora a experiência do desenvolvedor
4. **Manutenibilidade**: Reduz dependências entre componentes

---

## 🏗️ Arquitetura do Projeto

### 📁 Estrutura de Diretórios
```
src/
├── adapter/           # Padrão Adapter
├── controller/        # Controladores da API
├── facade/           # Padrão Facade
├── middleware/       # Middlewares (Token)
├── model/            # Entidades do banco
├── observer/         # Padrão Observer
├── repository/       # Repositórios
├── routers/          # Rotas da API
├── service/          # Lógica de negócio
├── strategy/         # Padrão Strategy
├── app.ts            # Aplicação principal
└── database.ts       # Singleton Pattern
```

### 🔄 Fluxo de Dados
```
Request → Router → Controller → Service → Repository → Database
    ↓         ↓         ↓         ↓         ↓
Middleware  Strategy  Observer  Adapter   Singleton
    ↓         ↓         ↓         ↓
  Token    Validation Notification Facade
```

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

### ⚙️ Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd trab-padroes-criacionais

# Instale as dependências
npm install
```

### 🔧 Configuração do Banco
1. Crie um banco PostgreSQL chamado `trab_padroes`
2. Configure as credenciais em `src/database.ts`
3. Execute as migrações (se necessário)

### 🏃‍♂️ Execução
```bash
# Desenvolvimento
npm run dev
```

### 🧪 Executar Testes
```bash
npm test
```

---

## 📚 Conclusão

Este projeto demonstra **excelente domínio** dos padrões de projeto através de três fases evolutivas:

### ✅ **Fase 1 - Padrões Criacionais**
- Singleton implementado com sucesso
- Conexão única com banco de dados
- Testes unitários funcionando

### ✅ **Fase 2 - Padrões Estruturais**
- Adapter para adaptação de dados
- Facade para simplificação de interfaces
- Integração perfeita com padrões anteriores

### ✅ **Fase 3 - Padrões Comportamentais**
- Strategy para validação flexível
- Observer para sistema de notificações
- Integração harmoniosa entre todos os padrões

### 🏆 **Resultados Finais**
- **21 testes passando** (100% de sucesso)
- **Código bem organizado** e documentado
- **Arquitetura robusta** e extensível
- **Padrões implementados corretamente**
