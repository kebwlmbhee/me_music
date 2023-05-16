// Test written by jordan990301
import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { createTestingPinia } from '@pinia/testing'

import ExploreView from "@/views/ExploreView.vue";
import axios from 'axios';

// https://vitest.dev/api/vi.html#vi-mock
vi.mock('axios')
vi.mock("@/views/ExploreView.vue")

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
                    playlists: {
                        items: []
                    },
                    artists: {
                        items: []
                    }
                }
            },
        });

        axios.mockResolvedValue({
            data: {
                playlists: {
                    items: [
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
                    ]
                },
                artists: {
                    items: [
                        {
                            "external_urls": {
                                "spotify": "https://open.spotify.com/artist/38PzLQE4GW8o7A18oGhi0x"
                            },
                            "followers": {
                                "href": null,
                                "total": 9290
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
                    ]
                }
            }
        })
    })

    // https://stackblitz.com/edit/vitest-dev-vitest-aqctgw?file=test%2Ffactory.test.ts&initialPath=__vitest__/
    test('axios is mocked', () => {
        expect(vi.isMockFunction(axios.get)).toBe(true)
        expect(vi.isMockFunction(axios)).toBe(true)
    })

    it('should load playlists and artists on creation', async () => {
        await wrapper.vm.searchArtist()
        console.log(wrapper.vm.playlists)
        // const getTokenSpy = vi.spyOn(wrapper.vm.authCode, 'access_token')
        // getTokenSpy.mockReturnValue('12345')
    });
})