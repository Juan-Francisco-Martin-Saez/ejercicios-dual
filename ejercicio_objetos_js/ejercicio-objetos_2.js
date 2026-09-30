//1. Encuentra el nombre de la universidad con el id 5. (Solución: "Universidad Católica de Chile")
//2. Obtén el país de la "Universidad de Salamanca". (Solución: "España")
//3. Lista los nombres de todas las universidades públicas. (Solución: ["Universidad Nacional Autónoma", "Universidade de São Paulo", "Universidad de Buenos Aires", "Universidad Central de Venezuela", "Universidad de Salamanca", "Universidad de la República", "Universidad de Costa Rica"])
//4. Lista los nombres de todas las universidades privadas. (Solución: ["Universidad de los Andes", "Universidad Católica de Chile", "Universidad Tecnológica de Monterrey", "Universidad de Lima", "Universidad San Francisco de Quito"])
//5. Encuentra la universidad que se fundó en el año 1821. (Solución: "Universidad de Buenos Aires")
//6. ¿Cuántos estudiantes tiene la "Universidad de los Andes"? (Solución: 145000)
//7. ¿Cuál es el ranking_mundial de la "Universidad de Costa Rica"? (Solución: 511)
//8. Lista las universidades ubicadas en "México". (Solución: ["Universidad Nacional Autónoma", "Universidad Tecnológica de Monterrey"])
//9. ¿Cuál es el id de la "Universidad de la República"? (Solución: 10)
//10. Obtén los campus que tiene la "Universidad San Francisco de Quito". (Solución: ["Quito", "Galápagos"])
//Búsquedas por Arreglos Internos (Campus y Carreras)
//11. Encuentra las universidades que tienen un campus llamado "CDMX". (Solución: ["Universidad Nacional Autónoma", "Universidad Tecnológica de Monterrey"])
//12. Lista las universidades que tienen únicamente un campus. (Solución: ["Universidad de los Andes", "Universidad de Buenos Aires", "Universidad de Lima"])
//13. ¿Qué universidad tiene un campus en "Galápagos"? (Solución: "Universidad San Francisco de Quito")
//14. Lista las universidades que ofrecen la carrera de "Medicina". (Solución: ["Universidad Nacional Autónoma", "Universidade de São Paulo", "Universidad Central de Venezuela"])
//15. Encuentra las universidades que imparten la carrera de "Derecho". (Solución: ["Universidad Nacional Autónoma", "Universidad Central de Venezuela", "Universidad de Salamanca"])
//16. ¿Qué universidades tienen la carrera de "Computación"? (Solución: ["Universidad Nacional Autónoma", "Universidad de Buenos Aires"])
//17. Encuentra qué universidad ofrece "Biología Marina". (Solución: "Universidad San Francisco de Quito")
//18. Lista los nombres de las universidades que tienen un campus en "Monterrey". (Solución: ["Universidad Tecnológica de Monterrey"])
//19. Encuentra las universidades que tienen una carrera en la facultad de "Ciencias Exactas". (Solución: ["Universidad de Buenos Aires"])
//20. ¿Qué universidad ofrece la carrera de "Animación Digital"? (Solución: "Universidad San Francisco de Quito")
//Condiciones Lógicas Complejas (AND / OR)
//21. Universidades públicas con más de 100,000 estudiantes. (Solución: ["Universidad Nacional Autónoma", "Universidad de Buenos Aires", "Universidad de la República"])
//22. Universidades privadas fundadas después de 1950. (Solución: ["Universidad de Lima", "Universidad San Francisco de Quito"])
//23. Universidades con un ranking mundial menor a 200 (mejor posicionadas). (Solución: ["Universidad Nacional Autónoma", "Universidade de São Paulo", "Universidad de Buenos Aires", "Universidad Católica de Chile", "Universidad Tecnológica de Monterrey"])
//24. Universidades en "Brasil" o "Argentina". (Solución: ["Universidade de São Paulo", "Universidad de Buenos Aires"])
//25. Universidades públicas fundadas antes de 1900. (Solución: ["Universidad de Buenos Aires", "Universidad de Salamanca"])
//26. Universidades que tengan más de 3 campus. (Solución: ["Universidad Tecnológica de Monterrey"])
//27. Universidades con menos de 30,000 estudiantes que sean públicas. (Solución: ["Universidad de Salamanca"])
//28. Universidades privadas que tengan un ranking mundial superior a 500 (número mayor a 500). (Solución: ["Universidad de Lima", "Universidad San Francisco de Quito"])
//29. Universidades que sean de "Colombia" and tengan más de 100,000 estudiantes. (Solución: ["Universidad de los Andes"])
//30. Universidades fundadas en el siglo XX (entre 1901 y 2000). (Solución: ["Universidad Nacional Autónoma", "Universidad de los Andes", "Universidade de São Paulo", "Universidad Tecnológica de Monterrey", "Universidad de Lima", "Universidad San Francisco de Quito", "Universidad de Costa Rica"])
//Inspección de Objetos Aninados (Atributos de Carreras)
//31. Universidades que tienen al menos una carrera que NO está acreditada (acreditada: false). (Solución: ["Universidad Nacional Autónoma", "Universidade de São Paulo", "Universidad Central de Venezuela", "Universidad de la República"])
//32. Universidades donde TODAS sus carreras listadas estén acreditadas. (Solución: ["Universidad de los Andes", "Universidad de Buenos Aires", "Universidad Católica de Chile", "Universidad Tecnológica de Monterrey", "Universidad de Lima", "Universidad San Francisco de Quito", "Universidad de Costa Rica"])
//33. Universidades que tienen alguna carrera con una duración de 12 semestres. (Solución: ["Universidad Nacional Autónoma", "Universidade de São Paulo", "Universidad de Buenos Aires", "Universidad Central de Venezuela"])
//34. Universidades que tienen carreras con una duración menor o igual a 8 semestres. (Solución: ["Universidad de los Andes", "Universidade de São Paulo", "Universidad Tecnológica de Monterrey", "Universidad de Salamanca", "Universidad San Francisco de Quito"])
//35. Encuentra la universidad que tiene la carrera de "Medicina" pero no está acreditada. (Solución: "Universidad Central de Venezuela")
//36. Universidades que tienen una carrera en la facultad de "Ingeniería" que dure exactamente 10 semestres. (Solución: ["Universidad de los Andes", "Universidad de Lima", "Universidad de Costa Rica"])
//37. ¿Qué universidad tiene la carrera de "Veterinaria"? (Solución: "Universidad de la República")
//38. Lista las universidades que tienen carreras de duración impar (9 u 11 semestres). (Solución: ["Universidad Nacional Autónoma", "Universidad Tecnológica de Monterrey", "Universidad de la República", "Universidad de Costa Rica"])
//39. Universidades que tengan una carrera acreditada en la facultad de "Negocios". (Solución: ["Universidad Tecnológica de Monterrey"])
//40. Qué universidad tiene la carrera de "Filología Hispánica". (Solución: "Universidad de Salamanca")
//Métodos Avanzados (Mapeos, Reducciones y Ordenamiento)
//41. ¿Cuál es el nombre de la universidad más antigua del dataset? (Solución: "Universidad de Salamanca")
//42. ¿Cuál es el nombre de la universidad más reciente del dataset? (Solución: "Universidad San Francisco de Quito")
//43. ¿Cuál es el nombre de la universidad con mayor cantidad de estudiantes? (Solución: "Universidad Nacional Autónoma")
//44. ¿Cuál es el nombre de la universidad con menor cantidad de estudiantes? (Solución: "Universidad San Francisco de Quito")
//45. ¿Cuál es la universidad mejor posicionada en el ranking_mundial (número más bajo)? (Solución: "Universidade de São Paulo")
//46. ¿Cuál es la suma total de estudiantes de todas las universidades juntas? (Solución: 1665000)
//47. ¿Cuál es el promedio de duración de semestres de las carreras de la universidad con id: 2? (Solución: 8.66)
//48. ¿Cuántas carreras en total (sumando todos los objetos) están acreditadas? (Solución: 24)
//49. ¿Cuál es el promedio de ranking mundial de las universidades de México? (Solución: 132.5)
//50. Si ordenas las universidades por año de fundación (de menor a mayor), ¿cuál queda en la tercera posición (índice 2)? (Solución: "Universidad de Buenos Aires")

(() => {

  const universidades = [
    {
      id: 1,
      nombre: "Universidad Nacional Autónoma",
      pais: "México",
      publica: true,
      fundacion: 1910,
      estudiantes: 350000,
      campus: ["CDMX", "Morelia", "Juriquilla"],
      carreras: [
        { nombre: "Medicina", facultad: "Medicina", duracion_semestres: 12, acreditada: true },
        { nombre: "Derecho", facultad: "Derecho", duracion_semestres: 10, acreditada: true },
        { nombre: "Computación", facultad: "Ciencias", duracion_semestres: 9, acreditada: false }
      ],
      ranking_mundial: 105
    },
    {
      id: 2,
      nombre: "Universidad de los Andes",
      pais: "Colombia",
      publica: false,
      fundacion: 1948,
      estudiantes: 145000,
      campus: ["Bogotá"],
      carreras: [
        { nombre: "Administración", facultad: "Administración", duracion_semestres: 8, acreditada: true },
        { nombre: "Ingeniería Civil", facultad: "Ingeniería", duracion_semestres: 10, acreditada: true },
        { nombre: "Física", facultad: "Ciencias", duracion_semestres: 8, acreditada: true }
      ],
      ranking_mundial: 220
    },
    {
      id: 3,
      nombre: "Universidade de São Paulo",
      pais: "Brasil",
      publica: true,
      fundacion: 1934,
      estudiantes: 95000,
      campus: ["São Paulo", "Ribeirão Preto", "Santos"],
      carreras: [
        { nombre: "Medicina", facultad: "Medicina", duracion_semestres: 12, acreditada: true },
        { nombre: "Ingeniería Eléctrica", facultad: "Politécnica", duracion_semestres: 10, acreditada: true },
        { nombre: "Historia", facultad: "Filosofía", duracion_semestres: 8, acreditada: false }
      ],
      ranking_mundial: 85
    },
    {
      id: 4,
      nombre: "Universidad de Buenos Aires",
      pais: "Argentina",
      publica: true,
      fundacion: 1821,
      estudiantes: 320000,
      campus: ["CABA"],
      carreras: [
        { nombre: "Psicología", facultad: "Psicología", duracion_semestres: 10, acreditada: true },
        { nombre: "Arquitectura", facultad: "FADU", duracion_semestres: 12, acreditada: true },
        { nombre: "Computación", facultad: "Ciencias Exactas", duracion_semestres: 10, acreditada: true }
      ],
      ranking_mundial: 95
    },
    {
      id: 5,
      nombre: "Universidad Católica de Chile",
      pais: "Chile",
      publica: false,
      fundacion: 1888,
      estudiantes: 31000,
      campus: ["Santiago", "Villarrica"],
      carreras: [
        { nombre: "Economía", facultad: "Economía", duracion_semestres: 10, acreditada: true },
        { nombre: "Sociología", facultad: "Ciencias Sociales", duracion_semestres: 10, acreditada: true }
      ],
      ranking_mundial: 121
    },
    {
      id: 6,
      nombre: "Universidad Tecnológica de Monterrey",
      pais: "México",
      publica: false,
      fundacion: 1943,
      estudiantes: 90000,
      campus: ["Monterrey", "Guadalajara", "CDMX", "Querétaro"],
      carreras: [
        { nombre: "Biotecnología", facultad: "Ingeniería", duracion_semestres: 9, acreditada: true },
        { nombre: "Mecatrónica", facultad: "Ingeniería", duracion_semestres: 9, acreditada: true },
        { nombre: "Negocios Internacionales", facultad: "Negocios", duracion_semestres: 8, acreditada: true }
      ],
      ranking_mundial: 160
    },
    {
      id: 7,
      nombre: "Universidad Central de Venezuela",
      pais: "Venezuela",
      publica: true,
      fundacion: 1721,
      estudiantes: 45000,
      campus: ["Caracas", "Maracay"],
      carreras: [
        { nombre: "Medicina", facultad: "Medicina", duracion_semestres: 12, acreditada: false },
        { nombre: "Derecho", facultad: "Jurídicas", duracion_semestres: 10, acreditada: true }
      ],
      ranking_mundial: 800
    },
    {
      id: 8,
      nombre: "Universidad de Salamanca",
      pais: "España",
      publica: true,
      fundacion: 1218,
      estudiantes: 28000,
      campus: ["Salamanca", "Ávila", "Zamora"],
      carreras: [
        { nombre: "Filología Hispánica", facultad: "Filología", duracion_semestres: 8, acreditada: true },
        { nombre: "Derecho", facultad: "Derecho", duracion_semestres: 8, acreditada: true }
      ],
      ranking_mundial: 450
    },
    {
      id: 9,
      nombre: "Universidad de Lima",
      pais: "Perú",
      publica: false,
      fundacion: 1962,
      estudiantes: 25000,
      campus: ["Lima"],
      carreras: [
        { nombre: "Comunicación", facultad: "Comunicación", duracion_semestres: 10, acreditada: true },
        { nombre: "Ingeniería Industrial", facultad: "Ingeniería", duracion_semestres: 10, acreditada: true }
      ],
      ranking_mundial: 651
    },
    {
      id: 10,
      nombre: "Universidad de la República",
      pais: "Uruguay",
      publica: true,
      fundacion: 1849,
      estudiantes: 140000,
      campus: ["Montevideo", "Salto", "Maldonado"],
      carreras: [
        { nombre: "Agronomía", facultad: "Agronomía", duracion_semestres: 10, acreditada: true },
        { nombre: "Veterinaria", facultad: "Veterinaria", duracion_semestres: 11, acreditada: false },
        { nombre: "Arquitectura", facultad: "Arquitectura", duracion_semestres: 10, acreditada: true }
      ],
      ranking_mundial: 550
    },
    {
      id: 11,
      nombre: "Universidad San Francisco de Quito",
      pais: "Ecuador",
      publica: false,
      fundacion: 1988,
      estudiantes: 9000,
      campus: ["Quito", "Galápagos"],
      carreras: [
        { nombre: "Biología Marina", facultad: "Ciencias Ambientales", duracion_semestres: 8, acreditada: true },
        { nombre: "Animación Digital", facultad: "Arquitectura y Diseño", duracion_semestres: 8, acreditada: true }
      ],
      ranking_mundial: 710
    },
    {
      id: 12,
      nombre: "Universidad de Costa Rica",
      pais: "Costa Rica",
      publica: true,
      fundacion: 1940,
      estudiantes: 42000,
      campus: ["San José", "Occidente", "Atlántico"],
      carreras: [
        { nombre: "Farmacia", facultad: "Farmacia", duracion_semestres: 11, acreditada: true },
        { nombre: "Ingeniería Química", facultad: "Ingeniería", duracion_semestres: 10, acreditada: true }
      ],
      ranking_mundial: 511
    }
  ];

  //1 console.log(universidades[4].nombre)
  //2 console.log(universidades[7].pais)
  //3 universidades.forEach(u => console.log(u.nombre))
  //4 universidades.filter(u => u.publica).forEach(u => console.log(u.nombre))
  //5 console.log(universidades.find(u => u.fundacion === 1821).nombre)
  //6 universidades.filter(u => u.publica !== true).forEach(u => console.log(u.nombre))
  // universidades.filter(u => u.publica == false).forEach(u => console.log(u.nombre))
  //7 console.log(universidades[1].estudiantes)
  //8 console.log(universidades[11].ranking_mundial)
  //9 console.log(universidades.filter(u => u.pais === "México").map(u => u.nombre))
  //10 console.log(universidades[10].campus)
  //console.log({ campus: universidades[10].campus, carreras: universidades[10].carreras })
  //11 console.log(universidades.filter(u => u.campus.includes("CDMX")).map(u => u.nombre))
  //12 console.log(universidades.filter(u => u.campus.length === 1).map(u => u.nombre))
  //13 console.log(universidades.filter(u => u.campus.includes("Galápagos")).map(u => u.nombre))
  //14 console.log(universidades.filter(u => u.carreras.some(c => c.nombre === "Medicina")).map(u => u.nombre))
  //15 console.log(universidades.filter(u => u.carreras.some(c => c.nombre === "Derecho")).map(u => u.nombre))
  //16 console.log(universidades.filter(u => u.carreras.some(c => c.nombre === "Computación")).map(u => u.nombre))
  //17 console.log(universidades.filter(u => u.carreras.some(c => c.nombre === "Biología Marina")).map(u => u.nombre))
  //18 console.log(universidades.filter(u => u.campus.includes("Monterrey")).map(u => u.nombre))
  //19 console.log(universidades.filter(u => u.carreras.some(c => c.facultad === "Ciencias Exactas")).map(u => u.nombre))
  //20 console.log(universidades.filter(u => u.carreras.some(c => c.nombre === "Animación Digital")).map(u => u.nombre))
  //21 console.log(universidades.filter(u => u.publica === true && u.estudiantes > 100000).map(u => u.nombre))
  //22 console.log(universidades.filter(u => u.publica === false && u.fundacion > 1950).map(u => u.nombre))
  //23 console.log(universidades.filter(u => u.ranking_mundial < 200).map(u => u.nombre))
  //24 console.log(universidades.filter(u => u.pais === "Brasil" || u.pais === "Argentina").map(u => u.nombre))
  //25 console.log(universidades.filter(u => u.publica === true && u.fundacion < 1900).map(u => u.nombre))
  //26 console.log(universidades.filter(u => u.campus.length > 3).map(u => u.nombre))
  //27 console.log(universidades.filter(u => u.publica === true && u.estudiantes < 30000).map(u => u.nombre))
  //28 console.log(universidades.filter(u => u.publica === false && u.ranking_mundial > 500).map(u => u.nombre))
  //29 console.log(universidades.filter(u => u.pais === "Colombia" && u.estudiantes > 100000).map(u => u.nombre))
  //30 console.log(universidades.filter(u => u.fundacion >= 1901 && u.fundacion <= 2000).map(u => u.nombre))
  //31 console.log(universidades.filter(u => u.carreras?.some(c => c.acreditada === false)).map(u => u.nombre))
  //32 console.log(universidades.filter(u => u.carreras.every(c => c.acreditada === true)).map(u => u.nombre))
  //33 console.log(universidades.filter(u => u.carreras?.some(c => c.duracion_semestres === 12)).map(u => u.nombre))
  //34 console.log(universidades.filter(u => u.carreras?.some(c => c.duracion_semestres <= 8)).map(u => u.nombre))
  //35 console.log(universidades.filter(u => u.carreras?.some(c => c.nombre === "Medicina" && c.acreditada === false)).map(u => u.nombre))
  //36 console.log(universidades.filter(u => u.carreras?.some(c => c.facultad === "Ingeniería" && c.duracion_semestres === 10)).map(u => u.nombre))
  //37 console.log(universidades.filter(u => u.carreras?.some(c => c.nombre === "Veterinaria")).map(u => u.nombre))
  //38 console.log(universidades.filter(u => u.carreras?.some(c => c.duracion_semestres === 9 || c.duracion_semestres === 11)).map(u => u.nombre))
  //39 console.log(universidades.filter(u => u.carreras?.some(c => c.facultad === "Negocios" && c.acreditada === true)).map(u => u.nombre))
  //40 console.log(universidades.filter(u => u.carreras?.some(c => c.nombre === "Filología Hispánica")).map(u => u.nombre))
  //41 console.log(universidades.sort((a, b) => a.fundacion - b.fundacion)[0].nombre)
  //42 console.log(universidades.sort((a, b) => b.fundacion - a.fundacion)[0].nombre)
  //43 console.log(universidades.sort((a, b) => b.estudiantes - a.estudiantes)[0].nombre)
  //44 console.log(universidades.sort((a, b) => a.estudiantes - b.estudiantes)[0].nombre)
  //45 console.log(universidades.sort((a, b) => a.ranking_mundial - b.ranking_mundial)[0].nombre)
  //46 console.log(universidades.reduce((acumulador, u) => acumulador + u.estudiantes, 0))
  //47 console.log(universidades.find(u => u.id === 2).carreras.reduce((sum, c) => sum + c.duracion_semestres, 0) / universidades.find(u => u.id === 2).carreras.length)
  //48 console.log(universidades.reduce((total, u) => total + (u.carreras?.filter(c => c.acreditada).length || 0), 0))
  //49 const mex = universidades.filter(u => u.pais === "México");
  // console.log(mex.reduce((sum, u) => sum + u.ranking_mundial, 0) / mex.length);
  //50 console.log(universidades.sort((a, b) => a.fundacion - b.fundacion)[2].nombre)



})()
