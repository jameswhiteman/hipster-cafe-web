////////////////////////////////////////////////////////////////////////////////
// Extended robot arm exercise: add a body
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = true;
var gridY = false;
var gridZ = false;
var axes = true;
var ground = true;
/*
// joints
var character, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle;
var leftShoulder, rightShoulder, leftBrachialis, rightBrachialis, leftWrist, rightWrist;
var neckJoint, headJoint;
// muscles
var stomach, leftThigh, rightThigh, leftCalf, rightCalf, leftFoot, rightFoot;
var chest, leftBicep, rightBicep, leftForearm, rightForearm, leftHand, rightHand;
var neck, head;

var controls = new function() {
  this.rotateCharacterX = 0;
  this.rotateCharacterY = 0;
  this.rotateCharacterZ = 0;
  this.characterX = 0;
  this.characterY = 0;
  this.characterZ = 0;
  this.neckJointX = 0;
  this.neckJointY = 0;
  this.neckJointZ = 0;
  this.headJointX = 0;
  this.headJointY = 0;
  this.headJointZ = 0;

  this.leftHipX = 0;
  this.leftHipY = 0;
  this.leftHipZ = 0;
  this.leftKneeX = 0;
  this.leftAnkleX = 0;
  this.leftAnkleY = 0;
  this.leftAnkleZ = 0;
  this.leftShoulderX = 0;
  this.leftShoulderY = 0;
  this.leftShoulderZ = 0;
  this.leftBrachialisX = 0;
  this.leftWristX = 0;
  this.leftWristY = 0;
  this.leftWristZ = 0;

  this.rightHipX = 0;
  this.rightHipY = 0;
  this.rightHipZ = 0;
  this.rightKneeX = 0;
  this.rightAnkleX = 0;
  this.rightAnkleY = 0;
  this.rightAnkleZ = 0;
  this.rightShoulderX = 0;
  this.rightShoulderY = 0;
  this.rightShoulderZ = 0;
  this.rightBrachialisX = 0;
  this.rightWristX = 0;
  this.rightWristY = 0;
  this.rightWristZ = 0;
}
*/
function fillScene() {
    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

    // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x222222 );
    var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    light.position.set( 200, 400, 500 );
    var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    light2.position.set( -500, 250, -200 );

    // Environment
    //var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xCCCCCC, specular: 0x6E23BB, shininess: 20 } );
    var groundTexture = THREE.ImageUtils.loadTexture("./textures/ground.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1024, 1024);
    var groundMaterial = new THREE.MeshBasicMaterial({
      map: groundTexture
    });
    /*
  */
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(25000, 25000), groundMaterial);
    ground.position.x = 3000;
    ground.position.y = -500;
    ground.position.z = -2500;
    ground.rotation.x = -Math.PI/2;

    // Robot definitions
    var robotBaseMaterial = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
    var robotForearmMaterial = new THREE.MeshPhongMaterial( { color: 0xF4C154, specular: 0xF4C154, shininess: 100 } );
    var robotUpperArmMaterial = new THREE.MeshPhongMaterial( { color: 0x95E4FB, specular: 0x95E4FB, shininess: 100 } );
    var robotBodyMaterial = new THREE.MeshPhongMaterial( { color: 0x279933, specular: 0x279933, shininess: 100 } );
    var coneMaterial = new THREE.MeshPhongMaterial({color:0x777777, specular: 0x297382, shininess:50});
    var bulbMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.25});
/*
    character = new THREE.Object3D();
    var character2 = new THREE.Object3D();
    createCharacter(character, 0, 0, 0x333388);
    createCharacter(character2, 0, 0, 0x883333);*/
    //character = new Player();
    /*
    character.position.x = 0;
    character.position.y = 0;
    character.position.z = 0;
    character2.position.x = 7000;
    character2.position.y = 0;
    character2.position.z = 0;*/
    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);
    //scene.add(character);
    //scene.add(character2);
    scene.add(ground);
}

function createCharacter(part, x, y, color)
{
    var material = new THREE.MeshPhongMaterial( { color: color, specular: 0x279933, shininess: 100 } );

    // Body proportions
    var stomachWidth = 180, stomachHeight = 150, stomachDepth = 100;
    var hipRadius = 40, hipSegments = 50;
    var thighTop = 45, thighBottom = 35, thighHeight = 130, thighSegments = 50;
    var kneeRadius = 25, kneeSegments = 30;
    var calfTop = 35, calfBottom = 25, calfHeight = 100, calfSegments = 50;
    var ankleRadius = 25, ankleSegments = 50;
    var footWidth = 50, footHeight = 50, footDepth = 150;
    var chestTop = 125, chestBottom = 90, chestHeight = 200, chestSegments = 10;
    var shoulderRadius = 30, shoulderSegments = 50;
    var bicepTop = 40, bicepBottom = 30, bicepHeight = 90, bicepSegments = 50;
    var brachialisRadius = 25, brachialisSegments = 50;
    var forearmTop = 30, forearmBottom = 20, forearmHeight = 100, forearmSegments = 50;
    var wristRadius = 20, wristSegments = 50;
    var handWidth = 20, handHeight = 70, handDepth = 50;
    var neckJointRadius = 20, neckJointSegments = 50;
    var neckTop = 38, neckBottom = 50, neckHeight = 70, neckSegments = 50;
    var headJointRadius = 20, headJointSegments = 50;
    var headRadius = 65, headSegments = 50;

    // Create body
    stomach = new THREE.Mesh(new THREE.BoxGeometry(stomachWidth, stomachHeight, stomachDepth), material);
    chest = new THREE.Mesh(new THREE.CylinderGeometry(chestTop, chestBottom, chestHeight, chestSegments), material);
    neckJoint = new THREE.Mesh(new THREE.SphereGeometry(neckJointRadius, neckJointSegments, neckJointSegments), material);
    neck = new THREE.Mesh(new THREE.CylinderGeometry(neckTop, neckBottom, neckHeight, neckSegments), material);
    headJoint = new THREE.Mesh(new THREE.SphereGeometry(headJointRadius, headJointSegments, headJointSegments), material);
    head = new THREE.Mesh(new THREE.SphereGeometry(headRadius, headSegments, headSegments), material);

    leftHip = new THREE.Mesh(new THREE.SphereGeometry(hipRadius, hipSegments, hipSegments), material);
    leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(thighTop, thighBottom, thighHeight, thighSegments), material );
    leftKnee = new THREE.Mesh(new THREE.SphereGeometry(kneeRadius, kneeSegments, kneeSegments), material);
    leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(calfTop, calfBottom, calfHeight, calfSegments), material);
    leftAnkle = new THREE.Mesh(new THREE.SphereGeometry(ankleRadius, ankleSegments, ankleSegments), material);
    leftFoot = new THREE.Mesh(new THREE.BoxGeometry(footWidth, footHeight, footDepth), material);
    leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(shoulderRadius, shoulderSegments, shoulderSegments), material);
    leftBicep = new THREE.Mesh(new THREE.CylinderGeometry(bicepTop, bicepBottom, bicepHeight, bicepSegments), material);
    leftBrachialis = new THREE.Mesh(new THREE.SphereGeometry(brachialisRadius, brachialisSegments, brachialisSegments), material);
    leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(forearmTop, forearmBottom, forearmHeight, forearmSegments), material);
    leftWrist = new THREE.Mesh(new THREE.SphereGeometry(wristRadius, wristSegments, wristSegments), material);
    leftHand = new THREE.Mesh(new THREE.BoxGeometry(handWidth, handHeight, handDepth), material);

    rightHip = new THREE.Mesh(new THREE.SphereGeometry(hipRadius, hipSegments, hipSegments), material);
    rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(thighTop, thighBottom, thighHeight, thighSegments), material );
    rightKnee = new THREE.Mesh(new THREE.SphereGeometry(kneeRadius, kneeSegments, kneeSegments), material);
    rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(calfTop, calfBottom, calfHeight, calfSegments), material);
    rightAnkle = new THREE.Mesh(new THREE.SphereGeometry(ankleRadius, ankleSegments, ankleSegments), material);
    rightFoot = new THREE.Mesh(new THREE.BoxGeometry(footWidth, footHeight, footDepth), material);
    rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(shoulderRadius, shoulderSegments, shoulderSegments), material);
    rightBicep = new THREE.Mesh(new THREE.CylinderGeometry(bicepTop, bicepBottom, bicepHeight, bicepSegments), material);
    rightBrachialis = new THREE.Mesh(new THREE.SphereGeometry(brachialisRadius, brachialisSegments, brachialisSegments), material);
    rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(forearmTop, forearmBottom, forearmHeight, forearmSegments), material);
    rightWrist = new THREE.Mesh(new THREE.SphereGeometry(wristRadius, wristSegments, wristSegments), material);
    rightHand = new THREE.Mesh(new THREE.BoxGeometry(handWidth, handHeight, handDepth), material);

    // Reposition body
    leftHip.position.x = (stomachWidth / -2) + (hipRadius);
    leftHip.position.y = (stomachHeight / -2) - hipRadius;
    leftThigh.position.x = 0;
    leftThigh.position.y = (hipRadius * -1) - (thighHeight / 2);
    leftKnee.position.x = 0;
    leftKnee.position.y = (thighHeight / -2) - kneeRadius;
    leftCalf.position.x = 0;
    leftCalf.position.y = (kneeRadius * -1) - (calfHeight / 2);
    leftAnkle.position.x = 0;
    leftAnkle.position.y = (calfHeight / -2) - ankleRadius;
    leftFoot.position.x = 0;
    leftFoot.position.y = (ankleRadius * -1) - (footHeight / 2);
    leftFoot.position.z = (footDepth / 4);
    leftShoulder.position.x = (chestTop * -1) - (shoulderRadius / 2);
    leftShoulder.position.y = chestHeight / 2 - shoulderRadius + 5;
    leftBicep.position.x = 0;
    leftBicep.position.y = (shoulderRadius * -1) - (bicepHeight / 2);
    leftBrachialis.position.x = 0;
    leftBrachialis.position.y = (bicepHeight / -2) - brachialisRadius;
    leftForearm.position.x = 0;
    leftForearm.position.y = (brachialisRadius * -1) - (forearmHeight / 2);
    leftWrist.position.x = 0;
    leftWrist.position.y = (forearmHeight / -2) - wristRadius;
    leftHand.position.x = 0;
    leftHand.position.y = (wristRadius * -1) - (handHeight / 2);

    rightHip.position.x = (stomachWidth / 2) - (hipRadius);
    rightHip.position.y = (stomachHeight / -2) - hipRadius;
    rightThigh.position.x = 0;
    rightThigh.position.y = (hipRadius * -1) - (thighHeight / 2);
    rightKnee.position.x = 0;
    rightKnee.position.y = (thighHeight / -2) - kneeRadius;
    rightCalf.position.x = 0;
    rightCalf.position.y = (kneeRadius * -1) - (calfHeight / 2);
    rightAnkle.position.x = 0;
    rightAnkle.position.y = (calfHeight / -2) - ankleRadius;
    rightFoot.position.x = 0;
    rightFoot.position.y = (ankleRadius * -1) - (footHeight / 2);
    rightFoot.position.z = (footDepth / 4);
    rightShoulder.position.x = (chestTop) + (shoulderRadius / 2);
    rightShoulder.position.y = chestHeight / 2 - shoulderRadius + 5;
    rightBicep.position.x = 0;
    rightBicep.position.y = (shoulderRadius * -1) - (bicepHeight / 2);
    rightBrachialis.position.x = 0;
    rightBrachialis.position.y = (bicepHeight / -2) - brachialisRadius;
    rightForearm.position.x = 0;
    rightForearm.position.y = (brachialisRadius * -1) - (forearmHeight / 2);
    rightWrist.position.x = 0;
    rightWrist.position.y = (forearmHeight / -2) - wristRadius;
    rightHand.position.x = 0;
    rightHand.position.y = (wristRadius * -1) - (handHeight / 2);

    chest.position.x = 0;
    chest.position.y = (stomachHeight / 2) + (chestHeight / 2);
    neckJoint.position.x = 0;
    neckJoint.position.y = (chestHeight / 2);
    neck.position.x = 0;
    neck.position.y = neckJointRadius;
    headJoint.position.x = 0;
    headJoint.position.y = neckHeight / 2;
    head.position.x = 0;
    head.position.y = (headJointRadius);


    // Hierarchize body
    leftAnkle.add(leftFoot);
    leftCalf.add(leftAnkle);
    leftKnee.add(leftCalf);
    leftThigh.add(leftKnee);
    leftHip.add(leftThigh);
    leftWrist.add(leftHand);
    leftForearm.add(leftWrist);
    leftBrachialis.add(leftForearm);
    leftBicep.add(leftBrachialis);
    leftShoulder.add(leftBicep);

    rightAnkle.add(rightFoot);
    rightCalf.add(rightAnkle);
    rightKnee.add(rightCalf);
    rightThigh.add(rightKnee);
    rightHip.add(rightThigh);
    rightWrist.add(rightHand);
    rightForearm.add(rightWrist);
    rightBrachialis.add(rightForearm);
    rightBicep.add(rightBrachialis);
    rightShoulder.add(rightBicep);

    stomach.add(leftHip);
    stomach.add(rightHip);
    chest.add(leftShoulder);
    chest.add(rightShoulder);
    headJoint.add(head);
    neck.add(headJoint);
    neckJoint.add(neck);
    chest.add(neckJoint);
    stomach.add(chest);
    part.add(stomach);
}


function init() {
    var canvasWidth = 1400;
    var canvasHeight = 700
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
	var canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor( 0xAAAAAA, 1.0 );

    // CAMERA
    fillScene();
    camera = new THREE.PerspectiveCamera( 38, canvasRatio, 1, 30000 );
	  camera.position.set(-7000, 7000, 3000);
	  camera.lookAt(new THREE.Vector3(character.position.x, character.position.y, character.position.z));

	// EFFECT CONTROLLER
	effectController = {
        uy: 70.0,
        uz: -15.0,

        fy: 10.0,
        fz: 60.0
    };
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function setupGui() {
  var gui = new DAT.GUI();
  gui.add(controls, 'rotateCharacterX', -3, 3);
  gui.add(controls, 'rotateCharacterY', -3, 3);
  gui.add(controls, 'rotateCharacterZ', -3, 3);
  gui.add(controls, 'characterX', -200, 200);
  gui.add(controls, 'characterY', -200, 200);
  gui.add(controls, 'characterZ', -200, 200);
  gui.add(controls, 'neckJointX', -0.25, 0.25);
  gui.add(controls, 'neckJointY', -0.25, 0.25);
  gui.add(controls, 'neckJointZ', -0.25, 0.25);
  gui.add(controls, 'headJointX', -1, 1);
  gui.add(controls, 'headJointY', -1, 1);
  gui.add(controls, 'headJointZ', -1, 1);

  gui.add(controls, 'leftHipX', -2, 2);
  gui.add(controls, 'leftHipY', -1, 1);
  gui.add(controls, 'leftHipZ', -1, 1);
  gui.add(controls, 'leftKneeX', 0, 2);
  gui.add(controls, 'leftAnkleX', -1, 1);
  gui.add(controls, 'leftAnkleY', -1, 1);
  gui.add(controls, 'leftAnkleZ', -1, 1);
  gui.add(controls, 'leftShoulderX', -1, 1);
  gui.add(controls, 'leftShoulderY', -1, 1);
  gui.add(controls, 'leftShoulderZ', -3, 0);
  gui.add(controls, 'leftBrachialisX', -2.5, 0);
  gui.add(controls, 'leftWristX', -1, 1);
  gui.add(controls, 'leftWristY', -1, 1);
  gui.add(controls, 'leftWristZ', -1, 1);

  gui.add(controls, 'rightHipX', -2, 2);
  gui.add(controls, 'rightHipY', -1, 1);
  gui.add(controls, 'rightHipZ', -1, 1);
  gui.add(controls, 'rightKneeX', 0, 2);
  gui.add(controls, 'rightAnkleX', -1, 1);
  gui.add(controls, 'rightAnkleY', -1, 1);
  gui.add(controls, 'rightAnkleZ', -1, 1);
  gui.add(controls, 'rightShoulderX', -1, 1);
  gui.add(controls, 'rightShoulderY', -1, 1);
  gui.add(controls, 'rightShoulderZ', 0, 3);
  gui.add(controls, 'rightBrachialisX', -2.5, 0);
  gui.add(controls, 'rightWristX', -1, 1);
  gui.add(controls, 'rightWristY', -1, 1);
  gui.add(controls, 'rightWristZ', -1, 1);
}

function render() {
    var delta = clock.getDelta();

    if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
    {
        gridX = effectController.newGridX;
        gridY = effectController.newGridY;
        gridZ = effectController.newGridZ;
        ground = effectController.newGround;
        axes = effectController.newAxes;

        fillScene();
    }

    // Animation logic
    character.rotation.x = controls.rotateCharacterX;
    character.rotation.y = controls.rotateCharacterY;
    character.rotation.z = controls.rotateCharacterZ;
    character.position.x = controls.characterX;
    character.position.y = controls.characterY;
    character.position.z = controls.characterZ;
    neckJoint.rotation.x = controls.neckJointX;
    neckJoint.rotation.y = controls.neckJointY;
    neckJoint.rotation.z = controls.neckJointZ;
    headJoint.rotation.x = controls.headJointX;
    headJoint.rotation.y = controls.headJointY;
    headJoint.rotation.z = controls.headJointZ;

    leftHip.rotation.x = controls.leftHipX;
    leftHip.rotation.y = controls.leftHipY;
    leftHip.rotation.z = controls.leftHipZ;
    leftKnee.rotation.x = controls.leftKneeX;
    leftAnkle.rotation.x = controls.leftAnkleX;
    leftAnkle.rotation.y = controls.leftAnkleY;
    leftAnkle.rotation.z = controls.leftAnkleZ;
    leftShoulder.rotation.x = controls.leftShoulderX;
    leftShoulder.rotation.y = controls.leftShoulderY;
    leftShoulder.rotation.z = controls.leftShoulderZ;
    leftBrachialis.rotation.x = controls.leftBrachialisX;
    leftWrist.rotation.x = controls.leftWristX;
    leftWrist.rotation.y = controls.leftWristY;
    leftWrist.rotation.z = controls.leftWristZ;

    rightHip.rotation.x = controls.rightHipX;
    rightHip.rotation.y = controls.rightHipY;
    rightHip.rotation.z = controls.rightHipZ;
    rightKnee.rotation.x = controls.rightKneeX;
    rightAnkle.rotation.x = controls.rightAnkleX;
    rightAnkle.rotation.y = controls.rightAnkleY;
    rightAnkle.rotation.z = controls.rightAnkleZ;
    rightShoulder.rotation.x = controls.rightShoulderX;
    rightShoulder.rotation.y = controls.rightShoulderY;
    rightShoulder.rotation.z = controls.rightShoulderZ;
    rightBrachialis.rotation.x = controls.rightBrachialisX;
    rightWrist.rotation.x = controls.rightWristX;
    rightWrist.rotation.y = controls.rightWristY;
    rightWrist.rotation.z = controls.rightWristZ;

    renderer.render(scene, camera);
}

try {
    init();
    /*
    fillScene();
    setupGui();
    animate();
    */
} catch(e) {
    var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
    $('#container').append(errorReport+e);
}
