import { describe, it, expect} from "vitest";
import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import CallbackView from '@/views/CallbackView.vue'

describe('輸入測試標題', () => { 
    let wrapper = mount(CallbackView, {
        global: {
            plugins: [vuetify, router],
        },
    });
    it('確認 View 存在', () => {
        expect(CallbackView).toBeTruthy()
    })
})