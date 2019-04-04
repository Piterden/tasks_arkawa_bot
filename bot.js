require('dotenv').load()

const path = require('path')
const mongoose = require('mongoose')
const Telegraf = require('telegraf')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const Composer = require('telegraf/composer')
const Scene = require('telegraf/scenes/base')
const WizardScene = require('telegraf/scenes/wizard')

const User = require('./user')
const config = require('./config.json')


const { enter, leave } = Stage

const bot = new Telegraf(process.env.BOT_TOKEN)

mongoose.connect(process.env.MONGODB_ARKAWA, {
  useCreateIndex: true,
  useNewUrlParser: true,
})

bot.context.db = mongoose.connection
bot.context.db.on('error', console.error)

const settingTasks = new Scene('setting')
  .enter((ctx) => {
    ctx.reply('Enter your first task or /back to exit')
  })
  .leave((ctx) => {
    ctx.reply('Bye')
  })
  .command('back', (ctx) => {
    leave()
  })
  .on('text', async (ctx) => {
    await User.dbUpdate(ctx).catch(console.error)
    ctx.reply(ctx.message.text)
  })
  .on('message', (ctx) => {
    ctx.reply('Only text messages please')
  })

const stage = new Stage([settingTasks])

bot.use(session())
bot.use(stage.middleware())

bot.command('clear', async (ctx) => {
  await User.delTasks(ctx)
)

bot.start(async (ctx) => {
  await User.dbUpdate(ctx)
  ctx.reply('Enter your tasks')
})

bot.on('text', (ctx) => {
  ctx.scene.enter('setting')
})

bot.startPolling()
