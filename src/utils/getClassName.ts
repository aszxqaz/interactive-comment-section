type ClassName =
  | {
      [a: string]: boolean
    }
  | string | undefined

const a : ClassName[] = []

export const getClassName = (args: ClassName[]) => {
  let cl = ""
  args.forEach((arg, i, arr) => {
    if (typeof arg === "string") {
      cl += arg + ' '
    }
    if (typeof arg === "object") {
      Object.entries(arg).forEach((entry, j, argarr) => {
        if (entry[1]) {
          cl += entry[0] + ' '
        }
      })
    }
  })
  return cl.trim()
}
