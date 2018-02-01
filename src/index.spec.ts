import { calculateHash, blockChainGenerator } from "./index"

jest.mock("crypto-js", () => ({
    SHA256: jest.fn((data: string) =>
        (data.indexOf("\"nonce\":12") !== -1 ? "0000" : "1111") + "-" + data.length)
}))

const timestamp = 1517489925474
describe("Block", () => {
    it("calculateHash ignore Block's hash if present", () => {
        const block: TBlock<number> =
            { index: 1, data: 2, previousHash: "1", timestamp, hash: "some-hash-here", difficulty: 4, nonce: 0 }
        expect(calculateHash(block)).toEqual("1111-99")
    })
})

describe("Block Chain Genertaor", () => {
    const generator = blockChainGenerator(2)

    const expectedGenesis: TBlock<number> = {
        index: 0, timestamp: 1517489925400, previousHash: "0000", data: 2, hash: "", nonce: 0, difficulty: 4
    }

    const someBlock: TBlock<number> = {
        index: 1, timestamp, previousHash: expectedGenesis.hash, data: 3, hash: "", nonce: 0, difficulty: 1
    }

    it("generates genesis block", () => {
        expect(generator.create()).toEqual([expectedGenesis])
    })

    it("validates genesis block", () => {
        expect(generator.validate(generator.create())).toBeTruthy()
    })

    it("validates added block", () => {
        const someBlockWithHash: TBlock<number> = { ...someBlock, hash: calculateHash(someBlock) }
        const blocks = generator.add(generator.create(), someBlockWithHash)
        expect(generator.validate(blocks)).toBeTruthy()
    })

    it("complains if hash was changed", () => {
        const b2: TBlock<number> =
            { index: 1, data: 2, previousHash: expectedGenesis.hash, timestamp, hash: "", nonce: 0, difficulty: 1 }
        const bs = generator.add(generator.create(), b2)
        bs[1].hash = "bar"
        expect(generator.validate(bs)).toBeFalsy()
    })

    it("complains if previous hash doesn't match", () => {
        const block = { ...someBlock }
        const blocks = generator.add(generator.create(), block)
        blocks[1].previousHash = "bar"
        expect(generator.validate(blocks)).toBeFalsy()
    })

    it("complains if index was changed", () => {
        const block = { ...someBlock }
        const blocks = generator.add(generator.create(), block)
        blocks[1].index = 42
        expect(generator.validate(blocks)).toBeFalsy()
    })

    it("complains if data was changed", () => {
        const block = { ...someBlock }
        const blocks = generator.add(generator.create(), block)
        blocks[1].data = 42
        expect(generator.validate(blocks)).toBeFalsy()
    })

    it("complains if timestamp was changed", () => {
        const block = { ...someBlock }
        const blocks = generator.add(generator.create(), block)
        blocks[1].timestamp = 42
        expect(generator.validate(blocks)).toBeFalsy()
    })

    it("runs proof of work", () => {
        const expected = { ...someBlock, difficulty: 4, nonce: 12, hash: "0000-99" }
        const mined = generator.proofOfWork(someBlock)
        expect(mined).toEqual(expected)
    })
})
