import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  gameWidth?: number;
  gameHeight?: number;

  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  player?: Phaser.GameObjects.Shape;
  playerSize: number = 25;

  movementSpeed: number = 2;
  fireSpeed: number = 1;
  isFiring: boolean = false;

  leftBound?: number;
  rightBound?: number;

  enemies?: Phaser.GameObjects.Shape[];
  numEnemies: number = 3;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.gameWidth = this.game.config.width as number;
    this.gameHeight = this.game.config.height as number;

    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(0, 0, this.gameWidth, this.gameHeight, "starfield")
      .setOrigin(0, 0);

    this.leftBound = this.playerSize - 5;
    this.rightBound = this.gameWidth - this.leftBound;

    this.player = this.add.rectangle(
      this.gameWidth / 2,
      this.gameHeight - this.playerSize + 5,
      this.playerSize,
      this.playerSize,
      0x3ab883,
    );

    let enemyHeight = 30;
    for (let e = 0; e < this.numEnemies; e++) {
      const enemy = this.add.rectangle(
        this.gameWidth / 2,
        enemyHeight,
        50,
        25,
        0xb3350e,
      );
      this.enemies?.push(enemy);
      enemyHeight += 30;
    }
  }

  update() {
    this.starfield!.tilePositionX -= 4;

    if (this.isFiring == false) {
      if (this.left!.isDown && this.player!.x > this.leftBound!) {
        this.player!.x -= this.movementSpeed;
      }
      if (this.right!.isDown && this.player!.x < this.rightBound!) {
        this.player!.x += this.movementSpeed;
      }
    }

    if (this.fire!.isDown) {
      this.isFiring = true;
    }

    if (this.isFiring == true) {
      this.player!.y -= this.fireSpeed;
      if (this.player!.y < -this.playerSize) {
        this.player!.y = this.gameHeight! - this.playerSize + 5;
        this.isFiring = false;
      }
    }
  }
}
