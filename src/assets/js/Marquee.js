// 當滑鼠移上去就會觸發的跑馬燈效果
// Outer_Div : 外層的Div
// Inner_Span : 內層的Span
// Duration : 跑完動畫要多久 預設3000 ms
function MarqueeAccomplish(Outer_Div, Inner_Span, Duration = 3000) {
  Inner_Span.addEventListener('mouseover', () => {
    Outer_Div.style.textOverflow = 'clip'
    let max_width = Outer_Div.offsetWidth
    let span_width = Inner_Span.offsetWidth
    Inner_Span.animate(
      [
        { transform: 'translateX(0%)' },
        {
          transform: `translateX(${max_width - span_width > 0 ? 0 : max_width - span_width}px)`,
          offset: 0.8
        },
        { transform: `translateX(${max_width - span_width > 0 ? 0 : max_width - span_width}px)` }
      ],
      {
        duration: Duration,
        iterations: Infinity
      }
    )
  })
  Inner_Span.addEventListener('mouseout', () => {
    Outer_Div.style.textOverflow = 'ellipsis'
    let animat = Inner_Span.getAnimations()[0]
    animat.cancel()
  })
}
// 當滑鼠到處發器上面觸發的跑馬燈效果
// Activator : 通過MouseOver 這個物件 觸發跑馬燈效果
// Outer_Div : 外層的Div
// Inner_Span : 內層的Span
// Duration : 跑完動畫要多久 預設3000 ms
function MarqueeActivator(Activator, Outer_Div, Inner_Span, Duration = 3000) {
  Activator.addEventListener('mouseover', () => {
    Outer_Div.style.textOverflow = 'clip'
    let max_width = Outer_Div.offsetWidth
    let span_width = Inner_Span.offsetWidth
    Inner_Span.animate(
      [
        { transform: 'translateX(0%)' },
        {
          transform: `translateX(${max_width - span_width > 0 ? 0 : max_width - span_width}px)`,
          offset: 0.8
        },
        { transform: `translateX(${max_width - span_width > 0 ? 0 : max_width - span_width}px)` }
      ],
      {
        duration: Duration,
        iterations: Infinity
      }
    )
  })
  Activator.addEventListener('mouseout', () => {
    Outer_Div.style.textOverflow = 'ellipsis'
    let animat = Inner_Span.getAnimations()[0]
    animat.cancel()
  })
}
// 一直在觸發的跑馬燈效果(不會停)
// Outer_Div : 外層的Div
// Inner_Span : 內層的Span
// Duration : 跑完動畫要多久 預設3000 ms
function MarqueeConstant(Outer_Div, Inner_Span, Duration = 3000) {
  let max_width = Outer_Div.offsetWidth
  let span_width = Inner_Span.offsetWidth
  Inner_Span.animate(
    [
      { transform: 'translateX(0%)' },
      {
        transform: `translateX(${max_width - span_width > 0 ? 0 : max_width - span_width}px)`,
        offset: 0.8
      },
      { transform: `translateX(${max_width - span_width > 0 ? 0 : max_width - span_width}px)` }
    ],
    {
      duration: Duration,
      iterations: Infinity
    }
  )
}
export { MarqueeAccomplish, MarqueeActivator, MarqueeConstant }
