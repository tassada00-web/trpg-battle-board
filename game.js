const COLS = 10;
const ROWS = 8;

const board = document.querySelector("#board");
const logText = document.querySelector("#battleLog");
const logIcon = document.querySelector("#logIcon");
const emptyDetail = document.querySelector("#emptyDetail");
const unitSheet = document.querySelector("#unitSheet");
const detailBar = document.querySelector("#detailBar");
const sheetType = document.querySelector("#sheetType");
const sheetName = document.querySelector("#sheetName");
const primaryStats = document.querySelector("#primaryStats");
const skillList = document.querySelector("#skillList");
const addSkillButton = document.querySelector("#addSkill");
const deleteUnit = document.querySelector("#deleteUnit");
const resetMap = document.querySelector("#resetMap");
const restoreMap = document.querySelector("#restoreMap");

const inputs = {
  hp: document.querySelector("#unitHp"),
  maxHp: document.querySelector("#unitMaxHp"),
  stamina: document.querySelector("#unitStamina"),
  maxStamina: document.querySelector("#unitMaxStamina")
};

const PRIMARY_STATS = [
  ["str", "힘"],
  ["con", "건강"],
  ["spd", "속도"],
  ["pre", "정밀"],
  ["int", "지능"],
  ["wis", "지혜"],
  ["cha", "매력"]
];

const initialUnits = [
  unit("player", "P", 1, 5, "플레이어", { hp: 30, maxHp: 30, stamina: 14, maxStamina: 14, attack: 8, defense: 3, move: 4 }),
  unit("ally", "1", 1, 1, "아군 1", { hp: 18, maxHp: 18, stamina: 12, maxStamina: 12, attack: 5, defense: 1, move: 4 }),
  unit("ally", "2", 0, 4, "아군 2", { hp: 20, maxHp: 20, stamina: 10, maxStamina: 10, attack: 6, defense: 2, move: 3 }),
  unit("ally", "3", 1, 7, "아군 3", { hp: 16, maxHp: 16, stamina: 16, maxStamina: 16, attack: 7, defense: 1, move: 5 }),
  unit("enemy", "1", 2, 6, "적군 1", { hp: 17, maxHp: 17, stamina: 10, maxStamina: 10, attack: 5, defense: 1, move: 3 }),
  unit("enemy", "2", 3, 1, "적군 2", { hp: 19, maxHp: 19, stamina: 10, maxStamina: 10, attack: 6, defense: 2, move: 3 }),
  unit("enemy", "3", 4, 0, "적군 3", { hp: 22, maxHp: 22, stamina: 8, maxStamina: 8, attack: 7, defense: 2, move: 2 }),
  unit("enemy", "4", 4, 3, "적군 4", { hp: 24, maxHp: 24, stamina: 8, maxStamina: 8, attack: 8, defense: 3, move: 2 }),
  obstacle(1, 0),
  obstacle(3, 0),
  obstacle(1, 3),
  obstacle(3, 4),
  obstacle(1, 6)
];

let units = structuredClone(initialUnits);
let selectedUnitId = null;
let drag = null;
let skillDrag = null;
let idCounter = 100;

function unit(type, label, x, y, name, overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    x,
    y,
    stats: {
      name,
      hp: overrides.hp ?? 20,
      maxHp: overrides.maxHp ?? 20,
      stamina: overrides.stamina ?? 10,
      maxStamina: overrides.maxStamina ?? 10,
      attack: overrides.attack ?? 5,
      defense: overrides.defense ?? 1,
      move: overrides.move ?? 3,
      primary: {
        str: overrides.primary?.str ?? 10,
        con: overrides.primary?.con ?? 10,
        spd: overrides.primary?.spd ?? 10,
        pre: overrides.primary?.pre ?? 10,
        int: overrides.primary?.int ?? 10,
        wis: overrides.primary?.wis ?? 10,
        cha: overrides.primary?.cha ?? 10
      },
      skills: overrides.skills ?? []
    }
  };
}

function obstacle(x, y) {
  return unit("obstacle", "×", x, y, "장애물", {
    hp: 999,
    maxHp: 999,
    stamina: 0,
    maxStamina: 0,
    attack: 0,
    defense: 999,
    move: 0,
    primary: { str: 0, con: 0, spd: 0, pre: 0, int: 0, wis: 0, cha: 0 }
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function render() {
  board.innerHTML = "";

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      board.append(cell);
    }
  }

  units.forEach((piece) => {
    const cell = getCell(piece.x, piece.y);
    if (!cell) return;

    const el = document.createElement("button");
    el.className = `piece ${piece.type}${piece.id === selectedUnitId ? " selected" : ""}`;
    el.type = "button";
    el.dataset.id = piece.id;
    el.textContent = piece.label;
    el.title = `${piece.stats.name} | HP ${piece.stats.hp}/${piece.stats.maxHp} | STM ${piece.stats.stamina}/${piece.stats.maxStamina}`;
    el.addEventListener("pointerdown", startDrag);
    cell.append(el);
  });
}

function renderSheet() {
  const piece = getUnit(selectedUnitId);
  const showSheet = Boolean(piece);

  emptyDetail.hidden = showSheet;
  unitSheet.hidden = !showSheet;

  if (!piece) return;
  ensureUnitShape(piece);

  sheetType.textContent = typeLabel(piece.type);
  sheetName.value = piece.stats.name;
  inputs.hp.value = String(piece.stats.hp);
  inputs.maxHp.value = String(piece.stats.maxHp);
  inputs.stamina.value = String(piece.stats.stamina);
  inputs.maxStamina.value = String(piece.stats.maxStamina);
  deleteUnit.disabled = piece.type === "player";

  primaryStats.innerHTML = PRIMARY_STATS.map(([key, label]) => `
    <label class="stat-field">
      ${label}
      <input type="number" min="0" max="30" data-stat="${key}" value="${piece.stats.primary[key]}">
    </label>
  `).join("");

  renderSkills(piece);
}

function ensureUnitShape(piece) {
  piece.stats.maxHp ??= piece.stats.hp ?? 20;
  piece.stats.hp ??= piece.stats.maxHp;
  piece.stats.maxStamina ??= piece.stats.stamina ?? 10;
  piece.stats.stamina ??= piece.stats.maxStamina;
  piece.stats.primary ??= {};
  PRIMARY_STATS.forEach(([key]) => {
    piece.stats.primary[key] ??= piece.type === "obstacle" ? 0 : 10;
  });
  piece.stats.skills ??= [];
}

function renderSkills(piece) {
  if (!piece.stats.skills.length) {
    skillList.innerHTML = `<button class="skill-empty" type="button">+ 스킬 추가</button>`;
    skillList.querySelector(".skill-empty").addEventListener("click", addSkill);
    return;
  }

  skillList.innerHTML = piece.stats.skills.map((skill, index) => `
    <article class="skill-card" draggable="true" data-skill="${index}">
      <input type="text" data-skill-name="${index}" value="${escapeHtml(skill.name)}" aria-label="스킬 이름">
      <textarea data-skill-desc="${index}" aria-label="스킬 설명">${escapeHtml(skill.desc)}</textarea>
    </article>
  `).join("");

  skillList.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("dragstart", startSkillDrag);
    card.addEventListener("dragend", endSkillDrag);
  });
}

function selectUnit(id) {
  selectedUnitId = id;
  render();
  renderSheet();
}

function typeLabel(type) {
  return {
    player: "플레이어",
    ally: "아군",
    enemy: "적군",
    obstacle: "장애물"
  }[type];
}

function getCell(x, y) {
  return board.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function getUnitAt(x, y) {
  return units.find((piece) => piece.x === x && piece.y === y);
}

function getUnit(id) {
  return units.find((piece) => piece.id === id);
}

function startDrag(event) {
  if (event.button !== 0) return;

  const piece = getUnit(event.currentTarget.dataset.id);
  if (!piece) return;

  event.preventDefault();
  event.currentTarget.setPointerCapture(event.pointerId);

  drag = {
    id: piece.id,
    el: event.currentTarget
  };

  drag.el.classList.add("dragging");
  moveGhost(event.clientX, event.clientY);
  highlightTargets(piece);

  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", endDrag, { once: true });
}

function onDragMove(event) {
  if (!drag) return;
  moveGhost(event.clientX, event.clientY);
}

function moveGhost(x, y) {
  drag.el.style.left = `${x}px`;
  drag.el.style.top = `${y}px`;
}

function endDrag(event) {
  window.removeEventListener("pointermove", onDragMove);

  if (!drag) return;

  const piece = getUnit(drag.id);
  const targetCell = document.elementFromPoint(event.clientX, event.clientY)?.closest(".cell");

  clearHighlights();
  drag.el.classList.remove("dragging");
  drag.el.style.left = "";
  drag.el.style.top = "";

  if (piece && targetCell) {
    const x = Number(targetCell.dataset.x);
    const y = Number(targetCell.dataset.y);
    resolveDrop(piece, x, y);
  }

  drag = null;
  render();
  renderSheet();
}

function resolveDrop(piece, x, y) {
  const target = getUnitAt(x, y);

  if (!target) {
    piece.x = x;
    piece.y = y;
    writeLog(`${piece.stats.name} 이동: (${x + 1}, ${y + 1})`, "↦");
    return;
  }

  if (target.id === piece.id) {
    return;
  }

  if (target.type === "obstacle") {
    writeLog("장애물이 있어 이동할 수 없습니다.", "×");
    return;
  }

  if (isEnemy(piece, target)) {
    attack(piece, target);
    return;
  }

  writeLog("같은 편 유닛 위로는 이동할 수 없습니다.", "!");
}

function isEnemy(attacker, target) {
  if (attacker.type === "obstacle" || target.type === "obstacle") return false;
  if (attacker.type === "enemy") return target.type === "ally" || target.type === "player";
  return target.type === "enemy";
}

function attack(attacker, defender) {
  const damage = Math.max(1, attacker.stats.attack - defender.stats.defense);
  defender.stats.hp = clamp(defender.stats.hp - damage, 0, defender.stats.maxHp);

  const defenderEl = board.querySelector(`.piece[data-id="${defender.id}"]`);
  defenderEl?.classList.add("hit");

  if (defender.stats.hp <= 0) {
    units = units.filter((piece) => piece.id !== defender.id);
    if (selectedUnitId === defender.id) selectedUnitId = attacker.id;
    writeLog(`${attacker.stats.name} 공격! ${defender.stats.name}에게 ${damage} 피해. 격파!`, "⚔");
    return;
  }

  writeLog(`${attacker.stats.name} 공격! ${defender.stats.name}에게 ${damage} 피해. HP ${defender.stats.hp}`, "⚔");
}

function highlightTargets(piece) {
  document.querySelectorAll(".cell").forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    const target = getUnitAt(x, y);

    if (!target) {
      cell.classList.add("target");
    } else if (isEnemy(piece, target)) {
      cell.classList.add("attack-target");
    }
  });
}

function clearHighlights() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("target", "attack-target");
  });
}

function syncSheetToUnit() {
  const piece = getUnit(selectedUnitId);
  if (!piece) return;

  piece.stats.name = sheetName.value.trim() || piece.stats.name;
  piece.stats.maxHp = clamp(Number(inputs.maxHp.value) || 1, 1, 999);
  piece.stats.hp = clamp(Number(inputs.hp.value) || 0, 0, piece.stats.maxHp);
  piece.stats.maxStamina = clamp(Number(inputs.maxStamina.value) || 0, 0, 999);
  piece.stats.stamina = clamp(Number(inputs.stamina.value) || 0, 0, piece.stats.maxStamina);

  primaryStats.querySelectorAll("[data-stat]").forEach((input) => {
    piece.stats.primary[input.dataset.stat] = clamp(Number(input.value) || 0, 0, 30);
  });

  skillList.querySelectorAll("[data-skill-name]").forEach((input) => {
    const index = Number(input.dataset.skillName);
    if (piece.stats.skills[index]) piece.stats.skills[index].name = input.value.trim() || "이름 없는 스킬";
  });

  skillList.querySelectorAll("[data-skill-desc]").forEach((input) => {
    const index = Number(input.dataset.skillDesc);
    if (piece.stats.skills[index]) piece.stats.skills[index].desc = input.value;
  });

  render();
}

function removeSelectedUnit() {
  const piece = getUnit(selectedUnitId);
  if (!piece || piece.type === "player") return;

  units = units.filter((item) => item.id !== piece.id);
  writeLog(`${piece.stats.name} 삭제 완료.`, "×");
  selectedUnitId = null;
  render();
  renderSheet();
}

function addSkill() {
  const piece = getUnit(selectedUnitId);
  if (!piece) return;

  syncSheetToUnit();
  piece.stats.skills.push({
    id: crypto.randomUUID(),
    name: `스킬 ${piece.stats.skills.length + 1}`,
    desc: ""
  });
  renderSheet();
}

function startSkillDrag(event) {
  syncSheetToUnit();
  skillDrag = {
    unitId: selectedUnitId,
    index: Number(event.currentTarget.dataset.skill)
  };
  event.currentTarget.classList.add("dragging-skill");
  event.dataTransfer.effectAllowed = "move";
}

function endSkillDrag(event) {
  event.currentTarget.classList.remove("dragging-skill");
  const piece = getUnit(skillDrag?.unitId);
  const outsideDetail = !detailBar.contains(document.elementFromPoint(event.clientX, event.clientY));

  if (piece && outsideDetail) {
    const removed = piece.stats.skills.splice(skillDrag.index, 1)[0];
    writeLog(`${removed.name} 스킬 삭제.`, "×");
    renderSheet();
  }

  skillDrag = null;
}

function addUnit(type) {
  const empty = findEmptyCell();
  if (!empty) {
    writeLog("빈 칸이 없습니다.", "!");
    return;
  }

  if (type === "obstacle") {
    const added = obstacle(empty.x, empty.y);
    units.push(added);
    selectedUnitId = added.id;
    writeLog("장애물을 추가했습니다.", "+");
  } else {
    idCounter += 1;
    const label = type === "ally" ? "A" : "E";
    const name = type === "ally" ? `아군 ${idCounter}` : `적군 ${idCounter}`;
    const added = unit(type, label, empty.x, empty.y, name, {});
    units.push(added);
    selectedUnitId = added.id;
    writeLog(`${name} 추가 완료.`, "+");
  }

  render();
  renderSheet();
}

function findEmptyCell() {
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!getUnitAt(x, y)) return { x, y };
    }
  }
  return null;
}

function writeLog(text, icon = "⚔") {
  logIcon.textContent = icon;
  logText.textContent = text;
}

function resetToBlank() {
  units = [];
  selectedUnitId = null;
  writeLog("빈 배틀맵으로 재설정했습니다.", "↻");
  render();
  renderSheet();
}

function restoreInitial() {
  units = structuredClone(initialUnits);
  selectedUnitId = null;
  writeLog("초기 배치로 복귀했습니다.", "↩");
  render();
  renderSheet();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => addUnit(button.dataset.add));
});

board.addEventListener("contextmenu", (event) => {
  const pieceElement = event.target.closest(".piece");
  if (!pieceElement) return;

  event.preventDefault();
  event.stopPropagation();
  selectUnit(pieceElement.dataset.id);
  writeLog("선택한 유닛의 상세 능력치를 표시했습니다.", "◆");
});

unitSheet.addEventListener("input", syncSheetToUnit);
unitSheet.addEventListener("submit", (event) => event.preventDefault());
addSkillButton.addEventListener("click", addSkill);
deleteUnit.addEventListener("click", removeSelectedUnit);
resetMap.addEventListener("click", resetToBlank);
restoreMap.addEventListener("click", restoreInitial);

document.addEventListener("contextmenu", (event) => {
  if (!event.target.closest(".piece")) event.preventDefault();
});

render();
renderSheet();
