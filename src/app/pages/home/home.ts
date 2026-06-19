import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { DirimidoService } from '../../core/services/dirimido';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DirimidoResponse, MagistradoResponse } from '../../core/interfaces/dirimido';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private authService = inject(AuthService);
  private dirimidoService = inject(DirimidoService);
  private fb = inject(FormBuilder);

  /**
   * Estados Reactivos mediante signals
   */
  dirimidos = signal<DirimidoResponse[]>([]);
  magistrados = signal<MagistradoResponse[]>([]);
  showFormModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  selectedIdDirimido: number | null = null;
  // Almacenamiento temporal de IDs recuperados por la búsqueda del expediente
  idMagistradoPresidenteTmp: number | null = null;
  idMagistradoRelatorTmp: number | null = null;

  // Formulario Reactivo principal
  dirimidoForm = this.fb.group({
    buscarExpediente: ['', [Validators.required]],
    numeroExpediente: [{ value: '', disabled: false }, [Validators.required]],
    numeroResolucion: [{ value: '', disabled: false }, [Validators.required]],
    referencia: [{ value: '', disabled: false }, [Validators.required]],
    magistradoRelator: [{ value: '', disabled: false }, [Validators.required]],
    magistradoCoRelator: [{ value: '', disabled: false }, [Validators.required]],
    dirimidoAFavor: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadTableData();
    this.loadMagistradosCombobox();
  }

  loadTableData(): void {
    this.dirimidoService.getDirimidos().subscribe(data => this.dirimidos.set(data));
  }

  loadMagistradosCombobox(): void {
    this.dirimidoService.getMagistrados().subscribe(data => this.magistrados.set(data));
  }

  buscarExpediente(): void {
    // Obtenemos el número escrito en el primer campo
    const idExp = Number(this.dirimidoForm.get('buscarExpediente')?.value);
    //console.log('Buscando expediente ID:', idExp); // Monitoreo en consola

    if (!idExp) {
      alert('Por favor, introduzca un número de expediente válido.');
      return;
    }

    //const idExp = Number(this.dirimidoForm.value.buscarExpediente);
    //if (!idExp) return;

    this.dirimidoService.getExpedienteById(idExp).subscribe({
      next: (res) => {        
        console.log('Datos recibidos del servidor:', res);
        //this.idMagistradoPresidenteTmp = res.idMagistrado;
        //this.idMagistradoRelatorTmp = res.idMagistrado;
        // 1. Asignamos los valores con setValue
        this.dirimidoForm.get('numeroExpediente')?.setValue(res.numeroExpediente);
        this.dirimidoForm.get('numeroResolucion')?.setValue(res.numero);
        this.dirimidoForm.get('referencia')?.setValue(res.referencia);
        this.dirimidoForm.get('magistradoRelator')?.setValue(res.magistradoRelator);
        this.dirimidoForm.get('magistradoCoRelator')?.setValue(res.magistradoCorrelator);

        // 2. SOLUCIÓN AL PROBLEMA VISUAL: Forzar a Angular a redibujar los inputs bloqueados
        this.dirimidoForm.get('numeroExpediente')?.updateValueAndValidity();
        this.dirimidoForm.get('numeroResolucion')?.updateValueAndValidity();
        this.dirimidoForm.get('referencia')?.updateValueAndValidity();
        this.dirimidoForm.get('magistradoRelator')?.updateValueAndValidity();
        this.dirimidoForm.get('magistradoCoRelator')?.updateValueAndValidity();

        // 3. Alternativa fulminante (Opcional si lo anterior no basta):
        // Deshabilitar y volver a habilitar los controles resetea el binding visual de Bootstrap
        this.dirimidoForm.get('numeroExpediente')?.disable();
        this.dirimidoForm.get('numeroResolucion')?.disable();
        this.dirimidoForm.get('referencia')?.disable();
        this.dirimidoForm.get('magistradoRelator')?.disable();
        this.dirimidoForm.get('magistradoCoRelator')?.disable();
      },
      error: () => alert('Expediente no encontrado.')
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.dirimidoForm.reset();
    this.showFormModal.set(true);
  }

  openEditModal(item: DirimidoResponse): void {
    this.isEditMode.set(true);
    this.selectedIdDirimido = item.idDirimido;
    this.dirimidoForm.reset();
    
    // Al editar se cargan los datos directo del registro seleccionado
    this.dirimidoForm.patchValue({
      buscarExpediente: item.idExpediente.toString(),
      numeroExpediente: item.idExpediente.toString(),
      numeroResolucion: item.numero,
      magistradoRelator: item.nombreRelator.toString(),
      magistradoCoRelator: item.nombreFavor.toString()
    });
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
  }

  saveData(): void {
    if (this.dirimidoForm.invalid) return;

    const rawValues = this.dirimidoForm.getRawValue();
    const payload = {
      idExpediente: Number(rawValues.numeroExpediente),
      numero: rawValues.numeroResolucion!,
      idMagistradoPresidente: this.idMagistradoPresidenteTmp || 0,
      idMagistradoRelator: this.idMagistradoRelatorTmp || 0,
      idMagistradoDirimeFavor: Number(rawValues.dirimidoAFavor)
    };

    if (this.isEditMode()) {
      this.dirimidoService.updateDirimido(this.selectedIdDirimido!, payload).subscribe(() => {
        this.closeFormModal();
        this.loadTableData();
      });
    } else {
      this.dirimidoService.saveDirimido(payload).subscribe(() => {
        this.closeFormModal();
        this.loadTableData();
      });
    }
  }

  openDeleteModal(id: number): void {
    this.selectedIdDirimido = id;
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    if (this.selectedIdDirimido) {
      this.dirimidoService.deleteDirimido(this.selectedIdDirimido).subscribe(() => {
        this.closeDeleteModal();
        this.loadTableData();
      });
    }
  }

  onLogout(event: Event): void{
    event.preventDefault();
    this.authService.logout();
  }
}
