function validaBase64eConverte(binario) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    if (binario === "") {
        Toast.fire({
            icon: 'error',
            title: 'Por favor, verifique o JSON.'
        })
        return;
    }

    var dadosBinarios;

    if (isBinary(binario)) {

        dadosBinarios = new Uint8Array(binario.length);

        for (var i = 0; i < binario.length; i++) {
            dadosBinarios[i] = parseInt(binario.charAt(i), 2);
        }

    } else {
        // Expressão regular para verificar se é um valor válido em base64
        var regexBase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

        if (!regexBase64.test(binario)) {

            Toast.fire({
                icon: 'error',
                title: 'Valor do base64 inválido.'
            })

            return;
        }
        var stringBinaria = atob(binario);

        dadosBinarios = new Uint8Array(stringBinaria.length);

        for (var j = 0; j < stringBinaria.length; j++) {
            dadosBinarios[j] = stringBinaria.charCodeAt(j);
        }
    }

    var caminhoArquivoSaida = "base64Convertido.pdf";

    try {
        var blob = new Blob([dadosBinarios], { type: "application/pdf" });

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, caminhoArquivoSaida);
        } else {
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = caminhoArquivoSaida;
            link.click();
        }

        Toast.fire({
            icon: 'success',
            title: 'Arquivo PDF convertido com sucesso!'
        })

    } catch (error) {
        Toast.fire({
            icon: 'success',
            title: `Erro ao converter e salvar o arquivo PDF:${error}`
        })
    }
}

function isBinary(valor) {
    var regexBinary = /^[01]+$/;
    return regexBinary.test(valor);
}

function lendoJson() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const fileInput = document.getElementById('entradaJson');
    const file = fileInput.files[0];

    if (!file) {
        Toast.fire({
            icon: 'error',
            title: 'Por favor, verifique o JSON.'
        });
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const conteudo = event.target.result;

        try {
            const jsonData = JSON.parse(conteudo);

            if (!jsonData.data || !jsonData.data.xml || !jsonData.data.xml.data || !jsonData.data.xml.data.pdf) { 
                Toast.fire({
                    icon: 'error',
                    title: 'Caminho data.xml.data.pdf não encontrado no JSON.'
                });
                return;
            }

            validaBase64eConverte(jsonData.data.xml.data.pdf);
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Caminho data.xml.data.pdf não encontrado no JSON.'
            });
        }
    };

    reader.readAsText(file);
}
