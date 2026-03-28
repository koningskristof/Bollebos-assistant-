/**
 * Bollebos Conversational Flow
 *
 * Mimics the successful market approach:
 * 1. Hook (compliment/warm opener)
 * 2. "Ken je Bollebos?" introduction
 * 3. Tell the story, find connection points
 * 4. Ask for support (wenskaarten / boomcadeau)
 */

const chatMessages = document.getElementById('chatMessages');
const chatOptions = document.getElementById('chatOptions');
const revealSection = document.getElementById('revealSection');

// Track conversation state for personalized CTA
let userInterests = [];
let userName = '';

// ===== Conversation Tree =====
// Each step has: messages (bot says), options (user can pick), and next step logic

const conversationSteps = {

    // --- STEP 1: Hook - warm opener like the compliment card ---
    start: {
        messages: [
            "Hey, welkom! 👋",
            "Wist je dat jij vandaag iemand blij kunt maken... én tegelijk de wereld een beetje groener? 🌱"
        ],
        options: [
            { text: "Vertel me meer!", next: "intro" },
            { text: "Hoe dan? 🤔", next: "intro" },
            { text: "Ik kijk gewoon even rond", next: "soft_intro" }
        ]
    },

    // --- STEP 2a: For curious visitors ---
    intro: {
        messages: [
            "Top! 😊",
            "Ik ben van Bollebos, een project dat mensen verbindt via de natuur.",
            "Maar eerst even over jou — wat brengt je hier vandaag?"
        ],
        options: [
            { text: "Ik zoek een origineel cadeau 🎁", next: "interest_cadeau" },
            { text: "Ik hou van natuur & bomen 🌳", next: "interest_natuur" },
            { text: "Ik wil iets goed doen voor de planeet 🌍", next: "interest_planeet" },
            { text: "Gewoon benieuwd!", next: "interest_benieuwd" }
        ]
    },

    // --- STEP 2b: Soft intro for browsers ---
    soft_intro: {
        messages: [
            "Geen probleem! Kijk gerust rond. 😊",
            "Maar mag ik je één ding vragen?",
            "Ken je Bollebos al?"
        ],
        options: [
            { text: "Nee, wat is het?", next: "explain_bollebos" },
            { text: "Ja, ik ken jullie!", next: "returning_visitor" },
            { text: "De naam klinkt bekend", next: "explain_bollebos" }
        ]
    },

    // --- Interest branches ---
    interest_cadeau: {
        messages: [
            "Ah, een origineel cadeau zoeker! Dat treft. 😄",
            "Bij Bollebos kun je letterlijk een boom cadeau geven aan iemand. Geen gadget dat in een la belandt, maar iets dat groeit en leeft!",
            "En we hebben ook prachtige wenskaarten die een glimlach op het gezicht toveren. 💌",
            "Spreekt dit je aan?"
        ],
        onEnter: () => userInterests.push('cadeau'),
        options: [
            { text: "Een boom cadeau geven? Vertel!", next: "boomcadeau_detail" },
            { text: "De wenskaarten klinken leuk!", next: "wenskaarten_detail" },
            { text: "Maar wat is het verhaal erachter?", next: "het_verhaal" }
        ]
    },

    interest_natuur: {
        messages: [
            "Een natuurliefhebber! 🌿 Dan zit je hier goed.",
            "Bollebos is gestart vanuit een simpel idee: samen bomen planten en mensen verbinden met de natuur.",
            "Elke boom die we planten is een stukje toekomst. En het mooie is: iedereen kan meedoen!",
            "Wat trekt je het meeste aan?"
        ],
        onEnter: () => userInterests.push('natuur'),
        options: [
            { text: "Hoe kan ik meedoen?", next: "meedoen" },
            { text: "Waar planten jullie bomen?", next: "het_verhaal" },
            { text: "Kan ik iemand anders betrekken?", next: "boomcadeau_detail" }
        ]
    },

    interest_planeet: {
        messages: [
            "Wat fijn dat je dat belangrijk vindt! 🌍",
            "Wij geloven dat kleine acties groot verschil maken. Elke boom telt, elke kaart die je stuurt draagt een boodschap.",
            "Bollebos maakt het makkelijk om iets concreets te doen — geen grote gebaren nodig, gewoon een mooi gebaar.",
            "Hoe wil jij bijdragen?"
        ],
        onEnter: () => userInterests.push('planeet'),
        options: [
            { text: "Een boom planten via een cadeau 🌳", next: "boomcadeau_detail" },
            { text: "Een kaart sturen met impact 💌", next: "wenskaarten_detail" },
            { text: "Vertel me eerst meer over het project", next: "het_verhaal" }
        ]
    },

    interest_benieuwd: {
        messages: [
            "Nieuwsgierigheid is het mooiste begin! 😊",
            "Laat me je even meenemen in ons verhaal..."
        ],
        onEnter: () => userInterests.push('benieuwd'),
        options: [],
        autoNext: "het_verhaal"
    },

    // --- Core story ---
    explain_bollebos: {
        messages: [
            "Bollebos is een project dat mensen samenbrengt rondom natuur. 🌳",
            "We planten bomen, maar het gaat om meer dan dat — het gaat om verbinding. Met de natuur, met elkaar, en met de toekomst.",
            "Via onze wenskaarten en boomcadeaus kan iedereen een steentje bijdragen. Letterlijk: je geeft iemand een boom, en die boom groeit terwijl jullie band groeit. 💚",
            "Wat vind je daarvan?"
        ],
        options: [
            { text: "Dat is een prachtig idee!", next: "positive_reaction" },
            { text: "Hoe werkt zo'n boomcadeau?", next: "boomcadeau_detail" },
            { text: "Vertel meer over de wenskaarten", next: "wenskaarten_detail" }
        ]
    },

    het_verhaal: {
        messages: [
            "Het begon met een simpele vraag: hoe maken we de wereld een beetje groener én een beetje leuker? 🌱",
            "We staan regelmatig op markten. Daar geven we complimentenkaartjes aan voorbijgangers — gewoon, om hun dag een beetje mooier te maken.",
            "En weet je? Van die kleine, warme momenten groeien grote dingen. Net als bomen. 🌳",
            "Zo is Bollebos ontstaan: vanuit warmte en verbinding."
        ],
        options: [
            { text: "Wat een mooi verhaal! 💚", next: "positive_reaction" },
            { text: "Hoe kan ik helpen?", next: "steun_opties" },
            { text: "Vertel over de producten", next: "steun_opties" }
        ]
    },

    returning_visitor: {
        messages: [
            "Wat leuk dat je ons kent! 🥰",
            "Fijn dat je weer even langskomt. We hebben altijd nieuwe kaarten en boomcadeaus.",
            "Waar kan ik je vandaag mee helpen?"
        ],
        options: [
            { text: "Ik wil een boomcadeau geven", next: "boomcadeau_detail" },
            { text: "Laat de wenskaarten zien", next: "wenskaarten_detail" },
            { text: "Ik wil meer weten over het project", next: "het_verhaal" }
        ]
    },

    positive_reaction: {
        messages: [
            "Dankjewel! Dat vinden wij ook. 😊",
            "En het mooiste: jij kunt er deel van uitmaken!",
            "Wil je weten hoe je Bollebos kunt steunen?"
        ],
        options: [
            { text: "Ja, graag!", next: "steun_opties" },
            { text: "Hoe kan ik iets geven als cadeau?", next: "steun_opties" }
        ]
    },

    meedoen: {
        messages: [
            "Super dat je wilt meedoen! 💪",
            "De makkelijkste manier om Bollebos te steunen is via onze producten. Elke aankoop helpt ons om meer bomen te planten.",
            "Je hebt twee opties:"
        ],
        options: [],
        autoNext: "steun_opties"
    },

    // --- Product details ---
    boomcadeau_detail: {
        messages: [
            "Een boomcadeau is echt iets bijzonders! 🌳🎁",
            "Je geeft iemand letterlijk een boom. Die boom wordt geplant en groeit mee met jullie verhaal.",
            "Perfect voor een verjaardag, geboorte, huwelijk, of gewoon... omdat het kan!",
            "Elke boom krijgt een plek en draagt bij aan een groener landschap.",
            "Wil je een boomcadeau bekijken?"
        ],
        onEnter: () => userInterests.push('boom'),
        options: [
            { text: "Ja, ik wil een boom geven! 🌳", next: "cta_boom" },
            { text: "En de wenskaarten dan?", next: "wenskaarten_detail" },
            { text: "Ik twijfel nog", next: "twijfel" }
        ]
    },

    wenskaarten_detail: {
        messages: [
            "Onze wenskaarten zijn niet zomaar kaarten! 💌",
            "Ze zijn gemaakt met liefde, bevatten een mooie boodschap, en met elke aankoop steun je het planten van bomen.",
            "Perfect om iemand een glimlach te bezorgen — net zoals wij doen op de markten met onze complimentenkaartjes! 😊",
            "Wil je de collectie bekijken?"
        ],
        onEnter: () => userInterests.push('kaarten'),
        options: [
            { text: "Ja, laat maar zien! 💌", next: "cta_kaarten" },
            { text: "En het boomcadeau?", next: "boomcadeau_detail" },
            { text: "Ik twijfel nog", next: "twijfel" }
        ]
    },

    // --- Support options ---
    steun_opties: {
        messages: [
            "Er zijn twee mooie manieren om Bollebos te steunen:"
        ],
        options: [
            { text: "💌 Wenskaarten bekijken", next: "cta_kaarten" },
            { text: "🌳 Een boom cadeau geven", next: "cta_boom" },
            { text: "Ik wil allebei zien!", next: "cta_beide" }
        ]
    },

    // --- Hesitation handler ---
    twijfel: {
        messages: [
            "Geen druk hoor! 😊",
            "Weet je wat? Heel veel mensen die op onze marktkraam langskomen twijfelen ook even. Maar zodra ze de kaarten of boomcadeaus zien, worden ze enthousiast.",
            "Misschien helpt het om gewoon even te kijken? Vrijblijvend!"
        ],
        options: [
            { text: "Oké, laat maar zien dan 😄", next: "cta_beide" },
            { text: "Vertel me nog iets over het project", next: "het_verhaal" }
        ]
    },

    // --- CTA endpoints ---
    cta_boom: {
        messages: [
            "Geweldig! 🎉",
            "Hieronder vind je meer info over het boomcadeau. Een cadeau dat letterlijk groeit!",
            "Bedankt dat je Bollebos wilt steunen — samen maken we de wereld groener! 💚🌳"
        ],
        onEnter: () => showRevealSection('boom'),
        options: [
            { text: "Ik wil ook de wenskaarten zien", next: "cta_kaarten_extra" }
        ],
        final: true
    },

    cta_kaarten: {
        messages: [
            "Top! 💌🎉",
            "Hieronder vind je onze wenskaarten. Elke kaart draagt een boodschap en steunt het planten van bomen.",
            "Bedankt dat je Bollebos wilt steunen — samen maken we de wereld groener! 💚"
        ],
        onEnter: () => showRevealSection('kaarten'),
        options: [
            { text: "Ik wil ook het boomcadeau zien", next: "cta_boom_extra" }
        ],
        final: true
    },

    cta_beide: {
        messages: [
            "Fantastisch! 🎉🌳💌",
            "Hieronder vind je beide opties. Of je nu een boom geeft of een kaart stuurt — elk gebaar telt!",
            "Bedankt voor je interesse in Bollebos. Samen maken we de wereld mooier! 💚"
        ],
        onEnter: () => showRevealSection('beide'),
        options: [],
        final: true
    },

    cta_kaarten_extra: {
        messages: [
            "Natuurlijk! De wenskaarten zijn nu ook zichtbaar hieronder. 💌"
        ],
        onEnter: () => highlightProduct('kaarten'),
        options: [],
        final: true
    },

    cta_boom_extra: {
        messages: [
            "Natuurlijk! Het boomcadeau is nu ook zichtbaar hieronder. 🌳"
        ],
        onEnter: () => highlightProduct('boom'),
        options: [],
        final: true
    }
};


// ===== Engine =====

function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `message ${isUser ? 'message-user' : 'message-bot'}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    scrollToBottom();
}

function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearOptions() {
    chatOptions.innerHTML = '';
}

function showOptions(options) {
    clearOptions();
    options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.text;
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.addEventListener('click', () => handleChoice(opt));
        chatOptions.appendChild(btn);
    });
}

async function playStep(stepName) {
    const step = conversationSteps[stepName];
    if (!step) return;

    // Run onEnter callback if exists
    if (step.onEnter) step.onEnter();

    // Show messages one by one with typing delay
    for (let i = 0; i < step.messages.length; i++) {
        addTypingIndicator();
        await delay(800 + step.messages[i].length * 15); // Longer messages = longer typing
        removeTypingIndicator();
        addMessage(step.messages[i]);
        await delay(300);
    }

    // Show options or auto-proceed
    if (step.autoNext) {
        await delay(600);
        playStep(step.autoNext);
    } else if (step.options.length > 0) {
        showOptions(step.options);
    }
}

function handleChoice(option) {
    // Show user's choice as a message
    addMessage(option.text, true);
    clearOptions();

    // Small delay before bot responds
    setTimeout(() => {
        playStep(option.next);
    }, 500);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Reveal section logic =====

function showRevealSection(type) {
    revealSection.style.display = 'block';
    const cardBoom = document.getElementById('cardBoomcadeau');
    const cardKaarten = document.getElementById('cardWenskaarten');

    if (type === 'boom') {
        cardBoom.style.display = 'block';
        cardBoom.classList.add('highlighted');
        cardKaarten.style.display = 'block';
    } else if (type === 'kaarten') {
        cardKaarten.style.display = 'block';
        cardKaarten.classList.add('highlighted');
        cardBoom.style.display = 'block';
    } else {
        cardBoom.style.display = 'block';
        cardKaarten.style.display = 'block';
    }

    // Smooth scroll to products after a moment
    setTimeout(() => {
        revealSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
}

function highlightProduct(type) {
    if (type === 'kaarten') {
        document.getElementById('cardWenskaarten').classList.add('highlighted');
    } else if (type === 'boom') {
        document.getElementById('cardBoomcadeau').classList.add('highlighted');
    }
    setTimeout(() => {
        revealSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
}

// ===== Start the conversation =====
// Small delay so the page loads first
setTimeout(() => {
    playStep('start');
}, 800);
