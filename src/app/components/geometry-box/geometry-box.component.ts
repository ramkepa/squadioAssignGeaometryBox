import {
  Component, ElementRef, ViewChild, AfterViewInit, NgZone
} from '@angular/core';
import * as THREE  from 'three';  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

@Component({
  selector: 'app-geometry-box',
  templateUrl: './geometry-box.component.html',
  styleUrls: ['./geometry-box.component.scss']
})
export class GeometryBoxComponent {
   @ViewChild('canvas') canvasRef!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  box!: THREE.Mesh;
  rotate = true;
  orbitControls!:any;
  width = 1;
  height = 1;
  depth = 1;
  materialType = 'matte';
  sharpness = 1;
  textures: (THREE.Texture | null)[] = new Array(6).fill(null);

  faces = Array(6).fill(0);

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.loadScene();
    this.animate();
  }

  loadScene() {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 3;

     this.orbitControls = new OrbitControls(this.camera, canvas);
    this.orbitControls.minPolarAngle = 0;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.enableDamping = true;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
     this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
     this.renderer.toneMappingExposure = this.sharpness; 


    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5 * Math.PI));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    this.createBox();
  }

  createBox() {
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);

    const materials = this.textures.map((tex) =>
      new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: this.materialType === 'matte' ? 1 : 0.1,
        metalness: this.materialType === 'glossy' ? 0.2 : 0,
        clearcoat: this.materialType === 'glossy' ? 1.0 : 0,            
        clearcoatRoughness: this.materialType === 'glossy' ? 0.1 : 0.5
      
      })
    );

   
    if (this.box) {
  this.scene.remove(this.box);
  this.box.geometry.dispose();

  const material = this.box.material;
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
}

    this.box = new THREE.Mesh(geometry, materials);
    this.scene.add(this.box);
  }

  updateBox() {
    this.createBox();
  }

  updateMaterial() {
    this.createBox();
  }

  onTextureChange(event: Event, faceIndex: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const texture = new THREE.TextureLoader().load(reader.result as string, () => {
        texture.colorSpace = THREE.SRGBColorSpace,
        this.textures[faceIndex] = texture;
        this.createBox();
      });
    };
    reader.readAsDataURL(file);
  }
   



  toggleRotation() {
    this.rotate = !this.rotate;
  }

  animate() {
    this.ngZone.runOutsideAngular(() => {
      const tick = () => {
        if (this.rotate && this.box) {
          this.box.rotation.y += 0.01;
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(tick);
      };
      tick();
    });
  }
}
