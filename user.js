const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user_id: {
      type: Number,
      index: true,
      required: true,
      sparse: true,
    },
    tasks: [String],
    backup: [String],
  }, {
    timestamps: true,
  })

const User = mongoose.model('User', userSchema)

User.dbUpdate = async (ctx) => {
  const user = await User.findOne({ user_id: Number(ctx.from.id) })
    .catch(console.error)

  if (!user) {
    user = new User()
    user.user_id = ctx.from.id
    user.tasks = []
    user.backup = []
  }

  user.tasks.push(ctx.message.text)
  await user.save()

  return user
})

User.delTasks = async (ctx) => {
  const user = await User.findOne({ user_id: Number(ctx.from.id) })
    .catch(console.error)

  if (!user) {
    await ctx.reply('There is nobody!')
  }

  user.backup = [...user.backup, ...user.tasks]
  user.tasks = []

  return user
})

module.exports = User
