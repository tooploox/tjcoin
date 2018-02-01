type TBlock<T> = {
    index: number
    previousHash: string
    timestamp: number
    data: T
    hash: string, nonce: number,
    difficulty: number
}

type TBlockChain<T> = TBlock<T>[]

interface TBlockChainGenerator<T> {
    create: () => TBlockChain<T>
    latest: (chain: TBlockChain<T>) => TBlock<T>
    add: (chain: TBlockChain<T>, block: TBlock<T>) => TBlockChain<T>
    validate: (chain: TBlockChain<T>) => boolean
    proofOfWork: (block: TBlock<T>) => TBlock<T>
}
