/*
 * @功能：自定义左侧面板
 */
import PaletteModule from './palette';
import CustomPalette from './CustomPalette';

export default {
    __depends__: [PaletteModule],
    __init__: ['paletteProvider'],
    paletteProvider: ['type', CustomPalette],
};
