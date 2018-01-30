
type TBlockBase<T> = {
    index: number
    previousHash: string
    timestamp: string
    data: T
}

type TBlock<T> = TBlockBase<T> & { hash: string }
type TBlockChain<T> = TBlock<T>[]

interface TBlockChainGenerator<T> {
    create: () => TBlockChain<T>
    latest: (chain: TBlockChain<T>) => TBlock<T>
    add: (chain: TBlockChain<T>, block: TBlock<T>) => TBlockChain<T>
    validate: (chain: TBlockChain<T>) => boolean
}
