import { of } from "rxjs";
import { OutsideLifecycleException } from "./OutsideLifecycleException";

export class Functions {
	static readonly RESUME_FUNCTION = (error: any) => {
		if (error instanceof OutsideLifecycleException) {
			return of(true);
		}

		return of(false);
	};

	static readonly SHOULD_COMPLETE = (a: boolean) => a;
}
