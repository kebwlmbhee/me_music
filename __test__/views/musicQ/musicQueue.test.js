// author: aratus573 趙子翔

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

let musics;

let musicToRemove;

let firstMusic;

describe('musicQueue.js', () => {
    let queue;

    // 每個單一測試前呼叫
    beforeEach(() => {

        queue = new musicQueue();

        musics = [
            { id: '1', songName: 'Song 1', artist: 'Artist 1', album: 'Album 1', key: '1', timestamp: '1' },
            { id: '2', songName: 'Song 2', artist: 'Artist 2', album: 'Album 2', key: '2', timestamp: '2' },
            { id: '3', songName: 'Song 3', artist: 'Artist 3', album: 'Album 3', key: '3', timestamp: '3' }
        ];

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
                update: vi.fn((reference, targetMusic) => {
                    expect(reference).toEqual(ref(db, `/musicQueue/${firstMusic.key}`));
                    // 找同 key
                    const index = musics.findIndex((music) => music.key === firstMusic.key);
                    if (index !== -1) {
                        musics[index] = targetMusic;
                    }
                }),
                runTransaction: vi.fn((reference, callback) => {
                    // 替換music queue
                    musics = callback(musics);
                    return Promise.resolve();
                }),
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
        it('增加歌曲', async () => {
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
        it('移除歌曲', async () => {
            musicToRemove = musics[1];
            await queue.removeMusic(musicToRemove);

            // 檢查remove是否被呼叫
            expect(remove).toHaveBeenCalled();

            // 驗證傳入的參數是否正確
            expect(ref).toHaveBeenCalledWith(db, `/musicQueue/${musicToRemove.key}`);

            // 驗證移除歌曲 (此js檔的musics陣列)
            expect(musics).toEqual([
                { id: '1', songName: 'Song 1', artist: 'Artist 1', album: 'Album 1', key: '1', timestamp: '1' },
                { id: '3', songName: 'Song 3', artist: 'Artist 3', album: 'Album 3', key: '3', timestamp: '3' }
            ]);
        })
    })

    describe('removeMusicTransaction method', () => {
        it('移除歌曲 transaction', async () => {
            await queue.removeMusicTransaction(musics[0]);

            // 檢查runTransaction是否被呼叫
            expect(runTransaction).toHaveBeenCalled();

            // 驗證移除歌曲 (此js檔的musics陣列)
            //expect(musics).toEqual([
            //    { id: '3', songName: 'Song 3', artist: 'Artist 3', album: 'Album 3', key: '3', timestamp: '3' }
            //]);
        });
    });

    describe('onMusic function', () => {
        it('實時獲取Music Queue變更', () => {
            queue.onMusic((musics) => {
                this.musics = musics
            })

            // onValue 被調用
            expect(onValue).toHaveBeenCalled();
            // ref 指向music Queue
            expect(ref).toHaveBeenCalledWith(db, 'musicQueue');
        });
    });

    describe('replaceMusic method', () => {
        it('手動切歌', () => {
            queue.removeMusic = vi.fn();
            firstMusic = musics[0];
            const musicToReplace = {
                id: '10',
                songName: 'Replaced Song',
                artist: 'Replaced Artist',
                album: 'Replaced Album',
                key: '123456',
                timestamp: '10',
            };

            queue.replaceMusic(firstMusic, musicToReplace);

            // 檢查update是否被呼叫
            expect(update).toHaveBeenCalledWith(
                ref(db, `/musicQueue/${firstMusic.key}`),
                musicToReplace
            );

            // 驗證取代歌曲 (此js檔的musics陣列)
            expect(musics).toEqual([
                { id: '10', songName: 'Replaced Song', artist: 'Replaced Artist', album: 'Replaced Album', key: '1', timestamp: '10' },
                { id: '2', songName: 'Song 2', artist: 'Artist 2', album: 'Album 2', key: '2', timestamp: '2' },
                { id: '3', songName: 'Song 3', artist: 'Artist 3', album: 'Album 3', key: '3', timestamp: '3' }
            ]);
        });
    });

    describe('setterSwitchMusicNotification method', () => {
        it('手動切歌的公告寫入', () => {
            const msg = 'message'
            queue.setterSwitchMusicNotification(msg);

            // 檢查set是否被呼叫
            expect(set).toHaveBeenCalled();
        });
    });

    describe('onSwitchMusicNotification function', () => {
        it('監聽下一首歌的訊息', () => {
            queue.onSwitchMusicNotification((messages) => {
                this.messages = messages
            })

            // onValue 被調用
            expect(onValue).toHaveBeenCalled();
            // ref 指向switchMusicNotification
            expect(ref).toHaveBeenCalledWith(db, 'syncMusicQueue/switchMusicNotification');
        });
    });

    describe('setTransactionMusicPlayTime method', () => {
        it('setTransactionMusicPlayTime', async () => {
            await queue.setTransactionMusicPlayTime((messages) => {
                this.messages = messages
            })

            // 檢查runTransaction是否被呼叫
            expect(runTransaction).toHaveBeenCalled();
        });
    });

})