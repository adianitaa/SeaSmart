//Función para que sea número nacional
function numeroNacional(e) {
    var telefono = e.target.value.replace(/\D/g, '');
    var formattedTelefono = '';

    //Para el guión
    for (var i = 0; i < telefono.length; i++) {
        if (i === 4) {
            formattedTelefono += '-';
        }
        formattedTelefono += telefono[i];
    }

    //Que los digitos sean de 9 caracteres con el guión
    e.target.value = formattedTelefono.substring(0, 9);
}