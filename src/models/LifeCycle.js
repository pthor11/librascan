import mongoose from '../mongoose'

const LifeCycleSchema = new mongoose.Schema({
    start: { type: Number, unique: true, index: true, required: true},
    stop: { type: Number, unique: true, index: true, default: null},
    stats: {type: mongoose.Schema.Types.Mixed, default: null}
})

export default mongoose.conn.model('LifeCycle', LifeCycleSchema, 'lifecycles', true)