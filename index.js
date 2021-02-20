const Discord = require('discord.js')
const axios = require('axios')
const { config } = require('dotenv')

config({ path: __dirname + "/.env" })

const client = new Discord.Client()

const prefix = '!'
const commands = ['bind', 'unbind', 'me', 'reset', 'help']

const commandList = new Discord.MessageEmbed()
    .setColor('#f7b586')
    .setTitle('Talos Bot Help Commands:')
	.addFields(
		{ name: 'Command list', value: "`!help` \nTo show all available commands", inline: true },
        { name: 'Bind key', value: "`!bind <key>` \nBind your key to your discord account", inline: true },
        { name: 'Unbind key', value: "`!unbind <key>` \nAllows you to unbind your key", inline: true },
        { name: 'Reset key', value: "`!reset <key>` \nAllows you to reset your key", inline: true },
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

                await axios.post(`${process.env.API_URL}/api/me`, 
                    {
                        discord_id: message.author.id
                    })
                    .then(({data}) => {
                        console.log(data);

                        message.author.send(`${'```'}Your key: ${data.master_key.key}\nStatus: ${data.status}\nExpiry: N/A${'```'}`)
                    })
                    .catch(({response}) => {
                        console.log(response);

                        switch (response.status) {
                            case 422:
                                message.author.send(response.data.message)
                                break;
                            default:
                                message.author.send("Internal error, kindly report it to `#bug-reports`.")
                                break;
                        }
                    })
            }
            break

        case 'help':
            message.author.send(commandList)
            break

        case 'unbind':
            {
                const key = message.content.slice((`!${command}`).length).trim()

                if(!key) {
                    message.author.send(commandList)
                } else {
                    message.author.send('Please wait...')

                    await axios.post(`${process.env.API_URL}/api/unbind`, 
                        {
                            discord_id: message.author.id,
                            key: key
                        })
                        .then(({data}) => {
                            console.log(data);

                            if(data) {
                                message.author.send(`Goodbye <@${message.author.id}>...`)
                            }
                        })
                        .catch(({response}) => {
                            console.log(response);

                            switch (response.status) {
                                case 422:
                                    message.author.send(response.data.message)
                                    break;
                                default:
                                    message.author.send("Internal error, kindly report it to `#bug-reports`.")
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
                    message.author.send(commandList)
                    return
                } else {
                    message.author.send('Forging...')

                    await axios.post(`${process.env.API_URL}/api/bind`, 
                        {
                            discord_id: message.author.id,
                            username: message.author.username,
                            discriminator: message.author.discriminator,
                            key: key
                        })
                        .then(({data}) => {
                            console.log(data);

                            message.author.send(`Welcome <@${message.author.id}>!`)
                        })
                        .catch(({response}) => {
                            console.log(response);

                            switch (response.status) {
                                case 422:
                                    message.author.send(response.data.message)
                                    break;
                                default:
                                    message.author.send("Internal error, kindly report it to `#bug-reports`.")
                                    break;
                            }
                        })
                }
            }
            break;

        case 'reset':
            {
                const key = message.content.slice((`!${command}`).length).trim()

                if(!key) {
                    message.author.send(commandList)
                } else {
                    message.author.send('Please wait...')

                    await axios.post(`${process.env.API_URL}/api/reset`, 
                        {
                            discord_id: message.author.id,
                            key: key
                        })
                        .then(({data}) => {
                            console.log(data);

                            if(data) {
                                message.author.send(`You have successfully reset your key`)
                            }
                        })
                        .catch(({response}) => {
                            console.log(response);

                            switch (response.status) {
                                case 422:
                                    message.author.send(response.data.message)
                                    break;
                                default:
                                    message.author.send("Internal error, kindly report it to `#bug-reports`.")
                                    break;
                            }
                        })
                }
            }
            break;
    }
})

client.login(process.env.DISCORD_TOKEN)