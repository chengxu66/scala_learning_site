# Java 课程资料说明

这个目录只保存允许公开发布的 Java 学习资料，包括整理后的课程讲义源文件和网站课程数据生成批次。

## 目录作用

### `课程总结/`

保存整理后的 Java 课程讲义源文件。修改这些 Markdown 文件后，可以重新生成 `summaries/java/` 下的静态页面。

命名格式：

```text
课堂总结 NN Java课程主题.md
```

`NN` 使用两位数，例如 `01`、`02`、`19`。

### `课程数据/`

保存分批生成的 JavaScript 课程对象。内部的 `java_course_data_objects*` 目录代表不同导入批次，保留批次名是为了便于追溯和核对。

这些 JavaScript 文件不会被网页直接加载。网站实际使用的 Java 和 Scala 课程数据统一保存在项目根目录的 `js/data.js`。

## 私有源资料

详细源资料不放在公开项目中。本机保留位置：

```text
D:\桌面\Project\School\private_course_sources\scala_learning_site\java\
```

公开仓库只发布整理后的讲义、互动课程数据和生成页面。

## 新增课程建议流程

1. 为新课程选择下一个两位编号。
2. 将整理后的课程讲义保存到 `课程总结/`。
3. 将生成的网站数据对象保存到 `课程数据/` 中的新批次目录。
4. 检查课程 `id` 不重复后，再将对象合并到 `../js/data.js`。
5. 运行 `npm run build:summaries` 和 `npm test`。
6. 打开首页、Java 学习页、讲义页和课程详情页，确认链接正常。
