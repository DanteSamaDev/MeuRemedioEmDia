# 🤝 Contribuindo para Meu Remédio em Dia

Muito obrigado por considerar contribuir! 🎉 Cada contribuição, por menor que seja, ajuda a levar **saúde pública de qualidade** para mais pacientes.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Processo de Contribuição](#processo-de-contribuição)
- [Boas Práticas](#boas-práticas)
- [Checklist de PR](#checklist-de-pr)
- [Código de Conduta](#código-de-conduta)

---

## ❓ Como Contribuir

Existem muitas maneiras de ajudar:

- **Reportar bugs** que encontrou
- **Sugerir novas funcionalidades** ou melhorias
- **Melhorar documentação** (README, comentários, etc.)
- **Escrever testes** para funcionalidades
- **Corrigir typos** e erros de digitação
- **Traduzir** para outros idiomas
- **Revisar PRs** de outros contribuidores
- **Adicionar informações de direitos em saúde** verificadas

---

## 🎯 Tipos de Contribuição

### 🐛 Reportar Bugs

Encontrou um problema? Ótimo! Abra uma **Issue** e inclua:

1. **Título claro** do problema
2. **Descrição detalhada** do que aconteceu
3. **Passos para reproduzir** o erro
4. **Comportamento esperado** vs. **comportamento atual**
5. **Screenshots/videos** (se aplicável)
6. **Versão do app, sistema operacional e device**

### ✨ Sugerir Funcionalidades

Quer um novo recurso? Abra uma **Issue** com:

1. **Descrição clara** da funcionalidade
2. **Por que é importante** (problema que resolve)
3. **Exemplos de uso** (mockups, protótipos, etc.)
4. **Impacto esperado** para os usuários

### 📚 Melhorar Documentação

- Correções de typos e gramática
- Exemplos mais claros
- Tradução para português do Brasil
- Novos guias ou tutoriais

### 💻 Contribuir Código

Veja [Processo de Contribuição](#processo-de-contribuição) abaixo.

---

## 🔄 Processo de Contribuição

### 1. Abra uma Issue Primeiro

Antes de fazer fork e código, **abra uma Issue** para discutir:
- Certifique-se de que não há duplicata
- Valide a ideia com maintainers
- Economize seu tempo escrevendo código desnecessário

### 2. Fork o Repositório

```bash
git clone https://github.com/DanteSamaDev/MeuRemedioEmDia.git
cd MeuRemedioEmDia
```

### 3. Crie uma Branch Descritiva

Use nomes que reflitam o que você está fazendo:

```bash
# Para features
git checkout -b feat/adicionar-notificacoes

# Para fixes
git checkout -b fix/erro-calculo-dias-restantes

# Para documentação
git checkout -b docs/melhorar-README

# Para testes
git checkout -b test/adicionar-testes-medicamentos

# Para refatoração
git checkout -b refactor/modularizar-TelaPrincipal
```

### 4. Instale Dependências

```bash
npm install --legacy-peer-deps
```

### 5. Faça suas Mudanças

- Escreva código limpo e bem comentado
- Use TypeScript com tipos explícitos (sem `any`)
- Siga o padrão de formatação (Prettier)
- Adicione testes se possível

### 6. Teste Localmente

```bash
# Verificar tipos TypeScript
npm run type-check

# Rodar testes
npm test

# Testar no emulador
npm run android   # ou web/ios
```

### 7. Commit com Mensagens Claras

Use convenção de commits:

```bash
git add .
git commit -m "feat: adicionar notificações push para horários de medicamentos"
```

**Formatos aceitos:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação (sem mudanças lógicas)
- `refactor:` Mudança de código (sem mudanças de funcionalidade)
- `test:` Adicionar/atualizar testes
- `chore:` Mudanças em dependências ou scripts

### 8. Push para sua Branch

```bash
git push origin feat/adicionar-notificacoes
```

### 9. Abra um Pull Request

No GitHub, crie um PR com:

**Título:** Resumo em 50 caracteres
```
feat: adicionar notificações push para horários
```

**Descrição:**
```markdown
## 📝 Descrição
Adiciona sistema de notificações push para lembrar usuários dos horários de medicamentos.

## 🎯 Por quê?
Usuários frequentemente esquecem horários. Notificações ajudam na adesão ao tratamento.

## 🔄 Como funciona?
- Ao agendar medicamento, usuário pode habilitar notificações
- Sistema envia push 15 min antes do horário
- Usuário pode adiar ou marcar como concluído direto da notificação

## ✅ Testes
- [ ] Testado em Android real
- [ ] Testado em iOS real
- [ ] Testes unitários adicionados
- [ ] Sem erros TypeScript

## 📸 Screenshots (se aplicável)
[Imagens aqui]

## 🔗 Relacionado com
Resolve #123
```

---

## ⭐ Boas Práticas

### 🎯 Código Limpo
- Use TypeScript com tipos explícitos
- Evite `any` - seja específico!
- Nomes descritivos para variáveis e funções
- Máximo 80 caracteres por linha (preferencialmente)

### ♿ Acessibilidade
- **Público alvo:** Pacientes de todas as idades (alguns idosos)
- Fontes legíveis (mínimo 16px)
- Botões grandes (mínimo 48x48dp)
- Alto contraste entre texto e fundo
- Suporte a dark mode

### 🏥 Precisão em Saúde
- **Nunca invente informações** sobre medicamentos/direitos
- **Cite fontes** (gov.br, Anvisa, lei, etc.)
- **Revise com especialista** se possível
- **Linguagem clara** sobre temas medicais
- **Disclaimer:** "Conteúdo educativo, não substitui orientação médica"

### 🔐 Segurança
- **Nunca commite** dados pessoais ou credenciais
- **Nunca adicione** dados reais de pacientes
- **Use exemplos fictícios** (ex: "João Silva", não dados reais)
- **Revise** antes de fazer push

### 🧪 Testes
- Escreva testes para novas features
- Mantenha cobertura > 70%
- Testes de casos normais E casos extremos
- Execute localmente antes de PR

### 📖 Documentação
- Atualize README se mudou funcionalidade
- Adicione comentários em código complexo
- Documente variáveis de ambiente
- Exemplos de uso para features novas

---

## ✅ Checklist de PR

Antes de submeter seu PR, verifique:

- [ ] **Código**
  - [ ] Código limpo e bem formatado (Prettier)
  - [ ] Sem `any` no TypeScript
  - [ ] Sem `console.log` (use debug se necessário)
  - [ ] Imports organizados
  
- [ ] **Testes**
  - [ ] Testes adicionados/atualizados
  - [ ] Todos os testes passam (`npm test`)
  - [ ] Cobertura mantida ou aumentada

- [ ] **Documentação**
  - [ ] README atualizado se necessário
  - [ ] Funções complexas comentadas
  - [ ] CHANGELOG atualizado
  
- [ ] **Segurança**
  - [ ] Sem dados pessoais ou credenciais
  - [ ] Sem dependências inseguras
  - [ ] Validação de inputs (se aplicável)
  
- [ ] **Qualidade**
  - [ ] Type-check passa (`npm run type-check`)
  - [ ] Lint passa (sem avisos)
  - [ ] Sem avisos de deprecated
  
- [ ] **Fluxo**
  - [ ] Testado em Android real ou emulador
  - [ ] Testado em iOS real ou emulador
  - [ ] Mensagem de commit descritiva
  - [ ] Referência a Issue relacionada (#123)

---

## 💬 Código de Conduta

Leia [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) completo.

**TL;DR - Respeite todos:**
- Sem assédio, discriminação ou bullying
- Linguagem inclusiva e respeitosa
- Aceite críticas construtivas
- Reporte comportamento inadequado

---

## ❓ Dúvidas?

- Deixe comentário na Issue
- Abra uma Discussão no GitHub
- Consulte [SECURITY.md](./SECURITY.md) para assuntos sensíveis
- Revise issues e PRs anteri

ores para contexto

---

## 🎉 Obrigado!

Sua contribuição é importante. Juntos, estamos ajudando pacientes a terem acesso melhor a saúde. ❤️

**Made with ❤️ por [DanteSamaDev](https://github.com/DanteSamaDev) e comunidade**
