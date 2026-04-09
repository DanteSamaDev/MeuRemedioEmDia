# 🔐 Política de Segurança

## 1. Conformidade Legal

### Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)

Este projeto **segue rigorosamente a LGPD**, a lei de privacidade e proteção de dados do Brasil.

**Princípios aplicados:**
- **Transparência:** Usuário sabe exatamente quais dados são coletados e como são usados
- **Necessidade:** Coletamos apenas dados absolutamente necessários
- **Consentimento:** Todo compartilhamento de dados requer consentimento explícito
- **Segurança:** Dados são protegidos com as melhores práticas
- **Direitos:** Usuário pode acessar, corrigir ou deletar seus dados

### Lei Brasileira de Direitos do Paciente

O app respeita:
- Resolução CFM nº 1.642/2022 (Digitais de Saúde)
- Portaria nº 8/2017 do Ministério da Saúde (Segurança da Informação)
- Código de Ética Médica

---

## 2. Estratégia de Segurança de Dados

### 🟢 Dados Locais (No Seu Dispositivo)

**Status:** ✅ Implementado

Todos os dados são salvos **localmente no seu dispositivo** usando `AsyncStorage`:
- Medicamentos e horários
- Progresso diário
- Notas pessoais
- Histórico de doses

**Vantagens:**
- Privacidade garantida (seu dados nunca saem do seu aparelho)
- Funciona offline
- Controle total

**Como protegemos:**
- Não há sincronização com servidores por padrão
- Você é o único com acesso
- Recomendamos backup periódico

### 🟡 Sincronização na Nuvem (Futuro - Opcional)

**Status:** ⏳ Em planejamento para Fase 3

Quando implementarmos sincronização opcional:
- ✅ Será **completamente opcional** (você escolhe)
- ✅ Primeiro, pediremos **consentimento explícito**
- ✅ Dados serão **criptografados** antes de sair do dispositivo
- ✅ Você pode **desabilitar** a qualquer momento

---

## 3. Dados Pessoais e Sensíveis

### 🚫 O Que NÃO Coletamos

- ❌ Informações de identificação pessoal (CPF, RG)
- ❌ Dados de saúde detalhados (diagnósticos específicos)
- ❌ Histórico médico completo
- ❌ Dados de geolocalização
- ❌ Dados de navegação/cookies
- ❌ Vídeos/fotos de você
- ❌ Biometria (impressão digital, rosto)

### ✅ O Que Coletamos Localmente

- Nome do medicamento (você coloca)
- Dosagem prescrita (você coloca)
- Horário (você coloca)
- Observações médicas (você coloca)
- Progresso diário (Tomado/Não Tomado)

**Nada disso sai do seu dispositivo sem seu consentimento explícito.**

---

## 4. Segurança no Código

### Boas Práticas Implementadas

- ✅ **TypeScript:** Tipagem forte previne erros
- ✅ **Validação:** Entrada de dados validada
- ✅ **Sem Dados Hardcoded:** Nenhuma credencial no código
- ✅ **Dependencies Auditadas:** `npm audit` regular
- ✅ **Sem Tracking:** Nenhum Google Analytics, Mixpanel, etc.
- ✅ **Sem Publicidade:** Nenhum anúncio rastreador

### O Que Monitorizamos

Nós **NÃO** monitorizamos:
- ❌ Quais medicamentos você toma
- ❌ Sua localização
- ❌ Sites que visita
- ❌ Quanto tempo usa o app
- ❌ Suas buscas

---

## 5. Como Reportar Vulnerabilidades

Encontrou um problema de segurança? **NÃO abra issue pública!**

### 🔒 Reporte Privado

1. **Não** descreva detalhes públicos do vulnerability
2. **Envie** e-mail para: `security@...` (a ser definido)
3. **Inclua:**
   - Título da vulnerabilidade
   - Descrição técnica
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de mitigação (opcional)

### ⏱️ Processo

- Você reporta → Recebemos em 24h
- Nós investigamos → Resposta em 72h
- Nós fixamos → Patch em até 2 semanas
- Publicamos → Credito ao reporter (se desejado)

---

## 6. Escopo de Segurança

### In Scope (Protegido)

- Persistência local de dados
- Validação de inputs
- Tratamento de erros
- Links externos/telefones
- Injeção de código

### Out of Scope (Fora de escopo)

- Vulnerabilidades de zero-day no React Native
- Vulnerabilidades do SO (iOS/Android)
- Dispositivos com jailbreak/rooteados
- Ataques físicos ao dispositivo

---

## 7. Princípios de Privacidade by Design

### No Desenvolvimento

✅ Privacy Checklist:
- [ ] Pergunta: Preciso realmente deste dado?
- [ ] Se sim: Consigo manter localmente?
- [ ] Se enviando: É criptografado?
- [ ] Usuário pode deletar este dado?
- [ ] Tem documentação clara?

### Para Usuários

**Sua Privacidade = Nossa Responsabilidade**

- Você controla seus dados
- Você pode deletar tudo a qualquer momento
- Você pode fazer backup local
- Você pode exportar seus dados
- Você pode desabilitar sincronização

---

## 8. Segurança de Endpoints (Futuro)

Quando adicionarmos servidor (Fase 3):

- ✅ HTTPS/TLS obrigatório (sem HTTP)
- ✅ Certificados SSL válidos
- ✅ Rate limiting contra ataques
- ✅ CORS configurado restritivamente
- ✅ SQL Injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Autenticação OAuth2

---

## 9. Atualização de Dependências

### Monitoramento

- Verificar vulnerabilidades mensalmente
- `npm audit` exec automaticamente
- Atualizar dependencies críticas dentro de 48h
- Testar antes de publicar

### Versioning Semântico

- `MAJOR.MINOR.PATCH`
- Consertaremos problemas de segurança em versão PATCH

---

## 10. Conformidade e Auditorias

### Auditorias Planejadas

- [ ] Auditoria de segurança independente (Fase 1)
- [ ] Certificação LGPD (Fase 3)
- [ ] Teste de penetração (Fase 3)

### Documentação

- Esta política é revisada a cada 6 meses
- Changelog atualizado com mudanças de segurança
- Documentação aberta no GitHub

---

## 11. Responsabilidades

### Nossa Responsabilidade
- Proteger dados que estão sob nosso controle
- Responder rapidamente a relatórios de segurança
- Manter dependências atualizadas
- Documentar políticas claramente

### Sua Responsabilidade
- Usar app em dispositivo seguro
- Manter sistema operacional atualizado
- Não compartilhar seu smartphone
- Ativar autenticação no seu dispositivo
- Fazer backup dos seus dados

---

## 12. Suporte e Contato

- **Email de Segurança:** security@... (a ser definido)
- **GitHub Issues:** [Issues](https://github.com/DanteSamaDev/MeuRemedioEmDia/issues) (não para vulnerabilidades!)
- **Discussões:** [Discussões](https://github.com/DanteSamaDev/MeuRemedioEmDia/discussions)

---

**Última atualização:** Abril de 2026
**Status:** Ativo e Revisado Regularmente

---

**Juntos, protegemos a privacidade de pacientes brasileiros. ❤️**
