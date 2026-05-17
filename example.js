(function () {
  'use strict';

  const c = (v, s = 'static') => ({ v, s });
  const G = () => c('·', 'ghost');

  const MATRIX_LABELS = {
    A: 'A (matriz de trabajo)',
    L: 'L',
    U: 'U',
    b: 'b',
    y: 'y',
    x: 'x',
  };

  const STEPS = [
    {
      title: 'Iteración 1 — Limpiar columna 1',
      text:
        'Pivote a₁₁ = 2. Calculamos los multiplicadores m₂₁ = 3/2 y m₃₁ = 3/2, luego restamos (3/2)·E₁ de E₂ y E₃. La primera columna queda anulada bajo el pivote.',
      formula: '\\[E_i \\leftarrow E_i - m_{i1}\\, E_1, \\quad m_{i1}=\\tfrac{a_{i1}}{a_{11}}\\]',
      show: ['A', 'L'],
      matrices: {
        A: [
          [c('2'), c('-1'), c('1')],
          [c('0', 'computed'), c('9/2', 'active'), c('15/2', 'active')],
          [c('0', 'computed'), c('9/2', 'active'), c('7/2', 'active')],
        ],
        L: [
          [c('1'), c('0'), c('0')],
          [c('3/2', 'active'), c('1'), c('0')],
          [c('3/2', 'active'), G(), c('1')],
        ],
      },
    },
    {
      title: 'Iteración 2 — Limpiar columna 2',
      text:
        'Nuevo pivote a₂₂ = 9/2. Multiplicador m₃₂ = (9/2)/(9/2) = 1. Restamos E₂ de E₃; la posición (3,3) pasa a 7/2 − 15/2 = −4. La matriz queda triangular superior.',
      formula: '\\[E_3 \\leftarrow E_3 - m_{32}\\, E_2, \\quad m_{32}=1\\]',
      show: ['A', 'L'],
      matrices: {
        A: [
          [c('2'), c('-1'), c('1')],
          [c('0', 'computed'), c('9/2'), c('15/2')],
          [c('0', 'computed'), c('0', 'active'), c('-4', 'active')],
        ],
        L: [
          [c('1'), c('0'), c('0')],
          [c('3/2'), c('1'), c('0')],
          [c('3/2'), c('1', 'active'), c('1')],
        ],
      },
    },
    {
      title: 'Factorización A = L · U',
      text:
        'Quedan determinadas L (multiplicadores + identidad) y U (forma triangular final de A). Cualquier sistema A·x = b se resuelve ahora con dos sustituciones triangulares.',
      formula: '\\[A = L\\,U\\]',
      show: ['L', 'U'],
      matrices: {
        L: [
          [c('1', 'active'), c('0'), c('0')],
          [c('3/2', 'active'), c('1', 'active'), c('0')],
          [c('3/2', 'active'), c('1', 'active'), c('1', 'active')],
        ],
        U: [
          [c('2', 'active'), c('-1', 'active'), c('1', 'active')],
          [c('0'), c('9/2', 'active'), c('15/2', 'active')],
          [c('0'), c('0'), c('-4', 'active')],
        ],
      },
    },
    {
      title: 'Sustitución hacia adelante: L · y = b',
      text:
        'Resolvemos hacia adelante:\n  • y₁ = −1\n  • y₂ = 0 − (3/2)(−1) = 3/2\n  • y₃ = 4 − (3/2)(−1) − 1·(3/2) = 4',
      formula: '\\[y_i = b_i - \\sum_{j<i} l_{ij}\\, y_j\\]',
      show: ['L', '·', 'y', '=', 'b'],
      matrices: {
        L: [
          [c('1'), c('0'), c('0')],
          [c('3/2'), c('1'), c('0')],
          [c('3/2'), c('1'), c('1')],
        ],
        b: [[c('-1')], [c('0')], [c('4')]],
        y: [[c('y₁', 'active')], [c('y₂', 'active')], [c('y₃', 'active')]],
      },
      summaries: {
        y: 'y = [ −1,  3/2,  4 ]',
      },
    },
    {
      title: 'Sustitución hacia atrás: U · x = y',
      text:
        'Resolvemos desde abajo:\n  • x₃ = 4 / (−4) = −1\n  • x₂ = (3/2 − (15/2)(−1)) / (9/2) = 2\n  • x₁ = (−1 − (−1)(2) − 1(−1)) / 2 = 1',
      formula: '\\[x_i = \\frac{1}{u_{ii}}\\left(y_i - \\sum_{j>i} u_{ij}\\, x_j\\right)\\]',
      show: ['U', '·', 'x', '=', 'y'],
      matrices: {
        U: [
          [c('2'), c('-1'), c('1')],
          [c('0'), c('9/2'), c('15/2')],
          [c('0'), c('0'), c('-4')],
        ],
        y: [[c('-1')], [c('3/2')], [c('4')]],
        x: [[c('x₁', 'active')], [c('x₂', 'active')], [c('x₃', 'active')]],
      },
      summaries: {
        x: 'x = [ 1,  2,  −1 ]',
      },
    },
    {
      title: 'Verificación — A · x = b',
      text:
        'Sustituyendo x en A·x recuperamos exactamente b. La factorización LU permite resolver futuros sistemas con la misma A en sólo O(n²) operaciones por cada nuevo vector b.',
      formula: '\\[\\mathbf{x} = (1,\\; 2,\\; -1)^T\\]',
      show: ['x'],
      matrices: {
        x: [[c('1', 'active')], [c('2', 'active')], [c('-1', 'active')]],
      },
    },
  ];

  const PLAY_INTERVAL_MS = 3800;
  const $ = (id) => document.getElementById(id);

  let stepIdx = 0;
  let playing = false;
  let playTimer = null;

  function shortLabel(title) {
    const idx = title.indexOf('—');
    if (idx >= 0) return title.slice(0, idx).trim();
    const colon = title.indexOf(':');
    return colon >= 0 ? title.slice(0, colon).trim() : title;
  }

  function buildChips() {
    const container = $('stepper-chips');
    container.innerHTML = '';
    STEPS.forEach((step, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.index = String(i);
      const num = document.createElement('span');
      num.className = 'chip__num';
      num.textContent = String(i + 1);
      const lbl = document.createElement('span');
      lbl.className = 'chip__label';
      lbl.textContent = shortLabel(step.title);
      btn.appendChild(num);
      btn.appendChild(lbl);
      btn.addEventListener('click', () => {
        stopPlay();
        goto(i);
      });
      container.appendChild(btn);
    });
  }

  function updateChips() {
    const chips = $('stepper-chips').querySelectorAll('.chip');
    chips.forEach((chip, i) => {
      chip.classList.remove('is-active', 'is-done', 'is-pending');
      if (i < stepIdx) chip.classList.add('is-done');
      else if (i === stepIdx) {
        chip.classList.add('is-active');
        chip.setAttribute('aria-current', 'step');
      } else {
        chip.classList.add('is-pending');
        chip.removeAttribute('aria-current');
      }
    });
  }

  function renderMatrices() {
    const step = STEPS[stepIdx];
    const container = $('stage-matrices');
    container.innerHTML = '';

    step.show.forEach((key) => {
      const data = step.matrices && step.matrices[key];
      if (!data) {
        // Operator separator (e.g. '·', '=')
        const op = document.createElement('div');
        op.className = 'matrix-op fade-in';
        op.textContent = key;
        container.appendChild(op);
        return;
      }

      const box = document.createElement('div');
      box.className = 'matrix-box fade-in';

      const label = document.createElement('p');
      label.className = 'matrix-box__label';
      label.textContent = MATRIX_LABELS[key] || key;
      box.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'matrix-display';
      const cols = data[0].length;
      grid.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      data.forEach((row) => {
        row.forEach((cell) => {
          const span = document.createElement('span');
          span.className = `matrix-cell matrix-cell--${cell.s}`;
          span.textContent = cell.v;
          grid.appendChild(span);
        });
      });
      box.appendChild(grid);

      const summary = step.summaries && step.summaries[key];
      if (summary) {
        const sumEl = document.createElement('div');
        sumEl.className = 'matrix-box__summary';
        sumEl.textContent = summary;
        box.appendChild(sumEl);
      }

      container.appendChild(box);
    });
  }

  function renderNarrative() {
    const step = STEPS[stepIdx];
    const narrative = $('stage-narrative');
    narrative.classList.remove('fade-in');
    void narrative.offsetWidth;
    narrative.classList.add('fade-in');
    $('stage-title').textContent = step.title;
    $('stage-text').textContent = step.text;
    const formulaEl = $('stage-formula');
    formulaEl.textContent = step.formula || '';
    if (window.renderMathInElement && step.formula) {
      try {
        window.renderMathInElement(formulaEl, {
          delimiters: [
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
          ],
          throwOnError: false,
        });
      } catch (_) {
        /* noop */
      }
    }
  }

  function renderControls() {
    $('btn-prev').disabled = stepIdx === 0;
    $('btn-next').disabled = stepIdx === STEPS.length - 1 && !playing;
    $('step-counter').textContent = `paso ${stepIdx + 1} de ${STEPS.length}`;
    const playBtn = $('btn-play');
    playBtn.textContent = playing ? '⏸' : '▶';
    playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
  }

  function toggleResultCard() {
    const card = $('result-card');
    if (!card) return;
    if (stepIdx === STEPS.length - 1) card.classList.add('is-revealed');
    else card.classList.remove('is-revealed');
  }

  function render() {
    updateChips();
    renderMatrices();
    renderNarrative();
    renderControls();
    toggleResultCard();
    $('example-stage').setAttribute('data-step', String(stepIdx + 1));
  }

  function goto(i) {
    if (i < 0 || i >= STEPS.length) return;
    stepIdx = i;
    render();
  }

  function next() {
    if (stepIdx < STEPS.length - 1) goto(stepIdx + 1);
    else stopPlay();
  }

  function prev() {
    if (stepIdx > 0) goto(stepIdx - 1);
  }

  function startPlay() {
    if (stepIdx === STEPS.length - 1) {
      stepIdx = 0;
      render();
    }
    playing = true;
    renderControls();
    playTimer = setInterval(() => {
      if (stepIdx >= STEPS.length - 1) stopPlay();
      else next();
    }, PLAY_INTERVAL_MS);
  }

  function stopPlay() {
    if (playTimer) clearInterval(playTimer);
    playTimer = null;
    playing = false;
    renderControls();
  }

  function togglePlay() {
    if (playing) stopPlay();
    else startPlay();
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target && e.target.closest && e.target.closest('input, textarea'))
        return;
      if (e.key === 'ArrowRight') {
        stopPlay();
        next();
      } else if (e.key === 'ArrowLeft') {
        stopPlay();
        prev();
      } else if (e.key === ' ') {
        const stage = $('example-stage');
        const rect = stage && stage.getBoundingClientRect();
        if (!rect) return;
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        e.preventDefault();
        togglePlay();
      }
    });
  }

  function init() {
    const stage = $('example-stage');
    if (!stage || stage.dataset.initialized === '1') return;
    stage.dataset.initialized = '1';
    buildChips();
    $('btn-prev').addEventListener('click', () => {
      stopPlay();
      prev();
    });
    $('btn-next').addEventListener('click', () => {
      stopPlay();
      next();
    });
    $('btn-play').addEventListener('click', togglePlay);
    bindKeyboard();
    render();
  }

  window.LUExample = { init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
