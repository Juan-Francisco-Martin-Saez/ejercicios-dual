const usernames = [
  {
    name: "Aaron",
    age: 16,
    products: [
      "Iphone",
      "MacBoock"
    ]
  },
  {
    name: "Maria",
    age: 30,
    products: [
      "Ipad",
      "AppleWatch"
    ]
  },
  {
    name: "Carlos",
    age: 25,
    products: [
      "MacBook",
      "AirPods"
    ]
  },
  {
    name: "Juan",
    age: 18,
    products: [
      "Android",
      "SmartWatch"
    ]
  },
  {
    name: "Antonio",
    age: 40,
    products: [
      "Iphone",
      "Ipad Retina 4K"
    ]
  },
  {
    name: "Paco",
    age: 18,
    products: [
      "Android",
      "SmartWatch"
    ]
  },
  {
    name: "Ana",
    age: 28,
    products: [
      "AirPods",
      "AppleWatch"
    ]
  },
  {
    name: "Pepe",
    age: 50,
    products: [
      "Iphone",
      "MacBook"
    ]
  },
  {
    name: "Jose",
    age: 22,
    products: [

      "Auriculares",
      "Bateria Portatil"
    ]
  },
  {
    name: "Lola",
    age: 35,
    products: [
      "Ipad",
      "AppleWatch"
    ]
  }
]


// BUCLE FOREACH

usernames.forEach(username => {
  console.log(`${username.name} tiene ${username.age} años y tiene los siguientes productos ${username.products.join(", ")}`);
})


// BUCLE FOR

for (let i = 0; i < usernames.length; i++) {

  const username = usernames[i];

  console.log(`${username.name} tiene ${username.age} años y tiene los siguientes productos ${username.products.join(", ")}`);
}


// BUCLE FOR...OF

for (let username of usernames) {

  console.log(`${username.name} tiene ${username.age} años y tiene los siguientes productos ${username.products.join(", ")}`);
}


// BUCLE WHILE

let i = 0;

while (i < usernames.length) {

  const username = usernames[i];

  console.log(`${username.name} tiene ${username.age} años y tiene los siguientes productos ${username.products.join(", ")}`);

  i++;
}


// MOSTRAR USUARIOS EN HTML

const usuarios = document.querySelector("#usuarios")

usernames.forEach(username => {

  usuarios.innerHTML += `
    <div class="marco">
    <img src="./img/logo.svg" alt="Imagen cabecera">  
    <h2>${username.name}</h2>
      <span class="edad">Edad: ${username.age}</span>
      <span class="productos">Productos: ${username.products.join(", ")}</span>
    </div>
  `
})