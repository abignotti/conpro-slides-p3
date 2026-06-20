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

  function scales(d, { yMax, yTitle, yStep } = {}) {
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
        ticks: { color: d.muted, font: { family: d.family, size: FONT }, stepSize: yStep },
        title: yTitle
          ? { display: true, text: yTitle, color: d.muted, font: { family: d.family, size: FONT } }
          : undefined,
      },
    };
  }

  /* Plugin: etiqueta de valor sobre la barra clave (color-text). */
  function valueLabelPlugin(keyIndex, fmt) {
    return {
      id: 'valueLabel',
      afterDatasetsDraw(chart) {
        if (keyIndex == null) return;
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const el = meta.data[keyIndex];
        if (!el) return;
        const v = chart.data.datasets[0].data[keyIndex];
        ctx.save();
        ctx.fillStyle = token('--color-text');
        ctx.font = '600 28px ' + token('--font-body');
        ctx.textAlign = 'center';
        ctx.fillText(fmt ? fmt(v) : v, el.x, el.y - 16);
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

  /* ============================================================
     BAR · estilo base de TODOS los gráficos
     ============================================================ */
  function bar(canvas, { labels, data, keyIndex = data.length - 1, yMax, yTitle, yStep, valueLabel, threshold, thresholdLabel } = {}) {
    const d = base();
    const colors = data.map((_, i) => (i === keyIndex ? d.accent : d.gray));
    const plugins = [];
    if (valueLabel) plugins.push(valueLabelPlugin(keyIndex));
    if (threshold != null) plugins.push(thresholdPlugin(threshold, thresholdLabel));

    return new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets: [{
        data, backgroundColor: colors, borderWidth: 0, borderRadius: 4,
        maxBarThickness: 150, categoryPercentage: 0.6, barPercentage: 1,
      }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
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

  return { token, register, refreshAll, bar, line };
})();
