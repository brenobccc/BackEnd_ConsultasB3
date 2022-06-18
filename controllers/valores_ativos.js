const fetch = require('node-fetch-commonjs');
const url = require('url');
var request = require('request');
const http = require('http');
//const url = require('url');
const queryString = require('query-string');
const fs = require('fs');
const express = require('express');
const res = require('express/lib/response');

module.exports.valoresat = async (req, res) => {

    //Formatação
    const urlParse = url.parse(req.url, true);
    const params = queryString.parse(urlParse.search);
    console.log(params);
    // apikey = "65Y4AT7GA8UR20L7"
    //novo code
    apikey = "GAGMIJ0YDG8LA7HM"
    //Requisição e consumo da API de cotação

    const data_inicial = params.data_inicial;
    const data_final = params.data_final;

    list = params.ativo.split(';');
    lista_objeto_response = []
    let dataMaior = 0;
    let listDatasGenericas = []



    if (list.length > 1) {
        for (let i = 0; i < list.length; i++) {
            var url_consulta = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${list[i]}&outputsize=full&apikey=${apikey}`;
            //console.log("valor:"+list[i])
            const response = await fetch(url_consulta)
            let app = {}
            app = await response.json();
            lista_dias_selecionados = []; datas_selecionadas = [];

            posFiltroObj = filtrarPorDiasEscolhidos(app["Time Series (Daily)"], data_inicial, data_final);
            lista_dias_selecionados = posFiltroObj.valores;
            datas_selecionadas = posFiltroObj.datas;

            if (datas_selecionadas.length != 0) {
                if (dataMaior < datas_selecionadas.length) {
                    dataMaior = datas_selecionadas.length;
                    listDatasGenericas = datas_selecionadas;
                }
                lista_objeto_response.push({ ativo: list[i], valores: lista_dias_selecionados });//Lista de objetos.
                // req.session.list = lista_objeto_response;
            }
        }
    }
    else if (list.length == 1) {
        var url_consulta = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${list[0]}&outputsize=full&apikey=${apikey}`;

        const response = await fetch(url_consulta)
        let app = {}
        app = await response.json()

        lista_dias_selecionados = [];
        datas_selecionadas = [];
        posFiltroObj = filtrarPorDiasEscolhidos(app["Time Series (Daily)"], data_inicial, data_final);
        lista_dias_selecionados = posFiltroObj.valores;
        listDatasGenericas = posFiltroObj.datas;
        //Lista de objetos.//{ ativo: list[i], valores: lista_dias_selecionados }

        lista_objeto_response.push({ ativo: list[0], valores: lista_dias_selecionados });
        // res.end(JSON.stringify({list_datas_genericas: listDatasGenericas, lista_ativosb3: list[0]}));//Lista de objetos.
    }

    res.statusCode = 200;//Códig
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ list_datas_genericas: listDatasGenericas, lista_ativosb3: lista_objeto_response }));
}

function filtrarPorDiasEscolhidos(datas, dt_inicial, dt_fim) {
    list_valores_selecionados = [], list_datas_selecionadas = [];

    for (data in datas) {
        if (data >= dt_inicial && data <= dt_fim) {
            list_valores_selecionados.push(datas[data]["4. close"]);
            list_datas_selecionadas.push(data);
            //console.log("o coisa:"+datas[data]["4. close"]);
        }
    }
    filtroResult = { "valores": list_valores_selecionados, "datas": list_datas_selecionadas.reverse() }

    return filtroResult;
}
