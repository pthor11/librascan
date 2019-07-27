import mongoose from '../mongoose'

const TXSchema = new mongoose.Schema({
    version: { type: Number, unique: true, index: true, required: true},
    expiration: { type: Number, default: null, required: true},
    sender: { type: String, default: null, index: true, required: true},
    receiver: {type: String, default: null, index: true, required: true},
    type: {type: String, index: true, required: true},
    amount: {type: Number, required: true},
    gas_price: {type: Number, required: true},
    gas_used: {type: Number, required: true},
    maxGas: {type: Number, required: true},
    sequence: {type: Number, default: 0, required: true},
    sender_signature: {type: String},
    sender_public_key: {type: String},
    signed_transaction_hash: {type: String},
    state_root_hash: {type: String},
    event_root_hash: {type: String},
})

export default mongoose.conn.model('TX', TXSchema, 'txs', true)