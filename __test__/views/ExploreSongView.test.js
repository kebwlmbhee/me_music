import { describe, it, expect} from "vitest";
import ExploreSongView from '@/views/ExploreSongView.vue'

describe('輸入測試標題', () => {
    it('確認 View 存在', () => {
        expect(ExploreSongView).toBeTruthy()
    })
})