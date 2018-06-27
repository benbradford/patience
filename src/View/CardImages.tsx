
import {Suit, Face} from '../Model/Cards/Card'

const images = [
    require('../Asset/Classic/c01.png'),
    require('../Asset/Classic/c02.png'),
    require('../Asset/Classic/c03.png'),
    require('../Asset/Classic/c04.png'),
    require('../Asset/Classic/c05.png'),
    require('../Asset/Classic/c06.png'),
    require('../Asset/Classic/c07.png'),
    require('../Asset/Classic/c08.png'),
    require('../Asset/Classic/c09.png'),
    require('../Asset/Classic/c10.png'),
    require('../Asset/Classic/c11.png'),
    require('../Asset/Classic/c12.png'),
    require('../Asset/Classic/c13.png'),

    require('../Asset/Classic/s01.png'),
    require('../Asset/Classic/s02.png'),
    require('../Asset/Classic/s03.png'),
    require('../Asset/Classic/s04.png'),
    require('../Asset/Classic/s05.png'),
    require('../Asset/Classic/s06.png'),
    require('../Asset/Classic/s07.png'),
    require('../Asset/Classic/s08.png'),
    require('../Asset/Classic/s09.png'),
    require('../Asset/Classic/s10.png'),
    require('../Asset/Classic/s11.png'),
    require('../Asset/Classic/s12.png'),
    require('../Asset/Classic/s13.png'),

    require('../Asset/Classic/d01.png'),
    require('../Asset/Classic/d02.png'),
    require('../Asset/Classic/d03.png'),
    require('../Asset/Classic/d04.png'),
    require('../Asset/Classic/d05.png'),
    require('../Asset/Classic/d06.png'),
    require('../Asset/Classic/d07.png'),
    require('../Asset/Classic/d08.png'),
    require('../Asset/Classic/d09.png'),
    require('../Asset/Classic/d10.png'),
    require('../Asset/Classic/d11.png'),
    require('../Asset/Classic/d12.png'),
    require('../Asset/Classic/d13.png'),

    require('../Asset/Classic/h01.png'),
    require('../Asset/Classic/h02.png'),
    require('../Asset/Classic/h03.png'),
    require('../Asset/Classic/h04.png'),
    require('../Asset/Classic/h05.png'),
    require('../Asset/Classic/h06.png'),
    require('../Asset/Classic/h07.png'),
    require('../Asset/Classic/h08.png'),
    require('../Asset/Classic/h09.png'),
    require('../Asset/Classic/h10.png'),
    require('../Asset/Classic/h11.png'),
    require('../Asset/Classic/h12.png'),
    require('../Asset/Classic/h13.png')
];

export function card_image(s : Suit, f : Face) {
    let indexStart = 0;
    if (s === Suit.spades) {
        indexStart = 13;
    } else if (s === Suit.diamonds) {
        indexStart = 26;
    } else if (s === Suit.hearts) {
        indexStart = 39;
    }
    return images[indexStart + f];
}