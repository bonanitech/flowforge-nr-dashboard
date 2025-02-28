/**
 * @description: Get a nested property value from an object by path
 * @param {object} obj - The object to retrieve the value from
 * @param {string} path - The path to the property
 * @param {any} defaultValue - The default value to return if the property is not found
 * @return {any} The value of the property
 * @example
 * const obj = { a: { b: { c: 'hello' } } }
 * getDeepValue(obj, 'a.b.c') // returns 'hello'
 * getDeepValue(obj, 'a.b.d') // returns undefined
 * getDeepValue(obj, 'a.b.d', 'default') // returns 'default'
 * getDeepValue(obj, 'a.b.d', null) // returns null
 *
 * @example
 * const obj = { 'a.b.c': 'hello' }
 * getDeepValue(obj, '[\"a.b.c\"]') // returns 'hello'
 */
function getDeepValue (obj, path, defaultValue) {
    if (typeof obj === 'undefined' || obj === null) return defaultValue

    // scan chars - drop each new var into an array
    let inBracket = false
    let inQuote = false
    const inBracketCharStart = '['
    const inBracketCharEnd = ']'
    const quoteChars = ['"', "'"]
    let newPath = []
    let index = 0
    let current = []
    let prevChar = ''
    let endQuoteChar = ''
    const newVar = () => {
        if (current.length > 0) {
            newPath[index] = [current.join('')]
        }
        index++
        current.length = 0
    }
    for (let i = 0, l = path.length; i < l; i++) {
        const char = path.charAt(i)
        newPath[index] = newPath[index] || []
        current = newPath[index]
        if (inBracket) {
            if (char === inBracketCharEnd) {
                inBracket = false
                newVar()
            } else {
                current.push(char)
            }
        } else if (inQuote) {
            if (char === endQuoteChar && prevChar !== '\\') {
                inQuote = false
                newVar()
            } else {
                current.push(char)
            }
        } else if (quoteChars.includes(char)) {
            endQuoteChar = char
            inQuote = true
            newVar()
        } else if (char === inBracketCharStart) {
            inBracket = true
            newVar()
        } else if (char === '.') {
            newVar()
        } else {
            current.push(char)
        }
        prevChar = char
    }
    // squash the remaining chars into the last var
    if (current.length > 0) {
        newPath[index] = [current.join('')]
    }

    newPath = newPath.flat()

    // scan path for surrounding " or ' and remove them
    for (let i = 0, l = newPath.length; i < l; i++) {
        if (!newPath[i]) continue
        const firstChar = newPath[i].charAt(0)
        const lastChar = newPath[i].charAt(newPath[i].length - 1)
        if ((firstChar === '"' || firstChar === "'") && (lastChar === '"' || lastChar === "'") && firstChar === lastChar) {
            newPath[i] = newPath[i].slice(1, -1)
        }
    }

    for (let i = 0, l = newPath.length; i < l; i++) {
        if (newPath[i] === '') continue
        obj = obj[newPath[i]]
        if (typeof obj === 'undefined') return defaultValue
        if (obj === null) return null
    }
    return obj || defaultValue
}

module.exports = {
    getDeepValue
}
