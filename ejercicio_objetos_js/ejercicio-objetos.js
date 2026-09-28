// 1.Propiedad sencilla. Accede al nombre de la academia utilizando la notación de punto.
// 2.Propiedad con espacios. Accede al valor de la propiedad 'código de centro'.
// 3.Objeto dentro de otro objeto. Accede a la ciudad de la academia.
// 4.Varios niveles de objetos. Accede al número de la calle.
// 5.Array de textos. Accede a la segunda área formativa.
// 6.Array dentro de un objeto anidado. Accede al segundo teléfono de contacto.
// 7.Array de objetos. Accede al título del segundo curso.
// 8.Objeto dentro de un array de objetos. Accede al nombre de la docente del primer curso.
// 9.Combinación de objetos y arrays. Accede a la segunda nota del primer alumno del segundo curso.
// 10.Acceso mediante una variable. Dada la siguiente variable, accede a la propiedad de contacto cuyo nombre indica su valor. Debes utilizar la variable en la expresión.


//11. Último elemento de un array: Accede al área 'Servicios sociales' utilizando su índice correspondiente dentro de la propiedad areas.
//12. Primer teléfono de contacto: Accede al número de teléfono '971000111' dentro de la propiedad contacto.
//13. Segunda especialidad de un docente: Accede a la especialidad 'Desarrollo web' de la docente Laura.
//14. Nombre de un alumno específico: Accede al nombre del alumno 'Luis' dentro del curso de 'JavaScript inicial'.
//15. Primera nota de un alumno: Accede a la primera nota (el número 8) de la alumna Marta en el curso de 'Excel práctico'.
//16. Propiedad numérica anidada: Accede al número de horas (30) que dura el curso de 'Excel práctico'.



(() => {

  const academia = {
    nombre: 'Kaicen Formación',
    'código de centro': 'KA-204',
    direccion: {
      ciudad: 'Palma',
      calle: {
        nombre: 'Calle del Sol',
        numero: 18
      }
    },
    areas: ['Informática', 'Idiomas', 'Servicios sociales'],
    contacto: {
      email: 'informacion@academia.test',
      telefonos: ['971000111', '600222333']
    },
    cursos: [
      {
        titulo: 'JavaScript inicial',
        horas: 40,
        docente: {
          nombre: 'Laura',
          especialidades: ['JavaScript', 'Desarrollo web']
        },
        alumnos: [
          { nombre: 'Ana', notas: [7, 9] },
          { nombre: 'Luis', notas: [6, 8] }
        ]
      },
      {
        titulo: 'Excel práctico',
        horas: 30,
        docente: {
          nombre: 'Miguel',
          especialidades: ['Excel', 'Análisis de datos']
        },
        alumnos: [
          { nombre: 'Marta', notas: [8, 10] },
          { nombre: 'Pablo', notas: [5, 7] }
        ]
      }
    ]

  }

  //1 console.log(academia.nombre)
  //2 console.log(academia["código de centro"])
  //3 console.log(academia.direccion.ciudad)
  //4 console.log(academia.direccion.calle.numero)
  //5 console.log(academia.areas[1])
  //6 console.log(academia.contacto.telefonos["1"])
  //7 console.log(academia.cursos[1].titulo)
  //8 console.log(academia.cursos[0].docente.nombre)
  //9 console.log(academia.cursos[1].alumnos[0].notas[1])


  //11 console.log(academia.areas[2])
  //12 console.log(academia.contacto.telefonos[0])
  //13 console.log(academia.cursos[0].docente.especialidades[1])
  //14 console.log(academia.cursos[0].alumnos[1].nombre)
  //15 console.log(academia.cursos[1].alumnos[0].notas[0])
  //16 console.log(academia.cursos[1].horas)

  // console.log(academia.contacto.email)
  // console.log(academia.direccion.calle.nombre)
  // console.log(academia.direccion.calle)

})()

