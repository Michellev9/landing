import { Component, HostListener, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { multiFactor } from 'firebase/auth';
import { RecaptchaVerifier, PhoneAuthProvider,PhoneMultiFactorGenerator,MultiFactorResolver, getMultiFactorResolver, sendEmailVerification} from 'firebase/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  regEmail: string = '';
  regPassword: string = '';
  confirmPassword: string = '';

  isLoading: boolean = false;
  isRegisterMode: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

otpCode: string = '';
showOtpInput: boolean = false;
verificationId: string = '';
resolver!: MultiFactorResolver;
otpError: string = '';
otpSuccess: string = '';
recaptchaVerifier!: RecaptchaVerifier;
showPhoneModal: boolean = false;
phoneNumber: string = '';
mfaVerificationId: string = '';

  mouseX = 0;
  mouseY = 0;

  private targetScrollY = 0;
  private currentScrollY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private animationFrameId: number | any = 0;

    floatingItems = [
    { icon: '⭐', baseTop: 52, currentTop: 52, left: 15, size: '2.2rem', delay: '0s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.05 },
    { icon: '🍎', baseTop: 25, currentTop: 25, left: 80, size: '3rem', delay: '1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.12 },
    { icon: '🍌', baseTop: 65, currentTop: 65, left: 10, size: '3.5rem', delay: '2s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.15 },
    { icon: '🥕', baseTop: 75, currentTop: 75, left: 85, size: '3.2rem', delay: '0.5s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.08 },
    { icon: '⭐', baseTop: 80, currentTop: 80, left: 45, size: '1.8rem', delay: '1.5s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.06 },
    { icon: '🥦', baseTop: 35, currentTop: 35, left: 40, size: '2.5rem', delay: '2.5s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.11 },
    { icon: '🍊', baseTop: 45, currentTop: 45, left: 8, size: '2.8rem', delay: '0.8s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.13 },
    { icon: '⭐', baseTop: 90, currentTop: 90, left: 75, size: '2rem', delay: '1.2s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.07 },
    { icon: '🍇', baseTop: 15, currentTop: 15, left: 55, size: '2.6rem', delay: '0.3s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.14 },
    { icon: '🍓', baseTop: 20, currentTop: 20, left: 20, size: '2.4rem', delay: '1.8s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.1 },
    { icon: '🍒', baseTop: 50, currentTop: 50, left: 92, size: '2.1rem', delay: '2.2s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.09 },
    { icon: '🍍', baseTop: 5, currentTop: 5, left: 65, size: '3.8rem', delay: '1.1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.16 },
    { icon: '🥝', baseTop: 55, currentTop: 55, left: 30, size: '2.3rem', delay: '0.7s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.12 },
    { icon: '🍐', baseTop: 88, currentTop: 88, left: 15, size: '2.7rem', delay: '1.4s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.11 },
    { icon: '🥑', baseTop: 38, currentTop: 38, left: 68, size: '2.9rem', delay: '2.8s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.13 },
    { icon: '🍉', baseTop: 95, currentTop: 95, left: 42, size: '4rem', delay: '2.1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.18 },
    { icon: '🍋', baseTop: 8, currentTop: 8, left: 42, size: '2.2rem', delay: '0.1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.09 },
    { icon: '⭐', baseTop: 12, currentTop: 12, left: 15, size: '2.2rem', delay: '0s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.05 },
    
  ];

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef, private router: Router, private auth: Auth, private firestore: Firestore) {}


  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.targetScrollY = window.scrollY;
      this.currentScrollY = this.targetScrollY;
      this.targetMouseX = window.innerWidth / 2;
      this.targetMouseY = window.innerHeight / 2;

      this.ngZone.runOutsideAngular(() => {
        this.animationLoop();
      });
    }

    this.recaptchaVerifier = new RecaptchaVerifier(
    this.auth,
    'recaptcha-container',
    {
      size: 'invisible'
    }
  );
  }

  ngOnDestroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }

    toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

async login() {
  this.errorMessage = '';
  this.otpError = '';
  this.isLoading = true;

  try {
    await signInWithEmailAndPassword(
      this.auth,
      this.email,
      this.password
    );

    this.router.navigate(['/admin/dashboard']);

  } catch (err: any) {

    if (err.code === 'auth/multi-factor-auth-required') {

      console.log('✅ MFA detectado (Email)');

      this.resolver = getMultiFactorResolver(this.auth, err);

      if (!this.resolver.hints || this.resolver.hints.length === 0) {
        this.errorMessage = 'No hay factores MFA registrados';
        return;
      }

      const phoneInfo = this.resolver.hints[0];
      const phoneAuthProvider = new PhoneAuthProvider(this.auth);

      try {

        this.verificationId = await phoneAuthProvider.verifyPhoneNumber(
          {
            multiFactorHint: phoneInfo,
            session: this.resolver.session
          },
          this.recaptchaVerifier
        );

        console.log('✅ SMS enviado');

        this.showOtpInput = true; // ✅ SOLO ESTA

      } catch (mfaError) {
        console.error('❌ Error enviando SMS:', mfaError);
        this.errorMessage = 'No se pudo enviar el código';
      }

    } else {
      console.error(err);

      if (err.code === 'auth/user-not-found') {
        this.errorMessage = 'Usuario no registrado';
      } else if (err.code === 'auth/wrong-password') {
        this.errorMessage = 'Contraseña incorrecta';
      } else {
        this.errorMessage = 'Error al iniciar sesión';
      }
    }

  } finally {
    this.isLoading = false;
  }
}

async verifyOtp() {
  this.otpError = '';
  this.otpSuccess = '';

  if (!this.otpCode) {
    this.otpError = 'Ingresa el código';
    return;
  }

  try {
    const verificationId = this.mfaVerificationId || this.verificationId;

    const cred = PhoneAuthProvider.credential(
      verificationId,
      this.otpCode
    );

    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(cred);

    // 🔥 ENROLL (cuando viene del registro)
    if (this.mfaVerificationId) {
      const user = this.auth.currentUser;
      if (!user) return;

      await multiFactor(user).enroll(
        multiFactorAssertion,
        'Teléfono'
      );

      // limpiar estados
      this.mfaVerificationId = '';
      this.showOtpInput = false;
      this.otpCode = '';

      this.otpSuccess = '✅ MFA activado correctamente';

      return;
    }

    // 🔥 LOGIN
    await this.resolver.resolveSignIn(multiFactorAssertion);

    this.showOtpInput = false;
    this.otpCode = '';

    this.otpSuccess = '✅ Código verificado correctamente. Bienvenido!';

    // redirigir después de mostrar el mensaje
    setTimeout(() => {
      this.otpSuccess = '';
      this.router.navigate(['/admin/dashboard']);
    }, 1500);

  } catch (error) {
    this.otpError = 'Código incorrecto o expirado';
  }
}


async loginWithGoogle() {
  this.errorMessage = '';
  this.isLoading = true;

  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);

    this.router.navigate(['/admin/dashboard']);

  } catch (err: any) {

    if (err.code === 'auth/multi-factor-auth-required') {

      console.log('✅ MFA detectado (Google)');

      this.resolver = getMultiFactorResolver(this.auth, err);

      if (!this.resolver.hints || this.resolver.hints.length === 0) {
        this.errorMessage = 'No hay factores MFA registrados';
        return;
      }

      const phoneInfo = this.resolver.hints[0];
      const phoneAuthProvider = new PhoneAuthProvider(this.auth);

      try {

        this.verificationId = await phoneAuthProvider.verifyPhoneNumber(
          {
            multiFactorHint: phoneInfo,
            session: this.resolver.session
          },
          this.recaptchaVerifier
        );

        console.log('✅ SMS enviado');

        this.showOtpInput = true;

      } catch (mfaError) {
        console.error('❌ Error MFA:', mfaError);
        this.errorMessage = 'No se pudo enviar el código';
      }

    } else if (err.code === 'auth/popup-closed-by-user') {
      this.errorMessage = 'Cancelaste el inicio con Google';
    } else {
      console.error(err);
      this.errorMessage = 'Error con Google';
    }

  } finally {
    this.isLoading = false;
  }
}


getInputClass(input: any) {
  if (!input) return '';

  if (input.invalid && (input.touched || input.dirty)) {
    return 'input-error';
  }

  if (input.valid && (input.touched || input.dirty)) {
    return 'input-success';
  }

  return '';
}



async register() {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.regEmail || !this.regPassword || !this.confirmPassword) {
    this.errorMessage = 'Completa los campos';
    return;
  }

  if (this.regPassword !== this.confirmPassword) {
    this.errorMessage = 'Las contraseñas no coinciden';
    return;
  }

  this.isLoading = true;

  try {

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      this.regEmail,
      this.regPassword
    );

    await addDoc(collection(this.firestore, 'usuariosWeb'), {
      uid: userCredential.user.uid,
      email: this.regEmail,
      rol: 'usuario',
      modulo: 'landing',
      fecha: new Date()
    });

    await sendEmailVerification(userCredential.user);

    this.successMessage = 'Cuenta creada. Verifica tu correo';

    setTimeout(() => {
      this.showPhoneModal = true;
    }, 1500);

  } catch (error: any) {
    this.errorMessage = 'Error al registrarse';
  } finally {
    this.isLoading = false;
  }
}


showMessage(message: string, type: 'success' | 'error') {
  this.errorMessage = 'Correo inválido';
this.successMessage = ''; 

setTimeout(() => {
  this.errorMessage = '';
  this.successMessage = '';
}, 1000);
}

  

  @HostListener('window:scroll')
  onScroll() {
    if (typeof window !== 'undefined') {
      this.targetScrollY = window.scrollY;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.targetMouseX = e.clientX;
    this.targetMouseY = e.clientY;
  }

  animationLoop() {
    let needsUpdate = false;

    // Smooth Scroll Y LERP
    if (Math.abs(this.targetScrollY - this.currentScrollY) > 0.1) {
      this.currentScrollY += (this.targetScrollY - this.currentScrollY) * 0.08;
      needsUpdate = true;
    } else {
      this.currentScrollY = this.targetScrollY;
    }

    // Smooth Background Movement LERP
    const targetBgMouseX = this.targetMouseX - window.innerWidth / 2;
    const targetBgMouseY = this.targetMouseY - window.innerHeight / 2;

    if (Math.abs(targetBgMouseX - this.mouseX) > 0.1) {
      this.mouseX += (targetBgMouseX - this.mouseX) * 0.1;
      needsUpdate = true;
    }
    if (Math.abs(targetBgMouseY - this.mouseY) > 0.1) {
      this.mouseY += (targetBgMouseY - this.mouseY) * 0.1;
      needsUpdate = true;
    }

    // Floating Items Parallax & Repel LERP
    const repelRadius = 180;
    this.floatingItems.forEach(item => {
      // 1. Scroll Parallax
      let newTop = item.baseTop - (this.currentScrollY * item.parallaxSpeed);
      const range = 140; // -20 to 120
      let offset = (newTop + 20) % range;
      if (offset < 0) offset += range;

      const nextTop = offset - 20;
      if (Math.abs(item.currentTop - nextTop) > 0.01) {
        item.currentTop = nextTop;
        needsUpdate = true;
      }

      // 2. Mouse Repel
      if (!item.interactive) return;

      const itemX = (window.innerWidth * item.left) / 100;
      const itemY = (window.innerHeight * item.currentTop) / 100;

      const dx = itemX - this.targetMouseX;
      const dy = itemY - this.targetMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let targetTransformX = 0;
      let targetTransformY = 0;

      if (distance < repelRadius) {
        const force = (repelRadius - distance) / repelRadius;
        targetTransformX = (dx / distance) * force * 60;
        targetTransformY = (dy / distance) * force * 60;
      }

      if (Math.abs(targetTransformX - item.transformX) > 0.1 || Math.abs(targetTransformY - item.transformY) > 0.1) {
        item.transformX += (targetTransformX - item.transformX) * 0.15;
        item.transformY += (targetTransformY - item.transformY) * 0.15;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      this.cdr.detectChanges();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
  }

  scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const yOffset = -110; // altura del header
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}

  private scroll(section: string) {
  const element = document.getElementById(section);
  console.log(`Buscando #${section} →`, element);

  if (element) {
    console.log('Haciendo scrollIntoView...');
    
    // Opción A: alineación al inicio (más común)
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'     // lleva la sección justo al tope de la ventana
    });

    // Opción B: si el header tapa, prueba con 'nearest' o ajusta manualmente
    // element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    console.warn(`No encontrado #${section}`);
  }
}

menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
  const menu = document.querySelector('.menu');
  menu?.classList.toggle('active');
}

}