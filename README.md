# 💊 Meu Remédio em Dia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)]()

Aplicativo React Native focado em **adesão ao tratamento medicamentoso**, **orientação de direitos em saúde** e **acesso rápido** a canais de urgência e farmácias conveniadas.

> **🎯 Missão:** Empoderar pacientes com ferramentas de autocuidado e informações de saúde, respeitando privacidade e direitos fundamentais.

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
