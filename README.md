# Gym App - Sistema de Treinos

Uma aplicação mobile completa para gerenciamento de treinos, desenvolvida com **React Native** e **Expo**. O app permite que professores criem treinos personalizados e alunos acompanhem seu progresso de forma intuitiva.

## 📱 Download do App

**🔗 [Baixar o App para Android](#)** - _https://expo.dev/accounts/cleversonfaria/projects/exito/builds/22c11ddb-07d2-4cb4-8139-656840bf30ed_

## ✨ Funcionalidades

### 👨‍🏫 Para Professores

- ✅ Cadastro e gerenciamento de exercícios
- ✅ Criação de treinos personalizados
- ✅ Gestão de alunos
- ✅ Upload de vídeos demonstrativos

### 👨‍🎓 Para Alunos

- ✅ Visualização de treinos por dia da semana
- ✅ Registro de séries completadas
- ✅ Estatísticas semanais de progresso
- ✅ Histórico de treinos
- ✅ Vídeos explicativos dos exercícios

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** instalado globalmente
- **Android Studio** (para emulador Android) ou **Xcode** (para simulador iOS)

### 1. Clone o Repositório

```bash
git clone https://github.com/cleversonffaria/exito.git
cd exito
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Inicie o Projeto

```bash
# Desenvolvimento com Expo Go
npx expo start

# Ou desenvolvimento com build personalizado
npm run start
```

### 5. Executar em Dispositivos/Emuladores

```bash
# Android
npm run android

# iOS
npm run ios

# Web (desenvolvimento)
npm run web
```

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Zustand** - Gerenciamento de estado
- **Supabase** - Backend as a Service
- **NativeWind** - Estilização (Tailwind CSS)
- **React Hook Form** - Formulários
- **Expo Router** - Navegação

## 📂 Estrutura do Projeto

```
src/
├── app/                    # Rotas da aplicação (Expo Router)
├── components/            # Componentes reutilizáveis
│   ├── atoms/             # Componentes atômicos
│   ├── organisms/         # Componentes atômicos
│   ├── molecules/         # Componentes atômicos
│   ├── pages/            # Componentes de páginas
├── services/             # Serviços de API
├── store/               # Gerenciamento de estado (Zustand)
├── types/               # Definições de tipos TypeScript
├── utils/               # Utilitários e helpers
└── constants/           # Constantes da aplicação
```

## 🔧 Scripts Disponíveis

```bash
# Iniciar em modo desenvolvimento
npm run start

# Limpar cache e iniciar
npm run start:clear

# Build para Android
npm run android

# Build para iOS
npm run ios

# Executar testes
npm run test

# Lint do código
npm run lint

# Build de produção
npm run build
```

## 🗄️ Banco de Dados

O projeto utiliza **Supabase** como backend, com as seguintes tabelas principais:

- `users` - Usuários (professores e alunos)
- `exercises` - Catálogo de exercícios
- `trainings` - Treinos criados pelos professores
- `training_exercises` - Exercícios de cada treino
- `student_trainings` - Associação aluno-treino
- `training_logs` - Registro de execução dos treinos

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 👨‍💻 Colaboradores

**Alexandre Leite da Silva** • **Cléverson Fernandes de Faria** • **Eduarda Rocha Medeiros** • **Gabriel Stein Velten** • **Jhenifer Laryssa Faria Lourenço** • **Jhonatan Henrique de Souza Gama** • **Leonardo Ferreira Ozório** • **Pedro Paulo Monteiro Rocha** • **Saniel Queiroz Dos Santos**
