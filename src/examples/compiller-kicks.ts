


export function addNumbers(x: any, y: any): any{
   return x + y ;
}


performance.mark('start-kickins-monomorphic');

for (let i = 0; i < 1000000; i++) {
  addNumbers(8, 9);
}
performance.mark('end-kickins-monomorphic');
const measure1 = performance.measure('first iteration', 'start-kickins-monomorphic', 'end-kickins-monomorphic');
console.log(measure1);




performance.mark('start-kickins-2');
for (let i = 0; i < 1000000; i++) {
  addNumbers('5', '10');
}
performance.mark('end-kickins-2');
const measure2 = performance.measure('2nd iteration', 'start-kickins-2', 'end-kickins-2');
console.log(measure2);



