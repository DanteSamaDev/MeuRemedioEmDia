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
