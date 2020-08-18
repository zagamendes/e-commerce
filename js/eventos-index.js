log = console.log;
let arrayProdutos = [];


//CASO O USER CLIQUE NO BOTÃO COMPRAR MAS DEPOIS FECHA A MODAL, SE TRUE, REMOVE O PRODUTO DA LISTA DE PRODUTOS QUE VÃO SER COMPRADOS
let clicouComprar = false;

getProdutos()
    .then(produtos => {
        console.log(produtos);
        let keys = Object.keys(produtos);
        keys.forEach(id => {
            let coluna = `
            <div class="col-md-6 col-lg-4 col-12 mt-4">
                <!-- Card -->
                <div class="card" id=${produtos[id].id} data-id=${produtos[id].id} data-nome=${produtos[id].nome} data-descricao=${produtos[id].descricao} data-valor=${produtos[id].valor}>

                    <!-- Card image -->
                    <div class="view overlay">
                        <img class="card-img-top" src=${produtos[id].imagem} alt="Card image cap">
                        
                    </div>

                    <!-- Card content -->
                    <div class="card-body">

                        <!-- Title -->
                        <h4 class="card-title">${produtos[id].nome}</h4>
                        <!-- Text -->
                        <div class="card-text">
                            ${produtos[id].descricao}
                            <p><span class="fas fa-dollar-sign"></span> ${produtos[id].valor}</p>
                        </div>
                        <!-- Button -->
                        <div class="row">
                            <div class="col-6">
                                <button value=${produtos[id].id} class="btn btn-primary btn-block btn-comprar mx-auto text-uppercase font-weight-bold"><span
                                        class="fas fa-money-check-alt"></span> Comprar</button>
                            </div>
                            <div class="col-6">
                                <button value=${produtos[id].id}  class="btn btn-info btn-block btn-add-no-carrinho mx-auto text-uppercase font-weight-bold">
                                    <span class="fas fa-cart-plus"></span> Adicionar
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- Card -->
            </div>`
            $("#row-produtos").append(coluna);
        });
    })


$(".container").on("click", ".btn-comprar", e => {
    clicouComprar = true;
    //RECEBENDO O INPUT DO PRODUTO ATUAL
    let produto = document.getElementById(e.currentTarget.value);

    arrayProdutos.push(produto);
    atualizaCarrinho();

    mostraModal();



});

$(".container").on("click", ".btn-add-no-carrinho", e => {


    //RECEBENDO O INPUT DO PRODUTO ATUAL
    let produto = document.getElementById(e.currentTarget.value);

    arrayProdutos.push(produto);
    atualizaCarrinho();

});

$("#qtd-carrinho").click(function (e) {
    e.preventDefault();
    mostraModal()


});




$("#myModal").on("hidden.bs.modal", () => {
    if (clicouComprar) {
        arrayProdutos.pop();
        atualizaCarrinho();
    }
    $(".modal-title").html("");
    $('.modal-body').html("");

})

async function getProdutos() {
    let response = await fetch("banco.json");
    let produtos = await response.json()
    return produtos;

};

function atualizaCarrinho() {
    $("#qtd-carrinho span").html(" " + arrayProdutos.length);
}


function mostraModal() {

    $(".modal-body").html("<p>Selecione abaixo a forma de pagamento.</p>");
    $("#myModal").modal("toggle");

    //TODOS OS PRODUTOS SEPARADOS POR VÍRGULA
    let descricao = arrayProdutos.reduce((valor, valorAtual) => {
        return `${valor} ${valorAtual.dataset.nome},`;
    }, "");
    //REMOVE A ÚLTIMA VÍRGULA DA STRING
    descricao = descricao.substr(0, descricao.length - 1);

    //VALOR TOTAL DA COMPRA
    let valor = arrayProdutos.reduce((valor, valorAtual) => {
        valorAtual = parseFloat(valorAtual.dataset.valor);
        return valor + valorAtual;
    }, 0);

    //CRIO O ARRAY DE OBJETOS PARA O ATRIBUTO ITEMS COM AS PROPRIEDADES EXIGIDAS
    let arrayObjetos = arrayProdutos.map(produto => {
        return {
            name: produto.dataset.nome,
            quantity: "1",
            unit_amount: {
                currency_code: "BRL",
                value: produto.dataset.valor
            },
            description:produto.dataset.descricao

        }
    })

    paypal.Buttons({
        createOrder: function (data, actions) {

            // This function sets up the details of the transaction, including the amount and line item details.
            return actions.order.create({

                purchase_units: [{
                    description: descricao,
                    amount: {
                        currency_code: "BRL",
                        value: valor.toFixed(2),
                        breakdown: {
                            item_total: {

                                currency_code: "BRL",
                                value: valor.toFixed(2)
                            }

                        }
                    },
                    items: arrayObjetos
                }]
            });
        },
        onApprove: async (data, actions) => {
            return actions.order.capture().then(function (details) {
                Notificacao.sucesso("Compra Realizada com sucesso!");
                console.log(details)
                limpaCarrinho();
            });
        },
        onError: error => {
            console.log("erro", error);
        }
    }).render(".modal-body");
}


function limpaCarrinho(){
    arrayProdutos = [];
    atualizaCarrinho();
    clicouComprar = false;
    $("#myModal").modal("toggle");
    

}