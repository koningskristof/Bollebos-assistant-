/**
 * Bollebos Conversational Flow — Kristof speaking
 *
 * Mimics the successful market approach:
 * 1. Hook: show a compliment card (just like on the market!)
 * 2. Casual intro as Kristof
 * 3. Tell the story, find connection points
 * 4. Ask for support (wenskaarten / boomcadeau)
 */

const chatMessages = document.getElementById('chatMessages');
const chatOptions = document.getElementById('chatOptions');
const revealSection = document.getElementById('revealSection');

// Track conversation state for personalized CTA
let userInterests = [];

// ===== Compliment cards — the real Bollebos ones! =====
const CARD_BASE_URL = "https://complimenten.bollebos.be/images/cards/";
const complimentCards = [
    { text: "jij bent super koeeeeewl", image: CARD_BASE_URL + "koewl.png" },
    { text: "jij bent zo bij-zonder", image: CARD_BASE_URL + "bijzonder.png" },
    { text: "zoals jij is er maar één - d", image: CARD_BASE_URL + "eend.png" },
    { text: "je bent olifant-astisch", image: CARD_BASE_URL + "olifant.png" },
    { text: "ik vind je gans sjiek!", image: CARD_BASE_URL + "gans.png" }
];

// ===== Conversation Tree =====

const conversationSteps = {

    // --- STEP 1: Compliment card as opener (just like on the market) ---
    // This step is special — it shows a visual card, not a text message
    start: {
        messages: [],
        onEnter: () => {
            showComplimentCard();
        },
        options: [],
        // After card is shown, auto-proceed to Kristof's intro
        delayedNext: { step: "after_compliment", delay: 1500 }
    },

    after_compliment: {
        messages: [
            "Dat was een complimentje van mij, Kristof 😄",
            "Op markten deel ik deze kaartjes uit aan voorbijgangers. Gewoon, om hun dag mooier te maken."
        ],
        options: [
            { text: "Haha leuk! 😄", next: "ken_je_bollebos" },
            { text: "Wat lief! 😊", next: "ken_je_bollebos" },
            { text: "Wie is Kristof? 🤔", next: "wie_is_kristof" }
        ]
    },

    wie_is_kristof: {
        messages: [
            "Ik ben Kristof, een bollebosser! 🌳",
            "Ik plant bomen, deel complimentjes, en probeer de wereld een beetje warmer te maken.",
            "Ken je Bollebos al?"
        ],
        options: [
            { text: "Nee, vertel!", next: "kristof_intro" },
            { text: "Ja!", next: "returning_visitor" },
            { text: "Klinkt bekend", next: "kristof_intro" }
        ]
    },

    ken_je_bollebos: {
        messages: [
            "Blij dat het je dag een beetje mooier maakt! 😊",
            "Ken je Bollebos al?"
        ],
        options: [
            { text: "Nee, wat is het?", next: "kristof_intro" },
            { text: "Ja!", next: "returning_visitor" },
            { text: "De naam klinkt bekend", next: "kristof_intro" }
        ]
    },

    // --- Kristof's intro ---
    kristof_intro: {
        messages: [
            "Ik heb Bollebos gestart vanuit een simpel idee: mensen samenbrengen rond natuur.",
            "We staan op markten, delen complimentjes aan voorbijgangers, planten bomen, en maken mooie kaarten.",
            "Eigenlijk proberen we gewoon de wereld een beetje warmer en groener te maken 💚",
            "Wat spreekt jou daarin aan?"
        ],
        options: [
            { text: "De bomen! 🌳", next: "interest_natuur" },
            { text: "Mooie kaarten klinkt leuk 💌", next: "interest_cadeau" },
            { text: "Het verhaal erachter", next: "het_verhaal" },
            { text: "Alles eigenlijk! 😄", next: "interest_benieuwd" }
        ]
    },

    // --- Interest branches ---
    interest_cadeau: {
        messages: [
            "Oh dan moet je dit horen! 😄",
            "Ik maak wenskaarten — maar niet zomaar kaarten. Elke kaart draagt een mooie boodschap, en met de opbrengst planten we bomen.",
            "En weet je wat ook kan? Je kunt iemand letterlijk een boom cadeau geven. Ja echt, een echte boom! 🌳",
            "Wat klinkt leuker?"
        ],
        onEnter: () => userInterests.push('cadeau'),
        options: [
            { text: "Een boom cadeau geven? Vertel!", next: "boomcadeau_detail" },
            { text: "De kaarten wil ik zien!", next: "wenskaarten_detail" },
            { text: "Maar hoe is dit allemaal begonnen?", next: "het_verhaal" }
        ]
    },

    interest_natuur: {
        messages: [
            "Een bomenliefhebber! Dan snap je mij 😄",
            "Ik ben begonnen met het planten van bomen, en daar is een heel project uit gegroeid.",
            "Elke boom die we planten is een stukje toekomst. En het mooie: iedereen kan meedoen.",
            "Wil je weten hoe?"
        ],
        onEnter: () => userInterests.push('natuur'),
        options: [
            { text: "Ja! Hoe kan ik meedoen?", next: "meedoen" },
            { text: "Vertel meer over het project", next: "het_verhaal" },
            { text: "Kan ik iemand een boom geven?", next: "boomcadeau_detail" }
        ]
    },

    interest_planeet: {
        messages: [
            "Dat vind ik mooi om te horen! 🌍",
            "Ik geloof echt dat kleine dingen groot verschil maken. Een boom planten, een kaart sturen met een mooie boodschap...",
            "Dat is wat ik elke dag probeer te doen met Bollebos.",
            "Hoe zou jij willen bijdragen?"
        ],
        onEnter: () => userInterests.push('planeet'),
        options: [
            { text: "Een boom planten via een cadeau 🌳", next: "boomcadeau_detail" },
            { text: "Een kaart sturen met impact 💌", next: "wenskaarten_detail" },
            { text: "Vertel me eerst meer over jouw verhaal", next: "het_verhaal" }
        ]
    },

    interest_benieuwd: {
        messages: [
            "Haha, alles! Dat hoor ik graag 😄",
            "Laat me je dan even meenemen in hoe dit allemaal begonnen is..."
        ],
        onEnter: () => userInterests.push('benieuwd'),
        options: [],
        autoNext: "het_verhaal"
    },

    // --- Core story ---
    explain_bollebos: {
        messages: [
            "Bollebos is eigenlijk mijn manier om iets terug te geven aan de natuur 🌳",
            "We planten bomen, maar het gaat om meer dan dat — het gaat om verbinding. Met de natuur, met elkaar.",
            "Via onze kaarten en boomcadeaus kan iedereen meedoen. Je geeft iemand een boom, en die groeit terwijl jullie band groeit 💚",
            "Wat vind je daarvan?"
        ],
        options: [
            { text: "Prachtig idee, Kristof!", next: "positive_reaction" },
            { text: "Hoe werkt zo'n boomcadeau?", next: "boomcadeau_detail" },
            { text: "Vertel over de kaarten", next: "wenskaarten_detail" }
        ]
    },

    het_verhaal: {
        messages: [
            "Oké, het verhaal 😊",
            "Het begon eigenlijk op markten. Ik deelde complimentenkaartjes uit aan voorbijgangers — gewoon, om hun dag mooier te maken.",
            "En weet je? Mensen begonnen te lachen, te praten, te vertellen. Van die kleine momenten groeide iets groots.",
            "Zo is Bollebos geboren: vanuit warmte, complimentjes, en een liefde voor bomen 🌳💚"
        ],
        options: [
            { text: "Wat een mooi verhaal! 💚", next: "positive_reaction" },
            { text: "Hoe kan ik je helpen?", next: "steun_opties" },
            { text: "Vertel over de producten", next: "steun_opties" }
        ]
    },

    returning_visitor: {
        messages: [
            "Oh leuk, je kent Bollebos al! 😊",
            "Fijn dat je weer even langskomt. Er zijn altijd nieuwe kaarten en boomcadeaus.",
            "Waar kan ik je mee helpen?"
        ],
        options: [
            { text: "Ik wil een boomcadeau geven", next: "boomcadeau_detail" },
            { text: "Laat de wenskaarten zien", next: "wenskaarten_detail" },
            { text: "Vertel me meer over het project", next: "het_verhaal" }
        ]
    },

    positive_reaction: {
        messages: [
            "Dankjewel! Dat doet me echt plezier 😊",
            "En weet je wat het mooiste is? Jij kunt er ook deel van uitmaken.",
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
            "De makkelijkste manier is via onze producten. Elke aankoop helpt me om meer bomen te planten.",
            "Ik laat je even zien wat er is:"
        ],
        options: [],
        autoNext: "steun_opties"
    },

    // --- Product details ---
    boomcadeau_detail: {
        messages: [
            "Dit is echt mijn favoriete ding om over te vertellen 🌳🎁",
            "Je geeft iemand letterlijk een boom. Die boom wordt geplant en groeit mee met jullie verhaal.",
            "Perfect voor een verjaardag, geboorte, huwelijk... of gewoon omdat het kan!",
            "Ik vind het elke keer weer bijzonder om zo'n boom te planten voor iemand.",
            "Wil je het zien?"
        ],
        onEnter: () => userInterests.push('boom'),
        options: [
            { text: "Ja, ik wil een boom geven! 🌳", next: "cta_boom" },
            { text: "En de wenskaarten dan?", next: "wenskaarten_detail" },
            { text: "Ik twijfel nog even", next: "twijfel" }
        ]
    },

    wenskaarten_detail: {
        messages: [
            "Onze wenskaarten, daar ben ik ook trots op! 💌",
            "Ze zijn gemaakt met liefde, elke kaart heeft een mooie boodschap. En met de opbrengst planten we bomen.",
            "Het is eigenlijk dezelfde energie als de complimentenkaartjes op de markt — iemand een glimlach bezorgen 😊",
            "Wil je ze zien?"
        ],
        onEnter: () => userInterests.push('kaarten'),
        options: [
            { text: "Ja, laat zien! 💌", next: "cta_kaarten" },
            { text: "En het boomcadeau?", next: "boomcadeau_detail" },
            { text: "Ik twijfel nog even", next: "twijfel" }
        ]
    },

    // --- Support options ---
    steun_opties: {
        messages: [
            "Er zijn twee manieren waarop je kunt helpen:"
        ],
        options: [
            { text: "💌 Wenskaarten bekijken", next: "cta_kaarten" },
            { text: "🌳 Een boom cadeau geven", next: "cta_boom" },
            { text: "Allebei! 😄", next: "cta_beide" }
        ]
    },

    // --- Hesitation handler ---
    twijfel: {
        messages: [
            "Helemaal oké, geen druk! 😊",
            "Weet je, op markten twijfelen mensen ook vaak even. Maar zodra ze de kaarten of boomcadeaus echt zien, worden ze enthousiast.",
            "Gewoon even kijken? Vrijblijvend, beloofd!"
        ],
        options: [
            { text: "Oké, laat maar zien dan 😄", next: "cta_beide" },
            { text: "Vertel me nog iets over Bollebos", next: "het_verhaal" }
        ]
    },

    // --- CTA endpoints ---
    cta_boom: {
        messages: [
            "Top! 🎉",
            "Hieronder vind je meer info over het boomcadeau. Een cadeau dat letterlijk groeit!",
            "Bedankt dat je Bollebos wilt steunen — dat betekent echt veel voor mij 💚🌳"
        ],
        onEnter: () => showRevealSection('boom'),
        options: [
            { text: "Ik wil ook de wenskaarten zien", next: "cta_kaarten_extra" }
        ],
        final: true
    },

    cta_kaarten: {
        messages: [
            "Super! 💌🎉",
            "Hieronder vind je onze wenskaarten. Elke kaart draagt een boodschap én steunt het planten van bomen.",
            "Bedankt — dit soort steun houdt Bollebos draaiende 💚"
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
            "Hieronder vind je allebei. Of je nu een boom geeft of een kaart stuurt — elk gebaar telt!",
            "Echt bedankt voor je interesse. Dit soort steun maakt het verschil 💚"
        ],
        onEnter: () => showRevealSection('beide'),
        options: [],
        final: true
    },

    cta_kaarten_extra: {
        messages: [
            "Natuurlijk! De wenskaarten staan er nu ook bij 💌"
        ],
        onEnter: () => highlightProduct('kaarten'),
        options: [],
        final: true
    },

    cta_boom_extra: {
        messages: [
            "Natuurlijk! Het boomcadeau staat er nu ook bij 🌳"
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

function showComplimentCard() {
    const card = complimentCards[Math.floor(Math.random() * complimentCards.length)];

    const wrapper = document.createElement('div');
    wrapper.className = 'message message-bot compliment-card-wrapper';
    wrapper.style.background = 'transparent';
    wrapper.style.padding = '0';
    wrapper.style.maxWidth = '90%';

    const img = document.createElement('img');
    img.className = 'compliment-card-img';
    img.src = card.image;
    img.alt = card.text;

    wrapper.appendChild(img);
    chatMessages.appendChild(wrapper);
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
        await delay(800 + step.messages[i].length * 15);
        removeTypingIndicator();
        addMessage(step.messages[i]);
        await delay(300);
    }

    // Handle delayed next (used for compliment card)
    if (step.delayedNext) {
        await delay(step.delayedNext.delay);
        playStep(step.delayedNext.step);
        return;
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
    addMessage(option.text, true);
    clearOptions();

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
setTimeout(() => {
    playStep('start');
}, 800);
