function converterBase64ParaPdf() {
  var valorEntrada = document.getElementById("entradaBase64").value.trim();

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

  if (valorEntrada === "") {
    Toast.fire({
      icon: 'error',
      title: 'Por favor, insira um valor binário ou base64.'
    })
    return;
  }

  var dadosBinarios;

  if (isBinary(valorEntrada)) {

    dadosBinarios = new Uint8Array(valorEntrada.length);

    for (var i = 0; i < valorEntrada.length; i++) {
      dadosBinarios[i] = parseInt(valorEntrada.charAt(i), 2);
    }

  } else {
    // Expressão regular para verificar se é um valor válido em base64
    var regexBase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

    if (!regexBase64.test(valorEntrada)) {

      Toast.fire({
        icon: 'error',
        title: 'Por favor, insira um valor binário ou base64 válido.'
      })
     
      return;
    }
    var stringBinaria = atob(valorEntrada);

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
