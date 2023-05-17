// Test written by jordan990301
import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { createTestingPinia } from '@pinia/testing'

import ExploreView from "@/views/ExploreView.vue";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'

describe("Test ExploreView.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(ExploreView, {
            global: {
                plugins: [vuetify, router, createTestingPinia()],
                provide: {
                    PausePreview: vi.fn()
                }
            },
            data() {
                return {
                    playlists: [],
                    artists: [],
                }
            },
        });

        it('wrapper creation', () => {
            expect(wrapper.exists()).toBe(true);
        })
    })

    it('searchPlayList()', async () => {
        let mock = new MockAdapter(axios);
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

        mock.onGet(url).reply(200, mock_data);

        await wrapper.vm.searchPlayList()
        await wrapper.vm.$nextTick();
        console.log("wrapper.vm.playlists")
        console.log(wrapper.vm.playlists)

        mock.restore();
    });
})