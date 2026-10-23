# Space Connect — Orbital Mission Control Platform

**Sprint 2026 — FIAP | Turma 3ECR | Sprint 4 (Entrega Final)**

App mobile (React Native + Expo) integrado à API REST (Spring Boot + H2) do grupo. Este README é o guia principal do projeto: com ele é possível clonar os dois repositórios, subir backend e frontend e reproduzir todo o fluxo mostrado no vídeo.

---

## 🎥 Vídeo de demonstração

**YouTube (Não listado):** https://youtu.be/FbL4_DYdXeM

---

## Integrantes

| Nome Completo | RM |
|---|---|
| Geovana Carvalho Pederneschi | RM559092 |
| Thais Helena Ferreira Vieira | RM552387 |
| Gustavo Andrade | RM559069 |
| Mayene Doria | RM558858 |
| Lucas Santos | RM556891 |
| Gabriel Lacerda | RM556391 |

---

## Repositórios

| Parte | Repositório |
|---|---|
| Frontend (este) — React Native / Expo | https://github.com/GeovanaPederneschi/gs-moblie-frontend |
| Backend — API Spring Boot | https://github.com/GeovanaPederneschi/backend-gs-1-mobile |

---

## O projeto

### Problema

Em uma estação orbital (inspirada no projeto Gateway da NASA), dezenas de sensores monitoram temperatura, pressão, radiação e navegação dos módulos. Sem uma central única, leituras fora do limite seguro podem passar despercebidas e a equipe demora para reagir a uma falha crítica.

### Solução

O **Orbital Mission Control** centraliza esse monitoramento: a equipe cadastra os sensores de cada módulo, registra leituras operacionais e acompanha os alertas críticos, marcando-os como resolvidos. Todos os dados vêm da API real e ficam persistidos no banco H2 (arquivo) do backend — não há mock no fluxo do app.

### Entidades

| Entidade | Endpoint base | Descrição |
|---|---|---|
| **SensorModulo** (entidade principal) | `/sensores` | Sensor instalado em um módulo: `nome`, `tipo` (temperatura, pressao, radiacao, navegacao), `localizacao`, `ativo` |
| **LeituraSensor** | `/leituras` | Leitura de um sensor (`@ManyToOne`): `valor`, `unidade`, `statusOperacional` (normal, atencao, critico), `timestamp`, `observacoes` |
| **AlertaCritico** | `/alertas` | Alerta de um sensor (`@ManyToOne`): `descricao`, `tipoAlerta`, `nivelCriticidade`, `resolvido`, `timestamp` |

---

## Pré-requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| Java (JDK) | 17 ou superior | Rodar a API |
| Maven | 3.9+ (opcional — o backend traz o wrapper `./mvnw`) | Build da API |
| Node.js | 20 LTS ou superior (com npm) | Rodar o app |
| Expo CLI | usada via `npx expo` (não precisa instalar global) | Servidor do app |
| Git | qualquer | Clonar os repositórios |
| Navegador (Chrome) / emulador Android / celular | — | Abrir o app |

---

## Como executar

### 1. Clonar os dois repositórios

```bash
git clone https://github.com/GeovanaPederneschi/backend-gs-1-mobile.git
git clone https://github.com/GeovanaPederneschi/gs-moblie-frontend.git
```

### 2. Subir o backend (porta `8080`)

```bash
cd backend-gs-1-mobile
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
# ou, com Maven instalado:  mvn spring-boot:run
```

Também é possível abrir a pasta no IntelliJ IDEA e executar a classe `OrbitalMissionControlApplication`.

Quando o log mostrar `Tomcat started on port 8080`, confirme no navegador (ou Postman/Insomnia):

- http://localhost:8080/sensores → JSON com a lista de sensores
- http://localhost:8080/alertas → JSON com a lista de alertas

> Na primeira execução o banco H2 (`./data/orbital.mv.db`) é criado e populado com 3 sensores, 3 leituras e 3 alertas de exemplo. Os dados cadastrados depois ficam salvos em arquivo e sobrevivem ao reinício da API. Para voltar ao estado inicial, pare a API e apague a pasta `data/`.

### 3. Subir o frontend

Em outro terminal:

```bash
cd gs-moblie-frontend
npm install
npx expo start
```

No terminal do Expo:

- pressione **`w`** para abrir no navegador (recomendado — `http://localhost:8081`);
- pressione **`a`** para abrir no emulador Android;
- ou leia o QR Code com o Expo Go (o Expo Go precisa suportar o SDK 56 do projeto; ver `BASE_URL` para celular físico).

Para simular um celular no navegador: `F12` → `Ctrl + Shift + M` → escolha **iPhone 12**.

> Dependências: o Axios foi adicionado com `npx expo install axios`; ao clonar basta `npm install` (as versões estão travadas no `package-lock.json`).

---

## `BASE_URL`

Definida em [`src/services/api.ts`](src/services/api.ts):

```ts
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");
```

| Onde o app roda | BASE_URL | O que fazer |
|---|---|---|
| Navegador (web) / simulador iOS | `http://localhost:8080` | nada (padrão) |
| Emulador Android | `http://10.0.2.2:8080` | nada (detectado por `Platform.OS`) — `10.0.2.2` é o "localhost" do PC visto de dentro do emulador |
| Celular físico (Expo Go) | `http://SEU_IP:8080` | descubra o IP do PC (`ipconfig` no Windows / `ifconfig` ou `ip a` no Linux/macOS), deixe celular e PC na mesma rede Wi-Fi e rode o Expo com a variável abaixo |

```bash
# macOS / Linux
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080 npx expo start
# Windows (PowerShell)
$env:EXPO_PUBLIC_API_URL="http://192.168.0.10:8080"; npx expo start
```

Configuração do Axios (`api.ts`): `baseURL`, `timeout: 10000` (10 s) e header `Content-Type: application/json`. O backend libera o acesso do app com `@CrossOrigin` em todos os controllers.

---

## Endpoints usados pelo app

| Método | Endpoint | Função do serviço | Tela |
|---|---|---|---|
| GET | `/sensores` | `sensorService.listar()` | ListaSensoresScreen |
| POST | `/sensores` | `sensorService.criar(sensor)` | CadastroSensorScreen |
| GET | `/sensores/{id}` | `sensorService.buscarPorId(id)` | (disponível no serviço) |
| GET | `/leituras` | `leituraService.listar()` | ListaLeiturasScreen |
| POST | `/leituras` | `leituraService.criar(leitura)` | CadastroLeituraScreen |
| GET | `/leituras/{id}` | `leituraService.buscarPorId(id)` | (disponível no serviço) |
| GET | `/alertas` | `alertaService.listar()` | ListaSensoresScreen (contador) e ListaAlertasScreen |
| GET | `/alertas/{id}` | `alertaService.buscarPorId(id)` | DetalheAlertaScreen |
| PUT | `/alertas/{id}` | `alertaService.resolver(alerta)` | DetalheAlertaScreen |

A API também expõe `PUT` e `DELETE` para as três entidades (CRUD completo) — ver o [README do backend](https://github.com/GeovanaPederneschi/backend-gs-1-mobile#endpoints).

---

## Arquitetura do app

```
App.tsx                         → Stack Navigator com as 6 telas
src/
├── screens/                    → telas (estado, loading, erro) — NÃO chamam Axios nem montam URL
├── components/                 → SensorCard, LeituraCard, AlertaCard
├── types/                      → tipos TypeScript das entidades (sensor, leitura, alerta)
└── services/
    ├── api.ts                  → instância do Axios (baseURL, timeout, Content-Type)
    ├── sensorService.ts        → listar, buscarPorId, criar (Omit<SensorModulo, "id">)
    ├── leituraService.ts       → listar, buscarPorId, criar
    └── alertaService.ts        → listar, buscarPorId, criar, resolver (PUT)
```

### Fluxo tela → serviço → endpoint

| Tela | Ação do usuário | Serviço | Endpoint |
|---|---|---|---|
| **ListaSensoresScreen** (inicial) | abrir / voltar para a tela | `sensorService.listar()` + `alertaService.listar()` (em `Promise.all`) | `GET /sensores` + `GET /alertas` |
| **CadastroSensorScreen** | tocar em **Salvar Sensor** | `sensorService.criar({ nome, tipo, localizacao, ativo })` | `POST /sensores` |
| **CadastroLeituraScreen** | tocar em um sensor → **Registrar Leitura** | `leituraService.criar({ sensorId, valor, ... })` | `POST /leituras` (body `{ sensor: { id }, ... }`) |
| **ListaLeiturasScreen** | botão **Ver Leituras** | `leituraService.listar()` | `GET /leituras` |
| **ListaAlertasScreen** | botão **Ver Alertas** | `alertaService.listar()` | `GET /alertas` |
| **DetalheAlertaScreen** | tocar em um alerta | `alertaService.buscarPorId(id)` | `GET /alertas/{id}` |
| **DetalheAlertaScreen** | **Marcar como Resolvido** | `alertaService.resolver(alerta)` | `PUT /alertas/{id}` |

As telas de lista recarregam os dados da API **sempre que ganham foco** (ao abrir e ao voltar de um cadastro), então um registro novo aparece imediatamente.

### Navegação

```
ListaSensoresScreen (tela inicial)
├── + Novo Sensor   → CadastroSensorScreen  → salvar → volta e recarrega a lista
├── Ver Alertas     → ListaAlertasScreen    → card → DetalheAlertaScreen → Marcar Resolvido
├── Ver Leituras    → ListaLeiturasScreen
└── card do sensor  → CadastroLeituraScreen → salvar → volta para a lista
```

---

## Roteiro de teste (o mesmo do vídeo)

### 1. Backend no ar
Suba a API e abra http://localhost:8080/sensores — deve aparecer o JSON com os sensores.

### 2. App listando a API
Rode `npx expo start` e pressione `w`. A tela **Sensores da Missão** mostra os mesmos sensores do JSON, e o botão **Ver Alertas (n)** mostra quantos alertas não resolvidos existem.

### 3. Cadastrar no app e conferir na API
1. No app, toque em **+ Novo Sensor**.
2. Preencha, por exemplo: Nome `Sensor de Navegação NAV-02`, Tipo `navegacao`, Localização `Módulo B`, Status `Ativo`.
3. Toque em **Salvar Sensor** → o app faz `POST /sensores`, volta para a lista e o sensor novo já aparece.
4. Atualize http://localhost:8080/sensores no navegador → o sensor aparece no JSON com o `id` gerado pelo banco.
5. (Opcional) Toque no sensor, registre uma leitura e confira em http://localhost:8080/leituras; abra um alerta, marque como resolvido e confira `"resolvido": true` em http://localhost:8080/alertas.

Também é possível conferir no console do H2: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/orbital`, usuário `sa`, senha em branco) → `SELECT * FROM SENSORES_MODULOS;`.

### 4. Parar o backend e ver o app sem dados
1. Pare a API: `Ctrl + C` no terminal do `spring-boot:run` (ou o botão **Stop** ■ do IntelliJ).
2. Confirme que http://localhost:8080/sensores não responde mais.
3. Recarregue o app (`F5` no navegador ou `r` no terminal do Expo).
4. Resultado esperado: a tela mostra o indicador de carregamento e, em seguida, a mensagem em vermelho **"Erro ao carregar dados. Verifique se a API está rodando."** — **nenhum sensor é exibido**, pois o app não possui dados mockados nem cache.
5. O mesmo acontece em **Ver Alertas** / **Ver Leituras** e ao tentar salvar um cadastro ("Erro ao salvar sensor. Verifique a conexão com a API.").
6. Suba a API de novo e volte para a tela inicial: os dados reaparecem.

### Como o erro é tratado
Toda chamada nas telas segue o padrão `try / catch / finally`:
- **loading:** `ActivityIndicator` enquanto a requisição está em andamento;
- **erro:** no `catch` a lista é esvaziada e a mensagem de erro é exibida (backend parado, IP errado ou timeout de 10 s);
- **finally:** sempre desliga o loading, deixando a tela em um estado estável (sucesso ou erro).

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| App | React Native 0.85 + Expo SDK 56, TypeScript, React Navigation (Stack), Axios, React Native Web |
| API | Java 17, Spring Boot 3.2.5 (Web, Data JPA), H2 Database (arquivo), Lombok, Maven |
