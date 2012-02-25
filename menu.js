/**
 * @copyright 2012 yayramen && Inumedia.
 * @author yayramen
 * @description This is where all the items on the menu are stored and loaded into runtime from.
 * @note All commands must be entirely lower case.
 */
global.mRandomItem = function (list) {
      return list[Math.floor(Math.random() * list.length)];
};

global.mMenu = [,
    {
      item: 'rum',
      instock: ['Bacardi', 'Captain Jack', 'Stroh'],
      message: 'Have yourself a shot of ',
      callback: function () {
        console.log('you\'ve come this far...');
        mBot.speak(this.message + mRandomItem(this.instock));
      }
    }
];
