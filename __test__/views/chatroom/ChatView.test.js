// author: kebwlmbhee

import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import { createTestingPinia } from '@pinia/testing';
import ChatView from "@/views/chatroom/ChatView.vue";

// Test ChatView.vue

describe('ChatView.vue', () => {

    // https://pinia.vuejs.org/cookbook/testing.html#unit-testing-components
    const wrapper = shallowMount(ChatView, {
        global: {
            plugins: [vuetify, createTestingPinia()],
            provide: {
                PlayPreview: vi.fn(),
                PausePreview: vi.fn()
            }
        }
    })


    // 每個單一測試後呼叫
    afterEach(() => {
        // 清除所有 mock 功能
        vi.clearAllMocks();
    })

    describe('ChatView 是否存在', () => {

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
                wrapper.setData({ text: '' });
                wrapper.vm.SendMessage();
                // 驗證是否有彈出 alert
                expect(alertSpy).toHaveBeenCalledWith('message is empty!');
                // 恢復原始的 alert
                window.alert = originalAlert;
            })

            it('單純發送訊息，未發送公告', () => {

                // mock alert
                window.alert = vi.fn();

                // fake data
                const text = 'Hello World!';
                const isAnnounce = false
                const isSendMusic = true

                // fake userProfile data
                const userProfile = {
                    id: '123456',
                    name: 'testUser',
                    avatar: 'https://i.imgur.com/1HrK2iu.jpg',
                };

                // add userProfile fake data
                Object.defineProperty(wrapper.vm, 'userProfile', {
                    get() {
                        return userProfile;
                    }
                });

                const obj = {
                    album: {
                    },
                    artist: "",
                    id: "123",
                    picture: "",
                    songName: "",
                    timestamp: "",
                    url: "",
                };

                // add nowChecking fake data
                Object.defineProperty(wrapper.vm, 'nowChecking', {
                    get() {
                        return obj;
                    }
                });


                // mock chatroom.sendMessage
                wrapper.vm.chatroom.sendMessage = vi.fn();
                // monitor chatroom.sendMessage
                const mockSendMessage = vi.spyOn(wrapper.vm.chatroom, 'sendMessage');

                // 更新測試資料
                wrapper.setData({
                    text: text,
                    isAnnounce: isAnnounce,
                    isSendMusic: isSendMusic
                });

                // 呼叫 SendMessage 方法
                wrapper.vm.SendMessage();

                // 驗證 chatroom.sendMessage 是否正確傳參及呼叫
                expect(mockSendMessage).toHaveBeenCalled();
                expect(mockSendMessage).toHaveBeenCalledWith(
                    userProfile,
                    text,
                    isAnnounce,
                    obj
                );

                // 驗證 this.text 最後是否設為空值，以待使用者重新輸入
                expect(wrapper.vm.text).toEqual('');

            });
        })
    })

})

