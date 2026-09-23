const form = document.querySelector("#quote-form");
const priceButton = document.querySelector("#price-button");
const canvas = document.querySelector("#curve-chart");
const tooltip = document.querySelector("#chart-tooltip");
const historyBody = document.querySelector("#quote-history");
let latestCandidates = [];
let recommendedSpread = null;
let quoteNumber = 1;
let history = [];

const el = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function updateClock() {
  el("clock").textContent = `${new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(new Date())} ET`;
}

function syncRangeOutputs() {
  el("volatility-output").textContent = `${Number(el("volatility").value).toFixed(1)} bps`;
  el("liquidity-output").textContent = `${Math.round(Number(el("liquidity").value) * 100)}%`;
  const imbalance = Number(el("imbalance").value);
  el("imbalance-output").textContent = `${imbalance > 0 ? "+" : ""}${imbalance.toFixed(2)}`;
}

function requestPayload() {
  const data = new FormData(form);
  return {
    currency_pair: data.get("currency_pair"),
    side: data.get("side"),
    notional_millions: Number(data.get("notional_millions")),
    volatility_bps: Number(data.get("volatility_bps")),
    liquidity_score: Number(data.get("liquidity_score")),
    order_book_imbalance: Number(data.get("order_book_imbalance")),
    client_tier: Number(data.get("client_tier")),
    validity_seconds: Number(data.get("validity_seconds"))
  };
}

function setLoading(isLoading) {
  priceButton.disabled = isLoading;
  priceButton.firstElementChild.textContent = isLoading ? "Calculating..." : "Run pricing model";
}

function showError(message) {
  el("toast").textContent = message;
  el("toast").hidden = false;
  setTimeout(() => { el("toast").hidden = true; }, 5000);
}

function updateResult(result, request) {
  el("result-pair").textContent = result.currency_pair;
  el("result-side").textContent = `CLIENT ${request.side === "buy" ? "BUYS" : "SELLS"}`;
  el("result-side").className = `side-badge ${request.side}`;
  el("model-version").textContent = `${result.model_name} / ${result.model_version}`;
  el("bid-price").textContent = result.recommended_bid.toFixed(5);
  el("mid-price").textContent = result.mid.toFixed(5);
  el("ask-price").textContent = result.recommended_ask.toFixed(5);
  el("spread-value").textContent = result.spread_pips.toFixed(1);

  const fillPercent = result.fill_probability * 100;
  el("fill-value").textContent = `${fillPercent.toFixed(1)}%`;
  el("fill-bar").style.width = `${fillPercent}%`;
  el("fill-rating").textContent = fillPercent >= 65 ? "HIGH" : fillPercent >= 40 ? "BALANCED" : "LOW";
  el("pnl-value").textContent = money.format(result.expected_pnl_usd);
  const baseline = result.candidates.find(candidate => candidate.spread_pips === 1.0);
  const uplift = baseline ? result.expected_pnl_usd - baseline.expected_pnl_usd : 0;
  el("pnl-delta").textContent = `${uplift >= 0 ? "+" : ""}${money.format(uplift)} vs 1.0 pip baseline`;

  const qualityScore = Math.max(1, Math.min(5, Math.round((request.liquidity_score * .5 + result.fill_probability * .5) * 5)));
  el("quality-value").textContent = ["Weak", "Fair", "Good", "Strong", "Excellent"][qualityScore - 1];
  [...el("quality-pills").children].forEach((pill, index) => pill.classList.toggle("active", index < qualityScore));

  latestCandidates = result.candidates;
  recommendedSpread = result.spread_pips;
  drawChart();
  addHistory(result, request);
}

function addHistory(result, request) {
  history.unshift({
    time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()),
    pair: result.currency_pair,
    side: request.side,
    notional: request.notional_millions,
    spread: result.spread_pips,
    fill: result.fill_probability,
    pnl: result.expected_pnl_usd
  });
  history = history.slice(0, 8);
  historyBody.innerHTML = history.map(item => `
    <tr>
      <td>${item.time}</td><td>${item.pair}</td><td class="history-${item.side}">${item.side.toUpperCase()}</td>
      <td>$${item.notional.toFixed(1)}MM</td><td>${item.spread.toFixed(1)} pips</td>
      <td>${(item.fill * 100).toFixed(1)}%</td><td class="history-pnl">${money.format(item.pnl)}</td>
    </tr>`).join("");
  quoteNumber += 1;
  el("ticket-id").textContent = `RFQ-${String(quoteNumber).padStart(4, "0")}`;
}

function chartGeometry() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height, left: 48, right: 44, top: 14, bottom: 30 };
}

function drawChart() {
  const g = chartGeometry();
  const { ctx, width, height, left, right, top, bottom } = g;
  ctx.clearRect(0, 0, width, height);
  if (!latestCandidates.length) return;

  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const maxPnl = Math.max(...latestCandidates.map(c => c.expected_pnl_usd), 1) * 1.15;
  const x = index => left + (index / (latestCandidates.length - 1)) * plotW;
  const pnlY = value => top + plotH - (Math.max(0, value) / maxPnl) * plotH;
  const fillY = value => top + plotH - value * plotH;

  ctx.font = "9px DM Mono, monospace";
  ctx.fillStyle = "#707a73";
  ctx.strokeStyle = "#252b27";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(width - right, y); ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(`$${Math.round(maxPnl * (1 - i / 4))}`, left - 8, y + 3);
    ctx.textAlign = "left";
    ctx.fillText(`${Math.round((1 - i / 4) * 100)}%`, width - right + 8, y + 3);
  }

  const selectedIndex = latestCandidates.findIndex(c => c.spread_pips === recommendedSpread);
  if (selectedIndex >= 0) {
    const selectedX = x(selectedIndex);
    ctx.fillStyle = "rgba(184, 242, 74, .05)";
    ctx.fillRect(selectedX - plotW / latestCandidates.length / 2, top, plotW / latestCandidates.length, plotH);
    ctx.strokeStyle = "rgba(184, 242, 74, .35)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(selectedX, top); ctx.lineTo(selectedX, top + plotH); ctx.stroke();
    ctx.setLineDash([]);
  }

  const line = (valueY, color) => {
    ctx.beginPath();
    latestCandidates.forEach((candidate, index) => {
      const y = valueY(candidate);
      if (index === 0) ctx.moveTo(x(index), y); else ctx.lineTo(x(index), y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  };
  line(c => pnlY(c.expected_pnl_usd), "#b8f24a");
  line(c => fillY(c.fill_probability), "#5ed4c6");

  latestCandidates.forEach((candidate, index) => {
    if (index % 2 !== 0 && index !== selectedIndex) return;
    ctx.fillStyle = index === selectedIndex ? "#b8f24a" : "#89928c";
    ctx.beginPath(); ctx.arc(x(index), pnlY(candidate.expected_pnl_usd), index === selectedIndex ? 4 : 2, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = "#707a73"; ctx.textAlign = "center";
  latestCandidates.forEach((candidate, index) => {
    if (index % 3 === 0 || index === latestCandidates.length - 1) ctx.fillText(candidate.spread_pips.toFixed(1), x(index), height - 9);
  });
  ctx.fillText("spread (pips)", left + plotW / 2, height);
}

function candidateAt(clientX) {
  const rect = canvas.getBoundingClientRect();
  const left = 48;
  const plotW = rect.width - left - 44;
  const relative = Math.max(0, Math.min(plotW, clientX - rect.left - left));
  return Math.round((relative / plotW) * (latestCandidates.length - 1));
}

canvas.addEventListener("mousemove", event => {
  if (!latestCandidates.length) return;
  const candidate = latestCandidates[candidateAt(event.clientX)];
  const rect = canvas.getBoundingClientRect();
  tooltip.innerHTML = `<strong>${candidate.spread_pips.toFixed(1)} pips</strong><br>P&amp;L ${money.format(candidate.expected_pnl_usd)}<br>Fill ${(candidate.fill_probability * 100).toFixed(1)}%`;
  tooltip.hidden = false;
  tooltip.style.left = `${Math.min(event.clientX - rect.left + 10, rect.width - 130)}px`;
  tooltip.style.top = `${Math.max(4, event.clientY - rect.top - 65)}px`;
});
canvas.addEventListener("mouseleave", () => { tooltip.hidden = true; });

form.addEventListener("submit", async event => {
  event.preventDefault();
  const request = requestPayload();
  setLoading(true);
  try {
    const response = await fetch("/v1/quote", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error(`Pricing service returned ${response.status}`);
    updateResult(await response.json(), request);
  } catch (error) {
    showError(`${error.message}. Check that the pricing service is running.`);
  } finally {
    setLoading(false);
  }
});

["volatility", "liquidity", "imbalance"].forEach(id => el(id).addEventListener("input", syncRangeOutputs));
el("reset-market").addEventListener("click", () => {
  el("volatility").value = 3; el("liquidity").value = .85; el("imbalance").value = .05; syncRangeOutputs();
});
el("clear-history").addEventListener("click", () => {
  history = [];
  historyBody.innerHTML = '<tr class="empty-row"><td colspan="7">Run the model to start this session\'s quote history.</td></tr>';
});
window.addEventListener("resize", drawChart);

async function initialize() {
  updateClock(); setInterval(updateClock, 1000); syncRangeOutputs();
  try {
    const response = await fetch("/health");
    if (!response.ok) throw new Error();
    const health = await response.json();
    el("model-version").textContent = `synthetic_fx_quote_acceptance / ${health.model_version}`;
    form.requestSubmit();
  } catch {
    document.querySelector(".status-dot").classList.add("error");
    el("market-status").textContent = "Model unavailable";
    showError("The pricing service is unavailable.");
  }
}

initialize();
