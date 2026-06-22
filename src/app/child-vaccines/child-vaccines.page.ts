// child-vaccines.page.ts
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VaccineService } from '../vaccine/vaccine';
import { ChildService } from '../services/child';
import { AuthenticationService } from '../authentication/authentication';
import { Child, VaccineTaken } from '../authentication/child.model';
import { Vaccine } from '../vaccine/vaccine.model';
import { Observable, combineLatest, map, of, switchMap, firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-child-vaccines',
  templateUrl: './child-vaccines.page.html',
  styleUrls: ['./child-vaccines.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ChildVaccinesPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private childService = inject(ChildService);
  private vaccineService = inject(VaccineService);
  private authService = inject(AuthenticationService);

  // Signals para estado
  selectedChildId = signal<string>('');
  children = signal<Child[]>([]);
  selectedChild = signal<Child | null>(null);
  allVaccines = signal<Vaccine[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed: Vacinas tomadas pela criança (com detalhes)
  vaccinesTaken = computed(() => {
    const child = this.selectedChild();
    if (!child) return [];
    
    // Enriquecer com detalhes da vacina
    return child.vaccines_taken.map(vt => {
      const vaccine = this.allVaccines().find(v => v.id === vt.vaccineId);
      return {
        ...vt,
        vaccineName: vaccine?.name || 'Unknown Vaccine',
        vaccineDescription: vaccine?.description || 'No description'
      };
    });
  });

  // Computed: Vacinas disponíveis para a idade da criança (não tomadas)
  vaccinesByAge = computed(() => {
    const child = this.selectedChild();
    const allVaccines = this.allVaccines();
    
    if (!child || allVaccines.length === 0) return [];

    // IDs das vacinas já tomadas
    const takenVaccineIds = (child.vaccines_taken || []).map(vt => vt.vaccineId);
    
    return allVaccines
      .filter(vaccine => {
        // Verificar se a vacina é para a faixa etária da criança
        const [minAge, maxAge] = vaccine.age_group;
        const childAge = child.age;
        const isInAgeGroup = childAge >= minAge && childAge <= maxAge;
        
        // Verificar se a criança já tomou essa vacina
        const isTaken = takenVaccineIds.includes(vaccine.id);
        
        return isInAgeGroup && !isTaken;
      })
      .map(vaccine => {
        // Verificar se a vacina está disponível (data atual >= data da vacina)
        const vaccineDate = vaccine.date ? new Date(vaccine.date) : null;
        const today = new Date();
        const isAvailable = vaccineDate ? vaccineDate <= today : false;
        
        return {
          ...vaccine,
          isAvailable,
          status: isAvailable ? 'available' : 'upcoming'
        };
      });
  });

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Buscar usuário atual
      const user = await firstValueFrom(this.authService.getUser());
      console.log("User found")
      console.log(user)
      if (!user) {
        this.error.set('User not authenticated');
        this.isLoading.set(false);
        return;
      }

      // Buscar todas as vacinas disponíveis
      this.vaccineService.getVaccineList().subscribe({
        next: (vaccines) => {
          this.allVaccines.set(vaccines);
        },
        error: (err) => {
          console.error('Error loading vaccines:', err);
          this.error.set('Failed to load vaccine list');
        }
      });

      // Buscar crianças do usuário
      console.log("buscando crianças")
      this.childService.getChildrenByUser(user.uid).subscribe({
        next: (children: Child[]) => {
          this.children.set(children);
          this.isLoading.set(false);
          console.log("Ele acha alguma criança?")
          console.log(children)
          // Selecionar primeira criança por padrão
          if (children.length > 0 && !this.selectedChildId()) {
            this.selectChild(children[0].id);
            console.log("Ele escolhe uma criança?")
          }
        },
        error: (err: any) => {
          console.error('Error loading children:', err);
          this.error.set('Failed to load children');
          this.isLoading.set(false);
        }
      });

    } catch (err) {
      console.error('Error loading data:', err);
      this.error.set('Failed to load data');
      this.isLoading.set(false);
    }
  }

  selectChild(childId: string) {
    this.selectedChildId.set(childId);
    const child = this.children().find(c => c.id === childId);
    this.selectedChild.set(child || null);
  }

  // Obter cor do status da vacina
  getVaccineStatusColor(vaccine: any): string {
    if (vaccine.isAvailable) {
      return 'danger'; // Vermelho - Disponível, mas não tomou
    } else {
      return 'warning'; // Amarelo - Disponível futuramente
    }
  }

  // Obter ícone do status
  getVaccineStatusIcon(vaccine: any): string {
    if (vaccine.isAvailable) {
      return 'alert-circle-outline';
    } else {
      return 'time-outline';
    }
  }

  // Obter texto do status
  getVaccineStatusText(vaccine: any): string {
    if (vaccine.isAvailable) {
      return 'Available - Not taken yet!';
    } else {
      return 'Available soon';
    }
  }

  navigateBack() {
    this.router.navigate(['/tabs/authentication']);
  }
}