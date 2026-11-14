const form = document.querySelector('#solverForm');
const input = document.querySelector('#problemInput');
const resultSection = document.querySelector('#resultSection');
const resultTitle = document.querySelector('#resultTitle');
const resultSteps = document.querySelector('#resultSteps');
let currentPlan = null;

function makeStarterPlan(problem) {
  const lower = problem.toLowerCase();
  let title = 'Break the problem into smaller steps';
  let steps = [
    'Write down the exact outcome you want. Make it specific and realistic.',
    'List what you already have, what you know, and what is missing.',
    'Choose one small action you can safely take today.',
    'Check information with a reliable source or qualified person before making an important decision.',
    'Review what worked and decide on the next small step.'
  ];
  if (/job|work|earn|income|skill|career/.test(lower)) {
    title = 'Start with a practical skills and work plan';
    steps = [
      'Choose one skill that matches your interests and the tools you can access.',
      'Use a reputable free course to learn the basics, then practise with a small sample project.',
      'Create a simple portfolio showing your own work. Do not pay someone who promises guaranteed earnings.',
      'Look for beginner opportunities on reputable platforms and verify the employer before sharing information.',
      'Track applications and learning progress once a week.'
    ];
  } else if (/study|school|exam|homework|learn|education/.test(lower)) {
    title = 'Build a manageable learning plan';
    steps = [
      'Name the subject or topic and identify the exact part that feels difficult.',
      'Break it into small topics and study one at a time.',
      'Use a trusted textbook or learning resource, then explain the idea in your own words.',
      'Try a few practice questions and check the reasoning, not just the final answer.',
      'Review difficult points and ask a teacher or trusted person when needed.'
    ];
  } else if (/money|budget|debt|save|expense/.test(lower)) {
    title = 'Get a clearer picture of your money';
    steps = [
      'Write down regular income and essential expenses without sharing account details.',
      'Separate needs, flexible spending and upcoming obligations.',
      'Choose one small, realistic change to test this week.',
      'Be cautious of guaranteed-return claims, upfront fees and requests for passwords or verification codes.',
      'For debt, tax or investment decisions, check with a qualified local adviser.'
    ];
  }
  return { title, steps, problem, createdAt: new Date().toISOString() };
}

function showPlan(plan) {
  currentPlan = plan;
  resultTitle.textContent = plan.title;
  resultSteps.replaceChildren();
  plan.steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    resultSteps.appendChild(li);
  });
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const problem = input.value.trim();
  if (!problem) return;
  showPlan(makeStarterPlan(problem));
});

document.querySelectorAll('.category').forEach(button => {
  button.addEventListener('click', () => {
    input.value = `I need help with ${button.dataset.topic.toLowerCase()}. Please help me find a practical first step.`;
    input.focus();
    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelector('#closeResult').addEventListener('click', () => resultSection.hidden = true);
document.querySelector('#savePlan').addEventListener('click', () => {
  if (!currentPlan) return;
  const plans = JSON.parse(localStorage.getItem('worldwisePlans') || '[]');
  plans.unshift(currentPlan);
  localStorage.setItem('worldwisePlans', JSON.stringify(plans.slice(0, 20)));
  document.querySelector('#savePlan').textContent = 'Saved on this device ✓';
});

document.querySelector('#year').textContent = new Date().getFullYear();

let deferredPrompt;
const installBtn = document.querySelector('#installBtn');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
