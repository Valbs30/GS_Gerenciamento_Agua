document.querySelector("#gerar_relatorio").addEventListener("click", verificar_dados)

let relatorios = []

window.addEventListener("load", () => {
  relatorios = JSON.parse(localStorage.getItem("relatorios")) || []
  atualizar_rel()
})

// Recuperar os dados do localStorage
const despesasArmazenadas = JSON.parse(localStorage.getItem('despesas'))

function atualizar_rel() {
  document.querySelector("#relatorios").innerHTML = ""
  localStorage.setItem("relatorios", JSON.stringify(relatorios))
  relatorios.forEach((relatorio) => {
    document.querySelector("#relatorios").innerHTML += gerar_relatorio(relatorio)
  })
}

// Verificar se há dados no localStorage
function verificar_dados() {
  if (despesasArmazenadas) {
    // Chamar a função fazer_relatorio com os dados do localStorage
    let relatorio = calculos_relatorio(despesasArmazenadas)
    relatorios.push(relatorio)
    atualizar_rel()
  }
  else {
    console.log('Não há despesas armazenadas no localStorage.')
  }
}
function calculos_relatorio(despesasArmazenadas) {
  let soma_valor = 0
  let soma_consumo = 0
  const num_despesas = despesasArmazenadas.length

  // Calcular a soma total dos valores e consumos
  for (let i = 0; i < num_despesas; i++) {
    soma_valor += Number(despesasArmazenadas[i].valor_desp);
    soma_consumo += Number(despesasArmazenadas[i].cons_desp);
  }

  const media_valor = (soma_valor / num_despesas).toFixed(2)
  const media_consumo = (soma_consumo / num_despesas).toFixed(2)

  // Gerar o relatório
  const relatorio = {
    id_relatorio: Date.now(),
    total_valor: soma_valor,
    total_consumo: soma_consumo,
    media_valor: media_valor,
    media_consumo: media_consumo,
    num_despesas: num_despesas,
    despesasArmazenadas: despesasArmazenadas,
    datahora: obterDataHoraLocal()
  }

  return relatorio
}

function apagar_rel(id_relatorio) {
  relatorios = relatorios.filter((relatorio) => {
    return relatorio.id_relatorio != id_relatorio
  })
  atualizar_rel()
}

function formatarMonth(valor) {
  let monthFormatado = valor.substring(5) + "/" + valor.substring(0, 4)
  return (monthFormatado)
}

function obterDataHoraLocal() {
  const dataHora = new Date()
  const dataLocal = dataHora.toLocaleDateString()
  const horaLocal = dataHora.toLocaleTimeString()

  let datahora = dataLocal + " ás " + horaLocal
  return datahora
}

function gerar_relatorio(relatorio) {
  function criar_linhas_despesas() {
    let linhas = ''
    for (let i = 0; i < relatorio.despesasArmazenadas.length; i++) {
      let status = relatorio.despesasArmazenadas[i].stpaga_desp ? "Pago" : "Pendente"
      linhas += `
                <tr>
                    <th scope="row">${relatorio.despesasArmazenadas[i].nome_desp}</th>
                    <td>${formatarMonth(relatorio.despesasArmazenadas[i].data_desp)}</td>
                    <td>${relatorio.despesasArmazenadas[i].cons_desp}</td>
                    <td>${relatorio.despesasArmazenadas[i].valor_desp}</td>
                    <td>${relatorio.despesasArmazenadas[i].cat_desp}</td>
                    <td>${status}</td>
                </tr>
            `
    }
    return linhas
  }

  return `
      <div id="estrutura_rel" class="bg-dark rounded m-3">
        <div class="d-flex align-items-start">
          <h1 class="text-white flex-grow-1 px-3 py-2">Relatório Consolidado de Consumos</h1>
          <p class="text-white m-3">Relatório gerado no dia ${relatorio.datahora}</p> 
          <a onClick="apagar_rel(${relatorio.id_relatorio})" href="#" class="btn btn-danger m-3" title="Apagar relatorio">
            <i class="bi bi-trash"></i>
          </a>
        </div>
            <h2 class="text-white ps-3 pb-1">Visão Analítica</h2>
            <div class="table-responsive px-3 d-flex">
                <table class="table table-light table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Despesa</th>
                            <th scope="col">Data</th>
                            <th scope="col">Consumo (m³)</th>
                            <th scope="col">Valor (R$)</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        ${criar_linhas_despesas()}
                    <tbody class="table-group-divider">
                        <tr>
                            <th scope="row">Total (${relatorio.num_despesas} despesas)</th>
                            <td>-</td>
                            <td>${relatorio.total_consumo}</td>
                            <td>${relatorio.total_valor}</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                    </tbody>
                </table>
            </div>

            <h2 class="text-white ps-3 pb-1">Visão Consolidada</h2>
            <div class="mx-3 gap-3">
              <div class="table-responsive">
                  <table class="table table-light table-striped table-hover table-sm">
                      <thead>
                          <tr>
                              <th scope="row">Campo</th>
                              <th scope="row">Valor</th>
                          </tr>
                      </thead>
                      <tbody class="table-group-divider">
                          <tr>
                              <th scope="col">Consumo Total</th>
                              <td>R$ ${relatorio.total_consumo}</td>
                          </tr>
                          <tr>
                              <th scope="col">Média de Consumo</th>
                              <td>R$ ${relatorio.media_consumo}</td>
                          </tr>
                          <tr>
                              <th scope="col">Valor Total</th>
                              <td>R$ ${relatorio.total_valor}</td>
                          </tr>
                          <tr>
                              <th scope="col">Média de Valor</th>
                              <td>R$ ${relatorio.media_valor}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
            </div>
        </div>
    `
}
