# Fazer Login

> ## Dados
* Token de Acesso
* Nome de usuario

> ## Fluxo primario
1. ❌ Receber e validar se existe usuario com email e senha cadastrado respectivamente
2. ❌ Buscar no banco usuario com email respectivo
3. ❌ Criptografar a senha recebida
4. ❌ Comparar a senha Criptografada recebida com a senha criptografado do usuario
5. ❌ Criar um token de acesso, a partir do ID do usuario, com expiracao de 30 minutos
6. ❌ Retornar o token de acesso e nome de usuario

>## Fluxo de excecao: Usuario nao cadastrado
1. ❌ Retornar um badRequest

>## Fluxo de excecao: Senha invalida
4. ❌ Retornar um badRequest
