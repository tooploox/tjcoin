import { SHA256 } from "crypto-js"

export const calculateHash = <T>(base: TBlockBase<T>) => SHA256(JSON.stringify(base)).toString()
export const Block = <T>(base: TBlockBase<T> | TBlock<T>) => ({ ...base, hash: calculateHash(base) } as TBlock<T>)

export function blockChainGenerator<T>(data: T): TBlockChainGenerator<T> {
    const create = () => [Block<T>({ index: 0, timestamp: "30/01/2018", previousHash: "0", data })]
    const latest = <T>(chain: TBlockChain<T>) => chain[chain.length - 1]
    const add = <T>(chain: TBlockChain<T>, block: TBlock<T>) =>
        [...chain, Block({ ...block, previousHash: latest(chain).hash })]
    const validate = <T>(chain: TBlockChain<T>) => !chain.some((block, index) =>
        index > 0 && (block.hash !== calculateHash(block) || block.previousHash !== chain[index - 1].hash))
    return { create, latest, add, validate }
}
