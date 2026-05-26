const reports = [
    {
        id: 1,
        title: 'Risco Elétrico',
        date: '26/05/2026',
        status: 'Em Análise',
        description: 'Fios desencapados próximos ao painel.',
        location: 'Setor A',
        feedback: 'Equipe técnica acionada.'
    },
    {
        id: 2,
        title: 'Estresse',
        date: '22/05/2026',
        status: 'Pendente',
        description: 'Sobrecarga de trabalho.',
        location: 'Produção',
        feedback: 'Análise do RH em andamento.'
    }
];

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(email === '' || password === '') {
        alert('Preencha todos os campos');
        return;
    }

    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');

    renderReports();
}

function openTab(tabId) {

    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });

    document.getElementById(tabId).classList.add('active-tab');
}

function submitPhysicalRisk() {

    const riskType = document.getElementById('riskType').value;
    const description = document.getElementById('riskDescription').value;
    const location = document.getElementById('riskLocation').value;

    if(description.trim() === '') {
        alert('A descrição é obrigatória');
        return;
    }

    reports.unshift({
        id: Date.now(),
        title: riskType || 'Risco Físico',
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Pendente',
        description,
        location,
        feedback: 'Relato recebido pela equipe.'
    });

    renderReports();

    alert('Relato enviado com sucesso!');

    openTab('reports');
}

function submitMentalHealth() {

    const type = document.getElementById('mentalType').value;
    const description = document.getElementById('mentalDescription').value;
    const anonymous = document.getElementById('anonymousToggle').checked;

    if(description.trim() === '') {
        alert('A descrição é obrigatória');
        return;
    }

    reports.unshift({
        id: Date.now(),
        title: type || 'Bem-Estar',
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Em Análise',
        description: anonymous ? description + ' (Anônimo)' : description,
        location: 'Confidencial',
        feedback: 'Equipe especializada acionada.'
    });

    renderReports();

    alert('Relato enviado!');

    openTab('reports');
}

function renderReports() {

    const reportsList = document.getElementById('reportsList');

    reportsList.innerHTML = '';

    reports.forEach(report => {

        reportsList.innerHTML += `
            <div class="report-item" onclick="openDetails(${report.id})">
                <h3>${report.title}</h3>
                <p>${report.date}</p>
                <p>Status: ${report.status}</p>
            </div>
        `;
    });
}

function openDetails(id) {

    const report = reports.find(r => r.id === id);

    if(!report) return;

    document.getElementById('detailTitle').innerText = report.title;
    document.getElementById('detailDate').innerText = report.date;
    document.getElementById('detailStatus').innerText = report.status;
    document.getElementById('detailDescription').innerText = report.description;
    document.getElementById('detailLocation').innerText = report.location;
    document.getElementById('detailFeedback').innerText = report.feedback;

    openTab('details');
}