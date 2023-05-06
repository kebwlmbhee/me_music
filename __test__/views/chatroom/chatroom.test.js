import { beforeEach, describe, expect, it, vi } from 'vitest'
import Chatroom from '@/views/chatroom/chatroom.js'
import { push, set, ref, db } from '/src/firebaseConf.js';

// Test for chatroom.js

function generateRandomKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '-';
    for (let i = 1; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters.charAt(randomIndex);
    }
    return key;
}

let mockKey = generateRandomKey(19);

describe('chatroom.js', () => {

    let chatroom;

    // 每個單一測試前呼叫
    beforeEach(() => {
        chatroom = new Chatroom();
    });

    it('Chatroom class 存在', () => {
        expect(chatroom).toBeDefined();
    })

    describe('Chatroom attribute', () => {
        it('chatroomRef 初始化', () => {
            expect(chatroom.chatroomRef).toStrictEqual(ref(db, 'chatroom'));
        });

        it('announcementRef 初始化', () => {
            expect(chatroom.announcementRef).toStrictEqual(ref(db, 'announcement'));
        });
    })

    describe('Chatroom method', () => {

        describe('sendMessage function', () => {

            beforeEach(() => {
                chatroom = new Chatroom();
                // 清除所有 mock 功能
                vi.clearAllMocks();
            })

            // mock firebase 功能
            vi.mock('/src/firebaseConf.js', () => {
                return {
                    push: vi.fn(() => ({
                        key: mockKey
                    })),
                    set: vi.fn(() => Promise.resolve({
                        key: mockKey
                    })),
                    ref: vi.fn(),
                    db: vi.fn(),
                }
            });

            it('聊天室傳入訊息', () => {
                const author = 'John';
                const text = 'Hello, world!';
                const isAnnounce = true;

                chatroom.sendMessage(author, text, isAnnounce);

                // 檢查 push 方法是否被呼叫，並檢查傳入的引數是否正確
                expect(push).toHaveBeenCalled();

                // 傳入 chatroomRef 和 author, text, time, isAnnounce
                expect(push).toHaveBeenCalledWith(chatroom.chatroomRef, expect.objectContaining({
                    author,
                    text,
                    isAnnounce,
                    time: expect.any(Number),
                })
                );
            })

            it('正常發送公告', () => {
                chatroom.sendMessage('John', 'Hello', true);

                const announcement = { key: mockKey }; // 模擬 push 方法的返回值
                push.mockReturnValue(announcement); // 將模擬值設定為 push 方法的返回值

                // 檢查 push 方法是否被正確呼叫
                expect(push).toHaveBeenCalledWith(
                    chatroom.announcementRef,
                    expect.objectContaining({
                        author: 'John',
                        text: 'Hello',
                        isAnnounce: true,
                        time: expect.any(Number),
                        id: expect.any(String)
                    })
                );

                // 檢查 set 方法是否被正確呼叫
                expect(set).toHaveBeenCalledWith(
                    announcement,
                    expect.objectContaining({
                        author: 'John',
                        text: 'Hello',
                        isAnnounce: true,
                        time: expect.any(Number),
                        id: mockKey
                    })
                );
            })

            it('不發送公告', () => {
                chatroom.sendMessage('John', 'Hello', false);
                // push 方法不應該被呼叫
                expect(push).not.toHaveBeenCalledWith(chatroom.announcementRef);

                // set 方法不應該被呼叫
                expect(set).not.toHaveBeenCalled();
            })
        })
    })
})