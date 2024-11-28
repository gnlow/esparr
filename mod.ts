type Replacer<T> = [
    when: RegExp,
    then: (substring: string) => T,
]

const forEachMatch =
(f: (args: RegExpExecArray) => void) =>
(rex: RegExp) =>
(str: string) => {
    let result: RegExpExecArray | null
    while ((result = rex.exec(str)) != null) {
        f(result)
    }
}

type Tree<T> = (T | Tree<T>)[]

export class Esparr<T> {
    replacers: Replacer<T>[] = []
    capturer: RegExp = new RegExp("[]", "g")
    
    r(...[when, then]: Replacer<T>) {
        this.replacers.push([when, then])
        this.capturer = new RegExp(
            this.capturer.source
                + `|(${when.source})`,
            "g",
        )
        return this
    }
    parse(str: string) {
        const tree: Tree<T> = []
        forEachMatch
            (match => {
                const i = match.slice(1).findIndex(x => x)
                const result = this.replacers[i][1](match[0])
                tree.push(result)
            })
            (this.capturer)
            (str)
        return tree
    }
}

const parser = new Esparr()
    .r(/a/, () => 1)
    .r(/b/, () => 2)

console.log(parser.parse("ab"))