/* ============================================================
   Conpro · Chart.js con tokens del tema
   Reglas (README / que-no-hacer):
   - serie clave = --chart-series-1 (acento); resto gris (2/3)
   - sin gridlines pesadas, sin leyenda redundante, sin sombras
   - EJES DESDE CERO (no truncar)
   - texto mínimo 24px (proyección)
   Se reconstruyen al cambiar de tema (releen los tokens).
   ============================================================ */

window.Charts = (() => {
  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function base() {
    return {
      family: token('--font-body'),
      muted: token('--color-text-muted'),
      text: token('--color-text'),
      grid: token('--color-grid'),
      accent: token('--chart-series-1'),
      gray: token('--chart-series-2'),
      negative: token('--color-negative'),
    };
  }

  const FONT = 24; // piso de texto
  const fmtNum = (v) => Number(v).toLocaleString('es-CL'); // 6.11 -> "6,11"

  /* color del token (#hex o rgb) -> rgba con alfa, para rampas de opacidad. */
  function withAlpha(color, a) {
    color = (color || '').trim();
    if (color[0] === '#') {
      let h = color.slice(1);
      if (h.length === 3) h = h.split('').map((c) => c + c).join('');
      const n = parseInt(h, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(',').map((s) => s.trim()); return `rgba(${p[0]},${p[1]},${p[2]},${a})`; }
    return color;
  }

  function scales(d, { yMax, yTitle, yStep, yFmt } = {}) {
    return {
      x: {
        grid: { display: false },
        border: { color: d.muted },
        ticks: { color: d.muted, font: { family: d.family, size: FONT } },
      },
      y: {
        beginAtZero: true,                 // EJE DESDE CERO — nunca truncar
        max: yMax,
        grid: { color: d.grid, lineWidth: 1 },
        border: { display: false },
        ticks: { color: d.muted, font: { family: d.family, size: FONT }, stepSize: yStep,
                 callback: yFmt ? (v) => yFmt(v) : undefined },
        title: yTitle
          ? { display: true, text: yTitle, color: d.muted, font: { family: d.family, size: FONT } }
          : undefined,
      },
    };
  }

  /* Plugin: etiqueta de valor sobre las barras indicadas (color-text).
     `indices` = array de índices a rotular. Durante el stagger omite la
     barra que aún está pegada a la base, para que el número aparezca junto
     con la barra y no antes. */
  function valueLabelPlugin(indices, fmt) {
    return {
      id: 'valueLabel',
      afterDatasetsDraw(chart) {
        if (!indices || !indices.length) return;
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const y0 = chart.scales.y.getPixelForValue(0);
        ctx.save();
        ctx.fillStyle = token('--color-text');
        ctx.font = '600 28px ' + token('--font-body');
        ctx.textAlign = 'center';
        indices.forEach((idx) => {
          const el = meta.data[idx];
          if (!el || el.y > y0 - 4) return;
          const v = chart.data.datasets[0].data[idx];
          ctx.fillText(fmt ? fmt(v) : v, el.x, el.y - 16);
        });
        ctx.restore();
      },
    };
  }

  /* Plugin: línea horizontal de umbral (p. ej. tasa exigida 12%). */
  function thresholdPlugin(yValue, label) {
    return {
      id: 'threshold',
      afterDraw(chart) {
        if (yValue == null) return;
        const { ctx, chartArea, scales: sc } = chart;
        const y = sc.y.getPixelForValue(yValue);
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = token('--color-text-muted');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
        if (label) {
          ctx.setLineDash([]);
          ctx.fillStyle = token('--color-text-muted');
          ctx.font = '500 24px ' + token('--font-body');
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, chartArea.right, y - 6);
        }
        ctx.restore();
      },
    };
  }

  const registry = [];
  function register(canvas, build) {
    const e = { canvas, build, instance: build(canvas) };
    registry.push(e);
    return e;
  }
  function refreshAll() {
    registry.forEach((e) => { if (e.instance) e.instance.destroy(); e.instance = e.build(e.canvas); });
  }
  /* Re-dispara la animación de entrada de un gráfico ya creado (al volver a
     entrar a su slide): se reconstruye el gráfico (mismo camino que el cambio
     de tema), garantizando que la animación de entrada vuelva a correr. */
  function replay(canvas) {
    const e = registry.find((x) => x.canvas === canvas);
    if (e) { if (e.instance) e.instance.destroy(); e.instance = e.build(e.canvas); }
  }

  /* ============================================================
     BAR · estilo base de TODOS los gráficos
     ============================================================ */
  function bar(canvas, { labels, data, keyIndex = data.length - 1, yMax, yTitle, yStep, valueLabel, valueLabelAll, valueLabelFmt, colorRamp, stagger, threshold, thresholdLabel } = {}) {
    const d = base();
    const n = data.length;
    // colorRamp: rampa de opacidad del acento (clara la 1ª -> opaca la última).
    const colors = colorRamp
      ? data.map((_, i) => withAlpha(d.accent, 0.4 + 0.6 * (n > 1 ? i / (n - 1) : 1)))
      : data.map((_, i) => (i === keyIndex ? d.accent : d.gray));
    const labelIdx = valueLabelAll ? data.map((_, i) => i) : (keyIndex == null ? [] : [keyIndex]);
    const plugins = [];
    if (valueLabel) plugins.push(valueLabelPlugin(labelIdx, valueLabelFmt || fmtNum));
    if (threshold != null) plugins.push(thresholdPlugin(threshold, thresholdLabel));
    // stagger: cada barra crece desde la base (eje X) con retardo creciente.
    const animation = stagger
      ? { duration: 650, easing: 'easeOutCubic', delay: (ctx) => (ctx.type === 'data' ? ctx.dataIndex * 220 : 0) }
      : { duration: 600, easing: 'easeOutCubic' };

    return new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets: [{
        data, backgroundColor: colors, borderWidth: 0, borderRadius: 4,
        maxBarThickness: 150, categoryPercentage: 0.6, barPercentage: 1,
      }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation,
        layout: { padding: { top: 36 } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: scales(d, { yMax, yTitle, yStep }),
      },
      plugins,
    });
  }

  /* ============================================================
     LINE · multi-serie. Serie clave = acento con punto final.
     series: [{label, data, role: 'key'|'base'|'negative'}]
     ============================================================ */
  function line(canvas, { labels, series, yMax, yStep } = {}) {
    const d = base();
    const colorFor = (role) => role === 'key' ? d.accent : role === 'negative' ? d.negative : d.gray;
    const datasets = series.map((s) => ({
      label: s.label,
      data: s.data,
      borderColor: colorFor(s.role),
      backgroundColor: colorFor(s.role),
      borderWidth: parseFloat(token('--chart-line-weight')) || 3,
      pointRadius: s.role === 'key' ? s.data.map((_, i) => (i === s.data.length - 1 ? 6 : 0)) : 0,
      pointBackgroundColor: colorFor(s.role),
      tension: 0.15,
      fill: false,
    }));
    return new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: scales(d, { yMax, yStep }),
      },
    });
  }

  /* ============================================================
     BAR GROUP · barras agrupadas multi-serie (p. ej. min/Conpro/máx).
     series: [{label, data, role: 'key'|'base'|'muted'}]
     Leyenda mínima arriba (necesaria para distinguir series).
     ============================================================ */
  function barGroup(canvas, { labels, series, yMax, yStep, yTitle, yFmt, legend = true, legendPosition = 'top' } = {}) {
    const d = base();
    const s3 = token('--chart-series-3') || d.gray;
    const colorFor = (role) => role === 'key' ? d.accent : role === 'muted' ? s3 : d.gray;
    const datasets = series.map((s) => ({
      label: s.label,
      data: s.data,
      backgroundColor: colorFor(s.role),
      borderWidth: 0, borderRadius: 4,
      categoryPercentage: 0.7, barPercentage: 0.92, maxBarThickness: 64,
    }));
    return new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
        layout: { padding: { top: 12 } },
        plugins: {
          legend: legend
            ? { display: true, position: legendPosition, align: legendPosition === 'bottom' ? 'center' : 'end',
                labels: { color: d.muted, font: { family: d.family, size: 22 }, boxWidth: 14, boxHeight: 14, padding: 18, usePointStyle: true, pointStyle: 'rectRounded' } }
            : { display: false },
          tooltip: { enabled: false },
        },
        scales: scales(d, { yMax, yTitle, yStep, yFmt }),
      },
    });
  }

  /* ============================================================
     BAR H · barras horizontales (p. ej. tornado de sensibilidad).
     accentIndices: índices de las barras clave (en acento).
     ============================================================ */
  function barH(canvas, { labels, data, accentIndices = [], xMax, xStep, xTitle } = {}) {
    const d = base();
    const set = new Set(accentIndices);
    const colors = data.map((_, i) => (set.has(i) ? d.accent : d.gray));
    return new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets: [{
        data, backgroundColor: colors, borderWidth: 0, borderRadius: 4,
        maxBarThickness: 46, categoryPercentage: 0.7, barPercentage: 0.92,
      }] },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: {
            beginAtZero: true, max: xMax,
            grid: { color: d.grid, lineWidth: 1 }, border: { display: false },
            ticks: { color: d.muted, font: { family: d.family, size: FONT }, stepSize: xStep },
            title: xTitle ? { display: true, text: xTitle, color: d.muted, font: { family: d.family, size: FONT } } : undefined,
          },
          y: {
            grid: { display: false }, border: { color: d.muted },
            ticks: { color: d.text, font: { family: d.family, size: FONT } },
          },
        },
      },
    });
  }

  /* Sensibilidad (PPT slide 24): tornado DIVERGENTE. Una fila por variable; el
     rango malo (gris, valores negativos) va a la IZQUIERDA y el rango bueno
     (amarillo, positivos) a la DERECHA, partiendo del caso base (0 = $2,39M).
     malo/bueno = variación del VAN respecto al caso base (MM). */
  function tornado(canvas, { labels, bueno, malo, xMin, xMax, xStep } = {}) {
    const d = base();
    const fmt$ = (v) => (v === 0 ? '$-' : v < 0 ? '$(' + Math.abs(v) + ')' : '$' + v);
    const barDef = (label, data, color) => ({
      label, data, backgroundColor: color, borderWidth: 0, borderRadius: 3,
      categoryPercentage: 0.72, barPercentage: 0.9, maxBarThickness: 30,
    });
    const centerLine = {
      id: 'centerLine',
      afterDatasetsDraw(chart) {
        const x = chart.scales.x.getPixelForValue(0);
        const { top, bottom } = chart.chartArea;
        const ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = d.muted; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
        ctx.restore();
      },
    };
    return new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets: [
        barDef('rango bueno', bueno, d.accent),
        barDef('rango malo', malo, d.gray),
      ] },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
        plugins: {
          legend: { display: true, position: 'bottom', align: 'end',
            labels: { color: d.muted, font: { family: d.family, size: 20 }, boxWidth: 14, boxHeight: 14, usePointStyle: true, pointStyle: 'rectRounded' } },
          tooltip: { enabled: false },
        },
        scales: {
          x: {
            stacked: true, min: xMin, max: xMax,
            grid: { color: d.grid, lineWidth: 1 }, border: { display: false },
            ticks: { color: d.muted, font: { family: d.family, size: 20 }, stepSize: xStep, callback: fmt$ },
          },
          y: {
            stacked: true,
            grid: { display: false }, border: { color: d.muted },
            ticks: { color: d.text, font: { family: d.family, size: 22 } },
          },
        },
      },
      plugins: [centerLine],
    });
  }

  return { token, register, refreshAll, replay, bar, line, barGroup, barH, tornado };
})();
