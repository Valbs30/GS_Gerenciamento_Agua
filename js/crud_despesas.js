document.querySelector("#salvar").addEventListener("click", cadastrar_desp)

let despesas = []
let edit_desp = false

// Carregar conteúdo
window.addEventListener("load", () => {
    despesas = JSON.parse(localStorage.getItem("despesas")) || []
    atualizar_desp()
})

// Busca
document.querySelector("#busca").addEventListener("keyup", () => {
    let busca = document.querySelector("#busca").value.toLowerCase()
    let despesasFiltradas = despesas.filter((despesa) => {
      let nomeDesp = despesa.nome_desp.toLowerCase()
      let dataDesp = formatarMonth(despesa.data_desp)
      return nomeDesp.includes(busca) || dataDesp.includes(busca)
    })
    filtrar_desp(despesasFiltradas)
})

// Filtrar pela busca
function filtrar_desp(despesas){
    document.querySelector("#despesas").innerHTML = ""
    despesas.forEach((despesa) => {
        document.querySelector("#despesas").innerHTML += createCard_desp(despesa)
    })
}

// Filtrar por campo
function filtro_campo(campo, elemento, valor) {
    document.querySelector(campo).addEventListener("change", () => {
      let despesasFiltradas = despesas.filter(despesa => despesa[elemento] === valor)
      filtrar_desp(despesasFiltradas)
    })
}

filtro_campo("#filtro_pendente", "stpaga_desp", false)
filtro_campo("#filtro_pago", "stpaga_desp", true)
filtro_campo("#filtro_domestica", "cat_desp", "Doméstica")
filtro_campo("#filtro_corporativa", "cat_desp", "Corporativa")
filtro_campo("#filtro_outra", "cat_desp", "Outra")
  
document.querySelector("#limpa_filtros").addEventListener("change", () => {
    filtrar_desp(despesas)
})
  
// Atualizar
function atualizar_desp(){
    document.querySelector("#despesas").innerHTML = ""
    localStorage.setItem("despesas", JSON.stringify(despesas))
    despesas.forEach((despesa) => {
        document.querySelector("#despesas").innerHTML += createCard_desp(despesa)
    })
}

// Cadastrar
function cadastrar_desp(){
    let nome_desp = document.querySelector("#nome_desp").value
    let data_desp = document.querySelector("#data_desp").value
    let cons_desp = document.querySelector("#consumo_desp").value
    let valor_desp = document.querySelector("#valor_desp").value
    let cat_desp = document.querySelector("#categoria_desp").value
    let desc_desp = document.querySelector("#descricao_desp").value
    let id_desp = document.querySelector("#id_desp").value
    let modal = bootstrap.Modal.getInstance(document.querySelector("#exampleModal"))

    cons_desp = parseFloat(cons_desp).toFixed(2)
    valor_desp = parseFloat(valor_desp).toFixed(2)

    let despesa = {
        id_desp: Date.now(),
        nome_desp,
        data_desp,
        cons_desp,
        valor_desp,
        cat_desp,
        desc_desp,
        stpaga_desp: false
    }
    
    if (!validar_desp(despesa.nome_desp, document.querySelector("#nome_desp"))) return
    if (!validar_desp(despesa.data_desp, document.querySelector("#data_desp"))) return
    if (despesa.cat_desp == "Outra") {
        if (!validar_desp(despesa.desc_desp, document.querySelector("#descricao_desp"))) return
    }
    if (!validar_valor(despesa.cons_desp, document.querySelector("#consumo_desp"))) return
    if (!validar_valor(despesa.valor_desp, document.querySelector("#valor_desp"))) return


    if (edit_desp == true) {
        let despesaEdita = despesas.find((despesa) => despesa.id_desp == id_desp)
        if (despesaEdita) {
            despesaEdita.nome_desp = document.querySelector("#nome_desp").value
            despesaEdita.data_desp = document.querySelector("#data_desp").value
            despesaEdita.cons_desp = document.querySelector("#consumo_desp").value
            despesaEdita.valor_desp = document.querySelector("#valor_desp").value
            despesaEdita.cat_desp = document.querySelector("#categoria_desp").value
            despesaEdita.desc_desp = document.querySelector("#descricao_desp").value
        }

        edit_desp = false
    }else{
        despesas.push(despesa)
    }

    atualizar_desp()

    modal.hide()
}

// Validação
function validar_desp(valor, campo){
    if(valor == ""){
        campo.classList.add("is-invalid")
        campo.classList.remove("is-valid")
        return false
    }

    campo.classList.remove("is-invalid")
    campo.classList.add("is-valid")
    return true

}

function validar_valor(valor, campo){
    if(valor <= 0){
        campo.classList.add("is-invalid")
        campo.classList.remove("is-valid")
        return false
    }

    campo.classList.remove("is-invalid")
    campo.classList.add("is-valid")
    return true

}

// Formatar data
function formatarMonth(valor) {
    let monthFormatado = valor.substring(5) + "/" + valor.substring(0, 4)
    return(monthFormatado)
}

// Editar
function editar_desp(id_desp){
    let despesa = despesas.find((despesa) => despesa.id_desp == id_desp)
    
    document.querySelector("#id_desp").value = despesa.id_desp
    document.querySelector("#nome_desp").value = despesa.nome_desp
    document.querySelector("#data_desp").value = despesa.data_desp
    document.querySelector("#consumo_desp").value = despesa.cons_desp
    document.querySelector("#valor_desp").value = despesa.valor_desp
    document.querySelector("#categoria_desp").value = despesa.cat_desp
    document.querySelector("#descricao_desp").value = despesa.desc_desp

    edit_desp = true
}

// Apagar
function apagar_desp(id_desp){
    despesas = despesas.filter((despesa) => {
        return despesa.id_desp != id_desp
    })
    atualizar_desp()
}

// Pagar
function pagar_desp(id_desp){
    let despesaEncontrado = despesas.find((despesa) => {
        return despesa.id_desp == id_desp
    })
    despesaEncontrado.stpaga_desp = true
    atualizar_desp()
}

// Criar card
function createCard_desp(despesa){
    let descricao = despesa.desc_desp ? `<p class="card-text">Descrição: ${despesa.desc_desp}</p>` : ""
    let disabled = despesa.stpaga_desp ? "disabled" : ""
    let status = despesa.stpaga_desp ? "Pago" : "Pendente"

    return `
        <div class="col-lg-3 col-md-6 col-12 mt-2">
            <div class="card">
                <div class="card-header bg-secondary-subtle d-flex justify-content-between">
                    <h8>${despesa.nome_desp}</h8>
                    <h8>data: ${formatarMonth(despesa.data_desp)}</h8>
                </div>
                <div class="card-body">
                    <p class="card-text">Consumo: ${despesa.cons_desp} m³</p>
                    <p class="card-text">Valor: R$${despesa.valor_desp}</p>
                    <p class="card-text">Categoria: ${despesa.cat_desp}</p>
                    ${descricao}
                    <p class="card-text">Status: ${status}</p>
                    <a onClick="pagar_desp(${despesa.id_desp})" href="#" class="btn btn-success ${disabled}" title="Marcar despesa paga">
                        <i class="bi bi-check-lg"></i>
                    </a>
                    <a onClick="editar_desp(${despesa.id_desp})" href="#" class="btn btn-primary" title="Editar despesa" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <a onClick="apagar_desp(${despesa.id_desp})" href="#" class="btn btn-danger" title="Apagar despesa">
                        <i class="bi bi-trash"></i>
                    </a>
                </div> <!-- card-body -->
            </div> <!-- card -->
        </div> <!-- col -->
    `
}
