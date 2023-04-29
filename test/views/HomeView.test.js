import { describe, it, expect, assert, test } from 'vitest'
import HomeView from '@/views/HomeView.vue'

describe('import vue components', () => {
    it('HomeView Vitest', () => {
        expect(HomeView).toBeTruthy()
    })

    it('bar', () => {
        expect(1 + 1).eq(2)
    })

    it('Math.sqrt()', () => {
        expect(Math.sqrt(4)).toBe(2)
        expect(Math.sqrt(144)).toBe(12)
        expect(Math.sqrt(2)).toBe(Math.SQRT2)
    })

    it('JSON', () => {
        const input = {
            foo: 'hello',
            bar: 'world',
        }

        const output = JSON.stringify(input)

        expect(output).eq('{"foo":"hello","bar":"world"}')
        assert.deepEqual(JSON.parse(output), input, 'matches original')
    })

    test('Math.sqrt2()', () => {
        expect(Math.sqrt(4)).toBe(2)
        expect(Math.sqrt(144)).toBe(12)
        expect(Math.sqrt(2)).toBe(Math.SQRT2)
    })
})