import { SHA256 } from "crypto-js"

export const calculateHash = <T>(block: TBlock<T>) => SHA256(JSON.stringify({ ...block, hash: 0 })).toString()

export function blockChainGenerator<T>(data: T, difficulty = 4): TBlockChainGenerator<T> {
    const zeroString = "0".repeat(difficulty)
    const genesisBlock: TBlock<T> = {
        index: 0, timestamp: 1517489925400, previousHash: zeroString, data, hash: "", nonce: 0, difficulty
    }
    const create = () => [{ ...genesisBlock }]
    const proofOfWork = (base: TBlock<T>): TBlock<T> => {
        let nonce = 0
        while (true) {
            const block = { ...base, difficulty, nonce }
            const hash = calculateHash(block)
            if (hash.indexOf(zeroString) === 0)
                return { ...block, hash }
            nonce++
        }
    }

    const latest = <T>(chain: TBlockChain<T>) => chain[chain.length - 1]
    const add = <T>(chain: TBlockChain<T>, block: TBlock<T>) =>
        [...chain, { ...block, previousHash: latest(chain).hash }]
    const validate = <T>(chain: TBlockChain<T>) =>
        !chain.some((block, index) => index > 0 &&
            (block.hash !== calculateHash(block) || block.previousHash !== chain[index - 1].hash))

    return { create, latest, add, validate, proofOfWork }
}
