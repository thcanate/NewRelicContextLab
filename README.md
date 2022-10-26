# New Relic Laboratório Log In Context
Resources for FoodMe Lab with log in context

Para acessar o ambiente do EC2, procurar pelo seu nome e copiar o endereço de acesso para a instancia.

[Lista de Acesso para o ambiente EC2](https://docs.google.com/spreadsheets/d/1cfW43Swlm5nCJ3z2q_fuYlbbsd8eGuRWW5MRIK78gxs/edit#gid=1975914412)

Copiar o arquivo *foodme-br.pem* para sua maquina local.

[Link para Exercícios](https://developer.newrelic.com/collect-data/monitor-your-application/set-up-env)


 ## 1. Instalar Biblioteca Winston
 ```
 npm init -y
 
 npm i winston
 ```
 
## 2. Criar o arquivo *logger.js* no diretório: 
*/opt/NewRelic-basics-lab-material/FoodMe*

logger.js
```
const winston = require('winston');

const userlogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'applog.log' }),
    ],
});
module.exports = userlogger;
```


## 3. Importar a biblioteca winston

No arquivo *server/index.js* inserir no TOPO do arquivo.

```
const userLogger = require('../logger.js');
```

