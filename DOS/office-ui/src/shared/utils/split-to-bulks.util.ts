/**
 * https://stackoverflow.com/questions/8495687/split-array-into-chunks
 * 
 * @param arr 
 * @param bulkSize 
 * @returns 
 */
export function splitToBulks(arr: any[], bulkSize: number = 2) {
    const bulks: any[] = [];
    for (let i: number = 0; i < Math.ceil(arr.length / bulkSize); i++) {
        bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize));
    }
    return bulks;
}

/*
console.log(splitToBulks([1, 2, 3, 4, 5, 6, 7], 3));
[
  [
    1,
    2,
    3
  ],
  [
    4,
    5,
    6
  ],
  [
    7
  ]
]
*/