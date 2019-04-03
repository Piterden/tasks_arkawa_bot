const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const config = require('./config.json')
const mongoose = require('mongoose');
const Scene = require('telegraf/scenes/base')
const path = require('path')
require('dotenv').config();
const User = require('./user')
const bot = new Telegraf(process.env.BOT_TOKEN)


const { enter, leave } = Stage

global.botStart = new Date()

mongoose.connect(process.env.MONGODB_ARKAWA, {
  useCreateIndex: true,
  useNewUrlParser: true,
})

const db = mongoose.connection

db.on('error', (err) => {
  console.log('error', err)
})

const setingTasks = new Scene('seting')
setingTasks.enter((ctx) => ctx.reply('Enter your first task or /back to exit'))
setingTasks.leave((ctx) => ctx.reply('Bye'))
setingTasks.command('back', leave())
setingTasks.on('text', (ctx) => {
    ctx.reply(ctx.message.text)
    User.dbUpdate(ctx)
    })
setingTasks.on('message', (ctx) => ctx.reply('Only text messages please'))

bot.start((ctx) => {
    ctx.reply('Enter your tasks')
    User.dbUpdate(ctx)
})

bot.command('clear', (ctx) => User.delTasks(ctx))

const stage = new Stage([setingTasks])
bot.use(session())
bot.use(stage.middleware())
bot.on('text', (ctx) => ctx.scene.enter('seting'))
bot.launch()