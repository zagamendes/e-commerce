class Notificacao {

   static sucesso  (mensagem){
        $.notify({
            icon:"fas fa-check",
            message:mensagem
            },{
                type:"success",
                animate:{
                    enter:"animated fadeInDown",
                    exit:"animated fadeOutUp"
                },
                placement: {
                    align: "center"
                },
                z_index:350000
        });
    }

   static erro (erro){
        $.notify({
            icon:"fas fa-times",
            title:"<strong>Erro!</strong> "+erro,
            message:""
            },{
                type:"danger",
                animate:{
                        enter:"animated fadeInDown",
                        exit:"animated fadeOutUp"
                },
                placement: {
                        align: "center"
                },
                z_index:350000
        });

    


    }

    static alerta (alerta){

        $.notify({
            icon:"fas fa-exclamation-triangle",
            title:alerta,
            message:""
            },{
                type:"warning",
                animate:{
                        enter:"animated fadeInDown",
                        exit:"animated fadeOutUp"
                },
                placement: {
                        align: "center"
                },
                z_index:350000
        });

    }

    static info (alerta){

        $.notify({
            icon:"fas fa-info-circle",
            title:"<strong>Alerta!</strong> "+alerta,
            message:""
            },{
                type:"info",
                animate:{
                        enter:"animated fadeInDown",
                        exit:"animated fadeOutUp"
                },
                placement: {
                        align: "center"
                },
                z_index:250000    
        });

    }
}