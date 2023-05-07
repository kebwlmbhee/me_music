import { describe, it, expect} from "vitest";
import BaseView from '@/views/BaseView.vue'

describe('輸入測試標題', () => {
    let wrapper = mount(BaseView, {
        global: {
            plugins: [vuetify, router],
        },
    });
    it('確認 View 存在', () => {
        expect(BaseView).toBeTruthy()
    })
})