import { Client } from 'libra-grpc'
import TX from './models/TX'

const client = new Client('ac.testnet.libra.org:8000');

const get_version = async (version) => {
    const params = {
        start_version: version,
        limit: 1000,
        fetch_events: false
    }
    return client.request('get_transactions', params)
}

const MINT_ADDRESS = '0000000000000000000000000000000000000000000000000000000000000000'

const start = async (version) => {
    try {
        if (!version) {
            const latest_tx = await TX.findOne().sort({ version: -1 }).limit(1)
            version = latest_tx ? latest_tx.version + 1 : 1
        }
        const version_raw = await get_version(version)

        let txs = []
        version_raw.txn_list_with_proof.transactions.forEach((each, idx) => {
            const tx = new TX({
                version: version + idx,
                expiration: each.raw_txn_bytes.expirationTime,
                sender: each.raw_txn_bytes.senderAccount,
                receiver: each.raw_txn_bytes.program.argumentsList.find(item => item.type === 1).data,
                type: each.raw_txn_bytes.senderAccount === MINT_ADDRESS ? 'mint' : 'p2p',
                amount: each.raw_txn_bytes.program.argumentsList.find(item => item.type === 0).data,
                gas_price: each.raw_txn_bytes.gasUnitPrice,
                gas_used: (version_raw.txn_list_with_proof.infos)[idx].gas_used,
                maxGas: each.raw_txn_bytes.maxGasAmount,
                sequence: each.raw_txn_bytes.sequenceNumber,
                sender_signature: each.sender_signature,
                sender_public_key: each.sender_public_key,
                signed_transaction_hash: Buffer.from((version_raw.txn_list_with_proof.infos)[idx].signed_transaction_hash, 'base64').toString('hex'),
                state_root_hash: Buffer.from((version_raw.txn_list_with_proof.infos)[idx].state_root_hash, 'base64').toString('hex'),
                event_root_hash: Buffer.from((version_raw.txn_list_with_proof.infos)[idx].event_root_hash, 'base64').toString('hex'),
            })

            txs.push(tx)
        })
        try {
            await TX.insertMany(txs)
            setTimeout(() => {
                start(version + version_raw.txn_list_with_proof.transactions.length)
            }, 1000)
        } catch (error) {
            console.log(`Failed at version ${version}. Retry after 1000 ms.`)
            setTimeout(start, 1000)
        }
    } catch (error) {
        console.log({ error: error.message })
        setTimeout(start, 1000)
    }






}

start()