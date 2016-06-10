
/*
	Basic Setup
*/
//(function(){



//__________ Variables

var main_color = 0xffffff;

var canvas_height, canvas_width;
var renderer;
var scene, controls, camera , effect;

var controls = {
  type : 'orbit',
  orbit :null,
  vr : null,
  effect : null,
  enableButton : createVREnabler(),
  disableButton : createVRDisabler(),
}

//__________ Create VR Button

function createVREnabler () {
  var enable_vr_button = document.createElement('button');
      enable_vr_button.className  = 'switch_to_vr';
      enable_vr_button.addEventListener('click',enableVR);
      enable_vr_button.innerHTML = 'Enable VR';
      document.body.appendChild(enable_vr_button);

      return enable_vr_button;
}

function createVRDisabler () {
  var disable_vr_button = document.createElement('button');
      disable_vr_button.className = 'switch_to_orbit hide';
      disable_vr_button.addEventListener('click',disableVR);
      disable_vr_button.innerHTML = 'Disable VR';
      document.body.appendChild(disable_vr_button);

      return disable_vr_button;
}

//__________ Make Window Fullscreen
function enableFullScreenMode(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

//__________ Disable Window Fullscreen
function disableFullScreenMode() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}



function enableVR() {
  console.log('vr enabled');
  controls.orbit.enabled = false;
  controls.vr.connect();
  controls.type ='vr';
  controls.enableButton.classList.add('hide');
  controls.disableButton.classList.remove('hide');
  enableFullScreenMode(document.documentElement);
}

function disableVR() {
  console.log('vr disabled');
  controls.orbit.enabled = true;
  controls.vr.disconnect();
  controls.type ='orbit';
  controls.enableButton.classList.remove('hide');
  controls.disableButton.classList.add('hide');
  renderer.setSize( canvas_width, canvas_height );
  //Note: No argument is needed to disable fullscreen
  disableFullScreenMode();
}



function init(){
  
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  //__________ scene
  scene = new THREE.Scene();

  //__________ camera
  camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(0,50,200);
  camera.lookAt(new THREE.Vector3(0,50,0));
  scene.add(camera);
  //__________ renderer

  renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(main_color,1);

  document.body.appendChild( renderer.domElement );

  //__________ Controls


  //____ Orbit

  controls.orbit = new THREE.OrbitControls( camera );
  controls.orbit.damping = 0.2;
  //controls.orbit.maxPolarAngle = Math.PI/2;
  //controls.orbit.minPolarAngle = 1;
  //controls.orbit.minDistance = 100;
  //controls.orbit.maxDistance = 220;

  //____ VR

  controls.vr = new THREE.DeviceOrientationControls(camera);
      effect = new THREE.StereoEffect(renderer);

      effect.focalLength = 70;
      effect.eyeSeparation = 2;
      effect.setSize(canvas_width, canvas_height);

  


  //__________ resize

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas_width, canvas_height );
    effect.setSize(canvas_width, canvas_height);
  }  


  //__________ light

  var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set( 0, 100, 100 );
      spotLight.intensity = 1;
      spotLight.castShadow = true;
      scene.add(spotLight);

  //__________ cubes

  var base_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  var box = new THREE.BoxGeometry( 5, 5, 5 );

  for ( var i = 0; i < 50; i ++ ) {
    var mesh = new THREE.Mesh( box , base_material );
        mesh.position.x = ( Math.random() - 0.5 ) * 500;
        mesh.position.y = ( Math.random() - 0.5 ) * 500;
        mesh.position.z = ( Math.random() - 0.5 ) * 500;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );
  }

}//end of init;



//__________ render
var render = function () { 
  requestAnimationFrame( render ); 
  animation();

  if(controls.type != 'vr'){
    controls.orbit.update();
    renderer.render(scene, camera);
  }else{
    controls.vr.update();
    effect.render(scene, camera);
  }

 
};

//__________ animation

function animation(){
  // scene.rotation.y  -= .0005;
};

//__________

init();
render();



//}()); //__eof

