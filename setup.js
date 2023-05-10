// 在 vitest.config.js 中引用
// 用來解決 Vitest 執行 mount 發生 ReferenceError: ResizeObserver is not defined 問題
// https://github.com/vuetifyjs/vuetify/issues/14749#issuecomment-1481141623
class ResizeObserverStub {
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver ??= ResizeObserverStub