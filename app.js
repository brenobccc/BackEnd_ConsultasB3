
const http = require('http');
//const url = require('url');
const queryString = require('query-string');
const fs = require('fs');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const url = require('url');
const fetch = require('node-fetch-commonjs');


var request = require('request');


app.get('/', async (req, res) => {

  // const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=PETR4.SAO&outputsize=full&apikey=65Y4AT7GA8UR20L7')
  // const app = await response.json()
  // console.log(app)


  res.statusCode = 200;//Códig
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(app));
})


app.get('/teste', async (req, res) => {
  //Formatação
  const urlParse = url.parse(req.url, true);
  const params = queryString.parse(urlParse.search);
  console.log(params);

  apikey = "65Y4AT7GA8UR20L7"
  //Requisição e consumo da API de cotação
  //var url_consulta = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=PETR4.SAO&outputsize=full&apikey=65Y4AT7GA8UR20L7';
  var url_consulta = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${params.ativo}&outputsize=full&apikey=${apikey}`;
  const response = await fetch(url_consulta)
  const app = await response.json()

  const data_inicial = params.data_inicial;
  const data_final = params.data_final;

  lista_dias_selecionados = filtrarPorDiasEscolhidos(app["Time Series (Daily)"], data_inicial, data_final);


  res.statusCode = 200;//Códig
  res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify(app));
  res.end(JSON.stringify(lista_dias_selecionados));
})


function filtrarPorDiasEscolhidos(datas,dt_inicial, dt_fim) {
    list_valores_selecionados = []

    for(data in datas){

        if(data >= dt_inicial && data<= dt_fim ){
            list_valores_selecionados.push(data);
        }
        // console.log(data)
    }

    return list_valores_selecionados;
}



var server = app.listen(3000, function () {
  var host = "127.0.0.1";
  var port = "3000";

  console.log("App listening at http://%s:%s", host, port)
})


