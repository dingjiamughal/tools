i18n翻译工具，兼容`.vue` `yml`

### intall
```
npm install translate-djtest-pkg -g
```

### usage
导出翻译文件csv
```
ichuan generate <翻译文件根目录> <csv存放路径> <csv名称>
e.g
ichuan generate source_dir csv_dir result.csv
```
把编辑完的结果和本地资源合并
```
ichuan feed <翻译文件根目录> <csv存放路径> <csv名称> <新csv名称>
e.g
ichuan feed source_dir csv_dir result.csv result.new.csv
```

### 打包工具
rollup => 没有引入core，所以要求node 8+