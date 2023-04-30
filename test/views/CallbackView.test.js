import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import CallbackView from '@/views/CallbackView.vue'

describe('確認登入功能', () => {
    let wrapper = mount(CallbackView, {
        global: {
            plugins: [vuetify, router],
        },
    });

    it('確認 CallbackView 存在', () => {
        expect(CallbackView).toBeTruthy()
    })

    it('', () => {

    })
})