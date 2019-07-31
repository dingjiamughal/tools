<template lang="pug">
    .hello 中英文一一对应
</template>

<script>
export default {

};

</script>

<style lang="less" scoped>
    .hello {
        font-size: 22px;
    }
</style>

<i18n>
  cn:
    hello: 你好
  en:
    hello: hello
</i18n>