
interface UserDynamic {
  name: string;
  age: number;
  email: string | undefined;
  city: string | undefined;
}

function getUserInfoDynamic(user: UserDynamic): number {
  return user.name.length + user.age;
}

// Pre-create users with DIFFERENT shapes (dynamic properties)
const dynamicUsers: UserDynamic[] = [];
for (let i = 0; i < 10000000; i++) {
  const user: any = { name: 'User' + i, age: i, email: undefined, city: undefined };
  
  if (i % 2 === 0) {
    user.email = 'user@example.com';
  }
  if (i % 3 === 0) {
    user.city = 'NYC';
  }
  
  dynamicUsers.push(user);
}

performance.mark('start-hidden-class-example-megamorphic');

// // Warm-up
// // Measurement
// console.time('Dynamic properties');
let sum4 = 0;
for (let i = 0; i < 10000000; i++) {
  sum4 += getUserInfoDynamic(dynamicUsers[i % dynamicUsers.length]);
}

performance.mark('end-hidden-class-example-megamorphic');
const measure4 = performance.measure('Dynamic properties', 'start-hidden-class-example-megamorphic', 'end-hidden-class-example-megamorphic');
console.log(measure4);

// console.timeEnd('Dynamic properties');
// console.log(`Result: ${sum4}`);
// console.log('✗ Multiple hidden classes created dynamically\n');

// // =============================================================================
// // Example 5: GOOD - Initialize All Properties Upfront
// // =============================================================================
// console.log('5. GOOD - Initialize All Properties Upfront');

// interface UserStable {
//   name: string;
//   age: number;
//   email: string | null;
//   city: string | null;
// }

// function getUserInfoStable(user: UserStable): number {
//   return user.name.length + user.age;
// }

// // Pre-create users with SAME shape (all properties initialized)
// const stableUsers: UserStable[] = [];
// for (let i = 0; i < 10000; i++) {
//   const email = i % 2 === 0 ? 'user@example.com' : null;
//   const city = i % 3 === 0 ? 'NYC' : null;
//   stableUsers.push({ name: 'User' + i, age: i, email, city });
// }

// // Warm-up
// let warmup5 = 0;
// for (let i = 0; i < 500000; i++) {
//   warmup5 += getUserInfoStable(stableUsers[i % stableUsers.length]);
// }

// // Measurement
// console.time('Initialized properties');
// let sum5 = 0;
// for (let i = 0; i < 5000000; i++) {
//   sum5 += getUserInfoStable(stableUsers[i % stableUsers.length]);
// }
// console.timeEnd('Initialized properties');
// console.log(`Result: ${sum5}`);
// console.log('✓ Same hidden class for all objects - FAST!\n');

// // =============================================================================
// // Example 6: BAD - Deleting Properties
// // =============================================================================
// console.log('6. BAD - Deleting Properties');


// performance.mark('start-hidden-class-example-megamorphic');
// interface ProductDeleted {
//   name: string;
//   price: number;
//   stock?: number;
// }

// function getTotalValueDeleted(product: ProductDeleted): number {
//   return product.stock !== undefined ? product.price * product.stock : 0;
// }

// // // Pre-create products and DELETE properties
// const deletedProducts: ProductDeleted[] = [];
// for (let i = 0; i < 10000; i++) {
//   const product: any = { name: 'Product' + i, price: i * 10, stock: i };
  
//   // Delete property - creates "holey" object, very bad!
//   if (i % 2 === 0) {
//     delete product.stock;
//   }
  
//   deletedProducts.push(product);
// }

// // // Warm-up
// let warmup6 = 0;
// for (let i = 0; i < 500000; i++) {
//   warmup6 += getTotalValueDeleted(deletedProducts[i % deletedProducts.length]);
// }


// let sum6 = 0;
// for (let i = 0; i < 5000000; i++) {
//   sum6 += getTotalValueDeleted(deletedProducts[i % deletedProducts.length]);
// }

// performance.mark('end-hidden-class-example-megamorphic');
// const measure6 = performance.measure('With deletions', 'start-hidden-class-example-megamorphic', 'end-hidden-class-example-megamorphic');
// console.log(measure6);


// // // =============================================================================
// // // Example 7: GOOD - Use null Instead of Delete
// // // =============================================================================
// // console.log('7. GOOD - Use null Instead of Delete');

// interface ProductNull {
//   name: string;
//   price: number;
//   stock: number | null;
// }

// function getTotalValueNull(product: ProductNull): number {
//   return product.stock !== null ? product.price * product.stock : 0;
// }

// // // Pre-create products with null values
//     const nullProducts: ProductNull[] = [];
//     for (let i = 0; i < 10000; i++) {
//       const stock = i % 2 === 0 ? null : i;
//       nullProducts.push({ name: 'Product' + i, price: i * 10, stock });
//     }

// // // Warm-up
// let warmup7 = 0;
// for (let i = 0; i < 500000; i++) {
//   warmup7 += getTotalValueNull(nullProducts[i % nullProducts.length]);
// }

// // // Measurement
// performance.mark('start-hidden-class-example-null');
// let sum7 = 0;
// for (let i = 0; i < 5000000; i++) {
//   sum7 += getTotalValueNull(nullProducts[i % nullProducts.length]);
// }
// performance.mark('end-hidden-class-example-null');
// const measure7 = performance.measure('With null values', 'start-hidden-class-example-null', 'end-hidden-class-example-null');
// console.log(measure7);

