# Factory Inspection Prototype

品牌验厂管理“免验厂”流程优化原型与需求文档。

## 原型入口

| 目录 | 用途 | 本地入口 | GitHub Pages |
| --- | --- | --- | --- |
| `prototype/` | 品牌中心“申请验厂”入口原型，展示普通验厂/免验厂申请材料采集 | `prototype/index.html` | https://wyenz.github.io/Factory_inspection/prototype/ |
| `prototype2/` | 供应商中心“分配验厂人员”原型，展示选择免验厂后的资料/API 查询结果 | `prototype2/index.html` | https://wyenz.github.io/Factory_inspection/prototype2/ |
| `prototype3/` | 供应商中心“待审核”页独立原型，展示免验厂标签、验厂人员、分数、报告和审核弹窗 | `prototype3/index.html` | https://wyenz.github.io/Factory_inspection/prototype3/ |

## 推荐演示路径

1. 打开 `prototype/`，从供应商列表进入“申请验厂”，查看免验厂条件和材料填写。
2. 打开 `prototype2/`，从“分配”弹窗选择“是否免验：是”，查看免验厂资料和系统查询结果。
3. 打开 `prototype3/`，直接演示待审核列表：
   - 供应商字段下展示 `免验厂` 标签。
   - 根据免验条件展示 `三方验厂`、`上市公司`、`大卖背书`、`实缴资本`。
   - 免验厂记录的验厂人员为 `免验厂`，验厂分数为 `100`。
   - 验厂报告以蓝色文件图标展示证明文件。
   - 点击“审核”后展示通过/不通过审核弹窗。

## 本地预览

任选一个原型目录启动静态服务：

```bash
cd prototype3
python3 -m http.server 4176 --bind 127.0.0.1
```

然后访问：

```text
http://127.0.0.1:4176/
```

也可以直接双击各目录下的 `index.html` 查看静态页面。

## 需求文档

| 文件 | 说明 |
| --- | --- |
| `品牌验厂管理-免验厂流程优化.md` | 当前主要需求说明，结构较完整，包含背景、流程、范围、接口、验收标准 |
| `品牌验厂管理-免验厂流程优化V2.md` | 早期整理版，保留用于对照 |
| `品牌验厂管理.doc` | 原始 Word 文档 |
| `原型交付说明.md` | 原型交付、演示重点和链接汇总 |

## GitHub Pages

当前 GitHub 仓库：

```text
https://github.com/WyenZ/Factory_inspection
```

最新已发布提交：

```text
28db174 Add reviewed factory inspection prototypes
```

## 备注

- `prototype.zip` 是本地未跟踪文件，当前未纳入 Git。
- 本地公司 GitLab 远端和 GitHub Pages 仓库历史不同；GitHub Pages 发布通过 GitHub 仓库维护。
