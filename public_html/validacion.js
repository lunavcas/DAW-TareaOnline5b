
//Cuando el código HTML está preparado...
$(document).ready(function () {

    //Declaración de variables
    var reg_email = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    var reg_nombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,16}$/;
    var reg_apellidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,16}[\s]{1}[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,16}$/;
    var reg_dni = /^[0-9]{8,8}[A-Za-z]$/;
    var reg_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //var reg_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;//Versión que exige un número

    $(".password").passtrength();//Asocia e inicia el plugin passtrength

    resetea();//Eatablece los valores iniciales

    //Previene por defecton la recarga del formulario
    $(".formulario").submit(function (e) {
        e.preventDefault();
    });

    //Reseta el formulario a los valores por defecto
    function resetea() {
        $(".nombre").val("");//Vacía
        $(".apellidos").val("");//Vacía
        $(".dni").val("");//Vacía
        $(".email").val("");//Vacía
        $(".password").val("");//Vacía
        $("#mayor").prop("checked", true);//Activa la opción Mayor de edad
        $(".disculpas").hide();//Oculta el texto de disculpas
        $(".volver").hide();//Oculta el botón volver
    }

    //Controla el evento de cambio de edad
    $('input[type=radio][name=edad]').change(function () {
        if (this.value === 'mayor') {
            //Se permite
        } else if (this.value === 'menor') {

            //Mensaje de aviso sobre menores
            Swal.fire({
                title: 'AVISO',
                text: 'Los menores de 18 no pueden registrarse en esta web',
                icon: 'warning',
                confirmButtonText: 'Vale'
            });
            $(".formulario").hide();
            //Muestra un texto de disculpas cargado desde archivo
            $.ajax({
                url: "disculpas.html",
                dataType: "html",
                success: function (data) {
                    $(".disculpas").html(data);
                }
            });

            $(".disculpas").show();//Muestra el texto de disculpas

            $(".volver").show();//Muestra el botón volver

            //Inicia animación de translación y zoom (probado en Chrome) para el botón volver
            $(".volver").animate({zoom: '300%'}, 300);//Aumenta zoom 300%
            $(".volver").animate({left: '100px'}, 700);//Mueve 100px a la derecha
            $(".volver").animate({zoom: '100%'}, 500);//Restaura zoom
            $(".volver").css({"left": "100px"}).animate({"left": "-200px"}, 500);
            $(".volver").animate({left: '300px'}, 700);
            $(".volver").animate({left: '120px'}, 1000);

        }
    });

    //Controla el evento de clic en el botón volver
    $(".volver").click(function () {
        $(".formulario").show();//Muestra el formulario
        resetea();
    });

    //Controla el evento de clic en el botón enviar
    $(".enviar").click(function () {

        $(".error").remove();//Elimina todos los posibles errores del formulario

        //Comprueba si se ha introducido un nombre válido
        if ($(".nombre").val() === "") {
            $(".nombre").focus().after("<span class='error'>Introduce tu nombre</span>");
            return false;
        } else if (!reg_nombre.test($(".nombre").val())) {
            $(".nombre").focus().after("<span class='error'>El nombre debe contener sólo texto</span>");
            return false;
        }

        //Comprueba si se ha introducido dos apellidos válidos
        if ($(".apellidos").val() === "") {
            $(".apellidos").focus().after("<span class='error'>Introduce tus dos apellidos</span>");
            return false;
        } else if (!reg_apellidos.test($(".apellidos").val())) {
            $(".apellidos").focus().after("<span class='error'>Los apellidos deben ser dos y contener sólo texto</span>");
            return false;
        }

        //Comprueba si se ha introducido un DNI válido
        if ($(".dni").val() === "") {
            $(".dni").focus().after("<span class='error'>Introduce tu DNI</span>");
            return false;
        } else if (!reg_dni.test($(".dni").val())) {
            $(".dni").focus().after("<span class='error'>El DNI introducido tiene un formato incorrecto</span>");
            return false;
        } else if (!es_valido_dni($(".dni").val())) {
            $(".dni").focus().after("<span class='error'>El DNI introducido no es válido</span>");
            return false;
        }

        //Comprueba (redundante) si el usuario es mayor de edad
        if ($(".edad").val() !== "mayor") {
            $(".edad").focus().after("<span class='error'>Se debe declarar ser mayor de edad</span>");
            return false;
        }

        //Comprueba si se ha introducido un email válido
        if ($(".email").val() === "") {
            $(".email").focus().after("<span class='error'>Introduce tu email</span>");
            return false;
        } else if (!reg_email.test($(".email").val())) {
            $(".email").focus().after("<span class='error'>El formato de email no es válido</span>");
            return false;
        }

        //Comprueba si se ha introducido un password válido
        if (!reg_password.test($(".password").val())) {
            $(".password").focus().after("<span class='error'>El password es demasiado débil</span>");
            return false;
        }

        //Mensaje confirmando el correcto registro
        let mensaje = '<pre>'
                + '\nEl registro se realizó correctamente\n'
                + '\nNombre: ' + $(".nombre").val()
                + '\nApellidos: ' + $(".apellidos").val()
                + '\nDNI: ' + $(".dni").val()
                + '\nEmail: ' + $(".email").val()
                + '</pre>';
        Swal.fire({
            title: 'ENVIADO',
            html: mensaje,
            icon: 'success',
            confirmButtonText: 'Vale'
        });
        //resetea();

    });

    //Quita los mensajes de error
    $(".nombre, .apellidos").keyup(function () {
        if ($(this).val() !== "") {
            $(".error").fadeOut();
            return false;
        }
    });

    //Quita los mensajes de error
    $(".email").keyup(function () {
        if ($(this).val() !== "" && reg_email.test($(this).val())) {
            $(".error").fadeOut();
            return false;
        }
    });

    //Convierte las letras minúsculas introducidads en mayúsculas
    $(".dni").keyup(function () {
        let dni = $(this).val();
        if (dni !== "") {
            $(this).val(dni.toUpperCase());
            $(".error").fadeOut();
            return false;
        }
    });

    //Comprueba si se introduce un password válido
    $(".password").keyup(function () {
        if ($(".password").val() === "") {
            $(".password_formato").show();
            return false;
        } else if (!reg_password.test($(".password").val())) {
            $(".password_formato").show();
            return false;
        } else {
            $(".password_formato").hide();
            //$(".formato").css("visibility", "hidden");
            return false;
        }
    });

    //Recibe un DNI español por parámetro y comprueba su validez
    function es_valido_dni(dni) {

        let numeros = dni.substring(0, dni.length - 1);
        let letra = dni.substr(dni.length - 1);

        if (!isNaN(numeros) && isNaN(letra) && numeros.toString().length === 8 && letra.length === 1) {
            let letras = 'TRWAGMYFPDXBNJZSQVHLCKET';
            if (letras[numeros % 23] === letra.toUpperCase()) {
                return true;
            }
        }
        return false;
    }

});
