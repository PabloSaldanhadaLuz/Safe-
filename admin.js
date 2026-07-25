let relatoAtual = null;

import{
    db,
    auth,
    collection,
    query,
    orderBy,
    onSnapshot,
    signOut,
    updateDoc,
    doc
} from "./firebase.js";

const reports=[];

function carregarRelatos(){
    onSnapshot(
        query(
            collection(db,"relatos"),
            orderBy("createdAt","desc")
        ),
        (snapshot)=>{
            reports.length=0;
            snapshot.forEach((doc)=>{
                reports.push({
                    id:doc.id,
                    ...doc.data()
                });
            });
            renderReports();
            atualizarDashboard();
        }
    );
}

function renderReports(){

    const lista=document.getElementById("reportsList");
    lista.innerHTML="";

    reports.forEach((report)=>{
        lista.innerHTML+=`
        <div class="report-item" onclick="openDetails('${report.id}')">
            <h3>${report.title}</h3>
            <p><strong>Funcionário:</strong> ${report.email}</p>
            <p><strong>Status:</strong> ${report.status}</p>
            <p>${report.date}</p>
        </div>
        `;
    });
}

function openDetails(id){

    const report = reports.find(r => r.id === id);

    if(!report) return;

    relatoAtual = report.id;

    document.getElementById("detailTitle").innerText = report.title;

    document.getElementById("detailDate").innerText = report.date;

    document.getElementById("detailStatus").value = report.status;

    document.getElementById("detailLocation").innerText = report.location;

    document.getElementById("detailDescription").innerText = report.description;

    document.getElementById("detailFeedback").innerText = report.feedback;

    lucide.createIcons();
}


async function logout(){
    await signOut(auth);
    window.location.href="index.html";
}

function atualizarDashboard(){
    const total = reports.length;
    const pendentes = reports.filter(
        r => r.status === "Pendente"
    ).length;
    const analise = reports.filter(
        r => r.status === "Em Análise"
    ).length;
    const resolvidos = reports.filter(
        r => r.status === "Resolvido"
    ).length;

    document.getElementById("totalReports").innerText = total;
    document.getElementById("pendingReports").innerText = pendentes;
    document.getElementById("analysisReports").innerText = analise;
    document.getElementById("resolvedReports").innerText = resolvidos;
}

async function salvarStatus(){

    if(relatoAtual == null){

        return;

    }

    try{

        await updateDoc(

            doc(db,"relatos",relatoAtual),

            {

                status: document.getElementById("detailStatus").value

            }

        );

        alert("Status atualizado!");

    }

    catch(erro){

        console.log(erro);

        alert("Erro ao atualizar.");

    }

}

window.logout=logout;
window.openDetails=openDetails;
window.salvarStatus = salvarStatus;

carregarRelatos();