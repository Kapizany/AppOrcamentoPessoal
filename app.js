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
        $('#sucessoGravacao').modal('show')
    }
    else{
        $('#erroGravacao').modal('show')
    }
}

