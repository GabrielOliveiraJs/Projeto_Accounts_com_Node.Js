//Modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//Modulos externos
const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        },
    ]).then((answer) => {

        const action = answer['action']

        if (action === 'Criar Conta') {
            createAccount()
        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Consultar Saldo') {
            getAccountBalance()
        } else if (action === 'Sacar') {
            widthdraw()
        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }

    }).catch((err) => console.log(err))
}

//Criação da conta
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:'
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
            )
            buildAccount()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{"balance": 0}',
            function (err) {
                console.log(err)
            },
        )

        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()

    }).catch(err => console.log(err))
}

//Função Depositar
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            menssage: 'Qual o nome da sua conta?'
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName']

            //Verifica se a conta existe
            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    menssage: 'Quanto você quer depositar'
                },
            ]).then((answer) => {

                const amount = answer['amount']

                //Acrescentar uma quantia na conta
                addAmount(accountName, amount)
                operation()

            }).catch(err => console.log(err))

        })
        .catch(err => console.log(err))
}

//Verifica se a conta existe
function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }
    return true
}

//Acrescentar uma quantia na conta
function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`))
}

//Busca o arquivo para leitura do conteudo
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}

//Mostrar saldo da conta
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then(answer => {

        const accountName = answer["accountName"]

        //Verifica se a conta existe
        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$${accountData.balance}`
        ),
        )
        operation()

    }).catch(err => console.log(err))
}

//Retirar dinheiro da conta
function widthdraw() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return widthdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {

            const amount = answer['amount']

            removeAmount(accountName, amount)

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))

}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return widthdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return widthdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))
    operation()
}


//npm install (instala os módulos necessários)
//npm start (inicia o sistema)