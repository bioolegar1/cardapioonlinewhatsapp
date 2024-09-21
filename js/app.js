$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio ={};

cardapio.eventos = {
    init:() => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos ={
    //obtem a lista de itens do cardápio. ----------------///////////////////////
    obterItensCardapio: (categoria = 'burgers', vermais =false) => {
        var filtro = MENU[categoria];
        console.log(filtro);

        if(!vermais){
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden')

        }

        $.each(filtro, (i,e)=> {

            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img )
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2) .replace('.',',')
                .replace(/\${id}/g, e.id ))
            //botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }
            //paginação inicial 8 itens
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)

            }
        })
        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active');
    },

    //Clique no botão de ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; //quebra o nameclass para facilitar o vermais para cada categoria
        cardapio.metodos.obterItensCardapio(ativo,true)
        $("#btnVerMais").addClass('hidden') //esconde o botão ver mais
    },


    //diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("qntd-" + id).text());

        if(qntdAtual > 0) {
            $("qntd-" + id).text(qntdAtual - 1)
        }

    },

    //Aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("qntd-" + id).text());
        $("qntd-" + id).text(qntdAtual - 1)
    }

}

cardapio.templates ={

    item: `   
    
            <div class="col-3 mb-5">
                <div class="card card-item" id="\${id}">
                    <div class="img-produto">
                        <img src="\${img}" />
                    </div>
                    <p class="title-produto text-center mt-4">
                        <b>\${name}</b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$ \${price}</b>
                    </p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"> <i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}">0</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
                    </div>
                </div>
            </div>
    
        </div>
`

}