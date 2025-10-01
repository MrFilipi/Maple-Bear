# Arquitetura do Projeto: Clock Ninja

Este documento detalha a arquitetura proposta para o desenvolvimento do site gamificado "Clock Ninja", focado no ensino de leitura de horas em relógios analógicos para crianças de 9 a 10 anos. O projeto será bilíngue (PT-BR e EN) e seguirá as especificações fornecidas.

## 1. Pilares do Produto e Requisitos Gerais

*   **Público-alvo:** Crianças de 9-10 anos, alfabetizadas, com foco na introdução de conceitos como "past/to" em inglês.
*   **Tom Visual:** Divertido, limpo, sem anúncios, responsivo (desktop/tablet/celular).
*   **Gamificação Leve:** Implementação de pontos, estrelas/medalhas, vidas, pistas (hints) e progresso salvo localmente.
*   **Acessibilidade:** Suporte a teclado/mouse/touch, leitores de tela (aria-labels), alto contraste e controle de áudio.
*   **Idiomas:** PT-BR e EN, com alternância de idioma persistente. A forma verbal das horas será sempre em inglês, com apoio textual em português nos modos "Aprender" e "Feedback".

## 2. Tech Stack

*   **Front-end:** React com Vite para o ambiente de desenvolvimento e build.
*   **Estilização:** Tailwind CSS para um desenvolvimento rápido e responsivo.
*   **Linguagem:** TypeScript para maior robustez e manutenibilidade do código.
*   **Gerenciamento de Estado:** Zustand ou Context API para o estado global da aplicação.
*   **Persistência de Dados:** `localStorage` para salvar o progresso do usuário, sem necessidade de backend.

## 3. Estrutura de Páginas e Fluxo de Navegação

A aplicação terá as seguintes rotas principais:

*   **`/` (Home):** Página inicial com título "Relógio Ninja / Clock Ninja" e botões de navegação para "Aprender", "Praticar", "Desafios" e "Professor". Incluirá um toggle de idioma.
*   **`/aprender` (Modo Learn):** Focado na explicação visual e interativa da leitura de horas. Contará com um `InteractiveClock` central e um painel lateral com explicações, exemplos animados, botão de dica e pronúncia (TTS).
*   **`/praticar` (Modo Practice):** Modo de prática com geração de itens configuráveis (arrastar ponteiros, escrever forma verbal, múltipla escolha). Feedback imediato, pontuação, sistema de vidas e estrelas. Dificuldade ajustável (Fácil, Médio, Difícil).
*   **`/desafios` (Modo Game):** Missões cronometradas e "Boss level". Sistema de conquistas.
*   **`/professor` (Painel Simples):** Controles para configurações (idioma padrão, dificuldade, etc.), exportação/reset de progresso (JSON) e um guia rápido de didática.

## 4. Componentes Principais

### 4.1. `<InteractiveClock />`

*   **Funcionalidade:** Exibe um relógio analógico com ponteiros de horas e minutos. Os ponteiros serão arrastáveis com "snap" a cada minuto. O ponteiro de horas terá movimento contínuo (e.g., 3:30, o ponteiro estará entre 3 e 4).
*   **Interação:** Arrastar ponteiros, setas do teclado (+/- 1 min; Shift = +/- 5 min).
*   **Visual:** Exibirá marcos discretos para :05, :10, :15 (quarter past), :30 (half past), :45 (quarter to).

### 4.2. `<TimeText />`

*   **Funcionalidade:** Renderiza as três formas de representação da hora:
    *   **Digital:** `HH:MM`.
    *   **Verbal EN:** Conversão da hora analógica para a forma verbal em inglês, seguindo regras específicas (e.g., "three o'clock", "a quarter past three", "twenty to nine").
    *   **Apoio Textual PT:** Texto simples em português para auxiliar na compreensão (e.g., "três e quinze").
*   **Regras de Conversão (EN verbal):**
    *   `m == 0`: `{hour} o’clock`
    *   `m == 15`: `a quarter past {hour}`
    *   `m == 30`: `half past {hour}`
    *   `1 <= m <= 29` e `m != 15`: `{m} past {hour}`
    *   `m == 45`: `a quarter to {hour+1}` (com wrap 12->1)
    *   `31 <= m <= 59` e `m != 45`: `{60-m} to {hour+1}`
    *   Números até 29 por extenso (one, two, ..., twenty-nine), tudo em minúsculas.

### 4.3. `<ItemGenerator />`

*   **Funcionalidade:** Gera itens de pergunta/resposta para os modos "Praticar" e "Desafios" com base em parâmetros como dificuldade, tipos de pergunta, permissão de "quarter/half" e "to", e intervalo de minutos.
*   **Saída:** Gera um tempo válido e suas respectivas representações digital, analógica e verbal em inglês.

### 4.4. `<FeedbackCard />`

*   **Funcionalidade:** Exibe feedback imediato (certo/errado) com explicações claras, cores acessíveis e um botão "tentar novamente".

### 4.5. `<ProgressStore />` (Zustand)

*   **Funcionalidade:** Gerencia e persiste o estado da aplicação, incluindo pontuação, estrelas, conquistas, preferências do usuário e idioma selecionado, utilizando `localStorage`.

## 5. UX e Anti-Frustração

*   **Dicas Graduais:** Colorir faixas (past/to), destacar próximo número da hora, mostrar contagem regressiva de minutos.
*   **Feedback Detalhado:** Botão "Ver passo a passo" após erros repetidos.
*   **Reforço Positivo:** Mensagens curtas e encorajadoras.

## 6. Acessibilidade

*   **Navegação:** Foco visível, navegação completa por teclado.
*   **Leitores de Tela:** `aria-live` para feedback, alternativa textual "Relógio: horas = H, minutos = M".
*   **Visual:** Botão de Alto Contraste.
*   **Áudio:** Botão "Som On/Off".

## 7. Métricas (Locais)

*   Serão registradas no console ou `localStorage` métricas como itens tentados, taxa de acerto, tempo médio por item e áreas de maior dificuldade.

## 8. Conteúdo Inicial (Seed)

*   **Exemplos para "Aprender":** 3:00, 3:15, 3:30, 3:45, 8:40, 11:05, 12:55.
*   **Banco de Exercícios:** Priorizar múltiplos de 5 no modo Fácil; incluir aleatórios "quebrados" no Médio/Difícil.

## 9. Critérios de Aceite (MVP)

*   Arrastar ponteiros e ver atualização em tempo real (digital e verbal EN).
*   Alternar PT/EN na interface (explicações), mantendo forma verbal em EN.
*   Modo "Praticar" gera 20+ itens aleatórios por sessão, com feedback e pontuação.
*   Modo "Desafios" com pelo menos uma missão cronometrada (60s).
*   Progresso (pontos, estrelas, conquistas básicas) persistente em `localStorage`.
*   Acessibilidade básica: teclado para minutos/horas, foco visível, `aria-labels`.
*   Responsividade e performance (Lighthouse > 85 em Performance e A11y).

## 10. Entregáveis

*   Repositório Git com `README.md` (instruções de como rodar e usar).
*   Build estático pronto (Vite).
*   Arquivos de internacionalização (`pt.json`, `en.json`).
*   Comentários no código explicando a lógica de conversão de tempo (`past/to`).

## 11. Prioridades Iniciais

*   Foco principal no desenvolvimento dos modos `/aprender` e `/praticar`.
*   O modo `/desafios` pode ser simplificado inicialmente (apenas 1 missão cronometrada).
*   Ênfase em código claro, modular e funções puras para conversão de tempo.
