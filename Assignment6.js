var camera, scene, renderer;
var intersects = [];
// Game logic
var money = 1000;
var characters = [];
var counters = [];
var tables = [];
var bathrooms = [];
var decors = [];
var wifi = 0;
var smell = 0;
// Global variables
var interfaceElements = 0;
var nextCharacter = 100;

// Game logic
var selected = "";

function init() {
  var canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  var canvasWidth = 1600;
  var canvasHeight = 800;
  var canvasRatio = canvasWidth / canvasHeight;
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor( 0xCCCCCC, 1.0 );

  scene = new THREE.Scene();
  clickable = new THREE.Object3D();
  var interfaceAddCounter = createInterface("addCounter");
  var interfaceAddTable = createInterface("addTable");
  var interfaceAddBathroom = createInterface("addBathroom");
  var interfaceAddDecor = createInterface("addDecor");
  var interfaceAddWifi = createInterface("addWifi");
  var interfaceAddScent = createInterface("addScent");
  var ground = createGround();
  initScene(scene);
  scene.add(ground);

  // Add interface
  scene.add(interfaceAddCounter);
  scene.add(interfaceAddTable);
  scene.add(interfaceAddBathroom);
  scene.add(interfaceAddDecor);
  scene.add(interfaceAddWifi);
  scene.add(interfaceAddScent);
  camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 30000 );
  camera.position.set(-7000, 7000, 3000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var context

  // Canvas Updates
  animate();
  canvas.addEventListener('mousemove', interfaceMove, false);
  canvas.addEventListener('click', interfaceClick, false);

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
  gameLogic();
  renderer.render(scene, camera);
}

function gameLogic() {
  if (nextCharacter > 0)
  nextCharacter--;
  if (nextCharacter === 0)
    {
      nextCharacter = 400;
      //nextCharacter = -1;
      var newCharacter = createCharacter();
      newCharacter.position.z = 7000;
      scene.add(newCharacter);
    }
  for (var i = 0; i < characters.length; i++) {
    // Character logic
    var currentCharacter = characters[i];
    if (currentCharacter.traits.poop >= 100)
    {
        console.log("pooped");
        currentCharacter.traits.poop = 0;
        /*
        var newPoop = createPoop();
        newPoop.position.x = currentCharacter.character.position.x;
        newPoop.position.y = currentCharacter.character.position.y;
        newPoop.position.z = currentCharacter.character.position.z;
        scene.add(newPoop);*/
    }
    currentCharacter.character.position.z -= 10;
  }
}

function interfaceMove(e) {
  var vector = new THREE.Vector2(
    (e.clientX / 1600) * 2 -1,
    -(e.clientY / 800) * 2 + 1
  );
  var raycaster = new THREE.Raycaster();
  raycaster.near = 1;
  raycaster.far = 100000;
  raycaster.setFromCamera(vector, camera);
  var newIntersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0 && intersects[0].object.name != "ground") {
      intersects[ 0 ].object.material.color.set( 0xbbbbbb );
  }
  intersects = newIntersects;
  if (intersects.length > 0 && intersects[0].object.name != "ground") {
    intersects[ 0 ].object.material.color.set( 0x0000ff );
  }
}

function interfaceClick(e) {
  var vector = new THREE.Vector2(
    (e.clientX / 1600) * 2 -1,
     -(e.clientY / 800) * 2 + 1
  );
  var raycaster = new THREE.Raycaster();
  raycaster.near = 1;
  raycaster.far = 100000;
  raycaster.setFromCamera(vector, camera);
  intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    var newObject, newObjectOffset;
    console.log(intersects[0].object.name);
    if (intersects[0].object.name.indexOf("interface") > -1)
    {
        selected = intersects[0].object.name;
        console.log("interface selected");
        return;
    }
    else if (intersects[0].object.name === "poop")
    {
        console.log("removed poop");
        scene.remove(intersects[0].object.parent);
        money -= 10;
        return;
    }
    else if (intersects[0].object.name === "character")
    {
        console.log("Hipster info");
        return;
    }
	else if (intersects[0].object.name != "ground")
	{
		return;
	}
    else if (selected === "interface-addCounter")
    {
        newObjectOffset = 300;
        newObject = createCounter();
    }
    else if (selected === "interface-addTable")
    {
        newObjectOffset = 300;
        newObject = createTable();
    }
    else if (selected === "interface-addBathroom")
    {
        newObjectOffset = 150;
        newObject = createBathroom();
    }
    else if (selected === "interface-addDecor")
    {
        newObjectOffset = 350;
        newObject = createDecor();
    }
    else if (selected === "interface-addWifi")
    {
      wifi += 5;
      return;
    }
    else if (selected === "interface-addScent")
    {
      scent += 10;
      return;
    }
    else
    {
        console.log("Nothing clicked");
        return;
    }
    newObject.position.x = intersects[0].point.x;
    newObject.position.y = intersects[0].point.y + newObjectOffset;
    newObject.position.z = intersects[0].point.z;
    //newCounter.position.set(new THREE.Vector3(intersects[0].point.x,intersects[0].point.y - 300,intersects[0].point.z));
    scene.add(newObject);
  }
}

function createCounter() {
  var counterWidth = 1000;
  var counterHeight = 600;
  var counterDepth = 200;
  var counterMaterial = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
  var counter = new THREE.Mesh(new THREE.BoxGeometry(counterWidth, counterHeight, counterDepth), counterMaterial);
  counter.name = "counter";
  return counter;
}

function createTable() {
  var width = 600;
  var height = 600;
  var depth = 600;
  var material = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
  var table = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  table.name = "table";
  return table;
}

function createBathroom() {
  var width = 600;
  var height = 300;
  var depth = 600;
  var material = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
  var bathroom = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  bathroom.name = "bathroom";
  return bathroom;
}

function createDecor() {
  var width = 100;
  var height = 700;
  var depth = 100;
  var material = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
  var bathroom = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  bathroom.name = "decor";
  return bathroom;
}

function createPoop() {
  var innerRadius = 100;
  var outerRadius = 150;
  var segments = 10;
  var material = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
  var poopBottomLayer = new THREE.Mesh(new THREE.RingGeometry(innerRadius * 3, outerRadius * 3, segments), material);
  var poopMiddleLayer = new THREE.Mesh(new THREE.RingGeometry(innerRadius * 2, outerRadius * 2, segments), material);
  var poopTopLayer = new THREE.Mesh(new THREE.RingGeometry(innerRadius, outerRadius, segments), material);
  var poop = new THREE.Object3D();
  poopMiddleLayer.y = -10;
  poopTopLayer.y = -20;
  poopBottomLayer.name = "poop";
  poopMiddleLayer.name = "poop";
  poopTopLayer.name = "poop";
  poop.add(poopBottomLayer);
  poop.add(poopMiddleLayer);
  poop.add(poopTopLayer);
  poop.name = "poop";
  return poop;
}

function createInterface(interface) {
  if (interface === "addCounter")
  {
      url = "textures/interface-add-counter.png";
  }
  else if (interface === "addTable")
  {
      url = "textures/interface-add-table.png";
  }
  else if (interface === "addBathroom")
  {
      url = "textures/interface-add-bathroom.png";
  }
  else if (interface === "addDecor")
  {
      url = "textures/interface-add-decor.png";
  }
  else if (interface === "addWifi")
  {
      url = "textures/interface-add-wifi.png";
  }
  else if (interface === "addScent")
  {
      url = "textures/interface-add-scent.png";
  }
  var map = THREE.ImageUtils.loadTexture(url);
  var material = new THREE.SpriteMaterial({map:map,useScreenCoordinates:true,color:0xffffff,fog:true});
  var sprite = new THREE.Sprite(material);
  sprite.position.x = -5600;
  sprite.position.y = 6100 + (50 * interfaceElements);
  sprite.position.z = 1000 + (300 * interfaceElements);
  sprite.scale.set(128 - (2 * interfaceElements), 128 - (2 * interfaceElements), 1.0);
  sprite.name = "interface-" + interface;
  interfaceElements++;
  return sprite;
}

function createCharacter() {
  // joints
  var character, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle;
  var leftShoulder, rightShoulder, leftBrachialis, rightBrachialis, leftWrist, rightWrist;
  var neckJoint, headJoint;
  // muscles
  var stomach, leftThigh, rightThigh, leftCalf, rightCalf, leftFoot, rightFoot;
  var chest, leftBicep, rightBicep, leftForearm, rightForearm, leftHand, rightHand;
  var neck, head;

  // traits
  var traits = {
    thirst:100,
    poop:100,
    pain:100,
    tackiness:100,
    techsavv:100,
    pompousness:100
  };

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

  // Robot definitions
  var robotBaseMaterial = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
  var robotForearmMaterial = new THREE.MeshPhongMaterial( { color: 0xF4C154, specular: 0xF4C154, shininess: 100 } );
  var robotUpperArmMaterial = new THREE.MeshPhongMaterial( { color: 0x95E4FB, specular: 0x95E4FB, shininess: 100 } );
  var robotBodyMaterial = new THREE.MeshPhongMaterial( { color: 0x279933, specular: 0x279933, shininess: 100 } );
  var coneMaterial = new THREE.MeshPhongMaterial({color:0x777777, specular: 0x297382, shininess:50});
  var bulbMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.25});

  character = new THREE.Object3D();
  // Body proportions
  var material = new THREE.MeshPhongMaterial( { color: 0x883333, specular: 0x279933, shininess: 100 } );
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
  character.add(stomach);

  character.position.x = 0;
  character.position.y = 0;
  character.position.z = 0;
  character.name = "character";
  characters.push({character:character,traits:traits});
  return character;
}

function createGround() {
  var groundTexture = THREE.ImageUtils.loadTexture("textures/ground.jpg");
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(256, 256);
  var groundMaterial = new THREE.MeshBasicMaterial({
    map: groundTexture
  });

  var ground = new THREE.Mesh(new THREE.PlaneGeometry(25000, 25000), groundMaterial);
  ground.position.x = 3000;
  ground.position.y = -500;
  ground.position.z = -2500;
  ground.rotation.x = -Math.PI/2;
  ground.name = "ground";
  return ground;
}

function initScene(scene) {
  // LIGHTS
  var ambientLight = new THREE.AmbientLight( 0x222222 );
  var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
  light.position.set( 200, 400, 500 );
  /*var textMoney = new THREE.Mesh(new THREE.TextGeometry(money), groundMaterial);
  scene.add(textMoney);*/
  scene.add(ambientLight);
  scene.add(light);
}

init();
