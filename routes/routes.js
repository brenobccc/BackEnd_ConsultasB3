module.exports = function (application) {
    application.get('/nomes_ativos', async (req, res) => {
            application.controllers.ativos.atv(req, res);
    });

    application.get('/lista_ativos', async (req, res) => {
        application.controllers.valores_ativos.valoresat(req, res);
    });
}