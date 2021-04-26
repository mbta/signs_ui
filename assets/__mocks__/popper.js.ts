import StockPopperJs from 'popper.js';

/*
  From https://github.com/popperjs/popper-core/issues/478#issuecomment-638842453
  Fixes an issue with popper.js running in jsdom:
*/

export default class PopperJs {
  static placements = StockPopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
      update: () => {},
    };
  }
}
