// Substitua com seu token público (PAT)
const GITHUB_TOKEN = 'ghp_...'; // 💡 INSIRA SEU TOKEN AQUI!
const OWNER = 'seuusuario';
const REPO = 'tecnomagia-servidor-do-caos';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return await res.json();
}

async function uploadFileToRepo(filename, blob) {
  const encodedContent = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(btoa(reader.result));
    reader.onerror = reject;
    reader.readAsBinaryString(blob);
  });

  const path = `manifestacoes/${filename}`;

  const checkRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });

  let sha = '';
  if (checkRes.ok) {
    const data = await checkRes.json();
    sha = data.sha;
  }

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Manifestação ativada: ${filename}`,
      content: encodedContent,
      sha: sha
    })
  });

  if (!response.ok) throw new Error(`Falha ao subir ${filename}: ${await response.text()}`);
}

async function getOpenIssues() {
  return await fetchJson(`https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&labels=pending-manifestation`);
}

async function updateIssueLabel(issueNumber, labels) {
  await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ labels })
  });
}

async function addCommentToIssue(issueNumber, comment) {
  await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: comment })
  });
}

async function updateReadme(content) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const data = await res.json();
  const encoded = btoa(content);

  await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md`, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Atualização automática do README após nova manifestação',
      content: encoded,
      sha: data.sha
    })
  });
}

async function getAllUsersFromIssues() {
  const issues = await getOpenIssues();
  return issues.map(issue => {
    const corpo = issue.body;
    const nomeMatch = corpo.match(/Nome:\s*(.+)/);
    const emailMatch = corpo.match(/Email:\s*(.+)/);
    return {
      nome: nomeMatch ? nomeMatch[1].trim() : 'Anônimo',
      email: emailMatch ? emailMatch[1].trim() : null
    };
  });
}

async function enviarNotificacaoQuantica(email, assinatura) {
  // Simula envio de notificação — pode ser integrado com EmailJS ou Zapier
  console.log(`[Q-NOTIF] Enviada para ${email}: ${assinatura.eventoFuturo.intento} será real em ${assinatura.eventoFuturo.data_realizacao}`);
}