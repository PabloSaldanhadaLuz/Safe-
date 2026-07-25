let unsubscribe = null;

import {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    where,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "./firebase.js";

const reports = [];

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Preencha todos os campos.");
        return;
    }

    try {

        // Faz login
        await signInWithEmailAndPassword(auth, email, password);

        // Busca os dados do usuário no Firestore
        const usuario = await getDoc(
            doc(db, "usuarios", auth.currentUser.uid)
        );

        if (!usuario.exists()) {
            alert("Usuário não encontrado.");
            return;
        }

        const dados = usuario.data();

        console.log(dados);

        // Verifica se é administrador
        if (dados.tipo === "admin") {

            window.location.href = "admin.html";
            return;

        }

        // Funcionário continua no sistema normal
        document.getElementById("welcomeName").innerText =
            `Bem-vindo, ${dados.nome}`;

        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");

        await carregarPerfil();
        carregarRelatos();

    }
    catch (error) {

        console.error(error);
        alert("E-mail ou senha inválidos.");

    }

}

async function logout(){

    await signOut(auth);

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("appScreen").classList.add("hidden");

    if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
}

}

function openTab(tabId) {

    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });

    document.getElementById(tabId).classList.add('active-tab');
}

async function submitPhysicalRisk() {

    const riskType = document.getElementById('riskType').value;
    const description = document.getElementById('riskDescription').value;
    const location = document.getElementById('riskLocation').value;

    if (description.trim() === '') {
        alert('A descrição é obrigatória');
        return;
    }

    try {

        await addDoc(collection(db,"relatos"),{

        uid: auth.currentUser.uid,

        email: auth.currentUser.email,

        title: riskType || "Risco Físico",

        description: description,

        location: location,

        status: "Pendente",

        feedback: "Relato recebido pela equipe.",

        createdAt: new Date(),

        date: new Date().toLocaleDateString("pt-BR")

});

        alert("Relato enviado com sucesso!");

        document.getElementById("riskType").value = "";
        document.getElementById("riskDescription").value = "";
        document.getElementById("riskLocation").value = "";

        openTab("reports");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao salvar.");

    }

}

async function submitMentalHealth() {

    const type = document.getElementById('mentalType').value;
    const description = document.getElementById('mentalDescription').value;
    const anonymous = document.getElementById('anonymousToggle').checked;

    if(description.trim() === ''){
        alert("A descrição é obrigatória");
        return;
    }

    try{

        await addDoc(collection(db,"relatos"),{
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        title: type || "Bem-Estar",
        description: anonymous ? description + " (Anônimo)" : description,
        location: "Confidencial",
        status: "Em Análise",
        feedback: "Equipe especializada acionada.",
        createdAt: new Date(),
        date: new Date().toLocaleDateString("pt-BR")
        });
        alert("Relato enviado!");
        document.getElementById("mentalType").value = "";
        document.getElementById("mentalDescription").value = "";
        document.getElementById("anonymousToggle").checked = false;
        openTab("reports");

    }
    
    catch(erro){

        console.error(erro);

        alert("Erro ao salvar.");

    }

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

async function carregarRelatos() {

    unsubscribe = onSnapshot(
        collection(db, "relatos"),
        (snapshot) => {
            reports.length = 0;
            snapshot.forEach((doc) => {
                const dados = doc.data();
                if(dados.uid === auth.currentUser.uid){
                    reports.push({
                        id: doc.id,
                        ...dados
                    });
                }
            });
            console.log(reports);
            renderReports();
        }
    );
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

async function register() {

    const nome = document.getElementById("nome").value.trim();
    const empresa = document.getElementById("empresa").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (
        nome === "" ||
        empresa === "" ||
        cargo === "" ||
        email === "" ||
        password === ""
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    try {

        // Cria usuário no Authentication
        const credencial = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Salva dados no Firestore
        await setDoc(doc(db, "usuarios", credencial.user.uid), {
            nome,
            empresa,
            cargo,
            email,
            tipo: "funcionario",
            criadoEm: new Date()
        });

        alert("Conta criada com sucesso!");

        // Atualiza tela inicial
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("appScreen").classList.remove("hidden");

        // Carrega perfil e relatos
        const usuario = await getDoc(
    doc(db, "usuarios", credencial.user.uid)
);

const dados = usuario.data();

    document.getElementById("welcomeName").innerText =
    `Bem-vindo, ${dados.nome}`;
    document.getElementById("profileName").innerText =
    dados.nome;
    document.getElementById("profileCargo").innerText =
    dados.cargo;
    document.getElementById("profileEmpresa").innerText =
    dados.empresa;
    carregarRelatos();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao criar conta: " + erro.message);

    }

}

function showRegister(){

    document.getElementById("loginCard").classList.add("hidden");
    document.getElementById("registerCard").classList.remove("hidden");

}

function showLogin(){

    document.getElementById("registerCard").classList.add("hidden");
    document.getElementById("loginCard").classList.remove("hidden");

}

async function carregarPerfil() {

    try {

        const usuario = await getDoc(
            doc(db, "usuarios", auth.currentUser.uid)
        );

        if (!usuario.exists()) return;

        const dados = usuario.data();

        document.getElementById("welcomeName").innerText =
            `Bem-vindo, ${dados.nome}`;

        document.getElementById("profileName").innerText =
            dados.nome;

        document.getElementById("profileCargo").innerText =
            dados.cargo;

        document.getElementById("profileEmpresa").innerText =
            dados.empresa;

        // Se existir esse elemento no HTML
        const email = document.getElementById("profileEmail");

        if(email){
            email.innerText = dados.email;
        }

        // Coloca as iniciais no avatar
        const avatar = document.querySelector(".profile-avatar");

        if(avatar){

            const iniciais = dados.nome
                .split(" ")
                .map(n => n[0])
                .slice(0,2)
                .join("")
                .toUpperCase();

            avatar.innerText = iniciais;

        }

    } catch(erro){

        console.log(erro);

    }

}

window.login = login;
window.openTab = openTab;
window.submitPhysicalRisk = submitPhysicalRisk;
window.submitMentalHealth = submitMentalHealth;
window.openDetails = openDetails;
window.register = register;
window.logout = logout;
window.showRegister = showRegister;
window.showLogin = showLogin;