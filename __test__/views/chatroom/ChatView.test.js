import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { createTestingPinia } from '@pinia/testing';
import ChatView from "@/views/chatroom/ChatView.vue";

// Test ChatView.vue

describe('ChatView.vue', () => {

    let wrapper;

    describe('ChatView 是否存在', () => {

        // https://pinia.vuejs.org/cookbook/testing.html#unit-testing-components
        wrapper = mount(ChatView, {
            global: {
                plugins: [vuetify, router, createTestingPinia()],
            },
        });
        it('wrapper 是否成功創建', () => {
            expect(wrapper.exists()).toBe(true);
        })
    })

    describe('ChatView method', () => {

        describe('checkTime method', () => {

            it('currentIndex === 0 應該返回 true', () => {

                const currentIndex = 0
                const result = wrapper.vm.checkTime(currentIndex);
                // 應該返回 true
                expect(result).toBe(true);
            })

            it('currentIndex 前後差值 > 10 分鐘時，應該返回 true', () => {

                const currentTime = Date.now();
                const messages = [
                    { time: currentTime - 12 * 60 * 1000 },
                    { time: currentTime }
                ]
                // set allMessages data
                wrapper.setData({ allMessages: messages });

                const currentIndex = 1;
                // currentIndex - (currIndex - 1) 比較相距時間
                const result = wrapper.vm.checkTime(currentIndex);
                // 應該返回 true
                expect(result).toBe(true);
            })
            it('currentIndex 前後差值 <= 10 分默返回 false', () => {

                const currentTime = Date.now();
                const messages = [
                    { time: currentTime - 9 * 60 * 1000 },
                    { time: currentTime }
                ]
                // set allMessages data
                wrapper.setData({ allMessages: messages });

                const currentIndex = 1;
                // currentIndex - (currIndex - 1) 比較相距時間
                const result = wrapper.vm.checkTime(currentIndex);
                // 應該返回 false
                expect(result).toBe(false);
            })
        })

        describe('TimeStampToDataString method', () => {

            it('判斷是否呼叫 chatroom.getTimeString 方法', () => {

                const currentTime = Date.now();
                // 監控 getTimeString 方法
                vi.spyOn(wrapper.vm.chatroom, 'getTimeString');
                // 呼叫 TimeStampToDataString 方法
                wrapper.vm.TimeStampToDateString(currentTime);
                // 驗證是否使用 getTimeString 方法，並使用 currentTime 參數
                expect(wrapper.vm.chatroom.getTimeString).toHaveBeenCalledWith(currentTime);
            });
        });

        // TODO: 公告未完成，亦未測試，目前只有 isAnnounce = false 的部分
        describe('SendMessage method', () => {

            it('message 為空時應跳出 alert', () => {

                // 把原始的 window.alert 存起來
                const originalAlert = window.alert;
                // 將 window.alert 設為空實現
                window.alert = vi.fn();
                // 監控 window.alert
                const alertSpy = vi.spyOn(window, 'alert');

                // 訊息為空
                wrapper.setData({ message: '' });
                wrapper.vm.SendMessage();
                // 驗證是否有彈出 alert
                expect(alertSpy).toHaveBeenCalled();
                // 恢復原始的 alert
                window.alert = originalAlert;
            })

            it('單純發送訊息，未發送公告', () => {

                // 監控 chatroom 的 sendMessage 方法
                vi.spyOn(wrapper.vm.chatroom, 'sendMessage');
                // 模擬 allMessages
                wrapper.setData({ allMessages: [] });

                // 模擬外部抓到的屬性
                const userProfile = {
                    name: 'Test User'
                };

                // 模擬 newMessage
                wrapper.setData({
                    author: userProfile.name,
                    text: 'Hello World!',
                    time: Date.now(),
                    isAnnounce: false
                })

                // 模擬 SendMessage 方法調用
                wrapper.vm.SendMessage(wrapper.vm.isAnnounce);
                // 取得最後一條訊息
                const lastMessage = wrapper.vm.allMessages[wrapper.vm.allMessages.length - 1];

                // 驗證是否使用正確參數呼叫 chatroom sendMessage
                expect(wrapper.vm.chatroom.sendMessage).toHaveBeenCalledWith(
                    lastMessage.author,
                    lastMessage.text,
                    lastMessage.isAnnounce
                );
            })
        })
    })

})