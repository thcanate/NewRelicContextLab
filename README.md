# New Relic Laboratório Log In Context
Resources for FoodMe Lab with log in context

Para acessar o ambiente do EC2, procurar pelo seu nome e copiar o endereço de acesso para a instancia.

Lista de Acesso para o ambiente EC2

Copiar o arquivo *foodme-br.pem* para sua maquina local.

[Link para Exercícios](https://developer.newrelic.com/collect-data/monitor-your-application/set-up-env)


# Feedback
Sua opnião importa!

(https://bit.ly/Feedback_NewRelic)


=============================================

 ## 1. Instalar Biblioteca Winston
 ```sh
 npm init -y
 
 npm i winston
 ```
 
## 2. Criar o arquivo *logger.js* no diretório: 
*/opt/NewRelic-basics-lab-material/FoodMe*

logger.js
```javascript
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

```javascript
const userLogger = require('../logger.js');
```

## 4. Criar mensagem de Logs
No arquivo *server/index.js* configurar algumas mensagens de log, para que apareçam na plataforma

**dir: /opt/NewRelic-basics-lab-material/FoodMe**

```javascript
 42.   // API
 43.  app.get(API_URL, function(req, res, next){
 44.    //Loggin NR
 45.    userLogger.info('pagina Home selecionada');
 46.    res.status(200).send(storage.getAll().map(removeMenuItems))
 47.  });
```
## Como ativar ou desativar Log in Context

No arquivo **newrelic.js** ativar o Log in Context no agente

*dir: /opt/NewRelic-basics-lab-material/FoodMe*

```javascript
application_logging: {
     forwarding: {
     enabled: true
    }
```
