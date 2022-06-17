
const http = require('http');
//const url = require('url');
const queryString = require('query-string');
const fs = require('fs');
const express = require('express');
const res = require('express/lib/response');
const app = express();
var session = require("express-session");
const url = require('url');
const cors = require('cors');
const fetch = require('node-fetch-commonjs');

var request = require('request');


app.use(
    session({
        secret: "a secret string",
        resave: true,
        saveUninitialized: false,
        cookie: {  },
    })
);


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});


app.get('/', async (req, res) => {
    // const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=PETR4.SAO&outputsize=full&apikey=65Y4AT7GA8UR20L7')
    // const app = await response.json()
    // console.log(app)

    // console.log("Sessão 0: " + req.session.list[0].ativo + "\n\n\n");
    // console.log("Sessão 1: " + req.session.list[1].ativo + "\n\n\n");
    // console.log("Sessão 2: " + req.session.list[2].ativo + "\n\n\n");
    // console.log("Sessão 3: " + req.session.list[3].ativo + "\n\n\n");
    req.session.cont += 1;
    console.log("incrementando:"+req.session.cont);
    res.statusCode = 200;//Códig
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.session));
})



app.get('/teste', async (req, res) => {
    req.session.cont += '1';
    //Formatação
    const urlParse = url.parse(req.url, true);
    const params = queryString.parse(urlParse.search);
    console.log(params);

    apikey = "65Y4AT7GA8UR20L7"
    //Requisição e consumo da API de cotação

    const data_inicial = params.data_inicial;
    const data_final = params.data_final;

    list = params.ativo.split(';');
    console.log(list)

    lista_objeto_response = []

    let dataMaior = 0;
    let listDatasGenericas = []

    // if(req.session.cont === undefined) {
    //     console.log("tá coisado");
    //     req.session.cont = 0;
    // }
   
    //req.session.cont += ;
    console.log(list.length)
    if (list.length > 1) {
        //Fazer lista de ativos
        
        //req.session.list = []
        // req.session.cont += 1;
        /*
        {
            ativo: "nome",
            valores: [

            ]
        }
        */

        console.log("Sessão:"+req.session);

        for (let i = 0; i < list.length; i++) {



















            //Verificar se o valor já tem 
            console.log(req.session)
            // if (req.session.list.length != 0) {

            // } else {
                var url_consulta = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${list[i]}&outputsize=full&apikey=${apikey}`;
                //console.log("valor:"+list[i])
                const response = await fetch(url_consulta)
                let app = {}
                app = await response.json();

                // req.session.list.push({
                //     nome_ativo: list[i],
                //     dados_ativo: app["Time Series (Daily)"]
                // })
                // console.log("salvando....\n");
                // console.log("O nome salvo foi: "+req.session.list[0].nome_ativo);

            //}































            lista_dias_selecionados = [];
            datas_selecionadas = [];
            // console.log(app["Time Series (Daily)"])
            posFiltroObj = filtrarPorDiasEscolhidos(app["Time Series (Daily)"], data_inicial, data_final);
            lista_dias_selecionados = posFiltroObj.valores;
            datas_selecionadas = posFiltroObj.datas;

            /*Verificação das datas*/
            if (dataMaior < datas_selecionadas.length) {
                dataMaior = datas_selecionadas.length;
                listDatasGenericas = datas_selecionadas;
            }


            //console.log("Quantidade de datas para o ativo " + list[i] + " :" + lista_dias_selecionados.length);
            //          lista_objeto_response.push({ ativo: list[i], datas: datas_selecionadas, valores: lista_dias_selecionados });//Lista de objetos.
            lista_objeto_response.push({ ativo: list[i], valores: lista_dias_selecionados });//Lista de objetos.

        }

        console.log(`A qtde de datas entre o intervalo de  ${data_inicial} até ${data_final} é: ${dataMaior}`);


        //Pegar ativos com maior qtde de datas 
        // console.log(lista_objeto_response);


        //separar lista de dias 

        //gerar lista de dadtas e lista de ativos com os resultados de cada um

    } else if (list.length == 1) {
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

    console.log(`A qtde de datas entre o intervalo de  ${data_inicial} até ${data_final} é: ${dataMaior}`);


    //Pegar ativos com maior qtde de datas 
    // console.log(lista_objeto_response);

    res.statusCode = 200;//Códig
    res.setHeader('Content-Type', 'application/json');
    //   res.end(JSON.stringify(app));
    res.end(JSON.stringify({ list_datas_genericas: listDatasGenericas, lista_ativosb3: lista_objeto_response }));
    //separar lista de dias 

    //gerar lista de dadtas e lista de ativos com os resultados de cada um


}


)

function filtrarPorDiasEscolhidos(datas, dt_inicial, dt_fim) {
    list_valores_selecionados = [], list_datas_selecionadas = [];

    for (data in datas) {
        if (data >= dt_inicial && data <= dt_fim) {
            list_valores_selecionados.push(datas[data]["4. close"]);
            list_datas_selecionadas.push(data);
            //console.log("o coisa:"+datas[data]["4. close"]);
        }
    }

    filtroResult = { "valores": list_valores_selecionados, "datas": list_datas_selecionadas }

    return filtroResult;
}
/*function redimensionamentoDadosConsultadosPrimos(dados) {
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

    
    // for(let i = 0; i<dados.length; i+=numero_intervalo){
    //     let somatorio;
    //     for(let j = i; j < i+numero_intervalo; j++){
    //         somatorio = dados[j].valor;
    //     }

    //     let media = somatorio/numero_intervalo;
    //     console.log(`media ${i} da data ${dados[i].data} é :  ${media}. \n`);
    // }   
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
    
        // /*function verificaoNumeroDivisivel(n, i) {
        //     return n % i == 0 ? true : false
        // }
        
        // function verificarNumeroPrimo(num) {
        //     let qtde = 0;
        
        //     for (let i = 1; i <= num; i++) { 
        //         if(verificaoNumeroDivisivel(num, i)==true){qtde = qtde + 1; console.log(i);};
        //     }
        
        //     if (qtde == 2) {
        //         console.log(`O valor ${num} é primo`);
        //         return true;
        //     } else {
        //         console.log(`O valor ${num} não é primo`);
        //         return false;
        //     }
        
        // } 



























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


}*/


/*function verificaoNumeroDivisivel(n, i) {
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




*/

var server = app.listen(3000, function () {
    var host = "127.0.0.1";
    var port = "8080";

    console.log("App listening at http://%s:%s", host, port)
})
