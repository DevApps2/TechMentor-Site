// O formulário "Seja nosso parceiro": confere o básico, manda o pedido para a API e mostra o resultado.
// Quem decide o que é válido é a API; as conferências daqui só dão resposta imediata.
(function () {
  'use strict'

  var cfg = window.TECHMENTOR || {}
  var form = document.getElementById('form-pedido')
  if (!form) return

  var botao = document.getElementById('botao-enviar')
  var erroGeral = document.getElementById('erro-geral')
  var pronto = document.getElementById('pronto')

  // Endereço do portal e e-mail da equipe vêm do config.js
  var portal = document.getElementById('link-portal')
  if (portal && cfg.PORTAL_URL) portal.href = cfg.PORTAL_URL.replace(/\/+$/, '') + '/entrar'
  if (cfg.EMAIL) {
    document.querySelectorAll('[data-email]').forEach(function (a) {
      a.href = 'mailto:' + cfg.EMAIL
      a.textContent = cfg.EMAIL
    })
  }

  // CNPJ é obrigatório só para empresa
  var tipo = form.elements.tipo
  var documento = form.elements.documento
  tipo.addEventListener('change', function () {
    var empresa = tipo.value === 'EMPRESA'
    documento.required = empresa
    document.getElementById('dica-cnpj').textContent = empresa ? '(obrigatório)' : '(opcional)'
  })

  // Contador de caracteres da mensagem
  var mensagem = form.elements.mensagem
  var contador = document.getElementById('contador')
  mensagem.addEventListener('input', function () { contador.textContent = mensagem.value.length })

  function limparErros() {
    erroGeral.hidden = true
    erroGeral.textContent = ''
    form.querySelectorAll('[data-erro]').forEach(function (el) { el.textContent = '' })
  }

  function mostrarErroDoCampo(campo, texto) {
    var alvo = form.querySelector('[data-erro="' + campo + '"]')
    if (alvo) alvo.textContent = texto
    else erroGeral.textContent = (erroGeral.textContent ? erroGeral.textContent + ' ' : '') + texto
  }

  function mostrarErroGeral(texto) {
    erroGeral.textContent = texto
    erroGeral.hidden = false
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault()
    if (botao.disabled) return
    limparErros()

    var dados = {
      nome: form.elements.nome.value.trim(),
      tipo: tipo.value,
      documento: documento.value.trim() || null,
      site: form.elements.site.value.trim() || null,
      responsavel: form.elements.responsavel.value.trim(),
      email: form.elements.email.value.trim(),
      mensagem: mensagem.value.trim(),
      aceitaPrivacidade: form.elements.aceita.checked,
      versaoPolitica: cfg.VERSAO_POLITICA,
      website: form.elements.website.value,
    }

    // Conferências rápidas
    var temErro = false
    if (!dados.nome) { mostrarErroDoCampo('nome', 'Informe o nome da instituição.'); temErro = true }
    if (!dados.tipo) { mostrarErroDoCampo('tipo', 'Escolha o tipo.'); temErro = true }
    if (dados.tipo === 'EMPRESA' && !dados.documento) { mostrarErroDoCampo('documento', 'Empresa precisa informar o CNPJ.'); temErro = true }
    if (!dados.responsavel) { mostrarErroDoCampo('responsavel', 'Informe quem responde pela instituição.'); temErro = true }
    if (!dados.email || !form.elements.email.checkValidity()) { mostrarErroDoCampo('email', 'Informe um e-mail válido.'); temErro = true }
    if (dados.site && !form.elements.site.checkValidity()) { mostrarErroDoCampo('site', 'O site deve começar com http:// ou https://.'); temErro = true }
    if (dados.mensagem.length < 20) { mostrarErroDoCampo('mensagem', 'Conte um pouco mais: no mínimo 20 caracteres.'); temErro = true }
    if (!dados.aceitaPrivacidade) { mostrarErroGeral('Para enviar, aceite a política de privacidade.'); temErro = true }
    if (temErro) {
      var primeiro = form.querySelector('.erro-campo:not(:empty), #erro-geral:not([hidden])')
      if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    botao.disabled = true
    botao.textContent = 'Enviando...'

    fetch((cfg.API_URL || '').replace(/\/+$/, '') + '/parceiras/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
      body: JSON.stringify(dados),
    })
      .then(function (resposta) {
        return resposta.text().then(function (texto) {
          var corpo = null
          try { corpo = texto ? JSON.parse(texto) : null } catch (e) { corpo = null }
          return { ok: resposta.ok, status: resposta.status, corpo: corpo }
        })
      })
      .then(function (r) {
        if (r.ok) {
          document.getElementById('pronto-nome').textContent = dados.nome
          document.getElementById('pronto-email').textContent = dados.email
          form.hidden = true
          pronto.hidden = false
          pronto.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }

        // A API devolve { erro, codigo, campos }: campos tem a mensagem de cada campo
        var campos = (r.corpo && r.corpo.campos) || {}
        var mostrouPorCampo = false
        Object.keys(campos).forEach(function (campo) {
          mostrarErroDoCampo(campo, campos[campo])
          mostrouPorCampo = true
        })
        if (!mostrouPorCampo || r.status === 429) {
          mostrarErroGeral((r.corpo && r.corpo.erro) || 'Não foi possível enviar agora. Tente de novo em instantes.')
        }
      })
      .catch(function () {
        mostrarErroGeral('Não foi possível conectar ao servidor. Confira a sua internet e tente de novo, ou escreva para ' + (cfg.EMAIL || 'a equipe') + '.')
      })
      .then(function () {
        botao.disabled = false
        botao.textContent = 'Enviar pedido de parceria'
      })
  })
})()
