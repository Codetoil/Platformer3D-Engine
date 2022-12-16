/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */

import * as BABYLON from "@babylonjs/core";
import NewConsole from "./custom_logger";
import { Player } from "./characterController";
import { World } from "./world";
console = new NewConsole(console);

class Game3D {
  public ready: Promise<Game3D>;
  public running: boolean = true;

  public engine: BABYLON.Engine;
  public canvas: HTMLCanvasElement;
  public scene: BABYLON.Scene;
  private deviceSourceManager: BABYLON.DeviceSourceManager;

  public player: Player;
  public camera: BABYLON.ArcFollowCamera;
  public world: World;

  constructor() {
    this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    let game3D = this;
    this.ready = new Promise((resolve, reject) => {
      this.createEngine()
        .catch(function (e) {
          console.error("The available createEngine function failed.");
          console.error(e);
          reject(e);
        })
        .then((engine) => {
          if (!engine) reject(new Error("engine should not be null."));
          this.createScene()
            .catch(function (e) {
              console.error("The available createScene function failed.");
              console.error(e);
              reject(e);
            })
            .then(function (scene) {
              if (!scene) reject(new Error("scene should not be null."));
              resolve(game3D);
            });
        });
    });
  }

  public async createEngine(): Promise<BABYLON.Engine> {
    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });
    return this.engine;
  }

  public async createScene(): Promise<BABYLON.Scene> {
    this.scene = new BABYLON.Scene(this.engine);
    this.deviceSourceManager = new BABYLON.DeviceSourceManager(this.engine);
    // Lights
    var _lightHemi: BABYLON.Light = new BABYLON.HemisphericLight(
      "hemi",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    this.world = new World();
    this.world.gravity = new BABYLON.Vector3(0, -100, 0);
    // Create the player entity
    this.player = new Player();
    this.player.mesh = BABYLON.MeshBuilder.CreateCapsule(
      "player",
      {
        radius: 0.75,
        height: 3,
        subdivisions: 10,
        tessellation: 10,
        capSubdivisions: 10,
      },
      this.scene
    );
    this.player.mesh.material = new BABYLON.StandardMaterial(
      "playerMat",
      this.scene
    );
    /*player.material.diffuseTexture = new BABYLON.Texture(
      "textures/crate.png",
      scene
    );
    player.material.diffuseTexture.hasAlpha = true;*/
    this.player.mesh.position = new BABYLON.Vector3(5, -5, -10);
    /*player.physicsImpostor = new BABYLON.PhysicsImpostor(
      player,
      BABYLON.PhysicsImpostor.CapsuleImpostor,
      { mass: 1 },
      scene
    );*/
    this.player.onGround = true;

    this.camera = new BABYLON.ArcFollowCamera(
      "camera",
      Math.PI / 2,
      0.5,
      10,
      this.player.mesh,
      this.scene
    );
    //camera.rotationOffset = 0.5;
    this.camera.orthoBottom = -10;
    this.camera.orthoLeft = -10;
    this.camera.orthoRight = 10;
    this.camera.orthoTop = 10;
    //camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    if (this.camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
      this.camera.beta = 0;
    } else {
      this.camera.beta = 0.25;
    }

    this.world.grounds = [];
    this.world.walls = [];
    /*var ceilings = [];*/
    //Ground
    var ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
      "ground",
      { width: 20.0, depth: 20.0, height: 0.5 },
      this.scene
    );
    ground.material = new BABYLON.StandardMaterial("groundMat", this.scene);
    //ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;
    ground.position = new BABYLON.Vector3(5, -10, -15);
    ground.rotation = new BABYLON.Vector3(0, 0, 0);
    /*ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 1 },
      scene
    );*/
    this.world.grounds.push(ground);

    var wall: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
      "wall",
      { width: 15, height: 15, depth: 0.75 },
      this.scene
    );
    wall.material = new BABYLON.StandardMaterial("wallMat", this.scene);
    //wall.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    wall.material.backFaceCulling = false;
    wall.position = new BABYLON.Vector3(3.2, -2.5, -15);
    wall.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    /*wall.physicsImpostor = new BABYLON.PhysicsImpostor(
      wall,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 10 },
      scene
    );*/
    //wall.setEnabled(false);
    this.world.walls.push(wall);

    var wall2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
      "wall2",
      { width: 15, height: 15, depth: 0.75 },
      this.scene
    );
    wall2.material = wall.material;
    wall2.position = new BABYLON.Vector3(6.8, -2.5, -15);
    wall2.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    /*wall2.physicsImpostor = new BABYLON.PhysicsImpostor(
      wall2,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 10 },
      scene
    );*/
    //wall2.setEnabled(false);
    this.world.walls.push(wall2);

    var platform = BABYLON.MeshBuilder.CreateBox(
      "platform1",
      { width: 5.0, depth: 5.0, height: 0.5 },
      this.scene
    );
    platform.material = wall.material;
    platform.position = new BABYLON.Vector3(17, -10, -10);
    /*platform.physicsImpostor = new BABYLON.PhysicsImpostor(
      platform,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );*/
    this.world.grounds.push(platform);

    var dbox = BABYLON.MeshBuilder.CreateBox(
      "dbox",
      { width: 1, height: 2, depth: 1 },
      this.scene
    );
    dbox.position = wall.position;
    dbox.material = new BABYLON.StandardMaterial("dboxMat", this.scene);
    //dbox.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
    dbox.material.backFaceCulling = false;
    dbox.setEnabled(false);

    // Enable Collisions
    this.scene.collisionsEnabled = true;
    //Then apply collisions and gravity to the active camera
    //camera.checkCollisions = true;
    //Set the ellipsoid around the camera (e.g. your player's size)
    //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    //finally, say which mesh will be collisionable
    //box.checkCollisions = true;

    this.scene.onBeforeRenderObservable.add(this.beforeRender);

    //new BABYLON.AsciiArtPostProcess("pp", camera, "ariel").activate(camera);

    return this.scene;
  }

  private beforeRender() {
    if (this.camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
      this.camera.beta = 0;
    } else {
      this.camera.beta = 0.25;
    }

    this.player.onGround = this.world.grounds
      .map((gnd: BABYLON.Mesh) =>
        this.player.mesh.intersectsMesh(gnd, false)
          ? this.player.mesh.intersectsMesh(gnd, true)
          : false
      )
      .reduce((p, c) => p || c, false);
    this.player.onWall.forEach(
      (_v: boolean, wll: BABYLON.Mesh, map: Map<BABYLON.Mesh, boolean>) => {
        let v = this.player.mesh.intersectsMesh(wll, false)
          ? this.player.mesh.intersectsMesh(wll, true)
          : false;
        map.set(wll, v);
      }
    );
    this.player.maxHSpeed = 10.0;
    this.player.isSprinting = false;
    this.player.isJumping = false;
    var moveArray = [];
    if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard)) {
      let keyboardSource = this.deviceSourceManager.getDeviceSource(
        BABYLON.DeviceType.Keyboard
      ) as BABYLON.DeviceSource<BABYLON.DeviceType.Keyboard>;
      this.player.isSprinting =
        this.player.isSprinting ||
        keyboardSource.getInput(16) === 0 ||
        keyboardSource.getInput(76) === 0;
      moveArray.push([
        keyboardSource.getInput(87) - keyboardSource.getInput(83),
        keyboardSource.getInput(68) - keyboardSource.getInput(65),
        this.player,
        this.player.onGround,
        this.player.onWall,
        this.player.isSprinting,
      ]);
      moveArray.push([
        keyboardSource.getInput(38) - keyboardSource.getInput(40),
        keyboardSource.getInput(39) - keyboardSource.getInput(37),
        this.player,
        this.player.onGround,
        this.player.onWall,
        this.player.isSprinting,
      ]);
      this.player.isJumping =
        this.player.isJumping ||
        keyboardSource.getInput(32) === 1 ||
        keyboardSource.getInput(74) === 1;
    }
    if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Generic)) {
      let gamepadSource = this.deviceSourceManager.getDeviceSource(
        BABYLON.DeviceType.Generic
      ) as BABYLON.DeviceSource<BABYLON.DeviceType.Generic>;
      this.player.isSprinting =
        this.player.isSprinting ||
        gamepadSource.getInput(0) === 1 ||
        gamepadSource.getInput(3) === 1;
      moveArray.push([
        -gamepadSource.getInput(15),
        gamepadSource.getInput(14),
        this.player,
        this.player.onGround,
        this.player.onWall,
        this.player.isSprinting,
      ]);
      this.player.isJumping =
        this.player.isJumping ||
        gamepadSource.getInput(1) === 1 ||
        gamepadSource.getInput(2) === 1;
    }
    if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Switch)) {
      let gamepadSource = this.deviceSourceManager.getDeviceSource(
        BABYLON.DeviceType.Switch
      ) as BABYLON.DeviceSource<BABYLON.DeviceType.Switch>;
      this.player.isSprinting =
        this.player.isSprinting ||
        gamepadSource.getInput(3) === 1 ||
        gamepadSource.getInput(2) === 1;
      moveArray.push([
        -gamepadSource.getInput(23),
        gamepadSource.getInput(22),
        this.player,
        this.player.onGround,
        this.player.onWall,
        this.player.isSprinting,
      ]);
      this.player.isJumping =
        this.player.isJumping ||
        gamepadSource.getInput(0) === 1 ||
        gamepadSource.getInput(1) === 1;
    }
    if (
      this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.DualShock)
    ) {
      let gamepadSource = this.deviceSourceManager.getDeviceSource(
        BABYLON.DeviceType.DualShock
      ) as BABYLON.DeviceSource<BABYLON.DeviceType.DualShock>;
      this.player.isSprinting =
        this.player.isSprinting ||
        gamepadSource.getInput(3) === 1 ||
        gamepadSource.getInput(2) === 1;
      moveArray.push([
        -gamepadSource.getInput(19),
        gamepadSource.getInput(18),
        this.player,
        this.player.onGround,
        this.player.onWall,
        this.player.isSprinting,
      ]);
      this.player.isJumping =
        this.player.isJumping ||
        gamepadSource.getInput(0) === 1 ||
        gamepadSource.getInput(1) === 1;
    }
    //console.log(moveArray);
    let moveRslt = moveArray.reduce(
      (p, c, i) => {
        var r = Player.calcRadialMovement(c[0], c[1]);
        return p[0] < r ? [r, i] : p;
      },
      [0, null]
    );
    this.player.maxHSpeed *= moveRslt[0];
    let x = moveArray[moveRslt[1]][0];
    let y = moveArray[moveRslt[1]][1];
    if (moveRslt[1] != null) {
      this.player.moveH(
        -x * Math.cos(this.camera.alpha) - y * Math.sin(this.camera.alpha),
        y * Math.cos(this.camera.alpha) - x * Math.sin(this.camera.alpha)
      );
    }
    if (!this.player.isJumping) {
      this.player.hasJumped = false;
    }
    if (this.player.isJumping) {
      if (this.player.onGround && !this.player.hasJumped) {
        this.player.jump();
        this.player.hasJumped = true;
      }
      if (
        this.player.canWallJump &&
        !this.player.onGround &&
        this.player.maxHSpeed > 0.1
      ) {
        this.player.onWall.forEach((e) => {
          if (e[1]) {
            this.player.wallJump(e[0]);
          }
        });
      }

      if (
        !this.player.onGround &&
        ![...this.player.onWall.values()].reduce(
          (p: boolean, c: boolean) => p || c,
          false
        )
      ) {
        this.player.vel = this.player.vel.add(new BABYLON.Vector3(0, 0.5, 0));
      }
    } else {
      this.player.canWallJump = true;
    }
    if (this.player.onGround) {
      this.player.lastWall = null;
    }
    var velH = new BABYLON.Vector3(this.player.vel.x, 0, this.player.vel.z);
    if (this.player.isSprinting && this.player.onGround) {
      this.player.maxHSpeed *= 1.3;
    } else if (this.player.isSprinting && !this.player.onGround) {
      this.player.maxHSpeed *= 1.2;
    }
    if (velH.length() > this.player.maxHSpeed) {
      velH = velH.normalize().scale(this.player.maxHSpeed);
    }
    var vely = this.player.vel.y;
    if (Math.abs(vely) > 50) {
      vely = 50 * (vely === 0 ? 0 : vely > 0 ? 1 : -1);
    }
    this.player.vel = new BABYLON.Vector3(velH.x, vely, velH.z);
    this.player.angVel = BABYLON.Quaternion.Zero();
    var dir = new BABYLON.Vector3(0, 0, 1);
    dir.rotateByQuaternionToRef(this.player.mesh.rotationQuaternion, dir);
    dir.y = 0;
    this.player.mesh.setDirection(dir);
    this.player.rot = this.player.mesh.rotationQuaternion;
  }
}

class EventHandler {
  public static onResize(game3D: Game3D) {
    game3D.engine.resize();
  }
}

var game3D: Game3D = new Game3D();

game3D.ready.then((value) => {
  window.addEventListener("resize", EventHandler.onResize.bind(null, Game3D));

  value.engine.runRenderLoop(function () {
    if (value.running && value.scene && value.scene.activeCamera) {
      try {
        value.scene.render();
      } catch (e: any) {
        console.error(e);
        value.running = false;
      }
    } else if (!value.running) {
      value.engine.stopRenderLoop();
      alert("Stopping rendering");
    }
  });
});
