// Horários Astrológicos (UTC-3)
const HORARIOS_ASTROLOGICOS = [
  { h: 4, m: 30 }, { h: 7, m: 30 }, { h: 12, m: 0 },
  { h: 15, m: 30 }, { h: 19, m: 30 }, { h: 22, m: 0 }
];

function checkAndTriggerWorkflows() {
  const agora = new Date();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();

  const ehHorarioCritico = HORARIOS_ASTROLOGICOS.some(h => h.h === horaAtual && h.m === minutoAtual);

  if (ehHorarioCritico) {
    console.log("⏰ Horário astrológico atingido! Iniciando ritual...");
    processAllPendingIssues();
  }
}

async function processAllPendingIssues() {
  const issues = await getOpenIssues();
  const processed = [];

  for (const issue of issues) {
    if (issue.state !== 'open') continue;

    const intento = issue.title;
    const corpo = issue.body;
    const nome = corpo.match(/Nome:\s*(.+)/)?.[1]?.trim() || 'Anônimo';
    const data = corpo.match(/Data de nascimento:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1] || '01/01/1900';

    const fotos = [];
    const graficos = [];

    // Buscar anexos nos comentários
    const comments = await fetchJson(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issue.number}/comments`);
    for (const comment of comments) {
      const urls = comment.body.match(/https:\/\/.*?\.(jpg|jpeg|png|gif|pdf)/gi);
      if (urls) {
        for (const url of urls) {
          const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
          const blob = await res.blob();
          if (blob.type.startsWith('image')) {
            if (url.includes('testemunho') || url.includes('foto')) {
              fotos.push(blob);
            } else {
              graficos.push(blob);
            }
          }
        }
      }
    }

    const foto = fotos[0] || null;
    const grafico = graficos[0] || null;

    if (!intento || !nome || !data) {
      console.warn(`Issue ${issue.number} incompleta. Ignorada.`);
      continue;
    }

    try {
      const resultado = await quantumEngine.iniciarManifestacaoFinal(intento, nome, data, foto, grafico);
      await addCommentToIssue(issue.number, `✅ MANIFESTAÇÃO ATIVADA! Código: ${resultado.codigo}\n\nArtefato: https://${OWNER}.github.io/${REPO}/manifestacoes/${resultado.imagem}\n\nRealidade reprogramada: ${resultado.retrocausal}`);

      await updateIssueLabel(issue.number, ["processed"]);
      processed.push(issue.number);

      // Atualizar README
      const readme = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }).then(r => r.json());

      const decoded = atob(readme.content);
      const novoCard = `
### ✅ Manifestação Recente (Retrocausal)
- **[${intento.substring(0,40)}...](${resultado.retrocausal})**
  - _Código: ${resultado.codigo}_  
  - _Data de realização: ${new Date().toLocaleDateString()} → Futuro: ${new Date().getFullYear()+1}-XX-XX_  
  - _Ativado em: ${new Date().toLocaleString()}_

`;
      const novoReadme = decoded.replace(
        "### 📜 ÚLTIMAS MANIFESTAÇÕES",
        novoCard + "\n\n### 📜 ÚLTIMAS MANIFESTAÇÕES"
      );

      await updateReadme(novoReadme);

      console.log(`✅ Manifestação ${issue.number} concluída!`);
    } catch (e) {
      console.error(`❌ Falha na manifestação ${issue.number}:`, e);
    }
  }

  if (processed.length > 0) {
    console.log(`🎉 ${processed.length} manifestações processadas neste ciclo.`);
  }
}

// Iniciar sistema
document.addEventListener('DOMContentLoaded', () => {
  setInterval(checkAndTriggerWorkflows, 60000); // Verifica a cada minuto

  document.getElementById('manifestForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const intento = document.getElementById('intent').value;
    const nome = document.getElementById('name').value;
    const data = document.getElementById('birthDate').value;
    const foto = document.getElementById('testimonyPhoto').files[0];
    const grafico = document.getElementById('radionicGraphic').files[0];

    const statusDiv = document.getElementById('status');
    const displayDiv = document.getElementById('manifestation-display');

    statusDiv.innerHTML = "<p>⏳ Processando seu pedido quântico...</p>";
    displayDiv.innerHTML = "<div class='pulse'>🌀 Criando assinatura quântica...</div>";

    // Criar issue no GitHub
    const formData = new FormData();
    formData.append('title', intento);
    formData.append('body', `Nome: ${nome}\nData de nascimento: ${data}\nEmail: ${prompt('Digite seu email (opcional, para notificação):') || 'Não fornecido'}`);

    const issueRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: 'POST',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: intento, body: `Nome: ${nome}\nData de nascimento: ${data}\nEmail: ${prompt('Email (opcional):') || 'Não fornecido'}`, labels: ["pending-manifestation"] })
    });

    if (issueRes.ok) {
      const issue = await issueRes.json();
      statusDiv.innerHTML = `<p>✅ Pedido enviado! ID: ${issue.number}</p>`;
      displayDiv.innerHTML = `<p>🔮 Aguarde o próximo ciclo astrológico. Sua realidade já está sendo reprogramada.</p>`;
      
      if (foto || grafico) {
        displayDiv.innerHTML += `<p>📸 Imagens anexadas. Processamento automático em 6 janelas.</p>`;
      }

      // Mostrar QR Code
      const qrCode = await gerarQRCode({
        intento, nome, data, codigo: gerarCodigoQuantico(intento, nome, data)
      });
      displayDiv.innerHTML += `<img src="${qrCode.toDataURL()}" style="width: 150px; margin-top: 1rem;">`;
    } else {
      statusDiv.innerHTML = `<p style="color: red;">❌ Erro ao enviar pedido. Verifique seu token.</p>`;
    }
  });
});

console.log("🚀 Sistema Servidor do Caos — V4.0 | Carregado. Aguardando pedidos...");