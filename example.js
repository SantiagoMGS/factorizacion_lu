(function () {
  "use strict";

  const c = (v, s = "static") => ({ v, s });
  const G = () => c("·", "ghost");

  const MATRIX_LABELS = {
    A: "A (matriz de trabajo)",
    L: "L",
    U: "U",
    P: "P (permutación)",
    b: "b",
    Pb: "Pb",
    y: "y",
    x: "x",
    y_sym: "y",
    x_sym: "x",
    y_res: "resultado",
    x_res: "resultado",
  };

  // ===================================================================
  //  EJEMPLO 3×3  (sin pivoteo)
  // ===================================================================
  const STEPS_3X3 = [
    {
      title: "Iteración 1 — Limpiar columna 1",
      text:
        "Pivote a₁₁ = 2. Multiplicadores m₂₁ = 3/2 y m₃₁ = 3/2.\n" +
        "Restamos (3/2)·E₁ de E₂ y E₃ para anular la primera columna.",
      formula:
        "\\[E_i \\leftarrow E_i - m_{i1}\\, E_1, \\quad m_{i1}=\\tfrac{a_{i1}}{a_{11}}\\]",
      show: ["A", "L"],
      matrices: {
        A: [
          [c("2"), c("-1"), c("1")],
          [c("0", "computed"), c("9/2", "active"), c("15/2", "active")],
          [c("0", "computed"), c("9/2", "active"), c("7/2", "active")],
        ],
        L: [
          [c("1"), c("0"), c("0")],
          [c("3/2", "active"), c("1"), c("0")],
          [c("3/2", "active"), G(), c("1")],
        ],
      },
    },
    {
      title: "Iteración 2 — Limpiar columna 2",
      text:
        "Nuevo pivote a₂₂ = 9/2. Multiplicador m₃₂ = (9/2)/(9/2) = 1.\n" +
        "Restamos E₂ de E₃; la posición (3,3) pasa a 7/2 − 15/2 = −4.\n" +
        "La matriz queda triangular superior.",
      formula: "\\[E_3 \\leftarrow E_3 - m_{32}\\, E_2, \\quad m_{32}=1\\]",
      show: ["A", "L"],
      matrices: {
        A: [
          [c("2"), c("-1"), c("1")],
          [c("0", "computed"), c("9/2"), c("15/2")],
          [c("0", "computed"), c("0", "active"), c("-4", "active")],
        ],
        L: [
          [c("1"), c("0"), c("0")],
          [c("3/2"), c("1"), c("0")],
          [c("3/2"), c("1", "active"), c("1")],
        ],
      },
    },
    {
      title: "Factorización A = L · U",
      text:
        "Quedan determinadas L (multiplicadores + identidad) y U (forma triangular final).\n" +
        "Cualquier sistema A·x = b se resuelve ahora con dos sustituciones triangulares.",
      formula: "\\[A = L\\,U\\]",
      show: ["L", "U"],
      matrices: {
        L: [
          [c("1", "active"), c("0"), c("0")],
          [c("3/2", "active"), c("1", "active"), c("0")],
          [c("3/2", "active"), c("1", "active"), c("1", "active")],
        ],
        U: [
          [c("2", "active"), c("-1", "active"), c("1", "active")],
          [c("0"), c("9/2", "active"), c("15/2", "active")],
          [c("0"), c("0"), c("-4", "active")],
        ],
      },
    },
    {
      title: "Sustitución hacia adelante: L · y = b",
      text:
        "Planteamos la ecuación L · y = b con y como vector de incógnitas\n" +
        "[y₁, y₂, y₃]ᵀ. Resolvemos de arriba hacia abajo:\n" +
        "  • y₁ = b₁ = −1\n" +
        "  • y₂ = 0 − (3/2)·(−1) = 3/2\n" +
        "  • y₃ = 4 − (3/2)·(−1) − 1·(3/2) = 4",
      formula: "\\[y_i = b_i - \\sum_{j<i} l_{ij}\\, y_j\\]",
      show: ["L", "y_sym", "b", "y_res"],
      matrices: {
        L: [
          [c("1"), c("0"), c("0")],
          [c("3/2"), c("1"), c("0")],
          [c("3/2"), c("1"), c("1")],
        ],
        y_sym: [[c("y₁")], [c("y₂")], [c("y₃")]],
        b: [[c("-1")], [c("0")], [c("4")]],
        y_res: [[c("-1", "active")], [c("3/2", "active")], [c("4", "active")]],
      },
    },
    {
      title: "Sustitución hacia atrás: U · x = y",
      text:
        "Planteamos la ecuación U · x = y con x como vector de incógnitas\n" +
        "[x₁, x₂, x₃]ᵀ. Resolvemos de abajo hacia arriba:\n" +
        "  • x₃ = 4 / (−4) = −1\n" +
        "  • x₂ = (3/2 − (15/2)·(−1)) / (9/2) = 2\n" +
        "  • x₁ = (−1 − (−1)·2 − 1·(−1)) / 2 = 1",
      formula:
        "\\[x_i = \\frac{1}{u_{ii}}\\left(y_i - \\sum_{j>i} u_{ij}\\, x_j\\right)\\]",
      show: ["U", "x_sym", "y", "x_res"],
      matrices: {
        U: [
          [c("2"), c("-1"), c("1")],
          [c("0"), c("9/2"), c("15/2")],
          [c("0"), c("0"), c("-4")],
        ],
        x_sym: [[c("x₁")], [c("x₂")], [c("x₃")]],
        y: [[c("-1")], [c("3/2")], [c("4")]],
        x_res: [[c("1", "active")], [c("2", "active")], [c("-1", "active")]],
      },
    },
    {
      title: "Verificación — A · x = b",
      text:
        "Sustituyendo x = (1, 2, −1)ᵀ en cada ecuación, A · x reconstruye\n" +
        "exactamente b. La factorización LU permite resolver futuros sistemas\n" +
        "con la misma A en sólo O(n²) operaciones por cada nuevo vector b.",
      formula: "\\[\\mathbf{x} = (1,\\; 2,\\; -1)^T\\]",
      show: ["equations"],
      matrices: {},
      equations: {
        label: "A · x = b",
        rows: [
          { lhs: "2(1) + (−1)(2) + 1(−1)", mid: "2 − 2 − 1", rhs: "−1" },
          { lhs: "3(1) + 3(2) + 9(−1)", mid: "3 + 6 − 9", rhs: "0" },
          { lhs: "3(1) + 3(2) + 5(−1)", mid: "3 + 6 − 5", rhs: "4" },
        ],
      },
    },
  ];

  // ===================================================================
  //  EJEMPLO 4×4  (con pivoteo parcial)
  //  A = [[0,2,-1,1],[1,0,1,-1],[2,-1,0,1],[1,1,-1,2]]
  //  b = [-1, 0, 6, 4]
  //  Solución:  x = [1, -1, 2, 3]
  //  Permutaciones: filas 1↔3 (iter 1), filas 2↔3 (iter 2)
  // ===================================================================
  const STEPS_4X4 = [
    {
      title: "Pivoteo — Intercambio filas 1 ↔ 3",
      text:
        "El pivote a₁₁ = 0 → no podemos dividir por cero. Buscamos en la\n" +
        "columna 1 una fila con valor no-nulo: la fila 3 tiene un 2.\n" +
        "\n" +
        "Intercambiamos filas 1 y 3, y registramos el cambio en P.\n" +
        "L sigue siendo la identidad — todavía no calculamos multiplicadores.\n" +
        "\n" +
        "Nota: en cálculo manual sólo pivoteamos cuando es necesario (pivote\n" +
        "igual a cero). Las implementaciones computacionales suelen pivotear\n" +
        "siempre eligiendo el mayor |valor| por estabilidad numérica.",
      formula:
        "\\[\\text{Si } a_{kk}=0, \\text{ intercambiar con una fila cuyo elemento en la columna } k \\text{ sea no-nulo}\\]",
      show: ["A", "P"],
      matrices: {
        A: [
          [
            c("2", "active"),
            c("-1", "active"),
            c("0", "active"),
            c("1", "active"),
          ],
          [c("1"), c("0"), c("1"), c("-1")],
          [
            c("0", "active"),
            c("2", "active"),
            c("-1", "active"),
            c("1", "active"),
          ],
          [c("1"), c("1"), c("-1"), c("2")],
        ],
        P: [
          [c("0"), c("0"), c("1", "active"), c("0")],
          [c("0"), c("1", "active"), c("0"), c("0")],
          [c("1", "active"), c("0"), c("0"), c("0")],
          [c("0"), c("0"), c("0"), c("1", "active")],
        ],
      },
    },
    {
      title: "Eliminación 1 — Columna 1",
      text:
        "Con el nuevo pivote a₁₁ = 2 calculamos los multiplicadores:\n" +
        "  • m₂₁ = 1/2\n" +
        "  • m₃₁ = 0  (no hace falta operar esta fila)\n" +
        "  • m₄₁ = 1/2\n" +
        "\n" +
        "Aplicamos E_i ← E_i − m_{i1}·E₁ a las filas 2 y 4.\n" +
        "Los multiplicadores quedan registrados en L.",
      formula:
        "\\[m_{i1} = \\tfrac{a_{i1}}{a_{11}}, \\quad E_i \\leftarrow E_i - m_{i1}\\, E_1\\]",
      show: ["A", "L"],
      matrices: {
        A: [
          [c("2"), c("-1"), c("0"), c("1")],
          [
            c("0", "computed"),
            c("1/2", "active"),
            c("1", "active"),
            c("-3/2", "active"),
          ],
          [
            c("0", "computed"),
            c("2", "active"),
            c("-1", "active"),
            c("1", "active"),
          ],
          [
            c("0", "computed"),
            c("3/2", "active"),
            c("-1", "active"),
            c("3/2", "active"),
          ],
        ],
        L: [
          [c("1"), c("0"), c("0"), c("0")],
          [c("1/2", "active"), c("1"), c("0"), c("0")],
          [c("0", "active"), G(), c("1"), c("0")],
          [c("1/2", "active"), G(), G(), c("1")],
        ],
      },
    },
    {
      title: "Eliminación 2 — Columna 2",
      text:
        "Pivote a₂₂ = 1/2 ≠ 0 → no necesitamos pivotear.\n" +
        "\n" +
        "Multiplicadores:\n" +
        "  • m₃₂ = 2 / (1/2) = 4\n" +
        "  • m₄₂ = (3/2) / (1/2) = 3\n" +
        "\n" +
        "Aplicamos E_i ← E_i − m_{i2}·E₂ a las filas 3 y 4.",
      formula:
        "\\[m_{i2} = \\tfrac{a_{i2}}{a_{22}}, \\quad E_i \\leftarrow E_i - m_{i2}\\, E_2\\]",
      show: ["A", "L"],
      matrices: {
        A: [
          [c("2"), c("-1"), c("0"), c("1")],
          [c("0"), c("1/2"), c("1"), c("-3/2")],
          [c("0"), c("0", "computed"), c("-5", "active"), c("7", "active")],
          [c("0"), c("0", "computed"), c("-4", "active"), c("6", "active")],
        ],
        L: [
          [c("1"), c("0"), c("0"), c("0")],
          [c("1/2"), c("1"), c("0"), c("0")],
          [c("0"), c("4", "active"), c("1"), c("0")],
          [c("1/2"), c("3", "active"), G(), c("1")],
        ],
      },
    },
    {
      title: "Eliminación 3 — Columna 3",
      text:
        "Pivote a₃₃ = −5 ≠ 0 → tampoco hace falta pivotear.\n" +
        "\n" +
        "  • m₄₃ = (−4) / (−5) = 4/5\n" +
        "  • E₄ ← E₄ − (4/5)·E₃\n" +
        "\n" +
        "La matriz queda triangular superior: ya es U.",
      formula: "\\[E_4 \\leftarrow E_4 - m_{43}\\, E_3, \\quad m_{43} = 4/5\\]",
      show: ["A", "L"],
      matrices: {
        A: [
          [c("2"), c("-1"), c("0"), c("1")],
          [c("0"), c("1/2"), c("1"), c("-3/2")],
          [c("0"), c("0"), c("-5"), c("7")],
          [c("0"), c("0"), c("0", "computed"), c("2/5", "active")],
        ],
        L: [
          [c("1"), c("0"), c("0"), c("0")],
          [c("1/2"), c("1"), c("0"), c("0")],
          [c("0"), c("4"), c("1"), c("0")],
          [c("1/2"), c("3"), c("4/5", "active"), c("1")],
        ],
      },
    },
    {
      title: "Factorización P · A = L · U",
      text:
        "Con la permutación P (un solo intercambio: filas 1↔3) tenemos\n" +
        "PA = LU. Para resolver A·x = b reescribimos como L·U·x = P·b.",
      formula:
        "\\[P\\,A = L\\,U \\quad \\Longrightarrow \\quad L\\,U\\,\\mathbf{x} = P\\,\\mathbf{b}\\]",
      show: ["P", "L", "U"],
      matrices: {
        P: [
          [c("0"), c("0"), c("1", "active"), c("0")],
          [c("0"), c("1", "active"), c("0"), c("0")],
          [c("1", "active"), c("0"), c("0"), c("0")],
          [c("0"), c("0"), c("0"), c("1", "active")],
        ],
        L: [
          [c("1", "active"), c("0"), c("0"), c("0")],
          [c("1/2", "active"), c("1", "active"), c("0"), c("0")],
          [c("0"), c("4", "active"), c("1", "active"), c("0")],
          [
            c("1/2", "active"),
            c("3", "active"),
            c("4/5", "active"),
            c("1", "active"),
          ],
        ],
        U: [
          [c("2", "active"), c("-1", "active"), c("0"), c("1", "active")],
          [c("0"), c("1/2", "active"), c("1", "active"), c("-3/2", "active")],
          [c("0"), c("0"), c("-5", "active"), c("7", "active")],
          [c("0"), c("0"), c("0"), c("2/5", "active")],
        ],
      },
    },
    {
      title: "Sustitución hacia adelante: L · y = P·b",
      text:
        "Primero permutamos b según P: Pb = [6, 0, −1, 4]ᵀ.\n" +
        "Planteamos L · y = Pb con y = [y₁, y₂, y₃, y₄]ᵀ y resolvemos\n" +
        "de arriba hacia abajo:\n" +
        "  • y₁ = 6\n" +
        "  • y₂ = 0 − (1/2)·6 = −3\n" +
        "  • y₃ = −1 − 0·6 − 4·(−3) = 11\n" +
        "  • y₄ = 4 − (1/2)·6 − 3·(−3) − (4/5)·11 = 6/5",
      formula: "\\[y_i = (Pb)_i - \\sum_{j<i} l_{ij}\\, y_j\\]",
      show: ["L", "y_sym", "Pb", "y_res"],
      matrices: {
        L: [
          [c("1"), c("0"), c("0"), c("0")],
          [c("1/2"), c("1"), c("0"), c("0")],
          [c("0"), c("4"), c("1"), c("0")],
          [c("1/2"), c("3"), c("4/5"), c("1")],
        ],
        y_sym: [[c("y₁")], [c("y₂")], [c("y₃")], [c("y₄")]],
        Pb: [[c("6")], [c("0")], [c("-1")], [c("4")]],
        y_res: [
          [c("6", "active")],
          [c("-3", "active")],
          [c("11", "active")],
          [c("6/5", "active")],
        ],
      },
    },
    {
      title: "Sustitución hacia atrás: U · x = y",
      text:
        "Planteamos U · x = y con x = [x₁, x₂, x₃, x₄]ᵀ y resolvemos\n" +
        "de abajo hacia arriba:\n" +
        "  • x₄ = (6/5) / (2/5) = 3\n" +
        "  • x₃ = (11 − 7·3) / (−5) = 2\n" +
        "  • x₂ = (−3 − 1·2 − (−3/2)·3) / (1/2) = −1\n" +
        "  • x₁ = (6 − (−1)·(−1) − 0·2 − 1·3) / 2 = 1",
      formula:
        "\\[x_i = \\frac{1}{u_{ii}}\\left(y_i - \\sum_{j>i} u_{ij}\\, x_j\\right)\\]",
      show: ["U", "x_sym", "y", "x_res"],
      matrices: {
        U: [
          [c("2"), c("-1"), c("0"), c("1")],
          [c("0"), c("1/2"), c("1"), c("-3/2")],
          [c("0"), c("0"), c("-5"), c("7")],
          [c("0"), c("0"), c("0"), c("2/5")],
        ],
        x_sym: [[c("x₁")], [c("x₂")], [c("x₃")], [c("x₄")]],
        y: [[c("6")], [c("-3")], [c("11")], [c("6/5")]],
        x_res: [
          [c("1", "active")],
          [c("-1", "active")],
          [c("2", "active")],
          [c("3", "active")],
        ],
      },
    },
    {
      title: "Verificación — A · x = b",
      text:
        "Sustituyendo x = (1, −1, 2, 3)ᵀ en cada ecuación del sistema original\n" +
        "recuperamos b = (−1, 0, 6, 4)ᵀ. El pivoteo permitió que el algoritmo\n" +
        "funcionara aún partiendo de a₁₁ = 0.",
      formula: "\\[\\mathbf{x} = (1,\\; -1,\\; 2,\\; 3)^T\\]",
      show: ["equations"],
      matrices: {},
      equations: {
        label: "A · x = b",
        rows: [
          {
            lhs: "0(1) + 2(−1) + (−1)(2) + 1(3)",
            mid: "0 − 2 − 2 + 3",
            rhs: "−1",
          },
          {
            lhs: "1(1) + 0(−1) + 1(2) + (−1)(3)",
            mid: "1 + 0 + 2 − 3",
            rhs: "0",
          },
          {
            lhs: "2(1) + (−1)(−1) + 0(2) + 1(3)",
            mid: "2 + 1 + 0 + 3",
            rhs: "6",
          },
          {
            lhs: "1(1) + 1(−1) + (−1)(2) + 2(3)",
            mid: "1 − 1 − 2 + 6",
            rhs: "4",
          },
        ],
      },
    },
  ];

  const EXAMPLES = {
    "3x3": { label: "Ejemplo 3×3", steps: STEPS_3X3 },
    "4x4": { label: "Ejemplo 4×4 con pivoteo", steps: STEPS_4X4 },
  };

  const PLAY_INTERVAL_MS = 3800;
  const $ = (id) => document.getElementById(id);

  let currentKey = "3x3";
  let stepIdx = 0;
  let playing = false;
  let playTimer = null;

  function steps() {
    return EXAMPLES[currentKey].steps;
  }

  function shortLabel(title) {
    const idx = title.indexOf("—");
    if (idx >= 0) return title.slice(0, idx).trim();
    const colon = title.indexOf(":");
    return colon >= 0 ? title.slice(0, colon).trim() : title;
  }

  function buildChips() {
    const container = $("stepper-chips");
    container.innerHTML = "";
    steps().forEach((step, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.dataset.index = String(i);
      const num = document.createElement("span");
      num.className = "chip__num";
      num.textContent = String(i + 1);
      const lbl = document.createElement("span");
      lbl.className = "chip__label";
      lbl.textContent = shortLabel(step.title);
      btn.appendChild(num);
      btn.appendChild(lbl);
      btn.addEventListener("click", () => {
        stopPlay();
        goto(i);
      });
      container.appendChild(btn);
    });
  }

  function updateChips() {
    const chips = $("stepper-chips").querySelectorAll(".chip");
    chips.forEach((chip, i) => {
      chip.classList.remove("is-active", "is-done", "is-pending");
      if (i < stepIdx) chip.classList.add("is-done");
      else if (i === stepIdx) {
        chip.classList.add("is-active");
        chip.setAttribute("aria-current", "step");
      } else {
        chip.classList.add("is-pending");
        chip.removeAttribute("aria-current");
      }
    });
  }

  function renderMatrices() {
    const step = steps()[stepIdx];
    const container = $("stage-matrices");
    container.innerHTML = "";

    step.show.forEach((key) => {
      if (key === "equations" && step.equations) {
        renderEquations(container, step.equations);
        return;
      }

      const data = step.matrices[key];
      if (!data) return;

      const box = document.createElement("div");
      box.className = "matrix-box fade-in";

      const label = document.createElement("p");
      label.className = "matrix-box__label";
      label.textContent = MATRIX_LABELS[key] || key;
      box.appendChild(label);

      const grid = document.createElement("div");
      grid.className = "matrix-display";
      const cols = data[0].length;
      grid.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      data.forEach((row) => {
        row.forEach((cell) => {
          const span = document.createElement("span");
          span.className = `matrix-cell matrix-cell--${cell.s}`;
          span.textContent = cell.v;
          grid.appendChild(span);
        });
      });
      box.appendChild(grid);
      container.appendChild(box);
    });
  }

  function renderEquations(container, data) {
    const box = document.createElement("div");
    box.className = "verify-box fade-in";

    if (data.label) {
      const label = document.createElement("p");
      label.className = "matrix-box__label";
      label.textContent = data.label;
      box.appendChild(label);
    }

    data.rows.forEach((eq, i) => {
      const row = document.createElement("div");
      row.className = "verify-row";

      const fila = document.createElement("span");
      fila.className = "verify-row__index";
      fila.textContent = `Fila ${i + 1}`;
      row.appendChild(fila);

      const expr = document.createElement("span");
      expr.className = "verify-row__expr";
      expr.textContent = eq.lhs;
      row.appendChild(expr);

      if (eq.mid) {
        const eq1 = document.createElement("span");
        eq1.className = "verify-row__op";
        eq1.textContent = "=";
        row.appendChild(eq1);

        const mid = document.createElement("span");
        mid.className = "verify-row__mid";
        mid.textContent = eq.mid;
        row.appendChild(mid);
      }

      const eq2 = document.createElement("span");
      eq2.className = "verify-row__op";
      eq2.textContent = "=";
      row.appendChild(eq2);

      const result = document.createElement("span");
      result.className = "verify-row__result";
      result.textContent = eq.rhs;
      row.appendChild(result);

      const check = document.createElement("span");
      check.className = "verify-row__check";
      check.textContent = "✓";
      row.appendChild(check);

      box.appendChild(row);
    });

    container.appendChild(box);
  }

  function renderNarrative() {
    const step = steps()[stepIdx];
    const narrative = $("stage-narrative");
    narrative.classList.remove("fade-in");
    void narrative.offsetWidth;
    narrative.classList.add("fade-in");
    $("stage-title").textContent = step.title;
    $("stage-text").textContent = step.text;
    const formulaEl = $("stage-formula");
    formulaEl.textContent = step.formula || "";
    if (window.renderMathInElement && step.formula) {
      try {
        window.renderMathInElement(formulaEl, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      } catch (_) {
        /* noop */
      }
    }
  }

  function renderControls() {
    $("btn-prev").disabled = stepIdx === 0;
    $("btn-next").disabled = stepIdx === steps().length - 1 && !playing;
    $("step-counter").textContent = `paso ${stepIdx + 1} de ${steps().length}`;
    const playBtn = $("btn-play");
    playBtn.textContent = playing ? "⏸" : "▶";
    playBtn.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
  }

  function render() {
    updateChips();
    renderMatrices();
    renderNarrative();
    renderControls();
    $("example-stage").setAttribute("data-step", String(stepIdx + 1));
  }

  function goto(i) {
    const total = steps().length;
    if (i < 0 || i >= total) return;
    stepIdx = i;
    render();
  }

  function next() {
    if (stepIdx < steps().length - 1) goto(stepIdx + 1);
    else stopPlay();
  }

  function prev() {
    if (stepIdx > 0) goto(stepIdx - 1);
  }

  function startPlay() {
    if (stepIdx === steps().length - 1) {
      stepIdx = 0;
      render();
    }
    playing = true;
    renderControls();
    playTimer = setInterval(() => {
      if (stepIdx >= steps().length - 1) stopPlay();
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

  function switchExample(key) {
    if (!EXAMPLES[key] || key === currentKey) return;
    stopPlay();
    currentKey = key;
    stepIdx = 0;

    document.querySelectorAll(".example-tab").forEach((tab) => {
      const active = tab.dataset.example === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll(".example-intro").forEach((intro) => {
      intro.classList.toggle("is-active", intro.dataset.example === key);
    });

    buildChips();
    render();
  }

  function bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.target && e.target.closest && e.target.closest("input, textarea"))
        return;
      if (e.key === "ArrowRight") {
        stopPlay();
        next();
      } else if (e.key === "ArrowLeft") {
        stopPlay();
        prev();
      } else if (e.key === " ") {
        const stage = $("example-stage");
        const rect = stage && stage.getBoundingClientRect();
        if (!rect) return;
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        e.preventDefault();
        togglePlay();
      }
    });
  }

  function bindTabs() {
    document.querySelectorAll(".example-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchExample(tab.dataset.example));
    });
  }

  function init() {
    const stage = $("example-stage");
    if (!stage || stage.dataset.initialized === "1") return;
    stage.dataset.initialized = "1";
    buildChips();
    $("btn-prev").addEventListener("click", () => {
      stopPlay();
      prev();
    });
    $("btn-next").addEventListener("click", () => {
      stopPlay();
      next();
    });
    $("btn-play").addEventListener("click", togglePlay);
    bindTabs();
    bindKeyboard();
    render();
  }

  window.LUExample = { init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
