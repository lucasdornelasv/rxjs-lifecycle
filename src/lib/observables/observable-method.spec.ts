import { ObservableMethod } from './observable-method';

let objToWatch = {
    fnTest() {}
};

let observable = new ObservableMethod(objToWatch, 'fnTest');
let subscription1 = observable.subscribe(a => {
    console.log('subscription1 :: ', a);
});
objToWatch.fnTest();
let subscription2 = observable.subscribe(a => {
    console.log('subscription2 :: ', a);
});

objToWatch.fnTest();
subscription2.unsubscribe();
objToWatch.fnTest();
subscription1.unsubscribe();
objToWatch.fnTest();

describe("sum", () => {
	it("sums two numbers", () => {
	  expect(1 + 2).toEqual(3);
	});
  });