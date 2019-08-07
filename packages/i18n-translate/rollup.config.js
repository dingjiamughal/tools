// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const LIBS = ['main'];

export default LIBS.map(lib =>
    (
        {
            input: `./${lib}.js`,
            output: {
                file: `./bin/${lib}`,
                format: 'cjs'
            },
            plugins: [
                resolve({
                    jsnext: true,
                    main: true,
                    preferBuiltins: true
                }),

                babel({
                    runtimeHelpers: true,
                    exclude: 'node_modules/**' // 只编译我们的源代码
                }),
                commonjs()
            ],
            external: ['lodash', 'js-yaml', 'shelljs', 'cheerio', 'js-md5']
        }
    )
);
