# VeraPad — app nativo para iPad 2 (iOS 9.3.5)

Projeto Xcode **mínimo em Objective-C**, configurado especificamente para rodar
no **iPad 2** com **iOS 9.3.5**. É um app de exemplo (uma tela com um contador)
pronto para você evoluir.

## Por que essas escolhas?

O iPad 2 usa o chip A5 (**arquitetura 32-bit `armv7`**) e trava no **iOS 9.3.5**
(ou 9.3.6 no modelo celular). Isso define tudo:

| Item | Escolha | Motivo |
|------|---------|--------|
| Deployment target | **iOS 9.3** | versão máxima do iPad 2 |
| Arquitetura | **armv7** (32-bit) | o A5 não roda binário só-arm64 |
| Linguagem | **Objective-C** | sem runtime Swift embutido; ABI estável |
| UI | **em código + LaunchScreen storyboard** | menos pontos de falha |
| Família de dispositivo | **iPad** (`TARGETED_DEVICE_FAMILY = 2`) | foco no alvo |

## Ferramenta obrigatória: Xcode 9.4.1

Você **precisa de um Mac** e da **última versão do Xcode que ainda compila
32-bit e faz deploy no iOS 9**:

- **Xcode 9.4.1** (build 9F2000) — o Xcode 10+ **removeu** suporte a `armv7`.
- Exige **macOS 10.13.2 (High Sierra) ou superior**.
- Download: Apple Developer → *More Downloads* → procure "Xcode 9.4.1"
  (https://developer.apple.com/download/all/). Uma conta Apple gratuita basta
  para baixar.

> Dica: dá para manter o Xcode 9.4.1 lado a lado com um Xcode moderno —
> renomeie para `Xcode9.app` na pasta Aplicativos.

## Como abrir e rodar

1. `git clone` deste repositório em um Mac.
2. Abra `ios-ipad2/VeraPad.xcodeproj` no **Xcode 9.4.1**.
3. Selecione o target **VeraPad** → aba **Signing & Capabilities** (ou "General"):
   - marque **Automatically manage signing**;
   - escolha seu **Team** (uma Apple ID gratuita funciona);
   - se o *bundle identifier* `com.vera.verapad` estiver em uso, troque por algo
     único, ex.: `com.seunome.verapad`.
4. Conecte o iPad 2 via cabo, confie no computador e selecione o dispositivo na
   barra de destino do Xcode.
5. Aperte **Run (⌘R)**.

No iPad, vá em **Ajustes → Geral → Gerenciamento de Dispositivo** e confie no
seu certificado de desenvolvedor na primeira execução.

## Limitações de assinatura (importante)

- Com **conta Apple gratuita**, o app instalado **expira em 7 dias** e precisa
  ser reinstalado pelo Xcode. Você também fica limitado a poucos apps/dispositivos.
- Com o **Apple Developer Program pago (US$99/ano)**, o app vale **1 ano** e você
  pode gerar um **`.ipa`** (Product → Archive → Export) para distribuir.

## Estrutura

```
ios-ipad2/
├── VeraPad.xcodeproj/
│   └── project.pbxproj          # projeto: deployment target 9.3, iPad, armv7
└── VeraPad/
    ├── main.m
    ├── AppDelegate.h / .m       # cria a UIWindow e o root view controller
    ├── ViewController.h / .m    # a tela de exemplo (título + contador)
    ├── Info.plist               # LaunchScreen, orientações, armv7
    ├── Base.lproj/
    │   └── LaunchScreen.storyboard
    └── Assets.xcassets/
        └── AppIcon.appiconset/  # slots de ícone (adicione seus PNGs)
```

## Próximos passos sugeridos

- Adicione ícones reais no `AppIcon.appiconset` (PNGs 76×76@1x/@2x etc.).
- Crie novas telas em Objective-C e faça push/present a partir do `ViewController`.
- Se preferir Swift, é possível usar **Swift 4.1** (limite do Xcode 9.4.1), mas
  Objective-C é o caminho mais seguro para o iOS 9.3.

## Observação sobre este repositório

O restante do repositório `vera` é um app **web** (React/Vite) — sem relação com
este projeto nativo. Este diretório `ios-ipad2/` é autocontido.
