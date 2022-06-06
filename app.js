
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
    lista_dias_selecionados = [];
    // console.log(app["Time Series (Daily)"])
    lista_dias_selecionados = filtrarPorDiasEscolhidos(app["Time Series (Daily)"], data_inicial, data_final);

    if (verificarNumeroPrimo(lista_dias_selecionados.length)) {
        response_object = redimensionamentoDadosConsultadosPrimos(lista_dias_selecionados);


        console.log("permissão não concedida")
    } else {

        response_object = redimensionamentoDadosConsultados(lista_dias_selecionados);

        console.log("permissão concedida")
    }

    res.statusCode = 200;//Códig
    res.setHeader('Content-Type', 'application/json');
    //   res.end(JSON.stringify(app));
    res.end(JSON.stringify(lista_dias_selecionados));
})

function redimensionamentoDadosConsultadosPrimos(dados) {
    const valores_divisores = [9, 8, 7, 6, 5, 4, 3, 2];
    v = dados.length;

    for (let i = 0; i < valores_divisores.length; i++) {
        if (verificaoNumeroDivisivel(dados.length - 1, valores_divisores[i])) {
            controll = valores_divisores[i]
            i = valores_divisores.length
        }
    }


    const numero_intervalo = (dados.length - 1) / controll;


    console.log("numero intervalo é: " + numero_intervalo);

    /*
    for(let i = 0; i<dados.length; i+=numero_intervalo){
        let somatorio;
        for(let j = i; j < i+numero_intervalo; j++){
            somatorio = dados[j].valor;
        }

        let media = somatorio/numero_intervalo;
        console.log(`media ${i} da data ${dados[i].data} é :  ${media}. \n`);
    }   */
    console.log(dados.length);


    list_objetos = []

    for (let i = 0; i < dados.length - 1; i += numero_intervalo) {
        // let somatorio;
        // for(let j = i; j < i+numero_intervalo; j++){
        //     console.log("entrou")
        //     somatorio = dados[j].valor;
        // }

        // let media = somatorio/numero_intervalo;
        // console.log(`media ${i} da data ${dados[i].data} é :  ${media}. \n`);
        let somatorio = 0.00;
        console.log("laço principal")
        for (let j = i; j <= i + numero_intervalo; j++) {
            //console.log(j)
            somatorio = parseFloat(somatorio) + parseFloat(dados[j].valor);
            //console.log(dados[j].valor);
        }

        let media = parseFloat(somatorio) / parseInt(numero_intervalo)
        //console.log("Media:"+media)

        list_objetos.push(
            {
                "dia": dados[i].data,
                "valor_media": media
            }
        )
    }

    console.log(list_objetos)

    //const numero_colunas = controll;

    // console.log(`O número de intervalors é: ${numero_intervalo}.\n`);
    //console.log(`O número de colunas é: ${numero_colunas}. \n\n`);

}

function redimensionamentoDadosConsultados2(dados) {
    const valores_divisores = [9, 8, 7, 6, 5, 4, 3, 2];
    let controll;

    //Verifica qual o número q ele é divisivel
    for (let i = 0; i < valores_divisores.length; i++) {
        if (verificaoNumeroDivisivel(dados, valores_divisores[i])) {
            controll = valores_divisores[i]
            i = valores_divisores.length
        }
    }

    if (controll === 2) {
        return dados/controll;
    }else{
        return 0;
    }

}

function verificaoNumeroDivisivel(n, i) {
    return n % i == 0 ? true : false
}

function listaValoresGerais(dados_size){
    list = []

    for(let i = 2; i<=dados_size;i++){
        if(verificaoNumeroDivisivel(dados_size,i)){
            list.push(i);
        }
    }

    return list;
}

function redimensionamentoDadosConsultados(dados) {
    const valores_divisores = [9, 8, 7, 6, 5, 4, 3, 2];
    let controll;

    //Verifica qual o número q ele é divisivel
    for (let i = 0; i < valores_divisores.length; i++) {
        if (verificaoNumeroDivisivel(dados.length, valores_divisores[i])) {
            controll = valores_divisores[i]
            i = valores_divisores.length
        }
    }

    let numero_intervalo = dados.length / controll;
    let numero_colunas = controll;

    console.log(`O número de intervalors é: ${numero_intervalo}.\n`);
    console.log(`O número de colunas é: ${numero_colunas}. \n\n`);

    if (numero_colunas == 2) {
        list = listaValoresGerais(dados.length);
        console.log(list);

        controll = list[1]
        numero_colunas = controll;
        numero_intervalo = dados.length / controll; 

        list_objetos = []

        for (let i = 0; i < dados.length; i += numero_intervalo) {
            let somatorio = 0.00;
            for (let j = i; j < i + numero_intervalo; j++) {
                somatorio = parseFloat(somatorio) + parseFloat(dados[j].valor);

                //console.log(dados[j].valor+"\n")
            }
            // console.log(somatorio)
            let media = parseFloat(somatorio) / parseInt(numero_intervalo);
            // console.log(media)
            list_objetos.push(
                {
                    "dia": dados[i].data,
                    "valor_media": parseFloat(media.toFixed(2))
                }
            )
            console.log(`media ${i} da data ${dados[i].data} é :  ${media}. \n`);
        }


        console.log(list_objetos);



      //  var qt = 0;    
        
        //for( let i = 1 ; i<=1500 ; i++ ){ 
//            qt = parseInt(redimensionamentoDadosConsultados2(dados.length));
       // } 
       // console.log("Quantidade:"+qt); 
    
        /*function verificaoNumeroDivisivel(n, i) {
            return n % i == 0 ? true : false
        }
        
        function verificarNumeroPrimo(num) {
            let qtde = 0;
        
            for (let i = 1; i <= num; i++) { 
                if(verificaoNumeroDivisivel(num, i)==true){qtde = qtde + 1; console.log(i);};
            }
        
            if (qtde == 2) {
                console.log(`O valor ${num} é primo`);
                return true;
            } else {
                console.log(`O valor ${num} não é primo`);
                return false;
            }
        
        } */



























    } else {
        list_objetos = []

        for (let i = 0; i < dados.length; i += numero_intervalo) {
            let somatorio = 0.00;
            for (let j = i; j < i + numero_intervalo; j++) {
                somatorio = parseFloat(somatorio) + parseFloat(dados[j].valor);

                //console.log(dados[j].valor+"\n")
            }
            // console.log(somatorio)
            let media = parseFloat(somatorio) / parseInt(numero_intervalo);
            // console.log(media)
            list_objetos.push(
                {
                    "dia": dados[i].data,
                    "valor_media": parseFloat(media.toFixed(2))
                }
            )
            console.log(`media ${i} da data ${dados[i].data} é :  ${media}. \n`);
        }


        console.log(list_objetos);

    }


}

function filtrarPorDiasEscolhidos(datas, dt_inicial, dt_fim) {
    list_valores_selecionados = []

    for (data in datas) {

        if (data >= dt_inicial && data <= dt_fim) {
            list_valores_selecionados.push({ "data": data, "valor": datas[data]["4. close"] });
            //console.log(datas[data]["4. close"]);
        }
        // console.log(data)
    }

    return list_valores_selecionados;
}

function verificaoNumeroDivisivel(n, i) {
    return n % i == 0 ? true : false
}

function verificarNumeroPrimo(num) {
    let qtde = 0;

    for (let i = 1; i <= num; i++) {
        qtde = verificaoNumeroDivisivel(num, i) ? qtde + 1 : qtde;
    }

    if (qtde == 2) {
        console.log(`O valor ${num} é primo`);
        return true;
    } else {
        console.log(`O valor ${num} não é primo`);
        return false;
    }

}




var server = app.listen(3000, function () {
    var host = "127.0.0.1";
    var port = "3000";

    console.log("App listening at http://%s:%s", host, port)
})


