import { Observable } from "rxjs";

export interface LifecycleTransform<T> {
	(source: Observable<T>): Observable<T>;
}
