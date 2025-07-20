你提到的问题很有见地。确实，如果将 `jellyfinApi` 从全局单例改为通过 Context 提供，那么 `Player` 类中的播放状态上报功能会面临依赖注入的挑战<cite/>。

## 当前的播放状态上报实现

目前 `Player` 类直接导入并使用全局的播放状态上报函数 [1](#1-0) ：

- `setSrc()` 方法调用 `reportPlayStart()` [2](#1-1) 
- `playNext()`, `playPrev()`, `playWhich()` 等方法调用 `reportPlayingStop()` [3](#1-2) 
- `createPlayer()` 中设置定时器调用 `reportPlayingProgress()` [4](#1-3) 

## 解决方案

### 1. 依赖注入到 Player 构造函数

最直接的方法是将播放状态上报的依赖注入到 `Player` 构造函数中：

```typescript
export class Player {
    constructor(private playStateReporter?: PlayStateReporter) {
        // ...
    }
    
    setSrc(audioId: string) {
        this.playStateReporter?.reportPlayStart(this.getNowPlaying().id)
        // ...
    }
}
```

然后在 `createPlayer()` 中传入依赖 [5](#1-4) 。

### 2. 通过 Context 提供 Player 工厂函数

修改 `PlayerContext` 的提供方式 [6](#1-5) ，不直接提供 Player 实例，而是提供一个工厂函数：

```typescript
const PlayerProvider = ({ children }) => {
    const jellyfinApi = useContext(JellyfinApiContext)
    const player = useMemo(() => createPlayer(jellyfinApi), [jellyfinApi])
    
    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    )
}
```

### 3. 事件驱动的解耦方案

更优雅的方案是让 `Player` 发出事件，由外部监听器处理状态上报：

```typescript
export class Player extends EventEmitter {
    setSrc(audioId: string) {
        this.emit('playStart', this.getNowPlaying().id)
        // ...
    }
}
```

然后在 `createPlayer()` 中设置监听器 [7](#1-6) ：

```typescript
export const createPlayer = (jellyfinApi: JellyfinApi) => {
    const player = new Player()
    
    player.on('playStart', (itemId) => reportPlayStart(itemId, jellyfinApi))
    player.on('playStop', (itemId, position) => reportPlayingStop(itemId, position, jellyfinApi))
    
    return player
}
```

### 4. 推荐方案：混合方法

考虑到当前代码结构，我推荐采用依赖注入 + Context 的混合方案：

1. 修改 `Player` 构造函数接受播放状态上报器
2. 创建 `JellyfinApiContext` 提供 API 实例
3. 在应用层组合这些依赖

这样既解决了单例问题，又保持了代码的可测试性，同时不需要大幅重构现有的播放器逻辑 [8](#1-7) 。

## Notes

当前的播放状态上报逻辑分散在 `Player` 类的多个方法中，如果采用事件驱动方案，需要确保所有相关的播放状态变化都能正确触发事件。依赖注入方案相对更直接，但需要修改 `Player` 类的构造函数签名。

Wiki pages you might want to explore:
- [Architecture Overview (Ferry-200/cm_react)](/wiki/Ferry-200/cm_react#1.1)