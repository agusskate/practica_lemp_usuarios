$(document).ready(function () {

    //Formulario oculto
    $('.anadirFormulario').hide();


    // const usuarioCorrecto = "admin";
    // const contrasenaCorrecta = "12345";

    $('#loginButton').click(function (event) {
        event.preventDefault(); // Evitar el envío estándar del formulario

        const nombre = $('#username').val(); //valor del campo de nombre
        const contrasena = $('#password').val(); //valor del campo de contraseña

        $.ajax({
            url: '../php/verificarCredenciales.php',
            method: 'POST',
            data: {
                nombre: nombre,
                contrasena: contrasena
            },
            success: function (response) {
                if (response.success) {
                    alert('Usuario autenticado');
                    window.location.href = '../html/listaUsuarios.html';
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error al conectar con el servidor');
            }
        });
    });

    //Función para cargar los datos de los usuarios desde la base de datos
    function cargarDatosPOPUP() {
        $.ajax({
            url: '../php/recogerDatos.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log("Datos recibidos:", data); // Añade un log para asegurarte de que los datos son correctos.

                if (data.error) {
                    //error en la consulta, mostrar mensaje
                    $('.contenedorUsuarios').html('Error al cargar los datos: ' + data.error);
                } else if (data.length > 0) {
                    //limpiar el contenedor antes de agregar nuevos datos
                    $('.contenedorUsuarios').empty();

                    // Recorrer los datos de los usuarios y agregar la tarjeta para cada uno
                    for (const usuario of data) {
                        const fotoPerfilUrl = usuario.urlFotos ? `../multimedia/${usuario.urlFotos}` : '../multimedia/foto_perfil.png';


                        // Agregar la tarjeta HTML para cada usuario
                        $('.contenedorUsuarios').append(
                            `<div class="card">
                            <div class="card-id" style="display: none;" data-id="${usuario.id}"></div>  <!-- Contenedor oculto para el ID -->
                                <div class="content">

                                    <div class="back">
                                        <div class="back-content">
                                            <div class="imagen">
                                                <img src="${fotoPerfilUrl}" alt="Foto de perfil">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="front">
                                        <div class="img">
                                            <div class="circle"></div>
                                            <div class="circle" id="right"></div>
                                            <div class="circle" id="bottom"></div>
                                        </div>

                                        <div class="front-content">
                                            <div class="nombreApellidos">
                                                <div class="nombre">${usuario.nombre}</div>
                                                <div class="apellido1">${usuario.apellido1}</div>
                                                <div class="apellido2">${usuario.apellido2}</div>
                                            </div>

                                            <div class="description">
                                                <div class="direccion"><b>Dirección:</b> ${usuario.direccion}</div>
                                                <div class="telefono"><b>Telf:</b> ${usuario.telefono}</div>
                                                <div class="dni"><b>DNI:</b> ${usuario.dni}</div>
                                            </div>

                                            <div class="botones">
                                                <div class="botonEliminar">
                                                    <button>🗑️</button>
                                                </div>
                                                <div class="botonEditar">
                                                    <button>✏️</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        );
                    }
                } else {
                    $('.contenedorUsuarios').html('No hay usuarios');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la petición de AJAX", textStatus, errorThrown);
                $('.contenedorUsuarios').html('Error al cargar los usuarios');
            }
        });
    }



    //evento para eliminar usuario
    $(document).on('click', '.botonEliminar', function () {
        var card = $(this).closest('.card');
        var usuarioId = card.find('.card-id').data('id'); //acceder al ID desde el div oculto

        $.ajax({
            url: '../php/eliminarUsuario.php',
            type: 'POST',
            data: { id: usuarioId },
            success: function (response) {
                if (response.success) {
                    card.remove(); // Eliminar la tarjeta del HTML
                } else {
                    alert('Error al eliminar el usuario');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la petición de AJAX", textStatus, errorThrown);
                alert('Error al eliminar el usuario');
            }
        });
    });



    //evento Editar
    $(document).on('click', '.botonEditar', function () {
        var card = $(this).closest('.card');
        var usuarioId = card.find('.card-id').data('id'); // Obtener el ID del usuario
        var nombre = card.find('.nombre').text();
        var apellido1 = card.find('.apellido1').text();
        var apellido2 = card.find('.apellido2').text();
        var direccion = card.find('.direccion').text().replace('Dirección: ', '');
        var telefono = card.find('.telefono').text().replace('Telf: ', '');
        var dni = card.find('.dni').text().replace('DNI: ', '');

        //mostrar
        const formHtml = `
        <div class="editarFormulario">
            <h3>Editar Usuario</h3>
            <label>Nombre: <input type="text" id="editNombre" value="${nombre}"></label><br>
            <label>Apellido 1: <input type="text" id="editApellido1" value="${apellido1}"></label><br>
            <label>Apellido 2: <input type="text" id="editApellido2" value="${apellido2}"></label><br>
            <label>Dirección: <input type="text" id="editDireccion" value="${direccion}"></label><br>
            <label>Teléfono: <input type="text" id="editTelefono" value="${telefono}"></label><br>
            <label>DNI: <input type="text" id="editDNI" value="${dni}"></label><br>
            <div class="botones">
                <button id="guardarCambios">Guardar</button>
                <button id="cancelarCambios">Cancelar</button>
            </div>
        </div>
                `;
        $('.body').append(formHtml);

        //efecto fadeIn
        $('.editarFormulario').fadeIn(100);
        
        // Manejar el guardado de los cambios
        $('#guardarCambios').click(function () {
            const editedData = {
                nombre: $('#nuevoNombre').val().trim(),
                apellido1: $('#nuevoApellido1').val().trim(),
                apellido2: $('#nuevoApellido2').val().trim(),
                direccion: $('#nuevaDireccion').val().trim(),
                telefono: $('#nuevoTelefono').val().trim(),
                dni: $('#nuevoDNI').val().trim()
            };


            //campos vacíos o con solo espacios en blanco
            if (!editedData.nombre || !editedData.apellido1 || !editedData.direccion || !editedData.telefono || !editedData.dni) {
                alert('Por favor, completa todos los campos sin espacios vacíos al principio o al final.');
                return;
            }


            $.ajax({
                url: '../php/editarUsuario.php',
                type: 'POST',
                data: editedData,
                success: function (response) {
                    if (response.success) {
                        //actualizar la tarjeta en el HTML con los nuevos datos
                        card.find('.nombre').text(editedData.nombre);
                        card.find('.apellido1').text(editedData.apellido1);
                        card.find('.apellido2').text(editedData.apellido2);
                        card.find('.direccion').html('<b>Dirección:</b> ' + editedData.direccion);
                        card.find('.telefono').html('<b>Telf:</b> ' + editedData.telefono);
                        card.find('.dni').html('<b>DNI:</b> ' + editedData.dni);

                        $('.editarFormulario').remove(); //quitar el formulario
                    } else {
                        alert('Error al guardar los cambios');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error en la petición de AJAX", textStatus, errorThrown);
                    alert('Error al guardar los cambios');
                }
            });
        });

        // Cancelar edición
        $('#cancelarCambios').click(function () {
            //fadeout
            $('.editarFormulario').fadeOut(100, function () {
                $(this).remove();
            });
        });
    });


    $(document).ready(function () {
        //formulario de añadir al hacer clic en el botón "+"
        $('.botonAnhadir button').click(function () {
            $('.anadirFormulario').fadeIn();
        });


        $('.botonSalir button').click(function () {
            window.location.href = '../html/index.html';
        });

        //formulario de añadir al hacer clic en "Cancelar"
        $('#cancelarNuevo').click(function () {
            $('.anadirFormulario').fadeOut();
        });

        //guardar el nuevo usuario
        $('#guardarNuevo').click(function (e) {
            e.preventDefault();

            //valores del formulario
            const nuevoUsuario = {
                nombre: $('#nuevoNombre').val().trim(),
                apellido1: $('#nuevoApellido1').val().trim(),
                apellido2: $('#nuevoApellido2').val().trim(),
                direccion: $('#nuevaDireccion').val().trim(),
                telefono: $('#nuevoTelefono').val().trim(),
                dni: $('#nuevoDNI').val().trim()
            };


            //campos vacíos o con solo espacios en blanco
            if (!nuevoUsuario.nombre || !nuevoUsuario.apellido1 || !nuevoUsuario.direccion || !nuevoUsuario.telefono || !nuevoUsuario.dni) {
                alert('Por favor, completa todos los campos sin espacios vacíos al principio o al final.');
                return;
            }


            //objeto FormData para incluir los datos del formulario y la imagen
            const formData = new FormData();
            formData.append("nombre", nuevoUsuario.nombre);
            formData.append("apellido1", nuevoUsuario.apellido1);
            formData.append("apellido2", nuevoUsuario.apellido2);
            formData.append("direccion", nuevoUsuario.direccion);
            formData.append("telefono", nuevoUsuario.telefono);
            formData.append("dni", nuevoUsuario.dni);

            //verificar si se ha seleccionado una imagen y añadirla
            const fotoPerfil = $('#nuevoFotoPerfil')[0].files[0];
            if (fotoPerfil) {
                formData.append("fotoPerfil", fotoPerfil);
            }


            $.ajax({
                url: '../php/guardarNuevoUsuario.php',
                type: 'POST',
                data: formData,
                processData: false, // Evitar que jQuery procese los datos
                contentType: false, // Evitar que jQuery establezca el tipo de contenido
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        alert('Usuario añadido correctamente');
                        $('.anadirFormulario').fadeOut();
                        location.reload(); //recargar la página para mostrar el nuevo usuario
                    } else {
                        alert('Error al añadir usuario: ' + response.error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error en la petición AJAX', textStatus, errorThrown);
                    alert('Hubo un error al guardar el usuario');
                }
            });
        });
    });




    cargarDatosPOPUP();
});
