// Endereços que o site usa. É o único arquivo que você muda ao publicar.
//
// API_URL    -> a API do TechMentor, terminando em /techmentor/api (sem barra no fim).
//               Na internet precisa ser https (uma página https não chama uma API http).
// PORTAL_URL -> onde fica o portal das parceiras (o botão "Já sou parceira" leva para ele).
// EMAIL      -> contato da equipe, mostrado no rodapé e nas mensagens de erro.
window.TECHMENTOR = {
  API_URL: 'http://localhost:8080/techmentor/api',
  PORTAL_URL: 'http://localhost:5173',
  EMAIL: 'techmentor.apps@gmail.com',
  // Versão do texto de privacidade.html. Vai junto de cada pedido como prova do consentimento.
  // Quando mudar o texto da política, mude esta data também.
  VERSAO_POLITICA: '2026-11-18',
}
