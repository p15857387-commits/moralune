# moralune 站点信息架构 v0.1

- 日期：2026-11-05（Asia/Shanghai）
- 范围：站点结构 / 页面模板边界（不含支付订单核心）
- 依据：现有主站 `Paul WEB-project`、品牌视觉规范 v0.2、交易侧对接说明
- 市场默认：海外英文主路径；保留 `zh-CN` 双语骨架

---

## 1. 主导航（Primary）

全局顶栏（Moon Mist 底，电蓝仅 CTA/选物数量点睛）：

| 顺序 | 标签（EN） | 标签（ZH） | 目标 |
|------|------------|------------|------|
| 1 | Shop | 选物 | `/en/shop` 全品列表（PLP） |
| 2 | Rugs | 块毯 | `/en/shop?category=art-rugs`（可后续升为一级或 Mega） |
| 3 | The Edit | 本期主题 | 首页锚点 `#edit` 或独立内容页（冷启动先锚点） |
| 4 | Journal | 灵感 | `/en/journal`（首期可隐藏；SEO 内容位预留） |
| 5 | About | 关于 | `/en/about` |

右侧工具：

- Language：`en` / `zh-CN`
- Selection（选物清单）→ `/en/selection`，数量角标用电蓝
- 不在顶栏放 Checkout；结账只从 Selection / PDP 发起

页脚次级导航：Shipping & Returns、Care、Contact、Privacy、Terms（内容页可先占位）。

品类映射（与品牌五类对齐；现有 slug 暂保留，文案可改）：

| 品牌品类 | 现有 category id/slug | 建议对外 EN |
|----------|----------------------|-------------|
| 块毯 | `art-rugs` | Rugs |
| 抱枕及披肩 | `cushions-throws` | Cushions & Throws |
| 墙面挂饰 | `wall-art` | Wall |
| 小摆件 | `artful-storage`（现「收纳艺术」） | Objects（建议改名，slug 可迁 `objects`） |
| 装饰灯具 | `decorative-lighting` | Lighting |

---

## 2. 关键页面树

```
/{locale}                          首页 Home
/{locale}/shop                     列表 PLP（?category=&sort=）
/{locale}/products/[slug]          详情 PDP
/{locale}/selection                选物清单（类购物车）
/{locale}/about                    品牌故事
/{locale}/journal                  内容列表（预留）
/{locale}/journal/[slug]           内容详情（预留，如 Rug Size Guide）
/{locale}/pages/[slug]             静态页（Shipping / Care / Contact…）
/{locale}/success/[reference]      意向提交成功
/{locale}/payment/confirmed        PayPal capture 成功（交易侧就绪后启用）

API（交易侧拥有，前端只调用）：
POST /api/inquiries
POST /api/paypal/orders
GET  /api/paypal/capture
```

Locale：`en`（默认对外）、`zh-CN`。根 `/` 重定向到默认 locale。

CMS（Sanity）文档类型沿用并扩展：`product`、`category`、`siteSettings`、`inquiry`；后续加 `journalPost`、`page`。

---

## 3. 首页模块草案（自上而下）

气质：月光静谧；默认 Moon Mist `#F4F1EC`；电蓝 `#003AF4`（v0.2.1 锁定，替代暂定 `#2F6BFF`）仅 CTA / 小点 <8%；禁止默认黑底大面积（Deep Night 仅可选夜间故事条）。

| # | 模块 | 内容要点 | 备注 |
|---|------|----------|------|
| 1 | Hero | 一句品牌主张 + 主场景图（柔散射/blue hour）+ CTA「Explore the collection」→ Shop；次链 About | 现有暗底全幅需改为浅底或局部 Deep Night 故事条，符合 v0.2 |
| 2 | Trust / Promise | 3 点：独立品牌混选 / 材质触感 / 为日常而用 | 现有 `ml-trust` 可保留结构 |
| 3 | Shop by category | 五品类卡 → 对应 PLP 过滤 | 对齐品牌五类；Objects 文案替换「收纳艺术」 |
| 4 | The Edit（精选） | 4–8 件 `featured` 商品卡 | 锚点 `#edit` |
| 5 | Material / Room story | 1–2 条全宽内容带（材质或空间），链到 Journal 或品类 | 现有 campaign band 收敛为浅底+电蓝点睛 |
| 6 | Rug spotlight（可选） | 块毯孤立产品轮播 | 现有 `rug-carousel`，首页可收纳或只放 Rugs 入口 |
| 7 | Manifesto | 选物观短文 + About | |
| 8 | Closing CTA | 「Find the things that feel like home」→ Shop | 浅底，勿黑底铺满 |

不在首页堆折扣条；顶栏 announcement 用气质短句即可。

---

## 4. PLP 必备区块（`/shop`）

1. 页头：Title + 一句品类导语（随 `?category=` 切换）
2. 过滤：五品类 chips（All + 五类）；移动端横向滚动
3. 结果计数
4. 商品网格：图、名（sentence case）、价格、availability pill；缺货降权或标注
5. 空态：无结果文案 + 回 All
6. SEO：Title/Meta/H1 含修饰词（如 handwoven wool rug）；后续接 Journal 内链

排序首期可固定（featured → 新品/默认）；复杂筛选（尺寸/材质）二期。

---

## 5. PDP 必备区块（`/products/[slug]`）

1. 主图区（可多图；灯具优先含开灯版）
2. 标题、价格、短描述
3. 购买行动区：
   - Add to Selection（主路径，写入 Zustand `muyu-selection`）
   - 可选：若有 `shoppaasBuyUrl` → 「Buy securely」外链按钮（交易侧托管页）
   - PayPal 直连不在 PDP 默认露出；统一经 Selection（交易侧开关后再议）
4. 规格表：Material / Dimensions / Care
5. Story（长文/感官叙述）
6. Related（同品类 3 件）
7. 回链 Shop / 品类

---

## 6. 结账入口如何挂接（与交易系统边界）

**原则**：前端只做入口与跳转；支付/订单/运费税费 API 归「自建交易系统」。当前支付未正式就绪 → **主路径 = 选物清单 + 意向 inquiry**。

```
PDP ──Add to Selection──► Selection（/{locale}/selection）
                              │
                              ├─[支付未开] Submit inquiry
                              │     POST /api/inquiries
                              │     → /{locale}/success/{reference}
                              │
                              └─[PAYPAL_CHECKOUT_ENABLED] Pay with PayPal
                                    POST /api/paypal/orders → approvalUrl
                                    → PayPal → GET /api/paypal/capture
                                    → /{locale}/payment/confirmed

PDP ──(optional) shoppaasBuyUrl──► SHOPPAAS 托管购买页（外链，本站不碰卡）
```

前端职责：

- Selection UI、数量 1–20、空态、汇总展示
- 调用 inquiry /（就绪后）PayPal orders，并 `location.assign`
- 商品数据：优先 Sanity；无配置则 `src/data/catalog.ts` mock

交易侧职责：

- `/api/paypal/*`、运费税费、订单状态、开关与美元价图
- 契约变更时通知网站搭建

不嵌入结账 iframe；不做站内银行卡表单。

---

## 7. 与现有代码的落差（实施备忘）

- 包名仍为 `youwu-living`；git 无首提交/无远端
- CSS 主底偏 paper/cream，接近 Moon Mist，但 **缺电蓝 token**；首页 Hero/部分模块仍偏暗底，需按 v0.2 收敛
- 词标 PNG 已在 `public/`，品牌侧称源文件未入库——logo 位可继续用现图，待 SVG 替换
- 顶栏「本期主题」可保留；Journal 首期可不进主导航

---

## 8. 建议下一工程步（待 Paul 点头）

1. 设计系统 token：Moon Mist / Ink / moralune Blue / Lunar Gold 写入 CSS 变量  
2. 按本 IA 收敛首页模块与主导航文案（Objects 更名）  
3. 仓库首提交 + GitHub/预览部署  
