# ClockQuest

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-brightgreen.svg)](https://docs.github.com/pages)

ClockQuest é uma aventura gamificada para turmas bilíngues (PT/EN) praticarem a leitura de relógios analógicos com feedback positivo, progressão de habilidades e modos Aprender, Praticar e Desafio.

## ✨ Recursos principais

- ✅ **Relógio analógico interativo** com ponteiros arrastáveis, marcadores de minuto e destaque acessível dos ponteiros.
- 🎯 **Gerador inteligente de questões** alinhado aos níveis Fácil, Médio e Difícil, cobrindo horas cheias, *past/half past* e *to*.
- 🧠 **Painel de habilidades (H1–H4)** com XP, combo, corações, estrelas e relatório de lapsos por intervalo de minutos.
- ⚡ **Modo Desafio (90s)** com ranking local, nickname personalizado e progressão de dificuldade automática.
- 🌐 **Internacionalização (PT/EN)**: todos os textos vêm do dicionário em `scripts/i18n.js`, com persistência de idioma.
- ♿ **Acessibilidade**: foco visível, navegação por teclado, alto contraste, respeito a `prefers-reduced-motion`, aria-labels e botões de acessibilidade.
- 💾 **Persistência local**: progresso, configurações e ranking são guardados em `localStorage` via `scripts/store.js`.

## 🚀 Como usar

1. Abra `index.html` no navegador para experimentar localmente (basta clicar duas vezes ou usar um servidor estático).
2. Escolha o modo (Aprender, Praticar ou Desafio) e ajuste a dificuldade.
3. Selecione o modo de resposta (Múltipla escolha, Digitação ou Arrastar ponteiros).
4. Use o botão **Dica** sempre que precisar de suporte sem frustração.
5. Ative os controles de acessibilidade: alto contraste, números de minutos e realce de ponteiros.

### Controles extras

- **Gerar hora**: cria um novo desafio alinhado ao modo e dificuldade atuais.
- **Conferir resposta**: valida a entrada atual.
- **Pular**: avança sem penalidade de XP (mas zera o combo).
- **Modo Desafio**: conta 90s com +10 pontos por acerto (bônus +5 no primeiro palpite) e ranking local.

## 🧪 Testes

Execute os testes básicos de validação de respostas diretamente com Node:

```bash
npm test
```

O arquivo [`scripts/engine.test.js`](scripts/engine.test.js) cobre transformações de hora para texto em inglês e português, além de aceitar diferentes formatos válidos de entrada.

## 📦 Estrutura do projeto

```
index.html
assets/
scripts/
  clock.js
  gameEngine.js
  i18n.js
  main.js
  store.js
styles/
  main.css
```

## 🌍 Publicação no GitHub Pages

1. Faça fork ou clone deste repositório.
2. Garanta que o arquivo `index.html` esteja na raiz do branch `main` (já está!).
3. No GitHub, acesse **Settings → Pages**.
4. Em **Build and deployment**, escolha:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
5. Clique em **Save**. Em alguns minutos, a URL do seu site ficará disponível no mesmo painel.

> Dica: atualize o badge no topo deste README com o link final da sua publicação.

## 📄 Licença

Este projeto utiliza a licença [MIT](LICENSE).
