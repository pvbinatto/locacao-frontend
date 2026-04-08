# LocaCar Management - Frontend

A aplicação Front-end da plataforma **LocaCar**, um sistema SaaS Multi-tenant desenhado especificamente para a gestão de locadoras de veículos com foco em alta performance e experiência premium do usuário (UX/UI). Construída com o que há de mais moderno no ecossistema React.

## 🚀 Tecnologias

Este projeto foi inicializado através do **Vite** e utiliza a seguinte stack tecnológica:

- **React 18**
- **TypeScript**
- **Vite** (Build tool e Dev Server ultra-rápido)
- **Tailwind CSS** (Estilização utilitária e tipográfica)
- **React Router Dom** (Navegação SPA e rotas protegidas)
- **React Hook Form & Zod** (Validação e gerenciamento de formulários complexos)
- **Context API** (Gerenciamento de estados globais, como Sistema de Temas)

## 🎨 Design System e Temas (Light/Dark)

O padrão de estilo da LocaCar foi projetado priorizando contrastes refinados. 
Não dependemos de bibliotecas de componentes acopladas. Criamos nossos próprios painéis "glassmorphism", tipografia moderna e modais com entrada animada (`animate-in`).

A alternância entre temas Claro (**Light**) e Escuro (**Dark**) da UI é suportada nativamente:
- As cores base estão expostas como variáveis CSS de raiz (ex: `--surface`, `--primary`) no `src/index.css`.
- O Tailwind foi estendido (`tailwind.config.js`) para capturar as cores dinâmicas via `var(--nome-variavel)`.
- A lógica de transição entre temas em tempo real é controlada de forma global usando a Context API em `src/utils/ThemeContext.tsx`, que também suporta salvamento persistenciado via `localStorage`.

## 📦 Estrutura do Projeto

A arquitetura de pastas é mantida clara e escalaré:

```
frontend/
├── src/
│   ├── components/      # Componentes de UI reaproveitáveis (Layout, StatusDialog, Sidebar, etc)
│   ├── pages/           # Views/Telhas principais da aplicação
│   │   ├── Dashboard.tsx    # KPIs e Visão Geral
│   │   ├── Vehicles.tsx     # Central de Inventário
│   │   ├── Maintenance.tsx  # Central de Reparos
│   │   ├── Customers.tsx    # Listagem de Clientes
│   │   ├── Rentals.tsx      # Tabela de Locações
│   │   └── Login.tsx        # Gateway de Autenticação/Criação Tenant
│   ├── services/        # Abstração de requisições Fetch na classe de rotas da API (api.ts)
│   ├── utils/           # Funções puras, máscaras (CEP, Moeda, Placa) e Contextos Globais
│   ├── App.tsx          # Configuração base e roteamento do sistema
│   └── main.tsx         # Bootstrap React e importação CSS Global
├── public/              # Assets estáticos (se necessário)
├── tailwind.config.js   # Tokens de Design personalizados e mapeamento CSS
└── Dockerfile           # Instalação Multi-stage para setup Nginx prod-ready (Coolify)
```

## ⚙️ Instalação e Execução (Desenvolvimento)

1. **Instale as dependências** do projeto:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. Abra o navegador no endereço retornado (geralmente `http://localhost:5173`).

## 🛡️ Roteamento e Autenticação

A aplicação utiliza um wrapper `<ProtectedRoute />` na camada principal visual (dentro do `App.tsx`), garantindo que apenas usuários com um `locacar_token` válido no *localStorage* consigam acessar os painéis vitais (como Dashboard e Veículos). Retornos `HTTP 401 Unauthorized` lançados na `api.ts` redirecionam o usuário automaticamente e forçam a limpeza da sessão.

## 🚢 Deploy e Produção

Foi implementado um **Dockerfile otimizado baseado em Nginx**. O método utilizado (Multi-stage build) compila a SPA (Single Page Application) e expõe unicamente os arquivos minificados numa imagem Linux Alpina ultra-leve, estando pronta para ambientes como **Coolify** de forma imediata via conteinerização.

## 🔗 Links Úteis

* **Repositório Adicional / Backend:** [https://github.com/pvbinatto/locacao-frontend](https://github.com/pvbinatto/locacao-frontend)
