// --- AVATAR UPLOAD ---
const uploadInput = document.getElementById('upload-input');
const avatarImg = document.getElementById('avatar-img');

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      avatarImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// --- LEVEL UP + PROFICIÊNCIA  ---
const levelBtn = document.getElementById('level-up-btn');
const hpNumber = document.querySelector('.hp-number');
const profBonusDisplay = document.getElementById('proficiency-bonus');

let currentLevel = 1;

function getProficiencyBonus(level) {
  if (level >= 1 && level <= 4) return 2;
  if (level >= 5 && level <= 8) return 3;
  if (level >= 9 && level <= 12) return 4;
  if (level >= 13 && level <= 16) return 5;
  return 6;
}

levelBtn.addEventListener('click', () => {
  if (currentLevel < 20) {
    currentLevel++;
  } else {
    currentLevel = 1;
  }
  hpNumber.textContent = currentLevel;
  const newBonus = getProficiencyBonus(currentLevel);
  profBonusDisplay.textContent = `+${newBonus}`;
  
  updateSkills(); // Atualiza as skills automaticamente ao subir de nível
});

// --- INSPIRATION BUTTON ---
const inspirationBtn = document.getElementById('inspiration-btn');

inspirationBtn.addEventListener('click', () => {
  inspirationBtn.classList.toggle('filled');
});

// --- DADO DROP MENU ---
const dadoTitulo = document.querySelector(".dado");
const lista = document.getElementById("lista-dado");
const resultado = document.getElementById("dado-selecionado");

dadoTitulo.addEventListener("click", () => {
  lista.classList.toggle("mostrar");
});

lista.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    document.querySelectorAll("#lista-dado li").forEach(li => li.classList.remove("selected"));
    e.target.classList.add("selected");
    resultado.textContent = e.target.textContent;
    lista.classList.remove("mostrar");
  }
});

// --- HP BAR UPDATE ---
const currentInput = document.getElementById("hp-current");
const maxInput = document.getElementById("hp-max");
const hpBar = document.querySelector(".hp-bar");

function updateHPBar() {
  const current = parseInt(currentInput.value) || 0;
  const max = parseInt(maxInput.value) || 1;
  const percentage = Math.min((current / max) * 100, 100);
  hpBar.style.width = percentage + "%";
}

currentInput.addEventListener("input", updateHPBar);
maxInput.addEventListener("input", updateHPBar);

// --- SPEED TOGGLE ---
const toggleSpeedBtn = document.getElementById('toggle-speed');
const speedDetails = document.querySelector('.speed-details');
const speedLabels = document.querySelector('.speed-labels');

toggleSpeedBtn.addEventListener('click', () => {
  const isHidden = speedDetails.classList.toggle('hidden');
  speedLabels.classList.toggle('hidden');
  toggleSpeedBtn.textContent = isHidden ? '▼' : '▲';
});

// --- ARMOR CLASS CALCULATION ---
const armorBaseInput = document.getElementById('armor-base-value');
const dexterityInput = document.getElementById('dexterity-value');
const shieldInput = document.getElementById('shield-value');
const armorTotalInput = document.getElementById('armor-total');

function parseValue(val) {
  if (!val || val === '--') return 0;
  return Number(val.replace(/\+/g, '').trim()) || 0;
}

function updateArmorClass() {
  const armorVal = parseValue(armorBaseInput.value);
  const dexVal = parseValue(dexterityInput.value);
  const shieldVal = parseValue(shieldInput.value);
  const total = armorVal + dexVal + shieldVal;
  armorTotalInput.value = total;
}

armorBaseInput.addEventListener('input', updateArmorClass);
dexterityInput.addEventListener('input', updateArmorClass);
shieldInput.addEventListener('input', updateArmorClass);
updateArmorClass();

// --- ABILITY MODIFIERS ---
function calculateModifier(score) {
  const parsed = parseInt(score);
  if (isNaN(parsed)) return 0; // Retorna número para facilitar contas
  return Math.floor((parsed - 10) / 2);
}

// Mapeamento dos nomes para abreviações usadas nas skills
const abilityMap = {
  'Strength': 'STR',
  'Dexterity': 'DEX',
  'Constitution': 'CON',
  'Intelligence': 'INT',
  'Wisdom': 'WIS',
  'Charisma': 'CHA'
};

function updateSkills() {
  const abilityModifiers = {};

  // Atualiza modificadores das habilidades
  document.querySelectorAll('.ability-box').forEach(box => {
    const abilityName = box.querySelector('.label-name').textContent.trim();
    const input = box.querySelector('.score');
    let val = parseInt(input.value);
    if (isNaN(val)) val = 10;
    if (val < 0) val = 0;
    if (val > 30) val = 30;
    input.value = val;

    const mod = calculateModifier(val);
    const abbr = abilityMap[abilityName];
    if (abbr) abilityModifiers[abbr] = mod;

    const modDiv = box.querySelector('.modifier');
    modDiv.textContent = (mod >= 0 ? '+' : '') + mod;
  });

  // Atualiza as skills somando o modificador e proficiência
  document.querySelectorAll('.skill-item').forEach(skill => {
    const abilityAbbr = skill.getAttribute('data-ability');
    const mod = abilityModifiers[abilityAbbr] || 0;

    const proficiencyToggle = skill.querySelector('.proficiency-toggle');
    const doubleProfToggle = skill.querySelector('.double-proficiency-toggle');

    const rawBonusText = profBonusDisplay.textContent.replace('+', '').trim();
    const bonusValue = parseInt(rawBonusText) || 0;

    let profBonus = 0;
    if (proficiencyToggle && proficiencyToggle.checked) {
      profBonus += bonusValue;
    }
    if (doubleProfToggle && doubleProfToggle.checked) {
      profBonus += bonusValue;
    }

    const totalBonus = mod + profBonus;

    const skillBonusSpan = skill.querySelector('.skill-bonus');
    skillBonusSpan.textContent = (totalBonus >= 0 ? '+' : '') + totalBonus;
  });

  // Atualiza iniciativa, por exemplo
  const initiativeBtn = document.querySelector('.initiative-btn');
  if (initiativeBtn) {
    const dexMod = abilityModifiers['DEX'] || 0;
    initiativeBtn.textContent = `Iniciativa ${(dexMod >= 0 ? '+' : '') + dexMod}`;
  }
}
/* BONUS DE PROFICIENCIA*/

document.querySelectorAll('.ability-box').forEach(box => {
  const input = box.querySelector('.score');
  const modDiv = box.querySelector('.modifier');
  
  function updateMod() {
    const mod = calculateModifier(input.value);
    modDiv.textContent = (mod >= 0 ? '+' : '') + mod;
    updateSkills();
  }
  
  updateMod();
  input.addEventListener('input', updateMod);
});

document.querySelectorAll('.proficiency-toggle').forEach(checkbox => {
  checkbox.addEventListener('change', updateSkills);
});

document.querySelectorAll('.double-proficiency-toggle').forEach(checkbox => {
  checkbox.addEventListener('change', updateSkills);
});

document.querySelectorAll('.ability-box .score').forEach(input => {
  input.addEventListener('input', () => {
    let val = parseInt(input.value);
    if (isNaN(val)) return;
    if (val < 0) input.value = 0;
    else if (val > 30) input.value = 30;
  });
});

// Atualiza tudo ao carregar a página
updateSkills();

/* CALCULO PARA CA --- */
document.querySelectorAll('.ability-box').forEach(box => {
  const input = box.querySelector('.score');
  const modDiv = box.querySelector('.modifier');
  const label = box.querySelector('.label-name').textContent.trim();
  
  function updateMod() {
    const mod = calculateModifier(input.value);
    modDiv.textContent = mod;
    
    if (label === "Dexterity") {
      const dexInput = document.getElementById("dexterity-value");
      if (dexInput) {
        dexInput.value = mod;
        updateArmorClass(); 
      }
    }
  }
  
  updateMod();
  input.addEventListener('input', updateMod);
});

/* ------------------------
MULTI-SELEÇÃO DROPDOWNS
-------------------------- */

function setupMultiSelect(sectionSelector, menuItems) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;
  
  const content = section.querySelector('.section-content');
  const menu = section.querySelector('.dropdown-menu');
  menu.innerHTML = '';
  
  menuItems.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" value="${item}"> ${item}</label>`;
    menu.appendChild(li);
  });
  
  content.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown-menu').forEach(m => {
      if (m !== menu) m.classList.add('hidden');
    });
    menu.classList.toggle('hidden');
  });
  
  menu.addEventListener('change', () => {
    const selected = Array.from(menu.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    content.textContent = selected.length > 0 ? selected.join(', ') : 'None';
  });
  
  document.addEventListener('click', e => {
    if (!section.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
  
  content.addEventListener("blur", () => {
    if (content.textContent.trim() === "") {
      content.textContent = "None";
    }
  });
  
  content.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      content.blur();
    }
  });
}

setupMultiSelect('.section.weapons', [
  "Simple Melee Weapons", "Simple Ranged Weapons",
  "Martial Melee Weapons", "Martial Ranged Weapons"
]);

setupMultiSelect('.section.armor', [
  "Light Armor", "Medium Armor", "Heavy Armor", "Shield"
]);

setupMultiSelect('.section.tools', [
  "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies",
  "Carpenter's tools", "Cartographer's tools", "Cobblers' tools",
  "Cook's utensils", "Glassblower's tools", "Jeweler's tools",
  "Leatherworker's tools", "Mason's tools", "Painter's supplies",
  "Potter's tools", "Smith's tools", "Tinkerer's tools",
  "Weaver's tools", "Woodcarver's tools", "Disguise kit",
  "Forgery kit", "Herbalism kit", "Thieves' tools", "Navigator's tools",
  "Dice set", "Playing card set"
]);

setupMultiSelect('.section.languages', [
  "Common", "Dwarvish", "Elvish", "Giant", "Gnomish",
  "Goblin", "Halfling", "Orc", "Abyssal", "Celestial",
  "Draconic", "Deep Speech", "Infernal", "Primordial",
  "Sylvan", "Undercommon"
]);

setupMultiSelect('.section.resistencias-dano', [
  "Ácido", "Contundente", "Cortante", "Elétrico", "Força", "Gélido",
  "Ígneo", "Necrótico", "Perfurante", "Psíquico", "Radiante", "Trovejante", "Venenoso"
]);

setupMultiSelect('.section.resistencias-condicoes', [
  "Amedrontado", "Atordoado", "Caído", "Cego", "Enfeitiçado", "Enfraquecido",
  "Envenenado", "Inconsciente", "Incapacitado", "Invisível", "Paralisado",
  "Petrificado", "Restrito", "Surdo"
]);

document.addEventListener('DOMContentLoaded', () => {
  /********* 
  NAVBAR 
  ********/
  const links = document.querySelectorAll('.nav-link');
  const contents = document.querySelectorAll('.tab-content');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      contents.forEach(content => content.style.display = 'none');
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.style.display = 'block';
    });
  });
  
  // --- ABILITY MODS UTILS ---
  const abilityMap = {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma'
  };
  
  function getAbilityModifier(abilityCode) {
    const abilityName = abilityMap[abilityCode];
    const abilityBox = Array.from(document.querySelectorAll('.ability-box')).find(box =>
      box.querySelector('.label-name').textContent.trim() === abilityName
    );
    if (!abilityBox) return 0; // retorna número 0 em vez de "+0"
    
    const modText = abilityBox.querySelector('.modifier').textContent.trim();
    // Remove o sinal '+' e converte para número inteiro
    return parseInt(modText.replace('+', ''), 10) || 0;
  }
  
  // --- ATAQUE ---
  
  // Toggle formulário de ataque
  document.querySelector('.add-attack-btn').addEventListener('click', () => {
    const form = document.getElementById('attack-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });
  
  // Resetar formulário
  function resetForm() {
    document.getElementById('attack-form').style.display = 'none';
    document.getElementById('attack-name').value = '';
    document.getElementById('weapon-select').selectedIndex = 0;
    document.getElementById('damage-die').selectedIndex = 0;
    document.getElementById('modifier').selectedIndex = 0;
    document.getElementById('damage-type').selectedIndex = 0;
    document.getElementById('is-magic').checked = false;
    document.getElementById('attack-bonus').selectedIndex = 0; // reset bônus
  }
  
  // Elementos relacionados ao modificador para mostrar valor ao lado (opcional)
  const modifierSelect = document.getElementById('modifier');
  const modifierValueSpan = document.getElementById('modifier-value');
  
  function updateModifierValue() {
    const selected = modifierSelect.value;
    // if(modifierValueSpan) {
    //   modifierValueSpan.textContent = getAbilityModifier(selected);
    // }
  }
  function calculateModifier(score) {
    let parsed = parseInt(score);
    if (isNaN(parsed)) return 0;
    
    // Limita o valor ao máximo de 30 e mínimo de 0
    if (parsed > 30) parsed = 30;
    if (parsed < 0) parsed = 0;
    
    return Math.floor((parsed - 10) / 2);
  }
  
  function updateModifier(box) {
    const scoreInput = box.querySelector('.score');
    const modDiv = box.querySelector('.modifier');
    
    const score = parseInt(scoreInput.value, 10) || 10; // se vazio, usa 10
    const mod = calculateModifier(score);
    const modText = (mod >= 0 ? '+' : '') + mod;
    modDiv.textContent = modText;
  }
  
  // Atualiza todos ao carregar a página
  function updateAllModifiers() {
    document.querySelectorAll('.ability-box').forEach(updateModifier);
  }
  
  // Atualiza ao mudar o valor do input
  document.querySelectorAll('.ability-box .score').forEach(input => {
    input.addEventListener('input', e => {
      const box = e.target.closest('.ability-box');
      updateModifier(box);
    });
  });
  
  // Executa o update inicial
  updateAllModifiers();
  
  
  modifierSelect.addEventListener('change', updateModifierValue);
  updateModifierValue();
  
  // Função padrão para adicionar ataque
  function defaultConfirmHandler() {
    const attackName = document.getElementById('attack-name').value.trim();
    const weapon = document.getElementById('weapon-select').value;
    const damageDie = document.getElementById('damage-die').value;
    const modifierCode = document.getElementById('modifier').value;
    const modifier = getAbilityModifier(modifierCode);
    const damageType = document.getElementById('damage-type').value;
    const isMagic = document.getElementById('is-magic').checked;
    const attackBonus = parseInt(document.getElementById('attack-bonus').value, 10) || 0;
    
    const bonusString = attackBonus > 0 ? `+${attackBonus}` : '';
    
    const attackList = document.getElementById('attack-list');
    const item = document.createElement('div');
    item.className = 'attack-item';
    item.innerHTML = `
      <div class="attack-info">
        <strong>${attackName} (${weapon})</strong><br>
        ${damageDie} + ${modifier} ${bonusString} (${damageType}) ${isMagic ? '[Mágico]' : ''}
      </div>
      <div class="attack-buttons">
        <button class="edit-attack-btn" title="Editar ataque">✎</button>
        <button class="remove-attack-btn" title="Remover ataque">×</button>
      </div>
    `;
    
    // Remover ataque
    item.querySelector('.remove-attack-btn').addEventListener('click', () => item.remove());
    
    // Editar ataque
    item.querySelector('.edit-attack-btn').addEventListener('click', () => {
      document.getElementById('attack-name').value = attackName;
      document.getElementById('weapon-select').value = weapon;
      document.getElementById('damage-die').value = damageDie;
      document.getElementById('modifier').value = modifierCode;
      document.getElementById('damage-type').value = damageType;
      document.getElementById('is-magic').checked = isMagic;
      document.getElementById('attack-form').style.display = 'block';
      
      const confirmBtn = document.getElementById('confirm-attack');
      confirmBtn.textContent = 'Salvar Alterações';
      
      // Handler para salvar alterações
      const newConfirmHandler = () => {
        const updatedName = document.getElementById('attack-name').value.trim();
        const updatedWeapon = document.getElementById('weapon-select').value;
        const updatedDie = document.getElementById('damage-die').value;
        const updatedModCode = document.getElementById('modifier').value;
        const updatedMod = getAbilityModifier(updatedModCode);
        const updatedType = document.getElementById('damage-type').value;
        const updatedMagic = document.getElementById('is-magic').checked;
        
        item.querySelector('.attack-info').innerHTML = `
          <strong>${updatedName} (${updatedWeapon})</strong><br>
          ${updatedDie} + ${updatedMod} (${updatedType}) ${updatedMagic ? '[Mágico]' : ''}
        `;
        
        resetForm();
        confirmBtn.textContent = 'Adicionar';
        confirmBtn.removeEventListener('click', newConfirmHandler);
        confirmBtn.addEventListener('click', defaultConfirmHandler);
      };
      
      confirmBtn.removeEventListener('click', defaultConfirmHandler);
      confirmBtn.addEventListener('click', newConfirmHandler);
    });
    
    attackList.appendChild(item);
    resetForm();
  }
  
  // Registra o manipulador padrão no botão de confirmar ataque
  document.getElementById('confirm-attack').addEventListener('click', defaultConfirmHandler);
});

/************* 
Parte das magias
**************/  

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = (tab.id === tabId) ? 'block' : 'none';
  });
}

const modal = document.getElementById('spellModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const spellListEl = document.getElementById('spellList');

const classFilter = document.getElementById('classFilter');
const levelFilter = document.getElementById('levelFilter');

// Mock de magias (adicione mais conforme desejar)
const spells = [
  // 🧪 Truques (nível 0)
  { name: "Acid Splash", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Blade Ward", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Booming Blade", level: 0, classes: ["Mago", "Bruxo", "Artífice", "Feiticeiro"] },
  { name: "Chill Touch", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Control Flames", level: 0, classes: ["Feiticeiro", "Mago", "Druida", "Artífice"] },
  { name: "Create Bonfire", level: 0, classes: ["Druida", "Feiticeiro", "Mago", "Bruxo", "Artífice"] },
  { name: "Dancing Lights", level: 0, classes: ["Mago", "Bardo", "Feiticeiro", "Artífice"] },
  { name: "Druidcraft", level: 0, classes: ["Druida"] },
  { name: "Eldritch Blast", level: 0, classes: ["Bruxo"] },
  { name: "Encode Thoughts", level: 0, classes: ["Bruxo", "Mago"] },
  { name: "Fire Bolt", level: 0, classes: ["Mago", "Bruxo", "Feiticeiro", "Artífice"] },
  { name: "Friends", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Frostbite", level: 0, classes: ["Druida", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Green-Flame Blade", level: 0, classes: ["Mago", "Bruxo", "Feiticeiro", "Artífice"] },
  { name: "Guidance", level: 0, classes: ["Clérigo", "Druida", "Artífice"] },
  { name: "Gust", level: 0, classes: ["Druida", "Feiticeiro", "Mago"] },
  { name: "Hand of Radiance", level: 0, classes: ["Clérigo"] },
  { name: "Infestation", level: 0, classes: ["Bruxo", "Druida", "Feiticeiro", "Mago"] },
  { name: "Light", level: 0, classes: ["Clérigo", "Mago", "Artífice", "Bardo"] },
  { name: "Lightning Lure", level: 0, classes: ["Bruxo", "Mago", "Feiticeiro", "Artífice"] },
  { name: "Mage Hand", level: 0, classes: ["Mago", "Bruxo", "Bardo", "Artífice"] },
  { name: "Magic Stone", level: 0, classes: ["Druida", "Artífice", "Bruxo"] },
  { name: "Mending", level: 0, classes: ["Clérigo", "Mago", "Bardo", "Artífice", "Druida"] },
  { name: "Message", level: 0, classes: ["Mago", "Bardo", "Bruxo", "Artífice"] },
  { name: "Mind Sliver", level: 0, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Minor Illusion", level: 0, classes: ["Mago", "Bruxo", "Bardo"] },
  { name: "Mold Earth", level: 0, classes: ["Druida", "Feiticeiro", "Mago", "Artífice"] },
  { name: "On/Off", level: 0, classes: ["Artífice", "Mago"] },
  { name: "Poison Spray", level: 0, classes: ["Mago", "Bruxo", "Druida", "Feiticeiro"] },
  { name: "Prestidigitation", level: 0, classes: ["Mago", "Bruxo", "Bardo", "Feiticeiro"] },
  { name: "Primal Savagery", level: 0, classes: ["Druida"] },
  { name: "Produce Flame", level: 0, classes: ["Druida"] },
  { name: "Ray of Frost", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Resistance", level: 0, classes: ["Clérigo", "Druida", "Artífice"] },
  { name: "Sacred Flame", level: 0, classes: ["Clérigo"] },
  { name: "Sapping Sting", level: 0, classes: ["Bruxo", "Mago"] },
  { name: "Shape Water", level: 0, classes: ["Druida", "Feiticeiro", "Mago", "Artífice"] },
  { name: "Shillelagh", level: 0, classes: ["Druida"] },
  { name: "Shocking Grasp", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Spare the Dying", level: 0, classes: ["Clérigo", "Artífice"] },
  { name: "Sword Burst", level: 0, classes: ["Mago", "Bruxo", "Feiticeiro", "Artífice"] },
  { name: "Thaumaturgy", level: 0, classes: ["Clérigo"] },
  { name: "Thorn Whip", level: 0, classes: ["Druida", "Artífice"] },
  { name: "Thunderclap", level: 0, classes: ["Bardo", "Druida", "Feiticeiro", "Mago", "Bruxo"] },
  { name: "Toll the Dead", level: 0, classes: ["Clérigo", "Bruxo", "Mago"] },
  { name: "True Strike", level: 0, classes: ["Mago", "Bruxo"] },
  { name: "Vicious Mockery", level: 0, classes: ["Bardo"] },
  { name: "Virtue", level: 0, classes: ["Clérigo"] },
  { name: "Word of Radiance", level: 0, classes: ["Clérigo"] },
  
  // 🔥 Nível 1 
  { name: "Absorb Elements", level: 1, classes: ["Druida", "Ranger", "Feiticeiro", "Mago"] },
  { name: "Alarm", level: 1, classes: ["Artífice", "Mago", "Ranger"] },
  { name: "Animal Friendship", level: 1, classes: ["Bardo", "Druida", "Ranger"] },
  { name: "Armor of Agathys", level: 1, classes: ["Bruxo"] },
  { name: "Arms of Hadar", level: 1, classes: ["Bruxo"] },
  { name: "Bane", level: 1, classes: ["Bardo", "Clérigo"] },
  { name: "Bless", level: 1, classes: ["Clérigo", "Paladino"] },
  { name: "Burning Hands", level: 1, classes: ["Feiticeiro", "Mago"] },
  { name: "Catapult", level: 1, classes: ["Artífice", "Feiticeiro", "Mago"] },
  { name: "Cure Wounds", level: 1, classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Ranger", "Artífice"] },
  { name: "Detect Magic", level: 1, classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Ranger", "Mago", "Artífice"] },
  { name: "Disguise Self", level: 1, classes: ["Bardo", "Feiticeiro", "Mago", "Bruxo"] },
  { name: "Dissonant Whispers", level: 1, classes: ["Bardo"] },
  { name: "Entangle", level: 1, classes: ["Druida"] },
  { name: "Faerie Fire", level: 1, classes: ["Bardo", "Druida"] },
  { name: "Feather Fall", level: 1, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Guiding Bolt", level: 1, classes: ["Clérigo"] },
  { name: "Hellish Rebuke", level: 1, classes: ["Bruxo"] },
  { name: "Hunter's Mark", level: 1, classes: ["Ranger"] },
  { name: "Ice Knife", level: 1, classes: ["Druida"] },
  { name: "Mage Armor", level: 1, classes: ["Feiticeiro", "Mago"] },
  { name: "Magic Missile", level: 1, classes: ["Mago"] },
  { name: "Shield", level: 1, classes: ["Mago"] },
  { name: "Sleep", level: 1, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Thunderwave", level: 1, classes: ["Bardo", "Druida", "Feiticeiro", "Mago"] },
  { name: "Unseen Servant", level:1, classes:["Bardo","Bruxo","Mago"] },
  { name: "Witch Bolt", level:1, classes:["Feiticeiro","Bruxo","Mago"] },
  { name: "Wrathful Smite", level:1, classes:["Paladino"] },
  { name: "Zephyr Strike", level:1, classes:["Ranger"] },
  
  // 🔥 Nível 2 
  { name: "Aganazzar's Scorcher", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Aid", level: 2, classes: ["Clérigo", "Paladino"] },
  { name: "Air Bubble", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Alter Self", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Animal Messenger", level: 2, classes: ["Druida", "Ranger"] },
  { name: "Arcane Lock", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Augury", level: 2, classes: ["Clérigo", "Druida"] },
  { name: "Barkskin", level: 2, classes: ["Druida", "Patrulheiro"] },
  { name: "Beast Sense", level: 2, classes: ["Druida", "Patrulheiro"] },
  { name: "Blindness/Deafness", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Blur", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Branding Smite", level: 2, classes: ["Paladino"] },
  { name: "Calm Emotions", level: 2, classes: ["Bardo", "Clérigo", "Feiticeiro", "Mago"] },
  { name: "Cloud of Daggers", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Continual Flame", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Cordon of Arrows", level: 2, classes: ["Druida", "Patrulheiro"] },
  { name: "Crown of Madness", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Darkness", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Darkvision", level: 2, classes: ["Clérigo", "Feiticeiro", "Mago"] },
  { name: "Detect Thoughts", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Dragon's Breath", level: 2, classes: ["Feiticeiro", "Mago", "Patrulheiro"] },
  { name: "Dust Devil", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Earthbind", level: 2, classes: ["Druida", "Patrulheiro"] },
  { name: "Enhance Ability", level: 2, classes: ["Bardo", "Clérigo", "Druida", "Patrulheiro"] },
  { name: "Enlarge/Reduce", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Enthrall", level: 2, classes: ["Bardo"] },
  { name: "Find Steed", level: 2, classes: ["Paladino"] },
  { name: "Find Traps", level: 2, classes: ["Patrulheiro"] },
  { name: "Flame Blade", level: 2, classes: ["Druida"] },
  { name: "Flaming Sphere", level: 2, classes: ["Druida", "Feiticeiro", "Mago"] },
  { name: "Gust of Wind", level: 2, classes: ["Feiticeiro", "Mago", "Patrulheiro"] },
  { name: "Healing Spirit", level: 2, classes: ["Druida", "Patrulheiro"] },
  { name: "Heat Metal", level: 2, classes: ["Clérigo", "Druida"] },
  { name: "Hold Person", level: 2, classes: ["Bardo", "Clérigo", "Feiticeiro", "Mago", "Paladino"] },
  { name: "Invisibility", level: 2, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Knock", level: 2, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Lesser Restoration", level: 2, classes: ["Clérigo", "Druida", "Paladino"] },
  { name: "Levitate", level: 2, classes: ["Feiticeiro", "Mago", "Patrulheiro"] },
  { name: "Magic Weapon", level: 2, classes: ["Paladino", "Patrulheiro"] },
  { name: "Mirror Image", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Misty Step", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Moonbeam", level: 2, classes: ["Druida"] },
  { name: "Phantasmal Force", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Scorching Ray", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "See Invisibility", level: 2, classes: ["Clérigo", "Feiticeiro", "Mago"] },
  { name: "Shatter", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Silence", level: 2, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Spider Climb", level: 2, classes: ["Feiticeiro", "Mago"] },
  { name: "Spike Growth", level: 2, classes: ["Druida", "Patrulheiro"] },
  { name: "Spiritual Weapon", level: 2, classes: ["Clérigo"] },
  { name: "Suggestion", level: 2, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Web", level: 2, classes: ["Feiticeiro", "Mago", "Patrulheiro"] },
  { name: "Zone of Truth", level: 2, classes: ["Bardo", "Clérigo", "Paladino"] },
  
  // 🔥 Nível 3
  
  { name: "Animate Dead", level: 3, classes: ["Clérigo", "Bruxo", "Mago"] },
  { name: "Ashardalon's Stride", level: 3, classes: ["Feiticeiro", "Mago"] },
  { name: "Aura of Vitality", level: 3, classes: ["Paladino"] },
  { name: "Beacon of Hope", level: 3, classes: ["Clérigo"] },
  { name: "Bestow Curse", level: 3, classes: ["Clérigo", "Bruxo", "Mago"] },
  { name: "Blinding Smite", level: 3, classes: ["Paladino"] },
  { name: "Blink", level: 3, classes: ["Feiticeiro", "Mago"] },
  { name: "Call Lightning", level: 3, classes: ["Clérigo", "Druida"] },
  { name: "Catnap", level: 3, classes: ["Bardo", "Mago"] },
  { name: "Clairvoyance", level: 3, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Conjure Animals", level: 3, classes: ["Druida", "Patrulheiro"] },
  { name: "Conjure Barrage", level: 3, classes: ["Patrulheiro"] },
  { name: "Counterspell", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Create Food and Water", level: 3, classes: ["Clérigo"] },
  { name: "Crusader's Mantle", level: 3, classes: ["Paladino"] },
  { name: "Daylight", level: 3, classes: ["Clérigo", "Feiticeiro", "Mago"] },
  { name: "Dispel Magic", level: 3, classes: ["Bardo", "Clérigo", "Feiticeiro", "Mago"] },
  { name: "Elemental Weapon", level: 3, classes: ["Paladino", "Patrulheiro"] },
  { name: "Enemies Abound", level: 3, classes: ["Bardo", "Mago"] },
  { name: "Erupting Earth", level: 3, classes: ["Druida", "Mago"] },
  { name: "Fear", level: 3, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Feign Death", level: 3, classes: ["Bruxo", "Clérigo", "Mago"] },
  { name: "Fireball", level: 3, classes: ["Feiticeiro", "Mago"] },
  { name: "Flame Arrows", level: 3, classes: ["Patrulheiro"] },
  { name: "Fly", level: 3, classes: ["Feiticeiro", "Mago", "Patrulheiro"] },
  { name: "Gaseous Form", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Glyph of Warding", level: 3, classes: ["Clérigo", "Mago"] },
  { name: "Haste", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago", "Patrulheiro"] },
  { name: "Hunger Of Hadar", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Hypnotic Pattern", level: 3, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Leomund's Tiny Hut", level: 3, classes: ["Bardo", "Mago"] },
  { name: "Life Transference", level: 3, classes: ["Bruxo", "Clérigo"] },
  { name: "Lightning Bolt", level: 3, classes: ["Feiticeiro", "Mago"] },
  { name: "Magic Circle", level: 3, classes: ["Clérigo"] },
  { name: "Major Image", level: 3, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Mass Healing Word", level: 3, classes: ["Clérigo"] },
  { name: "Meld into Stone", level: 3, classes: ["Bardo", "Clérigo", "Druida"] },
  { name: "Melf's Minute Meteors", level: 3, classes: ["Feiticeiro", "Mago"] },
  { name: "Nondetection", level: 3, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Phantom Steed", level: 3, classes: ["Bardo", "Mago"] },
  { name: "Plant Growth", level: 3, classes: ["Druida"] },
  { name: "Protection from Energy", level: 3, classes: ["Clérigo", "Druida", "Paladino"] },
  { name: "Remove Curse", level: 3, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Revivify", level: 3, classes: ["Clérigo", "Paladino"] },
  { name: "Sending", level: 3, classes: ["Bardo", "Clérigo", "Feiticeiro", "Mago"] },
  { name: "Sleet Storm", level: 3, classes: ["Clérigo", "Druida", "Mago"] },
  { name: "Slow", level: 3, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Speak with Dead", level: 3, classes: ["Clérigo"] },
  { name: "Spirit Guardians", level: 3, classes: ["Clérigo"] },
  { name: "Stinking Cloud", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Summon Fey", level: 3, classes: ["Bruxo"] },
  { name: "Summon Lesser Demons", level: 3, classes: ["Bruxo"] },
  { name: "Summon Undead", level: 3, classes: ["Bruxo"] },
  { name: "Thunder Step", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Tidal Wave", level: 3, classes: ["Druida", "Mago"] },
  { name: "Tiny Servant", level: 3, classes: ["Mago"] },
  { name: "Tongues", level: 3, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Vampiric Touch", level: 3, classes: ["Bruxo", "Feiticeiro", "Mago"] },
  { name: "Wall of Water", level: 3, classes: ["Druida", "Mago"] },
  { name: "Water Breathing", level: 3, classes: ["Clérigo", "Druida", "Mago"] },
  { name: "Water Walk", level: 3, classes: ["Clérigo", "Druida", "Mago"] },
  { name: "Wind Wall", level: 3, classes: ["Druida", "Patrulheiro"] },
  
  // 🔥 Nível 4
  { name: "Arcane Eye", level: 4, classes: ["Mago", "Bruxo", "Artífice"] },
  { name: "Aura of Life", level: 4, classes: ["Clérigo", "Paladino"] },
  { name: "Aura of Purity", level: 4, classes: ["Clérigo", "Paladino"] },
  { name: "Banishment", level: 4, classes: ["Mago", "Bruxo", "Clérigo", "Artífice"] },
  { name: "Blight", level: 4, classes: ["Bruxo", "Druida"] },
  { name: "Charm Monster", level: 4, classes: ["Bardo", "Druida", "Feiticeiro"] },
  { name: "Compulsion", level: 4, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Confusion", level: 4, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Conjure Barlgura (UA)", level: 4, classes: ["Druida", "Feiticeiro", "Mago"] },
  { name: "Conjure Knowbot (UA)", level: 4, classes: ["Artífice"] },
  { name: "Conjure Minor Elementals", level: 4, classes: ["Druida", "Feiticeiro", "Mago"] },
  { name: "Conjure Shadow Demon (UA)", level: 4, classes: ["Bruxo"] },
  { name: "Conjure Woodland Beings", level: 4, classes: ["Druida", "Feiticeiro", "Mago"] },
  { name: "Control Water", level: 4, classes: ["Druida", "Mago"] },
  { name: "Death Ward", level: 4, classes: ["Clérigo", "Paladino"] },
  { name: "Dimension Door", level: 4, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Divination", level: 4, classes: ["Clérigo", "Mago"] },
  { name: "Dominate Beast", level: 4, classes: ["Druida", "Feiticeiro"] },
  { name: "Ego Whip (UA)", level: 4, classes: ["Bardo"] },
  { name: "Elemental Bane", level: 4, classes: ["Druida", "Mago"] },
  { name: "Evard's Black Tentacles", level: 4, classes: ["Mago"] },
  { name: "Fabricate", level: 4, classes: ["Artífice", "Mago"] },
  { name: "Find Greater Steed", level: 4, classes: ["Paladino"] },
  { name: "Fire Shield", level: 4, classes: ["Clérigo", "Mago"] },
  { name: "Freedom of Movement", level: 4, classes: ["Clérigo", "Paladino", "Bardo"] },
  { name: "Galder's Speedy Courier", level: 4, classes: ["Mago"] },
  { name: "Gate Seal", level: 4, classes: ["Clérigo"] },
  { name: "Giant Insect", level: 4, classes: ["Druida", "Mago"] },
  { name: "Grasping Vine", level: 4, classes: ["Druida"] },
  { name: "Gravity Sinkhole", level: 4, classes: ["Mago"] },
  { name: "Greater Invisibility", level: 4, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Guardian of Faith", level: 4, classes: ["Clérigo"] },
  { name: "Guardian of Nature", level: 4, classes: ["Druida"] },
  { name: "Hallucinatory Terrain", level: 4, classes: ["Bardo", "Mago"] },
  { name: "Ice Storm", level: 4, classes: ["Druida", "Mago"] },
  { name: "Leomund's Secret Chest", level: 4, classes: ["Mago"] },
  { name: "Locate Creature", level: 4, classes: ["Clérigo", "Mago"] },
  { name: "Mordenkainen's Faithful Hound", level: 4, classes: ["Mago"] },
  { name: "Mordenkainen's Private Sanctum", level: 4, classes: ["Mago"] },
  { name: "Otiluke's Resilient Sphere", level: 4, classes: ["Mago"] },
  { name: "Phantasmal Killer", level: 4, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Polymorph", level: 4, classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Raulothim's Psychic Lance", level: 4, classes: ["Bardo"] },
  { name: "Shadow Of Moil", level: 4, classes: ["Bruxo"] },
  { name: "Sickening Radiance", level: 4, classes: ["Mago"] },
  { name: "Spirit Of Death", level: 4, classes: ["Bruxo"] },
  { name: "Staggering Smite", level: 4, classes: ["Paladino"] },
  { name: "Stone Shape", level: 4, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Stoneskin", level: 4, classes: ["Clérigo", "Mago"] },
  { name: "Storm Sphere", level: 4, classes: ["Druida", "Mago"] },
  { name: "Summon Aberration", level: 4, classes: ["Bruxo"] },
  { name: "Summon Construct", level: 4, classes: ["Artífice"] },
  { name: "Summon Elemental", level: 4, classes: ["Druida", "Feiticeiro", "Mago"] },
  { name: "Summon Greater Demon", level: 4, classes: ["Bruxo"] },
  { name: "Synchronicity (UA)", level: 4, classes: ["Bardo"] },
  { name: "System Backdoor (UA)", level: 4, classes: ["Artífice", "Mago"] },
  { name: "Vitriolic Sphere", level: 4, classes: ["Mago"] },
  { name: "Wall of Fire", level: 4, classes: ["Mago"] },
  { name: "Watery Sphere", level: 4, classes: ["Mago"] },
  
  // 🔥 Nível 5
  { name: "Animate Objects", level: 5, classes: ["Mago", "Bruxo", "Feiticeiro", "Artífice"] },
  { name: "Antilife Shell", level: 5, classes: ["Clérigo", "Paladino"] },
  { name: "Awaken", level: 5, classes: ["Druida", "Bardo"] },
  { name: "Banishing Smite", level: 5, classes: ["Paladino"] },
  { name: "Bigby's Hand", level: 5, classes: ["Mago", "Feiticeiro"] },
  { name: "Circle of Power", level: 5, classes: ["Clérigo"] },
  { name: "Cloudkill", level: 5, classes: ["Druida", "Bruxo"] },
  { name: "Commune", level: 5, classes: ["Clérigo"] },
  { name: "Commune with City (UA)", level: 5, classes: ["Clérigo"] },
  { name: "Commune with Nature", level: 5, classes: ["Druida", "Ranger"] },
  { name: "Cone of Cold", level: 5, classes: ["Mago", "Feiticeiro"] },
  { name: "Conjure Elemental", level: 5, classes: ["Druida", "Feiticeiro"] },
  { name: "Conjure Volley", level: 5, classes: ["Patrulheiro", "Druida"] },
  { name: "Conjure Vrock (UA)", level: 5, classes: ["Feiticeiro", "Bruxo"] },
  { name: "Contact Other Plane", level: 5, classes: ["Bruxo", "Clérigo", "Mago"] },
  { name: "Contagion", level: 5, classes: ["Clérigo", "Druida"] },
  { name: "Control Winds", level: 5, classes: ["Druida"] },
  { name: "Create Spelljamming Helm", level: 5, classes: ["Artífice"] },
  { name: "Creation", level: 5, classes: ["Mago"] },
  { name: "Danse Macabre", level: 5, classes: ["Bruxo", "Necromante"] },
  { name: "Dawn", level: 5, classes: ["Paladino"] },
  { name: "Destructive Wave", level: 5, classes: ["Paladino"] },
  { name: "Dispel Evil and Good", level: 5, classes: ["Clérigo", "Paladino"] },
  { name: "Dominate Person", level: 5, classes: ["Feiticeiro", "Bruxo", "Mago"] },
  { name: "Dream", level: 5, classes: ["Bardo", "Mago", "Bruxo"] },
  { name: "Enervation", level: 5, classes: ["Bruxo"] },
  { name: "Far Step", level: 5, classes: ["Mago"] },
  { name: "Flame Strike", level: 5, classes: ["Clérigo", "Paladino"] },
  { name: "Geas", level: 5, classes: ["Bardo", "Mago", "Feiticeiro"] },
  { name: "Greater Restoration", level: 5, classes: ["Clérigo", "Druida", "Paladino"] },
  { name: "Hallow", level: 5, classes: ["Clérigo"] },
  { name: "Hold Monster", level: 5, classes: ["Mago", "Feiticeiro", "Bruxo"] },
  { name: "Holy Weapon", level: 5, classes: ["Paladino"] },
  { name: "Immolation", level: 5, classes: ["Mago"] },
  { name: "Infernal Calling", level: 5, classes: ["Bruxo"] },
  { name: "Insect Plague", level: 5, classes: ["Druida"] },
  { name: "Legend Lore", level: 5, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Maelstrom", level: 5, classes: ["Druida"] },
  { name: "Mass Cure Wounds", level: 5, classes: ["Clérigo"] },
  { name: "Mislead", level: 5, classes: ["Mago"] },
  { name: "Modify Memory", level: 5, classes: ["Bardo", "Mago", "Feiticeiro"] },
  { name: "Negative Energy Flood", level: 5, classes: ["Bruxo"] },
  { name: "Passwall", level: 5, classes: ["Mago"] },
  { name: "Planar Binding", level: 5, classes: ["Clérigo", "Mago", "Bruxo"] },
  { name: "Raise Dead", level: 5, classes: ["Clérigo"] },
  { name: "Rary's Telepathic Bond", level: 5, classes: ["Mago"] },
  { name: "Reincarnate", level: 5, classes: ["Druida"] },
  { name: "Scrying", level: 5, classes: ["Mago", "Clérigo", "Bruxo"] },
  { name: "Seeming", level: 5, classes: ["Bardo", "Mago"] },
  { name: "Shutdown (UA)", level: 5, classes: ["Mago"] },
  { name: "Skill Empowerment", level: 5, classes: ["Artífice"] },
  { name: "Steel Wind Strike", level: 5, classes: ["Bruxo", "Patrulheiro"] },
  { name: "Summon Celestial", level: 5, classes: ["Clérigo"] },
  { name: "Summon Draconic Spirit", level: 5, classes: ["Bruxo"] },
  { name: "Swift Quiver", level: 5, classes: ["Patrulheiro"] },
  { name: "Synaptic Static", level: 5, classes: ["Mago"] },
  { name: "Telekinesis", level: 5, classes: ["Mago"] },
  { name: "Teleportation Circle", level: 5, classes: ["Mago"] },
  { name: "Temporal Shunt", level: 5, classes: ["Mago"] },
  { name: "Transmute Rock", level: 5, classes: ["Mago", "Druida"] },
  { name: "Tree Stride", level: 5, classes: ["Druida"] },
  { name: "Wall of Force", level: 5, classes: ["Mago"] },
  { name: "Wall of Light", level: 5, classes: ["Mago"] },
  { name: "Wall of Stone", level: 5, classes: ["Mago"] },
  { name: "Wrath Of Nature", level: 5, classes: ["Druida"] },
  
  // 🔥 Nível 6
  { name: "Arcane Gate", level: 6, classes: ["Mago", "Bruxo", "Feiticeiro"] },
  { name: "Blade Barrier", level: 6, classes: ["Clérigo", "Druida"] },
  { name: "Bones of the Earth", level: 6, classes: ["Druida"] },
  { name: "Chain Lightning", level: 6, classes: ["Mago", "Feiticeiro"] },
  { name: "Circle of Death", level: 6, classes: ["Mago", "Bruxo"] },
  { name: "Conjure Fey", level: 6, classes: ["Druida", "Bruxo"] },
  { name: "Contingency", level: 6, classes: ["Mago"] },
  { name: "Create Homunculus", level: 6, classes: ["Artífice"] },
  { name: "Create Undead", level: 6, classes: ["Bruxo", "Clérigo"] },
  { name: "Disintegrate", level: 6, classes: ["Mago", "Feiticeiro"] },
  { name: "Drawmij's Instant Summons", level: 6, classes: ["Mago"] },
  { name: "Druid Grove", level: 6, classes: ["Druida"] },
  { name: "Eyebite", level: 6, classes: ["Mago", "Bruxo"] },
  { name: "Find the Path", level: 6, classes: ["Clérigo", "Mago", "Druida"] },
  { name: "Fizban's Platinum Shield", level: 6, classes: ["Clérigo"] },
  { name: "Fizban's Platinum Shield (UA)", level: 6, classes: ["Clérigo"] },
  { name: "Flesh to Stone", level: 6, classes: ["Mago", "Bruxo"] },
  { name: "Forbiddance", level: 6, classes: ["Clérigo"] },
  { name: "Globe of Invulnerability", level: 6, classes: ["Mago", "Clérigo"] },
  { name: "Gravity Fissure", level: 6, classes: ["Mago"] },
  { name: "Guards and Wards", level: 6, classes: ["Mago"] },
  { name: "Harm", level: 6, classes: ["Clérigo"] },
  { name: "Heal", level: 6, classes: ["Clérigo"] },
  { name: "Heroes' Feast", level: 6, classes: ["Clérigo"] },
  { name: "Investiture of Flame", level: 6, classes: ["Druida", "Mago"] },
  { name: "Investiture of Ice", level: 6, classes: ["Druida", "Mago"] },
  { name: "Investiture of Stone", level: 6, classes: ["Druida", "Mago"] },
  { name: "Investiture of Wind", level: 6, classes: ["Druida", "Mago"] },
  { name: "Magic Jar", level: 6, classes: ["Bruxo", "Mago"] },
  { name: "Mass Suggestion", level: 6, classes: ["Bardo", "Mago"] },
  { name: "Mental Prison", level: 6, classes: ["Mago"] },
  { name: "Move Earth", level: 6, classes: ["Mago", "Druida"] },
  { name: "Otherworldly Form (UA)", level: 6, classes: ["Mago", "Bruxo"] },
  { name: "Otiluke's Freezing Sphere", level: 6, classes: ["Mago"] },
  { name: "Otto's Irresistible Dance", level: 6, classes: ["Mago"] },
  { name: "Planar Ally", level: 6, classes: ["Clérigo"] },
  { name: "Primordial Ward", level: 6, classes: ["Clérigo"] },
  { name: "Programmed Illusion", level: 6, classes: ["Mago"] },
  { name: "Psychic Crush (UA)", level: 6, classes: ["Mago"] },
  { name: "Scatter", level: 6, classes: ["Mago"] },
  { name: "Soul Cage", level: 6, classes: ["Bruxo", "Clérigo", "Mago"] },
  { name: "Summon Fiend", level: 6, classes: ["Bruxo"] },
  { name: "Sunbeam", level: 6, classes: ["Druida", "Mago"] },
  { name: "Tasha's Otherworldly Guise", level: 6, classes: ["Mago"] },
  { name: "Tenser's Transformation", level: 6, classes: ["Mago"] },
  { name: "Transport via Plants", level: 6, classes: ["Druida"] },
  { name: "True Seeing", level: 6, classes: ["Clérigo", "Mago"] },
  { name: "Wall of Ice", level: 6, classes: ["Mago", "Druida"] },
  { name: "Wall of Thorns", level: 6, classes: ["Druida"] },
  { name: "Wind Walk", level: 6, classes: ["Druida"] },
  { name: "Word of Recall", level: 6, classes: ["Clérigo"] },
  
  // 🔥 Nível 7
  { name: "Conjure Celestial", level: 7, classes: ["Clérigo", "Paladino"] },
  { name: "Conjure Hezrou (UA)", level: 7, classes: ["Bruxo"] },
  { name: "Create Magen", level: 7, classes: ["Artífice"] },
  { name: "Crown of Stars", level: 7, classes: ["Mago", "Feiticeiro"] },
  { name: "Delayed Blast Fireball", level: 7, classes: ["Mago", "Feiticeiro"] },
  { name: "Divine Word", level: 7, classes: ["Clérigo"] },
  { name: "Draconic Transformation", level: 7, classes: ["Mago", "Bruxo", "Feiticeiro"] },
  { name: "Draconic Transformation (UA)", level: 7, classes: ["Mago", "Bruxo", "Feiticeiro"] },
  { name: "Dream of the Blue Veil", level: 7, classes: ["Bardo", "Mago", "Feiticeiro"] },
  { name: "Etherealness", level: 7, classes: ["Mago", "Bruxo", "Druida"] },
  { name: "Finger of Death", level: 7, classes: ["Mago", "Bruxo"] },
  { name: "Fire Storm", level: 7, classes: ["Druida", "Mago"] },
  { name: "Forcecage", level: 7, classes: ["Mago", "Bruxo"] },
  { name: "Mirage Arcane", level: 7, classes: ["Mago", "Feiticeiro"] },
  { name: "Mordenkainen's Magnificent Mansion", level: 7, classes: ["Mago"] },
  { name: "Mordenkainen's Sword", level: 7, classes: ["Mago"] },
  { name: "Plane Shift", level: 7, classes: ["Mago", "Bruxo", "Clérigo"] },
  { name: "Power Word: Pain", level: 7, classes: ["Mago", "Bruxo"] },
  { name: "Prismatic Spray", level: 7, classes: ["Mago", "Feiticeiro"] },
  { name: "Project Image", level: 7, classes: ["Mago"] },
  { name: "Regenerate", level: 7, classes: ["Clérigo", "Druida"] },
  { name: "Resurrection", level: 7, classes: ["Clérigo"] },
  { name: "Reverse Gravity", level: 7, classes: ["Mago", "Druida"] },
  { name: "Sequester", level: 7, classes: ["Mago", "Bruxo", "Clérigo"] },
  { name: "Simulacrum", level: 7, classes: ["Mago"] },
  { name: "Symbol", level: 7, classes: ["Clérigo", "Mago"] },
  { name: "Teleport", level: 7, classes: ["Mago", "Bruxo", "Feiticeiro"] },
  { name: "Temple of the Gods", level: 7, classes: ["Clérigo"] },
  { name: "Tether Essence", level: 7, classes: ["Bruxo"] },
  { name: "Whirlwind", level: 7, classes: ["Druida"] },
  
  // Nivel 8
  { name: "Abi-Dalzim's Horrid Wilting", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Animal Shapes", level: 8, classes: ["Druida"] },
  { name: "Antimagic Field", level: 8, classes: ["Mago", "Bruxo", "Clérigo"] },
  { name: "Antipathy/Sympathy", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Clone", level: 8, classes: ["Mago"] },
  { name: "Control Weather", level: 8, classes: ["Druida"] },
  { name: "Dark Star", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Demiplane", level: 8, classes: ["Mago"] },
  { name: "Dominate Monster", level: 8, classes: ["Mago", "Feiticeiro"] },
  { name: "Earthquake", level: 8, classes: ["Clérigo", "Druida"] },
  { name: "Feeblemind", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Glibness", level: 8, classes: ["Bardo"] },
  { name: "Holy Aura", level: 8, classes: ["Clérigo"] },
  { name: "Illusory Dragon", level: 8, classes: ["Mago"] },
  { name: "Incendiary Cloud", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Maddening Darkness", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Maze", level: 8, classes: ["Mago"] },
  { name: "Mighty Fortress", level: 8, classes: ["Mago", "Bruxo", "Clérigo"] },
  { name: "Mind Blank", level: 8, classes: ["Mago", "Clérigo"] },
  { name: "Power Word: Stun", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Reality Break", level: 8, classes: ["Mago", "Bruxo"] },
  { name: "Sunburst", level: 8, classes: ["Mago", "Clérigo"] },
  { name: "Telepathy", level: 8, classes: ["Mago", "Bruxo", "Clérigo"] },
  { name: "Tsunami", level: 8, classes: ["Druida"] },
  
  // Nivel 8
  { name: "Astral Projection", level: 9, classes: ["Mago", "Clérigo", "Bruxo"] },
  { name: "Blade of Disaster", level: 9, classes: ["Bruxo", "Mago"] },
  { name: "Foresight", level: 9, classes: ["Bardo", "Clérigo", "Mago"] },
  { name: "Gate", level: 9, classes: ["Mago", "Clérigo"] },
  { name: "Imprisonment", level: 9, classes: ["Mago", "Clérigo"] },
  { name: "Invulnerability", level: 9, classes: ["Mago", "Clérigo"] },
  { name: "Mass Heal", level: 9, classes: ["Clérigo"] },
  { name: "Mass Polymorph", level: 9, classes: ["Mago", "Bardo"] },
  { name: "Meteor Swarm", level: 9, classes: ["Mago", "Bruxo"] },
  { name: "Power Word: Heal", level: 9, classes: ["Clérigo"] },
  { name: "Power Word: Kill", level: 9, classes: ["Mago", "Bruxo"] },
  { name: "Prismatic Wall", level: 9, classes: ["Mago", "Clérigo"] },
  { name: "Psychic Scream", level: 9, classes: ["Mago"] },
  { name: "Ravenous Void", level: 9, classes: ["Mago", "Bruxo"] },
  { name: "Shapechange", level: 9, classes: ["Mago", "Druida"] },
  { name: "Storm of Vengeance", level: 9, classes: ["Clérigo", "Druida"] },
  { name: "Time Ravage", level: 9, classes: ["Mago"] },
  { name: "Time Stop", level: 9, classes: ["Mago"] },
  { name: "True Polymorph", level: 9, classes: ["Mago", "Bardo", "Bruxo"] },
  { name: "True Resurrection", level: 9, classes: ["Clérigo"] },
  { name: "Weird", level: 9, classes: ["Mago"] },
  { name: "Wish", level: 9, classes: ["Mago", "Bruxo"] },
];


// Abrir modal
openModalBtn.onclick = () => {
  modal.style.display = "flex";
  renderSpells();
};

const spellLevelFilter = document.getElementById('spellLevelFilter'); // o select fora do modal

document.addEventListener('DOMContentLoaded', () => {
  const spellLevelFilter = document.querySelector('#spellLevelFilter');
  if (spellLevelFilter) {
    spellLevelFilter.addEventListener('change', () => {
      const selectedLevel = spellLevelFilter.value;
      console.log('Filtro selecionado:', selectedLevel);
      
      const allSpellLevels = document.querySelectorAll('.spell-level');
      allSpellLevels.forEach(block => {
        const blockLevel = block.getAttribute('data-level');
        if (selectedLevel === 'all' || selectedLevel === blockLevel) {
          block.style.display = 'block';
          console.log(`Mostrando nível ${blockLevel}`);
        } else {
          block.style.display = 'none';
          console.log(`Escondendo nível ${blockLevel}`);
        }
      });
    });
  } else {
    console.log('spellLevelFilter não encontrado no DOM!');
  }
});


// Fechar modal
closeModalBtn.onclick = () => {
  modal.style.display = "none";
};

// Fechar modal clicando fora
window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// Atualizar lista ao mudar filtros
classFilter.onchange = renderSpells;
levelFilter.onchange = renderSpells;

// Função para renderizar magias com filtros
function renderSpells() {
  const selectedClass = classFilter.value;
  const selectedLevel = levelFilter.value;
  
  spellListEl.innerHTML = '';
  
  const filtered = spells.filter(spell => {
    const matchClass = (selectedClass === 'all' || spell.classes.includes(selectedClass));
    const matchLevel = (selectedLevel === 'all' || spell.level.toString() === selectedLevel);
    return matchClass && matchLevel;
  });
  
  if (filtered.length === 0) {
    spellListEl.innerHTML = '<p style="color: #888;">Nenhuma magia encontrada.</p>';
    return;
  }
  
  filtered.forEach(spell => {
    const spellDiv = document.createElement("div");
    spellDiv.className = "spell-item";
    spellDiv.innerText = `${spell.name} (Nível ${spell.level})`;
    
    spellDiv.addEventListener("click", () => {
      addSpellToGrimoire(spell);
      modal.style.display = "none";
    });
    
    spellListEl.appendChild(spellDiv);
  });
}

// Adiciona magia ao grimório
function addSpellToGrimoire(spell) {
  const levelContainer = document.querySelector(`.spell-level[data-level="${spell.level}"]`);
  if (!levelContainer) return;
  
  const spellCard = document.createElement("div");
  spellCard.className = "spell-card";
  spellCard.innerHTML = `
    <div class="spell-name">${spell.name}</div>
    <div class="spell-controls">
      <button class="remove-spell-btn" title="Remover magia">×</button>
    </div>
  `;
  
  spellCard.querySelector(".remove-spell-btn").addEventListener("click", () => {
    spellCard.remove();
  });
  levelContainer.appendChild(spellCard);
}

// Render inicial
renderSpells();

/* ---------
INVENTARIO
------------- */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('itemTypeModal');
  const select = document.getElementById('itemTypeSelect');
  const cancelBtn = document.getElementById('cancelModal');
  const confirmBtn = document.getElementById('confirmModal');

  let currentTable = null;  // Variável para armazenar a tabela de destino
  let currentButton = null;  // Variável para armazenar o botão clicado

  // Quando o botão "+" for clicado, abre o modal
  document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', (event) => {
      currentButton = button;
      select.value = "";  // Resetando o valor do select
      modal.style.display = 'flex';  // Mostrando o modal

      // Posição do modal para que ele apareça abaixo do botão
      const rect = currentButton.getBoundingClientRect();
      const modalWidth = modal.offsetWidth;
      const leftPosition = rect.left + window.scrollX + (rect.width / 2) - (modalWidth / 2);
      const topPosition = rect.bottom + window.scrollY + 10;

      modal.style.top = `${topPosition}px`;
      modal.style.left = `${leftPosition}px`;
    });
  });

  // Cancelar o modal
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';  // Fecha o modal
  });

  // Confirmar o tipo e adicionar o item na tabela
  confirmBtn.addEventListener('click', () => {
    const tipo = select.value;  // Tipo selecionado no modal
    if (!tipo) {
      alert('Por favor, selecione um tipo de item.');
      return;
    }

    const targetTable = document.getElementById('equipment-table');  // Tabela de Equipamentos

    // Remover a linha "empty" se ela existir
    const emptyRow = targetTable.querySelector('.inventory-row.empty');
    if (emptyRow) emptyRow.remove();

    // Criar a nova linha
    const newRow = document.createElement('div');
    newRow.classList.add('inventory-row');
    
    newRow.innerHTML = `
      <span class="col equipment">
        <input type="text" placeholder="Nome do item (${tipo})" style="width: 90%; padding: 4px; border-radius: 4px; border: 1px solid #444; background-color:#222; color:#eee;">
      </span>
      <span class="col weight">
        <input type="number" min="0" placeholder="Peso" style="width: 60px; padding: 4px; border-radius: 4px; border: 1px solid #444; background-color:#222; color:#eee; text-align:center;">
      </span>
      <span class="col qty">
        <input type="number" min="0" placeholder="Qtd" style="width: 40px; padding: 4px; border-radius: 4px; border: 1px solid #444; background-color:#222; color:#eee; text-align:center;">
      </span>
      <span class="col details">
        <input type="text" placeholder="Detalhes" style="width: 90%; padding: 4px; border-radius: 4px; border: 1px solid #444; background-color:#222; color:#eee;">
      </span>
      <span class="col type">${tipo}</span>  <!-- Coluna tipo que especifica a categoria -->
    `;

    // Inserir a nova linha no final da tabela
    targetTable.appendChild(newRow);

    modal.style.display = 'none';  // Fecha o modal após a confirmação
  });
});
