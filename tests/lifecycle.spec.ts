import { timer } from "rxjs";
import { RxLifecycle, EventMappingHandler } from "../src";

enum TestLifecycleEvent {
	Create,
	Start,
	Resume,
	Pause,
	Stop,
	Destroy,
}

const eventHandler: EventMappingHandler<TestLifecycleEvent> = (event): any => {
	switch (event) {
		case TestLifecycleEvent.Create:
			return TestLifecycleEvent.Destroy;
		case TestLifecycleEvent.Start:
			return TestLifecycleEvent.Stop;
		case TestLifecycleEvent.Resume:
			return TestLifecycleEvent.Pause;
	}
};

function delay(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

describe("RxLifecycle", () => {
	describe("Sync", () => {
		describe("bindUntilEvent", () => {
			test("Should Close on Pause", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(true);
			});

			test("Should Not Close on Not Pause", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(false);

				subscription.unsubscribe();
				expect(subscription.closed).toBe(true);
			});

			test("Should Close on Pause", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(true);
			});

			test("Should Not Close on Not Pause", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(false);

				subscription.unsubscribe();
				expect(subscription.closed).toBe(true);
			});

			test("Should Close on Destroy", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Destroy))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(true);
			});

			test("Should Not Close on Not Destroy", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Destroy))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				subscription.unsubscribe();
				expect(subscription.closed).toBe(true);
			});

			test("Should Not Initialize on Create", () => {
				const lifecycle = new RxLifecycle(eventHandler, TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Create))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				expect(subscription.closed).toBe(true);
			});

			test("Should Not Initialize on Pause", () => {
				const lifecycle = new RxLifecycle(eventHandler, TestLifecycleEvent.Create);
				lifecycle.next(TestLifecycleEvent.Pause);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						expect(false).toBe(true);
					});

				expect(subscription.closed).toBe(true);
			});
		});

		describe("bindToLifecycle", () => {
			test("Should Close on Pause", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);
				lifecycle.next(TestLifecycleEvent.Start);
				lifecycle.next(TestLifecycleEvent.Resume);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindToLifecycle())
					.subscribe(() => {
						expect(false).toBe(true);
					});

				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(true);
			});

			test("Should Close on Stop", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);
				lifecycle.next(TestLifecycleEvent.Start);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindToLifecycle())
					.subscribe(() => {
						expect(false).toBe(true);
					});

				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(true);
			});

			test("Should Close on Destroy", () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				const subscription = timer(1000, 1000)
					.pipe(lifecycle.bindToLifecycle())
					.subscribe(() => {
						expect(false).toBe(true);
					});

				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(true);
			});
		});
	});

	describe("Async", () => {
		describe("bindUntilEvent", () => {
			test("Should Close on Pause", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						++count;
					});

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(true);

				expect(count).toBe(1);
			});

			test("Should Not Close on Not Pause", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						++count;
					});

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(false);

				await delay(100);

				subscription.unsubscribe();
				expect(subscription.closed).toBe(true);

				expect(count).toBe(5);
			});

			test("Should Close on Pause", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						++count;
					});

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(true);

				expect(count).toBe(1);
			});

			test("Should Not Close on Not Pause", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						++count;
					});

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(false);

				await delay(100);

				subscription.unsubscribe();
				expect(subscription.closed).toBe(true);

				expect(count).toBe(5);
			});

			test("Should Close on Destroy", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Destroy))
					.subscribe(() => {
						++count;
					});

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(true);

				expect(count).toBe(1);
			});

			test("Should Not Close on Not Destroy", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				lifecycle.next(TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Destroy))
					.subscribe(() => {
						++count;
					});

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				await delay(100);

				subscription.unsubscribe();
				expect(subscription.closed).toBe(true);

				expect(count).toBe(5);
			});

			test("Should Not Initialize on Create", async () => {
				const lifecycle = new RxLifecycle(eventHandler, TestLifecycleEvent.Create);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Create))
					.subscribe(() => {
						++count;
					});

				await delay(100);

				expect(subscription.closed).toBe(true);

				expect(count).toBe(0);
			});

			test("Should Not Initialize on Pause", async () => {
				const lifecycle = new RxLifecycle(eventHandler, TestLifecycleEvent.Create);
				lifecycle.next(TestLifecycleEvent.Pause);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindUntilEvent(TestLifecycleEvent.Pause))
					.subscribe(() => {
						++count;
					});

				await delay(100);

				expect(subscription.closed).toBe(true);

				expect(count).toBe(0);
			});
		});

		describe("bindToLifecycle", () => {
			test("Should Close on Pause", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				await delay(100);
				lifecycle.next(TestLifecycleEvent.Create);
				await delay(100);
				lifecycle.next(TestLifecycleEvent.Start);
				await delay(100);
				lifecycle.next(TestLifecycleEvent.Resume);
				await delay(100);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindToLifecycle())
					.subscribe(() => {
						++count;
					});

				await delay(100);

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(true);

				expect(count).toBe(2);
			});

			test("Should Close on Stop", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				await delay(100);
				lifecycle.next(TestLifecycleEvent.Create);
				await delay(100);
				lifecycle.next(TestLifecycleEvent.Start);
				await delay(100);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindToLifecycle())
					.subscribe(() => {
						++count;
					});

				await delay(100);

				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(true);

				await delay(100);

				expect(count).toBe(4);
			});

			test("Should Close on Destroy", async () => {
				const lifecycle = new RxLifecycle(eventHandler);
				await delay(100);
				lifecycle.next(TestLifecycleEvent.Create);
				await delay(100);

				let count = 0;
				const subscription = timer(100, 100)
					.pipe(lifecycle.bindToLifecycle())
					.subscribe(() => {
						++count;
					});

				await delay(100);

				expect(subscription.closed).toBe(false);

				lifecycle.next(TestLifecycleEvent.Start);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Resume);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Pause);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Stop);
				expect(subscription.closed).toBe(false);

				await delay(100);

				lifecycle.next(TestLifecycleEvent.Destroy);
				expect(subscription.closed).toBe(true);

				await delay(100);

				expect(count).toBe(5);
			});
		});
	});
});
