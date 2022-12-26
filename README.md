<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API
Teslo es un ECommerce Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sint modi inventore, aspernatur suscipit expedita quod excepturi numquam dolore dolorum architecto, iusto molestias assumenda repellat consequatur maiores soluta qui pariatur?

## Development steps

1. Clonar el proyecto con el comando:
    ```
    git clone https://github.com/juancalderonx/tesla-shop.git
    ```  

2. Ejecute el comando:
    ```
    yarn install
    ```

3. Clone el archivo ```.env.template``` y renombrarlo a ```.env```

4. Cambiar las variables de entorno.

5. Levantar la base de datos con el siguiente comando:
   
    ```
    docker-compose up -d
    ``` 

6. Ejecutar el seed de productos.
   
    ```
    http://localhost:3000/api/v1/seed
    ``` 

7. Levantar la aplicación con:
    ```
    yarn start:dev
    ```

---

## Client View
Para ver el Frontend del chat implementado en TesloShop usando ``**websockets**`` por favor clone también el siguiente repositorio:
```
https://github.com/juancalderonx/teslo-chat.git
```
Ahí encontrará la info del cliente de este proyecto.