import { Observable } from "rxjs";
import { LifecycleTransform } from "./LifecycleTransform";

export interface ILifecycleProvider<E> {
	lifecycle(): Observable<E>;

	bindUntilEvent<T>(event: E): LifecycleTransform<T>;

	bindToLifecycle<T>(): LifecycleTransform<T>;
}
