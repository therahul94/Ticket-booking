import React from 'react'

1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
 20,21,
 22,23,24,25,26,27,28,
 29,30,31,32,33,34,35,
 36,37,38,39,40,41,42,
 43,44,45,46,47,48,49,
 50,51,52,53,54,55,56,
 57,58,59,60,61,62,63,
 64,65,66,67,68,69,70,
 71,72,73,74,75,76,77,
 78,79,80


const SeatsSkeleton = () => {
    let seats = {
        "r1": [1,2,3,4,5,6,7],
        "r2": [8,9,10,11,12,13,14],
        "r3": [15,16,17,18,19,20,21],
        "r4": [22,23,24,25,26,27,28],
        "r5": [29,30,31,32,33,34,35],
        "r6": [36,37,38,39,40,41,42],
        "r7": [43,44,45,46,47,48,49],
        "r8": [50,51,52,53,54,55,56],
        "r9": [57,58,59,60,61,62,63],
        "r10": [64,65,66,67,68,69,70],
        "r11": [71,72,73,74,75,76,77],
        "r12": [78,79,80],
    };
  return (
    <div className="flex-1 animate-pulse">
            <div>
              {Object.keys(seats).map(row =>
                <div className="grid grid-cols-7 gap-2 mt-1.5" id={row}>
                  {seats[row].map((num) =>
                    <button
                      key={num}
                      className={`
                        py-4 px-4 rounded-md text-center transition-colors bg-gray-300
                      `}
                    >
                      {/* {obj.id} */}
                    </button>
                  )}
                </div>
              )}
            </div>

         
          </div>
    // <div>
    //   <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    // </div>
  )
}

export default SeatsSkeleton
