

import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import { createTestingPinia } from '@pinia/testing';
import { reactive } from 'vue'
import Chatroom from '@/views/chatroom/chatroom.js'
import ChatLobby from "@/components/SDJ/ChatLobby.vue";


describe('ChatView.vue', () => {


    
    // https://pinia.vuejs.org/cookbook/testing.html#unit-testing-components
    const wrapper = shallowMount(ChatLobby, {
        global: {
            plugins: [vuetify, createTestingPinia()]
        }
    })


    // 每個單一測試後呼叫
    afterEach(() => {
        // 清除所有 mock 功能
        vi.clearAllMocks();
    })

    describe('ChatLobby 是否存在', () => {

        it('wrapper 是否成功創建', () => {
            expect(wrapper.exists()).toBe(true);
        })
    })

    // describe('Announcements 數量測試', () => {

    //     it('如果數量>10，則減少到10', () => {
            

    //         const announcements = reactive([
    //             { time: 1 },
    //             { time: 2 },
    //             { time: 3 },
    //             { time: 4 },
    //             { time: 5 },
    //             { time: 6 },
    //             { time: 7 },
    //             { time: 8 },
    //             { time: 9 },
    //             { time: 10 },
    //             { time: 11 },
    //             { time: 12 }
    //         ])

    //         wrapper.vm.chatroom.onAnnouncement(announcements)


    //         expect(announcements.length).toBe(10)
    //     })
    // })

})
