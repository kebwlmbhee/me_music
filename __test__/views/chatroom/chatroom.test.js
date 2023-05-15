// author: kebwlmbhee

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Chatroom from '@/views/chatroom/chatroom.js'
import { push, set, ref, db, onValue, remove } from '/src/firebaseConf.js';

// Test for chatroom.js

// 生成 randomKey
function generateRandomKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // key 是 '-' 開頭
    let key = '-';
    for (let i = 1; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters.charAt(randomIndex);
    }
    return key;
}

let mockKey = generateRandomKey(20);

let announcements = [
    { id: '1', text: 'Announcement 1' },
    { id: '2', text: 'Announcement 2' },
    { id: '3', text: 'Announcement 3' }
];
let announcementToRemove;

describe('chatroom.js', () => {

    let chatroom;

    // 每個單一測試前呼叫
    beforeEach(() => {
        
        chatroom = new Chatroom();

        // mock firebase function
        vi.mock('/src/firebaseConf.js', () => {
            return {
                push: vi.fn(() => ({
                    key: mockKey
                })),
                set: vi.fn(() => Promise.resolve({
                    key: mockKey
                })),
                ref: vi.fn(),
                onValue: vi.fn((ref, callback) => {
                    const snapshot = {
                        forEach: (forEachCallback) => {
                            // 模擬資料快照的遍歷操作
                            const childSnapshot1 = { val: () => 'message1' };
                            const childSnapshot2 = { val: () => 'message2' };
                            forEachCallback(childSnapshot1);
                            forEachCallback(childSnapshot2);
                        }
                    };
                    // onValue 的 callback 被調用，回傳正確數據
                    callback(snapshot);
                }),
                remove: vi.fn((reference) => {
                    // 驗證傳入 remove 的參數是否正確
                    expect(reference).toEqual(ref(db, `/announcement/${announcementToRemove.id}`));
                    // 遍歷尋找同 key ，找到後刪除返回
                    for (const key in announcements) {
                        if (announcements[key].id === announcementToRemove.id) {
                            announcements.splice(key, 1);
                            return;
                        }
                    }
                }),
                db: vi.fn(),
            }
        });
    });

    // 每個單一測試後呼叫
    afterEach(() => {
        // 清除所有 mock 功能
        vi.clearAllMocks();
    })

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

                // 模擬 push 方法的返回值
                const announcement = { key: mockKey }; 
                // 將模擬值設定為 push 方法的返回值
                push.mockReturnValue(announcement); 

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

        describe('onMessage function', () => {

            it('實時獲取聊天室的訊息變更', () => {

                chatroom.onMessage((messages) => {
                    this.messages = messages
                })

                // onValue 被調用
                expect(onValue).toHaveBeenCalled();
                // ref 指向聊天室
                expect(ref).toHaveBeenCalledWith(db, 'chatroom');
                // 驗證留言
                expect(this.messages).toStrictEqual(['message1', 'message2']);
            });
        });

        describe('onAnnouncement function', () => {

            it('實時獲取公告的訊息變更', () => {

                chatroom.onAnnouncement((messages) => {
                    this.announcements = messages
                })

                // onValue 被調用
                expect(onValue).toHaveBeenCalled();
                // ref 指向公告
                expect(ref).toHaveBeenCalledWith(db, 'announcement');
                // 讀取公告驗證
                expect(this.announcements).toStrictEqual(['message1', 'message2']);
            });
        });

        describe('removeAnnouncement function', () => {

            it('刪除指定的公告', () => {

                // 即將被移除的公告
                announcementToRemove = announcements[1];

                // 移除公告
                chatroom.removeAnnouncement(announcementToRemove);

                // remove 被調用
                expect(remove).toHaveBeenCalled();
                // ref 指向公告
                expect(ref).toHaveBeenCalledWith(db, 'announcement');
                // 移除公告驗證
                expect(announcements).toEqual([
                    { id: '1', text: 'Announcement 1' },
                    { id: '3', text: 'Announcement 3' }
                ]);
            })
        })

        describe('getTimeString function', () => {

            it('時間格式是否正確', () => {
                // 取得現在時戳
                const timestamp = Date.now();

                // 預期字符串格式，使用正則表達式
                const expectedFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (AM|PM)$/;
            
                // 時戳將根據電腦的時區換算顯示時間
                const result = chatroom.getTimeString(timestamp);

                // 比較格式是否相同
                expect(result).toMatchObject(expectedFormat);
            });
        });
    });
})