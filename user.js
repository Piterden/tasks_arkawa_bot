const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user_id: {
      type: Number,
      index: true,
      required: true,
      sparse: true,
    },
    tasks: [String],
    tasksArchive: [String],
  }, {
    timestamps: true,
  })

const User = mongoose.model('User', userSchema)

User.dbUpdate = (ctx) => new Promise(async (resolve, reject) => {
    let user = await User.findOne({ user_id: ctx.from.id }).catch(reject)
    
    if (!user) {
        user = new User()
        user.user_id = ctx.from.id
        user.tasks = []
    }
    user.tasks.push(ctx.message.text)

    await user.save()

    ctx.user = user

    resolve(user)
})

User.delTasks = (ctx) => new Promise(async (resolve, reject) => {
  let user = await User.findOne({ user_id: ctx.from.id }).catch(reject)

  if (!user) {
    return (ctx) => ctx.reply('There is nothing')
  }
  
  let archivarius = new Promise(async (resolve, reject) => {user.tasksArchive = user.tasksArchive.concat(user.tasks)
    .then(() => user.tasks = [])
    .catch(console.log('error of deleting'))
  })
    resolve(user)
})

  module.exports = User