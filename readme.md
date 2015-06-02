# web 分析工具

收集网站性能，用户环境和行为数据

## 日志类型

共有四种日志类型，如下：

* debug
* info
* warning
* error

可通过 `WAT.info({ page: 'baidu' })` 的方式发送数据，每种类型都会带上 `logType` 字段

## 错误类型

js 异常

    {
        logType: 'error',
        from: 'js',
        msg: '错误信息',
        line: 1,
        col: 1
    }

