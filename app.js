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
        //id é o auxiliar que indicara o ultimo indice do banco
        let id = localStorage.getItem('id')

        //vendo se existe algum registro no banco se não há, cria id = 0
        if (id === null){
            localStorage.setItem('id',0)
        }

    }

    getProximoTd (){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        //insere a despesa no local storage
        let id = this.getProximoTd()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id',id)
    }

    recuperarTodosRegistros(){

        let despesas = Array()
        let id = localStorage.getItem('id') 

        for (let counter=1; counter<=id; counter++){
            //percorrendo todos ids do banco e pegando as despesas
            let despesa = JSON.parse(localStorage.getItem(counter))

            if (!!despesa){ //verificando se esse registro não foi apagado
                despesa.id = counter
                despesas.push(despesa)
            }
        }
        return despesas
    }

    pesquisar(despesa){ //dada um despesa pesquisa as despesas com atributos em comum no local storage

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas // devolve um array com todas as despesas compatíveis com o filtro
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function cadastrarDespesa() {
    //Chamada na pagina de cadastro, pega as informações preenchidas
    //na página e insere a despesa no local storage

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

    //verifica se todos os campos foram preenchidos, se sim,
    // insere a nova despesa e exibe feedback positivo
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
        //verifica se todos os campos foram preenchidos, se não,
        // avisa o usuário que há dados não preenchidos

        document.getElementById("modalLabel").className="modal-title text-danger"
        document.getElementById("modalLabel").innerText="Registro com problemas"
        document.getElementById("modal-text").innerText="Existem campos não preenchidos!"
        document.getElementById("voltar").className="btn btn-danger"
        document.getElementById("voltar").innerText="Voltar e corrigir"
        $('#registraDespesa').modal('show')
    }
}

function consultaListaDespesas(despesas = Array(), filtro = false){
    //função que atualiza as despesas na página de consulta
    // com todas as despesas ou as passadas por parâmetro

    if (despesas.length == 0 &&  filtro == false){
        despesas = bd.recuperarTodosRegistros()
    } //se não foram passadas despesas, ou filtro, usa todos os registros do local storage
    
    var listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = '' //apaga as despesas no html para inserir as atualizadas

    despesas.forEach( function (desp){ 
        //percorre o array com as despesas e insere, uma por uma, na tabela
        
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
        
        //criando botão para remoção das despesas
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"> </i>'
        btn.id = `id_despesa_${desp.id}`
        btn.onclick = function(){

            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

    })
}

function pesquisarDespesa(){
    //Pega os filtros da página de consulta e chama a função do banco que
    //filtra as despesas e retorna-as em um array, em seguida, chama a função
    //que atualiza as despesas da página de consulta
    
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(
        ano,
        mes,
        dia,
        tipo,
        descricao,
        valor
    )

    let despesas = bd.pesquisar(despesa)
    
    consultaListaDespesas(despesas, true) //atualizando a página consulta com as despesas filtradas
}
