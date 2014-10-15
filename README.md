# Fours

「Fours」は、小さな労力で、堅牢性に優れた Web サイトを制作するための、  
フロントエンド用ベースファイル群です。


## gulp
以下のタスクを実行します。

- HTML/CSS/JavaScript のバリデーション
- SCSS のコンパイル・最適化
- JavaScript の結合・圧縮
- ライブリロード


## CSS
OOCSS、BEM 等のコンセプトを取り入れた、CSS フレームワークです。  
CSSプリプロセッサとして、Sass （形式は SCSS）を利用しています。

基本構成は以下の通りです。

1. **Foundation** (variable, mixin, reset, base)
2. **Function** (animation, web-font, alpha-rollover, ...)
3. **Frame** (container, header, content, footer, ...)
4. **Factory**
   1. **Parts** (heading, ul, ol, ...)
   2. **Components** (media, ...)
   3. **Utilities** (hidden, floats, align, ...)


## JavaScript
以下の機能を実装します。

- 画像ロールオーバー
- スムーススクロール
- アコーディオン
- タブ
- ポップアップ
- 要素の高さ揃え