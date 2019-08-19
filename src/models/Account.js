import mongoose from '../mongoose'

const TXSchema = new mongoose.Schema({
    address: { type: String, unique: true, index: true, required: true},
    balance: { type: Number, default: 0, required: true},
    txs: { type: Number, default: 0, required: true},
})

export default mongoose.conn.model('Account', TXSchema, 'accounts', true)