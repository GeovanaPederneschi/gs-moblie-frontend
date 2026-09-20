# Space Connect — Orbital Mission Control Platform

**Global Solution 2026 — FIAP | Turma 3ECR**

---

## Integrantes

| Nome Completo | RM |
|---|---|
| Geovana Carvalho Pederneschi | 559092 |
| Thais Helena Ferreira Vieira | 552387 |

---

## Sobre o Projeto

Plataforma mobile de controle de missão orbital que monitora sensores críticos instalados nos módulos da estação espacial, registra leituras operacionais em tempo real e gera alertas quando parâmetros excedem limites seguros.

O app se integra com a API REST desenvolvida em Spring Boot do repositório [`backend-gs-1-mobile`](https://github.com/GeovanaPederneschi/backend-gs-1-mobile), que persiste os dados no banco H2.

---

## Pré-requisitos

- Node.js 18+
- Backend Spring Boot rodando em `http://localhost:8080` (repositório `backend-gs-1-mobile`, com `@CrossOrigin` habilitado nos controllers)
- Endpoints necessários:
  - `GET /sensores`, `GET /sensores/{id}` e `POST /sensores`
  - `GET /leituras`, `GET /leituras/{id}` e `POST /leituras`
  - `GET /alertas`, `GET /alertas/{id}`, `POST /alertas` e `PUT /alertas/{id}`

---

## Como Rodar

### 1. Criar o projeto (apenas na primeira vez)

```bash
npx create-expo-app@latest . --template blank-typescript
```

### 2. Instalar dependências

```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-dom react-native-web @expo/metro-runtime
npm install axios
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npx expo start --web
```

O app abrirá no navegador em `http://localhost:8081` (ou porta disponível).

### 4. Simular tela de celular no navegador

1. Pressione `F12` para abrir o DevTools
2. Pressione `Ctrl + Shift + M` para ativar o modo responsivo
3. Selecione **iPhone 12** no seletor de dispositivos

---

## Aviso sobre Expo Go

Este projeto utiliza **Expo SDK 56** e **React Navigation Stack Navigator**, que **não são compatíveis com o Expo Go**.

Rode **apenas via navegador web** com `npx expo start --web`.

---

## Telas e Fluxo de Navegação

```
ListaSensoresScreen (tela inicial)
├── [botão] Novo Sensor → CadastroSensorScreen
│                              └── [salvar] → volta para ListaSensores (recarrega)
├── [botão] Ver Alertas → ListaAlertasScreen
│                              └── [card] → DetalheAlertaScreen
│                                              └── [botão] Marcar Resolvido → volta
├── [botão] Ver Leituras → ListaLeiturasScreen
│                              └── [botão] Selecionar Sensor → ListaSensores
└── [card sensor] → CadastroLeituraScreen
                         └── [salvar] → volta para ListaSensores
```

### Descrição das telas

| Tela | Função |
|---|---|
| **ListaSensoresScreen** | Lista todos os sensores cadastrados. Permite navegar para cadastro de novo sensor, ver alertas e ver leituras. Toque em um sensor para registrar uma leitura. |
| **CadastroSensorScreen** | Formulário para cadastrar novo sensor com nome, tipo, localização e status ativo/inativo. |
| **ListaLeiturasScreen** | Histórico de todas as leituras operacionais registradas com valor, unidade, status e timestamp. |
| **CadastroLeituraScreen** | Formulário para registrar uma leitura de um sensor específico (valor, unidade, status, observações). |
| **ListaAlertasScreen** | Lista todos os alertas críticos, ordenados com os ativos primeiro. |
| **DetalheAlertaScreen** | Exibe detalhes completos de um alerta e permite marcá-lo como resolvido. |

---

## Integração com a API (Sprint 3)

A partir da Sprint 3 o mock deixou de ser a fonte de dados: todas as telas leem e gravam direto na API real do backend Spring Boot (repositório `backend-gs-1-mobile`).

### Como subir as duas stacks

1. **Backend:** abra `backend-gs-1-mobile` no IntelliJ e rode `OrbitalMissionControlApplication.java`. A API sobe em `http://localhost:8080` (confirme acessando `http://localhost:8080/sensores` no navegador — deve responder `[]` ou uma lista em JSON).
2. **Frontend:** na raiz deste repositório, rode `npx expo start --web` (ou `npm run web`). O Metro só deve subir depois que o backend já estiver respondendo.

### Camada de serviços (`src/services`)

As telas **não** chamam o Axios nem montam URL diretamente — elas usam funções da camada de serviço:

```
src/services/api.ts               → instância do Axios (baseURL, timeout, headers)
src/services/sensorService.ts     → listar, buscarPorId, criar
src/services/leituraService.ts    → listar, buscarPorId, criar
src/services/alertaService.ts     → listar, buscarPorId, criar, resolver (PUT)
```

Cada tela importa o serviço correspondente (`import * as sensorService from "../services/sensorService"`) e chama `listar()`, `buscarPorId(id)` ou `criar(dados)`. O `criar` de cada serviço recebe o objeto sem `id` (`Omit<Entidade, "id">` no caso de sensor) e converte para o formato esperado pela API (ex.: `{ sensor: { id: sensorId }, ... }` em leituras e alertas).

### `BASE_URL`

Configurado em `src/services/api.ts`, varia conforme onde o app roda:

| Ambiente | BASE_URL |
|---|---|
| Web / iOS (simulador) | `http://localhost:8080` (padrão) |
| Emulador Android | `http://10.0.2.2:8080` (detectado automaticamente via `Platform.OS`) |
| Celular físico | defina a variável `EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080` antes de rodar `npx expo start` |

### Como testar a integração

1. Suba o backend e confirme os endpoints em JSON pelo navegador ou Postman/Insomnia (`GET http://localhost:8080/sensores`).
2. Suba o app e abra `ListaSensoresScreen` — ela dispara `sensorService.listar()` **e** `alertaService.listar()` em paralelo com `Promise.all` (mostra a lista de sensores e o contador de alertas ativos no botão "Ver Alertas").
3. Cadastre um sensor (`CadastroSensorScreen` → `POST /sensores`) e confirme que ele aparece na lista ao voltar.
4. Toque em um sensor, registre uma leitura (`CadastroLeituraScreen` → `POST /leituras`) e confirme em `ListaLeiturasScreen` (`GET /leituras`).
5. Abra um alerta em `ListaAlertasScreen` → `DetalheAlertaScreen` busca o registro individual com `GET /alertas/{id}` (não reaproveita o objeto da lista) e permite resolver com `PUT /alertas/{id}`.

### Comportamento com o backend fora do ar

Todas as chamadas usam `try/catch/finally`: enquanto a requisição está em andamento a tela mostra `ActivityIndicator` (estado "carregando"); se a API não responder (backend parado, IP errado, timeout de 10s), o `catch` define uma mensagem de erro exibida na tela (estado "erro", ex.: *"Erro ao carregar sensores. Verifique se a API está rodando."*) e o app não trava; assim que a chamada termina, `finally` sempre desliga o loading, garantindo que a tela volte a um estado estável (sucesso ou erro) independentemente do resultado.

**Exemplo de fluxo completo:**
1. `ListaSensoresScreen` busca `GET /sensores` e `GET /alertas` ao montar (via `Promise.all`)
2. Usuário toca em um sensor → navega para `CadastroLeituraScreen` com `sensorId` e `sensorNome`
3. Usuário preenche o formulário e salva → `POST /leituras` → volta para `ListaSensoresScreen`
4. Usuário abre um alerta na lista → `DetalheAlertaScreen` busca `GET /alertas/{id}` e permite `PUT /alertas/{id}` para resolvê-lo

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native + Expo | Framework mobile |
| TypeScript | Tipagem estática |
| Expo SDK 56 | Plataforma de build |
| React Navigation (Stack) | Navegação entre telas |
| Axios | Chamadas HTTP para a API REST |
| React Native Web | Execução no navegador |
| StyleSheet.create | Estilização dos componentes |
