import { describe, expect, it, test } from 'vitest'
import { mount } from '@vue/test-utils'
import TestVitest from '@/components/Vitest_Example/Vitest_Example.vue'
import vuetify from '@/plugins/vuetify';

describe('import vue components', () => {
    test('normal imports as expected', async () => {
        // const TestVitest = await import('@/components/TestVitest.vue')
        expect(TestVitest).toBeDefined()
    })

    it('mount component', async () => {
        expect(TestVitest).toBeTruthy()
        const wrapper = mount(TestVitest, {
            global: {
                plugins: [vuetify],
            },
            props: {
                count: 4,
            },
        })

        expect(wrapper.text()).toContain('4 x 2 = 8')
        await wrapper.get('#For_Vitest').trigger('click')
        expect(wrapper.text()).toContain('4 x 3 = 12')

        await wrapper.get('#For_Vitest').trigger('click')
        expect(wrapper.text()).toContain('4 x 4 = 16')
    })
})