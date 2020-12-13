const Discord = require('discord.js')
const axios = require('axios')
const { config } = require('dotenv')

config({
    path: __dirname + "/.env"
})

const client = new Discord.Client()

const prefix = '!'
const commands = ['reset', 'bind', 'help', 'me']

const commandList = new Discord.MessageEmbed()
    .setColor('#f7b586')
    .setTitle('Talos Bot Help Commands:')
	.addFields(
		{ name: 'Command list', value: "`!help` \nTo show all available commands", inline: true },
        { name: 'Reset key', value: "`!reset <key>` \nAllows you to reset your key and use it on a new device", inline: true },
        { name: 'Bind key', value: "`!bind <key>` \nBind/Activates your key to your discord account", inline: true },
        { name: 'Subscription info', value: "`!me` \nTo show your subscription information", inline: true },
	)

client.once('ready', () => {
    console.log('Talos Bot is now online!');
})

client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot || message.channel.type !== 'dm') return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if(!commands.includes(command)) {
        message.author.send(commandList)
        return
    }

    switch (command) {
        case 'me':
            {
                message.author.send('Please wait...')

                await axios.post(`${process.env.API_URL}/api/verify`, 
                    {
                        discord_id: message.author.id
                    })
                    .then((res) => {
                        if(res.status === 200 && res.data) {
                            message.author.send(`**Your key:** ${res.data.master_key.key} \n**Status:** ${res.data.status} \n**Expiry:** N/A`)
                        }
                    })
                    .catch(({response}) => {
                        console.log(response);
                        switch (response.status) {
                            case 422:
                                message.author.send(response.data.message)
                                break;
                            default:
                                message.author.send("Internal error, kindly report it to #bug-reports.")
                                break;
                        }
                    })
            }
            break
        case 'help':
            message.author.send(commandList)
            break
        case 'reset':
            {
                const key = message.content.slice((`!${command}`).length).trim()

                if(!key) {
                    message.author.send('Key is required')
                } else {
                    message.author.send('Please wait...')

                    await axios.put(`${process.env.API_URL}/api/unbind`, 
                        {
                            discord_id: message.author.id,
                            key: key
                        })
                        .then((res) => {
                            message.author.send('Your key has been reset')
                        })
                        .catch(({response}) => {
                            switch (response.status) {
                                case 422:
                                    message.author.send(response.data.message)
                                    break;
                                default:
                                    message.author.send("Internal error, kindly report it to #bug-reports.")
                                    break;
                            }
                        })
                }
            }
            break;
        case 'bind':
            {
                const key = message.content.slice((`!${command}`).length).trim()

                if(!key) {
                    message.author.send('Key is required')
                    return
                } else {
                    message.author.send('Please wait...')

                    await axios.put(`${process.env.API_URL}/api/bind`, 
                        {
                            discord_id: message.author.id,
                            username: message.author.username,
                            discriminator: message.author.discriminator,
                            key: key
                        })
                        .then((res) => {
                            message.author.send('You have successfully activated/bind your key!')
                        })
                        .catch(({response}) => {
                            switch (response.status) {
                                case 422:
                                    message.author.send(response.data.message)
                                    break;
                                default:
                                    message.author.send("Internal error, kindly report it to #bug-reports.")
                                    break;
                            }
                        })
                }
            }
            break;
    }
})

client.login(process.env.DISCORD_TOKEN)