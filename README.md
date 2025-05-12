# Coriander Music

性能检测工具，加在 head 第一个
`<script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>`

# Todo

- [ ] 搜索
  - [ ] 统一的搜索页，同时显示多种结果
  - [ ] 音乐、艺术家和专辑页面顶部的筛选
- [ ] Tooltip
- [x] 上报播放状态
  - [x] POST: `/PlayingItems/{itemId}` // 播放开始
    ```json
    {
      "canSeek": true,
      "playMethod": "DirectStream"
    }
    ```
  - [x] POST: `/PlayingItems/{itemId}/Progress` // 同步播放进度（似乎 10s 一次）
    ```json
    {
      // Optional. The current position, in ticks. 1 tick = 10000 ms.
      "positionTicks": 1234567890,
      "isPaused": false,
      "playMethod": "DirectStream"
    }
    ```
  - [x] DELETE: `/PlayingItems/{itemId}` // 播放结束
    ```json
    {
      // Optional. The position, in ticks, where playback stopped. 1 tick = 10000 ms.
      "positionTicks": 2222222222
    }
    ```
- [ ] ContextMenu
- [ ] 提取 NowPlayingInfoView, NowPlayingLyricView 和 PlaylistView
      在 IndexSidePanel 和 NowPlayingPage 复用
- [ ] 音乐详情页
- [ ] 循环、随机
- [ ] 响应式分页区域 |<-| 1 |...| 4 |...| 7 |->|
- [ ] 支持多种音频服务器
- [ ] 动态主题
