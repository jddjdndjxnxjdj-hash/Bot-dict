/* * * * * * * * * * * * * * * * * 
*                                *
*           Mass DM              *
*        Criador:Snow*#0007           *
*       Discord.gg/txgen      *
*                                *
* * * * * * * * * * * * * * * * */

// Modules
const { Client } = require("discord.js");
const { red, yellow, greenBright, yellowBright } = require("chalk");
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });
const fs = require("fs");




// Instâncias
const client = new Client();
const { token, message } = require("./settings.json");


// Faz o bot ficar online
client.on("ready", () => {
    console.log(greenBright(client.user.tag + "estou online.\n"));
    client.user.setActivity({ name: "Snow.py", type: "PLAYING", url: "" })
    Main();
});

function Main() {
    console.log("\tMass DM\n\tOpções:\n    [1] Modo Normal\n    [2] Modo Tempo Limite (Evita Sinalização)\n");
    readline.question("[?] Qual Opção Você Escolhe: ", answer => {
        switch (answer) {
            case "1":
                readline.question("\n[!] Fale O ID Do Servidor: ", response => {
                    ScrapeUsers(response).then(() => {
                        console.log(greenBright("Aviso: Spam Em DM em breve."));
                        setTimeout(() => {
                                MassDMNormal(null, message).catch((err) => {
                                    console.log(err)
                                    setTimeout(() => {
                                        console.log(yellow("Aviso: Reiniciando."));
                                    }, 1000);
                                    setTimeout(() => {
                                        process.exit(1);
                                    }, 2000);
                            });
                        }, 2000);
                    });
                });
                break;
            case "2":
                readline.question("\n[!] Fale O ID Do Servidor: ", response => {
                    ScrapeUsers(response).then(() => {
                        setTimeout(() => {
                            readline.question("\n[i] Fale O Tempo Que O Bot Vai Esperar Pra Enviar Mensagem Pra Outro Usuário.\n[i] Bypass: Evita Ser Sinalizado Pleo Discord!\n[i] Limite(s): 3 - 9 segundos\n\n[!] Fale O Tempo: ", timeout => {
                                if (timeout === "3" || timeout === "4" || timeout === "5" || timeout === "6" || timeout === "7" || timeout === "8" || timeout === "9") {
                                    const timer = (parseInt(timeout) * 1000)
                                    console.log(greenBright("Aviso: Spam Em DM Em Breve."));
                                        MassDMTimeOut(null, timer, message).catch((err) => {
                                            console.log(err)
                                            setTimeout(() => {
                                                console.log(yellow("Aviso: Reiniciando."));
                                            }, 1000);
                                            setTimeout(() => {
                                                process.exit(1);
                                            }, 2000);
                                    })
                                } else {
                                    console.log(red("Erro ao definir o tempo."));
                                    setTimeout(() => {
                                        console.log(yellow("Aviso: Reiniciando."));
                                    }, 1000);
                                    setTimeout(() => {
                                        process.exit(1);
                                    }, 2000);
                                }
                            });
                        }, 2000);
                    });
                });
                break;
            default:
                console.log(red("Erro ao escolher a opção."))
        }

    })
}

/**
 * Scrape Users
 * @param {string}
 */
async function ScrapeUsers(guildID) {
    // Procura o servidor
    client.guilds.fetch(guildID).then((guild) => {
        const file_path = './scraped.json';
        const MemberIDs = guild.members.cache.map((users) => users.id)
        console.log(yellowBright("[!] " + MemberIDs.length + " Usuário Raspado"))
        const Data = {
            IDs: MemberIDs
        }
        const content = JSON.stringify(Data, null, 2)
        fs.writeFileSync(file_path, content, (err) => {
            if (err) return console.log(red("Gravando Arquivo Erro: " + err))
            console.log(greenBright("Feito Com Sucesso " + file_path))
        })
    }).catch((err) => {
        console.log(red("Erro De Servidor: " + err))
        setTimeout(() => {
            console.log(yellow("Aviso: Reiniciando."));
        }, 1000);
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    })
}

/**
 * Mass DM (Tempo)
 * @param {array} 
 * @param {number}  
 * @param {string}
 */
function MassDMTimeOut(users, timeout, msg) {
    return new Promise((resolve, reject) => {
        const scraped = require("./scraped.json");
        users = scraped.IDs;
        if (typeof timeout != "number") {
            reject(red("Erro ao definir o tempo."))
        } else if (typeof msg != "string") {
            reject(red("Algum erro de mensagem ocorreu!"))
        } else {
            for (let i = 0; i <= users.length; i++) {
                client.users.fetch(users[i]).then((u) => {
                    (function (i) {
                        setTimeout(function () {
                            u.send(msg).then(() => console.log(greenBright("Usuário: " + u.tag + " Recebeu A Mensagem"))).catch((err) => console.log(red("Erro Ao Enviar Para: " + u.tag + " Pode Ter DM Bloqueada. " + err)))
                        }, timeout * i);
                    })(i);
                }).catch((err) => console.log(red("Erro Ao Buscar O Usuário: " + err)));
            }
            resolve();
        }
    })
}

/**
 * Mass DM (Modo Normal)
 * @param {array} 
 * @param {string} 
 */
function MassDMNormal(users, msg) {
    return new Promise((resolve, reject) => {
        const scraped = require("./scraped.json");
        users = scraped.IDs;
            for (let i = 0; i <= users.length; i++) {
                client.users.fetch(users[i]).then((u) => {
                    u.send(msg).then(() => console.log(greenBright("Usuário " + u.tag + " Recebeu A Mensagem!"))).catch((err) => console.log(red("Erro Ao Enviar Para: " + u.tag + " Pode Ter DM Bloqueada " + err)));
                }).catch((err) => console.log(red("Erro Ao Encontrar O Usuário: " + err)));
            }
            resolve();
    })
}

// Sistema de login
client.login(token).catch((err) => { console.log("Token Inválido: " + err) });
