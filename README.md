My take on the classic Minesweeper, built in React. 

![sweeper](https://github.com/zcallanan/sweeper/raw/master/public/sweeper.png)

### Custom Settings
- Change the number of squares along a side of the game board
- Make the game more forgiving by adjusting the number of lives you have
- Adjust the hidden bomb density by changing the percentage of bombs on the board

### Stats
- Tracks the number of lives available. Reveal a bomb, lose a life
- Displays the number of hidden bombs
- Displays the number of squares revealed against the total number of squares to reveal
- You can flag squares as potential bombs, or as unknown. The number of each type of flag is displayed

### Win/Loss
- Reveal all squares except for bombs and you win
- Expose bombs until you run out of lives (sub zero) and you lose

### Notifications & Animations
- Added several notifications and animations around revealing bombs, winning, and losing
