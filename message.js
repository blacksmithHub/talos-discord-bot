const Discord = require('discord.js')
const { config } = require('dotenv')

config({ path: __dirname + "/.env" })

const client = new Discord.Client()

const prefix = '!'
const commands = ['welcome', 'support', 'rules', 'bot-updates']

let roles = ['764438322276728845']

client.once('ready', () => {
    console.log('Talos Bot is now online!');
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot || !message.member.roles.cache.find((val) => roles.includes(val.id)) || message.channel.type !== 'text') return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()
    const bot = message.channel

    if (!commands.includes(command)) return

    switch (command) {
        case commands[0]:
            {
                const configs = new Discord.MessageEmbed()
                    .setColor('#f7b586')
                    .setTitle('Welcome To TALOS-IO!')
                    .setDescription('A private bot made with love and passion.\nCongratulations and thank you choosing Talos-IO!')
                    .setThumbnail('https://i.imgur.com/3HQZ0ol.png')
                    .addFields(
                        {
                            name: 'Features',
                            value: `
                                • User friendly interface
                                • Responsive user experience
                                • Importable and exportable data
                                • Mass edit to tasks
                                • Task initialization
                                • Task duplication
                                • Task logs
                                • Supports retry delay for tasks
                                • Supports place order timer
                                • Works with DataCenter and Residential proxies
                                • Handles Cloudflare anti-bot protection
                                • Supports 2c2p/Gcash, PayMaya, and PayPal checkout methods
                                • Supports checkout method fallback
                                • Built-in monitor with search and filtering
                                • Discord webhook
                                • 1-on-1 support
                                • Only supports windows
                            `
                        },
                        {
                            name: 'Supported Sites',
                            value: `
                                • [Titan22](http://titan22.com)
                            `
                        },
                        {
                            name: 'Follow Us on Twitter!',
                            value: '[@TalosIOBot](https://twitter.com/TalosIOBot)'
                        }
                    )
    
                client.channels.cache.get('838413567933284407').send(configs)
            }
            break

        case commands[1]:
            {
                const configs = new Discord.MessageEmbed()
                    .setColor('#f7b586')
                    .addFields(
                        {
                            name: 'Support',
                            value: 'Feel free to open a <#787602225940922378> if you ever need assistance or technical support.'
                        },
                        {
                            name: 'Requests',
                            value: 'For any special requests please let us know in <#765030380653772801>.'
                        }
                    )

                client.channels.cache.get('838413567933284407').send(configs)
            }
            break
        
        case commands[2]:
            {
                const configs = new Discord.MessageEmbed()
                    .setColor('#f7b586')
                    .addFields(
                        {
                            name: 'Rules!',
                            value: `
                                • No racism, hate comments, or bullying of any kind. Be respectful.

                                • Advertising is not allowed, this is not a marketplace.

                                • Don't spam/flood our channels with unnecessary messages.

                                • No selling/renting/trading of Beta keys.

                                • Discord burner accounts are not allowed.

                                • Don't leak any information that is under development.

                                *1 violation = WARNING*
                                *3+ violations = KICK*
                            `
                        }
                    )

                client.channels.cache.get('788954170874265671').send(configs)
            }
        break

        case commands[3]:
            {
                const configs = new Discord.MessageEmbed()
                    .setColor('#f7b586')
                    .setTitle('v1.4.8')
                    .addFields(
                        {
                            name: 'Update Logs',
                            value: `
                                • Couple of bug fixes
                                • Adding to cart adjustment
                                • Discord auth, keyless login
                                > *Criteria:*
                                > *- Should be either in **SL** / **Sneakify** cg*
                                > *- Has **TALOS-IO** role*
                            `
                        },
                        {
                            name: 'Installer',
                            value: '[Download](https://bit.ly/3dgtEgY)'
                        }
                    )
                    .setTimestamp()

                client.channels.cache.get('764353815654563850').send(configs)
                client.channels.cache.get('764353815654563850').send('<@&785889077115093002>')
            }
        break
    }
})

client.login(process.env.DISCORD_TOKEN)