const Discord = require("discord.js-selfbot-v13");
const fs = require("fs");
const chalk = require("chalk");

const TOKENS = [
    "", // حط توكنك هنا
];


const hajjiLogo = chalk.hex('#FFD700')(`
██╗  ██╗ █████╗      ██╗██╗
██║  ██║██╔══██╗     ██║██║
███████║███████║     ██║██║
██╔══██║██╔══██║██   ██║██║
██║  ██║██║  ██║╚█████╔╝██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ ╚═╝
         [ by HAJJI ]
`);

console.clear();
console.log(hajjiLogo);


const messagesData = JSON.parse(fs.readFileSync("messages.json", "utf8"));
const messages = messagesData.messages || [];

if (messages.length === 0) {
    console.log(chalk.red("لا توجد رسائل في messages.json"));
    process.exit(1);
}

const channelId = ""; // ايدي الروم الي يرسل فيه
let messageIndex = 0;

TOKENS.forEach(token => {
    const client = new Discord.Client({
        intents: []
    });

    client.on('ready', async () => {
        console.log(chalk.green(`${client.user.username} is ready!`));

        const channel = client.channels.cache.get(channelId);
        if (!channel) {
            console.log(chalk.red("مالقيت الروم يولد"));
            return;
        }

        setInterval(() => {
            const messageToSend = messages[messageIndex];
            channel.send(messageToSend).then(() => {
                console.log(chalk.cyan(`Message sent: ${messageToSend}`));
            }).catch(err => {
                console.log(chalk.red("ماقدرت ارسل يامطي"), err.message);
            });

            messageIndex = (messageIndex + 1) % messages.length;
        }, 1000);
    });

    client.login(token);
});