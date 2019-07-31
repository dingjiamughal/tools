export const flattenObj = (obj, {prevKey = '', segment = '.'} = {}) => {
    return Object.keys(obj).reduce((memo, next) => {
        const newKey = prevKey ? prevKey + segment + next : next;
        const value = obj[next];

        if (typeof value === 'object' && !(value instanceof Array)) {
            memo = {...memo, ...flattenObj(value, {prevKey: newKey})};
        }
        else {
            memo[newKey] = value;
        }

        return memo;
    }, {});
};

export const unflattenObj = (obj, {segment = '.'} = {}) => {
    // var flattenArr = ()
    return Object.keys(obj).reduce((memo, next) => {
        const value = obj[next];
        if (!!~next.indexOf(segment)) {
            // memo.c = {};
            // memo.c.c2 = {};
            // memo.c.c2.c2_1 = 'c2_1'
            const keysSet = next.split(segment).reverse();
            const result = keysSet.reduce((prevKey, nextKey, index) => {
                if (index === 0) {
                    prevKey = {
                        [nextKey]: value
                    };
                }
                else {
                    prevKey = {
                        [nextKey]: prevKey
                    };
                }

                return prevKey;
            }, {});

            memo = {...memo, ...result};
        }
        else {
            memo[next] = value;
        }

        return memo;
    }, {});
};
