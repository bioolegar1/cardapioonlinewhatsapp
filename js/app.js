    $(document).ready(function () {
        cardapio.eventos.init();
    });

    var cardapio = {};

    var MEU_CARRINHO = [];

    cardapio.eventos = {
        init: () => {
            cardapio.metodos.obterItensCardapio();
        },
    };

    cardapio.metodos = {
        //obtem a lista de itens do cardápio. ----------------///////////////////////
        "obterItensCardapio": (categoria = "burgers", vermais = false) => {
            var filtro = MENU[categoria];
            // console.log(categoria);

            if (!vermais) {
                $("#itensCardapio").html("");
                $("#btnVerMais").removeClass("hidden");
            }

            $.each(filtro, (i, e) => {
                let temp = cardapio.templates.item
                    .replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
                    .replace(/\${id}/g, e.id);

                // botão ver mais foi clicado (12 itens)
                if (vermais && i >= 8 && i < 12) {
                    $("#itensCardapio").append(temp);
                }
                // paginação inicial 8 itens
                if (!vermais && i < 8) {
                    $("#itensCardapio").append(temp);
                }
            });

            //remove o ativo
            $(".container-menu a").removeClass("active");

            //seta o menu para ativo
            $("#menu-" + categoria).addClass("active");
        },

        //Clique no botão de ver mais
        "verMais": () => {
            var ativo = $(".container-menu a.active").attr("id").split("menu-")[1]; //quebra o nameclass para facilitar o vermais para cada categoria
            cardapio.metodos.obterItensCardapio(ativo, true);
            $("#btnVerMais").addClass("hidden"); //esconde o botão ver mais
        },

        //diminuir a quantidade do item no cardapio
        "diminuirQuantidade": (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());

            if (qntdAtual > 0) {
                $("#qntd-" + id).text(qntdAtual - 1);
            }
        },

        //Aumentar a quantidade do item no cardapio
        "aumentarQuantidade": (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());
            $("#qntd-" + id).text(qntdAtual + 1);
        },

        //adicionar ao carrinho o item do cardapio
        "adicionarAaoCarrinho": (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());

            if (qntdAtual > 0) {
                //obter a categoria ativa
                var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

                //obtem a lista de itens
                let filtro = MENU[categoria];

                //obtem o item
                let item = $.grep(filtro, (e, i) => { return e.id == id });

                if (item.length > 0) {

                    //validar se ja existe esse item no carrinho
                    let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                    //caso ja exista, só altera a quantidade do item escolhido
                    if(existe.length > 0) {
                        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id ));
                        MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                    }
                    //caso ainda n exista o item no carrinho, adiciona ele
                    else {
                        item[0].qntd = qntdAtual;
                        MEU_CARRINHO.push(item[0]);
                    }
                    cardapio.metodos.mensagem('Item adicionado ao carrinho.', 'green');
                    $("#qntd-" + id).text(0);

                    cardapio.metodos.atualizarBadgeTotal();

                }
            }


        },


        //atualiza o badge de totais dos botoes "meu Carrinho"
        "atualizarBadgeTotal": () => {
            var total = 0;

            $.each(MEU_CARRINHO, (i, e) => {
                total += e.qntd
            })

            if(total >0) {
                $(".botao-carrinho").removeClass('hidden');
                $(".container-total-carrinho").removeClass('hidden');
            }
            else {
                $(".botao-carrinho").addClass('hidden');
                $(".container-total-carrinho").addClass('hidden');
            }

            $(".badge-total-carrinho").html(total);
        },

        //abrir a modal de carrinho
        abrirCarrinho: (abrir) => {
          if(abrir) {
              $("#modalCarrinho").removeClass('hidden');
              cardapio.metodos.carregarEtapa(1)
          }
          else {
              $("#modalCarrinho").addClass('hidden');
          }
        },

        //altera os textos e exibe os botões das etapas
        carregarEtapa: (etapa) => {

            if(etapa == 1){
                $("#lblTituloEtapa").text('Seu Carrinho:');
                $("#itensCarrinho").removeClass('hidden');
                $("#localEntrega").addClass('hidden');
                $("#resumoCarrinho").addClass('hidden');

                $(".etapa").removeClass('active');
                $(".etapa1").addClass('active');

                $("#btnEtapaPedido").removeClass('hidden');
                $("#btnEtapaEndereco").addClass('hidden');
                $("#btnEtapaResumo").addClass('hidden');
                $("#btnVoltar").addClass('hidden');
            }

            if (etapa == 2){
                $("#lblTituloEtapa").text('Endereço de Entrega:');
                $("#itensCarrinho").addClass('hidden');
                $("#localEntrega").removeClass('hidden');
                $("#resumoCarrinho").addClass('hidden');

                $(".etapa").removeClass('active');
                $(".etapa1").addClass('active');
                $(".etapa2").addClass('active');


                $("#btnEtapaPedido").addClass('hidden');
                $("#btnEtapaEndereco").removeClass('hidden');
                $("#btnEtapaResumo").addClass('hidden');
                $("#btnVoltar").removeClass('hidden');
            }

            if (etapa == 3){
                $("#lblTituloEtapa").text('Resumo do pedido:');
                $("#itensCarrinho").addClass('hidden');
                $("#localEntrega").addClass('hidden');
                $("#resumoCarrinho").removeClass('hidden');

                $(".etapa").removeClass('active');
                $(".etapa1").addClass('active');
                $(".etapa2").addClass('active');
                $(".etapa3").addClass('active');


                $("#btnEtapaPedido").addClass('hidden');
                $("#btnEtapaEndereco").addClass('hidden');
                $("#btnEtapaResumo").removeClass('hidden');
                $("#btnVoltar").removeClass('hidden');
            }
        },


        //Voltar etapa - botão
        voltarEtapa:() => {
          let etapa = $(".etapa.active").length;
          cardapio.metodos.carregarEtapa(etapa -1)

        },



        //Mensagens - red e green
        mensagem: (texto, cor ='red', tempo = 3500) => {

            let idDate = Math.floor(Date.now() * Math.random()).toString();

            let msg = `<div id="msg-${idDate}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

            $("#container-mensagens").append(msg);

            setTimeout(() => {
                $("#msg-" + idDate).removeClass('fadeInDown');
                $("#msg-" + idDate).addClass('fadeOutUp');
                setTimeout(() => {
                    $("#msg-" + idDate).remove();
                },800)
            }, tempo);

        }
    };

    cardapio.templates = {
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
                            <span class="btn btn-add"  onclick="cardapio.metodos.adicionarAaoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                        </div>
                    </div>
                </div>
        
            </div>
    `
    };