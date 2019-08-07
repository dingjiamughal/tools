ichuan---i18n翻译工具，兼容`.vue` `.yaml`

### intall
```
npm install ichuan -g
```

### usage
生成翻译文件
```
ichuan generate <翻译文件根目录> <csv存放路径> <csv名称>
ichuan generate source src result.csv
```
合并结果
```
ichuan feed <翻译文件根目录> <csv存放路径> <csv名称> <新csv名称>
ichuan feed source src result.csv result.new.csv
```

### bundler
```
npm run build
```
没有引入core，所以要求node 8+

### example
```
git clone https://github.com/dingjiamughal/tools.git
npm install
npm run bootstrap
cd packages/i18n-translate
<!-- 本地测试 -->
npm run dev:generate
npm run dev:feed
<!-- ichuan -->
npm install ichuan -g
ichuan generate source src result.csv
ichuan feed source src result.csv result.new.csv
```
