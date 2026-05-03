(function () {
  const aliases = {
    bukhar: "fever",
    "बुखार": "fever",
    "sir dard": "headache",
    "sar dard": "headache",
    "सिर दर्द": "headache",
    khansi: "cough",
    "खांसी": "cough",
    sardi: "runny nose",
    zukam: "runny nose",
    zukaam: "runny nose",
    "जुकाम": "runny nose",
    ulti: "vomiting",
    "उल्टी": "vomiting",
    dast: "diarrhea",
    "loose motion": "diarrhea",
    "पेट दर्द": "abdominal pain",
    "pet dard": "abdominal pain",
    "pait dard": "abdominal pain",
    chakkar: "dizziness",
    "चक्कर": "dizziness",
    kamzori: "weakness",
    thakan: "fatigue",
    "saans phoolna": "shortness of breath",
    "sans phoolna": "shortness of breath",
    "seene me dard": "chest pain",
    "chhati dard": "chest pain",
    piliya: "jaundice",
    ghabrahat: "anxiety",
    tension: "stress",
    "jodo ka dard": "joint pain",
    "badan dard": "body pain",
    kapkapi: "chills",
    balgam: "mucus",
    "gala dard": "sore throat",
    daura: "seizures",
    behoshi: "loss of consciousness"
  };

  const rules = {
    "Dengue Fever": { fever: 2, headache: 2, "joint pain": 3, rash: 2, vomiting: 1 },
    Malaria: { fever: 3, chills: 3, sweating: 2, "body pain": 1, headache: 1 },
    Typhoid: { fever: 3, "abdominal pain": 3, weakness: 2, vomiting: 2, headache: 1 },
    Cholera: { diarrhea: 3, vomiting: 2, dehydration: 3, "leg cramps": 2 },
    Gastroenteritis: { diarrhea: 3, vomiting: 2, nausea: 2, "abdominal pain": 2, fever: 1 },
    Bronchitis: { cough: 3, mucus: 2, fever: 1, "sore throat": 1, "shortness of breath": 2 },
    "Allergic Rhinitis": { sneezing: 3, "runny nose": 3, "itchy eyes": 2, "nasal congestion": 2, cough: 1 },
    Sinusitis: { "runny nose": 1, "nasal congestion": 3, "facial pain": 3, headache: 2, fever: 1 },
    Asthma: { wheezing: 3, "shortness of breath": 3, "chest tightness": 2, cough: 2 },
    Pneumonia: { cough: 3, fever: 2, chills: 2, "shortness of breath": 3, "chest pain": 2 },
    Jaundice: { jaundice: 3, "yellow skin": 3, "yellow eyes": 3, "dark urine": 2, fatigue: 1 },
    Anaemia: { fatigue: 3, weakness: 3, dizziness: 2, "shortness of breath": 1 },
    Hypertension: { headache: 2, dizziness: 2, "chest pain": 2, "shortness of breath": 2 },
    Migraine: { headache: 3, nausea: 2, vomiting: 2, dizziness: 1 },
    Vertigo: { dizziness: 3, nausea: 2, vomiting: 1, "balance problems": 2 },
    Epilepsy: { seizures: 3, "loss of consciousness": 2, confusion: 2 },
    "Paralysis (Stroke)": { weakness: 2, "facial drooping": 3, "slurred speech": 3, confusion: 2 },
    "Heart Disease (CAD)": { "chest pain": 3, "shortness of breath": 2, palpitations: 2, sweating: 1 },
    "Myocardial Infarction": { "chest pain": 3, "arm pain": 2, "jaw pain": 2, sweating: 2, nausea: 1 },
    "Heart Failure": { "shortness of breath": 3, "swollen legs": 3, fatigue: 2, cough: 1 },
    "Deep Vein Thrombosis": { "leg pain": 3, "swelling in leg": 3, warmth: 2, "difficulty walking": 1 },
    "Anxiety Disorder": { anxiety: 3, stress: 3, restlessness: 2 },
    Depression: { sadness: 3, fatigue: 2, "loss of interest": 3 }
  };

  function normalize(text) {
    let output = String(text || "").toLowerCase();
    Object.keys(aliases)
      .sort((a, b) => b.length - a.length)
      .forEach((key) => {
        output = output.split(key).join(aliases[key]);
      });
    return output;
  }

  function addStyles() {
    if (document.getElementById("sbdpsEnhancementStyles")) return;
    const style = document.createElement("style");
    style.id = "sbdpsEnhancementStyles";
    style.textContent = `
      .chat-toggle-btn{display:flex;align-items:center;gap:.45rem;padding:.42rem .8rem;border-radius:8px;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.3);color:#38bdf8;font-family:'Sora',sans-serif;font-size:.74rem;font-weight:600;cursor:pointer;white-space:nowrap}
      .chat-toggle-btn:hover{background:rgba(56,189,248,.15)}
      .chat-toggle-btn .btn-dot{width:7px;height:7px;border-radius:50%;background:#38bdf8}
      .predictor-section{padding:0 2rem;max-width:1200px;margin:1rem auto 0;position:relative;z-index:1}
      .predictor-card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden}
      .predictor-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.3rem;border-bottom:1px solid var(--border);cursor:pointer}
      .predictor-header-left{display:flex;align-items:center;gap:.75rem}
      .predictor-icon{width:32px;height:32px;border-radius:8px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.25);display:flex;align-items:center;justify-content:center}
      .predictor-title{font-size:.9rem;font-weight:600}
      .predictor-sub{font-size:.68rem;color:var(--muted)}
      .predictor-toggle-arrow{color:var(--muted);transition:transform .2s}
      .predictor-card.open .predictor-toggle-arrow{transform:rotate(180deg)}
      .predictor-body{display:none;padding:1rem 1.3rem}
      .predictor-card.open .predictor-body{display:block}
      .clarity-panel{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.9rem}
      .clarity-box{background:rgba(148,163,184,.045);border:1px solid var(--border);border-radius:10px;padding:.85rem}
      .clarity-box.warning{background:rgba(239,68,68,.055);border-color:rgba(239,68,68,.25)}
      .clarity-title{font-size:.72rem;font-weight:600;margin-bottom:.35rem}
      .clarity-list{font-size:.68rem;color:var(--muted);line-height:1.65}
      .warning .clarity-title{color:#fca5a5}.warning .clarity-list{color:#f59e0b}
      .emergency-number-strip{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.65rem}
      .emergency-number{padding:.22rem .6rem;border-radius:8px;background:rgba(239,68,68,.13);border:1px solid rgba(239,68,68,.35);color:#fecaca;font-size:.68rem;font-weight:700}
      .predictor-hint{font-size:.72rem;color:var(--muted);margin-bottom:.75rem}
      .predictor-input-row{display:flex;gap:.65rem;align-items:flex-end;flex-wrap:wrap}
      .predictor-textarea{flex:1;min-width:220px;height:70px;background:var(--surface);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Sora',sans-serif;font-size:.84rem;padding:.65rem .9rem;outline:none;resize:none}
      .predictor-run-btn{height:40px;padding:0 1.15rem;border-radius:10px;border:0;background:linear-gradient(135deg,rgba(139,92,246,.95),rgba(56,189,248,.8));color:#fff;font-family:'Sora',sans-serif;font-weight:600;cursor:pointer}
      .predictor-chips{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.75rem}
      .predictor-chip{padding:.22rem .62rem;border-radius:100px;background:rgba(148,163,184,.07);border:1px solid var(--border);color:var(--muted);font-size:.66rem;cursor:pointer}
      .predictor-chip:hover{background:rgba(139,92,246,.1);color:#a78bfa}
      .predictor-results{display:flex;flex-direction:column;gap:.7rem;margin-top:1rem}
      .pred-result{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;border-radius:12px;padding:1rem;border:1px solid rgba(148,163,184,.12);background:rgba(148,163,184,.045)}
      .pred-result.high{background:rgba(239,68,68,.07);border-color:rgba(239,68,68,.25)}.pred-result.medium{background:rgba(245,158,11,.07);border-color:rgba(245,158,11,.25)}.pred-result.low{background:rgba(16,185,129,.07);border-color:rgba(16,185,129,.25)}
      .pred-result-left{flex:1;min-width:160px}.pred-result-name{font-size:.9rem;font-weight:700}.pred-result-desc{font-size:.7rem;color:var(--muted)}
      .pred-result-right{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap}.pred-bar-wrap{width:100px;height:6px;background:rgba(148,163,184,.12);border-radius:100px;overflow:hidden}.pred-bar{height:100%;background:#38bdf8;border-radius:100px}.pred-pct{font-family:'DM Mono',monospace;font-size:.74rem}.pred-urg-badge{padding:.2rem .55rem;border-radius:100px;font-size:.64rem;border:1px solid rgba(148,163,184,.18)}
      .pred-no-match,.predictor-disclaimer{padding:.85rem;border-radius:10px;border:1px dashed var(--border);font-size:.78rem;color:var(--muted);text-align:center;background:rgba(148,163,184,.04)}
      .predictor-disclaimer{border-style:solid;color:#f59e0b;text-align:left;margin-top:.75rem}
      .chat-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:149}.chat-overlay.visible{display:block}
      .chat-panel{position:fixed;top:60px;right:0;bottom:0;width:400px;max-width:100vw;background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease;z-index:150}.chat-panel.open{transform:translateX(0)}
      .chat-header{padding:1rem 1.1rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;gap:.8rem}.chat-header-title{font-size:.88rem;font-weight:700}.chat-header-sub{font-size:.68rem;color:var(--muted)}.chat-close{background:none;border:0;color:var(--muted);font-size:1.35rem;cursor:pointer}
      .chat-messages{flex:1;overflow:auto;padding:1rem;display:flex;flex-direction:column;gap:.85rem}.msg{display:flex;flex-direction:column;gap:.25rem}.msg-user{align-items:flex-end}.msg-ai{align-items:flex-start}.msg-bubble{max-width:90%;padding:.72rem .9rem;border-radius:14px;font-size:.82rem;line-height:1.65}.msg-user .msg-bubble{background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.2)}.msg-ai .msg-bubble{background:var(--card);border:1px solid var(--border)}.msg-time{font-size:.58rem;color:var(--muted);font-family:'DM Mono',monospace}
      .chat-suggestions{display:flex;flex-wrap:wrap;gap:.35rem;padding:0 1rem .65rem}.suggestion-pill{padding:.25rem .65rem;border-radius:100px;border:1px solid var(--border);color:var(--muted);font-size:.66rem;cursor:pointer;background:rgba(148,163,184,.05)}
      .disclaimer{margin:0 1rem .65rem;padding:.55rem .7rem;border-radius:10px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2);color:#f59e0b;font-size:.66rem}
      .chat-input-area{display:flex;gap:.55rem;padding:.8rem 1rem 1rem;border-top:1px solid var(--border)}.chat-textarea{flex:1;min-height:40px;max-height:110px;resize:none;background:var(--card);border:1px solid var(--border);border-radius:12px;color:var(--text);padding:.65rem .85rem;font-family:'Sora',sans-serif}.chat-send{width:40px;height:40px;border:0;border-radius:10px;background:#38bdf8;color:#06080f;font-weight:800;cursor:pointer}
      @media(max-width:900px){.nav{height:auto;min-height:74px;padding:.65rem 1rem;flex-wrap:wrap;gap:.45rem}.nav-stats{order:3;flex:0 0 100%;display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;padding-top:.25rem;border-top:1px solid rgba(148,163,184,.08)}.top-emergency-box{margin-left:auto}.chat-toggle-btn{padding:.4rem .65rem}.hero{padding-top:2.5rem}.disease-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))}}
      @media(max-width:720px){.clarity-panel{grid-template-columns:1fr}.predictor-input-row{display:grid;grid-template-columns:1fr}.predictor-run-btn{width:100%;height:44px}.controls{display:grid;grid-template-columns:1fr}.urgency-filter{display:grid;grid-template-columns:repeat(3,1fr)}.chat-panel{top:0;width:100vw;height:100dvh;border-left:0}.chat-textarea,.search-wrap input,.predictor-textarea{font-size:16px}}
      @media(max-width:600px){.nav{min-height:96px;padding:.6rem .85rem}.nav-brand{max-width:38%;font-size:.58rem;line-height:1.3}.top-emergency-box{font-size:.58rem;padding:.34rem .48rem;line-height:1.15}.chat-toggle-btn .btn-label{display:none}.hero,.predictor-section,.legend,.controls,.grid-wrap{padding-left:1rem;padding-right:1rem}.legend{flex-wrap:nowrap;overflow-x:auto}.legend-item{flex:0 0 auto}.urgency-filter{grid-template-columns:1fr}.d-card{padding:1.05rem}.d-card-cat{white-space:normal;text-align:center}.d-spread{max-width:100%;text-align:left;flex-basis:100%}.d-expand-grid{grid-template-columns:1fr}.chat-suggestions{max-height:82px;overflow:auto}}
    `;
    document.head.appendChild(style);
  }

  function enhanceSearchAliases() {
    const aliasByEnglish = Object.entries(aliases).reduce((acc, [local, english]) => {
      if (!acc[english]) acc[english] = [];
      acc[english].push(local);
      return acc;
    }, {});
    document.querySelectorAll(".d-card").forEach((card) => {
      const search = (card.dataset.search || "").toLowerCase();
      const extras = [];
      Object.entries(aliasByEnglish).forEach(([english, words]) => {
        if (search.includes(english)) extras.push(...words);
      });
      card.dataset.search = `${search} ${extras.join(" ")}`;
    });
  }

  function addNavActions() {
    const nav = document.querySelector(".nav");
    if (!nav || document.getElementById("chatToggle")) return;
    const btn = document.createElement("button");
    btn.id = "chatToggle";
    btn.className = "chat-toggle-btn";
    btn.innerHTML = '<span class="btn-dot"></span><span class="btn-label">AI Assistant</span>';
    btn.addEventListener("click", () => toggleChat());
    nav.appendChild(btn);
  }

  function insertPredictor() {
    if (document.getElementById("predictorCard")) return;
    const legend = document.querySelector(".legend");
    if (!legend) return;
    const section = document.createElement("section");
    section.className = "predictor-section";
    section.innerHTML = `
      <div class="predictor-card open" id="predictorCard">
        <div class="predictor-header" id="predictorHeader">
          <div class="predictor-header-left">
            <div class="predictor-icon">🧠</div>
            <div>
              <div class="predictor-title">Symptom Predictor</div>
              <div class="predictor-sub">Rule-based engine · Hinglish/local words supported</div>
            </div>
          </div>
          <div class="predictor-toggle-arrow">▾</div>
        </div>
        <div class="predictor-body">
          <div class="clarity-panel">
            <div class="clarity-box">
              <div class="clarity-title">How to use</div>
              <div class="clarity-list">1. Write symptoms in simple words.<br>2. Use commas between symptoms.<br>3. Try words like bukhar, zukam, khansi, pet dard.</div>
            </div>
            <div class="clarity-box warning">
              <div class="clarity-title">Emergency warning</div>
              <div class="clarity-list">Chest pain, trouble breathing, unconsciousness, seizure, stroke signs, severe dehydration, or very high fever.</div>
              <div class="emergency-number-strip"><span class="emergency-number">Ambulance 108</span><span class="emergency-number">Emergency 112</span></div>
            </div>
          </div>
          <div class="predictor-hint">Enter symptoms separated by commas. English, Hinglish and common rural words are supported.</div>
          <div class="predictor-input-row">
            <textarea class="predictor-textarea" id="predictorInput" placeholder="bukhar, khansi, zukam, pet dard..."></textarea>
            <button class="predictor-run-btn" id="predictorRunBtn">Analyze</button>
          </div>
          <div class="predictor-chips" id="predictorChips"></div>
          <div class="predictor-results" id="predictorResults"></div>
        </div>
      </div>
    `;
    legend.parentNode.insertBefore(section, legend);
    document.getElementById("predictorHeader").addEventListener("click", () => {
      document.getElementById("predictorCard").classList.toggle("open");
    });
    document.getElementById("predictorRunBtn").addEventListener("click", runPredictor);
    document.getElementById("predictorInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        runPredictor();
      }
    });
    [
      "bukhar",
      "zukam",
      "khansi",
      "sir dard",
      "pet dard",
      "ulti",
      "dast",
      "chakkar",
      "kamzori",
      "saans phoolna",
      "seene me dard",
      "piliya",
      "balgam",
      "tension"
    ].forEach((symptom) => {
      const chip = document.createElement("button");
      chip.className = "predictor-chip";
      chip.type = "button";
      chip.textContent = symptom;
      chip.addEventListener("click", () => addSymptom(symptom));
      document.getElementById("predictorChips").appendChild(chip);
    });
  }

  function addSymptom(symptom) {
    const input = document.getElementById("predictorInput");
    const current = input.value.trim();
    const parts = current ? current.split(",").map((part) => part.trim()) : [];
    if (!parts.includes(symptom)) parts.push(symptom);
    input.value = parts.join(", ");
    input.focus();
  }

  function predict(text) {
    const symptoms = normalize(text)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const scored = Object.entries(rules)
      .map(([disease, diseaseRules]) => {
        let score = 0;
        const max = Object.values(diseaseRules).reduce((sum, value) => sum + value, 0);
        symptoms.forEach((symptom) => {
          Object.entries(diseaseRules).forEach(([rule, weight]) => {
            if (symptom === rule || symptom.includes(rule) || rule.includes(symptom)) score += weight;
          });
        });
        return [disease, Math.min(100, Math.round((score / max) * 10000) / 100)];
      })
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    return scored.map(([disease, confidence]) => ({
      disease,
      confidence,
      urgency: confidence > 60 ? "High" : confidence > 30 ? "Medium" : "Low"
    }));
  }

  function runPredictor() {
    const input = document.getElementById("predictorInput");
    const results = document.getElementById("predictorResults");
    const text = input.value.trim();
    if (!text) {
      results.innerHTML = '<div class="pred-no-match">Please enter at least one symptom.</div>';
      return;
    }
    const predictions = predict(text);
    if (!predictions.length) {
      results.innerHTML = '<div class="pred-no-match">No strong match found. Try more symptoms like bukhar, khansi, pet dard, saans phoolna.</div>';
      return;
    }
    results.innerHTML = predictions
      .map((item) => {
        const cls = item.urgency.toLowerCase();
        const label = item.urgency === "High" ? "High urgency" : item.urgency === "Medium" ? "Medium" : "Low";
        return `
          <div class="pred-result ${cls}">
            <div class="pred-result-left">
              <div class="pred-result-name">${item.disease}</div>
              <div class="pred-result-desc"><strong>Possible match, not diagnosis</strong> · symptom matching</div>
            </div>
            <div class="pred-result-right">
              <div class="pred-bar-wrap"><div class="pred-bar" style="width:${item.confidence}%"></div></div>
              <div class="pred-pct">${item.confidence}%</div>
              <div class="pred-urg-badge">${label}</div>
            </div>
          </div>`;
      })
      .join("");
    results.insertAdjacentHTML(
      "beforeend",
      '<div class="predictor-disclaimer">These predictions are educational and are not a medical diagnosis. For serious symptoms call Ambulance 108 or Emergency 112.</div>'
    );
  }

  function insertChat() {
    if (document.getElementById("chatPanel")) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="chat-overlay" id="chatOverlay"></div>
      <aside class="chat-panel" id="chatPanel">
        <div class="chat-header">
          <div><div class="chat-header-title">SBDPS AI Assistant</div><div class="chat-header-sub">Disease and symptom helper</div></div>
          <button class="chat-close" id="chatClose" aria-label="Close chat">&times;</button>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="msg msg-ai"><div class="msg-bubble">Hello. I can help explain diseases, symptoms, urgency and prevention. This is educational only. In emergencies call <strong>108</strong> for ambulance or <strong>112</strong>.</div><div class="msg-time">Now</div></div>
        </div>
        <div class="disclaimer">Educational use only. Not a substitute for professional medical advice. Ambulance: <strong>108</strong> · Emergency: <strong>112</strong></div>
        <div class="chat-suggestions">
          <button class="suggestion-pill" type="button">malaria symptoms</button>
          <button class="suggestion-pill" type="button">fever and cough</button>
          <button class="suggestion-pill" type="button">dengue vs malaria</button>
          <button class="suggestion-pill" type="button">when emergency?</button>
        </div>
        <div class="chat-input-area">
          <textarea class="chat-textarea" id="chatInput" rows="1" placeholder="Ask about disease or symptoms..."></textarea>
          <button class="chat-send" id="chatSend" aria-label="Send">➜</button>
        </div>
      </aside>`
    );
    document.getElementById("chatClose").addEventListener("click", closeChat);
    document.getElementById("chatOverlay").addEventListener("click", closeChat);
    document.getElementById("chatSend").addEventListener("click", sendChat);
    document.getElementById("chatInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendChat();
      }
    });
    document.querySelectorAll(".suggestion-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.getElementById("chatInput").value = pill.textContent;
        sendChat();
      });
    });
  }

  function toggleChat() {
    const panel = document.getElementById("chatPanel");
    if (!panel) return;
    panel.classList.contains("open") ? closeChat() : openChat();
  }

  function openChat() {
    document.getElementById("chatPanel")?.classList.add("open");
    if (innerWidth <= 768) document.getElementById("chatOverlay")?.classList.add("visible");
    setTimeout(() => document.getElementById("chatInput")?.focus(), 150);
  }

  function closeChat() {
    document.getElementById("chatPanel")?.classList.remove("open");
    document.getElementById("chatOverlay")?.classList.remove("visible");
  }

  function sendChat() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    appendMessage("user", text);
    input.value = "";
    appendMessage("ai", makeAnswer(text));
  }

  function appendMessage(role, text) {
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = `msg msg-${role}`;
    div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function makeAnswer(question) {
    const q = normalize(question);
    if (/emergency|serious|urgent|ambulance|112|108|seene|chest|saans|breath/.test(q)) {
      return "If there is chest pain, trouble breathing, unconsciousness, seizure, stroke signs, or severe dehydration, call <strong>Ambulance 108</strong> or <strong>Emergency 112</strong> immediately.";
    }
    const prediction = predict(q).slice(0, 3);
    if (prediction.length) {
      return `Based on symptom matching, possible matches are: <strong>${prediction.map((item) => item.disease).join(", ")}</strong>. This is not a diagnosis. Please consult a qualified doctor.`;
    }
    const diseaseCards = Array.from(document.querySelectorAll(".d-card"));
    const matched = diseaseCards.find((card) => q.includes(card.querySelector(".d-card-name")?.textContent.toLowerCase() || ""));
    if (matched) {
      return matched.textContent.replace(/\s+/g, " ").trim().slice(0, 500);
    }
    return "I can help with symptoms, disease information, urgency and prevention. Try asking: fever and cough, bukhar pet dard, malaria symptoms, or when to go emergency.";
  }

  window.addSymptom = addSymptom;
  window.runPredictor = runPredictor;

  document.addEventListener("DOMContentLoaded", () => {
    addStyles();
    enhanceSearchAliases();
    insertPredictor();
    insertChat();
    addNavActions();
  });
})();
