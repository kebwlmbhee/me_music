import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { createTestingPinia } from '@pinia/testing'
import BaseView from '@/views/BaseView.vue'

describe('輸入測試標題', () => {
    let wrapper = mount(BaseView, {
        global: {
            plugins: [vuetify, router, createTestingPinia()],
        },
    });

    it('確認 View 存在', async () => {
        expect(BaseView).toBeTruthy()
        await expect(wrapper.find('.font-weight-bold'))
    })
})