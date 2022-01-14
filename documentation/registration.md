# Fazer Registro de susuario

> ## Dados
* Token de Acesso
* Nome de usuario

> ## Fluxo primario
1. ❌ Validar se o field password e passwordConfirmation sao iguais
2. ❌ Verificar se existe usuario cadastrado com o email recebido
3. ❌ Cryptografar a senha recebida
4. ❌ Salvar usuario com a senha criptografada
5. ❌ fazer a authenticacao do usuario e retornar o AuthenticationModel

>## Fluxo de excecao: Senhas nao batem
1. ❌ Retornar um badRequest

>## Fluxo de excecao: Usuario ja cadastrado
1. ❌ Retornar um badRequest
