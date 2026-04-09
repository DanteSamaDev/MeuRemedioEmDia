# Assets do App

Esta pasta contém os recursos visuais do aplicativo "Meu Remédio em Dia".

## Arquivos Necessários

### Ícones e Splash Screen
- `icon.png` - Ícone principal do app (1024x1024px)
- `adaptive-icon.png` - Ícone adaptativo Android (1024x1024px)
- `splash.png` - Tela de splash (1242x2436px)
- `favicon.png` - Favicon para web (32x32px)

### Como Gerar Assets

Para gerar os assets automaticamente, use o Expo CLI:

```bash
npx expo install expo-splash-screen
npx expo install expo-system-ui
```

### Estrutura Recomendada

```
assets/
├── icon.png
├── adaptive-icon.png
├── splash.png
├── favicon.png
└── images/
    ├── medicamentos/
    ├── direitos/
    └── farmacias/
```

## Notas

- Todos os assets devem seguir as diretrizes do Expo
- Use PNG com transparência para ícones
- Mantenha os tamanhos recomendados para melhor qualidade