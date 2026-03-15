/**
 * Electrix Enterprise Dashboard
 * Sidebar-driven navigation, AI chat, chart rendering.
 */

document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();

    // --- Page metadata ---
    const pageMeta = {
        'page-dashboard': { title: 'System Overview', desc: 'Real-time failure analysis and diagnostics.' },
        'page-intake':    { title: 'BOM Upload', desc: 'Import Bill of Materials to synchronize inventory.' },
        'page-assistant': { title: 'Analysis Engine', desc: 'Execute component analysis and diagnostics.' },
        'page-reports':   { title: 'Analysis Reports', desc: 'View generated analysis reports.' },
        'page-raw':       { title: 'Raw Data Export', desc: 'Filter and export component data.' },
        'page-settings':  { title: 'Settings', desc: 'Manage account preferences.' }
    };

    // --- Sidebar Navigation ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const headingEl = document.getElementById('page-heading');
    const descEl = document.getElementById('page-desc');

    // --- Sidebar Toggle ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-page');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            pages.forEach(p => {
                if (p.id === targetId) {
                    p.classList.add('active-page');
                } else {
                    p.classList.remove('active-page');
                }
            });

            const meta = pageMeta[targetId];
            if (meta) {
                headingEl.textContent = meta.title;
                descEl.textContent = meta.desc;
            }
        });
    });

    // --- Dashboard: Render Bar Chart ---
    const chartArea = document.getElementById('chart-area');
    const barHeights = [25, 40, 55, 35, 65, 80, 45, 70, 50, 60, 75, 90, 55, 95];
    barHeights.forEach(h => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = h + '%';
        chartArea.appendChild(bar);
    });

    // --- BOM Upload: Dropzone ---
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
            dropZone.addEventListener(e, ev => { ev.preventDefault(); ev.stopPropagation(); }, false);
        });
        ['dragenter', 'dragover'].forEach(e => {
            dropZone.addEventListener(e, () => dropZone.classList.add('dragover'), false);
        });
        ['dragleave', 'drop'].forEach(e => {
            dropZone.addEventListener(e, () => dropZone.classList.remove('dragover'), false);
        });
        dropZone.addEventListener('drop', () => {
            const btn = dropZone.querySelector('.btn-primary-lg');
            btn.innerHTML = '<i data-lucide="check-circle"></i> File uploaded';
            btn.style.background = '#16a34a';
            lucide.createIcons();

            setTimeout(() => {
                document.querySelector('.nav-link[data-page="page-assistant"]').click();
                appendAi("BOM ingested. Ready for analysis request.");
            }, 1200);
        });
    }

    // --- AI Assistant: Chat ---
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const chatBody = document.getElementById('chat-body');

    function appendUser(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.innerHTML = `
            <div class="msg-avatar user-bg"><img src="avatar.png" class="user-img-sm"></div>
            <div class="msg-content">
                <div class="msg-bubble-user">${text}</div>
                <span class="msg-time">Just now</span>
            </div>
        `;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendAi(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg ai';
        div.innerHTML = `
            <div class="msg-avatar ai-bg glow-avatar-sm"><img src="logo.png" class="brand-img-sm"></div>
            <div class="msg-content">
                <div class="msg-bubble-ai premium-bubble">${text}</div>
                <span class="msg-time">Just now</span>
            </div>
        `;
        chatBody.appendChild(div);
        lucide.createIcons();
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSend() {
        const val = chatInput.value.trim();
        if (!val) return;
        appendUser(val);
        chatInput.value = '';

        setTimeout(() => {
            const lower = val.toLowerCase();
            if (lower.includes('run') || lower.includes('analyze') || lower.includes('autopsy') || lower.includes('yes')) {
                appendAi("Executing analysis...");
                setTimeout(() => {
                    appendAi("Analysis complete. Results available in <strong>Analysis Reports</strong>.");
                    document.getElementById('reports-empty').style.display = 'none';
                    document.getElementById('reports-done').style.display = 'block';
                }, 1600);
            } else {
                appendAi("Understood. Let me know when you're ready to proceed.");
            }
        }, 700);
    }

    btnSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // "Go to AI Assistant" button on empty reports page
    const gotoBtn = document.getElementById('goto-assistant');
    if (gotoBtn) {
        gotoBtn.addEventListener('click', () => {
            document.querySelector('.nav-link[data-page="page-assistant"]').click();
        });
    }
});
