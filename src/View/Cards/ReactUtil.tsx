import * as React from 'react'
import CardBox from '../../ViewModel/Cards/CardBox'

export function make_refs<T>(num: number): Array<React.RefObject<T>> {
    const refs: Array<React.RefObject<T>> = [];
    for (let i = 0; i < num; ++i) {
        refs.push(React.createRef<T>());
    }
    return refs;
}

export function make_card_box(box: ClientRect) {
    return new CardBox(box.left, box.right, box.bottom, box.top, box.width, box.height);
}