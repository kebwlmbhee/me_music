import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import LoginView from '@/views/LoginView.vue'

describe('確認登入功能', () => {
    let wrapper = mount(LoginView, {
        global: {
            plugins: [vuetify, router],
        },
    });

    it('確認登入頁面存在', () => {
        expect(LoginView).toBeTruthy()
    })

    it('確認登入按鈕存在', async () => {
        expect(await wrapper.get('[data-test="login-btn"]').isVisible()).toBe(true);
    })

    it('確認取得網頁 localStorage 的行為沒有問題', () => {
        let getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
        let tokenValid = localStorage.getItem('authCode')
        expect(getItemSpy).toHaveBeenCalled()
    })

    it('確認 router 頁面是否如預期跳轉', async () => {
        let tokenValid = localStorage.getItem('authCode')
        if (tokenValid !== null) {
            let spyPush = vi.spyOn(router, 'push');
            await wrapper.get('[data-test="login-btn"]').trigger('click')
            expect(spyPush).toHaveBeenCalledTimes(1);
            expect(spyPush).toHaveBeenCalledWith('/');
        }
    })
})