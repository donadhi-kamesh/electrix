/**
 * Electrix B2B Platform
 * Sidebar navigation, Mock BOM Upload, AI dummy chat
 */

document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();

    // ==========================================================================
    //  PAGE METADATA
    // ==========================================================================
    const pageMeta = {
        'page-dashboard': { title: 'Dashboard', desc: 'Overview of generated reports and data access.' },
        'page-analysis':  { title: 'Analysis', desc: 'Upload BOMs and generate failure analysis reports.' },
        'page-raw-data':  { title: 'Raw Data', desc: 'Direct access to raw failure databases.' },
        'page-ai':        { title: 'Electrix AI', desc: 'Intelligent design assistant.' },
        'page-pricing':   { title: 'Pricing', desc: 'Select an intelligence scale plan.' }
    };

    // ==========================================================================
    //  SIDEBAR NAVIGATION
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const headingEl = document.getElementById('page-heading');
    const descEl = document.getElementById('page-desc');

    function switchPage(targetId) {
        navLinks.forEach(l => l.classList.remove('active'));
        const targetLink = document.querySelector(`.nav-link[data-page="${targetId}"]`);
        if (targetLink) targetLink.classList.add('active');

        pages.forEach(p => {
            if (p.id === targetId) {
                p.classList.add('active-page');
                // Special case for AI page which is flex layout
                if (targetId === 'page-ai') {
                    p.style.display = 'flex';
                } else {
                    p.style.display = 'block';
                }
            } else {
                p.classList.remove('active-page');
                p.style.display = 'none';
            }
        });

        const meta = pageMeta[targetId];
        if (meta) {
            headingEl.textContent = meta.title;
            descEl.textContent = meta.desc;
        }
    }

    // Initialize display state
    pages.forEach(p => {
        if (!p.classList.contains('active-page')) {
            p.style.display = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            switchPage(link.getAttribute('data-page'));
        });
    });

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // ==========================================================================
    //  ANALYSIS: SAMPLE REPORT BUTTON
    // ==========================================================================
    const btnSampleReport = document.getElementById('btn-sample-report');
    const analysisResults = document.getElementById('analysis-results');
    if (btnSampleReport && analysisResults) {
        btnSampleReport.addEventListener('click', () => {
            analysisResults.style.display = 'block';
            analysisResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            lucide.createIcons();
        });
    }

    // ==========================================================================
    //  ANALYSIS: BOM UPLOAD MOCK
    // ==========================================================================
    const dropZone = document.getElementById('drop-zone');
    const resultsArea = document.getElementById('analysis-results');

    if (dropZone) {
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const highlight = (e) => {
            dropZone.classList.add('dragover');
        };

        const unhighlight = (e) => {
            dropZone.classList.remove('dragover');
        };

        const handleDrop = (e) => {
            const status = document.getElementById('upload-status');
            
            status.style.display = 'block';
            status.style.color = 'var(--md-primary)';
            status.innerHTML = '<i class="lucide lucide-loader" style="vertical-align: middle; margin-right: 4px; animation: spin 1s linear infinite;"></i> Analyzing BOM...';
            lucide.createIcons();

            // Mock uploading delay
            setTimeout(() => {
                status.style.color = 'var(--md-success)';
                status.innerHTML = '<i data-lucide="check-circle" style="vertical-align: middle; margin-right: 4px;"></i> Analysis Complete';
                lucide.createIcons();
                
                // Show sample results
                resultsArea.style.display = 'block';
                resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

                setTimeout(() => {
                    status.style.display = 'none';
                }, 4000);
            }, 2500);
        };

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        dropZone.addEventListener('drop', handleDrop, false);
        
        const btnUpload = dropZone.querySelector('.btn-primary-lg');
        if (btnUpload) btnUpload.addEventListener('click', handleDrop);
    }

    // ==========================================================================
    //  RAW DATA: MOCK API KEY
    // ==========================================================================
    const btnApiKey = document.getElementById('btn-get-api-key');
    if(btnApiKey) {
        btnApiKey.addEventListener('click', () => {
            btnApiKey.innerHTML = '<i data-lucide="check"></i> API Key Generated';
            btnApiKey.classList.add('green');
            btnApiKey.style.background = 'var(--md-success)';
            btnApiKey.style.color = '#000';
            lucide.createIcons();
            
            setTimeout(() => {
                btnApiKey.innerHTML = '<i data-lucide="key"></i> Get API Key';
                btnApiKey.style.background = '';
                btnApiKey.style.color = '';
                btnApiKey.classList.remove('green');
                lucide.createIcons();
                
                alert('Your Production API Key has been sent to your registered business email.');
            }, 2000);
        });
    }

    // ==========================================================================
    //  AI CHAT LOGIC (Dummy)
    // ==========================================================================
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if(aiSendBtn && aiInput) {
        function sendMessage() {
            const text = aiInput.value.trim();
            if(!text) return;

            // Add User bubble
            const userHtml = `
                <div class="chat-bubble user">
                    <div class="chat-content">
                        <p>${text}</p>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', userHtml);
            aiInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Mock Bot reply
            setTimeout(() => {
                const botHtml = `
                    <div class="chat-bubble bot">
                        <div class="chat-avatar"><i data-lucide="bot"></i></div>
                        <div class="chat-content">
                            <p>Based on Electrix failure reports across millions of components, I suggest selecting an X7R dielectric over Y5V for decoupling capacitors in high-temperature environments. Y5V typically loses up to 80% capacitance near 85°C.</p>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', botHtml);
                lucide.createIcons();
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }

        aiSendBtn.addEventListener('click', sendMessage);
        aiInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

});
