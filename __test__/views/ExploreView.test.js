// Test written by jordan990301
// 用 `npm run test:unit -t ExploreView.test.js --silent=false` 就可以查看 console.log 的內容

import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { createTestingPinia } from '@pinia/testing'

import ExploreView from "@/views/ExploreView.vue";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter' // https://github.com/ctimmerm/axios-mock-adapter

describe("Test ExploreView.vue", () => {
    let wrapper;

    beforeEach(() => {
        // wrapper 就是假元件
        wrapper = shallowMount(ExploreView, {
            global: {
                plugins: [vuetify, router, createTestingPinia()],
                // 只要是沒用到的函式都可以先用 vi.fn() spy 起來讓他變成假函式，測試就不會被卡住
                provide: {
                    PausePreview: vi.fn()
                },
                // 通過 stubs 將 v-text-field 換成自定義組件，
                // 讓測試環境不會碰到真正的 v-text-field
                // 可以模擬其被有效使用，且避免真正使用而造成的相依性及複雜性
                stubs: {
                    'v-text-field': {
                        // 定義假的 props 模擬其 prefix 屬性
                        props: ['fakePrefix'],
                        // 進行存取
                        template: '<div>{{ fakePrefix }}</div>'
                    }
                }
            },
            // 用假的 data() 取代原先 ExploreView.vue 的 data(), data() 跟 methods 都可以用 wrapper.vm.xxx 呼叫
            data() {
                return {
                    loaded: false,
                    imgsrc: '',
                    playlists: [],
                    shows: [],
                    artists: [],
                    search: ''
                }
            },
        });

        it('wrapper creation', () => {
            expect(wrapper.exists()).toBe(true);
        })
    })

    // async await 只是為了避免非同步問題、應該是沒有副作用，可以用爆
    it('runSearch()', async () => {
        // Mock the searchPlayList and searchArtist methods
        // 因為原先 runSearch() 內有用到這兩個會 Promise 函式，測試沒有用到，這邊先 spy 起來不要讓他影響測試 
        wrapper.vm.searchPlayList = vi.fn(() => Promise.resolve());
        wrapper.vm.searchArtist = vi.fn(() => Promise.resolve());

        // Call the runSearch method
        // 可以用以下方法呼叫 methods
        await wrapper.vm.runSearch();
        await wrapper.vm.$nextTick();

        // Verify that the loaded state is initially true
        // Promise 還沒完成，loaded 應該還不會被改成 false
        await expect(wrapper.vm.loaded).toBe(true);

        // Wait for the Promises to resolve
        await Promise.all([wrapper.vm.searchPlayList(), wrapper.vm.searchArtist()]);

        // Verify that the loaded state is updated to false
        await expect(wrapper.vm.loaded).toBe(false);
    })

    it('clickPlaylist', async () => {
        // Define the test data
        const listId = '123';
        const type = 'playlist';

        // 把 router 函式 spy 起來，避免他真的導向新頁面。spy 只是要檢查傳入 router 的參數有沒有正常運作
        wrapper.vm.$router.push = vi.fn()

        wrapper.vm.clickPlaylist(listId, type);
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
            path: '/Home/ExploreSong',
            query: { id: listId, type: type }
        });
    })

    it('searchCallback', () => {
        // You can also assert that alert is called when search is empty
        // For example, using Jest's spy functionality:
        const originalAlert = window.alert;
        window.alert = vi.fn();
        wrapper.setData({ search: '' });
        wrapper.vm.searchCallback();
        expect(window.alert).toHaveBeenCalledWith('搜尋不能為空');
        window.alert = originalAlert;

        wrapper.vm.search = "example search"
        wrapper.vm.$router.push = vi.fn()
        wrapper.vm.searchCallback();

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
            path: '/Home/Search',
            query: { search: 'example search' }
        });
    })

    it('searchPlayList()', async () => {
        // 用第三方套件 axios-mock-adapter 解決 axios 問題，axios(config) 這種寫法的 API 呼叫也可以處理
        // 不過這個不能放在 beforeEach, afterEach 使用，蠻怪的
        let mock = new MockAdapter(axios);

        // 需要去查真實元件 ExploreView.vue 的 searchPlayList，看他到底 axios 需要傳入、回傳哪種參數格式
        // 必須依照傳入、回傳的參數格式給予假資料，模擬 API 呼叫、回傳的行為
        let url = "https://api.spotify.com/v1/search?query=t&type=playlist&limit=20"
        let mock_data = {
            "playlists": {
                "href": "https://api.spotify.com/v1/search?query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=playlist&locale=zh-TW%2Czh%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%2Cja%3Bq%3D0.6%2Ceo%3Bq%3D0.5&offset=0&limit=1",
                "items": [
                    {
                        "collaborative": false,
                        "description": "Enjoy a break with some relaxing soft songs.",
                        "external_urls": {
                            "spotify": "https://open.spotify.com/playlist/37i9dQZF1DXcxacyAXkQDu"
                        },
                        "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DXcxacyAXkQDu",
                        "id": "37i9dQZF1DXcxacyAXkQDu",
                        "images": [
                            {
                                "height": null,
                                "url": "https://i.scdn.co/image/ab67706f000000032882fd7da8b1d327d94d98a4",
                                "width": null
                            }
                        ],
                        "name": "Cozy Blend",
                        "owner": {
                            "display_name": "Spotify",
                            "external_urls": {
                                "spotify": "https://open.spotify.com/user/spotify"
                            },
                            "href": "https://api.spotify.com/v1/users/spotify",
                            "id": "spotify",
                            "type": "user",
                            "uri": "spotify:user:spotify"
                        },
                        "primary_color": null,
                        "public": null,
                        "snapshot_id": "MTY4NDIyNzU5NiwwMDAwMDAwMDExODIxMzA4ODg3Y2Q0OWNiMjlhZGZkM2M1NzliNDg3",
                        "tracks": {
                            "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DXcxacyAXkQDu/tracks",
                            "total": 250
                        },
                        "type": "playlist",
                        "uri": "spotify:playlist:37i9dQZF1DXcxacyAXkQDu"
                    }
                ],
                "limit": 1,
                "next": "https://api.spotify.com/v1/search?query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=playlist&locale=zh-TW%2Czh%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%2Cja%3Bq%3D0.6%2Ceo%3Bq%3D0.5&offset=1&limit=1",
                "offset": 0,
                "previous": null,
                "total": 716
            }
        }

        // 可以模擬 axios(config), config 設定為 get 的 API 呼叫
        mock.onGet(url).reply(200, mock_data);

        // 等 wrapper.vm.searchPlayList() 內部完成呼叫 axios 的行為
        await wrapper.vm.searchPlayList()
        await wrapper.vm.$nextTick();
        // console.log("wrapper.vm.playlists")
        // console.log(wrapper.vm.playlists)

        // 預計假元件 wrapper 內的 playlists 資料會被修改
        expect(wrapper.vm.playlists).toEqual((mock_data["playlists"])["items"])

        // 重置 mock，不然會跳警告
        mock.restore();
    });

    it('searchArtist()', async () => {
        let mock = new MockAdapter(axios);
        let url = "https://api.spotify.com/v1/search?query=c&type=artist&offset=0&limit=10";
        let mock_data = {
            "artists": {
                "href": "https://api.spotify.com/v1/search?query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=artist&locale=zh-TW%2Czh%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%2Cja%3Bq%3D0.6%2Ceo%3Bq%3D0.5&offset=0&limit=1",
                "items": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/38PzLQE4GW8o7A18oGhi0x"
                        },
                        "followers": {
                            "href": null,
                            "total": 9297
                        },
                        "genres": [],
                        "href": "https://api.spotify.com/v1/artists/38PzLQE4GW8o7A18oGhi0x",
                        "id": "38PzLQE4GW8o7A18oGhi0x",
                        "images": [
                            {
                                "height": 640,
                                "url": "https://i.scdn.co/image/ab6761610000e5ebb6a7d269c36ebe8eaa505969",
                                "width": 640
                            },
                            {
                                "height": 320,
                                "url": "https://i.scdn.co/image/ab67616100005174b6a7d269c36ebe8eaa505969",
                                "width": 320
                            },
                            {
                                "height": 160,
                                "url": "https://i.scdn.co/image/ab6761610000f178b6a7d269c36ebe8eaa505969",
                                "width": 160
                            }
                        ],
                        "name": "dazy",
                        "popularity": 70,
                        "type": "artist",
                        "uri": "spotify:artist:38PzLQE4GW8o7A18oGhi0x"
                    }
                ],
                "limit": 1,
                "next": "https://api.spotify.com/v1/search?query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=artist&locale=zh-TW%2Czh%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%2Cja%3Bq%3D0.6%2Ceo%3Bq%3D0.5&offset=1&limit=1",
                "offset": 0,
                "previous": null,
                "total": 800
            }
        }

        mock.onGet(url).reply(200, mock_data);

        await wrapper.vm.searchArtist()
        await wrapper.vm.$nextTick();
        // console.log("wrapper.vm.artists")
        // console.log(wrapper.vm.artists)

        expect(wrapper.vm.artists).toEqual((mock_data["artists"])["items"])

        mock.restore();
    });
})