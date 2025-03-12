# Sistema de Agendamento de Salas de Reunião

## Introdução

Este é um sistema de agendamento de salas de reunião desenvolvido como parte de um teste técnico. Ele permite que os usuários façam login (simulado), reservem salas para reuniões, visualizem agendamentos em um calendário interativo e cancelem suas próprias reservas.

## Tecnologias Utilizadas

- **Frontend**: Vue 3 com Quasar Framework
- **Backend**: Node.js com Express
- **Banco de Dados**: SQLite
- **Gerenciamento de Versão**: Git/GitHub

## Funcionalidades Principais

- **Login de Usuário** Autenticação via JWT para garantir acesso seguro.
- **Listagem de Salas Disponíveis** para agendamento.
- **Agendamento de Reunião**, escolhendo:
  - Sala desejada.
  - Descrição.
  - Data e horário de início e término.
- **Validações**:
  - Impedir reserva se a sala estiver ocupada no horário desejado.
  - Não permitir agendamentos para datas passadas.
  - O horário de início deve ser anterior ao de término.
  - Apenas o criador da reserva pode cancelá-la.
- **Listagem de Reuniões Agendadas**.
- **Visualização de Agendamentos em um Calendário Interativo**.
- **Cancelamento de Reuniões** (restrito ao criador da reserva).

## Como Rodar o Projeto Localmente

### 1. Clonar o Repositório

Passo 1: Abra o terminal.

Passo 2: Navegue até a pasta que deseja armazenar o projeto. Exemplo:

```sh
cd .\Documents\dev\projects
```

Passo 3: Clone o repositório.

```sh
git clone https://github.com/Luan-Rafael/agendamento-salas.git
cd agendamento-salas
```

### 2. Configurar e Rodar o Backend

Passo 1: Abra o projeto no visual studio code ou em um editor de codigo de sua preferência.

Passo 2: Abra o terminal e execute os comandos abaixo respectivamente :

```sh
cd backend
npm install
npm run dev
```

### 3. Configurar e Rodar o Frontend

Passo 1: Abra um novo terminal e execute os comandos abaixo respectivamente :

```sh
cd frontend
npm install
npm run dev
```

## Estrutura do Código

```
/
|-- backend/             # Código do servidor Express
|   |-- indes.js        # Servidor Express principal
|   |-- src/
|       |-- controllers/        # Lógica das requisições e manipulação de dados
|       |-- db/                 # Conexão e configuração do banco de dados (SQLite)
|       |-- middlewares/        # Tratamento de requisições e autenticação
|       |-- utils/              # Funções compartilhadas entre as camadas
|       |-- routes.js           # Rotas da API REST
|
|-- frontend/            # Código do Vue 3 com Quasar
|   |-- src/
|       |-- components/  # Componentes reutilizáveis
|       |-- pages/       # Páginas principais
|       |-- router/      # Configuração de rotas
|       |-- stores/      # Gerenciamentos de estado
|       |-- utils/       # Funções compartilhadas
|-- README.md            # Documentação do projeto
```

## Considerações Finais

O sistema foi desenvolvido seguindo boas práticas de código, organização de arquivos e estrutura modular para facilitar manutenção e escalabilidade.
