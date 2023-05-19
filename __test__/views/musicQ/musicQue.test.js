import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import MusicQue from "@/components/SDJ/musicQue.vue";

describe('音樂排隊功能', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(MusicQue, {
      global: {
        plugins: [vuetify, router],
      },
    });
  });

  it('確認音樂排隊按鈕是否禁用', () => {
    const index = 0;
    const expected = true;

    const isDisabled = wrapper.vm.isDisabled(index);

    expect(isDisabled).toBe(expected);
  });

  it('確認音樂排隊按鈕是否未禁用', () => {
    const index = 1;
    const expected = false;

    const isDisabled = wrapper.vm.isDisabled(index);

    expect(isDisabled).toBe(expected);
  });

  it('確認音樂排隊狀態是否正確更新', () => {
    const mockMusics = [
      { songName: '歌曲 1', timestamp: '1' },
      { songName: '歌曲 2', timestamp: '2' }
    ];

    const audio = wrapper.vm.audio;
    const state = wrapper.vm.state;

    // 觸發 onMusic 回調
    wrapper.vm.musicQue.onMusic(mockMusics);

    // 驗證音樂列表已被正確更新
    expect(audio.musics).toEqual(mockMusics);
    // 驗證 first_timestamp 已被更新
    expect(state.first_timestamp).toBe(mockMusics[0].timestamp);
    // 驗證 switching 狀態已被設置為 true
    expect(state.switching).toBe(true);
  });
});
