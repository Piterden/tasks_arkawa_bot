mongoose.connect('mongodb://localhost:27017/arkawaTasks', {
    useCreateIndex: true,
    useNewUrlParser: true,
}).then(() => console.log('connected'), (err) => console.log('err'))
  
const db = mongoose.connection

db.on('error', (err) => {
    console.log('error', err)
})
  