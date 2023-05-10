import { app, auth, db, firebaseConfig } from '/src/firebaseConf.js'
import { describe, expect, it, vi } from 'vitest'

// Test for firebaseConf.js

describe('Firebase simulate Read and Write using mock', () => {
    it('寫入和讀取數據', async () => {
        
        // 寫入數據
        const mockfn = vi.fn();
        mockfn("hello");
        mockfn.mockReturnValue("hello");

        // 是否被 call 過和 return 值正確與否
        expect(mockfn).toHaveBeenCalledWith("hello");
        expect(mockfn()).toBe("hello");
    });
});


describe('firebaseConfig', () => {
    it('Config 存在', () => {
        expect(typeof firebaseConfig).not.toBe('undefined');
    });

    describe('firebaseConf', () => {
        it('app 物件初始化成功', () => {
            // test firebase app is defined
            expect(app).toBeDefined();

            // test firebase app is not to be null
            expect(app).not.toBeNull();
        })
        it('auth 物件初始化成功', () => {
            // test firebase auth is defined
            expect(auth).toBeDefined();

            // test firebase auth is not to be null
            expect(auth).not.toBeNull();
        })

        it('db 物件初始化成功', () => {
            // test firebase db is defined
            expect(db).toBeDefined();

            // test firebase db is not to be null
            expect(db).not.toBeNull();
        })
    })
})