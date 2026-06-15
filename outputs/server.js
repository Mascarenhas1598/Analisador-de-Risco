const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = Number(process.env.PORT || 4180);
const HOST = process.env.HOST || '0.0.0.0';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '';
const APP_USERNAME = process.env.APP_USERNAME || '';
const APP_PASSWORD = process.env.APP_PASSWORD || '';
const PUBLIC_DIR = __dirname;

const RIVALIDADES_CONHECIDAS = new Map([
  ['bahia|vitoria', { score: 0.88, nome: 'Ba-Vi' }],
  ['bahia|sport', { score: 0.64, nome: 'Superclassico do Nordeste' }],
  ['bahia|ceara', { score: 0.52, nome: 'confronto regional nordestino' }],
  ['bahia|fortaleza', { score: 0.5, nome: 'confronto regional nordestino' }],
  ['bahia|nautico', { score: 0.46, nome: 'confronto regional nordestino' }],
  ['bahia|santa cruz', { score: 0.44, nome: 'confronto regional nordestino' }],
  ['flamengo|fluminense', { score: 0.74, nome: 'Fla-Flu' }],
  ['flamengo|vasco', { score: 0.72, nome: 'Classico dos Milhoes' }],
  ['corinthians|palmeiras', { score: 0.78, nome: 'Derby Paulista' }],
  ['gremio|internacional', { score: 0.8, nome: 'Grenal' }],
  ['atletico mineiro|cruzeiro', { score: 0.76, nome: 'Classico Mineiro' }],
  ['santa cruz|sport', { score: 0.74, nome: 'Classico das Multidoes' }]
]);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'POST' && request.url === '/api/login') {
      await handleLogin(request, response);
      return;
    }

    if (request.method === 'POST' && request.url === '/api/historico-equipes') {
      await handleHistoricoEquipes(request, response);
      return;
    }

    if (request.method === 'POST' && request.url === '/api/previsao-tempo') {
      await handlePrevisaoTempo(request, response);
      return;
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
      await serveStatic(request, response);
      return;
    }

    sendJSON(response, 405, { error: 'Metodo nao permitido.' });
  } catch (error) {
    console.error(error);
    sendJSON(response, 500, { error: 'Erro interno no servidor.' });
  }
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Analisador de Risco em http://${displayHost}:${PORT}/index.html`);
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    console.log('Google nao configurado. Defina GOOGLE_API_KEY e GOOGLE_CSE_ID para pesquisa real.');
  }
  if (!APP_USERNAME || !APP_PASSWORD) {
    console.log('Login local nao configurado. Defina APP_USERNAME e APP_PASSWORD.');
  }
});

async function handleLogin(request, response) {
  const body = await readJSON(request);
  const username = String(body.username || '');
  const password = String(body.password || '');

  if (!APP_USERNAME || !APP_PASSWORD) {
    sendJSON(response, 503, { error: 'Login local nao configurado.' });
    return;
  }

  if (username !== APP_USERNAME || password !== APP_PASSWORD) {
    sendJSON(response, 401, { error: 'Credenciais invalidas.' });
    return;
  }

  sendJSON(response, 200, {
    token: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mode: 'local'
  });
}

async function handleHistoricoEquipes(request, response) {
  const body = await readJSON(request);
  const equipes = String(body.equipes || '').trim();

  if (equipes.length < 5) {
    sendJSON(response, 400, { error: 'Informe as equipes envolvidas.' });
    return;
  }

  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    sendJSON(response, 200, criarHistoricoLocal(equipes, 'local-sem-google'));
    return;
  }

  const query = `${equipes} historico confrontos rivalidade incidentes torcida seguranca estadio`;
  const searchURL = new URL('https://www.googleapis.com/customsearch/v1');
  searchURL.searchParams.set('key', GOOGLE_API_KEY);
  searchURL.searchParams.set('cx', GOOGLE_CSE_ID);
  searchURL.searchParams.set('q', query);
  searchURL.searchParams.set('num', '5');
  searchURL.searchParams.set('lr', 'lang_pt');

  const googleResponse = await fetch(searchURL);

  if (!googleResponse.ok) {
    const fallback = criarHistoricoLocal(equipes, 'local-fallback-google');
    fallback.resumo = `${fallback.resumo} A consulta ao Google falhou com status ${googleResponse.status}.`;
    sendJSON(response, 200, fallback);
    return;
  }

  const data = await googleResponse.json();
  const items = Array.isArray(data.items) ? data.items : [];
  const local = criarHistoricoLocal(equipes, 'google-custom-search');
  const incidentSignals = contarSinais(items, [
    'incidente',
    'conflito',
    'briga',
    'confusao',
    'violencia',
    'torcida',
    'seguranca',
    'classico',
    'rivalidade'
  ]);
  const score = Math.min(local.score + Math.min(incidentSignals * 0.04, 0.18), 1);

  sendJSON(response, 200, {
    score,
    origem: 'google-custom-search',
    resumo: `Google Custom Search retornou ${items.length} resultado(s). Score combina rivalidade local e sinais encontrados nos titulos/resumos.`,
    links: items.map((item) => ({
      label: item.title || item.displayLink || 'Resultado',
      url: item.link
    })).filter((item) => item.url)
  });
}

async function handlePrevisaoTempo(request, response) {
  const body = await readJSON(request);
  const localEvento = String(body.localEvento || '').trim();
  const dataJogo = String(body.dataJogo || '').trim();

  if (!localEvento || !dataJogo) {
    sendJSON(response, 400, { error: 'Informe local do evento e data do jogo.' });
    return;
  }

  const local = resolverCoordenadasEvento(localEvento);
  const url = montarURLMeteorologia(local, dataJogo);

  try {
    const meteoResponse = await fetch(url);

    if (!meteoResponse.ok) {
      sendJSON(response, 200, criarPrevisaoMeteorologicaLocal(local, dataJogo, `open-meteo-status-${meteoResponse.status}`));
      return;
    }

    const data = await meteoResponse.json();
    const daily = data.daily || {};
    const index = Array.isArray(daily.time) ? daily.time.indexOf(dataJogo) : -1;

    if (index < 0) {
      sendJSON(response, 200, criarPrevisaoMeteorologicaLocal(local, dataJogo, 'data-fora-da-janela-open-meteo'));
      return;
    }

    const meteo = classificarMeteorologia({
      chuva: Number(daily.precipitation_sum?.[index] || 0),
      vento: Number(daily.wind_speed_10m_max?.[index] || 0),
      codigo: Number(daily.weather_code?.[index] || 0),
      tempMax: Number(daily.temperature_2m_max?.[index] || 0),
      tempMin: Number(daily.temperature_2m_min?.[index] || 0)
    });

    sendJSON(response, 200, {
      ...meteo,
      local: local.nome,
      data: dataJogo,
      coordenadas: {
        latitude: local.latitude,
        longitude: local.longitude
      },
      origem: 'open-meteo'
    });
  } catch (error) {
    console.error('Falha na previsao meteorologica externa:', error);
    sendJSON(response, 200, criarPrevisaoMeteorologicaLocal(local, dataJogo, 'falha-conexao-open-meteo'));
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(response, 403, 'Acesso negado.');
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });

    if (request.method !== 'HEAD') {
      response.end(content);
    } else {
      response.end();
    }
  } catch (error) {
    sendText(response, 404, 'Arquivo nao encontrado.');
  }
}

async function readJSON(request) {
  let raw = '';

  for await (const chunk of request) {
    raw += chunk;

    if (raw.length > 1_000_000) {
      throw new Error('Payload muito grande.');
    }
  }

  return raw ? JSON.parse(raw) : {};
}

function criarHistoricoLocal(query, origem) {
  const equipes = separarEquipes(query);
  const estimativa = estimarHistoricoLocal(equipes, query);
  const pesquisaBase = encodeURIComponent(`${query} historico confrontos rivalidade incidentes torcida`);

  return {
    score: estimativa.score,
    origem,
    resumo: estimativa.resumo,
    links: [
      { label: 'Historico de confrontos', url: `https://www.google.com/search?q=${pesquisaBase}` },
      { label: 'Noticias recentes', url: `https://www.google.com/search?tbm=nws&q=${pesquisaBase}` },
      { label: 'Incidentes de torcida', url: `https://www.google.com/search?q=${encodeURIComponent(`${query} incidentes torcida seguranca estadio`)}` }
    ]
  };
}

function estimarHistoricoLocal(equipes, query) {
  if (equipes.length < 2) {
    return {
      score: 0,
      resumo: 'Informe duas equipes para calcular historico entre times. Com apenas uma equipe, o score historico fica zerado.'
    };
  }

  const rivalidade = RIVALIDADES_CONHECIDAS.get(criarChaveEquipes(equipes));

  if (rivalidade) {
    return {
      score: rivalidade.score,
      resumo: `Estimativa local identificou ${rivalidade.nome} entre ${equipes.join(' x ')}.`
    };
  }

  const texto = normalizarTexto(query);
  const temTermoDeRivalidade = /\b(classico|rival|derby|decisivo|final)\b/.test(texto);
  const equipesNormalizadas = equipes.map(normalizarNomeEquipe);
  const envolveBahia = equipesNormalizadas.includes('bahia');
  const temClubeRegional = equipesNormalizadas.some((equipe) =>
    ['vitoria', 'sport', 'ceara', 'fortaleza', 'nautico', 'santa cruz', 'crb', 'csa'].includes(equipe)
  );
  const temGrandeNacional = equipesNormalizadas.some((equipe) =>
    ['flamengo', 'fluminense', 'vasco', 'botafogo', 'corinthians', 'palmeiras', 'sao paulo', 'santos', 'gremio', 'internacional', 'cruzeiro', 'atletico mineiro'].includes(equipe)
  );
  let score = 0.24;

  if (envolveBahia && temClubeRegional) {
    score = 0.42;
  } else if (envolveBahia && temGrandeNacional) {
    score = 0.38;
  } else if (temClubeRegional) {
    score = 0.36;
  } else if (temGrandeNacional) {
    score = 0.34;
  }

  if (temTermoDeRivalidade) {
    score = Math.min(score + 0.16, 0.62);
  }

  return {
    score,
    resumo: temTermoDeRivalidade
      ? `Termos de rivalidade foram detectados em ${equipes.join(' x ')}.`
      : `Foram identificadas ${equipes.join(' x ')} para pesquisa assistida, mas sem rivalidade local cadastrada.`
  };
}

function contarSinais(items, sinais) {
  const texto = normalizarTexto(items.map((item) => `${item.title || ''} ${item.snippet || ''}`).join(' '));
  return sinais.reduce((total, sinal) => total + (texto.includes(sinal) ? 1 : 0), 0);
}

function separarEquipes(query) {
  return query
    .split(/\s+(?:x|vs|versus|contra)\s+|[,;/]/i)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function criarChaveEquipes(equipes) {
  return equipes.map(normalizarNomeEquipe).sort().join('|');
}

function normalizarNomeEquipe(value) {
  const texto = normalizarTexto(value);

  if (texto.includes('vitoria')) return 'vitoria';
  if (texto.includes('bahia')) return 'bahia';
  if (texto.includes('flamengo')) return 'flamengo';
  if (texto.includes('fluminense')) return 'fluminense';
  if (texto.includes('vasco')) return 'vasco';
  if (texto.includes('botafogo')) return 'botafogo';
  if (texto.includes('corinthians')) return 'corinthians';
  if (texto.includes('palmeiras')) return 'palmeiras';
  if (texto.includes('sao paulo')) return 'sao paulo';
  if (texto.includes('santos')) return 'santos';
  if (texto.includes('gremio')) return 'gremio';
  if (texto.includes('internacional')) return 'internacional';
  if (texto.includes('atletico') && texto.includes('mineiro')) return 'atletico mineiro';
  if (texto.includes('cruzeiro')) return 'cruzeiro';
  if (texto.includes('santa cruz')) return 'santa cruz';
  if (texto.includes('sport')) return 'sport';
  if (texto.includes('ceara')) return 'ceara';
  if (texto.includes('fortaleza')) return 'fortaleza';
  if (texto.includes('nautico')) return 'nautico';
  if (texto.includes('crb')) return 'crb';
  if (texto.includes('csa')) return 'csa';

  return texto;
}

function normalizarTexto(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolverCoordenadasEvento(localEvento) {
  const texto = normalizarTexto(localEvento);

  if (texto.includes('barradao') || texto.includes('manoel barradas')) {
    return {
      nome: 'Estadio Manoel Barradas - Barradao',
      latitude: -12.9192,
      longitude: -38.4286
    };
  }

  if (texto.includes('pituacu')) {
    return {
      nome: 'Estadio de Pituacu',
      latitude: -12.9454,
      longitude: -38.4142
    };
  }

  if (texto.includes('arena') || texto.includes('fonte nova')) {
    return {
      nome: 'Arena Fonte Nova',
      latitude: -12.9788,
      longitude: -38.5044
    };
  }

  return {
    nome: 'Salvador - BA',
    latitude: -12.9777,
    longitude: -38.5016
  };
}

function montarURLMeteorologia(local, dataJogo) {
  const today = new Date().toISOString().slice(0, 10);
  const baseURL = dataJogo < today
    ? 'https://archive-api.open-meteo.com/v1/archive'
    : 'https://api.open-meteo.com/v1/forecast';
  const url = new URL(baseURL);

  url.searchParams.set('latitude', String(local.latitude));
  url.searchParams.set('longitude', String(local.longitude));
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max');
  url.searchParams.set('timezone', 'America/Bahia');
  url.searchParams.set('start_date', dataJogo);
  url.searchParams.set('end_date', dataJogo);

  return url;
}

function classificarMeteorologia({ chuva, vento, codigo, tempMax, tempMin }) {
  const temporal = [95, 96, 99].includes(codigo);
  const chuvaForte = chuva >= 25 || [65, 67, 75, 82, 86].includes(codigo);
  const chuvaModerada = chuva >= 8 || [61, 63, 66, 80, 81].includes(codigo);
  const instavel = chuva > 0 || vento >= 28 || [45, 48, 51, 53, 55, 56, 57].includes(codigo);
  let categoria = 'favoravel';

  if (temporal || chuvaForte || vento >= 45) {
    categoria = 'severa';
  } else if (chuvaModerada) {
    categoria = 'chuva';
  } else if (instavel) {
    categoria = 'instavel';
  }

  return {
    categoria,
    resumo: `Previsao: ${formatarCategoriaMeteorologica(categoria)}. Chuva ${chuva.toFixed(1)} mm, vento maximo ${vento.toFixed(0)} km/h, temperatura ${tempMin.toFixed(0)}-${tempMax.toFixed(0)} C.`,
    indicadores: {
      chuva,
      vento,
      codigo,
      tempMax,
      tempMin
    }
  };
}

function criarPrevisaoMeteorologicaLocal(local, dataJogo, motivo) {
  const mes = Number(String(dataJogo).slice(5, 7));
  const perfil = obterPerfilClimaticoSalvador(mes);
  const meteo = classificarMeteorologia({
    chuva: perfil.chuva,
    vento: perfil.vento,
    codigo: perfil.codigo,
    tempMax: perfil.tempMax,
    tempMin: perfil.tempMin
  });

  return {
    ...meteo,
    resumo: `Estimativa meteorologica local: ${formatarCategoriaMeteorologica(meteo.categoria)}. ${perfil.descricao} Chuva estimada ${perfil.chuva.toFixed(1)} mm, vento ${perfil.vento.toFixed(0)} km/h, temperatura ${perfil.tempMin.toFixed(0)}-${perfil.tempMax.toFixed(0)} C.`,
    local: local.nome,
    data: dataJogo,
    coordenadas: {
      latitude: local.latitude,
      longitude: local.longitude
    },
    origem: 'estimativa-local',
    motivo
  };
}

function obterPerfilClimaticoSalvador(mes) {
  const perfis = {
    1: { chuva: 2.5, vento: 21, codigo: 3, tempMin: 25, tempMax: 30, descricao: 'Periodo quente com pancadas isoladas em Salvador.' },
    2: { chuva: 2.8, vento: 20, codigo: 3, tempMin: 25, tempMax: 30, descricao: 'Periodo quente com possibilidade de instabilidade pontual.' },
    3: { chuva: 4.5, vento: 19, codigo: 51, tempMin: 25, tempMax: 30, descricao: 'Transicao para periodo mais umido, com atencao a chuva localizada.' },
    4: { chuva: 8.5, vento: 18, codigo: 61, tempMin: 24, tempMax: 29, descricao: 'Mes historicamente umido, com maior probabilidade de chuva.' },
    5: { chuva: 12, vento: 19, codigo: 63, tempMin: 23, tempMax: 28, descricao: 'Periodo chuvoso em Salvador, exigindo plano para filas e areas abertas.' },
    6: { chuva: 10, vento: 21, codigo: 61, tempMin: 23, tempMax: 27, descricao: 'Periodo chuvoso, com risco de instabilidade em acessos e circulacao externa.' },
    7: { chuva: 9, vento: 23, codigo: 61, tempMin: 22, tempMax: 27, descricao: 'Periodo ainda umido, com vento costeiro e possibilidade de chuva.' },
    8: { chuva: 6, vento: 24, codigo: 51, tempMin: 22, tempMax: 27, descricao: 'Condicao de transicao, com instabilidade moderada e vento costeiro.' },
    9: { chuva: 4, vento: 24, codigo: 3, tempMin: 23, tempMax: 28, descricao: 'Condicao geralmente controlavel, com vento costeiro.' },
    10: { chuva: 3.5, vento: 23, codigo: 3, tempMin: 24, tempMax: 29, descricao: 'Condicao geralmente favoravel, com pancadas isoladas possiveis.' },
    11: { chuva: 3, vento: 22, codigo: 3, tempMin: 24, tempMax: 30, descricao: 'Condicao quente e em geral favoravel, com atencao a calor e hidratacao.' },
    12: { chuva: 2.8, vento: 22, codigo: 3, tempMin: 25, tempMax: 30, descricao: 'Condicao quente e em geral favoravel, com atencao a calor e hidratacao.' }
  };

  return perfis[mes] || perfis[6];
}

function formatarCategoriaMeteorologica(categoria) {
  const labels = {
    favoravel: 'favoravel',
    instavel: 'instavel',
    chuva: 'chuva',
    severa: 'severa'
  };

  return labels[categoria] || categoria;
}

function sendJSON(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(data));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(text);
}
