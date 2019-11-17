import { Observable, Subject } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

const map = new WeakMap<any, Map<any, Observable<any>>>();

const hasObservables = (objToWatch: any, methodName: any) => {
    if (!map.has(objToWatch)) {
        return false;
    }
    const aux = map.get(objToWatch);
    return aux && aux.has(methodName);
};

class MapObservablesManager {
    weakMap = new WeakMap<any, Map<any, Observable<any>>>();

    has(objToWatch: any, methodName: any) {
        if (!this.weakMap.has(objToWatch)) {
            return false;
        }
        const aux = this.weakMap.get(objToWatch);
        return !!(aux && aux.has(methodName));
    }

    get(objToWatch: any, methodName: any) {
        const aux = this.weakMap.get(objToWatch);
        if (aux) {
            return aux.get(methodName);
        }
    }

    set(objToWatch: any, methodName: any, observable: Observable<any>) {
        if (this.weakMap.has(objToWatch)) {
            const aux = this.weakMap.get(objToWatch);
            if (aux) {
                aux.set(methodName, observable);
            }
        } else {
            this.weakMap.set(objToWatch, new Map([[methodName, observable]]));
        }
    }

    delete(objToWatch: any, methodName: any) {
        if (this.weakMap.has(objToWatch)) {
            const aux = this.weakMap.get(objToWatch);
            if (aux) {
                aux.delete(methodName);
                if (aux.size <= 0) {
                    this.weakMap.delete(objToWatch);
                }
            }
        }
    }
}

let mapManager = new MapObservablesManager();

export class ObservableMethod<T = any> extends Observable<number> {
    constructor(objToWatch: T, methodName: keyof T, beforeCall = true) {
        super(subscriber => {
            const objToWatchAux = objToWatch as any;
            let observable: Observable<any> | undefined;
            if (!mapManager.has(objToWatch, methodName)) {
                const fnOrigin = objToWatch[methodName] as any;

                const subject = new Subject<any>();
                observable = subject.pipe(
                    finalize(() => {
                        mapManager.delete(objToWatch, methodName);
                        objToWatch[methodName] = fnOrigin;
                    }),
                    share()
                );
                mapManager.set(objToWatch, methodName, observable);
                if (beforeCall) {
                    objToWatchAux[methodName] = ((...args: any[]) => {
                        subject.next();
                        return fnOrigin.apply(objToWatchAux, args);
                    }) as any;
                } else {
                    objToWatchAux[methodName] = ((...args: any[]) => {
                        const result = fnOrigin.apply(objToWatchAux, args);
                        subject.next();
                        return result;
                    }) as any;
                }
            } else {
                observable = mapManager.get(objToWatch, methodName);
            }

            if (observable) {
                let count = 0;
                subscriber.add(
                    observable.subscribe(() => {
                        subscriber.next(++count);
                    })
                );
            }
        });
    }
}
