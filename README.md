# Squirrel.ts

A TypeScript rewrite (with some changes) of [Squirrel](https://github.com/escamilla/squirrel), an expression-oriented programming language I wrote in C#.

## Usage

```
# run an interactive console
npm run eval

# run a source file and display the result
npm run eval <path>

# run included demo: Conway's Game of Life
npm run eval examples/functions.sq

# use the `-v | --verbose` flag to show more details including the parse tree
npm run eval -- -v <path>

# run unit tests
npm test
```

## Sample

```
(sequence
  (let factorial
    (lambda (x)
      (if (eq x 0)
        1
        (mul x (factorial (sub x 1)))
      )
    )
  )
  (print (factorial 10))
)
```
