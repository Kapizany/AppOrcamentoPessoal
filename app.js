class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){

        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (let atr in this){
            if (!this[atr]){
                return false
            }
        }

        return true
    }
}

class BD {
    
    constructor(){
        let id = localStorage.getItem('id')

        if (id === null){
            localStorage.setItem('id',0)
        }

    }

    getProximoTd (){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        
        let id = this.getProximoTd()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id',id)
    }

    recuperarTodosRegistros(){

        let despesas = Array()
        let id = localStorage.getItem('id')

        for (let counter=1; counter<=id; counter++){

            let despesa = JSON.parse(localStorage.getItem(counter))

            if (!!despesa){ despesas.push(despesa)}
        }
        return despesas
    }

    pesquisar(despesa){
        
    }
}

let bd = new BD()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()){
        
        bd.gravar(despesa)
        
        document.getElementById("modalLabel").className="modal-title text-success"
        document.getElementById("modalLabel").innerText="Registro inserido com sucesso"
        document.getElementById("modal-text").innerText="Despesa registrada com sucesso!"
        document.getElementById("voltar").className="btn btn-success"
        document.getElementById("voltar").innerText="Voltar"

        ano.value = ""
        mes.value = ""
        dia.value = ""
        tipo.value = ""
        descricao.value = "" 
        valor.value = ""

        $('#registraDespesa').modal('show')
    }
    else{
        document.getElementById("modalLabel").className="modal-title text-danger"
        document.getElementById("modalLabel").innerText="Registro com problemas"
        document.getElementById("modal-text").innerText="Existem campos não preenchidos!"
        document.getElementById("voltar").className="btn btn-danger"
        document.getElementById("voltar").innerText="Voltar e corrigir"
        $('#registraDespesa').modal('show')
    }
}

function consultaListaDespesas(){

    let despesas = Array()
    despesas = bd.recuperarTodosRegistros()
    var listaDespesas = document.getElementById('listaDespesas')

    despesas.forEach( function (desp){
        
        //criando linha tr
        let linha = listaDespesas.insertRow()

        //criar as colunas
        linha.insertCell(0).innerHTML = `${desp.dia}/${desp.mes}/${desp.ano}`
        
        switch(desp.tipo){
            case '1': desp.tipo = "Alimentação"
                break
            case '2': desp.tipo = "Educação"
                break
            case '3': desp.tipo = "Lazer"
                break
            case '4': desp.tipo = "Saúde"
                break
            case '5': desp.tipo = "Transporte"
                break
        }

        linha.insertCell(1).innerHTML = desp.tipo
        linha.insertCell(2).innerHTML = desp.descricao
        linha.insertCell(3).innerHTML = desp.valor

    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = (
        ano,
        mes,
        dia,
        tipo,
        descricao,
        valor
    )

    bd.pesquisar(despesa)
}
