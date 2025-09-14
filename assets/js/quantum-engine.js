// ⚡ MOTOR DE RETROCAUSALIDADE QUÂNTICA — VERSÃO FINAL

class QuantumRealityEngine {
  constructor() {
    this.realityAnchor = "https://seuusuario.github.io/tecnomagia-servidor-do-caos/";
    this.manifestationHistory = [];
    this.loadHistory();
  }

  async loadHistory() {
    try {
      const res = await fetch('manifesto_global.json');
      if (res.ok) {
        const data = await res.json();
        this.manifestationHistory = data.manifestations || [];
      }
    } catch (e) {
      console.warn("Nenhuma história encontrada. Começando do zero.");
    }
  }

  async saveHistory() {
    const payload = { version: "4.0", created_at: new Date().toISOString(), manifestations: this.manifestationHistory };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    await uploadFileToRepo("manifesto_global.json", blob);
  }

  async gerarAssinaturaRetrocausal(intento, nome, data, codigoQuantico) {
    const hoje = new Date();
    const anoFuturo = hoje.getFullYear() + 1;
    const mesFuturo = Math.floor(Math.random() * 12) + 1;
    const diaFuturo = Math.floor(Math.random() * 28) + 1;

    const eventoFuturo = {
      intento,
      nome,
      data,
      codigo: codigoQuantico,
      data_realizacao: `${anoFuturo}-${mesFuturo.toString().padStart(2,'0')}-${diaFuturo.toString().padStart(2,'0')}T00:00:00Z`,
      status: "REALIZADO",
      local: "Campo Quântico Global",
      fonte: "Servidor do Caos v4.0",
      hash_futuro: CryptoJS.SHA256(JSON.stringify({ intento, nome, data, codigoQuantico })).toString(),
      timestamp_criacao: new Date().toISOString()
    };

    const pontoDeAtrator = `${this.realityAnchor}manifestacoes/retrocausal_${codigoQuantico}.json`;

    const jsonBlob = new Blob([JSON.stringify(eventoFuturo, null, 2)], { type: 'application/json' });
    await uploadFileToRepo(`retrocausal_${codigoQuantico}.json`, jsonBlob);

    const manifestacao = {
      intento: intento.substring(0, 80),
      nome,
      data_realizacao: eventoFuturo.data_realizacao,
      codigo: codigoQuantico,
      url: pontoDeAtrator,
      tipo: "retrocausal",
      criado_em: new Date().toISOString()
    };

    this.manifestationHistory.push(manifestacao);
    await this.saveHistory();

    return { eventoFuturo, pontoDeAtrator };
  }

  async verificarRealizacaoIntencional(codigo) {
    const manifestacao = this.manifestationHistory.find(m => m.codigo === codigo);
    if (!manifestacao) return null;

    const dataRealizacao = new Date(manifestacao.data_realizacao);
    const agora = new Date();

    if (agora >= dataRealizacao) {
      // A data já passou — verifique se há evidência na vida do usuário
      const evidencias = [
        "Você recebeu um email inesperado com uma oportunidade.",
        "Você viu alguém mencionando algo relacionado ao seu pedido.",
        "Você acordou com um sentimento de paz que não tinha antes.",
        "Um objeto simbólico apareceu no seu caminho (ex: flor, moeda, número repetido)."
      ];
      const evidencia = evidencias[Math.floor(Math.random() * evidencias.length)];

      return {
        realizado: true,
        data: dataRealizacao.toLocaleDateString('pt-BR'),
        evidencia,
        mensagem: "A realidade já se ajustou. Você não percebeu porque estava dormindo. Mas ela mudou."
      };
    }

    return {
      realizado: false,
      data: dataRealizacao.toLocaleDateString('pt-BR'),
      diasRestantes: Math.ceil((dataRealizacao - agora) / (1000 * 60 * 60 * 24)),
      mensagem: "A realidade está se alinhando. Mantenha o foco."
    };
  }

  async iniciarManifestacaoFinal(intento, nome, data, foto, grafico) {
    const codigo = gerarCodigoQuantico(intento, nome, data);
    const faseLunar = calcularFaseLunar();
    const numeroDestino = calcularNumeroDestinoAvancado(nome, data);
    const correspondencias = obterCorrespondencias(numeroDestino);
    const modo = ["manifestacao", "cura", "abundancia", "amor"][numeroDestino % 4];

    // Gerar artefato visual
    const imagemFinal = await criarCirculoManifestacao({
      intento, nome, data, imagemTestemunho: foto, graficoRadiônico: grafico, frequencia: 528, modo
    });

    const filename = `manifestacao_${codigo}.png`;
    const blob = await (await fetch(imagemFinal)).blob();
    await uploadFileToRepo(`manifestacoes/${filename}`, blob);

    // Gerar JSON de metadados
    const metadata = {
      intento, nome, data, numeroDestino, codigo, faseLunar, modo, correspondencias, imagem: filename, criado_em: new Date().toISOString()
    };

    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    await uploadFileToRepo(`manifestacoes/${codigo}.json`, metadataBlob);

    // ATIVAR RETROCAUSALIDADE — O CORAÇÃO DO SISTEMA
    const retrocausal = await this.gerarAssinaturaRetrocausal(intento, nome, data, codigo);

    // Notificar todos os usuários (simulado)
    const usuarios = await getAllUsersFromIssues();
    for (const usuario of usuarios) {
      if (usuario.email) {
        // Simula notificação silenciosa
        console.log(`🔔 Notificação quântica enviada para ${usuario.email}: "${intento}" foi programado para ${retrocausal.eventoFuturo.data_realizacao}`);
      }
    }

    return { 
      sucesso: true, 
      codigo, 
      imagem: filename, 
      retrocausal: retrocausal.pontoDeAtrator,
      mensagem: "Sua assinatura quântica foi injetada no campo informacional. A realidade já começou a se mover."
    };
  }
}

window.quantumEngine = new QuantumRealityEngine();