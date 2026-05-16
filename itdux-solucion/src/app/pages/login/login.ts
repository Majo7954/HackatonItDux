import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  errorMsg = signal('');

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMsg.set('Completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { error } = await this.auth.login(this.email, this.password);

    this.loading.set(false);

    if (error) {
      this.errorMsg.set('Correo o contraseña incorrectos.');
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
