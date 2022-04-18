const fs = require('fs')
        
        // const onChange = (id) => {
        //     // const valor = document.getElementById(id).value;
        //     // producto = {...producto, valor: valor}
        //     // console.log(producto);
        // }

        const onSubmit = () => {
            id = 0
            id++
            let nombre = document.getElementById("name").value;
            let precio = document.getElementById("price").value;
            let url = document.getElementById("imageUrl").value;
            console.log(nombre, precio, url);
            document.getElementById("name").value = '';
            document.getElementById("price").value = '';
            document.getElementById("imageUrl").value = '';

            // let producto = {Nombre: nombre, Precio: precio, ImageUrl: url}

            // let data = fs.readFileSync('../productos.json', 'utf-8')
            // let arreglo = JSON.parse(data).productos

            // for (const prop in producto) {
            // producto = {...producto, id: id }
            // }
            // arreglo.push(producto)
            // fs.writeFileSync('../productos.json', JSON.stringify({productos: arreglo}))
            // console.log(id)

        }