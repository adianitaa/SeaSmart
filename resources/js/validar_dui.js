//Función para que el formate del DUI esté correcto
function duiNacional(e) {
    var dui = e.target.value.replace(/\D/g, '');
    var formattedDUI = '';

    //Para el guión
    for (var i = 0; i < dui.length; i++) {
        if (i === 8) {
            formattedDUI += '-';
        }
        formattedDUI += dui[i];
    }

    //Que los digitos sean de 9 caracteres con el guión
    e.target.value = formattedDUI.substring(0, 10);
}