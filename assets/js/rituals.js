// ===== FREQUÊNCIAS SOLFEGGIO =====
const FREQUENCIAS_SOLFEGGIO = {
  UT: 396, RE: 417, MI: 528, FA: 639, SOL: 741, LA: 852,
  SI: 963, OM: 432, GAIA: 174, ALFA: 8, TETA: 4, DELTA: 1.5
};

const FREQUENCIA_CORES = {
  174: [128, 0, 128], 285: [0, 0, 255], 396: [0, 128, 128],
  417: [0, 128, 0], 528: [255, 215, 0], 639: [255, 165, 0],
  741: [255, 0, 0], 852: [255, 0, 255], 963: [75, 0, 130]
};

function frequenciaParaCor(frequencia) {
  const rgb = FREQUENCIA_CORES[frequencia] || [255, 255, 255];
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`;
}

// ===== FASE LUNAR (Conway) =====
function calcularFaseLunar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  let r = year % 100;
  r %= 19;
  if (r > 9) r -= 19;
  r = ((r * 11) % 30) + month + day;
  if (month < 3) r += 2;
  let fase = (r + 8) % 30;
  fase = (fase / 30.0) * 360;
  if (fase < 0) fase += 360;

  return fase;
}

function obterNomeFaseLunar(graus) {
  if (graus < 45) return "Lua Nova";
  if (graus < 90) return "Lua Crescente";
  if (graus < 135) return "Quarto Crescente";
  if (graus < 180) return "Lua Gibosa Crescente";
  if (graus < 225) return "Lua Cheia";
  if (graus < 270) return "Lua Gibosa Minguante";
  if (graus < 315) return "Quarto Minguante";
  return "Lua Minguante";
}

// ===== NUMEROLOGIA CABALÍSTICA =====
function calcularNumeroDestinoAvancado(nome, data) {
  const nomeVal = [...nome.toLowerCase()].reduce((acc, c) => acc + (c >= 'a' && c <= 'z' ? c.charCodeAt(0) - 96 : 0), 0);
  let dia, mes, ano;
  try { [dia, mes, ano] = data.split('/').map(Number); } catch { [dia, mes, ano] = [0, 0, 0]; }
  const dataVal = dia + mes + ano;
  let total = (nomeVal * dataVal) % 108;
  while (total > 9) total = total.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  return total || 9;
}

function analisarNomeCabalistica(nome) {
  const vogais = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const consoantes = {
    b: 2, c: 3, d: 4, f: 8, g: 3, h: 5, j: 1, k: 2, l: 3, m: 4, n: 5, p: 8,
    q: 1, r: 2, s: 3, t: 4, v: 6, w: 6, x: 5, y: 1, z: 7
  };

  const numVogais = [...nome.toLowerCase()].filter(c => vogais[c]).reduce((s, c) => s + vogais[c], 0);
  const numConsoantes = [...nome.toLowerCase()].filter(c => consoantes[c]).reduce((s, c) => s + consoantes[c], 0);

  function reduzir(n) {
    while (n > 9) n = n.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    return n;
  }

  return {
    alma: reduzir(numVogais),
    personalidade: reduzir(numConsoantes),
    expressao: reduzir(numVogais + numConsoantes)
  };
}

// ===== ANÁLISE DE INTENÇÃO =====
function analisarIntento(texto) {
  const palavrasPoder = [
    'sou', 'tenho', 'recebo', 'manifesto', 'crio', 'realizo', 'atrair',
    'abundância', 'prosperidade', 'alegria', 'saúde', 'amor', 'sucesso',
    'harmonia', 'paz', 'gratidão', 'agora', 'já', 'presente', 'realidade',
    'concretizado'
  ];
  const palavrasLimitantes = [
    'não', 'nunca', 'jamais', 'impossível', 'difícil', 'problema',
    'dificuldade', 'quero', 'desejo', 'preciso', 'necessito', 'talvez',
    'tentarei', 'espero', 'dúvida', 'medo', 'preocupação', 'ansiedade'
  ];

  const palavras = texto.toLowerCase().split(/\W+/);
  const poder = palavras.filter(p => palavrasPoder.includes(p)).length;
  const limitantes = palavras.filter(p => palavrasLimitantes.includes(p)).length;
  const presente = palavras.some(p => ['sou', 'estou', 'tenho', 'recebo'].includes(p));
  const futuro = palavras.some(p => ['serei', 'estarei', 'terei', 'receberei'].includes(p));

  let pontuacao = 50;
  const totalPalavras = palavras.length;
  if (totalPalavras > 0) {
    pontuacao += (poder / totalPalavras) * 30;
    pontuacao -= (limitantes / totalPalavras) * 40;
  }
  if (presente) pontuacao += 20;
  if (futuro) pontuacao -= 15;

  pontuacao = Math.max(0, Math.min(100, pontuacao));

  const sugestoes = [];
  if (limitantes > 0) sugestoes.push("Evite palavras negativas ou limitantes.");
  if (futuro && !presente) sugestoes.push("Use o tempo presente em vez do futuro.");
  if (poder < totalPalavras * 0.2) sugestoes.push("Adicione mais palavras de poder e afirmação positiva.");
  if (totalPalavras < 5) sugestoes.push("Elabore mais sua intenção com detalhes específicos.");

  return { pontuacao, poder, limitantes, presente, sugestoes };
}

// ===== CÓDIGO QUÂNTICO =====
function gerarCodigoQuantico(intento, nome, data) {
  const seed = intento + nome + data + calcularFaseLunar();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash) % 1000000000000;
  const str = hash.toString().padStart(12, '0');
  return `${str.slice(0,4)}-${str.slice(4,8)}-${str.slice(8,12)}`;
}

// ===== CAMPOS TOROIDAIS E PHI =====
function campoToroidal(x, y, t, scale = 0.1) {
  const r = Math.sqrt(x*x + y*y);
  const theta = Math.atan2(y, x);
  return Math.sin(7*(theta - t/20)) * Math.cos(3*r - t/10) * scale;
}

function campoPhi(x, y, t, phi = 1.618033988749895) {
  const r = Math.sqrt(x*x + y*y) * phi;
  const theta = Math.atan2(y, x) * phi;
  return Math.sin(theta * phi + t/10) * Math.exp(-r/phi);
}

// ===== FLOR DA VIDA =====
function desenharFlorDaVida(radius = 1, circles = 7) {
  const pontos = [{x: 0, y: 0}];
  for (let i = 0; i < 6; i++) {
    const angle = (2 * Math.PI * i) / 6;
    pontos.push({x: radius * Math.cos(angle), y: radius * Math.sin(angle)});
  }
  if (circles > 7) {
    for (let i = 0; i < 6; i++) {
      const a1 = (2 * Math.PI * i) / 6;
      const a2 = (2 * Math.PI * (i+1)) / 6;
      const x1 = radius * Math.cos(a1), y1 = radius * Math.sin(a1);
      const x2 = radius * Math.cos(a2), y2 = radius * Math.sin(a2);
      pontos.push({x: (x1+x2)/2, y: (y1+y2)/2});
    }
  }
  if (circles > 13) {
    const scale = 1.5;
    for (let i = 0; i < 12; i++) {
      const angle = (2 * Math.PI * i) / 12;
      pontos.push({x: scale * radius * Math.cos(angle), y: scale * radius * Math.sin(angle)});
    }
  }
  return pontos;
}

// ===== MERKABA =====
function desenharMerkaba(scale = 1.0) {
  const pontos = [];
  pontos.push({x: 0, y: scale, z: 0});
  for (let i = 0; i < 3; i++) {
    const angle = (2 * Math.PI * i) / 3;
    pontos.push({
      x: scale * Math.cos(angle),
      y: -scale/3,
      z: scale * Math.sin(angle)
    });
  }
  pontos.push({x: 0, y: -scale, z: 0});
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI + (2 * Math.PI * i) / 3);
    pontos.push({
      x: scale * Math.cos(angle),
      y: scale/3,
      z: scale * Math.sin(angle)
    });
  }
  return pontos;
}

// ===== CORRESPONDÊNCIAS HERMÉTICAS =====
const CORRESPONDENCIAS_HERMETICAS = {
  1: { elemento: 'Fogo', planeta: 'Sol', pedra: 'Rubi, Diamante', metal: 'Ouro', erva: 'Alecrim, Girassol', chakra: 'Plexo Solar', arquetipo: 'Mago' },
  2: { elemento: 'Água', planeta: 'Lua', pedra: 'Pérola, Selenite', metal: 'Prata', erva: 'Jasmim, Lótus', chakra: 'Sacral', arquetipo: 'Sacerdotisa' },
  3: { elemento: 'Ar', planeta: 'Júpiter', pedra: 'Safira, Turquesa', metal: 'Estanho', erva: 'Sálvia, Menta', chakra: 'Garganta', arquetipo: 'Imperatriz' },
  4: { elemento: 'Terra', planeta: 'Saturno', pedra: 'Jade, Esmeralda', metal: 'Chumbo', erva: 'Cipreste, Pinheiro', chakra: 'Raiz', arquetipo: 'Imperador' },
  5: { elemento: 'Fogo', planeta: 'Mercúrio', pedra: 'Ágata, Citrino', metal: 'Mercúrio', erva: 'Lavanda, Hortelã', chakra: 'Plexo Solar', arquetipo: 'Hierofante' },
  6: { elemento: 'Ar', planeta: 'Vênus', pedra: 'Esmeralda, Quartzo Rosa', metal: 'Cobre', erva: 'Rosa, Verbena', chakra: 'Cardíaco', arquetipo: 'Amantes' },
  7: { elemento: 'Água', planeta: 'Netuno', pedra: 'Ametista, Fluorita', metal: 'Estanho', erva: 'Valeriana, Lótus', chakra: 'Terceiro Olho', arquetipo: 'Carro' },
  8: { elemento: 'Terra', planeta: 'Saturno', pedra: 'Obsidiana, Ônix', metal: 'Chumbo', erva: 'Mirra, Cedro', chakra: 'Raiz', arquetipo: 'Justiça' },
  9: { elemento: 'Fogo', planeta: 'Marte', pedra: 'Granada, Rubi', metal: 'Ferro', erva: 'Gengibre, Pimenta', chakra: 'Coronário', arquetipo: 'Eremita' }
};

function obterCorrespondencias(numeroDestino) {
  return CORRESPONDENCIAS_HERMETICAS[numeroDestino] || CORRESPONDENCIAS_HERMETICAS[9];
}

// ===== ONDAS CEREBRAIS (FFT) =====
function gerarOndasCerebrais(tipo = 'alpha', duracao = 5, fs = 100) {
  const freqMap = { delta: [0.5, 4], theta: [4, 8], alpha: [8, 13], beta: [13, 30], gamma: [30, 100] };
  const [fmin, fmax] = freqMap[tipo] || freqMap.alpha;

  const t = Array.from({length: fs * duracao}, (_, i) => i / fs);
  let signal = new Array(fs * duracao).fill(0);

  for (let i = 0; i < 5; i++) {
    const freq = fmin + Math.random() * (fmax - fmin);
    const amp = 0.8 + Math.random() * 0.2;
    const phase = Math.random() * 2 * Math.PI;
    for (let j = 0; j < t.length; j++) {
      signal[j] += amp * Math.sin(2 * Math.PI * freq * t[j] + phase);
    }
  }

  const max = Math.max(...signal.map(Math.abs));
  signal = signal.map(x => x / max);
  return { signal, t };
}

// ===== TRANSFORMADA WAVELET (APROXIMADA) =====
function aplicarTransformadaWavelet(signal) {
  // Simulação simplificada — usa FFT como proxy
  const fftSize = 512;
  const window = new Float32Array(fftSize);
  for (let i = 0; i < fftSize; i++) {
    window[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (fftSize - 1));
  }
  const result = [];
  for (let i = 0; i < signal.length - fftSize; i += fftSize/2) {
    const slice = signal.slice(i, i + fftSize).map((v, j) => v * window[j]);
    const energy = slice.reduce((sum, v) => sum + v*v, 0);
    result.push(energy);
  }
  return result;
}

// ===== PADRÃO HOLOGRÁFICO =====
async function gerarPadraoHolografico(intento, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(intento));
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  for (let i = 0; i < size; i += 10) {
    for (let j = 0; j < size; j += 10) {
      const idx = (i * size + j) * 4;
      const patternVal = hashArray[(i+j) % hashArray.length] % 256;
      data[idx] = patternVal;
      data[idx + 1] = (patternVal + 85) % 256;
      data[idx + 2] = (patternVal + 170) % 256;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

// ===== CRIAÇÃO DO CÍRCULO DE MANIFESTAÇÃO =====
async function criarCirculoManifestacao({
  intento,
  nome,
  data,
  imagemTestemunho,
  graficoRadiônico,
  frequencia,
  modo
}) {
  const circleSize = 800;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = circleSize;
  const ctx = canvas.getContext('2d');

  // Camada 1: Fundo Holográfico
  const hologramUrl = await gerarPadraoHolografico(intento, circleSize);
  const imgHolo = new Image();
  imgHolo.src = hologramUrl;
  await new Promise((r) => imgHolo.onload = r);
  ctx.drawImage(imgHolo, 0, 0, circleSize, circleSize);
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#ff00ff';
  ctx.fillRect(0, 0, circleSize, circleSize);
  ctx.globalAlpha = 1;

  // Camada 2: Gráfico Radiônico ou Visualização Quântica
  if (graficoRadiônico) {
    const img = new Image();
    img.src = URL.createObjectURL(graficoRadiônico);
    await new Promise((r) => img.onload = r);
    ctx.drawImage(img, 200, 100, 400, 400);
  } else {
    const waveletData = aplicarTransformadaWavelet(gerarOndasCerebrais('gamma').signal);
    ctx.fillStyle = '#0ff';
    for (let i = 0; i < 10; i++) {
      const x = 200 + i * 40;
      const y = 150 + (waveletData[i % waveletData.length] * 20);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Camada 3: Testemunho (foto)
  if (imagemTestemunho) {
    const img = new Image();
    img.src = URL.createObjectURL(imagemTestemunho);
    await new Promise((r) => img.onload = r);
    const mask = document.createElement('canvas');
    mask.width = mask.height = 200;
    const maskCtx = mask.getContext('2d');
    maskCtx.beginPath();
    maskCtx.arc(100, 100, 100, 0, Math.PI*2);
    maskCtx.clip();
    maskCtx.drawImage(img, 0, 0, 200, 200);
    ctx.drawImage(mask, 300, 450);
  }

  // Camada 4: Texto e Símbolos
  ctx.font = '24px DejaVu Sans';
  ctx.fillStyle = '#ff0';
  ctx.fillText("CÍRCULO DE MANIFESTAÇÃO QUÂNTICA", 50, 30);
  ctx.font = '16px DejaVu Sans';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Intento: ${intento.substring(0, 80)}${intento.length > 80 ? '...' : ''}`, 50, 70);
  ctx.fillText(`Testemunho: ${nome}`, 300, 670);

  // QR Code
  const qrCode = await gerarQRCode({
    intento,
    nome,
    data,
    codigo: gerarCodigoQuantico(intento, nome, data),
    faseLunar: calcularFaseLunar(),
    frequencia,
    modo
  });
  ctx.drawImage(qrCode, 50, 620, 150, 150);

  // Data e assinatura
  ctx.fillText(new Date().toLocaleString(), 500, 750);
  ctx.fillStyle = '#0ff';
  ctx.fillText("✧ Tecnomagia Quântica ✧", 600, 770);

  // Símbolos mágicos ao redor
  const simbolos = {
    manifestacao: ['★','☀','♾️','⚡','🔮','✨','👁️','⚛️'],
    cura: ['☤','🌿','✚','🧿','🌙','⚕️','♡','🔆'],
    protecao: ['🛡️','✝️','☂','🔯','⚔️','🧿','🔒','⚡'],
    abundancia: ['💰','💎','⚜️','🌾','$','💫','♾️','🔅'],
    amor: ['❤️','💖','🔥','✨','🌹','💞','♾️','🧿'],
    intuicao: ['👁️','☽','🔮','✨','💫','⚛️','🧠','👁️‍🗨️']
  };
  const symbols = simbolos[modo] || simbolos.manifestacao;
  for (let i = 0; i < 8; i++) {
    const angulo = (2 * Math.PI * i) / 8;
    const x = circleSize/2 + 300 * Math.cos(angulo);
    const y = circleSize/2 + 300 * Math.sin(angulo);
    ctx.font = '28px DejaVu Sans';
    ctx.fillText(symbols[i], x, y);
  }

  return canvas.toDataURL('image/png');
}

// ===== GERADOR DE ÁUDIO QUÂNTICO =====
function gerarAudioNeuroEntrainment(schumann = 7.83, userFocus = 0.5, duration = 10) {
  const sampleRate = 44100;
  const t = Array.from({length: sampleRate * duration}, (_, i) => i / sampleRate);
  const theta = 0.5 * Math.sin(2 * Math.PI * schumann * t);
  const gamma = 0.3 * Math.sin(2 * Math.PI * (40 + 0.1 * userFocus) * t);
  const binaural = theta + gamma;

  const audioBuffer = new AudioContext().createBuffer(1, sampleRate * duration, sampleRate);
  const channel = audioBuffer.getChannelData(0);
  for (let i = 0; i < binaural.length; i++) {
    channel[i] = binaural[i] * 0.7;
  }

  return audioBuffer;
}

function toWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2;

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  const samples = new Float32Array(audioBuffer.getLength());
  for (let c = 0; c < numChannels; c++) {
    const channel = audioBuffer.getChannelData(c);
    for (let i = 0; i < channel.length; i++) {
      samples[i * numChannels + c] = channel[i];
    }
  }

  const int16Samples = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    int16Samples[i] = Math.min(1, Math.max(-1, samples[i])) * 0x7FFF;
  }

  const wav = new Uint8Array(wavHeader.byteLength + int16Samples.byteLength);
  wav.set(new Uint8Array(wavHeader), 0);
  wav.set(new Uint8Array(int16Samples.buffer), 44);

  return new Blob([wav], { type: 'audio/wav' });
}

// ===== GERADOR DE QR CODE =====
async function gerarQRCode(dados) {
  const qr = new QRCode(document.createElement('div'), {
    width: 150,
    height: 150,
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H
  });

  qr.makeCode(JSON.stringify(dados, null, 2));

  const canvas = qr.getCanvas();
  return canvas;
}

// ===== FUNÇÕES AUXILIARES =====
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}