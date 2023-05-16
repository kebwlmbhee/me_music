// author: kebwlmbhee

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AnnouncementLikes from '@/views/announcement/announcementLikes.js'
import { set, ref, db, get, remove } from '/src/firebaseConf.js';

// Test for announcementLikes.js

describe('announcementLikes.js', () => {

    let announcementLikes;

    beforeEach(() => {
        announcementLikes = new AnnouncementLikes();

        vi.mock('/src/firebaseConf.js', async () => {
            const actual = await vi.importActual('/src/firebaseConf.js');
            return {
                ...actual,
                set: vi.fn(),
                remove: vi.fn(),
                get: vi.fn(),
                // 接收兩個參數，最後回傳 path，用來確認路徑是否正確被指定給變數
                ref: vi.fn().mockImplementation((db, path) => {
                    return {
                        path
                    };
                })
            }
        })
    })

    // 每個單一測試後呼叫
    afterEach(() => {
        // 清除所有 mock 功能
        vi.clearAllMocks();
    })

    it('AnnouncementLieks Class 存在', () => {
        expect(announcementLikes).toBeDefined();
    })

    describe('AnnouncementLikes attribute', () => {
        // 是否以正確參數呼叫 ref
        it('announcementRef 初始化', () => {
            expect(ref).toHaveBeenCalledWith(db, 'announcement');
        })
    })

    describe('AnnouncementLikes method', () => {

        describe('likeButtonForAnnouncement function', () => {
            it.each([
                ['如果快照存在', 'testAnnouncement', 'testUser', true],
                ['如果快照不存在', 'test2Announcement', 'test2User', false],
                // _ for unimportant variable
            ])('%s', async (_, announcementId, userId, snapshotExists) => {

                // mock path
                const chosenAnnouncementLikesRef = {
                    path: `announcement/${announcementId}/likes/${userId}`,
                };

                // 模擬 snapshot.exists() 的情況
                const mockSnapshot = { exists: () => snapshotExists };
                // get 方法回傳一個 Promise，其包含一個 exists() 方法
                get.mockReturnValueOnce(Promise.resolve(mockSnapshot));

                // Call the method being tested
                await announcementLikes.likeButtonForAnnouncement(announcementId, userId);

                // ref 是否有被正確呼叫
                expect(ref).toHaveBeenCalledWith(db, `announcement/${announcementId}/likes/${userId}`);

                // 確保 get 方法以 chosenAnnouncementLikesRef 為參數被呼叫
                // 並且透過 mock ref 使之回傳 path 的方法驗證 chosenAnnouncementLikesRef
                // 是否被正確賦予 ref 回傳值
                expect(get).toHaveBeenCalledWith(chosenAnnouncementLikesRef);

                // remove 和 set 同上方的 get 邏輯
                // 不同的是由 snapshotExists 來檢查哪個方法應該被調用
                if (snapshotExists) {
                    expect(remove).toHaveBeenCalledWith(chosenAnnouncementLikesRef);
                }
                else {
                    expect(set).toHaveBeenCalledWith(chosenAnnouncementLikesRef, true);
                }
            });
        })


        describe('getAnnouncementLikes function', () => {
            it('公告讚數不為 0 的情況', async () => {

                // fake data
                const snapshotMock = {
                    val: () => ({
                        announcement1: {
                            likes: {
                                like1: true,
                                like2: true,
                            },
                        },
                        announcement2: {
                            likes: {
                                like3: true,
                            },
                        },
                    }),
                };

                const likesSnapshotMock = {
                    val: vi.fn(() => {
                        return {
                            like1: true,
                            like2: true
                        }
                    }),
                };

                const likesSnapshotMock2 = {
                    val: vi.fn(() => {
                        return {
                            like3: true
                        }
                    })
                }

                // mockResolvedValueOnce 會依程式執行調用該方法的順序回傳返回值
                // mockResolvedValue 會一直使該方法調用時回傳相同返回值
                // 模擬 get 方法調用 this.announcementRef
                get.mockResolvedValueOnce(snapshotMock);
                // 模擬 get 方法調用 likesRef, for 迴圈第一次
                get.mockResolvedValueOnce(likesSnapshotMock);
                // 模擬 get 方法調用 likesRef, for 迴圈第二次
                get.mockResolvedValueOnce(likesSnapshotMock2);

                // 創建模擬的回調函數
                const callbackMock = vi.fn();

                // Call the method being tested
                await announcementLikes.getAnnouncementLikes(callbackMock);

                // 驗證 callback function 是否被調用
                expect(callbackMock).toHaveBeenCalledTimes(2);

                // 取得 callbackMock 調用參數
                const calls = callbackMock.mock.calls;

                // 驗證 callback function 傳入的參數及調用順序是否正確
                expect(calls[0]).toEqual(['announcement1', 2]);
                expect(calls[1]).toEqual(['announcement2', 1]);
            })

            it('讚數為 0 的情況', async () => {

                // fake data
                const snapshotMock = {
                    val: vi.fn(() => ({
                        announcement1: {
                            likes: null
                        }
                    }))
                };

                const likesSnapshotMock = {
                    val: vi.fn(() => {
                    }),
                };

                // 模擬 get 方法調用 this.announcementRef
                get.mockResolvedValueOnce(snapshotMock);
                // 模擬 get 方法調用 likesRef, for 迴圈第一次
                get.mockResolvedValueOnce(likesSnapshotMock);

                // 創建模擬的回調函數
                const callbackMock = vi.fn();

                // Call the method being tested
                await announcementLikes.getAnnouncementLikes(callbackMock);

                // 驗證 callback function 是否正確調用
                expect(callbackMock).toHaveBeenCalledTimes(1);
                expect(callbackMock).toHaveBeenCalledWith('announcement1', 0);
            })

            it('獲取 likes 失敗', async () => {

                // fake data
                const snapshotMock = {
                    val: vi.fn(() => ({
                        announcement1: {
                            likes: {
                                like1: true
                            }
                        }
                    }))
                };

                const error = new Error('911');

                // 第一次 get 正常返回 snapshotMock
                get.mockResolvedValueOnce(snapshotMock);
                // 第二次 get 返回 error
                get.mockRejectedValueOnce(error);

                // 創建模擬的回調函數
                const callbackMock = vi.fn();

                // mock console.error
                vi.spyOn(console, 'error').mockImplementation(() => { });

                // Call the method being tested
                await announcementLikes.getAnnouncementLikes(callbackMock);

                // console.error 被呼叫一次
                expect(console.error).toHaveBeenCalledTimes(1)
                // console.error 以正確參數傳入
                expect(console.error).toHaveBeenCalledWith('Error getting likes: ', error);
                // callback function 沒有被呼叫
                expect(callbackMock).not.toHaveBeenCalled();
            })

            it('獲取 announcements 失敗', async () => {

                // fake data
                const error = new Error('110');

                // 第一次 get 返回 error
                get.mockRejectedValueOnce(error);

                // 創建模擬的回調函數
                const callbackMock = vi.fn();

                // 調用被測試的函數
                await announcementLikes.getAnnouncementLikes(callbackMock);

                // console.error 被呼叫一次
                expect(console.error).toHaveBeenCalledTimes(1)
                // console.error 以正確參數傳入
                expect(console.error).toHaveBeenCalledWith('Error getting announcements: ', error);
                // callback function 沒有被呼叫
                expect(callbackMock).not.toHaveBeenCalled();
            })
        })
    })
})