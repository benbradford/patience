import * as React from 'react'

export function make_refs<T>(num: number): Array<React.RefObject<T>> {
    const refs: Array<React.RefObject<T>> = [];
    for (let i = 0; i < num; ++i) {
        refs.push(React.createRef<T>());
    }
    return refs;
}