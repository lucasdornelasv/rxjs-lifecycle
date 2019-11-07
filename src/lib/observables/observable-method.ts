import { Observable, Subject } from 'rxjs';
import { finalize, refCount, publish } from 'rxjs/operators';

export class ObservableMethod<T = any> extends Observable<number> {
	private static readonly REGISTRY_NAME = '__registrySubject__';

	constructor(objToWatch: T, methodName: keyof T) {
		super(subscriber => {
			const objToWatchAux = objToWatch as any;
			if (!objToWatchAux[ObservableMethod.REGISTRY_NAME]) {
				const fnOrigin = objToWatch[methodName] as any;

				const subject = new Subject<any>();
				objToWatchAux[ObservableMethod.REGISTRY_NAME] = subject.pipe(
					finalize(() => {
						delete objToWatchAux[ObservableMethod.REGISTRY_NAME];
						objToWatch[methodName] = fnOrigin;
					}),
					publish(),
					refCount()
				);
				objToWatchAux[methodName] = ((...args: any[]) => {
					if (objToWatchAux[ObservableMethod.REGISTRY_NAME]) {
						subject.next();
					}
					fnOrigin.apply(objToWatchAux, args);
				}) as any;
			}

			let count = 0;
			subscriber.add(
				objToWatchAux[ObservableMethod.REGISTRY_NAME].subscribe(() => {
					subscriber.next(++count);
				})
			);
		});
	}
}
