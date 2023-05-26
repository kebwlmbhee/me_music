// author: kebwlmbhee

import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import { createTestingPinia } from '@pinia/testing';
import musicQueue from '@/views/musicQ/musicQueue.js'
import BaseView from '@/views/BaseView.vue'


// Test MusicQueueView.vue

describe('MusicQueueView.vue', () => {

    let mockMainAudio, mockSecondAudio;
    let getElementByIdSpy, muteMainAudioSpy, unmuteMainAudioSpy;
    let playReplacedMusicSpy;
    let musicQueueMock;
    const removeMusicTransactionMock = vi.fn().mockResolvedValue();
    const setTransactionMusicPlayTimeMock = vi.fn().mockResolvedValue();
    const getMusicPlayTimeMock = vi.fn().mockImplementation((callback) => {
        callback(10);
    })

    // using vi.fn() to create a mock push method in router
    const mockRouter = {
        push: vi.fn(),
        name: '123'
    };

    // https://pinia.vuejs.org/cookbook/testing.html#unit-testing-components
    const wrapper = shallowMount(BaseView, {
        global: {
            plugins: [vuetify, createTestingPinia()],
            mocks: {
                // inject mock $router to test component
                $router: mockRouter,
            },
            // stubs router-view to avoid Error
            stubs: {
                'router-view': {
                    template: '<div>{{ }}</div>'
                }
            }
        }
    })

    beforeEach(() => {
        // initial value
        wrapper.vm.Explores = [
            { title: '探索', to: '/Home/Explore' },
            { title: '我的音樂記錄', to: '/Home/MusicRecord' },
            { title: '聊天室', to: '/Home/Chat' }
        ];
        wrapper.vm.message = '';
        wrapper.vm.SelectedPage = '大廳';
        wrapper.vm.MainMusic_url = '';
        wrapper.vm.SecondMusic_url = '';
        // 靜音控制
        wrapper.vm.isMuted = false;
        wrapper.vm.isPreview = false;
        wrapper.vm.MuteButton = '靜音';
        // Music Queue
        wrapper.vm.musics = [];
        wrapper.vm.dialog = true;
        wrapper.vm.isInitial = true;
        wrapper.vm.delayedMessage = '';
        wrapper.vm.playMusicTime = '';
        wrapper.vm.currentMusic = {};
        wrapper.vm.currentIndex = 0;

        // mock musicQueue function implementation
        musicQueueMock = {
            getMusicPlayTime: getMusicPlayTimeMock,
            onMusic: vi.fn(),
            onSwitchMusicNotification: vi.fn(),
            removeMusicTransaction: removeMusicTransactionMock,
            setTransactionMusicPlayTime: setTransactionMusicPlayTimeMock
        }

        wrapper.vm.musicQueue = musicQueueMock;

        // mock mainAudio function and value
        mockMainAudio = {
            load: vi.fn(),
            currentTime: 0,
            volume: 1.0
        }

        // mock secondAudio function and value
        mockSecondAudio = {
            play: vi.fn(),
            load: vi.fn(),
            pause: vi.fn(),
            ended: false,
            src: '',
        };

        // spyOn getElementById
        getElementByIdSpy = vi.spyOn(document, 'getElementById');
        // spyOn MuteMainAudio 
        muteMainAudioSpy = vi.spyOn(wrapper.vm, 'MuteMainAudio');
        // spyOn UnmuteMainAudio
        unmuteMainAudioSpy = vi.spyOn(wrapper.vm, 'UnmuteMainAudio');

        // spyOn setTransactionMusicPlayTime
        // spyOn playReplacedMusic
        playReplacedMusicSpy = vi.spyOn(wrapper.vm, 'playReplacedMusic');
    })

    // 每個單一測試後呼叫
    afterEach(() => {
        // 清除所有 mock 功能
        vi.clearAllMocks();
    })

    describe('BaseView 是否存在', () => {

        it('wrapper 是否成功創建', () => {
            expect(wrapper.exists()).toBe(true);
        })
    })

    describe('BaseView method', () => {

        describe('clickLobby method', () => {

            it('點擊按鈕時的響應', () => {

                // Call the method being tested
                wrapper.vm.clickLobby();

                // expect SelectedPage to be '大廳'
                expect(wrapper.vm.SelectedPage).toBe('大廳');
                // expect router push to be called with '/Home'
                expect(mockRouter.push).toHaveBeenCalledWith({ path: '/Home' });
            })
        })

        describe('PlayPreviewAudio method', () => {

            it('傳入的 url 為 null 時', () => {

                // Call the method being tested
                const result = wrapper.vm.PlayPreviewAudio(null);

                // expect return without value
                expect(result).toBeUndefined();
            })

            it('傳入的 url 不為 null 且 secondAudio 不為 null 時', () => {

                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockSecondAudio);

                // Call the method being tested
                wrapper.vm.PlayPreviewAudio('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

                // expect MuteMainAudio to be called once
                expect(muteMainAudioSpy).toHaveBeenCalledTimes(1);
                // expect getElementById to be called with secondAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('secondAudio');

                // expect isPreview to be true
                expect(wrapper.vm.isPreview).toBe(true);
                // expect secondAudio load to be called once
                expect(mockSecondAudio.load).toHaveBeenCalledTimes(1);
                // expect secondAudio src to be right value
                expect(mockSecondAudio.src).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

            })

            it('傳入的 url 不為 null 且 secondAudio 為空時的操作', () => {

                // mock getElementById return value is null
                getElementByIdSpy.mockReturnValue(null);

                // Call the method being tested
                wrapper.vm.PlayPreviewAudio('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

                // expect MuteMainAudio to be called once
                expect(muteMainAudioSpy).toHaveBeenCalledTimes(1);
                // expect getElementById to be called with secondAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('secondAudio');

                // expect isPreview to be true
                expect(wrapper.vm.isPreview).toBe(true);
                // expect secondAudio.load to never to be called
                expect(mockSecondAudio.load).not.toHaveBeenCalled();
                // expect secondAudio src to be empty
                expect(mockSecondAudio.src).toEqual('');
            })
        })

        describe('PreviewResume method', () => {

            it('Preview 歌曲 (secondAudio) 已結束', () => {

                // set secondAudio ended to true
                mockSecondAudio.ended = true;
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockSecondAudio);

                // Call the method being tested
                wrapper.vm.PreviewResume();

                // expect MuteMainAudio to be called once
                expect(muteMainAudioSpy).toHaveBeenCalledTimes(1);
                // expect isPreview to be true
                expect(wrapper.vm.isPreview).toBe(true);
                // expect getElementById to be called with secondAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('secondAudio');
                // expect secondAudio load to be called once
                expect(mockSecondAudio.load).toHaveBeenCalledTimes(1);
            })

            it('Preview 歌曲 (secondAudio) 未結束', () => {

                // set secondAudio ended to false
                mockSecondAudio.ended = false;
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockSecondAudio);

                // Call the method being tested
                wrapper.vm.PreviewResume();

                // expect MuteMainAudio to be called once
                expect(muteMainAudioSpy).toHaveBeenCalledTimes(1);
                // expect isPreview to be true
                expect(wrapper.vm.isPreview).toBe(true);
                // expect getElementById to be called with secondAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('secondAudio');
                // expect secondAudio play to be called once
                expect(mockSecondAudio.play).toHaveBeenCalledTimes(1);
            })
        })

        describe('PausePreviewAudio', () => {

            it('Preview 歌曲 (secondAudio) 存在', () => {

                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockSecondAudio);

                // Call the method being tested
                wrapper.vm.PausePreviewAudio();

                // expect isPreview to be false
                expect(wrapper.vm.isPreview).toBe(false);
                // expect getElementById to be called with secondAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('secondAudio');
                // expect secondAudio pause to be called once
                expect(mockSecondAudio.pause).toHaveBeenCalledTimes(1);

            })

            it('Preview 歌曲 (secondAudio) 不存在', () => {

                // mock getElementById return value is null
                getElementByIdSpy.mockReturnValue(null);

                // Call the method being tested
                wrapper.vm.PausePreviewAudio();

                // expect isPreview to be false
                expect(wrapper.vm.isPreview).toBe(false);
                // expect getElementById to be called with secondAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('secondAudio');
                // expect secondAudio pause never to be called
                expect(mockSecondAudio.pause).not.toHaveBeenCalled();
            })

            it('musicQueue 歌曲未被靜音', () => {

                // mock isMuted return value is false
                wrapper.vm.isMuted = false;

                // Call the method being tested
                wrapper.vm.PausePreviewAudio();

                // expect unmuteMainAudio to be called once
                expect(unmuteMainAudioSpy).toHaveBeenCalledTimes(1);
                // expect muteMainAudio never to be called
                expect(muteMainAudioSpy).not.toHaveBeenCalled();
            })

            it('musicQueue 歌曲已被靜音', () => {

                // mock isMuted return value is true
                wrapper.vm.isMuted = true;

                // Call the method being tested
                wrapper.vm.PausePreviewAudio();

                // expect unmuteMainAudio never to be called
                expect(unmuteMainAudioSpy).not.toHaveBeenCalled();
                // expect muteMainAudio to be called once
                expect(muteMainAudioSpy).toHaveBeenCalledTimes(1);
            })
        })

        describe('MuteButtonControl', () => {

            it('切換 MuteButton 的值', () => {

                // initial value is false
                expect(wrapper.vm.isMuted).toBe(false)

                // Call the method being tested
                wrapper.vm.MuteButtonControl();

                // expect isMuted to be true
                expect(wrapper.vm.isMuted).toBe(true);
                // Call the method being tested
                wrapper.vm.MuteButtonControl();
                // expect isMuted to be false
                expect(wrapper.vm.isMuted).toBe(false);
            })

            it('當前被靜音的情況', () => {

                // initial value is false
                wrapper.vm.isMuted = false;

                // Call the method being tested
                wrapper.vm.MuteButtonControl();

                // isMuted is true after call MuteButtonControl
                expect(wrapper.vm.MuteButton).toEqual('取消靜音')
                // expect muteMainAudio to be called once
                expect(muteMainAudioSpy).toHaveBeenCalledTimes(1);
            })

            it('當前未被靜音的情況', () => {

                // initial value is true
                wrapper.vm.isMuted = true;

                // Call the method being tested
                wrapper.vm.MuteButtonControl();

                // isMuteduted is false after call MuteButtonControl
                expect(wrapper.vm.MuteButton).toEqual('靜音')
                // expect unmuteMainAudio to be called once
                expect(unmuteMainAudioSpy).toHaveBeenCalledTimes(1);
            })
        })

        describe('MuteMainAudio method', () => {

            beforeEach(() => {
                // set mockMainAudio volume initial value
                mockMainAudio.volume = 1.0;
            })

            it('正在播放 Preview 歌曲', () => {

                // mock isPreview return value is true
                wrapper.vm.isPreview = true;

                // Call the method being tested
                const result = wrapper.vm.MuteMainAudio();

                // expect return without value
                expect(result).toBeUndefined();
            })

            it('當前未播放 Preview 歌曲', () => {

                // mock isPreview return value is false
                wrapper.vm.isPreview = false;
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockMainAudio);

                // Call the method being tested
                wrapper.vm.MuteMainAudio();

                // expect getElementById to be called once
                expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
            })

            it('當前未播放 Preview 歌曲且 musicQueue 有歌曲(mainAudio 存在)', () => {

                // mock isPreview return value is false
                wrapper.vm.isPreview = false;
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockMainAudio);

                // Call the method being tested
                wrapper.vm.MuteMainAudio();

                // expect mainAudio volume is 0.0
                expect(mockMainAudio.volume).toEqual(0.0);
            })

            it('當前未播放 Preview 歌曲且 musicQueue 沒有歌曲(mainAudio 不存在)', () => {

                // mock isPreview return value is false
                wrapper.vm.isPreview = false;
                // mock getElementById return null
                getElementByIdSpy.mockReturnValue(null);

                // Call the method being tested
                wrapper.vm.MuteMainAudio();

                // expect mainAudio volume is 1.0
                expect(mockMainAudio.volume).toEqual(1.0);
            })
        })
        describe('UnmuteMainAudio method', () => {

            beforeEach(() => {
                // set mockMainAudio volume initial value
                mockMainAudio.volume = 0.0;
            })

            it('正在播放 Preview 歌曲', () => {

                // mock isPreview return value is true
                wrapper.vm.isPreview = true;

                // Call the method being tested
                const result = wrapper.vm.UnmuteMainAudio();

                // expect return without value
                expect(result).toBeUndefined();
            });

            it('當前未播放 Preview 歌曲', () => {

                // mock isPreview return value is false
                wrapper.vm.isPreview = false;
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockMainAudio);

                // Call the method being tested
                wrapper.vm.UnmuteMainAudio();

                // expect getElementById to be called once
                expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
            });

            it('當前未播放 Preview 歌曲且 musicQueue 有歌曲 (mainAudio 存在)', () => {

                // mock isPreview return value is false
                wrapper.vm.isPreview = false;
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockMainAudio);

                // Call the method being tested
                wrapper.vm.UnmuteMainAudio();

                // expect mainAudio volume is 1.0
                expect(mockMainAudio.volume).toEqual(1.0);
            });

            it('當前未播放 Preview 歌曲且 musicQueue 沒有歌曲 (mainAudio 不存在)', () => {

                // mock isPreview return value is false
                wrapper.vm.isPreview = false;
                // mock getElementById return null
                getElementByIdSpy.mockReturnValue(null);

                // Call the method being tested
                wrapper.vm.UnmuteMainAudio();

                // expect mainAudio volume is 0.0
                expect(mockMainAudio.volume).toEqual(0.0);
            });
        });

        describe('whenMusicEnded method', () => {

            let alertMock, playReplacedMusicSpy;
            let mockMusic

            beforeEach(() => {
                // spy on window.alert and provide a mock implementation
                alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {
                    // wait for the promise to settle
                    return new Promise(resolve => resolve());
                });

                // mock playReplacedMusic method, cuz watch block will trace the change 
                // and call playReplacedMusic method when musicQueue.musics[0] is changed
                playReplacedMusicSpy = vi.spyOn(wrapper.vm, 'playReplacedMusic').mockImplementation(() => { });

                // mock music object
                mockMusic = {
                    url: 'mock-url',
                };
            })

            afterEach(() => {
                // restore the original implementation
                playReplacedMusicSpy.mockRestore();
                alertMock.mockRestore();
            })

            it('移除 musicQueue 第一首歌', async () => {

                // set musics[0] to be mockMusic
                wrapper.vm.musics = [mockMusic];

                // spyOn alert
                vi.spyOn(window, 'alert');

                // set MainMusic_url to 'mock-url'
                wrapper.vm.MainMusic_url = 'mock-url';

                // Call the method being tested
                wrapper.vm.whenMusicEnded();

                // wait for 'watch' block call the playReplacedMusic method
                await wrapper.vm.$nextTick();

                // except removeMusicTransaction method to be called once
                expect(removeMusicTransactionMock).toHaveBeenCalledTimes(1);
                // except removeMusicTransaction method to be called with mockMusic
                expect(removeMusicTransactionMock).toHaveBeenCalledWith(mockMusic);
                // except playReplacedMusic method to be called once
                expect(playReplacedMusicSpy).toHaveBeenCalledTimes(1);

                // expect window.alert is never to be called
                expect(alertMock).not.toHaveBeenCalled();


            });

            it('第一首歌曲已被他人移除', () => {

                // set musics[0] to be mockMusic
                wrapper.vm.musics = [mockMusic];
                // set MainMusic_url to 'other-url'
                wrapper.vm.MainMusic_url = 'other-url';

                // Call the method being tested
                wrapper.vm.whenMusicEnded();

                // Expect removeMusicTransaction not to have been called
                expect(removeMusicTransactionMock).not.toHaveBeenCalled();

                // expect window.alert is never to be called
                expect(alertMock).not.toHaveBeenCalled();
            });

            it('處理移除音樂時的錯誤', async () => {

                // mock music object
                const mockMusic = {
                    url: 'mock-url',
                    // mock load function
                    load: vi.fn(),
                };
                // set musics[0] to be mockMusic
                wrapper.vm.musics = [mockMusic];

                // set MainMusic_url to 'mock-url'
                wrapper.vm.MainMusic_url = 'mock-url';

                // mock error message
                const error = new Error('Failed to remove music');

                // mock removeMusicTransaction return error promise
                removeMusicTransactionMock.mockRejectedValue(error);

                // Call the method being tested
                wrapper.vm.whenMusicEnded();

                // wait for the promise to settle
                await wrapper.vm.$nextTick();

                // Expect removeMusicTransaction to be called with the first music
                expect(removeMusicTransactionMock).toHaveBeenCalledWith(mockMusic);

                // wait for the promise to resolve
                await new Promise(resolve => setTimeout(resolve));

                // expect alertMock to be called with error message
                expect(alertMock).toHaveBeenCalledWith(error);
            });
        })

        describe('playReplacedMusic method', () => {

            beforeEach(() => {
                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockMainAudio);
                // mock setTimeout
                vi.useFakeTimers();
            });


            it('當前歌曲被別人切掉', () => {

                // set initial value
                wrapper.vm.musics = [
                    { url: 'music2.mp3' }
                ];
                const newMusic = {
                    url: 'music1.mp3'
                }

                // Call the method being tested
                const result = wrapper.vm.playReplacedMusic(newMusic);

                // expect return without value
                expect(result).toBeUndefined();
            })

            it('當前歌曲沒有被別人切掉', () => {

                // set initial value
                wrapper.vm.musics = [{ url: 'music1.mp3' }];
                wrapper.vm.MainMusic_url = 'oldMusic.mp3';

                // Call the method being tested
                wrapper.vm.playReplacedMusic(wrapper.vm.musics[0]);

                // speed up the setTimeout by 3 seconds
                vi.advanceTimersByTime(3000);;

                // except MainMusic_url is equal to musics[0].url
                expect(wrapper.vm.MainMusic_url).toEqual(wrapper.vm.musics[0].url);
                // expect getElementById to be called with mockMainAudio
                expect(getElementByIdSpy).toHaveBeenCalledWith('mainAudio');
                // expect mainAudio.load to be called once
                expect(mockMainAudio.load).toHaveBeenCalledTimes(1);
                // expect setTransactionMusicPlayTime to be called once
                expect(setTransactionMusicPlayTimeMock).toHaveBeenCalledTimes(1);
                // expect setTransactionMusicPlayTime to be called with timestamp
                expect(setTransactionMusicPlayTimeMock).toHaveBeenCalledWith(expect.any(Number));
            })
        })

        describe('DialogCallback method', () => {
            it('點擊後開始播放 musicQueue', () => {

                // spyOn and mock musicQueue class getMusicPlayTime method
                musicQueue.prototype.getMusicPlayTime = getMusicPlayTimeMock;

                // mock getElementById return value
                getElementByIdSpy.mockReturnValue(mockMainAudio);

                // Call the method being tested
                wrapper.vm.DialogCallback();

                // expect getMusicPlayTime to be called once
                expect(getMusicPlayTimeMock).toHaveBeenCalledTimes(1);
                // expect playMusicTime is equal to mainMusic callback value + 3
                expect(wrapper.vm.playMusicTime).toEqual(10 + 3);
                // expect playMusicTime to be assigned to mainAudio currentTime
                expect(mockMainAudio.currentTime).toBe(wrapper.vm.playMusicTime);
            })
        })
    })

    describe('BaseView watch', () => {
        it('當 musics[0] 變動要調用 playReplacedMusic 的情況', () => {

            // mock oldVal and newVal
            const newVal = [{ timestamp: 12345 }];
            const oldVal = [{ timestamp: 67890 }];

            // Set watch newVal & oldVal
            wrapper.vm.$options.watch.musics.handler.call(wrapper.vm, newVal, oldVal);

            // expect playReplacedMusic to be called once
            expect(playReplacedMusicSpy).toHaveBeenCalledTimes(1);
            // expect playReplacedMusic to be called with newVal[0]
            expect(playReplacedMusicSpy).toHaveBeenCalledWith(newVal[0]);
        });

        it('如果是舊值為空，但新值非空，要判斷是否是初始化導致 musics[0] 的變動，', () => {

            // mock oldVal and newVal
            const newVal = [{ timestamp: 12345 }];
            const oldVal = [];

            // set isInitial to true
            wrapper.setData({ isInitial: true });

            // Set watch newVal & oldVal
            wrapper.vm.$options.watch.musics.handler.call(wrapper.vm, newVal, oldVal);

            // expect isInitial to be false
            expect(wrapper.vm.isInitial).toBe(false)
            // expect playReplacedMusic to be called once
            expect(playReplacedMusicSpy).toHaveBeenCalledTimes(1);
            // expect playReplacedMusic to be called with the new value and 0
            expect(playReplacedMusicSpy).toHaveBeenCalledWith(newVal[0], 0);
        });

        it('如果是舊值為空，但新值非空，初始化導致 musics[0] 的變動，', () => {

            // mock oldVal and newVal
            const newVal = [{ timestamp: 12345 }];
            const oldVal = [];

            // set isInitial to true
            wrapper.vm.isInitial = false;

            // Set watch newVal & oldVal
            wrapper.vm.$options.watch.musics.handler.call(wrapper.vm, newVal, oldVal);

            // expect playReplacedMusic to be called once
            expect(playReplacedMusicSpy).toHaveBeenCalledTimes(1);
            // expect playReplacedMusic to be called with the new value
            expect(playReplacedMusicSpy).toHaveBeenCalledWith(newVal[0]);
        });

    })
})