function redimensionamentoDadosConsultados(dados) {
    const valores_divisores = [9, 8, 7, 6, 5, 4, 3, 2];
    let controll;

    //Verifica qual o número q ele é divisivel
    for (let i = 0; i < valores_divisores.length; i++) {
        if (verificaoNumeroDivisivel(dados, valores_divisores[i])) {
            controll = valores_divisores[i]
            i = valores_divisores.length
        }
    }

    if(controll===2) console.log("Qtde Dado:"+dados+" Divisior: "+controll);

}

function verificaoNumeroDivisivel(n, i) {
    return n % i == 0 ? true : false
}
