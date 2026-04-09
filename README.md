# 💊 Meu Remédio em Dia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)]()
[![Health Tech](https://img.shields.io/badge/Tech-HealthTech-blue)]()

**Plataforma móvel que empoderia pacientes com ferramentas inteligentes de autocuidado, orientação clara sobre direitos em saúde e acesso rápido a recursos de urgência, medicamentos e informações.**

> **🎯 Missão:** Reduzir a não-aderência ao tratamento medicamentoso e garantir que pacientes conheçam seus direitos de acesso a saúde pública de qualidade, cirurgias gratuitas e medicamentos sem custo.

---

## 🏥 Visão Geral da Plataforma

O **Meu Remédio em Dia** é uma plataforma **GRATUITA, PRIVADA e SEGURA** desenvolvida para pacientes brasileiros que precisam:

✅ **Monitorar medicamentos** com lembretes inteligentes por período (manhã, tarde, noite)
✅ **Acompanhar estoque** e receber alertas antes de faltar remédio
✅ **Conhecer direitos** garantidos pela Constituição Federal e leis de saúde
✅ **Acessar medicamentos gratuitos** pelo SUS e programas governamentais
✅ **Buscar cirurgias e procedimentos** disponibilizados publicamente
✅ **Solicitar apoio jurídico** para garantir acesso a saúde (via Defensoria Pública)
✅ **Encontrar farmácias** com preços acessíveis, genéricos e programas de desconto
✅ **Marcar emergências** com acesso rápido a SAMU, Disque Saúde e atendimentos urgentes

---

## 💻 Stack Técnica

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React Native** | >= 0.73 | Framework mobile cross-platform (Android e iOS) |
| **Expo** | >= 50.0 | Build, deploy e testagem |
| **React** | >= 18.2 | UI components |
| **TypeScript** | >= 5.3 | Type safety |
| **AsyncStorage** | >= 1.21 | Persistência local em dispositivo |
| **Prettier** | - | Formatação consistente |
| **Jest** | >= 29.7 | Testes unitários |

---

## 📋 Pré-requisitos

- **Node.js** >= 18.0 (recomendado v20+)
- **npm** >= 9.0 ou **yarn** >= 3.6
- **Git** para versionamento
- (Opcional) **Android Studio** para emulador/device Android
- (Opcional) **Xcode** para emulador/device iOS (macOS apenas)

---

## ⚙️ Instalação Rápida

### 1. Clonar repositório

```bash
git clone https://github.com/DanteSamaDev/MeuRemedioEmDia.git
cd MeuRemedioEmDia
```

### 2. Instalar dependências

```bash
npm install --legacy-peer-deps
```

> **Por quê `--legacy-peer-deps`?** Alguns pacotes de teste têm conflitos de versão que resolvemos com este flag.

### 3. Type-check e testes

```bash
npm run type-check
npm test
```

---

## 🚀 Como Rodar em Desenvolvimento

### Web (via Expo)
```bash
npm run web
```

### Android (emulador ou device)
```bash
npm run android
```

### iOS (emulador ou device, macOS apenas)
```bash
npm run ios
```

### Iniciar Metro CLI (React Native)
```bash
npm start
```

---

## 📱 Funcionalidades Principais

### 1️⃣ **Gestão de Medicamentos**
- ✅ Registre todos os medicamentos com dosagem, horário e período
- ✅ Marque doses tomadas com progresso visual
- ✅ Controle inteligente de estoque com cálculo de dias restantes
- ✅ Alertas de baixo estoque (push notifications em desenvolvimento)
- ✅ Notas por medicamento (modo de preparo, efeitos colaterais, etc.)

### 2️⃣ **Portal Educativo de Direitos em Saúde**
Conteúdo verificado e atualizado sobre:

- 📋 **SUS e Medicamentos Gratuitos**
  - Como acessar medicamentos pelo SUS
  - Identificar medicamentos genéricos e mais baratos
  - Programa Farmácia Popular
  - Farmácias de manipulação com desconto

- ⚖️ **Direitos Judiciais**
  - Quando a negativa de medicamento é ilegal
  - Como pedir ajuda à Defensoria Pública (GRÁTIS)
  - Ações judiciais para garantir acesso
  - Liminar e tutela de urgência (decisão rápida)

- 🏥 **Cirurgias e Procedimentos Públicos**
  - Como solicitar cirurgias pelo SUS
  - Filas de espera e prioridades
  - Alternativas e instituições filantrópicas

- 💰 **Isenções e Benefícios**
  - Isenção de ICMS para medicamentos
  - Programas estaduais de subsídio
  - Descontos para aposentados e deficientes

### 3️⃣ **Ações Rápidas de Emergência**
Botões de contato direto com:
- **SAMU** (192) para ambulância
- **Bombeiros** (193) para resgate
- **Disque Saúde** (136) para orientações
- **Defensoria Pública** (links por estado)
- **Portais Oficiais** (Anvisa, SUS, etc.)

### 4️⃣ **Busca de Farmácias Conveniadas**
- Farmácias com app e delivery
- Programas de genéricos 
- Medicamentos SUS gratuitos
- Farmácias de manipulação
- Filtro por região disponibilidade

---

## 📁 Estrutura do Projeto

```
MeuRemedioEmDia/
├── TelaPrincipal.tsx              # Componente React principal
├── package.json                   # Dependências e scripts npm
├── tsconfig.json                  # Configuração TypeScript
├── .editorconfig                  # Config do editor (indentação, etc.)
├── .prettierrc.json               # Config de formatação Prettier
├── .gitignore                     # Arquivos ignorados pelo Git
├── LICENSE                        # MIT License
├── README.md                      # Este arquivo
├── CHANGELOG.md                   # Histórico de versões
├── CONTRIBUTING.md                # Guia para contribuidores
├── CODE_OF_CONDUCT.md             # Código de conduta da comunidade
├── SECURITY.md                    # Política de segurança e LGPD
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md          # Template para reportar bugs
    │   └── feature_request.md     # Template para sugerir features
    └── PULL_REQUEST_TEMPLATE.md   # Template para pull requests
```

---

## 🗺️ Roadmap de Desenvolvimento

### 🟢 **Fase 1: MVP Local (Atual - Em Discussão)**
- [x] Tela principal com 4 abas funcionais
- [x] Gestão completa de medicamentos
- [x] Portal educativo com 7 temas de direitos
- [x] Ações rápidas com links úteis
- [x] Busca de farmácias conveniadas
- [x] Persistência 100% local com AsyncStorage
- [ ] Testes unitários completos
- [ ] Lint e type-check automáticos

### 🟡 **Fase 2: Aplicação Mobile Completa**
- [ ] Navigação com React Navigation
- [ ] Home com resumo do dia
- [ ] Notificações push para horários de medicamentos
- [ ] Temas claro/escuro
- [ ] Autenticação local (PIN/Biometria)
- [ ] Relatórios em PDF dos medicamentos
- [ ] Build e publicação no Android Play Store

### 🟠 **Fase 3: Backend Opcional (LGPD-Compliant)**
- [ ] Login seguro com OAuth2
- [ ] Sincronização na nuvem (com consentimento explícito)
- [ ] Backup criptografado de dados
- [ ] Relatórios para médicos (compartilhamento opcional)
- [ ] Dashboard de adesão ao tratamento

### 🔵 **Fase 4: Integrações Estratégicas**
- [ ] API com dados oficiais SUS
- [ ] Integração com apps de farmácias (Drogasil, DragonShop, etc.)
- [ ] Sincronização com smartwatches (WearOS, Apple Watch)
- [ ] Build e publicação iOS

---

## 🔐 Segurança e Privacidade

### Princípios Fundamentais

1. **Privacy by Design**
   - Todos os dados são salvos **localmente no dispositivo**
   - NENHUM dado pessoal ou médico é enviado para servidor por padrão
   - Você controla 100% de seus dados

2. **LGPD Compliance (Lei Geral de Proteção de Dados)**
   - Conformidade com legislação brasileira
   - Consentimento explícito para qualquer coleta/compartilhamento
   - Direito de acesso, exclusão e portabilidade dos dados
   - Notificação de vazamento em até 72h

3. **Transparência Total**
   - Código aberto no GitHub (você pode auditar)
   - Sem trackers, analytics ou publicidades
   - Sem venda de dados a terceiros

4. **Criptografia Futura**
   - Dados sensíveis podem ser emcriptados localmente
   - Sincronização na nuvem só com dados criptografados

### Dados Coletados

- **Localmente no Dispositivo**: Medicamentos, horários, estoque, progresso
- **Enviado para Servidor**: Nada por padrão
- **Opcional e Consentido**: Analytics anônimo apenas se usuário autorizar

### Como Reportar Vulnerabilidades

Veja [`SECURITY.md`](./SECURITY.md) para processo confidencial.

---

## 🤝 Como Contribuir

Adoramos contribuições que melhoram a vida de pacientes! 🎉

### Processo de Contribuição

1. **Faça um Fork** do projeto
2. **Crie uma branch** descritiva:
   ```bash
   git checkout -b feat/novo-direito-saude
   # ou
   git checkout -b fix/erro-estoque-critico
   ```
3. **Comit suas mudanças** com mensagem clara:
   ```bash
   git commit -m "feat: adicionar informações sobre medicamentos psiquiátricos SUS"
   ```
4. **Faça Push** para sua branch:
   ```bash
   git push origin feat/novo-direito-saude
   ```
5. **Abra um Pull Request** descrevendo seu trabalho

### Diretrizes Importantes

📖 **Leia primeiro:**
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Fluxo de contribuição
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) - Código de conduta

✅ **Seu PR deve ter:**
- Mensagem de commit descritiva
- Código limpo e bem tipado (TypeScript)
- Testes (quando aplicável)
- Atualização do README se necessário
- Nenhum segredo/credencial commitado

🎯 **Focos principais:**
- **Acessibilidade**: Fonte legível, botões grandes, bom contraste (público idoso)
- **Clareza**: Linguagem simples sobre temas complexos de saúde
- **Segurança**: Nunca adicione dados reais, nenhuma credencial
- **Qualidade**: Type-safe, sem `any`, bem testado

---

## 📄 Licença

Este projeto está sob licença **MIT** - totalmente grátis e open source.
Veja [`LICENSE`](./LICENSE) para detalhes.

---

## 📞 Suporte e Contato

- **Issues no GitHub**: [Abra uma issue](https://github.com/DanteSamaDev/MeuRemedioEmDia/issues)
- **Discussões**: [GitHub Discussions](https://github.com/DanteSamaDev/MeuRemedioEmDia/discussions)
- **Segurança**: Reporte em [`SECURITY.md`](./SECURITY.md)
- **Ideias**: Crie uma Issue com tag `enhancement`

---

## 🙏 Agradecimentos

Construído com ❤️ e paixão para garantir que **pacientes brasileiros tenham acesso equitativo a saúde**.

Especial agradecimento aos **profissionais de saúde, advogados do SUS e ativistas de direitos do paciente** que nos informaram sobre as maiores dificuldades enfrentadas.

---

**Vamos juntos melhorar a vida de milhões de pacientes! 💪**

**Made with ❤️ by [DanteSamaDev](https://github.com/DanteSamaDev) e comunidade**

---

## 📑 Sumário

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Stack Técnica](#%EF%B8%8F-stack-técnica)
- [📋 Pré-requisitos](#-pré-requisitos)
- [⚙️ Instalação e Setup](#%EF%B8%8F-instalação-e-setup)
- [🚀 Como Começar](#-como-começar)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🗺️ Roadmap](#%EF%B8%8F-roadmap)
- [🔐 Segurança e Privacidade](#-segurança-e-privacidade)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)
- [📞 Contato](#-contato)

---

## ✨ Funcionalidades

### Gestão de Medicamentos
- ✅ **Organização por período** (Manhã, Tarde, Noite)
- ✅ **Marcação de dose tomada** com progresso visual diário
- ✅ **Controle inteligente de estoque** com cálculo de dias restantes
- ✅ **Alertas de low stock** quando estoque está próximo do mínimo
- ✅ **Observações por medicamento** (modo de preparo, restrições, etc.)

### Portal de Direitos em Saúde
- ✅ **Orientações sobre SUS** e acesso a medicamentos gratuitos
- ✅ **Informações sobre direitos judiciais** em saúde
- ✅ **Guia de benefícios e isenções** fiscais
- ✅ **Busca inteligente** por palavra-chave

### Ações Rápidas de Urgência
- ✅ **Botões de contato rápido** (SAMU, Disque Saúde, etc.)
- ✅ **Links úteis** para portais oficiais de saúde
- ✅ **Checklist de documentos** para situações de emergência

### Busca de Farmácias Conveniadas
- ✅ **Consulta de farmácias parceiras** com delivery
- ✅ **Filtro por app e disponibilidade de entrega**
- ✅ **Links diretos** para contato e compra online

### Privacidade e Dados Locais
- ✅ **Persistência 100% local** no dispositivo
- ✅ **Sem coleta de dados pessoais** por padrão
- ✅ **Backend opcional e com consentimento** (conforme LGPD)

---

## 🛠️ Stack Técnica

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React Native** | >= 0.73 | Framework mobile cross-platform |
| **Expo** | >= 50.0 | Build e deployment |
| **React** | >= 18.2 | UI library |
| **TypeScript** | >= 5.3 | Tipagem estrita |
| **AsyncStorage** | >= 1.21 | Persistência local |
| **Prettier** | - | Formatação de código |
| **Jest** | >= 29.7 | Testes unitários |

---

## 📋 Pré-requisitos

- **Node.js** >= 18.0 (recomendado v20+)
- **npm** >= 9.0 ou **yarn** >= 3.6
- **Git** para versionamento
- (Opcional) **Android Studio** para emulador Android
- (Opcional) **Xcode** para emulador iOS

---

## ⚙️ Instalação e Setup

### 1. Clonar o repositório

```bash
git clone https://github.com/DanteSamaDev/MeuRemedioEmDia.git
cd MeuRemedioEmDia
```

### 2. Instalar dependências

```bash
npm install --legacy-peer-deps
```

> **Nota:** O `--legacy-peer-deps` é necessário devido a conflitos de versão entre pacotes de teste.

### 3. Verificar tipos TypeScript

```bash
npm run type-check
```

### 4. Executar testes (opcional)

```bash
npm test
```

---

## 🚀 Como Começar

### Rodando em desenvolvimento

#### Web (via Expo)
```bash
npm run web
```

#### Android (emulador)
```bash
npm run android
```

#### iOS (emulador, macOS apenas)
```bash
npm run ios
```

#### React Native CLI
```bash
npm start
```

---

## 📁 Estrutura do Projeto

```
MeuRemedioEmDia/
├── TelaPrincipal.tsx          # Componente principal React
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── .editorconfig              # Configuração do editor
├── .prettierrc.json           # Configuração Prettier
├── .gitignore                 # Arquivos ignorados pelo Git
├── .github/                   # Templates e CI/CD
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── LICENSE                    # Licença MIT
├── README.md                  # Este arquivo
├── CHANGELOG.md               # Histórico de versões
├── CONTRIBUTING.md            # Guia de contribuição
├── CODE_OF_CONDUCT.md         # Código de conduta
└── SECURITY.md                # Política de segurança
```

---

## 🗺️ Roadmap

### Fase 1: MVP Local (Atual)
- [x] Tela principal com gestão de medicamentos
- [x] Portal educativo de direitos em saúde
- [x] Ações rápidas de urgência
- [x] Busca de farmácias conveniadas
- [x] Persistência local com AsyncStorage

### Fase 2: Aplicação Mobile
- [ ] Setup de navegação (React Navigation)
- [ ] Autenticação local (PIN/Biometria)
- [ ] Notificações push para horários
- [ ] Temas claro/escuro
- [ ] Publicação Android

### Fase 3: Backend Opcional (LGPD)
- [ ] Auth segura com OAuth2
- [ ] Sincronização na nuvem (com consentimento)
- [ ] Relatórios para médicos
- [ ] Backup criptografado

### Fase 4: Integrações
- [ ] API SUS para dados de medicamentos
- [ ] Integração com apps de farmácias
- [ ] Sincronização com smartwatches
- [ ] Publicação iOS

---

## 🔐 Segurança e Privacidade

### Princípios

1. **Privacy by Design**: Dados privados no dispositivo por padrão
2. **LGPD Compliant**: Conformidade com Lei Geral de Proteção de Dados (Brasil)
3. **Transparência**: Usuário sempre controla seus dados
4. **Segurança**: Criptografia para dados sensíveis (futuro)

### Dados Coletados

- **Localmente**: Medicamentos, horários, estoque (apenas no dispositivo)
- **Remotamente**: Nenhum dado por padrão
- **Opcional**: Analytics anônimo apenas com consentimento

Para mais detalhes, veja [`SECURITY.md`](./SECURITY.md).

---

## 🤝 Contribuição

Adoramos contribuições! 🎉

### Processo

1. **Fork** o projeto
2. **Crie uma branch** com sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Diretrizes

- Leia [`CONTRIBUTING.md`](./CONTRIBUTING.md) completo
- Respeite o [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- Use convenção de commits (feat:, fix:, docs:, etc.)
- Escreva mensagens de commit descritivas
- Adicione testes para novas funcionalidades

---

## 📄 Licença

Este projeto está sob a licença **MIT** - veja [`LICENSE`](./LICENSE) para detalhes.

---

## 📞 Contato

- **GitHub Issues**: [Abra uma issue](https://github.com/DanteSamaDev/MeuRemedioEmDia/issues)
- **Discussões**: [GitHub Discussions](https://github.com/DanteSamaDev/MeuRemedioEmDia/discussions)
- **Segurança**: Envie relatórios para [`SECURITY.md`](./SECURITY.md)

---

## 🙏 Agradecimentos

Construído com ❤️ para empoderar pacientes e melhorar a adesão ao tratamento medicamentoso.

---

**Made with ❤️ by [DanteSamaDev](https://github.com/DanteSamaDev)**
diff --git a/README.md b/README.md
index f82548e3b22ecce11be4b5fa83306277144b34cf..7fae1b06352caf560609fcb94ff5f93329295a7f 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,53 @@
-# MeuRemedioEmDia
\ No newline at end of file
+# MeuRemedioEmDia
+
+Aplicativo React Native focado em adesão ao tratamento, orientação de direitos em saúde e acesso rápido a canais de urgência e farmácias conveniadas.
+
+> **Status atual:** base funcional de UI/UX e lógica local, pronta para evolução para publicação em lojas.
+
+## ✨ Funcionalidades atuais
+
+- **Gestão de medicamentos por período** (manhã, tarde, noite).
+- **Marcação de dose tomada** com progresso diário.
+- **Controle de estoque por medicamento** com aviso de baixo estoque.
+- **Portal de direitos em saúde** com busca.
+- **Ações rápidas de urgência** (telefones e links úteis).
+- **Busca de farmácias conveniadas** com indicação de app e entrega.
+- **Persistência local no aparelho** via `AsyncStorage`.
+
+## 🧱 Estrutura do repositório
+
+```txt
+.
+├── TelaPrincipal.tsx
+├── README.md
+├── LICENSE
+├── CHANGELOG.md
+├── CONTRIBUTING.md
+├── CODE_OF_CONDUCT.md
+├── SECURITY.md
+├── .editorconfig
+├── .prettierrc.json
+└── .gitignore
+```
+
+## 🚀 Como evoluir este projeto para produção
+
+1. Criar base de app RN/Expo com navegação.
+2. Integrar esta tela como módulo principal.
+3. Migrar persistência para armazenamento local criptografado.
+4. Adicionar backend opcional com consentimento (LGPD).
+5. Configurar CI/CD (lint, typecheck, build).
+6. Publicar Android/iOS.
+
+## 🔐 Segurança e privacidade
+
+- Dados atualmente salvos localmente no dispositivo.
+- Veja políticas e processo de reporte em [`SECURITY.md`](./SECURITY.md).
+
+## 🤝 Contribuição
+
+Leia [`CONTRIBUTING.md`](./CONTRIBUTING.md) e [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
+
+## 📄 Licença
+
+Este projeto está sob a licença MIT. Consulte [`LICENSE`](./LICENSE).
