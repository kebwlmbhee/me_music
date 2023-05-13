import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import musicQueue from "@/views/musicQ/musicQueue.js";
import {
    db,
    ref,
    push,
    onValue,
    remove,
    set,
    update,
    runTransaction,
    get
} from '/src/firebaseConf.js'

// Test for musicQueue.js

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

let musics = [
    { id: '1', songName: 'Song 1', key: '1' },
    { id: '2', songName: 'Song 2', key: '2' },
    { id: '3', songName: 'Song 3', key: '3' }
];

let musicToRemove;

describe('musicQueue.js', () => {
    let queue;

    // 每個單一測試前呼叫
    beforeEach(() => {

        queue = new musicQueue();

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
                onValue: vi.fn(),
                remove: vi.fn((reference) => {
                    // 驗證傳入 remove 的參數是否正確
                    expect(reference).toEqual(ref(db, `/musicQueue/${musicToRemove.key}`));
                    // 遍歷尋找同 key ，找到後刪除返回
                    for (const index in musics) {
                        if (musics[index].key === musicToRemove.key) {
                            musics.splice(index, 1);
                            return;
                        }
                    }
                }),
                update: vi.fn(),
                runTransaction: vi.fn(),
                get: vi.fn(),
                db: vi.fn(),
            }
        });
    });

    // 每個單一測試後呼叫
    afterEach(() => {
        // 清除所有 mock 功能
        vi.clearAllMocks();
    })

    it('musicQueue class 存在', () => {

        expect(queue).toBeDefined();
    })

    describe('musicQueue attribute', () => {
        it('musicQueueRef 初始化', () => {
            expect(musicQueue.musicQueueRef).toStrictEqual(ref(db, 'musicQueue'));
        });
        it('syncSwitchMusicNotificationRef 初始化', () => {
            expect(musicQueue.syncSwitchMusicNotificationRef).toStrictEqual(ref(db, 'syncMusicQueue/switchMusicNotification'));
        });
        it('syncMusicPlayTimeStamp 初始化', () => {
            expect(musicQueue.syncMusicPlayTimeStamp).toStrictEqual(ref(db, 'syncMusicQueue/musicPlayTimeStamp'));
        });
    })

    describe('addMusic method', () => {
        it('should add music to the music queue', async () => {
            const id = '1234';
            const artist = 'Test Artists';
            const songName = 'Test Song';
            const url = 'https://example.com/song.mp3';
            const picture = 'https://example.com/song.jpg';
            const album = 'Test Album';
            const timestamp = Date.now();

            await queue.addMusic(id, artist, songName, url, picture, album, timestamp);

            // 檢查push是否被呼叫
            expect(push).toHaveBeenCalledWith(queue.musicQueueRef);

            // 驗證set的參數是否正確
            expect(set).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: mockKey
                }),
                expect.objectContaining({
                    artist,
                    songName,
                    url,
                    picture,
                    id,
                    album,
                    key: mockKey,
                    timestamp
                })
            );
        });
    });

    describe('removeMusic method', () => {
        it('should remove music from the music queue', async () => {
            musicToRemove = musics[1];
            await queue.removeMusic(musicToRemove);

            // 檢查remove是否被呼叫
            expect(remove).toHaveBeenCalled();

            // 驗證傳入的參數是否正確
            expect(ref).toHaveBeenCalledWith(db, `/musicQueue/${musicToRemove.key}`);

            // 移除驗證
            expect(musics).toEqual([
                { id: '1', songName: 'Song 1', key: '1' },
                { id: '3', songName: 'Song 3', key: '3' }
            ]);
        })
    })

})