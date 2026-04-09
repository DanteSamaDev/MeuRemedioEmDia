# Changelog

Histórico de versões do **Meu Remédio em Dia**.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
Versionamento [SemVer](https://semver.org/lang/pt-BR/): `MAJOR.MINOR.PATCH`

---

## [0.2.0] - 2026-04-09

### ✨ Adicionado

#### Componente Principal (TelaPrincipal.tsx)
- Tela principal com 4 abas funcionais
- Sistema robusto de gestão de medicamentos com controle de estoque
  - Medicamentos por período (Manhã, Tarde, Noite)
  - Marcação inteligente de doses tomadas
  - Cálculo automático de dias restantes
  - Alertas de baixo estoque com notificação diária
  - Notas/observações por medicamento

#### Portal de Direitos em Saúde
- 7 temas educativos verificados:
  - Medicamentos gratuitos pelo SUS
  - Genéricos e similares para economia
  - Cirurgias eletivas e procedimentos gratuitos
  - Contestação de negativas (direitos judiciais)
  - Ações judiciais para acesso (Lei 8.080/90)
  - Isenções fiscais e benefícios
  - Tratamento em instituições filantrópicas

#### Ações Rápidas de Emergência
- 9 canais de contato urgente:
  - SAMU (192), Bombeiros (193)
  - Disque Saúde (136), Central SUS (135)
  - Conecte SUS, Defensoria Pública
  - Ministério Público Federal
  - Anvisa e Portais Oficiais

#### Farmácias Conveniadas
- 8 farmácias e canais iniciais:
  - Drogasil, Drogaria São Paulo, Pague Menos
  - Farmácia Real, Farmácia Associada
  - Genéricos, SUS, Programa Farmácia Popular

### 📖 Documentação
- `README.md` profissional com overview completo
- `CONTRIBUTING.md` com guia detalhado de contribuição
- `CODE_OF_CONDUCT.md` com princípios de comunidade
- `SECURITY.md` com conformidade LGPD
- `CHANGELOG.md` (este arquivo)

### 🛠️ Infraestrutura
- TypeScript com tipos estritos (`noImplicitAny`)
- Jest para testes unitários
- Prettier para formatação
- ESLint para linting
- `package.json` com dependências React Native/Expo
- `tsconfig.json` otimizado

### 🔐 Segurança & Privacidade
- ✅ Dados 100% locais no dispositivo (AsyncStorage)
- ✅ Conformidade LGPD (Portugal+Brasil)
- ✅ Sem tracking, analytics ou publicidade
- ✅ Code open source para auditoria
- ✅ Nenhuma credencial endurecida

---

## [0.1.0] - 2026-04-08 

### 🎉 Inicial
- Estrutura base do repositório
- Template inicial de projeto React Native
- Configuração de Git e GitHub
- Licença MIT

---

## Roadmap de Versões Futuras

### 0.3.0 (Q3 2026)
- [ ] Notificações push para horários de medicamentos
- [ ] Temas claro/escuro
- [ ] Testes unitários completos (cobertura > 70%)
- [ ] CI/CD automático (GitHub Actions)

### 0.4.0 (Q4 2026)
- [ ] React Navigation com stack de telas
- [ ] Home com resumo de saúde
- [ ] Autenticação local (PIN/Biometria)
- [ ] Relatórios em PDF

### 1.0.0 (2027)
- [ ] Beta fechado (100 usuários)
- [ ] Testes de UX/Acessibilidade com idosos
- [ ] Publicação Android Play Store
- [ ] Publicação iOS App Store (após aprovação)

### 1.1.0 (2027+)
- [ ] Backend opcional (sync na nuvem com consentimento)
- [ ] Relatórios para médicos
- [ ] Dashboard de adesão
- [ ] Integração com wearables

---

## Notas de Desenvolvimento

### 🐛 Bugs Conhecidos
- Nenhum conhecido atualmente

### ⚠️ Limitações Atuais
- MVP local apenas (sem cloud sync)
- Dados de farmácias/direitos fixos (sem API atualização)
- Sem notificações push ainda
- Sem autenticação/login

### 🔄 Próximos Passos
- Testes unitários completos
- Pesquisa de UX com usuários reais
- Integração com APIs governamentais SUS
- Beta público

---

## Como Contribuir

Quer ajudar? Leia [`CONTRIBUTING.md`](./CONTRIBUTING.md)

Tipos de contribuição bem-vindos:
- 🐛 Reportar bugs
- ✨ Sugerir features
- 📝 Melhorar documentação
- 🧪 Adicionar testes
- 💻 Contribuir código
- 🎯 Feedback de UX

---

## Dependências Principais

```json
{
  "react": "^18.2.0",
  "react-native": "^0.73.0",
  "expo": "^50.0.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "typescript": "^5.3.0"
}
```

---

## Suporte e Contato

- 🐛 Issues: [GitHub Issues](https://github.com/DanteSamaDev/MeuRemedioEmDia/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/DanteSamaDev/MeuRemedioEmDia/discussions)
- 🔐 Segurança: [`SECURITY.md`](./SECURITY.md)
- 📖 Contribuição: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

**Made with ❤️ for patients by [DanteSamaDev](https://github.com/DanteSamaDev)**

Última atualização: 09/04/2026
