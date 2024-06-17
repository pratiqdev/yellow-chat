import { useEffect, useRef } from 'react';

export const useUpdateEffect = (effect: () => void, deps: unknown[]) => {
    const prevDeps = useRef(deps);

    useEffect(() => {
        if (JSON.stringify(prevDeps.current) !== JSON.stringify(deps)) {
            effect();
            prevDeps.current = deps;
        }
    }, [effect, deps]);
}




export const useDebounceEffect = (effect:() => void, dependencies:unknown[], delay:number = 500) => {
    const savedEffect = useRef<() => void>(()=>{});

    useEffect(() => {
        const handler = setTimeout(() => {
            savedEffect.current = effect;
        }, delay);

        return () => {
            clearTimeout(handler);
            if (savedEffect.current) {
                savedEffect.current();
            }
        };
        // TODO: find alternative - unpredictable spread in deps array
    }, [effect, ...dependencies, delay]);
};
