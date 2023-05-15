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
    })
})