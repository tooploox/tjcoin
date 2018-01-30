jest.mock("crypto-js", () => ({
    SHA256: jest.fn((data: string) => "foo" + data.length)
}))

import { Block, blockChainGenerator } from "./index"

describe("Block", () => {
    it("creates Block with hash", () => {
        const expectedBase: TBlockBase<number> = { index: 1, data: 2, previousHash: "1", timestamp: "2" }
        const expected = {
            ...expectedBase,
            hash: "foo55"
        }
        expect(Block({ index: 1, data: 2, previousHash: "1", timestamp: "2" })).toEqual(expected)
    })
})

describe("Block Chain Genertaor", () => {
    const generator = blockChainGenerator(2)
    const expectedGenesisBase: TBlockBase<number> = {
        index: 0, timestamp: "30/01/2018", previousHash: "0", data: 2
    }
    const expectedGenesis = { ...expectedGenesisBase, hash: "foo64" }
    it("generates genesis block", () => {
        expect(generator.create()).toEqual([expectedGenesis])
    })
    it("validates genesis block", () => {
        expect(generator.validate(generator.create())).toBeTruthy()
    })
    it("validates added block", () => {
        const b2 = Block({ index: 1, data: 2, previousHash: expectedGenesis.hash, timestamp: "2" })
        const bs = generator.add(generator.create(), b2)
        expect(generator.validate(bs)).toBeTruthy()
    })
    it("complains if hash was changed", () => {
        const b2 = Block({ index: 1, data: 2, previousHash: "1", timestamp: "2" })
        const bs = generator.add(generator.create(), b2)
        bs[1].hash = "bar"
        expect(generator.validate(bs)).toBeFalsy()
    })
    it("complains if previous hash doesn't match", () => {
        const b2 = Block({ index: 1, data: 2, previousHash: "1", timestamp: "2" })
        const bs = generator.add(generator.create(), b2)
        bs[1].previousHash = "bar"
        expect(generator.validate(bs)).toBeFalsy()
    })
    it("complains if index was changed", () => {
        const b2 = Block({ index: 1, data: 2, previousHash: "1", timestamp: "2" })
        const bs = generator.add(generator.create(), b2)
        bs[1].index = 42
        expect(generator.validate(bs)).toBeFalsy()
    })
    it("complains if data was changed", () => {
        const b2 = Block({ index: 1, data: 2, previousHash: "1", timestamp: "2" })
        const bs = generator.add(generator.create(), b2)
        bs[1].data = 42
        expect(generator.validate(bs)).toBeFalsy()
    })
    it("complains if timestamp was changed", () => {
        const b2 = Block({ index: 1, data: 2, previousHash: "1", timestamp: "2" })
        const bs = generator.add(generator.create(), b2)
        bs[1].timestamp = "42"
        expect(generator.validate(bs)).toBeFalsy()
    })
})
