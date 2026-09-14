'use strict';

const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// LocalStorage helper
const store = {
  get: (k, f) => {
    try {
      return localStorage.getItem(k) || f;
    } catch {
      return f;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  }
};

// Theme management
const media = matchMedia('(prefers-color-scheme: dark)');
const panel = $('#settingsPanel');
const settings = $('#settingsBtn');
const menu = $('#menuBtn');
const mobile = $('#mobileNav');
const motion = $('#motionToggle');
const pageContent = $('#pageContent');
const docsSidebar = $('#docsSidebar');
const closeSidebarBtn = $('#closeSidebar');
const sidebarNav = $('#sidebarNav');
const searchModal = $('#searchModal');
const searchInput = $('#searchInput');
const searchResults = $('#searchResults');
const searchBtn = $('#searchBtn');
const searchClose = $('#searchClose');

let theme = store.get('agents-dose-theme', 'dark');

const resolve = t => t === 'system' ? (media.matches ? 'dark' : 'dim') : t;

function applyTheme(value, persist = true) {
  theme = value;
  root.dataset.theme = resolve(value);
  $('.button-label').textContent = value === 'system' ? 'Auto' : root.dataset.theme === 'dark' ? 'Dark' : 'Dim';
  $$('[data-theme-option]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeOption === value)));
  $('meta[name="theme-color"]').content = root.dataset.theme === 'dark' ? '#090b09' : '#111510';
  if (persist) store.set('agents-dose-theme', value);
}

function applyFont(value, persist = true) {
  root.dataset.font = value;
  $$('[data-font-option]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fontOption === value)));
  if (persist) store.set('agents-dose-font', value);
}

function applyMotion(value, persist = true) {
  root.dataset.reduceMotion = String(value);
  motion.checked = value;
  if (persist) store.set('agents-dose-motion', String(value));
}

function closePanel(focus = false) {
  panel.hidden = true;
  settings.setAttribute('aria-expanded', 'false');
  if (focus) settings.focus();
}

function closeMenu() {
  mobile.hidden = true;
  menu.setAttribute('aria-expanded', 'false');
}

function closeSidebar() {
  docsSidebar.hidden = true;
}

// Apply stored settings
applyTheme(theme, false);
applyFont(store.get('agents-dose-font', '100'), false);
applyMotion(store.get('agents-dose-motion', 'false') === 'true', false);

// Year in footer
$('#year').textContent = new Date().getFullYear();

// Settings panel
settings.addEventListener('click', () => {
  const open = panel.hidden;
  panel.hidden = !open;
  settings.setAttribute('aria-expanded', String(open));
  if (open) $('#settingsClose').focus();
});

$('#settingsClose').addEventListener('click', () => closePanel(true));

// Theme options
$('#themeOptions').addEventListener('click', e => {
  const b = e.target.closest('[data-theme-option]');
  if (b) applyTheme(b.dataset.themeOption);
});

// Font options
$('#fontOptions').addEventListener('click', e => {
  const b = e.target.closest('[data-font-option]');
  if (b) applyFont(b.dataset.fontOption);
});

// Motion toggle
motion.addEventListener('change', () => applyMotion(motion.checked));

// Quick theme toggle
$('#themeQuick').addEventListener('click', () => applyTheme(resolve(theme) === 'dark' ? 'dim' : 'dark'));

// System preference change
media.addEventListener?.('change', () => {
  if (theme === 'system') applyTheme('system', false);
});

// Mobile menu
menu.addEventListener('click', () => {
  const open = mobile.hidden;
  mobile.hidden = !open;
  menu.setAttribute('aria-expanded', String(open));
});

$$('#mobileNav a').forEach(a => a.addEventListener('click', closeMenu));

// Sidebar close button
closeSidebarBtn.addEventListener('click', closeSidebar);

// Panel dismiss on click outside
document.addEventListener('click', e => {
  if (!panel.hidden && !panel.contains(e.target) && !settings.contains(e.target)) {
    closePanel();
  }
});

// Keyboard shortcuts and escape handling
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!panel.hidden) closePanel(true);
    if (!mobile.hidden) {
      closeMenu();
      menu.focus();
    }
    if (!searchModal.hidden) {
      closeSearch();
      searchBtn.focus();
    }
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (searchModal.hidden) openSearch();
    else closeSearch();
  }
});

// Scroll effect on header
addEventListener('scroll', () => $('.site-header').classList.toggle('scrolled', scrollY > 12), { passive: true });

// Page data structure
const pageData = {
  home: { title: 'AGENTS SDK DOSE', template: 'home' },
  docs: { title: 'Documentation', template: 'docsList' },
  quickstart: { title: 'Quick Start', template: 'docDetail', category: 'Getting Started' },
  agents: { title: 'Agent Fundamentals', template: 'docDetail', category: 'Core Concepts' },
  tools: { title: 'Tools and Integrations', template: 'docDetail', category: 'Core Concepts' },
  guides: { title: 'Guides', template: 'guidesList' },
  chatAgent: { title: 'Build a Chat Agent', template: 'guideDetail' },
  toolIntegration: { title: 'Add Tools to an Agent', template: 'guideDetail' },
  streaming: { title: 'Stream Responses', template: 'guideDetail' },
  api: { title: 'API Reference', template: 'apiReference' },
  sdk: { title: 'SDKs', template: 'sdkList' },
  typescript: { title: 'TypeScript SDK', template: 'sdkDetail' },
  python: { title: 'Python SDK', template: 'sdkDetail' },
  examples: { title: 'Examples', template: 'examplesList' }
};

// Sidebar structure
const docStructure = [
  {
    label: 'Getting Started',
    items: [
      { id: 'quickstart', label: 'Quick Start' },
      { id: 'agents', label: 'Agent Fundamentals' }
    ]
  },
  {
    label: 'Core Concepts',
    items: [
      { id: 'tools', label: 'Tools & Integrations' }
    ]
  },
  {
    label: 'Advanced',
    items: []
  }
];

// Search database
const searchDatabase = [
  { title: 'Quick Start', section: 'Getting Started', id: 'quickstart', keywords: ['start', 'setup', 'install', 'begin', 'new'] },
  { title: 'Agent Fundamentals', section: 'Agents', id: 'agents', keywords: ['agent', 'create', 'define', 'build', 'design'] },
  { title: 'Tools & Integrations', section: 'Tools', id: 'tools', keywords: ['tool', 'integration', 'connect', 'extend', 'plugin'] },
  { title: 'Build a Chat Agent', section: 'Guides', id: 'chatAgent', keywords: ['chat', 'conversation', 'example', 'build', 'tutorial'] },
  { title: 'Add Tools to an Agent', section: 'Guides', id: 'toolIntegration', keywords: ['tool', 'add', 'extend', 'integrate', 'example'] },
  { title: 'Stream Responses', section: 'Guides', id: 'streaming', keywords: ['stream', 'real-time', 'response', 'async'] },
  { title: 'API Reference', section: 'API', id: 'api', keywords: ['api', 'reference', 'endpoint', 'request', 'response'] },
  { title: 'TypeScript SDK', section: 'SDKs', id: 'typescript', keywords: ['typescript', 'sdk', 'javascript', 'ts', 'npm'] },
  { title: 'Python SDK', section: 'SDKs', id: 'python', keywords: ['python', 'sdk', 'pip', 'async'] },
  { title: 'Examples', section: 'Examples', id: 'examples', keywords: ['example', 'demo', 'code', 'sample', 'template'] }
];

// URL slug to page ID mapping
const slugToId = {
  'chat-agent': 'chatAgent',
  'tool-integration': 'toolIntegration',
  'streaming': 'streaming'
};

// Convert URL path to page ID
function idFromPath(pathname) {
  const path = pathname.replace(/^\/|\/$/g, '');
  if (!path) return 'home';
  if (path === 'docs') return 'docs';
  if (path.startsWith('docs/')) {
    const slug = path.replace('docs/', '');
    return pageData[slug] ? slug : 'docs';
  }
  if (path === 'guides') return 'guides';
  if (path.startsWith('guides/')) {
    const slug = path.replace('guides/', '');
    const pageId = slugToId[slug];
    return pageId && pageData[pageId] ? pageId : 'guides';
  }
  if (path in pageData) return path;
  if (path in slugToId) return slugToId[path];
  return 'home';
}

// Page render functions
function renderHomePage() {
  return `<section class="hero-section" aria-labelledby="pageTitle"><div class="hero-copy reveal"><div class="eyebrow"><span class="live-dot"></span>Production workspace · v2.0</div><h1 id="pageTitle">Build agents.<br><span>Ship with clarity.</span></h1><p class="lede">พื้นที่ทำงานสำหรับออกแบบ ทดสอบ และส่งมอบ AI agents ด้วยโครงสร้างที่ชัดเจน เร็ว และพร้อมขยายจากต้นแบบสู่ระบบจริง</p><div class="hero-actions"><a class="button primary" href="/docs">Explore documentation <span aria-hidden="true">↗</span></a><a class="button ghost" href="#workflow">View workflow <span aria-hidden="true">↓</span></a></div><ul class="signal-row" aria-label="จุดเด่น"><li><strong>01</strong><span>Desktop clarity</span></li><li><strong>02</strong><span>Accessible design</span></li><li><strong>03</strong><span>Zero dependencies</span></li></ul></div><div class="console-wrap reveal delay-1"><div class="console-card" id="consoleCard"><div class="console-head"><div class="window-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>agent.config</span><span class="status-chip"><i></i>Ready</span></div><div class="console-body" aria-label="ตัวอย่างการตั้งค่า Agent"><div><span>01</span><code><b>agent</b> <em>"dose-core"</em> {</code></div><div><span>02</span><code>&nbsp;&nbsp;model: <em>"reasoning"</em>,</code></div><div class="active"><span>03</span><code>&nbsp;&nbsp;tools: <mark>["search", "code"]</mark>,</code></div><div><span>04</span><code>&nbsp;&nbsp;guardrails: <b>true</b>,</code></div><div><span>05</span><code>&nbsp;&nbsp;deploy: <em>"production"</em></code></div><div><span>06</span><code>}</code></div></div><div class="console-foot"><span><i></i>Runtime healthy</span><span>42 ms</span></div></div><div class="float-card quality" aria-hidden="true"><b>✓</b><div><small>Quality gate</small><strong>Passed</strong></div></div><div class="float-card success" aria-hidden="true"><small>Success rate</small><strong>99.9%</strong></div></div></section><section class="section" id="capabilities" aria-labelledby="capabilitiesTitle"><div class="section-heading reveal"><span class="section-index">01 / Capabilities</span><h2 id="capabilitiesTitle">ทุกอย่างที่ Agent ต้องใช้<br><span>อยู่ในเส้นทางเดียวกัน</span></h2></div><div class="feature-grid"><article class="feature-card reveal"><span class="feature-icon">⌁</span><small>01</small><h3>Design</h3><p>กำหนดบทบาท เครื่องมือ และข้อจำกัดด้วยโครงสร้างที่อ่านง่ายและตรวจสอบได้</p><a href="/docs">Open blueprint <span>→</span></a></article><article class="feature-card reveal delay-1"><span class="feature-icon">◇</span><small>02</small><h3>Evaluate</h3><p>วัดคุณภาพ ความเร็ว และความน่าเชื่อถือก่อนนำ workflow ไปใช้งานจริง</p><a href="/guides">See the guides <span>→</span></a></article><article class="feature-card reveal delay-2"><span class="feature-icon">↗</span><small>03</small><h3>Deploy</h3><p>ส่งมอบเวอร์ชันที่ผ่านเกณฑ์ พร้อมทรัพยากรและแนวทางต่อยอดระบบหลังบ้าน</p><a href="/api">Deployment kit <span>→</span></a></article></div></section><section class="section workflow-section" id="workflow" aria-labelledby="workflowTitle"><div class="workflow-copy reveal"><span class="section-index">02 / Workflow</span><h2 id="workflowTitle">จากไอเดียสู่ระบบจริง<br><span>โดยไม่หลุดบริบท</span></h2><p>วงจรทำงานแบบต่อเนื่องช่วยให้ทุกการเปลี่ยนแปลงย้อนตรวจได้ ทีมเห็นสถานะเดียวกัน และนำผลประเมินกลับมาปรับ Agent ได้ทันที</p></div><ol class="workflow-list reveal delay-1"><li><span>01</span><div><h3>Define</h3><p>วางเป้าหมายและขอบเขต</p></div><i>→</i></li><li><span>02</span><div><h3>Compose</h3><p>เชื่อมโมเดลและเครื่องมือ</p></div><i>→</i></li><li><span>03</span><div><h3>Evaluate</h3><p>ทดสอบกับเกณฑ์คุณภาพ</p></div><i>→</i></li><li><span>04</span><div><h3>Ship</h3><p>ส่งเวอร์ชันพร้อมใช้งาน</p></div><i>✓</i></li></ol></section><section class="section" id="resources" aria-labelledby="resourcesTitle"><div class="resource-panel reveal"><div><span class="section-index">03 / Resources</span><h2 id="resourcesTitle">Resource pack<br><span>พร้อมต่อยอด</span></h2><p>แยก HTML, CSS, JavaScript, SVG และ web manifest เพื่อให้แก้ไขง่าย โหลดเร็ว และชัดบนจอคอมพิวเตอร์ทุกความหนาแน่นพิกเซล</p></div><div class="resource-list"><div><span>UI system</span><strong>Responsive tokens</strong></div><div><span>Accessibility</span><strong>Keyboard + reduced motion</strong></div><div><span>Progressive web</span><strong>Install manifest</strong></div><div><span>Performance</span><strong>Zero runtime dependencies</strong></div></div></div></section>`;
}

function renderSidebar(currentId = '') {
  sidebarNav.innerHTML = '';
  docStructure.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'sidebar-section';
    sectionEl.innerHTML = `<div class="sidebar-section-label">${section.label}</div>`;
    section.items.forEach(item => {
      const link = document.createElement('a');
      link.href = `/${item.id === 'quickstart' ? 'docs/' + item.id : item.id}`;
      link.className = currentId === item.id ? 'active' : '';
      link.textContent = item.label;
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(item.id);
      });
      sectionEl.appendChild(link);
    });
    sidebarNav.appendChild(sectionEl);
  });
}

function renderDocsList() {
  return `<div class="docs-page"><div class="docs-header"><h1 class="docs-page-title">Documentation</h1><p class="docs-page-meta">Comprehensive guides and API reference for building production-ready agents</p></div><div class="docs-content"><h2>Getting Started</h2><p>Learn the fundamentals and get up and running with AGENTS SDK DOSE.</p><div class="guide-grid"><a href="/docs/quickstart" class="guide-card"><div class="guide-icon">⚡</div><div class="guide-title">Quick Start</div><div class="guide-desc">Set up your first agent in minutes</div></a><a href="/docs/agents" class="guide-card"><div class="guide-icon">🔧</div><div class="guide-title">Agent Fundamentals</div><div class="guide-desc">Understand core concepts and architecture</div></a></div><h2>Core Concepts</h2><p>Dive deeper into the building blocks of agent systems.</p><div class="guide-grid"><a href="/docs/tools" class="guide-card"><div class="guide-icon">🛠️</div><div class="guide-title">Tools & Integrations</div><div class="guide-desc">Extend agents with external tools and APIs</div></a></div></div></div>`;
}

function renderDocDetail(id) {
  const content = {
    quickstart: `<div class="docs-page"><div class="breadcrumb"><a href="/docs">Docs</a><span class="breadcrumb-separator">/</span><span>Quick Start</span></div><div class="docs-header"><h1 class="docs-page-title">Quick Start</h1><p class="docs-page-meta">Get up and running with AGENTS SDK DOSE in 5 minutes</p></div><div class="docs-content"><h2>Installation</h2><p>Install the SDK using your preferred package manager:</p><div class="code-example"><div class="code-header"><span class="code-label">Package Installation</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>npm install @agents-sdk/dose
# or
yarn add @agents-sdk/dose
# or
pip install agents-sdk-dose</code></div></div><h2>Create Your First Agent</h2><p>Initialize and configure a basic agent:</p><div class="code-example"><div class="code-header"><span class="code-label">agent.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>import { Agent } from '@agents-sdk/dose';

const agent = new Agent({
  model: 'claude-3-5-sonnet',
  name: 'Assistant',
  instructions: 'You are a helpful assistant',
  tools: []
});

const response = await agent.run('Hello!');
console.log(response);</code></div></div><h2>Add Your First Tool</h2><p>Extend your agent with a simple tool:</p><div class="code-example"><div class="code-header"><span class="code-label">agent.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>agent.addTool({
  name: 'current_time',
  description: 'Get the current time',
  parameters: {
    type: 'object',
    properties: {}
  },
  execute: async () => new Date().toISOString()
});

const response = await agent.run('What time is it?');
console.log(response);</code></div></div><h2>Evaluate Performance</h2><p>Set up quality gates and evaluation metrics:</p><div class="code-example"><div class="code-header"><span class="code-label">evaluate.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const evaluator = new Evaluator();

const results = await evaluator.run([
  {
    input: 'What time is it?',
    expectedOutput: 'should contain time'
  }
]);

console.log(results.passRate); // View pass rate</code></div></div><h2>Deploy</h2><p>Deploy your agent to production:</p><ul><li>Prepare your evaluation suite</li><li>Set up production environment</li><li>Deploy using the CLI or API</li><li>Monitor performance and metrics</li></ul><h2>Next Steps</h2><ul><li><a href="/docs/agents" style="color:var(--olive)">Learn Agent Fundamentals</a></li><li><a href="/docs/tools" style="color:var(--olive)">Explore Tools & Integrations</a></li><li><a href="/guides" style="color:var(--olive)">Check Out Guides</a></li></ul></div></div>`,
    agents: `<div class="docs-page"><div class="breadcrumb"><a href="/docs">Docs</a><span class="breadcrumb-separator">/</span><span>Agent Fundamentals</span></div><div class="docs-header"><h1 class="docs-page-title">Agent Fundamentals</h1><p class="docs-page-meta">Core concepts and architecture of AGENTS SDK DOSE</p></div><div class="docs-content"><h2>What is an Agent?</h2><p>An agent is an AI system that can perceive its environment, make decisions, and take actions to achieve goals. In AGENTS SDK DOSE, agents are composed of:</p><ul><li><strong>Model:</strong> The language model that powers decision-making</li><li><strong>Instructions:</strong> System prompts and behavioral guidelines</li><li><strong>Tools:</strong> External functions and integrations</li><li><strong>Memory:</strong> Context and state management</li><li><strong>Guardrails:</strong> Safety constraints and validation</li></ul><h2>Agent Architecture</h2><p>Agents follow a perception-decision-action cycle:</p><ol><li>Receive input and context</li><li>Process through the language model</li><li>Select tools and actions</li><li>Execute and observe results</li><li>Return response or iterate</li></ol><h2>Creating an Agent</h2><div class="code-example"><div class="code-header"><span class="code-label">TypeScript</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const agent = new Agent({
  model: 'claude-3-5-sonnet',
  name: 'Research Assistant',
  instructions: \`You are a research assistant.
Help users find and synthesize information.\`,
  tools: [
    webSearchTool,
    documentAnalyzerTool
  ],
  guardrails: {
    maxTokens: 4000,
    enableSafetyFilter: true
  }
});</code></div></div><h2>Instructions and Behavior</h2><p>Instructions define how your agent behaves. Use clear, specific language:</p><ul><li>Define the agent's role and purpose</li><li>Specify communication style</li><li>Outline decision-making priorities</li><li>Set boundaries and constraints</li></ul><h2>Tool Integration</h2><p>Tools extend agent capabilities. Each tool should have:</p><ul><li>Clear name and description</li><li>Well-defined parameters</li><li>Reliable execution logic</li><li>Error handling</li></ul><h2>Sessions and State</h2><p>Agents maintain session state for multi-turn conversations:</p><div class="code-example"><div class="code-header"><span class="code-label">Session Management</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const session = await agent.createSession({
  userId: 'user-123',
  context: { topic: 'research' }
});

await session.message('What is quantum computing?');
await session.message('How does entanglement work?');</code></div></div><h2>Error Handling</h2><p>Implement robust error handling in your agents:</p><ul><li>Validate tool parameters before execution</li><li>Catch and handle tool execution errors</li><li>Provide meaningful error messages to users</li><li>Implement retry logic for transient failures</li></ul><h2>Best Practices</h2><ul><li><strong>Clear Instructions:</strong> Write specific and unambiguous instructions</li><li><strong>Tool Safety:</strong> Always validate user inputs before passing to tools</li><li><strong>Error Recovery:</strong> Design agents to recover from failures gracefully</li><li><strong>Testing:</strong> Thoroughly test agents before deployment</li><li><strong>Monitoring:</strong> Track agent performance and user interactions</li></ul><h2>Next Steps</h2><ul><li><a href="/docs/tools" style="color:var(--olive)">Explore Tools & Integrations</a></li><li><a href="/guides/chat-agent" style="color:var(--olive)">Build a Chat Agent</a></li><li><a href="/api" style="color:var(--olive)">View API Reference</a></li></ul></div></div>`,
    tools: `<div class="docs-page"><div class="breadcrumb"><a href="/docs">Docs</a><span class="breadcrumb-separator">/</span><span>Tools & Integrations</span></div><div class="docs-header"><h1 class="docs-page-title">Tools & Integrations</h1><p class="docs-page-meta">Extend your agents with powerful tools and external APIs</p></div><div class="docs-content"><h2>What are Tools?</h2><p>Tools are functions that agents can call to extend their capabilities and interact with external systems. Each tool must define its interface clearly so the agent knows when and how to use it.</p><h2>Tool Structure</h2><div class="code-example"><div class="code-header"><span class="code-label">TypeScript</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const myTool = {
  name: 'search_web',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query'
      }
    },
    required: ['query']
  },
  execute: async (params) => {
    // Implementation
    return results;
  }
};</code></div></div><h2>Built-in Tools</h2><p>AGENTS SDK DOSE includes several built-in tools:</p><ul><li><strong>Web Search:</strong> Search the internet for information</li><li><strong>Code Execution:</strong> Run and test code snippets</li><li><strong>File Operations:</strong> Read and write files</li><li><strong>HTTP Requests:</strong> Make API calls</li><li><strong>Data Processing:</strong> Transform and analyze data</li></ul><h2>Custom Tools</h2><p>Create custom tools tailored to your specific needs:</p><div class="code-example"><div class="code-header"><span class="code-label">Custom Calculator Tool</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>agent.addTool({
  name: 'calculate',
  description: 'Perform arithmetic operations',
  parameters: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'Mathematical operation'
      },
      a: { type: 'number', description: 'First operand' },
      b: { type: 'number', description: 'Second operand' }
    },
    required: ['operation', 'a', 'b']
  },
  execute: async (params) => {
    const ops = {
      add: (x, y) => x + y,
      subtract: (x, y) => x - y,
      multiply: (x, y) => x * y,
      divide: (x, y) => y === 0 ? null : x / y
    };
    const result = ops[params.operation]?.(params.a, params.b);
    return result !== null
      ? { result, success: true }
      : { error: 'Division by zero', success: false };
  }
});</code></div></div><h2>Tool Best Practices</h2><ul><li>Clear naming and descriptions for discoverability</li><li>Well-defined parameter schemas for proper usage</li><li>Comprehensive error handling</li><li>Input validation and sanitization</li><li>Rate limiting and throttling where needed</li><li>Detailed logging for debugging</li></ul><h2>API Integrations</h2><p>Connect your agents to popular APIs:</p><ul><li>OpenAI, Anthropic, and other LLM providers</li><li>Web APIs (Twitter, GitHub, etc.)</li><li>Database connectors</li><li>Messaging platforms</li><li>Cloud services</li></ul><h2>Error Handling in Tools</h2><div class="code-example"><div class="code-header"><span class="code-label">Robust Tool Implementation</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>execute: async (params) => {
  try {
    // Validate input
    if (!params.query) {
      throw new Error('Query is required');
    }

    // Execute with timeout
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const result = await Promise.race([
      performSearch(params.query),
      timeout
    ]);

    return { result, success: true };
  } catch (e) {
    return { error: e.message, success: false };
  }
}</code></div></div><h2>Next Steps</h2><ul><li><a href="/docs/agents" style="color:var(--olive)">Agent Fundamentals</a></li><li><a href="/guides/tool-integration" style="color:var(--olive)">Add Tools Tutorial</a></li><li><a href="/api" style="color:var(--olive)">API Reference</a></li></ul></div></div>`
  };
  return content[id] || `<div class="docs-page"><p>Page not found</p></div>`;
}

function renderGuidesList() {
  return `<div class="docs-page"><div class="docs-header"><h1 class="docs-page-title">Guides</h1><p class="docs-page-meta">Step-by-step tutorials for building and deploying agents</p></div><div class="docs-content"><h2>Getting Started Guides</h2><p>Learn by building real examples.</p><div class="guide-grid"><a href="/guides/chat-agent" class="guide-card"><div class="guide-icon">💬</div><div class="guide-title">Build a Chat Agent</div><div class="guide-desc">Create an interactive conversation agent</div></a><a href="/guides/tool-integration" class="guide-card"><div class="guide-icon">🔧</div><div class="guide-title">Add Tools to an Agent</div><div class="guide-desc">Extend agents with external capabilities</div></a><a href="/guides/streaming" class="guide-card"><div class="guide-icon">⚡</div><div class="guide-title">Stream Responses</div><div class="guide-desc">Implement real-time response streaming</div></a></div></div></div>`;
}

function renderGuideDetail(id) {
  const content = {
    chatAgent: `<div class="docs-page"><div class="breadcrumb"><a href="/guides">Guides</a><span class="breadcrumb-separator">/</span><span>Build a Chat Agent</span></div><div class="docs-header"><h1 class="docs-page-title">Build a Chat Agent</h1><p class="docs-page-meta">Create an interactive conversation agent from scratch</p></div><div class="docs-content"><h2>Overview</h2><p>In this guide, you'll build a conversational agent that can maintain context across multiple turns and respond naturally to user input.</p><h2>Step 1: Initialize the Agent</h2><div class="code-example"><div class="code-header"><span class="code-label">agent.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>import { Agent } from '@agents-sdk/dose';

const chatAgent = new Agent({
  model: 'claude-3-5-sonnet',
  name: 'ChatBot',
  instructions: 'You are a helpful assistant. Have natural conversations with users.',
  systemPrompt: 'Provide helpful, clear, and concise responses.'
});</code></div></div><h2>Step 2: Create a Session</h2><div class="code-example"><div class="code-header"><span class="code-label">session.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const session = await chatAgent.createSession({
  userId: 'user-123'
});

// Send messages and get responses
const response1 = await session.message('Hello!');
const response2 = await session.message('What is AI?');</code></div></div><h2>Step 3: Handle User Input</h2><p>Build a simple chat interface to collect user input and display responses.</p><h2>Step 4: Add Context Memory</h2><p>Maintain conversation history for better context understanding.</p><h2>Step 5: Deploy</h2><p>Deploy your chat agent to production using the deployment tools.</p><h2>Next Steps</h2><ul><li><a href="/guides/tool-integration" style="color:var(--olive)">Add Tools to Your Agent</a></li><li><a href="/guides/streaming" style="color:var(--olive)">Enable Response Streaming</a></li></ul></div></div>`,
    toolIntegration: `<div class="docs-page"><div class="breadcrumb"><a href="/guides">Guides</a><span class="breadcrumb-separator">/</span><span>Add Tools to an Agent</span></div><div class="docs-header"><h1 class="docs-page-title">Add Tools to an Agent</h1><p class="docs-page-meta">Extend your agent with external tools and integrations</p></div><div class="docs-content"><h2>Overview</h2><p>Tools enable agents to take actions in the real world. Learn how to integrate external APIs and functions.</p><h2>Define Your Tool</h2><div class="code-example"><div class="code-header"><span class="code-label">tools.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const weatherTool = {
  name: 'get_weather',
  description: 'Get weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' }
    },
    required: ['location']
  },
  execute: async (params) => {
    // Call weather API
    const response = await fetch(
      \`https://api.weather.service/\${params.location}\`
    );
    return response.json();
  }
};</code></div></div><h2>Add Tool to Agent</h2><div class="code-example"><div class="code-header"><span class="code-label">agent.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const agent = new Agent({ ... });
agent.addTool(weatherTool);

// Agent can now use the tool
const response = await agent.run(
  'What is the weather in Paris?'
);</code></div></div><h2>Tool Chaining</h2><p>Combine multiple tools to create powerful agent capabilities.</p><h2>Error Handling</h2><p>Implement robust error handling for tool execution.</p><h2>Next Steps</h2><ul><li><a href="/guides/chat-agent" style="color:var(--olive)">Build a Chat Agent</a></li><li><a href="/guides/streaming" style="color:var(--olive)">Enable Streaming</a></li></ul></div></div>`,
    streaming: `<div class="docs-page"><div class="breadcrumb"><a href="/guides">Guides</a><span class="breadcrumb-separator">/</span><span>Stream Responses</span></div><div class="docs-header"><h1 class="docs-page-title">Stream Responses</h1><p class="docs-page-meta">Implement real-time response streaming for better UX</p></div><div class="docs-content"><h2>Why Streaming?</h2><p>Streaming responses improves user experience by showing output as it's generated, rather than waiting for the complete response.</p><h2>Enable Streaming</h2><div class="code-example"><div class="code-header"><span class="code-label">agent.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>const stream = agent.stream('Tell me a story');

for await (const chunk of stream) {
  console.log(chunk.text);
  // Update UI with partial response
}</code></div></div><h2>Frontend Integration</h2><p>Handle streaming responses on the client side with proper buffering and rendering.</p><h2>Best Practices</h2><ul><li>Implement proper error handling for stream failures</li><li>Add loading indicators while streaming</li><li>Handle network interruptions gracefully</li><li>Optimize rendering for performance</li></ul><h2>Next Steps</h2><ul><li><a href="/guides/chat-agent" style="color:var(--olive)">Back to Chat Agent</a></li><li><a href="/api" style="color:var(--olive)">API Reference</a></li></ul></div></div>`
  };
  return content[id] || `<div class="docs-page"><p>Guide not found</p></div>`;
}

function renderApiReference() {
  return `<div class="docs-page"><div class="docs-header"><h1 class="docs-page-title">API Reference</h1><p class="docs-page-meta">Complete API documentation for AGENTS SDK DOSE</p></div><div class="docs-content"><h2>Base URL</h2><div class="code-example"><div class="code-content"><code>https://api.agents-sdk.dose/v1</code></div></div><h2>Authentication</h2><p>All requests require an API key in the Authorization header:</p><div class="code-example"><div class="code-header"><span class="code-label">Example</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agents-sdk.dose/v1/agents</code></div></div><h2>Endpoints</h2><h3 id="create-agent"><span class="method-badge">POST</span> /agents</h3><p>Create a new agent.</p><h3><span class="method-badge">GET</span> /agents/:id</h3><p>Get agent details.</p><h3><span class="method-badge">PUT</span> /agents/:id</h3><p>Update an agent.</p><h3><span class="method-badge">DELETE</span> /agents/:id</h3><p>Delete an agent.</p><h2>Response Format</h2><div class="code-example"><div class="code-header"><span class="code-label">JSON Response</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>{
  "success": true,
  "data": { ... },
  "error": null
}</code></div></div></div></div>`;
}

function renderSdkList() {
  return `<div class="docs-page"><div class="docs-header"><h1 class="docs-page-title">SDKs</h1><p class="docs-page-meta">Official SDKs for building with AGENTS SDK DOSE</p></div><div class="docs-content"><h2>Available SDKs</h2><div class="guide-grid"><a href="/sdk/typescript" class="guide-card"><div class="guide-icon">📘</div><div class="guide-title">TypeScript</div><div class="guide-desc">Full-featured SDK for TypeScript and JavaScript</div></a><a href="/sdk/python" class="guide-card"><div class="guide-icon">🐍</div><div class="guide-title">Python</div><div class="guide-desc">Python SDK for server-side development</div></a></div></div></div>`;
}

function renderSdkDetail(id) {
  const content = {
    typescript: `<div class="docs-page"><div class="breadcrumb"><a href="/sdk">SDKs</a><span class="breadcrumb-separator">/</span><span>TypeScript</span></div><div class="docs-header"><h1 class="docs-page-title">TypeScript SDK</h1><p class="docs-page-meta">Official TypeScript SDK for AGENTS SDK DOSE</p></div><div class="docs-content"><h2>Installation</h2><div class="code-example"><div class="code-header"><span class="code-label">npm</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>npm install @agents-sdk/dose</code></div></div><h2>Quick Start</h2><div class="code-example"><div class="code-header"><span class="code-label">app.ts</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>import { Agent } from '@agents-sdk/dose';

const agent = new Agent({
  model: 'claude-3-5-sonnet',
  instructions: 'You are a helpful assistant'
});

const response = await agent.run('Hello!');
console.log(response);</code></div></div><h2>Key Classes</h2><ul><li><strong>Agent:</strong> Main agent class</li><li><strong>Tool:</strong> Tool definition and execution</li><li><strong>Session:</strong> Conversation session management</li></ul><h2>Documentation</h2><p><a href="/api" style="color:var(--olive)">View full API reference</a></p></div></div>`,
    python: `<div class="docs-page"><div class="breadcrumb"><a href="/sdk">SDKs</a><span class="breadcrumb-separator">/</span><span>Python</span></div><div class="docs-header"><h1 class="docs-page-title">Python SDK</h1><p class="docs-page-meta">Official Python SDK for AGENTS SDK DOSE</p></div><div class="docs-content"><h2>Installation</h2><div class="code-example"><div class="code-header"><span class="code-label">pip</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>pip install agents-sdk-dose</code></div></div><h2>Quick Start</h2><div class="code-example"><div class="code-header"><span class="code-label">main.py</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>from agents_sdk import Agent

agent = Agent(
    model="claude-3-5-sonnet",
    instructions="You are a helpful assistant"
)

response = agent.run("Hello!")
print(response)</code></div></div><h2>Async Support</h2><div class="code-example"><div class="code-header"><span class="code-label">async.py</span><button class="copy-btn" type="button">Copy</button></div><div class="code-content"><code>import asyncio
from agents_sdk import Agent

async def main():
    agent = Agent(model="claude-3-5-sonnet")
    response = await agent.run_async("Hello!")
    print(response)

asyncio.run(main())</code></div></div><h2>Documentation</h2><p><a href="/api" style="color:var(--olive)">View full API reference</a></p></div></div>`
  };
  return content[id] || `<div class="docs-page"><p>SDK not found</p></div>`;
}

function renderExamplesList() {
  return `<div class="docs-page"><div class="docs-header"><h1 class="docs-page-title">Examples</h1><p class="docs-page-meta">Code examples and sample projects</p></div><div class="docs-content"><h2>Featured Examples</h2><p>Explore complete working examples of agents built with AGENTS SDK DOSE.</p><div class="guide-grid"><a href="#" class="guide-card"><div class="guide-icon">🤖</div><div class="guide-title">Chat Agent</div><div class="guide-desc">Interactive chatbot with conversation history</div></a><a href="#" class="guide-card"><div class="guide-icon">📊</div><div class="guide-title">Data Analyzer</div><div class="guide-desc">Agent that analyzes and visualizes data</div></a><a href="#" class="guide-card"><div class="guide-icon">🔍</div><div class="guide-title">Research Agent</div><div class="guide-desc">Multi-tool agent for research and synthesis</div></a></div><h2>Sample Projects</h2><p>Clone and run these projects to get started quickly.</p></div></div>`;
}

// Setup code copy buttons
function setupCodeCopyButtons() {
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const codeEl = e.target.closest('.code-example').querySelector('.code-content code');
      const text = codeEl.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}

// Attach 3D perspective to console card
function attachConsoleCard() {
  const card = $('#consoleCard');
  if (!card) return;
  const wrap = card.parentElement;
  if (!wrap) return;
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * 8;
    const rotY = (x - 0.5) * -8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}

// Open search modal with proper state management
function openSearch() {
  searchModal.hidden = false;
  searchModal.classList.add('open');
  searchInput.focus();
}

function closeSearch() {
  searchModal.hidden = true;
  searchModal.classList.remove('open');
  searchInput.value = '';
  searchResults.innerHTML = '';
}

// Setup scroll reveal animations
function setupScrollReveal() {
  const els = $$('[class*="reveal"]');
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.style.animation = 'none';
          setTimeout(() => {
            e.target.style.animation = '';
          }, 10);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  els.forEach(e => io.observe(e));
}

// Central page render function
function renderPage(pageId) {
  const data = pageData[pageId];
  if (!data) {
    pageContent.innerHTML = '<p>Page not found</p>';
    return;
  }

  let html = '';
  const template = data.template;

  if (template === 'home') html = renderHomePage();
  else if (template === 'docsList') html = renderDocsList();
  else if (template === 'docDetail') html = renderDocDetail(pageId);
  else if (template === 'guidesList') html = renderGuidesList();
  else if (template === 'guideDetail') html = renderGuideDetail(pageId);
  else if (template === 'apiReference') html = renderApiReference();
  else if (template === 'sdkList') html = renderSdkList();
  else if (template === 'sdkDetail') html = renderSdkDetail(pageId);
  else if (template === 'examplesList') html = renderExamplesList();

  pageContent.innerHTML = html;
  renderSidebar(pageId !== 'home' ? pageId : '');
  docsSidebar.hidden = pageId === 'home';

  // Setup interactions on new content
  setupCodeCopyButtons();
  attachConsoleCard();
  setupScrollReveal();

  // Update page title
  document.title = data.title + ' | AGENTS SDK DOSE';
}

// Navigation function
function navigateTo(pageId) {
  const path = pageId === 'home' ? '/' : `/${pageId}`;
  window.history.pushState({ pageId }, '', path);
  renderPage(pageId);
  window.scrollTo(0, 0);
}

// Global click delegation for navigation
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="/"]');
  if (!link || link.target === '_blank') return;

  const pathname = link.getAttribute('href');
  const pageId = idFromPath(pathname);

  e.preventDefault();
  navigateTo(pageId);
  if (!mobile.hidden) closeMenu();
  if (!docsSidebar.hidden && window.innerWidth < 1100) closeSidebar();
});

// Search button and close handlers
searchBtn.addEventListener('click', openSearch);

searchClose.addEventListener('click', () => {
  closeSearch();
  searchBtn.focus();
});

// Search functionality
searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    searchResults.innerHTML = '';
    return;
  }

  const matches = searchDatabase.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(query);
    const keywordMatch = item.keywords.some(k => k.startsWith(query));
    return titleMatch || keywordMatch;
  });

  searchResults.innerHTML = matches
    .map(
      item => `
    <a href="/${item.id}" class="search-result-item" data-id="${item.id}">
      <div class="result-title">${item.title}</div>
      <div class="result-section">${item.section}</div>
    </a>
  `
    )
    .join('');

  $$('.search-result-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.dataset.id;
      closeSearch();
      navigateTo(id);
    });
  });
});

// Initialize page based on current URL
const initialId = idFromPath(window.location.pathname);
renderPage(initialId);

// Handle back/forward
window.addEventListener('popstate', e => {
  const pageId = e.state?.pageId || idFromPath(window.location.pathname);
  renderPage(pageId);
});
