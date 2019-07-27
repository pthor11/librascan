import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const uri = `mongodb://localhost:27017/libra`

const opts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.conn = mongoose.createConnection(uri, opts)
mongoose.conn.on('error', () => {
    console.log('mongodb connect failed')
})
mongoose.conn.on('open', () => {
    console.log('mongodb connect success')
})

export default mongoose